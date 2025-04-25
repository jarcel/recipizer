import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useAuth } from '../contexts/AuthContext';
import RecipeService from '../services/recipe.service';
import './RecipeUrlScraper.scss';

interface RecipeUrlScraperProps {
  publicMode?: boolean;
  onExtracted?: (recipe: any) => void;
  initialUrl?: string;
}

const RecipeUrlScraper: React.FC<RecipeUrlScraperProps> = ({ 
  publicMode = false,
  onExtracted,
  initialUrl = ''
}) => {
  const [url, setUrl] = useState(initialUrl);
  
  // Auto-submit if an initial URL is provided
  useEffect(() => {
    if (initialUrl && initialUrl.trim() !== '') {
      handleSubmit(new Event('submit') as any);
    }
  }, [initialUrl]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedRecipe, setExtractedRecipe] = useState<any | null>(null);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setError('Please enter a recipe URL');
      return;
    }
    
    // Simple URL validation
    try {
      new URL(url); // This will throw an error if URL is invalid
    } catch (e) {
      setError('Please enter a valid URL');
      return;
    }
    
    // Check if free user has reached recipe limit (only for authenticated mode)
    if (!publicMode && profile?.account_type === 'free' && (profile?.recipe_count || 0) >= 25) {
      setError('Free accounts are limited to 25 recipes. Upgrade to premium for unlimited recipes.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // For public mode, no authentication is needed
      let headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      // Add authentication for logged-in users
      if (!publicMode) {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Authentication required');
        }
        
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      // Call our backend API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/scraper/scrape`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ url })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to scrape recipe');
      }
      
      const scrapedRecipe = await response.json();
      setExtractedRecipe(scrapedRecipe);
      
      // If in public mode, just show the extracted recipe
      if (publicMode) {
        if (onExtracted) {
          onExtracted(scrapedRecipe);
        }
        return;
      }
      
      // For authenticated users, save to database and navigate
      const newRecipe = await RecipeService.createRecipe({
        user_id: user?.id || '',
        title: scrapedRecipe.title,
        description: scrapedRecipe.description,
        ingredients: scrapedRecipe.ingredients,
        instructions: scrapedRecipe.instructions,
        prep_time: scrapedRecipe.prepTime,
        cook_time: scrapedRecipe.cookTime,
        total_time: scrapedRecipe.totalTime,
        servings: scrapedRecipe.servings,
        cuisine: scrapedRecipe.cuisine,
        category: scrapedRecipe.category,
        source_url: url,
        source_website: scrapedRecipe.sourceWebsite || new URL(url).hostname,
        image: scrapedRecipe.image,
        is_public: false
      });
      
      // Navigate to the new recipe
      navigate(`/recipe/${newRecipe.id}`);
    } catch (err) {
      console.error('Error scraping recipe:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="recipe-url-scraper">
      <div className="recipe-url-scraper__content">
        <h2 className="recipe-url-scraper__title">
          {publicMode ? 'Extract Recipe from URL' : 'Save Recipe from URL'}
        </h2>
        
        <p className="recipe-url-scraper__description">
          Enter the URL of a recipe. We'll extract the ingredients, 
          instructions, and other details automatically.
          {!publicMode && ' You can save it to your collection.'}
        </p>
        
        {!publicMode && profile?.account_type === 'free' && (
          <div className="recipe-url-scraper__premium-notice">
            <span className="material-icons">info</span>
            <p>
              Free accounts can save up to 25 recipes. 
              <a href="/pricing" className="recipe-url-scraper__upgrade-link">Upgrade to Premium</a> 
              for unlimited recipes and more features.
            </p>
          </div>
        )}
        
        {!extractedRecipe ? (
          <form onSubmit={handleSubmit} className="recipe-url-scraper__form">
            <div className="recipe-url-scraper__input-container">
              <input
                type="text"
                placeholder="Paste recipe URL here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="recipe-url-scraper__input"
                disabled={isLoading}
              />
              
              <button 
                type="submit" 
                className="recipe-url-scraper__button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="recipe-url-scraper__spinner"></span>
                ) : (
                  <>
                    <span className="material-icons">download</span>
                    {publicMode ? 'Extract' : 'Import'}
                  </>
                )}
              </button>
            </div>
            
            {error && (
              <p className="recipe-url-scraper__error">
                <span className="material-icons">error</span>
                {error}
              </p>
            )}
          </form>
        ) : publicMode ? (
          <div className="recipe-url-scraper__extracted">
            <div className="recipe-url-scraper__extracted-header">
              <h3 className="recipe-url-scraper__extracted-title">{extractedRecipe.title}</h3>
              {extractedRecipe.description && (
                <p className="recipe-url-scraper__extracted-description">{extractedRecipe.description}</p>
              )}
            </div>
            
            <div className="recipe-url-scraper__extracted-sections">
              <div className="recipe-url-scraper__extracted-ingredients">
                <h4>Ingredients</h4>
                <ul>
                  {extractedRecipe.ingredients.map((ingredient: string, idx: number) => (
                    <li key={idx}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <div className="recipe-url-scraper__extracted-instructions">
                <h4>Instructions</h4>
                <ol>
                  {extractedRecipe.instructions.map((instruction: string, idx: number) => (
                    <li key={idx}>{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
            
            <button 
              className="recipe-url-scraper__button recipe-url-scraper__reset-button"
              onClick={() => {
                setExtractedRecipe(null);
                setUrl('');
              }}
            >
              <span className="material-icons">replay</span>
              Extract another recipe
            </button>
          </div>
        ) : null}
        
        <div className="recipe-url-scraper__tips">
          <h3 className="recipe-url-scraper__tips-title">Tips:</h3>
          <ul className="recipe-url-scraper__tips-list">
            <li>Make sure the URL points directly to a recipe page</li>
            {!publicMode && <li>After importing, you can edit and customize the recipe</li>}
            <li>Works with most popular recipe websites</li>
          </ul>
        </div>
      </div>
      
      <div className="recipe-url-scraper__decoration">
        <div className="recipe-url-scraper__illustration">
          <span className="material-icons">restaurant</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeUrlScraper;