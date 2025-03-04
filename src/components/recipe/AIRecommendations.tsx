
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAIRecommendations, AIRecommendation } from "@/utils/aiRecommendations";
import { Sparkles, ThermometerSun, Clock, LightbulbIcon } from "lucide-react";
import { Recipe } from "@/types/Recipe";

interface AIRecommendationsProps {
  recipe: Recipe;
}

export function AIRecommendations({ recipe }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // In a real app with API integration, this would be an async call
        const data = getAIRecommendations({
          title: recipe.title,
          ingredients: recipe.ingredients,
          description: recipe.description
        });
        
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching AI recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [recipe.title, recipe.ingredients, recipe.description]);

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            <div className="h-6 w-48 bg-muted rounded"></div>
          </CardTitle>
          <CardDescription className="h-4 w-36 bg-muted rounded"></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="h-4 w-full bg-muted rounded"></div>
          <div className="h-4 w-3/4 bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations) {
    return null;
  }

  return (
    <Card className="subtle-ring">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          AI Recommendations
        </CardTitle>
        <CardDescription>
          Suggested baking parameters for this recipe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <ThermometerSun className="h-5 w-5 mr-2 text-muted-foreground" />
          <span>Suggested temperature: </span>
          <span className="font-medium ml-1">{recommendations.temperature}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
          <span>Suggested baking time: </span>
          <span className="font-medium ml-1">{recommendations.bakingTime}</span>
        </div>
        <div className="space-y-2 mt-4">
          <h4 className="font-medium flex items-center">
            <LightbulbIcon className="h-5 w-5 mr-2 text-muted-foreground" />
            Baking Tips:
          </h4>
          <ul className="space-y-2 pl-7 list-disc">
            {recommendations.tips.map((tip, index) => (
              <li key={index} className="text-sm">{tip}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
