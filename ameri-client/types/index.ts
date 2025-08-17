export enum Gender {
  MALE,
  FEMALE,
}

export type UserMetadata = {
  dob: Date;
  heathConditons: Record<string, string>;
  weight: number;
  height: number;
  goal: Goal;
};

export enum Goal {
  LOSE_WEIGHT = "Lost Weight",
  GAIN_WEIGHT = "Gain Weight",
  GAIN_MUSCLE = "Gain Muscle",
  STAY_HEALTHY = "Stay Healthy",
}

export type LoginRequest = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
};

export type UserData = {
  dateOfBirth: Date;
  weight: number;
  height: number;
  gender: Gender;
  username: string;
  goal: Goal;
  heathConditons: Record<string, string>;
};

export type NutritionSummary = {
  date: Date;
  totalFat: number;
  totalProtein: number;
  totalCalories: number;
  totalCarbs: number;
};

export enum MealType {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  SNACK = "SNACK",
}

export interface Macros {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface MealItem {
  foodName: string;
  quantityInGrams: string;
  macros: Macros;
}

export interface Meal {
  id: string;
  mealType: MealType;
  items: MealItem[];
  loggedAt: string;
  user?: User;
}

export interface User {
  id: string;
}

export type MealRecepie =
  | {
      status: "Accepted";
      meal_type: string;
      cuisine: string;
      items: string[];
      portion_size: string;
      calories: string;
      macronutrients: {
        carbohydrates: string;
        protein: string;
        fat: string;
      };
      water_content: string;
      vitamins: {
        a: string;
        b_complex: string;
        c: string;
        d: string;
        e: string;
        k: string;
      };
      minerals: {
        iron: string;
        calcium: string;
        magnesium: string;
        potassium: string;
        zinc: string;
      };
      confidence: string;
    }
  | {
      status: "Rejected";
      reason: string;
    };
