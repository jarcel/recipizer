import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecipeCard from '../RecipeCard';
import { Recipe } from '../../types/Recipe';

// Mock recipe data
const mockRecipe: Recipe = {
  id: '1',
  created_at: '2023-01-01T00:00:00.000Z',
  updated_at: '2023-01-01T00:00:00.000Z',
  user_id: 'user1',
  title: 'Test Recipe',
  description: 'A delicious test recipe',
  ingredients: ['Ingredient 1', 'Ingredient 2'],
  instructions: ['Step 1', 'Step 2'],
  prep_time: '10 mins',
  cook_time: '20 mins',
  total_time: '30 mins',
  servings: 4,
  cuisine: 'Test Cuisine',
  category: ['Test Category'],
  source_url: 'https://example.com/recipe',
  source_website: 'example.com',
  image: 'https://example.com/image.jpg',
  notes: 'Test notes',
  is_public: false
};

// Mock functions
const mockOnDelete = jest.fn();
const mockOnTogglePublic = jest.fn();

// Wrap component with Router for testing
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('RecipeCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders recipe information correctly', () => {
    renderWithRouter(
      <RecipeCard 
        recipe={mockRecipe} 
        onDelete={mockOnDelete} 
        onTogglePublic={mockOnTogglePublic} 
      />
    );

    // Check that main recipe info is displayed
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByText('A delicious test recipe')).toBeInTheDocument();
    expect(screen.getByText('Test Cuisine')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    
    // Check time information
    expect(screen.getByText('30 mins')).toBeInTheDocument();
    
    // Check if the image is rendered with the correct src
    const image = screen.getByAltText('Test Recipe') as HTMLImageElement;
    expect(image.src).toBe('https://example.com/image.jpg');
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithRouter(
      <RecipeCard 
        recipe={mockRecipe} 
        onDelete={mockOnDelete} 
        onTogglePublic={mockOnTogglePublic} 
      />
    );

    // Find and click delete button
    const deleteButton = screen.getByLabelText('Delete recipe');
    fireEvent.click(deleteButton);

    // Check if onDelete was called with the correct ID
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('calls onTogglePublic when share button is clicked', () => {
    renderWithRouter(
      <RecipeCard 
        recipe={mockRecipe} 
        onDelete={mockOnDelete} 
        onTogglePublic={mockOnTogglePublic} 
      />
    );

    // Find and click share button
    const shareButton = screen.getByLabelText('Share recipe');
    fireEvent.click(shareButton);

    // Check if onTogglePublic was called with the correct ID
    expect(mockOnTogglePublic).toHaveBeenCalledWith('1');
  });

  it('displays the correct sharing status', () => {
    // Render with public recipe
    const publicRecipe = { ...mockRecipe, is_public: true };
    renderWithRouter(
      <RecipeCard 
        recipe={publicRecipe} 
        onDelete={mockOnDelete} 
        onTogglePublic={mockOnTogglePublic} 
      />
    );

    // Check for public status indicator
    expect(screen.getByText('Public')).toBeInTheDocument();

    // Re-render with private recipe
    renderWithRouter(
      <RecipeCard 
        recipe={mockRecipe} 
        onDelete={mockOnDelete} 
        onTogglePublic={mockOnTogglePublic} 
      />
    );

    // Check for private status indicator
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('navigates to edit page when edit button is clicked', () => {
    renderWithRouter(
      <RecipeCard 
        recipe={mockRecipe} 
        onDelete={mockOnDelete} 
        onTogglePublic={mockOnTogglePublic} 
      />
    );

    // Find the edit link
    const editLink = screen.getByLabelText('Edit recipe');
    
    // Check if it has the correct href
    expect(editLink.getAttribute('href')).toBe('/edit-recipe/1');
  });

  it('navigates to detail page when title is clicked', () => {
    renderWithRouter(
      <RecipeCard 
        recipe={mockRecipe} 
        onDelete={mockOnDelete} 
        onTogglePublic={mockOnTogglePublic} 
      />
    );

    // Find the title link
    const titleLink = screen.getByText('Test Recipe').closest('a');
    
    // Check if it has the correct href
    expect(titleLink?.getAttribute('href')).toBe('/recipe/1');
  });

  it('shows source website when available', () => {
    renderWithRouter(
      <RecipeCard 
        recipe={mockRecipe} 
        onDelete={mockOnDelete} 
        onTogglePublic={mockOnTogglePublic} 
      />
    );

    // Check for source website text
    expect(screen.getByText('example.com')).toBeInTheDocument();
  });

  it('handles missing image gracefully', () => {
    const recipeWithoutImage = { ...mockRecipe, image: null };
    renderWithRouter(
      <RecipeCard 
        recipe={recipeWithoutImage} 
        onDelete={mockOnDelete} 
        onTogglePublic={mockOnTogglePublic} 
      />
    );

    // Check if placeholder or fallback is used
    // This will depend on your implementation - adjust as needed
    const placeholderImage = screen.getByAltText('Test Recipe') as HTMLImageElement;
    expect(placeholderImage).toBeInTheDocument();
    expect(placeholderImage.src).not.toBe('https://example.com/image.jpg');
  });
});