// frontend/src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container footer__container">
        <div className="footer__content">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="material-icons">restaurant_menu</span>
              Recipizer
            </Link>
            <p className="footer__tagline">
              Save, organize, and share your favorite recipes
            </p>
          </div>
          
          <div className="footer__links">
            <div className="footer__link-group">
              <h3 className="footer__link-title">Product</h3>
              <ul className="footer__link-list">
                <li>
                  <Link to="/features" className="footer__link">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="footer__link">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="footer__link">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="footer__link-group">
              <h3 className="footer__link-title">Company</h3>
              <ul className="footer__link-list">
                <li>
                  <Link to="/about" className="footer__link">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="footer__link">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="footer__link">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="footer__link-group">
              <h3 className="footer__link-title">Legal</h3>
              <ul className="footer__link-list">
                <li>
                  <Link to="/terms" className="footer__link">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="footer__link">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="footer__link">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {currentYear} Recipizer. All rights reserved.
          </p>
          <div className="footer__social">
            <a href="https://twitter.com" className="footer__social-link" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <span className="material-icons">twitter</span>
            </a>
            <a href="https://facebook.com" className="footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <span className="material-icons">facebook</span>
            </a>
            <a href="https://instagram.com" className="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <span className="material-icons">instagram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;