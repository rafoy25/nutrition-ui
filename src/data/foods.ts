/**
 * A small food reference table used by the log form's autocomplete and by the
 * sample seed data. Per-serving nutrition. This is static sample content — a
 * real app would query a food database — but the numbers are realistic.
 */
export interface Food {
  key: string;
  name: string;
  serving: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  /** milligrams */
  sodium: number;
}

const F = (
  key: string,
  name: string,
  serving: string,
  kcal: number,
  protein: number,
  carbs: number,
  fat: number,
  fiber: number,
  sodium: number,
): Food => ({ key, name, serving, kcal, protein, carbs, fat, fiber, sodium });

export const FOODS: Record<string, Food> = {
  oats: F('oats', 'Rolled oats', '40 g dry', 150, 5, 27, 2.5, 4, 0),
  yogurt: F('yogurt', 'Greek yogurt, plain', '170 g', 100, 17, 6, 0.7, 0, 60),
  blueberries: F('blueberries', 'Blueberries', '1 cup', 84, 1.1, 21.4, 0.5, 3.6, 1),
  banana: F('banana', 'Banana', '1 medium', 105, 1.3, 27, 0.4, 3.1, 1),
  egg: F('egg', 'Egg, boiled', '1 large', 78, 6.3, 0.6, 5.3, 0, 62),
  toast: F('toast', 'Whole wheat toast', '1 slice', 80, 4, 14, 1.1, 2, 140),
  avocado: F('avocado', 'Avocado', '½ fruit', 160, 2, 8.5, 14.7, 6.7, 7),
  chicken: F('chicken', 'Chicken breast, grilled', '120 g', 198, 37.2, 0, 4.3, 0, 88),
  rice: F('rice', 'Brown rice, cooked', '1 cup', 216, 5, 44.8, 1.8, 3.5, 10),
  quinoa: F('quinoa', 'Quinoa, cooked', '1 cup', 222, 8.1, 39.4, 3.6, 5.2, 13),
  salmon: F('salmon', 'Salmon, baked', '120 g', 247, 26.5, 0, 14.8, 0, 73),
  broccoli: F('broccoli', 'Broccoli, steamed', '1 cup', 55, 3.7, 11.2, 0.6, 5.1, 64),
  lentilsoup: F('lentilsoup', 'Lentil soup', '1 cup', 160, 9, 26, 2, 7, 780),
  almonds: F('almonds', 'Almonds', '28 g', 164, 6, 6.1, 14.2, 3.5, 0),
  apple: F('apple', 'Apple', '1 medium', 95, 0.5, 25.1, 0.3, 4.4, 2),
  hummus: F('hummus', 'Hummus', '2 tbsp', 70, 2, 4, 5, 1, 130),
  carrots: F('carrots', 'Baby carrots', '85 g', 30, 0.5, 7, 0.1, 2.5, 66),
  turkey: F('turkey', 'Turkey sandwich', '1 sandwich', 350, 24, 36, 11, 5, 920),
  salad: F('salad', 'Garden salad, olive oil', '1 bowl', 150, 2, 7, 13, 2.5, 150),
  tofu: F('tofu', 'Firm tofu', '150 g', 216, 26, 4.2, 13, 3.5, 21),
  burrito: F('burrito', 'Black bean burrito bowl', '1 bowl', 620, 24, 86, 20, 18, 1180),
  latte: F('latte', 'Latte, 2% milk', '12 fl oz', 150, 10, 15, 6, 0, 140),
  chocolate: F('chocolate', 'Dark chocolate, 70%', '20 g', 120, 1.6, 9.2, 8.5, 2.2, 4),
  cottage: F('cottage', 'Cottage cheese, 2%', '½ cup', 92, 11.8, 5.1, 2.6, 0, 348),
  pasta: F('pasta', 'Whole wheat pasta', '1 cup', 174, 7.5, 37.2, 0.8, 6.3, 4),
  marinara: F('marinara', 'Marinara sauce', '½ cup', 70, 2, 10, 2.5, 2, 450),
  sweetpotato: F('sweetpotato', 'Sweet potato, baked', '1 medium', 103, 2.3, 23.6, 0.2, 3.8, 41),
  orange: F('orange', 'Orange', '1 medium', 62, 1.2, 15.4, 0.2, 3.1, 0),
  pb: F('pb', 'Peanut butter', '2 tbsp', 190, 7, 7, 16, 2, 140),
  wrap: F('wrap', 'Grilled chicken wrap', '1 wrap', 410, 32, 38, 14, 6, 480),
  pizza: F('pizza', 'Cheese pizza', '1 slice', 285, 12.2, 35.7, 10.4, 2.5, 640),
  granola: F('granola', 'Granola bar', '1 bar', 180, 4, 27, 6.5, 2, 105),
  stirfry: F('stirfry', 'Veggie stir-fry', '1 plate', 280, 9, 30, 14, 6, 890),
  edamame: F('edamame', 'Edamame, shelled', '1 cup', 188, 18.4, 13.8, 8.1, 8.1, 9),
};

export const FOOD_LIST: Food[] = Object.values(FOODS);

export function searchFoods(query: string, limit = 6): Food[] {
  const q = query.trim().toLowerCase();
  if (!q) return FOOD_LIST.slice(0, limit);
  return FOOD_LIST.filter((f) => f.name.toLowerCase().includes(q)).slice(0, limit);
}
