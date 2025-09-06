import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies.jwt) {
    try {
      // 1. Verify the token
      token = req.cookies.jwt;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 2. Find the user by ID and attach them to the request
      // Exclude the accessToken for security
      req.user = await User.findById(decoded.id).select("-accessToken");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
