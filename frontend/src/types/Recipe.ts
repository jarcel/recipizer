export interface Recipe {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: string[];
  instructions: string[];
  prep_time: string | null;
  cook_time: string | null;
  total_time: string | null;
  servings: number | null;
  cuisine: string | null;
  category: string[] | null;
  source_url: string | null;
  source_website: string | null;
  image: string | null;
  notes: string | null;
  is_public: boolean;
}

export interface RecipeFormData {
  title: string;
  description: string | null;
  ingredients: string[];
  instructions: string[];
  prep_time: string | null;
  cook_time: string | null;
  total_time: string | null;
  servings: number | null;
  cuisine: string | null;
  category: string[] | null;
  source_url: string | null;
  notes: string | null;
  is_public: boolean;
}