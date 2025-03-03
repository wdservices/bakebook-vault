
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { RecipeForm } from "@/components/recipe/RecipeForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useRecipes } from "@/context/RecipeContext";
import { useToast } from "@/hooks/use-toast";

const EditRecipe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipe } = useRecipes();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState(id ? getRecipe(id) : undefined);
  
  useEffect(() => {
    if (id) {
      const foundRecipe = getRecipe(id);
      setRecipe(foundRecipe);
      
      if (!foundRecipe) {
        toast({
          title: "Recipe not found",
          description: "The recipe you're trying to edit doesn't exist",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  }, [id, getRecipe, navigate, toast]);

  if (!recipe) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center page-transition">
        <Header />
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Recipe Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The recipe you're trying to edit doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 page-transition">
      <Header />
      
      <main className="page-container">
        {/* Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Recipe</h1>
          <p className="text-muted-foreground mt-2">
            Update your recipe details
          </p>
        </div>
        
        {/* Recipe Form with initial data */}
        <RecipeForm 
          initialRecipe={{
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            bakingTemperature: recipe.bakingTemperature,
            bakingTime: recipe.bakingTime,
          }} 
          recipeId={recipe.id}
        />
      </main>
    </div>
  );
};

export default EditRecipe;
