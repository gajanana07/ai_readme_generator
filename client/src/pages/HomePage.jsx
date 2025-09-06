import React from "react";

const HomePage = () => {
  const GITHUB_AUTH_URL = "http://localhost:8000/api/auth/github";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <h1>AI README Generator</h1>
        <p>Login to get started.</p>
        <a
          href={GITHUB_AUTH_URL}
          style={{
            textDecoration: "none",
            color: "white",
            backgroundColor: "#333",
            padding: "10px 20px",
            borderRadius: "5px",
          }}
        >
          Login with GitHub
        </a>
      </div>
    </div>
  );
};

export default HomePage;
