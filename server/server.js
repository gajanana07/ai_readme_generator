import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL, // Allow requests from your client
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());
app.use(cookieParser()); 

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/ai", aiRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
