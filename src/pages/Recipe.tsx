
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useRecipes } from "@/context/RecipeContext";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, Edit, Trash2, Clock, ThermometerSun, AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AIRecommendations } from "@/components/recipe/AIRecommendations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Recipe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipe, toggleIngredientUsed, deleteRecipe } = useRecipes();
  const { toast } = useToast();
  const [recipe, setRecipe] = useState(id ? getRecipe(id) : undefined);
  
  useEffect(() => {
    if (id) {
      const foundRecipe = getRecipe(id);
      setRecipe(foundRecipe);
      
      if (!foundRecipe) {
        toast({
          title: "Recipe not found",
          description: "The recipe you're looking for doesn't exist",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  }, [id, getRecipe, navigate, toast]);

  const handleDelete = () => {
    if (id) {
      deleteRecipe(id);
      toast({
        title: "Recipe deleted",
        description: "Your recipe has been deleted successfully",
      });
      navigate("/");
    }
  };

  const handleToggleIngredient = (ingredientId: string) => {
    if (id) {
      toggleIngredientUsed(id, ingredientId);
      // Update local state
      if (recipe) {
        setRecipe({
          ...recipe,
          ingredients: recipe.ingredients.map(ing => 
            ing.id === ingredientId 
              ? { ...ing, isUsed: !ing.isUsed } 
              : ing
          ),
        });
      }
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center page-transition">
        <Header />
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Recipe Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The recipe you're looking for doesn't exist or has been deleted.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Recipes
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 page-transition">
      <Header />
      
      <main className="page-container animate-fade-in">
        {/* Navigation */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recipes
          </Button>
        </div>

        {/* Recipe Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
              <p className="text-muted-foreground">{recipe.description}</p>
            </div>
            
            <div className="flex space-x-2 self-start">
              <Button
                variant="outline"
                size="sm"
                className="subtle-ring"
                onClick={() => navigate(`/edit/${recipe.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="subtle-ring text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the recipe "{recipe.title}". 
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          {/* Baking Info */}
          <div className="mt-6 flex space-x-6">
            <div className="flex items-center text-muted-foreground">
              <ThermometerSun className="mr-2 h-5 w-5" />
              <span>{recipe.bakingTemperature}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-2 h-5 w-5" />
              <span>{recipe.bakingTime}</span>
            </div>
          </div>
        </div>
        
        {/* Three column layout for larger screens */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Ingredients Column */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
            <div className="rounded-lg subtle-ring bg-card p-4">
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient) => (
                  <li 
                    key={ingredient.id} 
                    className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox 
                      id={ingredient.id}
                      checked={ingredient.isUsed}
                      onCheckedChange={() => handleToggleIngredient(ingredient.id)}
                      className="mt-1"
                    />
                    <div className="flex-grow">
                      <label 
                        htmlFor={ingredient.id}
                        className={`cursor-pointer flex flex-wrap items-baseline ${
                          ingredient.isUsed ? "text-muted-foreground line-through" : ""
                        }`}
                      >
                        <span className="font-medium mr-2">{ingredient.name}</span>
                        {(ingredient.amount || ingredient.unit) && (
                          <span className="text-sm text-muted-foreground">
                            {ingredient.amount} {ingredient.unit}
                          </span>
                        )}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Steps Column */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Instructions</h2>
            <div className="rounded-lg subtle-ring bg-card p-4">
              <ol className="space-y-6">
                {recipe.steps.map((step, index) => (
                  <li key={step.id} className="flex space-x-4">
                    <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-grow pt-1">
                      <p>{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          {/* AI Recommendations Column */}
          <div>
            <h2 className="text-xl font-semibold mb-4">AI Suggestions</h2>
            <AIRecommendations recipe={recipe} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Recipe;
