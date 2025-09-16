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

  if (loading) return <div className="flex items-center justify-center h-screen">Loading dashboard...</div>;

  return (
    <div className="m-0 p-0 min-h-screen bg-gradient-to-b from-green-500 to-black text-gray-800 transition-colors">
      <div className="flex justify-between items-center p-4 bg-gray-200 rounded-lg shadow-md mt-4 mx-4">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        </div>
        <div className="flex items-center gap-4">
          <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition-colors">
            About us
          </button>
          <button onClick={onLogout} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
            Logout
          </button>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 mt-2 mb-0 rounded border border-gray-300 bg-gray-50"
          />
      </div>
      <div className="pl-4 p-0 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 bg-white rounded shadow p-4">
          <h2 className="font-bold mb-2">Your Repositories</h2>
          <div className="max-h-[60vh] overflow-y-auto">
            {filteredRepos.length > 0 ? (
              filteredRepos.map((repo) => (
                <div
                  key={repo.id}
                  onClick={() => handleRepoSelect(repo)}
                  className={`p-2 mb-2 rounded cursor-pointer hover:bg-blue-100 ${
                    selectedRepo?.id === repo.id ? "bg-blue-200" : ""
                  }`}
                >
                  <div className="font-semibold">{repo.name}</div>
                  <div className="text-sm text-gray-500">{repo.description}</div>
                </div>
              ))
            ) : (
              <p>No repositories found.</p>
            )}
          </div>
        </div>

        <div className="md:col-span-3 bg-gray-500 rounded shadow p-4">
          {selectedRepo ? (
            <div>
              <h2 className="text-lg font-bold mb-4">{selectedRepo.name}</h2>
              {!readmeContent && !isAnalyzing && (
                <button
                  onClick={handleGenerateReadme}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Generate README
                </button>
              )}
              {isAnalyzing && <p>AI is thinking... please wait.</p>}
              {readmeContent && (
                <div>
                  <div className="flex gap-2 mb-4 items-center">
                    <button
                      onClick={() => setViewMode("preview")}
                      className={`px-3 py-1 rounded ${viewMode === "preview" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setViewMode("code")}
                      className={`px-3 py-1 rounded ${viewMode === "code" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
                    >
                      Code
                    </button>
                    <button
                      onClick={handleCopyToClipboard}
                      className="ml-auto px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                    >
                      Copy Code
                    </button>
                  </div>
                  <div className="p-4 bg-gray-100 rounded h-[50vh] overflow-y-auto">
                    {viewMode === "preview" ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {readmeContent}
                      </ReactMarkdown>
                    ) : (
                      <pre className="whitespace-pre-wrap break-all font-mono text-sm">{readmeContent}</pre>
                    )}
                  </div>
                  <div className="flex mt-4 gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="e.g., 'Add a section about deployment'"
                      className="flex-1 p-2 rounded border border-gray-300 bg-gray-50"
                      disabled={isRefining}
                    />
                    <button
                      onClick={handleChatSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      disabled={isRefining}
                    >
                      {isRefining ? "Updating..." : "Refine"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Please select a repository from the left.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
