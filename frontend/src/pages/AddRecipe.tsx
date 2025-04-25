import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { RecipeFormData } from '../types/Recipe';
import RecipeForm from '../components/RecipeForm';
import RecipeUrlScraper from '../components/RecipeUrlScraper';
import './AddRecipe.scss';

const AddRecipe: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Check if user has reached recipe limit
  const hasReachedLimit = profile?.account_type === 'free' && (profile?.recipe_count || 0) >= 25;

  const handleFormSubmit = async (formData: RecipeFormData) => {
    if (hasReachedLimit) {
      setError('Free accounts are limited to 25 recipes. Upgrade to premium for unlimited recipes.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Add user_id to the recipe data
      const recipeData = {
        ...formData,
        user_id: user?.id,
        is_public: false
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from('recipes')
        .insert(recipeData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Navigate to the new recipe
      navigate(`/recipe/${data.id}`);
    } catch (err) {
      console.error('Error adding recipe:', err);
      setError('Failed to save recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-recipe">
      <h1 className="add-recipe__title">Add New Recipe</h1>

      {error && (
        <div className="add-recipe__error">
          <span className="material-icons">error</span>
          {error}
        </div>
      )}

      {hasReachedLimit ? (
        <div className="add-recipe__limit-reached">
          <span className="material-icons">lock</span>
          <h2>Recipe Limit Reached</h2>
          <p>You've reached the 25 recipe limit for free accounts.</p>
          <a href="/pricing" className="add-recipe__upgrade-button">
            Upgrade to Premium
          </a>
        </div>
      ) : (
        <>
          <RecipeUrlScraper />

          <div className="add-recipe__separator">
            <span>OR</span>
          </div>

          <div className="add-recipe__manual">
            <h2 className="add-recipe__subtitle">Enter Recipe Manually</h2>
            <RecipeForm 
              onSubmit={handleFormSubmit} 
              onCancel={() => navigate('/dashboard')}
              isSubmitting={loading}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AddRecipe;