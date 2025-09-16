// import React from "react";
// //import { FaGithub } from 'react-icons/fa';

// import "../index.css";

// const HomePage = ({ onLogin }) => {
//   const GITHUB_AUTH_URL = "http://localhost:8000/api/auth/github";

//   return (
//     <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-green-500 to-black animated-gradientMove transition-colors">
//       <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center items-center z-0">
//   <div className="animate-scroll flex flex-col items-center justify-between h-screen w-screen text-white text-xl md:text-xl lg:text-3xl opacity-20">
//     <p className="w-full text-center">What it does for you?</p>
//     <p className="w-full text-center">AI-powered generation</p>
//     <p className="w-full text-center">Seamless GitHub integration</p>
//     <p className="w-full text-center">
//       Securely sign in with your GitHub account to instantly view all your public and private repositories.
//     </p>
//     <p className="w-full text-center">Quick and easy</p>
//     <p className="w-full text-center">
//       Select a repository, and our AI will generate a comprehensive and polished README.md file for you in seconds.
//     </p>
//   </div>
// </div>


//   <div className="bg-gray-900 bg-opacity-90 shadow-2xl rounded-2xl p-10 text-center w-full max-w-2xl h-96 mx-4 flex flex-col justify-between z-10">
//     <div>
//       <h1 className="text-3xl font-bold mb-6 text-white dark:text-gray-200">
//         AI Powered README Generator
//       </h1>
//       <p className="mb-8 text-gray-600 dark:text-gray-400 text-lg">
//         Login to get started and create amazing documentation with ease!
//       </p>
//     </div>
//     <div className="flex justify-center">
//       <a
//         href={GITHUB_AUTH_URL}
//         className="inline-flex items-center px-20 py-3 bg-white bg-opacity-80 text-black-300 font-semibold rounded-md shadow hover:bg-gray-700 hover:scale-105 hover:shadow-lg transition transform duration-300 ease-in-out"
//         onClick={onLogin}
//       >
//         <img src="/github-icon.svg" alt="GitHub" className="w-5 h-5 mr-3" />
//         Sign in with GitHub
//       </a>
//     </div>
//   </div>
// </div>
//   );
// };

// export default HomePage;

import React, { useState, useEffect } from "react";
import "../index.css";

const HomePage = ({ onLogin }) => {
  const GITHUB_AUTH_URL = "http://localhost:8000/api/auth/github";
  
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const videoPlayed = localStorage.getItem("videoPlayed");
    if (!videoPlayed) {
      setShowVideo(true);
    }
  }, []);

  const handleVideoEnd = () => {
    localStorage.setItem("videoPlayed", "true");
    setShowVideo(false);
  };

  if (showVideo) {
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

  // Existing login page layout
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-green-500 to-black animated-gradientMove transition-colors">
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center items-center z-0">
        <div className="animate-scroll flex flex-col items-center justify-between h-screen w-screen text-white text-xl md:text-xl lg:text-3xl opacity-20">
          <p className="w-full text-center">What it does for you?</p>
          <p className="w-full text-center">AI-powered generation</p>
          <p className="w-full text-center">Seamless GitHub integration</p>
          <p className="w-full text-center">
            Securely sign in with your GitHub account to instantly view all your public and private repositories.
          </p>
          <p className="w-full text-center">Quick and easy</p>
          <p className="w-full text-center">
            Select a repository, and our AI will generate a comprehensive and polished README.md file for you in seconds.
          </p>
        </div>
      </div>

      <div className="bg-gray-900 bg-opacity-90 shadow-2xl rounded-2xl p-10 text-center w-full max-w-2xl h-96 mx-4 flex flex-col justify-between z-10">
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
            <img src="/github.png" alt="GitHub" className="w-5 h-5 mr-3 rounded-full" />
            Sign in with GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

