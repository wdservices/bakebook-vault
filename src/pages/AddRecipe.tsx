
import { Header } from "@/components/layout/Header";
import { RecipeForm } from "@/components/recipe/RecipeForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddRecipe = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen pt-20 pb-16 page-transition">
      <Header />
      
      <main className="page-container">
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
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Recipe</h1>
          <p className="text-muted-foreground mt-2">
            Add a new recipe to your collection
          </p>
        </div>
        
        {/* Recipe Form */}
        <RecipeForm />
      </main>
    </div>
  );
};

export default AddRecipe;
