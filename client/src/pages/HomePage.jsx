import React, { useState, useEffect } from "react";
import "../index.css";

const HomePage = ({ onLogin }) => {
  const GITHUB_AUTH_URL = "http://localhost:8000/api/auth/github";

  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [showLoginContent, setShowLoginContent] = useState(false);

  useEffect(() => {
    const videoPlayed = localStorage.getItem("videoPlayed");
    if (!videoPlayed) {
      // If the intro video hasn't been played, show it
      setShowIntroVideo(true);
    } else {
      // If it has been played, show the login content directly
      setShowLoginContent(true);
    }
  }, []);

  const handleVideoEnd = () => {
    localStorage.setItem("videoPlayed", "true");
    setShowIntroVideo(false);
    setTimeout(() => setShowLoginContent(true), 50);
  };


  if (showIntroVideo) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-black">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="../../video2.mp4"
          autoPlay
          muted
          onEnded={handleVideoEnd}
          playsInline
        />
      </div>
    );
  }


  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      <video
        className="absolute w-full h-full object-cover z-0"
        src="../../video1.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      

      {/* Login Card */}
      <div
        className={`bg-gray-900 bg-opacity-90 shadow-2xl rounded-2xl p-10 text-center w-full max-w-2xl h-96 mx-4 flex flex-col justify-between z-30 transition-opacity duration-1000 ease-in ${
          showLoginContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <div>
          <h1 className="text-3xl font-bold mb-6 text-white dark:text-gray-200">
            AI Powered README Generator
          </h1>
          <p className="mb-8 text-gray-600 dark:text-gray-400 text-lg">
            Login to get started and create amazing documentation with ease!
          </p>
        </div>
        <div className="flex justify-center">
          <a
            href={GITHUB_AUTH_URL}
            className="inline-flex items-center px-20 py-3 bg-white bg-opacity-80 text-black-300 font-semibold rounded-md shadow hover:bg-gray-700 hover:scale-105 hover:shadow-lg transition transform duration-300 ease-in-out"
            onClick={onLogin}
          >
            <img
              src="/github.png"
              alt="GitHub"
              className="w-5 h-5 mr-3 rounded-full"
            />
            Sign in with GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
