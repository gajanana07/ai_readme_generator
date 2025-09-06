import axios from "axios";
import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

// Redirect user to GitHub for authorization(api/auth/github)
export const redirectToGitHub = (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,user`;
  res.redirect(githubAuthUrl);
};

// Handle the callback from GitHub after authorization(api/auth/github/callback)
export const handleGitHubCallback = async (req, res) => {
  // Get the code from the query parameters sent by GitHub
  const { code } = req.query;

  if (!code) {
    console.error("Error: GitHub redirect did not include a 'code'.");
    return res.redirect(
      `${process.env.CLIENT_URL}/login-error?error=auth_failed`
    );
  }

  try {
    // 1. Exchange the code for an access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // 2. Use the access token to get user details from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubUser = userResponse.data;

    // 3. Find or create a user in your database (Upsert)
    const user = await User.findOneAndUpdate(
      { githubId: githubUser.id },
      {
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
        accessToken,
      },
      { new: true, upsert: true }
    );

    const token = jwt.sign(
      { id: user._id }, // Payload: contains user's unique MongoDB ID
      process.env.JWT_SECRET, // The secret key to sign the token
      { expiresIn: "1d" } // Token will expire in 1 day
    );

    res.cookie("jwt", token, {
      httpOnly: true, // Prevents browser JavaScript from accessing the cookie
      secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    console.log("User saved/updated:", user.username);

    // 4. Redirect to the frontend dashboard
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error("Error during GitHub OAuth callback:", error.message);
    res.redirect(`${process.env.CLIENT_URL}/login-error?error=internal_error`);
  }
};
