import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import './Auth.scss';

const UpdatePassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the token from the URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    if (!token) {
      setTokenError(true);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      
      // Extract the token from query parameters
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');
      
      if (!token) {
        setTokenError(true);
        return;
      }
      
      // Update the password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        throw error;
      }
      
      // Show success message
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Password update error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to update password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // If there's a token error, show an error message
  if (tokenError) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-logo">
            <span className="material-icons">restaurant</span>
            <h1>Recipizer</h1>
          </div>
          
          <div className="auth-card">
            <div className="auth-error-state">
              <span className="material-icons">error</span>
              <h2>Invalid or Expired Link</h2>
              <p>
                The password reset link is invalid or has expired. 
                Please request a new password reset link.
              </p>
              <div className="auth-action-links">
                <Link to="/reset-password" className="auth-link-button">
                  Request New Link
                </Link>
                <Link to="/login" className="auth-link-button secondary">
                  Return to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If password update was successful, show a confirmation message
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
              <h2>Password Updated</h2>
              <p>
                Your password has been successfully updated. 
                You will be redirected to the login page in a few seconds.
              </p>
              <div className="auth-action-links">
                <Link to="/login" className="auth-link-button">
                  Go to Login
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
          <h2 className="auth-title">Create New Password</h2>
          
          <p className="auth-subtitle">
            Please enter and confirm your new password below.
          </p>
          
          {error && (
            <div className="auth-error">
              <span className="material-icons">error</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a new password (8+ characters)"
                disabled={loading}
                minLength={8}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                disabled={loading}
                minLength={8}
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
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;