import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.scss';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form input
    if (!name || !email || !password || !confirmPassword) {
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
      
      await register(email, password, name);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to create account. Please try again.'
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
          <h2 className="auth-title">Create an Account</h2>
          
          {error && (
            <div className="auth-error">
              <span className="material-icons">error</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={loading}
                required
              />
            </div>
            
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
                placeholder="Create a password (8+ characters)"
                disabled={loading}
                minLength={8}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={loading}
                minLength={8}
                required
              />
            </div>
            
            <div className="auth-terms">
              By creating an account, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-spinner"></span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <div className="auth-divider">
            <span>or</span>
          </div>
          
          <button 
            className="auth-provider-button google"
            onClick={() => {/* TODO: Implement Google registration */}}
            disabled={loading}
          >
            <span className="provider-icon">G</span>
            Sign up with Google
          </button>
          
          <div className="auth-redirect">
            <p>
              Already have an account? <Link to="/login">Log in</Link>
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

export default Register;