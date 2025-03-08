
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Recipe, NewRecipe } from "@/types/Recipe";

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: NewRecipe) => void;
  updateRecipe: (id: string, updatedRecipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  getRecipe: (id: string) => Recipe | undefined;
  toggleIngredientUsed: (recipeId: string, ingredientId: string) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

interface RecipeProviderProps {
  children: ReactNode;
}

export const RecipeProvider = ({ children }: RecipeProviderProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const savedRecipes = localStorage.getItem("recipes");
    if (savedRecipes) {
      try {
        // Parse dates correctly when loading from localStorage
        const parsed = JSON.parse(savedRecipes);
        // Filter recipes based on the current logged-in user
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const filteredRecipes = parsed.filter((recipe: Recipe) => 
          !recipe.userId || recipe.userId === currentUser.email
        );
        
        return filteredRecipes.map((recipe: any) => ({
          ...recipe,
          createdAt: new Date(recipe.createdAt),
          updatedAt: new Date(recipe.updatedAt),
        }));
      } catch (e) {
        console.error("Failed to parse recipes from localStorage", e);
        return [];
      }
    }
    return [];
  });

  // Save recipes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  // Re-filter recipes whenever the user changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedRecipes = localStorage.getItem("recipes");
      if (savedRecipes) {
        try {
          const parsed = JSON.parse(savedRecipes);
          const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
          const filteredRecipes = parsed.filter((recipe: Recipe) => 
            !recipe.userId || recipe.userId === currentUser.email
          );
          
          setRecipes(filteredRecipes.map((recipe: any) => ({
            ...recipe,
            createdAt: new Date(recipe.createdAt),
            updatedAt: new Date(recipe.updatedAt),
          })));
        } catch (e) {
          console.error("Failed to parse recipes from localStorage during user change", e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addRecipe = (newRecipe: NewRecipe) => {
    const now = new Date();
    // Get the current user's email to associate with the recipe
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    
    const recipe: Recipe = {
      ...newRecipe,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      userId: currentUser.email // Associate recipe with current user
    };
    setRecipes((prev) => [...prev, recipe]);
  };

  const updateRecipe = (id: string, updatedRecipe: Partial<Recipe>) => {
    setRecipes((prev) => 
      prev.map((recipe) => 
        recipe.id === id 
          ? { 
              ...recipe, 
              ...updatedRecipe, 
              updatedAt: new Date() 
            } 
          : recipe
      )
    );
  };

  const deleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  };

  const getRecipe = (id: string) => {
    return recipes.find((recipe) => recipe.id === id);
  };

  const toggleIngredientUsed = (recipeId: string, ingredientId: string) => {
    setRecipes((prev) => 
      prev.map((recipe) => {
        if (recipe.id !== recipeId) return recipe;
        
        return {
          ...recipe,
          ingredients: recipe.ingredients.map((ingredient) => 
            ingredient.id === ingredientId 
              ? { ...ingredient, isUsed: !ingredient.isUsed } 
              : ingredient
          ),
          updatedAt: new Date()
        };
      })
    );
  };

  return (
    <RecipeContext.Provider 
      value={{ 
        recipes, 
        addRecipe, 
        updateRecipe, 
        deleteRecipe, 
        getRecipe,
        toggleIngredientUsed 
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return context;
};
