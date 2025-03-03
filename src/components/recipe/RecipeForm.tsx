
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { XCircle, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NewRecipe, Ingredient, Step } from "@/types/Recipe";
import { useRecipes } from "@/context/RecipeContext";

interface RecipeFormProps {
  initialRecipe?: NewRecipe;
  recipeId?: string;
}

const emptyIngredient = (): Ingredient => ({
  id: crypto.randomUUID(),
  name: "",
  amount: "",
  unit: "",
  isUsed: false,
});

const emptyStep = (): Step => ({
  id: crypto.randomUUID(),
  description: "",
});

const emptyRecipe: NewRecipe = {
  title: "",
  description: "",
  ingredients: [emptyIngredient()],
  steps: [emptyStep()],
  bakingTemperature: "",
  bakingTime: "",
};

export function RecipeForm({ initialRecipe = emptyRecipe, recipeId }: RecipeFormProps) {
  const [recipe, setRecipe] = useState<NewRecipe>(initialRecipe);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addRecipe, updateRecipe } = useRecipes();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!recipe.title.trim()) {
        throw new Error("Recipe title is required");
      }

      if (recipe.ingredients.some(ing => !ing.name.trim())) {
        throw new Error("All ingredients must have a name");
      }

      if (recipe.steps.some(step => !step.description.trim())) {
        throw new Error("All steps must have a description");
      }

      if (recipeId) {
        // Update existing recipe
        updateRecipe(recipeId, recipe);
        toast({
          title: "Recipe updated",
          description: "Your recipe has been updated successfully",
        });
      } else {
        // Add new recipe
        addRecipe(recipe);
        toast({
          title: "Recipe created",
          description: "Your new recipe has been saved",
        });
      }

      // Redirect back to homepage
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof NewRecipe, value: any) => {
    setRecipe(prev => ({ ...prev, [field]: value }));
  };

  // Ingredient handlers
  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, emptyIngredient()],
    }));
  };

  const removeIngredient = (id: string) => {
    if (recipe.ingredients.length <= 1) return;
    
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing.id !== id),
    }));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ing => 
        ing.id === id ? { ...ing, [field]: value } : ing
      ),
    }));
  };

  // Move ingredient up or down in the list
  const moveIngredient = (id: string, direction: "up" | "down") => {
    const index = recipe.ingredients.findIndex(ing => ing.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === recipe.ingredients.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newIngredients = [...recipe.ingredients];
    const ingredient = newIngredients[index];
    newIngredients.splice(index, 1);
    newIngredients.splice(newIndex, 0, ingredient);

    setRecipe(prev => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  // Step handlers
  const addStep = () => {
    setRecipe(prev => ({
      ...prev,
      steps: [...prev.steps, emptyStep()],
    }));
  };

  const removeStep = (id: string) => {
    if (recipe.steps.length <= 1) return;
    
    setRecipe(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== id),
    }));
  };

  const updateStep = (id: string, description: string) => {
    setRecipe(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === id ? { ...step, description } : step
      ),
    }));
  };

  // Move step up or down in the list
  const moveStep = (id: string, direction: "up" | "down") => {
    const index = recipe.steps.findIndex(step => step.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === recipe.steps.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newSteps = [...recipe.steps];
    const step = newSteps[index];
    newSteps.splice(index, 1);
    newSteps.splice(newIndex, 0, step);

    setRecipe(prev => ({
      ...prev,
      steps: newSteps,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Recipe Information</h2>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Recipe Title</Label>
            <Input
              id="title"
              value={recipe.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Enter a descriptive title"
              className="subtle-ring"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={recipe.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Brief description of your recipe"
              className="subtle-ring min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bakingTemperature">Baking Temperature</Label>
              <Input
                id="bakingTemperature"
                value={recipe.bakingTemperature}
                onChange={(e) => updateField("bakingTemperature", e.target.value)}
                placeholder="e.g. 350°F / 180°C"
                className="subtle-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bakingTime">Baking Time</Label>
              <Input
                id="bakingTime"
                value={recipe.bakingTime}
                onChange={(e) => updateField("bakingTime", e.target.value)}
                placeholder="e.g. 30-35 minutes"
                className="subtle-ring"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />
      
      {/* Ingredients Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Ingredients</h2>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addIngredient}
            className="subtle-ring"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Ingredient
          </Button>
        </div>
        
        <div className="space-y-4">
          {recipe.ingredients.map((ingredient, index) => (
            <div 
              key={ingredient.id} 
              className="grid grid-cols-12 gap-3 items-center p-3 rounded-md subtle-ring bg-card"
            >
              {/* Ordering */}
              <div className="col-span-1 flex flex-col space-y-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveIngredient(ingredient.id, "up")}
                  disabled={index === 0}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveIngredient(ingredient.id, "down")}
                  disabled={index === recipe.ingredients.length - 1}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Name */}
              <div className="col-span-5">
                <Input
                  value={ingredient.name}
                  onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                  placeholder="Ingredient name"
                  className="subtle-ring"
                />
              </div>
              
              {/* Amount */}
              <div className="col-span-2">
                <Input
                  value={ingredient.amount}
                  onChange={(e) => updateIngredient(ingredient.id, "amount", e.target.value)}
                  placeholder="Amount"
                  className="subtle-ring"
                />
              </div>
              
              {/* Unit */}
              <div className="col-span-3">
                <Input
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(ingredient.id, "unit", e.target.value)}
                  placeholder="Unit (g, cups, etc.)"
                  className="subtle-ring"
                />
              </div>
              
              {/* Remove Button */}
              <div className="col-span-1 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(ingredient.id)}
                  disabled={recipe.ingredients.length <= 1}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      
      {/* Steps Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Steps</h2>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addStep}
            className="subtle-ring"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>
        
        <div className="space-y-4">
          {recipe.steps.map((step, index) => (
            <div 
              key={step.id} 
              className="flex space-x-3 items-start p-3 rounded-md subtle-ring bg-card"
            >
              {/* Step Number */}
              <div className="flex-shrink-0 flex flex-col items-center space-y-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                  {index + 1}
                </div>
                <div className="flex flex-col space-y-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => moveStep(step.id, "up")}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => moveStep(step.id, "down")}
                    disabled={index === recipe.steps.length - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Step Description */}
              <div className="flex-grow">
                <Textarea
                  value={step.description}
                  onChange={(e) => updateStep(step.id, e.target.value)}
                  placeholder={`Describe step ${index + 1}`}
                  className="subtle-ring min-h-[100px]"
                />
              </div>
              
              {/* Remove Button */}
              <div className="flex-shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStep(step.id)}
                  disabled={recipe.steps.length <= 1}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/")}
          className="subtle-ring"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="subtle-ring"
        >
          {isSubmitting ? "Saving..." : recipeId ? "Update Recipe" : "Save Recipe"}
        </Button>
      </div>
    </form>
  );
}
