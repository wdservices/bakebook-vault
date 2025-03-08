
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Recipe, NewRecipe } from "@/types/Recipe";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RecipeContextType {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  addRecipe: (recipe: NewRecipe) => Promise<void>;
  updateRecipe: (id: string, updatedRecipe: Partial<Recipe>) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  getRecipe: (id: string) => Recipe | undefined;
  toggleIngredientUsed: (recipeId: string, ingredientId: string) => Promise<void>;
  refreshRecipes: () => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

interface RecipeProviderProps {
  children: ReactNode;
}

export const RecipeProvider = ({ children }: RecipeProviderProps) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user;
  };

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await getCurrentUser();
      
      if (!user) {
        setRecipes([]);
        return;
      }
      
      // Fetch recipes from Supabase
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.email);
      
      if (recipesError) {
        throw recipesError;
      }
      
      if (!recipesData) {
        setRecipes([]);
        return;
      }
      
      // For each recipe, fetch its ingredients and steps
      const fullRecipes = await Promise.all(
        recipesData.map(async (recipe) => {
          // Fetch ingredients
          const { data: ingredientsData, error: ingredientsError } = await supabase
            .from('ingredients')
            .select('*')
            .eq('recipe_id', recipe.id);
          
          if (ingredientsError) {
            console.error("Error fetching ingredients:", ingredientsError);
            throw ingredientsError;
          }
          
          // Fetch steps
          const { data: stepsData, error: stepsError } = await supabase
            .from('steps')
            .select('*')
            .eq('recipe_id', recipe.id)
            .order('step_order', { ascending: true });
          
          if (stepsError) {
            console.error("Error fetching steps:", stepsError);
            throw stepsError;
          }
          
          // Convert to our Recipe type format
          return {
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            ingredients: ingredientsData || [],
            steps: stepsData || [],
            bakingTemperature: recipe.baking_temperature,
            bakingTime: recipe.baking_time,
            createdAt: new Date(recipe.created_at),
            updatedAt: new Date(recipe.updated_at),
            userId: recipe.user_id
          };
        })
      );
      
      setRecipes(fullRecipes);
    } catch (err: any) {
      console.error("Error fetching recipes:", err);
      setError(err.message || "Failed to fetch recipes");
      
      toast({
        title: "Error fetching recipes",
        description: err.message || "There was an error loading your recipes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of recipes
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Listen for auth changes to refresh recipes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchRecipes();
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const refreshRecipes = async () => {
    return fetchRecipes();
  };

  const addRecipe = async (newRecipe: NewRecipe) => {
    try {
      const user = await getCurrentUser();
      
      if (!user) {
        throw new Error("You must be logged in to add a recipe");
      }
      
      // Insert recipe
      const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert([
          {
            title: newRecipe.title,
            description: newRecipe.description,
            baking_temperature: newRecipe.bakingTemperature,
            baking_time: newRecipe.bakingTime,
            user_id: user.email
          }
        ])
        .select()
        .single();
      
      if (recipeError) {
        throw recipeError;
      }
      
      if (!recipeData) {
        throw new Error("Failed to create recipe");
      }
      
      // Insert ingredients
      const ingredients = newRecipe.ingredients.map(ingredient => ({
        recipe_id: recipeData.id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        is_used: ingredient.isUsed
      }));
      
      if (ingredients.length > 0) {
        const { error: ingredientsError } = await supabase
          .from('ingredients')
          .insert(ingredients);
        
        if (ingredientsError) {
          throw ingredientsError;
        }
      }
      
      // Insert steps
      const steps = newRecipe.steps.map((step, index) => ({
        recipe_id: recipeData.id,
        description: step.description,
        step_order: index
      }));
      
      if (steps.length > 0) {
        const { error: stepsError } = await supabase
          .from('steps')
          .insert(steps);
        
        if (stepsError) {
          throw stepsError;
        }
      }
      
      // Refresh recipes after adding
      await fetchRecipes();
      
      toast({
        title: "Recipe created",
        description: "Your recipe has been created successfully",
      });
    } catch (err: any) {
      console.error("Error adding recipe:", err);
      
      toast({
        title: "Error creating recipe",
        description: err.message || "There was an error creating your recipe",
        variant: "destructive",
      });
      
      throw err;
    }
  };

  const updateRecipe = async (id: string, updatedRecipe: Partial<Recipe>) => {
    try {
      const user = await getCurrentUser();
      
      if (!user) {
        throw new Error("You must be logged in to update a recipe");
      }
      
      // Update recipe
      if (updatedRecipe.title || updatedRecipe.description || 
          updatedRecipe.bakingTemperature || updatedRecipe.bakingTime) {
        const { error: recipeError } = await supabase
          .from('recipes')
          .update({
            title: updatedRecipe.title,
            description: updatedRecipe.description,
            baking_temperature: updatedRecipe.bakingTemperature,
            baking_time: updatedRecipe.bakingTime,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .eq('user_id', user.email);
        
        if (recipeError) {
          throw recipeError;
        }
      }
      
      // Update ingredients if provided
      if (updatedRecipe.ingredients) {
        // First delete all existing ingredients
        const { error: deleteIngredientsError } = await supabase
          .from('ingredients')
          .delete()
          .eq('recipe_id', id);
        
        if (deleteIngredientsError) {
          throw deleteIngredientsError;
        }
        
        // Then insert new ingredients
        const ingredients = updatedRecipe.ingredients.map(ingredient => ({
          recipe_id: id,
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          is_used: ingredient.isUsed
        }));
        
        if (ingredients.length > 0) {
          const { error: ingredientsError } = await supabase
            .from('ingredients')
            .insert(ingredients);
          
          if (ingredientsError) {
            throw ingredientsError;
          }
        }
      }
      
      // Update steps if provided
      if (updatedRecipe.steps) {
        // First delete all existing steps
        const { error: deleteStepsError } = await supabase
          .from('steps')
          .delete()
          .eq('recipe_id', id);
        
        if (deleteStepsError) {
          throw deleteStepsError;
        }
        
        // Then insert new steps
        const steps = updatedRecipe.steps.map((step, index) => ({
          recipe_id: id,
          description: step.description,
          step_order: index
        }));
        
        if (steps.length > 0) {
          const { error: stepsError } = await supabase
            .from('steps')
            .insert(steps);
          
          if (stepsError) {
            throw stepsError;
          }
        }
      }
      
      // Refresh recipes after update
      await fetchRecipes();
      
      toast({
        title: "Recipe updated",
        description: "Your recipe has been updated successfully",
      });
    } catch (err: any) {
      console.error("Error updating recipe:", err);
      
      toast({
        title: "Error updating recipe",
        description: err.message || "There was an error updating your recipe",
        variant: "destructive",
      });
      
      throw err;
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      const user = await getCurrentUser();
      
      if (!user) {
        throw new Error("You must be logged in to delete a recipe");
      }
      
      // Delete recipe (cascade will delete ingredients and steps)
      const { error: deleteError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.email);
      
      if (deleteError) {
        throw deleteError;
      }
      
      // Refresh recipes after delete
      await fetchRecipes();
      
      toast({
        title: "Recipe deleted",
        description: "Your recipe has been deleted successfully",
      });
    } catch (err: any) {
      console.error("Error deleting recipe:", err);
      
      toast({
        title: "Error deleting recipe",
        description: err.message || "There was an error deleting your recipe",
        variant: "destructive",
      });
      
      throw err;
    }
  };

  const getRecipe = (id: string) => {
    return recipes.find((recipe) => recipe.id === id);
  };

  const toggleIngredientUsed = async (recipeId: string, ingredientId: string) => {
    try {
      // Find the ingredient to toggle
      const recipe = recipes.find(r => r.id === recipeId);
      if (!recipe) return;
      
      const ingredient = recipe.ingredients.find(i => i.id === ingredientId);
      if (!ingredient) return;
      
      // Update in Supabase
      const { error } = await supabase
        .from('ingredients')
        .update({ is_used: !ingredient.isUsed })
        .eq('id', ingredientId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setRecipes(prev => 
        prev.map(recipe => {
          if (recipe.id !== recipeId) return recipe;
          
          return {
            ...recipe,
            ingredients: recipe.ingredients.map(ing => 
              ing.id === ingredientId 
                ? { ...ing, isUsed: !ing.isUsed } 
                : ing
            ),
            updatedAt: new Date()
          };
        })
      );
    } catch (err: any) {
      console.error("Error toggling ingredient:", err);
      
      toast({
        title: "Error updating ingredient",
        description: err.message || "There was an error updating the ingredient",
        variant: "destructive",
      });
    }
  };

  return (
    <RecipeContext.Provider 
      value={{ 
        recipes, 
        loading,
        error,
        addRecipe, 
        updateRecipe, 
        deleteRecipe, 
        getRecipe,
        toggleIngredientUsed,
        refreshRecipes
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
