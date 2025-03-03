
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecipes } from "@/context/RecipeContext";
import { Header } from "@/components/layout/Header";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, ChefHat } from "lucide-react";

const Index = () => {
  const { recipes } = useRecipes();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);

  // Filter recipes based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRecipes(recipes);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(query) || 
      recipe.description.toLowerCase().includes(query)
    );
    
    setFilteredRecipes(filtered);
  }, [searchQuery, recipes]);

  return (
    <div className="min-h-screen pt-20 pb-16 page-transition">
      <Header />
      
      <main className="page-container">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
              Your Recipe Vault
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bakebook
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Store, manage, and organize all your baking recipes in one place
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
              <Button asChild size="lg" className="subtle-ring">
                <Link to="/add">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add New Recipe
                </Link>
              </Button>
            </div>
          </div>
        </section>
      
        {/* Search Section */}
        <section className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search your recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 subtle-ring"
            />
          </div>
        </section>

        {/* Recipe Grid */}
        <section>
          {recipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ChefHat className="h-20 w-20 text-muted mb-6" />
              <h2 className="text-2xl font-medium mb-2">No recipes yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Your recipe collection is empty. Start by adding your first recipe!
              </p>
              <Button asChild>
                <Link to="/add">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Add Your First Recipe
                </Link>
              </Button>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No recipes found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
