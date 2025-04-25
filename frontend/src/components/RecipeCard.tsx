import React from 'react';
import { Link } from 'react-router-dom';
import { Recipe } from '../types/Recipe';
import './RecipeCard.scss';

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (id: string) => void;
  onTogglePublic: (id: string) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onDelete, onTogglePublic }) => {
  // Format times (convert ISO duration to minutes)
  const formatTime = (isoTime: string | null): string => {
    if (!isoTime) return '';
    
    // Simple parsing of PT#M format
    const minutes = isoTime.match(/PT(\d+)M/);
    return minutes ? `${minutes[1]} min` : isoTime;
  };

  const totalTime = formatTime(recipe.total_time);
  
  // Handle delete with confirmation
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      onDelete(recipe.id);
    }
  };

  return (
    <div className="recipe-card">
      <div className="recipe-card__image-container">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} className="recipe-card__image" />
        ) : (
          <div className="recipe-card__image-placeholder">
            <span className="material-icons">restaurant_menu</span>
          </div>
        )}
        <div className="recipe-card__actions">
          <button 
            className={`recipe-card__action-btn ${recipe.is_public ? 'active' : ''}`}
            onClick={() => onTogglePublic(recipe.id)}
            aria-label="Toggle public sharing"
          >
            <span className="material-icons">
              {recipe.is_public ? 'public' : 'public_off'}
            </span>
          </button>
          <button 
            className="recipe-card__action-btn danger"
            onClick={handleDelete}
            aria-label="Delete recipe"
          >
            <span className="material-icons">delete</span>
          </button>
        </div>
      </div>
      
      <div className="recipe-card__content">
        <Link to={`/recipe/${recipe.id}`} className="recipe-card__title-link">
          <h3 className="recipe-card__title">{recipe.title}</h3>
        </Link>
        
        <p className="recipe-card__description">{recipe.description}</p>
        
        <div className="recipe-card__meta">
          {totalTime && (
            <span className="recipe-card__time">
              <span className="material-icons">schedule</span>
              {totalTime}
            </span>
          )}
          {recipe.source_website && (
            <span className="recipe-card__source">
              <span className="material-icons">link</span>
              {recipe.source_website}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;