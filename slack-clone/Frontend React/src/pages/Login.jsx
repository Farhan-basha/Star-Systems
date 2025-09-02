import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("pulseVerseUser");
    if (isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://backend-7tz9.onrender.com/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Login failed");
      }

      const data = await response.json();

      // Save tokens and user info
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("token", data.access);
      
      localStorage.setItem("refreshToken", data.refresh);
      localStorage.setItem("pulseVerseUser", JSON.stringify({
        username,
        access: data.access,
        refresh: data.refresh
      }));

      navigate("/app", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <img
          src="/pulseverse-uploads/dda17b43-48de-422b-b48b-79bd7b88388c.png"
          alt="PulseVerse Logo"
          className="new-logo"
        />
      </div>

      <h1 className="auth-title">Sign in to PulseVerse</h1>

      <div className="auth-card">
        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="forgot-password-link">
              <Link to="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}
          <button className="auth-button" type="submit" disabled={isLoading}>
            {isLoading ? "Logging" : "Login"}
          </button>

          <div className="auth-footer">
            Not a User?{" "}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
