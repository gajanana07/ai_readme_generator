import User from "../models/User.model.js";
import {
  getUserRepos,
  getRepoTree,
  
} from "../services/githubService.js";
import { generateReadmeWithQwen } from "../services/aiService.js";

export const listUserRepos = async (req, res) => { //(api/github/repos)
  try {
    // The user object is attached to the request by our 'protect' middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch repos using the user's stored access token
    const repos = await getUserRepos(user.accessToken);

    // We only need a few details for the frontend list
    const simplifiedRepos = repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private,
      description: repo.description,
      updated_at: repo.updated_at,
    }));

    res.json(simplifiedRepos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const analyzeRepo = async (req, res) => {
  //(api/github/analyze)
  try {
    const user = await User.findById(req.user.id);
    const { repoFullName } = req.body; 

    if (!repoFullName) {
      return res.status(400).json({ message: "Repository name is required." });
    }

    const repoName = repoFullName.split("/")[1]; 
    const fileTree = await getRepoTree(user.accessToken, repoFullName);

    const generatedReadme = await generateReadmeWithQwen(fileTree, repoName);

    res.json({ readme: generatedReadme });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
