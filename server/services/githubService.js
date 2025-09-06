import axios from "axios";

// Fetches a user's repositories using their access token
export const getUserRepos = async (accessToken) => {
  try {
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        sort: "updated", 
        per_page: 20, // Get up to 20 repos
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub repos:", error.message);
    throw new Error("Failed to fetch repositories from GitHub.");
  }
};

// Fetches the file tree of a repository
export const getRepoTree = async (accessToken, repoFullName) => {
  try {
    // First, we need to get the main branch's SHA
    const repoInfo = await axios.get(
      `https://api.github.com/repos/${repoFullName}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const mainBranch = repoInfo.data.default_branch;

    const branchInfo = await axios.get(
      `https://api.github.com/repos/${repoFullName}/branches/${mainBranch}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const treeSha = branchInfo.data.commit.sha;

    // Now, get the file tree recursively
    const treeResponse = await axios.get(
      `https://api.github.com/repos/${repoFullName}/git/trees/${treeSha}?recursive=1`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // We only care about the file paths
    return treeResponse.data.tree.map((file) => file.path);
  } catch (error) {
    console.error("Error fetching GitHub repo tree:", error.message);
    throw new Error("Failed to fetch repository tree from GitHub.");
  }
};

  
