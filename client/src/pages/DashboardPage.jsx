import React, { useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const DashboardPage = () => {
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

  //when searched
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

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Welcome, {user ? user.username : "Guest"}!</h1>
      <p>Select a repository to generate a README for.</p>

      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <h2
            style={{
              padding: "10px",
              margin: 0,
              borderBottom: "1px solid #ccc",
            }}
          >
            Your Repositories
          </h2>

          <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
            />
          </div>

          {filteredRepos.length > 0 ? (
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                maxHeight: "60vh",
                overflowY: "auto",
              }}
            >
              {filteredRepos.map((repo) => (
                <li
                  key={repo.id}
                  onClick={() => handleRepoSelect(repo)}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    backgroundColor:
                      selectedRepo?.id === repo.id ? "#e0f7fa" : "transparent",
                  }}
                >
                  <strong>{repo.name}</strong>
                  <p
                    style={{
                      fontSize: "12px",
                      margin: "4px 0 0 0",
                      color: "#555",
                    }}
                  >
                    {repo.description}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ padding: "10px" }}>No repositories found.</p>
          )}
        </div>

        <div
          style={{
            flex: 1,
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >

          {selectedRepo ? (
            <div>
              <h2>{selectedRepo.name}</h2>
              {!readmeContent && !isAnalyzing && (
                <button onClick={handleGenerateReadme}>
                   Generate README
                </button>
              )}
              {isAnalyzing && <p>AI is thinking... please wait.</p>}
              {readmeContent && (
                <>
                  <div
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={() => setViewMode("preview")}
                      disabled={viewMode === "preview"}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setViewMode("code")}
                      disabled={viewMode === "code"}
                    >
                      Code
                    </button>
                    <button
                      onClick={handleCopyToClipboard}
                      style={{ marginLeft: "auto" }}
                    >
                      Copy Code
                    </button>
                  </div>
                  <div
                    style={{
                      padding: "15px",
                      border: "1px solid #eee",
                      borderRadius: "5px",
                      backgroundColor: "#f9f9f9",
                      minHeight: "400px",
                      maxHeight: "50vh",
                      overflowY: "auto",
                    }}
                  >
                    {viewMode === "preview" ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {readmeContent}
                      </ReactMarkdown>
                    ) : (
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-all",
                        }}
                      >
                        <code>{readmeContent}</code>
                      </pre>
                    )}
                  </div>
                  <div
                    style={{ marginTop: "20px", display: "flex", gap: "10px" }}
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="e.g., 'Add a section about deployment'"
                      style={{ flex: 1, padding: "8px" }}
                      disabled={isRefining}
                    />
                    <button onClick={handleChatSubmit} disabled={isRefining}>
                      {isRefining ? "Updating..." : "Refine"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p>Please select a repository from the list on the left.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
