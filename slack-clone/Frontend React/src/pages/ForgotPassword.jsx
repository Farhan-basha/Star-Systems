import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setTimeout(() => {
      setIsSubmitted(true);
      setError('');
    }, 1000);
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
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="auth-form">
            <p className="auth-description">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="name@work-email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-button" type="submit">
              Send Reset Link
            </button>

            <div className="auth-footer">
              <Link to="/" className="auth-link">Back to Login</Link>
            </div>
          </form>
        ) : (
          <div className="auth-success">
            <h3>Check your email</h3>
            <p>
              If an account exists for {email}, we've sent a password reset link to this email address.
              The link will expire in 1 hour.
            </p>
            <div className="auth-footer">
              <Link to="/" className="auth-link">Back to Login</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
