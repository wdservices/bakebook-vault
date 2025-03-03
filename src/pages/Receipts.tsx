
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecipes } from "@/context/RecipeContext";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, Recipe } from "@/types/Recipe";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileText, Printer, Download } from "lucide-react";

const Receipts = () => {
  const navigate = useNavigate();
  const { recipes, getRecipe } = useRecipes();
  const { toast } = useToast();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("");
  const [brandName, setBrandName] = useState<string>("Bakebook");
  const [generatedReceipt, setGeneratedReceipt] = useState<Receipt | null>(null);
  
  const generateReceipt = () => {
    if (!selectedRecipeId) {
      toast({
        title: "No recipe selected",
        description: "Please select a recipe to generate a receipt",
        variant: "destructive",
      });
      return;
    }
    
    const recipe = getRecipe(selectedRecipeId);
    if (!recipe) return;
    
    const newReceipt: Receipt = {
      id: crypto.randomUUID(),
      recipeId: recipe.id,
      recipeName: recipe.title,
      brandName: brandName,
      createdAt: new Date(),
      ingredients: recipe.ingredients
    };
    
    setGeneratedReceipt(newReceipt);
    
    toast({
      title: "Receipt Generated",
      description: `A receipt for ${recipe.title} has been generated`,
    });
  };
  
  const printReceipt = () => {
    window.print();
  };
  
  const downloadAsPDF = () => {
    toast({
      title: "Coming Soon",
      description: "PDF download functionality will be added in a future update",
    });
  };
  
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
          <h1 className="text-3xl font-bold">Receipt Generator</h1>
          <p className="text-muted-foreground mt-2">
            Generate receipts for your recipes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Generator Form */}
          <Card>
            <CardHeader>
              <CardTitle>Generate New Receipt</CardTitle>
              <CardDescription>Select a recipe and customize your receipt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipe">Select Recipe</Label>
                <Select 
                  value={selectedRecipeId} 
                  onValueChange={setSelectedRecipeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a recipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipes.length === 0 ? (
                      <SelectItem value="none" disabled>No recipes available</SelectItem>
                    ) : (
                      recipes.map(recipe => (
                        <SelectItem key={recipe.id} value={recipe.id}>
                          {recipe.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter your brand name"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={generateReceipt} 
                disabled={!selectedRecipeId}
                className="w-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Receipt
              </Button>
            </CardFooter>
          </Card>
          
          {/* Receipt Preview */}
          {generatedReceipt && (
            <Card className="print:shadow-none">
              <CardHeader className="text-center border-b print:border-black">
                <CardTitle className="text-2xl">{generatedReceipt.brandName}</CardTitle>
                <CardDescription className="text-lg">Receipt</CardDescription>
              </CardHeader>
              <CardContent className="py-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg mb-1">Recipe: {generatedReceipt.recipeName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Date: {generatedReceipt.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Ingredients:</h4>
                    <ul className="space-y-1">
                      {generatedReceipt.ingredients.map(ingredient => (
                        <li key={ingredient.id} className="flex justify-between">
                          <span>{ingredient.name}</span>
                          <span>{ingredient.amount} {ingredient.unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Thank you for using {generatedReceipt.brandName}</p>
                    <p>ID: {generatedReceipt.id.slice(0, 8)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={printReceipt}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" onClick={downloadAsPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Receipts;
