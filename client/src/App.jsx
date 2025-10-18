import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import About from "./pages/AboutUsPage";
import apiClient from "./api/apiClient";

// Loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-green-800 to-black">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-white text-lg font-medium">Loading...</div>
    </div>
  </div>
);

// Auth wrapper to verify token on dashboard load
const AuthChecker = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await apiClient.get("/user/profile");
        if (response.data && response.data.username) {
          setIsValid(true);
        } else {
          setIsValid(false);
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        setIsValid(false);
        navigate("/", { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    // Only verify if we're on dashboard
    if (location.pathname === "/dashboard") {
      verifyAuth();
    } else {
      setIsChecking(false);
    }
  }, [navigate, location.pathname]);

  if (isChecking && location.pathname === "/dashboard") {
    return <LoadingScreen />;
  }

  return isValid || location.pathname !== "/dashboard" ? children : null;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Check if user has valid session on app load
    const checkAuth = async () => {
      try {
        const response = await apiClient.get("/user/profile");
        if (response.data && response.data.username) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }

    setTimeout(() => {
      localStorage.removeItem("videoPlayed");
      setIsAuthenticated(false);
      setIsLoggingOut(false);
    }, 800); // Smooth transition
  };

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (isLoggingOut) {
    return <LoadingScreen message="Logging out..." />;
  }

  return (
    <Router>
      <AuthChecker>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <HomePage />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <DashboardPage onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </AuthChecker>
    </Router>
  );
};

export default App;
