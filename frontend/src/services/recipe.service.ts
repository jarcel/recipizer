// frontend/src/services/recipe.service.ts
import { supabase } from '../supabase/client';
import { Recipe, RecipeFormData } from '../types/Recipe';

export class RecipeService {
  /**
   * Get all recipes for the current user
   */
  static async getUserRecipes(): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as Recipe[];
  }

  /**
   * Get a recipe by ID
   */
  static async getRecipeById(id: string): Promise<Recipe> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data as Recipe;
  }

  /**
   * Create a new recipe
   */
  static async createRecipe(recipeData: RecipeFormData): Promise<Recipe> {
    const { data, error } = await supabase
      .from('recipes')
      .insert(recipeData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Recipe;
  }

  /**
   * Update an existing recipe
   */
  static async updateRecipe(id: string, recipeData: Partial<RecipeFormData>): Promise<Recipe> {
    const { data, error } = await supabase
      .from('recipes')
      .update({
        ...recipeData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Recipe;
  }

  /**
   * Delete a recipe
   */
  static async deleteRecipe(id: string): Promise<void> {
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  /**
   * Toggle a recipe's public status
   */
  static async togglePublicStatus(id: string, isPublic: boolean): Promise<Recipe> {
    const { data, error } = await supabase
      .from('recipes')
      .update({
        is_public: !isPublic,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Recipe;
  }

  /**
   * Get public recipes
   */
  static async getPublicRecipes(limit = 10): Promise<Recipe[]> {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data as Recipe[];
  }
}

export default RecipeService;