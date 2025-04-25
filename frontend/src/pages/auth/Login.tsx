import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.scss';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      
      await login(email, password);
      
      // Redirect to the dashboard or the page they were trying to access
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to sign in. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <span className="material-icons">restaurant</span>
          <h1>Recipizer</h1>
        </div>
        
        <div className="auth-card">
          <h2 className="auth-title">Log In</h2>
          
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
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                disabled={loading}
                required
              />
            </div>
            
            <div className="auth-reset-link">
              <Link to="/reset-password">Forgot password?</Link>
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-spinner"></span>
              ) : (
                'Log In'
              )}
            </button>
          </form>
          
          <div className="auth-divider">
            <span>or</span>
          </div>
          
          <button 
            className="auth-provider-button google"
            onClick={() => {/* TODO: Implement Google login */}}
            disabled={loading}
          >
            <span className="provider-icon">G</span>
            Continue with Google
          </button>
          
          <div className="auth-redirect">
            <p>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
      
      <div className="auth-decoration">
        <div className="auth-benefits">
          <h2>Your recipes, organized.</h2>
          <ul>
            <li>
              <span className="material-icons">language</span>
              <div>
                <h3>Save from any website</h3>
                <p>Easily save recipes from your favorite food blogs and websites</p>
              </div>
            </li>
            <li>
              <span className="material-icons">search</span>
              <div>
                <h3>Find recipes fast</h3>
                <p>Search and filter your personal collection</p>
              </div>
            </li>
            <li>
              <span className="material-icons">share</span>
              <div>
                <h3>Share with friends</h3>
                <p>Share your favorite recipes with family and friends</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;