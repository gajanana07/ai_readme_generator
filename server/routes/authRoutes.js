import express from "express";
import {
  redirectToGitHub,
  handleGitHubCallback,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/github", redirectToGitHub);

router.get("/github/callback", handleGitHubCallback);

export default router;
