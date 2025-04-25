import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { Recipe } from '../types/Recipe';
import './RecipeDetail.scss';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [servingsMultiplier, setServingsMultiplier] = useState(1);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error('Recipe not found');
        }

        // Check if the user is allowed to view this recipe
        if (data.user_id !== user?.id && !data.is_public) {
          throw new Error('You do not have permission to view this recipe');
        }

        setRecipe(data as Recipe);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user]);

  // Format times (convert ISO duration to human-readable format)
  const formatTime = (isoTime: string | null): string => {
    if (!isoTime) return '';
    
    // Simple parsing of PT#M and PT#H#M formats
    const hours = isoTime.match(/PT(\d+)H/);
    const minutes = isoTime.match(/(?:PT|\d+H)(\d+)M/);
    
    const hoursValue = hours ? parseInt(hours[1]) : 0;
    const minutesValue = minutes ? parseInt(minutes[1]) : 0;
    
    if (hoursValue > 0 && minutesValue > 0) {
      return `${hoursValue} hr ${minutesValue} min`;
    } else if (hoursValue > 0) {
      return `${hoursValue} hr`;
    } else if (minutesValue > 0) {
      return `${minutesValue} min`;
    }
    
    return isoTime;
  };

  // Handle recipe deletion
  const handleDelete = async () => {
    if (!recipe || !window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipe.id);

      if (error) {
        throw error;
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setError('Failed to delete recipe. Please try again.');
    }
  };

  // Handle toggle public/private
  const handleTogglePublic = async () => {
    if (!recipe) return;

    try {
      const { data, error } = await supabase
        .from('recipes')
        .update({ is_public: !recipe.is_public })
        .eq('id', recipe.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setRecipe(data as Recipe);
    } catch (err) {
      console.error('Error toggling recipe visibility:', err);
      setError('Failed to update recipe. Please try again.');
    }
  };

  // Adjust ingredient quantities based on servings multiplier
  const adjustQuantity = (ingredient: string): string => {
    if (servingsMultiplier === 1) return ingredient;
    
    // Try to extract a number from the beginning of the ingredient
    const match = ingredient.match(/^([\d¼½¾⅓⅔⅛⅜⅝⅞]+\s*(?:-\s*[\d¼½¾⅓⅔⅛⅜⅝⅞]+)?)(\s+)(.+)$/);
    
    if (!match) return ingredient;
    
    const [, quantity, space, rest] = match;
    
    // Function to convert fractions to decimal
    const fractionToDecimal = (fraction: string): number => {
      const fractionMap: Record<string, number> = {
        '¼': 0.25, '½': 0.5, '¾': 0.75, '⅓': 0.33, '⅔': 0.67, 
        '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875
      };
      
      if (fraction in fractionMap) {
        return fractionMap[fraction];
      }
      
      // Handle mixed numbers like "1 1/2"
      const mixedMatch = fraction.match(/(\d+)\s+(\d+)\/(\d+)/);
      if (mixedMatch) {
        const [, whole, numerator, denominator] = mixedMatch;
        return parseInt(whole) + (parseInt(numerator) / parseInt(denominator));
      }
      
      // Handle simple fractions like "1/2"
      const simpleMatch = fraction.match(/(\d+)\/(\d+)/);
      if (simpleMatch) {
        const [, numerator, denominator] = simpleMatch;
        return parseInt(numerator) / parseInt(denominator);
      }
      
      return parseFloat(fraction);
    };
    
    // Handle ranges like "1-2 cups"
    if (quantity.includes('-')) {
      const [min, max] = quantity.split('-').map(q => q.trim());
      const minNum = fractionToDecimal(min);
      const maxNum = fractionToDecimal(max);
      
      const adjustedMin = (minNum * servingsMultiplier).toFixed(2).replace(/\.00$/, '');
      const adjustedMax = (maxNum * servingsMultiplier).toFixed(2).replace(/\.00$/, '');
      
      return `${adjustedMin}-${adjustedMax}${space}${rest}`;
    }
    
    // Handle simple quantities
    const num = fractionToDecimal(quantity);
    const adjusted = (num * servingsMultiplier).toFixed(2).replace(/\.00$/, '');
    
    return `${adjusted}${space}${rest}`;
  };

  if (loading) {
    return (
      <div className="recipe-detail__loading">
        <div className="recipe-detail__spinner"></div>
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="recipe-detail__error">
        <span className="material-icons">error</span>
        <h2>Error</h2>
        <p>{error || 'Recipe not found'}</p>
        <Link to="/dashboard" className="recipe-detail__back-link">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-detail__header">
        <div>
          <Link to="/dashboard" className="recipe-detail__back">
            <span className="material-icons">arrow_back</span>
            Back to Dashboard
          </Link>
          <h1 className="recipe-detail__title">{recipe.title}</h1>
          {recipe.description && (
            <p className="recipe-detail__description">{recipe.description}</p>
          )}
        </div>
        
        {user?.id === recipe.user_id && (
          <div className="recipe-detail__actions">
            <button
              className="recipe-detail__action-btn"
              onClick={handleTogglePublic}
              aria-label={recipe.is_public ? 'Make private' : 'Share publicly'}
            >
              <span className="material-icons">
                {recipe.is_public ? 'public' : 'public_off'}
              </span>
              {recipe.is_public ? 'Public' : 'Private'}
            </button>
            
            <Link to={`/edit-recipe/${recipe.id}`} className="recipe-detail__action-btn">
              <span className="material-icons">edit</span>
              Edit
            </Link>
            
            <button
              className="recipe-detail__action-btn recipe-detail__action-btn--danger"
              onClick={handleDelete}
              aria-label="Delete recipe"
            >
              <span className="material-icons">delete</span>
              Delete
            </button>
          </div>
        )}
      </div>
      
      <div className="recipe-detail__content">
        <div className="recipe-detail__main">
          {recipe.image && (
            <img src={recipe.image} alt={recipe.title} className="recipe-detail__image" />
          )}
          
          <div className="recipe-detail__info">
            <div className="recipe-detail__meta">
              {recipe.prep_time && (
                <div className="recipe-detail__meta-item">
                  <span className="material-icons">schedule</span>
                  <div>
                    <span className="recipe-detail__meta-label">Prep Time</span>
                    <span className="recipe-detail__meta-value">{formatTime(recipe.prep_time)}</span>
                  </div>
                </div>
              )}
              
              {recipe.cook_time && (
                <div className="recipe-detail__meta-item">
                  <span className="material-icons">outdoor_grill</span>
                  <div>
                    <span className="recipe-detail__meta-label">Cook Time</span>
                    <span className="recipe-detail__meta-value">{formatTime(recipe.cook_time)}</span>
                  </div>
                </div>
              )}
              
              {recipe.total_time && (
                <div className="recipe-detail__meta-item">
                  <span className="material-icons">timelapse</span>
                  <div>
                    <span className="recipe-detail__meta-label">Total Time</span>
                    <span className="recipe-detail__meta-value">{formatTime(recipe.total_time)}</span>
                  </div>
                </div>
              )}
              
              {recipe.servings && (
                <div className="recipe-detail__meta-item">
                  <span className="material-icons">people</span>
                  <div>
                    <span className="recipe-detail__meta-label">Servings</span>
                    <span className="recipe-detail__meta-value">{recipe.servings}</span>
                  </div>
                </div>
              )}
            </div>
            
            {recipe.source_url && (
              <div className="recipe-detail__source">
                <span className="recipe-detail__source-label">Source:</span>
                <a 
                  href={recipe.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="recipe-detail__source-link"
                >
                  {recipe.source_website || recipe.source_url}
                  <span className="material-icons">open_in_new</span>
                </a>
              </div>
            )}
            
            {recipe.category && recipe.category.length > 0 && (
              <div className="recipe-detail__categories">
                {recipe.category.map((cat) => (
                  <span key={cat} className="recipe-detail__category">
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="recipe-detail__ingredients">
            <div className="recipe-detail__section-header">
              <h2>Ingredients</h2>
              {recipe.servings && (
                <div className="recipe-detail__servings-control">
                  <button
                    className="recipe-detail__servings-btn"
                    onClick={() => setServingsMultiplier(Math.max(0.5, servingsMultiplier - 0.5))}
                    disabled={servingsMultiplier <= 0.5}
                  >
                    <span className="material-icons">remove</span>
                  </button>
<span className="recipe-detail__servings-value">
                    {Math.round(recipe.servings * servingsMultiplier)} servings
                  </span>
                  <button
                    className="recipe-detail__servings-btn"
                    onClick={() => setServingsMultiplier(servingsMultiplier + 0.5)}
                  >
                    <span className="material-icons">add</span>
                  </button>
                </div>
              )}
            </div>
            <ul className="recipe-detail__ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="recipe-detail__ingredient">
                  {adjustQuantity(ingredient)}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="recipe-detail__instructions">
            <h2 className="recipe-detail__section-header">Instructions</h2>
            <ol className="recipe-detail__instructions-list">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="recipe-detail__instruction">
                  {instruction}
                </li>
              ))}
            </ol>
          </div>
          
          {recipe.notes && (
            <div className="recipe-detail__notes">
              <h2 className="recipe-detail__section-header">Notes</h2>
              <p>{recipe.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;