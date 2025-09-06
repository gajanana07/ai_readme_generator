import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    avatarUrl: { type: String },
    accessToken: { type: String, required: true }, // We'll use this to make API calls on their behalf
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
