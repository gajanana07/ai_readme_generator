import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Copy as CopyIcon,
  Menu as MenuIcon,
  X as CloseIcon,
} from "lucide-react";
import "../index.css";
import { useNavigate } from "react-router-dom";

const DashboardPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [readmeContent, setReadmeContent] = useState("");
  const [viewMode, setViewMode] = useState("preview");
  const [chatInput, setChatInput] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 👈 for mobile sidebar

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await apiClient.get("/user/profile");
        if (userProfile.data && userProfile.data.username) {
          setUser(userProfile.data);
          try {
            const userRepos = await apiClient.get("/github/repos");
            setRepos(userRepos.data || []);
          } catch (repoError) {
            console.error("Failed to fetch repositories:", repoError);
            setRepos([]);
          }
          setLoading(false);
        } else {
          console.error("Invalid user data received");
          setAuthError(true);
          setTimeout(() => onLogout(), 2000);
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        setAuthError(true);
        if (error.response?.status === 401 || error.response?.status === 403) {
          setTimeout(() => onLogout(), 2000);
        } else {
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      }
    };
    fetchData();
  }, [onLogout]);

  // Prevent going back
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name && repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    setReadmeContent("");
    setViewMode("preview");
    setIsSidebarOpen(false); // 👈 auto close sidebar on mobile after selecting
  };

  const handleGenerateReadme = async () => {
    if (!selectedRepo) return;
    setIsAnalyzing(true);
    setReadmeContent("");
    try {
      const response = await apiClient.post("/github/analyze", {
        repoFullName: selectedRepo.full_name,
      });
      if (response.data && response.data.readme) {
        setReadmeContent(response.data.readme);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to generate README:", error);
      let errorMessage = "An error occurred during README generation.";
      if (error.response?.status === 401) {
        errorMessage = "Authentication expired. Please log in again.";
        setTimeout(() => onLogout(), 2000);
      } else if (error.response?.status === 404) {
        errorMessage = "Repository not found or not accessible.";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }
      alert(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    setIsRefining(true);
    const originalInput = chatInput;
    try {
      const response = await apiClient.post("/ai/refine", {
        currentReadme: readmeContent,
        userRequest: chatInput.trim(),
      });
      if (response.data && response.data.readme) {
        setReadmeContent(response.data.readme);
        setChatInput("");
        alert("README updated successfully!");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to refine README:", error);
      setChatInput(originalInput);
      let errorMessage = "An error occurred during refinement.";
      if (error.response?.status === 401) {
        errorMessage = "Authentication expired. Please log in again.";
        setTimeout(() => onLogout(), 2000);
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      }
      alert(errorMessage);
    } finally {
      setIsRefining(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(readmeContent);
      alert("README content copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      const textArea = document.createElement("textarea");
      textArea.value = readmeContent;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert("README content copied to clipboard!");
      } catch (fallbackError) {
        alert("Failed to copy to clipboard. Please select and copy manually.");
      }
      document.body.removeChild(textArea);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("videoPlayed");
    onLogout();
  };

  if (loading || authError || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-green-800 to-black">
        <div className="flex flex-col items-center space-y-4">
          {authError ? (
            <>
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                <div className="w-6 h-6 text-red-400">⚠</div>
              </div>
              <div className="text-white text-lg font-medium">
                Authentication failed
              </div>
              <div className="text-gray-400 text-sm text-center">
                {loading
                  ? "Redirecting to login..."
                  : "Please try logging in again"}
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-white text-lg font-medium">
                Loading dashboard...
              </div>
              <div className="text-gray-400 text-sm animate-pulse">
                Fetching your repositories...
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bg-gradient-to-b from-gray-900 via-green-800 to-black text-white font-sans overflow-x-hidden w-full min-h-screen">
      {/* NAVBAR */}
      <header className="mt-4 fixed top-0 left-0 z-50 w-full px-2">
        <nav className="mt-1 md:mt-4 p-3 bg-black/60 backdrop-blur-md rounded-3xl md:rounded-3xl shadow-lg border border-gray-800 transition-all duration-300">
          {/* Top row (mobile only): Logo + Welcome on left, Title center */}
          <div className="relative flex items-center justify-start md:hidden mb-3">
            {/* Left: Logo + Welcome */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-400 to-green-600 flex items-center justify-center shadow-inner">
                <img src="/logo.png" alt="Logo" className="w-7 h-7" />
              </div>
              <div>
                <div className="text-sm text-gray-300">Welcome!</div>
                <div className="font-semibold text-lg text-green-200">
                  {user.username}
                </div>
              </div>
            </div>

            {/* Center: Title */}
            <div className="ml-auto text-xl font-bold text-green-400 tracking-wide">
              AI README Generator
            </div>
          </div>

          {/* Desktop row + Mobile second row */}
          <div className="flex items-center justify-between">
            {/* Left: Logo + Welcome (desktop only) */}
            <div className="hidden md:flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-400 to-green-600 flex items-center justify-center shadow-inner">
                <img src="/logo.png" alt="Logo" className="w-7 h-7" />
              </div>
              <div>
                <div className="text-sm text-gray-300">Welcome!</div>
                <div className="font-semibold text-lg text-green-200">
                  {user.username}
                </div>
              </div>
            </div>

            {/* Center: Title (desktop only) */}
            <div className="hidden md:flex md:flex-1 justify-center text-2xl font-bold text-green-400 tracking-wide">
              AI README Generator
            </div>

            {/* Left (mobile only): Side panel button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="block md:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              <MenuIcon size={20} />
            </button>

            {/* Right: About Us + Logout */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/about")}
                className="px-4 py-2 rounded-md transition-transform duration-300 text-base hover:scale-125 active:scale-95"
              >
                About Us
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md transition-transform duration-300 text-base hover:scale-125 hover:text-red-600 active:scale-95"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="mt-32 p-4 md:p-8 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* SIDEBAR - DESKTOP */}
          <aside className="hidden md:block md:col-span-1">
            <SidebarContent
              repos={filteredRepos}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedRepo={selectedRepo}
              handleRepoSelect={handleRepoSelect}
            />
          </aside>

          {/* MAIN AREA */}
          <section className="mt-4 md:mt-0 md:col-span-3 bg-gray-900/50 backdrop-blur rounded-2xl p-4 md:p-6 shadow-lg border border-gray-800 flex flex-col min-h-[70vh]">
            {/* ... (Main content same as before) ... */}
            {selectedRepo ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-green-200">
                    {selectedRepo.name}
                  </h2>
                  <div className="flex items-center space-x-3">
                    {!readmeContent && !isAnalyzing && (
                      <button
                        onClick={handleGenerateReadme}
                        className="px-6 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black shadow-lg transition-all"
                      >
                        Generate README
                      </button>
                    )}
                    {isAnalyzing && (
                      <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-300">
                        <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">
                          AI analyzing...
                        </span>
                      </div>
                    )}
                    {readmeContent && (
                      <button
                        onClick={handleCopyToClipboard}
                        className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-gray-600 transition-all"
                        aria-label="Copy to clipboard"
                      >
                        <CopyIcon size={18} className="text-gray-300" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("preview")}
                      className={`px-3 py-1.5 font-medium rounded-t-lg z-10 ${
                        viewMode === "preview"
                          ? "border border-gray-800 border-b-0 bg-black/20 text-white"
                          : "border border-gray-800 bg-green-500 text-black hover:bg-green-600 rounded-b-lg rounded-t-lg"
                      }`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setViewMode("code")}
                      className={`px-3 py-1.5 font-medium rounded-t-lg z-10 ${
                        viewMode === "code"
                          ? "border border-gray-800 border-b-0 bg-black/20 text-white"
                          : "border border-gray-800 bg-green-500 text-black hover:bg-green-600 rounded-b-lg rounded-t-lg"
                      }`}
                    >
                      Code
                    </button>
                  </div>

                  <div className="p-4 rounded-b-lg border border-gray-800 bg-black/20 max-h-[50vh] md:h-[60vh] overflow-y-auto custom-scrollbar relative z-0 border-t-0">
                    {readmeContent ? (
                      viewMode === "preview" ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {readmeContent}
                        </ReactMarkdown>
                      ) : (
                        <pre className="whitespace-pre-wrap break-words font-mono text-sm text-gray-200">
                          {readmeContent}
                        </pre>
                      )
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Select "Generate README" to create content.
                      </div>
                    )}
                  </div>
                </div>

                {readmeContent && (
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="e.g., Add a section about deployment"
                      disabled={isRefining}
                      onKeyPress={(e) => {
                        if (
                          e.key === "Enter" &&
                          !isRefining &&
                          chatInput.trim()
                        ) {
                          handleChatSubmit();
                        }
                      }}
                      className="flex-1 px-4 py-3 text-sm bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-700 disabled:opacity-50"
                    />
                    <button
                      onClick={handleChatSubmit}
                      disabled={isRefining || !chatInput.trim()}
                      className="px-6 py-3 text-sm rounded-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black shadow-lg transition-all disabled:opacity-50 font-medium"
                    >
                      {isRefining ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                          <span>Updating...</span>
                        </div>
                      ) : (
                        "Refine"
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-72 text-center">
                <div>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-green-600"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No repository selected
                  </h3>
                  <p className="text-gray-500">
                    Please select a repository from the sidebar.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        <footer className="w-full text-center text-[15px] text-gray-500 py-2 mt-2">
          © 2025 Name. All rights reserved.
        </footer>
      </main>

      {/* 👇 MOBILE SIDEBAR OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* 👇 MOBILE SIDEBAR PANEL */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gray-900 shadow-2xl z-50 transform transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-lg font-semibold">Your Repositories</h3>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-gray-800"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        <SidebarContent
          repos={filteredRepos}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRepo={selectedRepo}
          handleRepoSelect={handleRepoSelect}
        />
      </div>
    </div>
  );
};

// 👇 Extracted sidebar content into a separate component to avoid duplication
const SidebarContent = ({
  repos,
  searchTerm,
  setSearchTerm,
  selectedRepo,
  handleRepoSelect,
}) => (
  <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-800/50 overflow-hidden h-full flex flex-col">
    <div className="p-4 border-b border-gray-800/50">
      <input
        type="text"
        placeholder="Search repositories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all"
      />
    </div>
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
      {repos.length > 0 ? (
        repos.map((repo) => (
          <div
            key={repo.id}
            onClick={() => handleRepoSelect(repo)}
            className={`group p-3 rounded-lg cursor-pointer transition-all border ${
              selectedRepo?.id === repo.id
                ? "bg-gradient-to-r from-green-700/40 to-green-900/30 border-green-700 shadow-lg"
                : "bg-gray-800/30 hover:bg-gray-800/50 border-gray-700/50 hover:scale-[1.02]"
            }`}
          >
            <div className="flex items-center justify-between">
              <h4
                className={`font-medium truncate ${
                  selectedRepo?.id === repo.id ? "text-green-100" : "text-white"
                }`}
              >
                {repo.name}
              </h4>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-500/20 text-gray-300">
                {repo.private ? "Private" : "Public"}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center text-gray-400">
          {searchTerm
            ? "No repositories match your search."
            : "No repositories found."}
        </div>
      )}
    </div>
  </div>
);

export default DashboardPage;
