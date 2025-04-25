import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.scss';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [recipeUrl, setRecipeUrl] = useState('');
  const navigate = useNavigate();

  const handleExtractRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (recipeUrl.trim()) {
      navigate(`/extract-recipe?url=${encodeURIComponent(recipeUrl.trim())}`);
    }
  };

  return (
    <div className="home">
      <section className="home__hero">
        <div className="home__hero-content">
          <h1 className="home__title">Collect & Organize Your Favorite Recipes</h1>
          <p className="home__subtitle">
            Save recipes from any website, organize your collection, and access them anywhere.
          </p>
          
          <div className="home__extract-form">
            <form onSubmit={handleExtractRecipe}>
              <div className="home__input-group">
                <input 
                  type="text" 
                  placeholder="Paste a recipe URL to extract..." 
                  value={recipeUrl}
                  onChange={(e) => setRecipeUrl(e.target.value)}
                  className="home__input"
                />
                <button type="submit" className="home__extract-button">
                  <span className="material-icons">search</span>
                  Extract
                </button>
              </div>
            </form>
          </div>
          
          <div className="home__cta">
            {isAuthenticated ? (
              <Link to="/dashboard" className="home__cta-button home__cta-button--secondary">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/register" className="home__cta-button home__cta-button--secondary">
                Create Free Account
              </Link>
            )}
          </div>
        </div>
        <div className="home__hero-image">
          <img src="/hero-image.jpg" alt="Collection of recipes" />
        </div>
      </section>

      <section className="home__features">
        <h2 className="home__section-title">Features</h2>
        <div className="home__features-grid">
          <div className="home__feature">
            <span className="material-icons home__feature-icon">file_download</span>
            <h3 className="home__feature-title">Save Recipes from Any Website</h3>
            <p className="home__feature-description">
              Simply paste the URL and we'll extract all the details automatically.
            </p>
          </div>
          <div className="home__feature">
            <span className="material-icons home__feature-icon">folder</span>
            <h3 className="home__feature-title">Organize Your Collection</h3>
            <p className="home__feature-description">
              Categorize recipes, add tags, and find exactly what you're looking for.
            </p>
          </div>
          <div className="home__feature">
            <span className="material-icons home__feature-icon">share</span>
            <h3 className="home__feature-title">Share with Friends & Family</h3>
            <p className="home__feature-description">
              Easily share your favorite recipes with anyone, anywhere.
            </p>
          </div>
          <div className="home__feature">
            <span className="material-icons home__feature-icon">devices</span>
            <h3 className="home__feature-title">Access on Any Device</h3>
            <p className="home__feature-description">
              Your recipes are synced across all your devices, so you can access them anywhere.
            </p>
          </div>
        </div>
      </section>

      <section className="home__cta-section">
        <h2 className="home__cta-title">Start Your Recipe Collection Today</h2>
        <p className="home__cta-description">
          Join thousands of home cooks who are already saving and organizing their favorite recipes.
        </p>
        {!isAuthenticated && (
          <Link to="/register" className="home__cta-button home__cta-button--large">
            Create Free Account
          </Link>
        )}
      </section>
    </div>
  );
};

export default Home;