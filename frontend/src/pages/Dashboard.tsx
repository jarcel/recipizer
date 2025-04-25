import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { Recipe } from '../types/Recipe';
import RecipeCard from '../components/RecipeCard';
import './Dashboard.scss';

const Dashboard: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const { user, profile } = useAuth();

  // Fetch recipes when component mounts
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setRecipes(data as Recipe[]);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user]);

  // Filter recipes based on search term and category
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = searchTerm
      ? recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recipe.description?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        recipe.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;

    const matchesCategory = filterCategory
      ? recipe.category?.includes(filterCategory)
      : true;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories from all recipes
  const categories = Array.from(
    new Set(
      recipes.flatMap(recipe => recipe.category || [])
    )
  ).sort();

  // Handle recipe deletion
  const handleDeleteRecipe = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update recipes after deletion
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setError('Failed to delete recipe. Please try again.');
    }
  };

  // Handle toggle public/private
  const handleTogglePublic = async (id: string) => {
    try {
      // Find the recipe
      const recipe = recipes.find(r => r.id === id);
      
      if (!recipe) return;

      // Toggle is_public status
      const { data, error } = await supabase
        .from('recipes')
        .update({ is_public: !recipe.is_public })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update recipes after toggle
      setRecipes(recipes.map(r => r.id === id ? data as Recipe : r));
    } catch (err) {
      console.error('Error toggling recipe visibility:', err);
      setError('Failed to update recipe. Please try again.');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">My Recipes</h1>
        <div className="dashboard__user-info">
          <span className="dashboard__recipe-count">
            {profile?.recipe_count || 0} {profile?.recipe_count === 1 ? 'Recipe' : 'Recipes'}
          </span>
          {profile?.account_type === 'free' && (
            <span className="dashboard__account-limit">
              {profile.recipe_count}/25
            </span>
          )}
        </div>
      </div>

      <div className="dashboard__controls">
        <div className="dashboard__search">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dashboard__search-input"
          />
          <span className="material-icons dashboard__search-icon">search</span>
        </div>

        <div className="dashboard__filter">
          <select
            value={filterCategory || ''}
            onChange={(e) => setFilterCategory(e.target.value || null)}
            className="dashboard__filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <Link to="/add-recipe" className="dashboard__add-button">
          <span className="material-icons">add</span>
          Add Recipe
        </Link>
      </div>

      {error && (
        <div className="dashboard__error">
          <span className="material-icons">error</span>
          {error}
        </div>
      )}

      {loading ? (
        <div className="dashboard__loading">
          <div className="dashboard__spinner"></div>
          <p>Loading your recipes...</p>
        </div>
      ) : filteredRecipes.length > 0 ? (
        <div className="dashboard__recipe-grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={handleDeleteRecipe}
              onTogglePublic={handleTogglePublic}
            />
          ))}
        </div>
      ) : (
        <div className="dashboard__empty">
          {searchTerm || filterCategory ? (
            <>
              <span className="material-icons dashboard__empty-icon">search_off</span>
              <h2>No matching recipes found</h2>
              <p>Try adjusting your search or filter</p>
            </>
          ) : (
            <>
              <span className="material-icons dashboard__empty-icon">restaurant</span>
              <h2>You haven't saved any recipes yet</h2>
              <p>Start by adding your first recipe</p>
              <Link to="/add-recipe" className="dashboard__empty-button">
                Add Your First Recipe
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;