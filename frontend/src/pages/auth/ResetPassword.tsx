import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.scss';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      
      await resetPassword(email);
      
      // Show success message
      setSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to send password reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // If reset was successful, show a confirmation message
  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-logo">
            <span className="material-icons">restaurant</span>
            <h1>Recipizer</h1>
          </div>
          
          <div className="auth-card">
            <div className="auth-success">
              <span className="material-icons">check_circle</span>
              <h2>Check your email</h2>
              <p>
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your inbox and follow the instructions to reset your password.
              </p>
              <p>
                If you don't see the email, please check your spam folder.
              </p>
              <div className="auth-action-links">
                <Link to="/login" className="auth-link-button">
                  Return to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <span className="material-icons">restaurant</span>
          <h1>Recipizer</h1>
        </div>
        
        <div className="auth-card">
          <h2 className="auth-title">Reset Password</h2>
          
          <p className="auth-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          {error && (
            <div className="auth-error">
              <span className="material-icons">error</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                disabled={loading}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-spinner"></span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
          
          <div className="auth-redirect">
            <p>
              Remember your password? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;