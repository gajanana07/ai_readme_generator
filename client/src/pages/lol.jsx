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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          setAuthError(true);
          setTimeout(() => onLogout(), 2000);
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        setAuthError(true);
        if (error.response?.status === 401 || error.response?.status === 403) {
          setTimeout(() => onLogout(), 2000);
        } else {
          setTimeout(() => window.location.reload(), 3000);
        }
      }
    };
    fetchData();
  }, [onLogout]);

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
    setIsSidebarOpen(false);
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
      } else throw new Error("Invalid response format");
    } catch (error) {
      alert("Error generating README.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    setIsRefining(true);
    try {
      const response = await apiClient.post("/ai/refine", {
        currentReadme: readmeContent,
        userRequest: chatInput.trim(),
      });
      if (response.data && response.data.readme) {
        setReadmeContent(response.data.readme);
        setChatInput("");
      } else throw new Error("Invalid response format");
    } catch (error) {
      alert("Error refining README.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(readmeContent);
      alert("Copied to clipboard!");
    } catch {
      alert("Copy failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("videoPlayed");
    onLogout();
  };

  if (loading || authError || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-green-800 to-black">
        <div className="text-white text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 via-green-800 to-black text-white">
      {/* HEADER */}
      <header className="p-4 flex justify-between items-center bg-black/60 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-400">Welcome!</div>
            <div className="font-semibold text-green-300">{user.username}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/about")}
            className="hover:text-green-400"
          >
            About Us
          </button>
          <button
            onClick={handleLogout}
            className="hover:text-red-500 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="hidden md:flex flex-col w-72 bg-gray-900/70 border-r border-gray-800 overflow-y-auto custom-scrollbar">
          <div className="p-4">
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:ring focus:ring-green-600/30"
            />
          </div>
          <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
            {filteredRepos.length > 0 ? (
              filteredRepos.map((repo) => (
                <div
                  key={repo.id}
                  onClick={() => handleRepoSelect(repo)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedRepo?.id === repo.id
                      ? "bg-green-700/40 border border-green-600"
                      : "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50"
                  }`}
                >
                  <h4 className="font-medium truncate">{repo.name}</h4>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 p-4">
                No repositories found.
              </p>
            )}
          </div>
        </aside>

        {/* MAIN CHAT AREA */}
        <main className="flex-1 flex flex-col justify-between">
          {/* Top content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {selectedRepo ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-green-300">
                    {selectedRepo.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    {!readmeContent && !isAnalyzing && (
                      <button
                        onClick={handleGenerateReadme}
                        className="px-4 py-2 bg-green-500 text-black rounded-md hover:bg-green-600"
                      >
                        Generate README
                      </button>
                    )}
                    {readmeContent && (
                      <button
                        onClick={handleCopyToClipboard}
                        className="p-2 bg-gray-800 rounded-md hover:bg-gray-700"
                      >
                        <CopyIcon size={18} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-800 bg-black/20 p-4 h-[75vh] overflow-y-auto custom-scrollbar">
                  {readmeContent ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className="prose prose-invert max-w-none"
                    >
                      {readmeContent}
                    </ReactMarkdown>
                  ) : isAnalyzing ? (
                    <p className="text-gray-400">AI analyzing your repo...</p>
                  ) : (
                    <p className="text-gray-400">
                      Click “Generate README” to start.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                Select a repository from the sidebar.
              </div>
            )}
          </div>

          {/* Chat input (fixed bottom, like ChatGPT) */}
          {readmeContent && (
            <div className="border-t border-gray-800 bg-black/60 backdrop-blur-md p-4 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="e.g., Add a section about deployment"
                disabled={isRefining}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && chatInput.trim()) handleChatSubmit();
                }}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-sm focus:ring focus:ring-green-700/30"
              />
              <button
                onClick={handleChatSubmit}
                disabled={isRefining || !chatInput.trim()}
                className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-black font-medium disabled:opacity-50"
              >
                {isRefining ? "Updating..." : "Refine"}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
