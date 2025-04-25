import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RecipeUrlScraper from '../components/RecipeUrlScraper';
import './ExtractRecipe.scss';

const ExtractRecipe: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [extracted, setExtracted] = useState(false);
  const [initialUrl, setInitialUrl] = useState('');
  const location = useLocation();
  
  // Extract the URL from query parameters if provided
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlParam = queryParams.get('url');
    if (urlParam) {
      setInitialUrl(urlParam);
    }
  }, [location]);

  return (
    <div className="extract-recipe">
      <div className="extract-recipe__header">
        <h1 className="extract-recipe__title">Extract Recipe from URL</h1>
        <p className="extract-recipe__description">
          Enter any recipe URL, and we'll extract the important information for you. 
          {!isAuthenticated && ' Create an account to save unlimited recipes to your collection.'}
        </p>
      </div>

      <RecipeUrlScraper 
        publicMode={!isAuthenticated}
        onExtracted={() => setExtracted(true)}
        initialUrl={initialUrl}
      />

      {!isAuthenticated && extracted && (
        <div className="extract-recipe__cta">
          <div className="extract-recipe__cta-content">
            <h2>Want to save this recipe and more?</h2>
            <p>
              Create a free account to save up to 25 recipes to your personal collection.
              Upgrade to premium for unlimited recipes and more features.
            </p>
            <div className="extract-recipe__cta-buttons">
              <Link to="/register" className="extract-recipe__cta-button primary">
                Create Free Account
              </Link>
              <Link to="/pricing" className="extract-recipe__cta-button secondary">
                See Pricing
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtractRecipe;