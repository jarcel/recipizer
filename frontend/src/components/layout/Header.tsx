// frontend/src/components/layout/Header.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Header.scss';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="header">
      <div className="container header__container">
        <div className="header__logo">
          <Link to="/" className="header__logo-link">
            <span className="material-icons">restaurant_menu</span>
            <span className="header__logo-text">Recipizer</span>
          </Link>
        </div>
        
        <button
          className="header__mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="material-icons">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
        
        <nav className={`header__nav ${mobileMenuOpen ? 'header__nav--open' : ''}`}>
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link to="/extract-recipe" className="header__nav-link">
                Extract Recipe
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="header__nav-item">
                  <Link to="/dashboard" className="header__nav-link">
                    Dashboard
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link to="/add-recipe" className="header__nav-link">
                    Add Recipe
                  </Link>
                </li>
                <li className="header__nav-item header__nav-item--profile">
                  <button className="header__profile-button">
                    <span className="header__profile-name">
                      {profile?.name || user?.email?.split('@')[0]}
                    </span>
                    <span className="material-icons">arrow_drop_down</span>
                  </button>
                  <div className="header__dropdown">
                    <div className="header__dropdown-content">
                      <div className="header__dropdown-header">
                        <span className="header__dropdown-name">
                          {profile?.name || ''}
                        </span>
                        <span className="header__dropdown-email">
                          {user?.email}
                        </span>
                        <span className="header__dropdown-account-type">
                          {profile?.account_type === 'premium' ? 'Premium Account' : 'Free Account'}
                        </span>
                      </div>
                      <div className="header__dropdown-menu">
                        <Link to="/account" className="header__dropdown-item">
                          <span className="material-icons">account_circle</span>
                          My Account
                        </Link>
                        <button
                          className="header__dropdown-item header__dropdown-item--button"
                          onClick={handleLogout}
                        >
                          <span className="material-icons">logout</span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="header__nav-item">
                  <Link to="/pricing" className="header__nav-link">
                    Pricing
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link to="/login" className="header__nav-link">
                    Sign In
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link to="/register" className="header__nav-link header__nav-link--cta">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;