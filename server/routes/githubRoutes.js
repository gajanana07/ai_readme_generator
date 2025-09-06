import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { listUserRepos, analyzeRepo } from "../controllers/githubController.js";

const router = express.Router();

// only logged-in users can access it (protect middleware)
router.get("/repos", protect, listUserRepos);
router.post("/analyze", protect, analyzeRepo);

export default router;
