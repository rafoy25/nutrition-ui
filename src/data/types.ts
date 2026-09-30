export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export const MEAL_TYPES: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export interface LoggedFood {
  foodKey: string;
  qty: number;
}

export interface LogEntry {
  id: string;
  /** ISO date YYYY-MM-DD */
  date: string;
  /** HH:MM 24h */
  time: string;
  meal: MealType;
  items: LoggedFood[];
}

export interface Nutrients {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

/** Daily targets (goal values the dashboard measures against). */
export interface Targets {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  /** upper limit, not a floor */
  sodiumLimit: number;
}

export interface DaySummary extends Nutrients {
  date: string;
}
