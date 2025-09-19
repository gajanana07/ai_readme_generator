import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../index.css";

const DashboardPage = ({ onLogout }) => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await apiClient.get("/user/profile");
        setUser(userProfile.data);
        const userRepos = await apiClient.get("/github/repos");
        setRepos(userRepos.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
    setReadmeContent("");
  };

  const handleGenerateReadme = async () => {
    if (!selectedRepo) return;
    setIsAnalyzing(true);
    setReadmeContent("");
    try {
      const response = await apiClient.post("/github/analyze", {
        repoFullName: selectedRepo.full_name,
      });
      setReadmeContent(response.data.readme);
    } catch (error) {
      console.error("Failed to generate README", error);
      alert("An error occurred during README generation.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput) return;
    setIsRefining(true);
    try {
      const response = await apiClient.post("/ai/refine", {
        currentReadme: readmeContent,
        userRequest: chatInput,
      });
      setReadmeContent(response.data.readme);
      setChatInput("");
      alert("README updated successfully!");
    } catch (error) {
      console.error("Failed to refine README", error);
      alert("An error occurred during refinement.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(readmeContent);
    alert("README content copied to clipboard!");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 via-green-800 to-black text-white text-lg">
        <div className="animate-pulse px-6 py-4 rounded-2xl bg-black/40 backdrop-blur-sm">
          Loading dashboard...
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-green-800 to-black text-white font-sans ">
      {/* NAVBAR */}
      <header className="mx-4 mt-4">
        <nav className="flex items-center justify-between gap-4 p-3 bg-black/60 backdrop-blur-md rounded-xl shadow-lg border border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-green-400 to-green-600 flex items-center justify-center shadow-inner">
              <img src="/logo.png" alt="Logo" className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm text-gray-300">Welcome back</div>
              <div className="font-semibold text-lg text-green-200">
                {user ? user.username : "Guest"}
              </div>
            </div>
          </div>

          {/* WEBSITE NAME instead of search bar */}
          <div className="hidden md:block text-2xl font-bold text-green-400 tracking-wide">
            AI README Generator
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/60 hover:bg-gray-700 transition transform hover:scale-105 border border-gray-700">
              About Us
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transform hover:scale-105 transition font-medium"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* LAYOUT */}
      <main className="p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* SIDEBAR */}
          <aside className="md:col-span-1 bg-gray-900/60 backdrop-blur rounded-2xl p-4 shadow-lg border border-gray-800 h-[70vh] md:sticky md:top-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Repositories</h3>
              <span className="text-sm text-gray-400">{repos.length}</span>
            </div>

            <div className="mb-3 hidden md:block">
              <input
                type="text"
                placeholder="Filter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-3 rounded-md bg-black/30 border border-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="overflow-y-auto max-h-[60vh] pr-2">
              {filteredRepos.length > 0 ? (
                filteredRepos.map((repo) => (
                  <div
                    key={repo.id}
                    onClick={() => handleRepoSelect(repo)}
                    className={`p-3 mb-3 rounded-xl cursor-pointer transition-shadow hover:shadow-xl border border-transparent ${
                      selectedRepo?.id === repo.id
                        ? "bg-gradient-to-r from-green-500/80 to-green-400/70 text-black border-green-300"
                        : "bg-gray-900 hover:bg-gray-900 transform hover:scale-95 transition-all duration-300 ease-out hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold truncate">{repo.name}</div>
                      <div className="text-xs text-gray-300">
                        {repo.private ? "Private" : "Public"}
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mt-1 truncate">
                      {repo.description || "No description"}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 mt-8">
                  No repositories found.
                </p>
              )}
            </div>
          </aside>

          {/* MAIN AREA */}
          <section className="md:col-span-3 bg-gray-900/50 backdrop-blur rounded-2xl p-6 shadow-lg border border-gray-800 h-[80vh] flex flex-col">
            {selectedRepo ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-green-200">
                      {selectedRepo.name}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {selectedRepo.description || "No description"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {!readmeContent && !isAnalyzing && (
                      <button
                        onClick={handleGenerateReadme}
                        className="px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 font-semibold shadow hover:translate-y-[-2px] transform transition"
                      >
                        Generate README
                      </button>
                    )}

                    {isAnalyzing && (
                      <div className="px-4 py-2 rounded-full bg-black/40 text-gray-300 animate-pulse">
                        AI analyzing...
                      </div>
                    )}
                      <button
                        onClick={handleCopyToClipboard}
                        className="px-3 py-2 rounded-lg bg-white text-black font-medium 
                      hover:bg-gray-200 hover:scale-110 hover:shadow-2lg 
                        transform transition duration-300 ease-out"

                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-0">
                  <button
                    onClick={() => setViewMode("preview")}
                    className={`px-4 py-2 rounded-t-lg font-medium transition ${ 
                        viewMode === "preview"
                        ? "rounded-b-none border border-gray-800 bg-gradient-to-b from-black/40 to-black/20 text-white mb-0"
                        : "bg-green-500 text-black hover:bg-green-600 shadow-2xl hover:scale-105 hover:shadow-2xl rounded-t-2xl rounded-b-2xl mb-2"
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setViewMode("code")}
                    className={`px-4 py-2 rounded-t-lg font-medium transition ${ 
                          viewMode === "code"
                        ? "rounded-b-none border border-gray-800 bg-gradient-to-b from-black/40 to-black/20 text-white mb-0" 
                        : "bg-green-500 text-black hover:bg-green-600 shadow-2xl hover:scale-105 hover:shadow-2xl rounded-t-2xl rounded-b-2xl mb-2"
                    }`}
                  >
                    Code
                  </button>
                </div>
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="p-4 rounded-b-lg border border-gray-800 bg-gradient-to-b from-black/40 to-black/20 h-[60vh] overflow-y-auto custom-scrollbar">
                    {readmeContent ? (
                      viewMode === "preview" ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {readmeContent} 
                        </ReactMarkdown>
                      ) : (
                        <pre className="whitespace-pre-wrap break-all font-mono text-sm text-gray-200">
                          {readmeContent}
                        </pre>
                      )
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Select "Generate README" to create content for this
                        repository.
                      </div>
                    )}
                  </div>

                  {/* refinement area */}
                  <div className="mt-4 flex flex-col md:flex-row gap-3 items-stretch">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="e.g., Add a section about deployment"
                      className="flex-1 p-3 rounded-lg border border-gray-700 bg-black/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={isRefining}
                    />
                    <button
                      onClick={handleChatSubmit}
                      disabled={isRefining}
                      className="px-5 py-2 rounded-lg bg-green-500 hover:bg-green-700 transform hover:scale-105 transition disabled:opacity-60"
                    >
                      {isRefining ? "Updating..." : "Refine"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-300">
                    No repository selected
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Please select a repository from the left to get started.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
