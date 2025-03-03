import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./auth/ModernLoginScreen";
import SignupScreen from "./auth/SignupScreen";
import Dashboard from "./dashboard/Dashboard";
import LandingPage from "./landing/LandingPage";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const [showSignup, setShowSignup] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Handle login attempt
  const handleLogin = async (phoneNumber: string, pin: string) => {
    try {
      // Call the API to authenticate the user
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber, pin }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (data.success) {
        // Store token and user data in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("isAuthenticated", "true");

        setIsAuthenticated(true);
        setLoginError("");
      } else {
        setLoginError(
          data.message || "بيانات الاعتماد غير صالحة. يرجى المحاولة مرة أخرى.",
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.");
    }
  };

  // Handle signup attempt
  const handleSignup = async (phoneNumber: string, pin: string) => {
    try {
      // Call the API to create a new user
      const { signup } = await import("../api/auth");
      const response = await signup(phoneNumber, pin);

      if (response.success) {
        setIsAuthenticated(true);
        return true;
      } else {
        console.error("Signup failed:", response.message);
        return false;
      }
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  // Handle logout
  const handleLogout = () => {
    const { logout } = require("../api/auth");
    logout();
    setIsAuthenticated(false);
  };

  // Toggle between login and signup screens
  const toggleAuthScreen = () => {
    setShowSignup(!showSignup);
    setLoginError("");
  };

  // If user is authenticated, show the dashboard
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Dashboard initialTab="cards" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // If user is not authenticated, show login or signup screen
  return (
    <>
      {showSignup ? (
        <div className="flex justify-center items-center min-h-screen">
          <SignupScreen onSignup={handleSignup} onBack={toggleAuthScreen} />
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <LoginScreen
            onLogin={handleLogin}
            onSignupClick={toggleAuthScreen}
            error={loginError}
          />
        </div>
      )}
    </>
  );
};

export default Home;
