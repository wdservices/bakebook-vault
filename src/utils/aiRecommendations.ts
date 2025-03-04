
interface RecipeData {
  title?: string;
  ingredients?: Array<{name: string}>;
  description?: string;
}

export interface AIRecommendation {
  temperature: string;
  bakingTime: string;
  tips: string[];
}

// Mock AI recommendation engine since we don't have an actual API key
export const getAIRecommendations = (recipeData: RecipeData): AIRecommendation => {
  // This is a simplified mock implementation
  // In a real application, this would call an AI API with the recipe data
  
  const defaultRecommendation: AIRecommendation = {
    temperature: "350°F (175°C)",
    bakingTime: "25-30 minutes",
    tips: [
      "Preheat your oven for at least 10 minutes before baking",
      "Use an oven thermometer to ensure temperature accuracy",
      "Position the rack in the center of the oven for even heat distribution"
    ]
  };
  
  // Simple rules-based approach to simulate AI recommendations
  if (recipeData.title) {
    const title = recipeData.title.toLowerCase();
    
    // For bread recipes
    if (title.includes("bread") || title.includes("loaf")) {
      return {
        temperature: "375°F (190°C)",
        bakingTime: "45-60 minutes",
        tips: [
          "Cover with foil if browning too quickly",
          "Bread is done when it sounds hollow when tapped on the bottom",
          "Let bread cool completely before slicing for best texture"
        ]
      };
    }
    
    // For cookies
    else if (title.includes("cookie")) {
      return {
        temperature: "325°F (165°C) to 350°F (175°C)",
        bakingTime: "8-12 minutes",
        tips: [
          "Space cookies at least 2 inches apart",
          "Rotate baking sheet halfway through for even baking",
          "Let cookies cool on the baking sheet for 2-3 minutes before transferring"
        ]
      };
    }
    
    // For cakes
    else if (title.includes("cake")) {
      return {
        temperature: "350°F (175°C)",
        bakingTime: "30-35 minutes",
        tips: [
          "Test for doneness with a toothpick - it should come out clean",
          "Cool in pan for 10 minutes before removing",
          "Use cake strips for even rising and no doming"
        ]
      };
    }
    
    // For muffins or cupcakes
    else if (title.includes("muffin") || title.includes("cupcake")) {
      return {
        temperature: "375°F (190°C)",
        bakingTime: "15-20 minutes",
        tips: [
          "Fill muffin cups 2/3 full for perfect domes",
          "Add a tablespoon of water to empty muffin cups to protect the pan",
          "Let cool in the pan for 5 minutes before removing"
        ]
      };
    }
  }
  
  // Return default if no specific rules match
  return defaultRecommendation;
};
