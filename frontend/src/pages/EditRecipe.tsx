import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { Recipe, RecipeFormData } from '../types/Recipe';
import RecipeForm from '../components/RecipeForm';
import './EditRecipe.scss';

const EditRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipe when component mounts
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

        // Check if the user owns this recipe
        if (data.user_id !== user?.id) {
          throw new Error('You do not have permission to edit this recipe');
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

  // Handle form submission
  const handleFormSubmit = async (formData: RecipeFormData) => {
    if (!recipe) return;

    try {
      setSubmitting(true);
      setError(null);

      // Prepare update data
      const updateData = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      // Update in Supabase
      const { data, error } = await supabase
        .from('recipes')
        .update(updateData)
        .eq('id', recipe.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Navigate back to the recipe detail
      navigate(`/recipe/${recipe.id}`);
    } catch (err) {
      console.error('Error updating recipe:', err);
      setError('Failed to update recipe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-recipe__loading">
        <div className="edit-recipe__spinner"></div>
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="edit-recipe__error">
        <span className="material-icons">error</span>
        <h2>Error</h2>
        <p>{error || 'Recipe not found'}</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="edit-recipe__back-button"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="edit-recipe">
      <h1 className="edit-recipe__title">Edit Recipe</h1>
      
      {error && (
        <div className="edit-recipe__error-message">
          <span className="material-icons">error</span>
          {error}
        </div>
      )}
      
      <RecipeForm
        initialData={recipe}
        onSubmit={handleFormSubmit}
        onCancel={() => navigate(`/recipe/${recipe.id}`)}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default EditRecipe;