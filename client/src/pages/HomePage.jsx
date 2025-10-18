import React, { useState, useEffect } from "react";
import "../index.css";
import githubOctocat from "../../public/inspectocat.png";

const HomePage = () => {
  const GITHUB_AUTH_URL = "http://localhost:8000/api/auth/github";

  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [showLoginContent, setShowLoginContent] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const initializePage = () => {
      try {
        const videoPlayed = localStorage.getItem("videoPlayed");
        const isMobile = window.innerWidth < 768;

        // Show intro video only if it hasn't been played AND we are on a desktop device.
        if (!videoPlayed && !isMobile) {
          setShowIntroVideo(true);
        } else {
          setShowLoginContent(true);
          // If we are skipping the video on mobile for the first time,
          // set the flag so it doesn't play on a future desktop visit.
          if (!videoPlayed && isMobile) {
            localStorage.setItem("videoPlayed", "true");
          }
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        setShowLoginContent(true);
      }
    };

    // Add a small delay for smooth page load
    const timer = setTimeout(initializePage, 300);
    return () => clearTimeout(timer);
  }, []);

  const transitionToLogin = () => {
    try {
      localStorage.setItem("videoPlayed", "true");
      setIsTransitioning(true);

      setTimeout(() => {
        setShowIntroVideo(false);
        setTimeout(() => {
          setShowLoginContent(true);
          setIsTransitioning(false);
        }, 100);
      }, 300);
    } catch (error) {
      console.error("Error transitioning to login:", error);
      setShowIntroVideo(false);
      setShowLoginContent(true);
      setIsTransitioning(false);
    }
  };

  const handleVideoEnd = () => {
    transitionToLogin();
  };

  const handleSkipVideo = () => {
    transitionToLogin();
  };

  const handleVideoError = () => {
    console.error("Video failed to load");
    setShowIntroVideo(false);
    setShowLoginContent(true);
  };

  // Intro Video Player (Desktop only)
  if (showIntroVideo) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-black">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="../../video2.mp4"
          autoPlay
          muted
          onEnded={handleVideoEnd}
          onError={handleVideoError}
          playsInline
        />
        <button
          onClick={handleSkipVideo}
          className="absolute top-6 right-6 z-50 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105"
        >
          Skip
        </button>
      </div>
    );
  }

  // Main Login Page
  return (
    <div
      className={`relative flex items-center justify-center min-h-screen bg-black overflow-hidden transition-opacity duration-500 ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        className="absolute w-full h-full object-cover z-0 brightness-[0.65]"
        src="../../video1.mp4"
        autoPlay
        loop
        muted
        playsInline
        onError={(e) => console.warn("Background video failed to load:", e)}
      />
      <div className="absolute inset-0 z-20">
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-white rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-green-300 rounded-full animate-bounce opacity-50"></div>
      </div>

      <div className="relative z-30 flex items-center justify-center w-full px-4">
        <div className="relative">
          <img
            src={githubOctocat}
            alt="GitHub Octocat"
            className={`block absolute -top-8 -right-4 w-24 md:-top-16 md:-right-12 md:w-48 h-auto z-50 transition-all duration-500 ${
              isHovered
                ? "scale-110 rotate-[20deg]"
                : "scale-100 rotate-[20deg]"
            }`}
            style={{
              filter: "drop-shadow(0 10px 20px rgba(0, 208, 122, 0.3))",
              transformOrigin: "bottom center",
            }}
            onError={(e) => {
              console.warn("GitHub Octocat image failed to load");
              e.target.style.display = "none";
            }}
          />

          <div
            className="w-full max-w-lg"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={`rounded-3xl p-0.5 bg-gradient-to-r from-[#00d07a] via-[#14b98a] to-[#1DB954] shadow-2xl transform transition-all duration-700 ${
                isHovered ? "scale-105 shadow-green-500/25" : "scale-100"
              }`}
            >
              <div className="rounded-3xl p-8 sm:p-10 bg-black/60 backdrop-blur-lg border border-white/10 flex flex-col justify-between relative overflow-hidden gap-8">
                <div className="relative z-10">
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-xs font-medium text-green-400 bg-green-400/10 rounded-full border border-green-400/20">
                      ✨ AI-Powered
                    </span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-green-100 to-green-200 mb-4">
                    ReadMe AI
                  </h1>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Transform your projects with{" "}
                    <span className="text-green-400 font-semibold">
                      intelligent
                    </span>
                    , polished documentation in seconds
                  </p>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Smart Templates
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      Auto-Detection
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Instant Export
                    </span>
                  </div>

                  <a
                    href={GITHUB_AUTH_URL}
                    role="button"
                    aria-label="Sign in with GitHub"
                    className="group w-full sm:w-auto inline-flex justify-center items-center gap-3 px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-neutral-900/95 to-neutral-800/95 border border-white/20 text-white shadow-xl hover:shadow-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black relative overflow-hidden transform hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2 .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.58.82-2.14-.08-.2-.36-1.01.08-2.1 0 0 .67-.21 2.2.82a7.68 7.68 0 0 1 4 0c1.53-1.03 2.2-.82 2.2-.82.44 1.09.16 1.9.08 2.1.51.56.82 1.27.82 2.14 0 3.07-1.87 3.75-3.65 3.95.28.24.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                      />
                    </svg>
                    <span className="relative z-10">Continue with GitHub</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
