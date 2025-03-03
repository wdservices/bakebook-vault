
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, ThermometerSun } from "lucide-react";
import { Recipe } from "@/types/Recipe";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Count completed ingredients
  const completedCount = recipe.ingredients.filter(ing => ing.isUsed).length;
  const totalCount = recipe.ingredients.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div 
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-xl border subtle-ring bg-card card-hover",
        isVisible ? "animate-scale-in" : "opacity-0",
        className
      )}
    >
      <Link to={`/recipe/${recipe.id}`}>
        <div className="p-6 flex flex-col h-full">
          {/* Title */}
          <h3 className="text-xl font-semibold tracking-tight mb-2">{recipe.title}</h3>
          
          {/* Description */}
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {recipe.description}
          </p>
          
          {/* Info */}
          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              <span>{recipe.bakingTime}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <ThermometerSun className="w-4 h-4 mr-1" />
              <span>{recipe.bakingTemperature}</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedCount} of {totalCount} ingredients used
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
