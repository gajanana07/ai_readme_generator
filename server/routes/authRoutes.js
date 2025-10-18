import express from "express";
import {
  redirectToGitHub,
  handleGitHubCallback,
  handleLogout,
} from "../controllers/authController.js";

const router = express.Router();

// Route to redirect user to GitHub for authorization
router.get("/github", redirectToGitHub);

// Route to handle GitHub callback after authorization
router.get("/github/callback", handleGitHubCallback);

// Route to handle logout
router.post("/logout",handleLogout);

export default router;
