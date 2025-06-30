
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  
  const token = searchParams.get('token');
  
  // Check if token exists and is valid
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setError('Invalid or expired reset link. Please request a new one.');
      return;
    }
    
    // Simulate token validation (would normally check against backend)
    const isValid = token.length > 10;
    setIsTokenValid(isValid);
    
    if (!isValid) {
      setError('Your password reset link has expired. Please request a new one.');
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate password reset request
    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 1500);
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

      <h1 className="auth-title">Reset your password</h1>
      
      <div className="auth-card">
        {!isTokenValid ? (
          <div className="auth-error-container">
            <p>{error}</p>
            <div className="auth-footer">
              <Link to="/forgot-password" className="auth-link">Request new reset link</Link>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="auth-success">
            <h3>Password updated successfully!</h3>
            <p>
              Your password has been changed. You'll be redirected to the login page in a few seconds.
            </p>
            <div className="auth-footer">
              <Link to="/" className="auth-link">Return to login</Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter new password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            {error && <div className="auth-error">{error}</div>}
            
            <button 
              className="auth-button"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Setting new password..." : "Reset Password"}
            </button>
            
            <div className="auth-footer">
              <Link to="/" className="auth-link">Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
