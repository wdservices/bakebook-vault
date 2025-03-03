
export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  isUsed: boolean;
}

export interface Step {
  id: string;
  description: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  bakingTemperature: string;
  bakingTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NewRecipe = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>;
