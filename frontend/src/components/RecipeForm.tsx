import React, { useState, useEffect } from 'react';
import { RecipeFormData } from '../types/Recipe';
import './RecipeForm.scss';

interface RecipeFormProps {
  initialData?: Partial<RecipeFormData>;
  onSubmit: (data: RecipeFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}) => {
  // Initialize form state with initial data or defaults
  const [formData, setFormData] = useState<RecipeFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    ingredients: initialData.ingredients || [''],
    instructions: initialData.instructions || [''],
    prep_time: initialData.prep_time || '',
    cook_time: initialData.cook_time || '',
    total_time: initialData.total_time || '',
    servings: initialData.servings || 0,
    cuisine: initialData.cuisine || '',
    category: initialData.category || [],
    source_url: initialData.source_url || '',
    notes: initialData.notes || '',
    is_public: initialData.is_public || false
  });

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseInt(value)
    }));
  };

  // Handle ingredient input changes
  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = value;
    
    setFormData(prev => ({
      ...prev,
      ingredients: updatedIngredients
    }));
  };

  // Add new ingredient input
  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  // Remove ingredient input
  const removeIngredient = (index: number) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      ingredients: updatedIngredients
    }));
  };

  // Handle instruction input changes
  const handleInstructionChange = (index: number, value: string) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions[index] = value;
    
    setFormData(prev => ({
      ...prev,
      instructions: updatedInstructions
    }));
  };

  // Add new instruction input
  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  // Remove instruction input
  const removeInstruction = (index: number) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      instructions: updatedInstructions
    }));
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setFormData(prev => {
      const updatedCategories = [...prev.category];
      
      // Add or remove the category
      if (updatedCategories.includes(category)) {
        return {
          ...prev,
          category: updatedCategories.filter(c => c !== category)
        };
      } else {
        return {
          ...prev,
          category: [...updatedCategories, category]
        };
      }
    });
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty ingredients and instructions
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter(ingredient => ingredient.trim() !== ''),
      instructions: formData.instructions.filter(instruction => instruction.trim() !== '')
    };
    
    onSubmit(cleanedData);
  };

  // Available recipe categories
  const categories = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Appetizer',
    'Soup',
    'Salad',
    'Main Course',
    'Side Dish',
    'Dessert',
    'Snack',
    'Beverage',
    'Baking',
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Low-Carb',
    'Keto',
    'Paleo'
  ];

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      <div className="recipe-form__section">
        <h3 className="recipe-form__section-title">Basic Information</h3>
        
        <div className="recipe-form__field">
          <label htmlFor="title" className="recipe-form__label">
            Recipe Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="recipe-form__input"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="recipe-form__field">
          <label htmlFor="description" className="recipe-form__label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="recipe-form__textarea"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="recipe-form__field">
          <label htmlFor="source_url" className="recipe-form__label">
            Source URL
          </label>
          <input
            type="url"
            id="source_url"
            name="source_url"
            value={formData.source_url}
            onChange={handleChange}
            className="recipe-form__input"
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="recipe-form__section">
        <h3 className="recipe-form__section-title">Ingredients</h3>
        
        <div className="recipe-form__list">
          {formData.ingredients.map((ingredient, index) => (
            <div key={`ingredient-${index}`} className="recipe-form__list-item">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                className="recipe-form__input"
                placeholder="e.g., 2 cups flour"
                data-testid="ingredient-input"
                disabled={isSubmitting}
              />
              
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="recipe-form__list-remove-btn"
                aria-label="Remove ingredient"
                data-testid="remove-ingredient-button"
                disabled={formData.ingredients.length <= 1 || isSubmitting}
              >
                <span className="material-icons">delete</span>
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addIngredient}
            className="recipe-form__list-add-btn"
            data-testid="add-ingredient-button"
            disabled={isSubmitting}
          >
            <span className="material-icons">add</span>
            Add Ingredient
          </button>
        </div>
      </div>
      
      <div className="recipe-form__section">
        <h3 className="recipe-form__section-title">Instructions</h3>
        
        <div className="recipe-form__list">
          {formData.instructions.map((instruction, index) => (
            <div key={`instruction-${index}`} className="recipe-form__list-item">
              <textarea
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                className="recipe-form__textarea"
                placeholder={`Step ${index + 1}`}
                rows={2}
                data-testid="instruction-input"
                disabled={isSubmitting}
              />
              
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="recipe-form__list-remove-btn"
                aria-label="Remove instruction"
                data-testid="remove-instruction-button"
                disabled={formData.instructions.length <= 1 || isSubmitting}
              >
                <span className="material-icons">delete</span>
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addInstruction}
            className="recipe-form__list-add-btn"
            data-testid="add-instruction-button"
            disabled={isSubmitting}
          >
            <span className="material-icons">add</span>
            Add Step
          </button>
        </div>
      </div>
      
      <div className="recipe-form__section">
        <h3 className="recipe-form__section-title">Additional Details</h3>
        
        <div className="recipe-form__row">
          <div className="recipe-form__field recipe-form__field--half">
            <label htmlFor="prep_time" className="recipe-form__label">
              Prep Time (minutes)
            </label>
            <input
              type="number"
              id="prep_time"
              name="prep_time"
              value={formData.prep_time}
              onChange={handleChange}
              className="recipe-form__input"
              min="0"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="recipe-form__field recipe-form__field--half">
            <label htmlFor="cook_time" className="recipe-form__label">
              Cook Time (minutes)
            </label>
            <input
              type="number"
              id="cook_time"
              name="cook_time"
              value={formData.cook_time}
              onChange={handleChange}
              className="recipe-form__input"
              min="0"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="recipe-form__row">
          <div className="recipe-form__field recipe-form__field--half">
            <label htmlFor="total_time" className="recipe-form__label">
              Total Time (minutes)
            </label>
            <input
              type="number"
              id="total_time"
              name="total_time"
              value={formData.total_time}
              onChange={handleChange}
              className="recipe-form__input"
              min="0"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="recipe-form__field recipe-form__field--half">
            <label htmlFor="servings" className="recipe-form__label">
              Servings
            </label>
            <input
              type="number"
              id="servings"
              name="servings"
              value={formData.servings || ''}
              onChange={handleNumberChange}
              className="recipe-form__input"
              min="0"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="recipe-form__field">
          <label htmlFor="cuisine" className="recipe-form__label">
            Cuisine
          </label>
          <input
            type="text"
            id="cuisine"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            className="recipe-form__input"
            placeholder="e.g., Italian, Mexican, Thai"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="recipe-form__field">
          <label className="recipe-form__label">Categories</label>
          <div className="recipe-form__categories">
            {categories.map(category => (
              <label key={category} className="recipe-form__category-label">
                <input
                  type="checkbox"
                  checked={formData.category.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="recipe-form__category-checkbox"
                  disabled={isSubmitting}
                />
                {category}
              </label>
            ))}
          </div>
        </div>
        
        <div className="recipe-form__field">
          <label htmlFor="notes" className="recipe-form__label">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="recipe-form__textarea"
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </div>
      
      <div className="recipe-form__actions">
        <button 
          type="button" 
          onClick={onCancel} 
          className="recipe-form__button recipe-form__button--secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="recipe-form__button recipe-form__button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Recipe'}
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;