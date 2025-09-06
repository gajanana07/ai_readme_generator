import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { refineReadme } from "../controllers/aiController.js"; 

const router = express.Router();

router.post("/refine", protect, refineReadme);

export default router;
