/** Pure helpers for summing nutrients and comparing against targets. */
import { FOODS } from './foods';
import type { LoggedFood, Nutrients, Targets } from './types';

export const EMPTY: Nutrients = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 };

const round1 = (n: number) => Math.round(n * 10) / 10;

export function nutrientsFor(items: LoggedFood[]): Nutrients {
  const acc = { ...EMPTY };
  for (const { foodKey, qty } of items) {
    const f = FOODS[foodKey];
    if (!f) continue;
    acc.kcal += f.kcal * qty;
    acc.protein += f.protein * qty;
    acc.carbs += f.carbs * qty;
    acc.fat += f.fat * qty;
    acc.fiber += f.fiber * qty;
    acc.sodium += f.sodium * qty;
  }
  return {
    kcal: Math.round(acc.kcal),
    protein: round1(acc.protein),
    carbs: round1(acc.carbs),
    fat: round1(acc.fat),
    fiber: round1(acc.fiber),
    sodium: Math.round(acc.sodium),
  };
}

export function addNutrients(a: Nutrients, b: Nutrients): Nutrients {
  return {
    kcal: a.kcal + b.kcal,
    protein: round1(a.protein + b.protein),
    carbs: round1(a.carbs + b.carbs),
    fat: round1(a.fat + b.fat),
    fiber: round1(a.fiber + b.fiber),
    sodium: a.sodium + b.sodium,
  };
}

export const DEFAULT_TARGETS: Targets = {
  kcal: 2000,
  protein: 110,
  carbs: 230,
  fat: 65,
  fiber: 30,
  sodiumLimit: 2300,
};

/** kcal contribution of each macro — 4/4/9 rule. */
export function macroCalories(n: Pick<Nutrients, 'protein' | 'carbs' | 'fat'>) {
  return {
    protein: n.protein * 4,
    carbs: n.carbs * 4,
    fat: n.fat * 9,
  };
}

export type TargetState = 'under' | 'onTrack' | 'over';

/** Where a value sits relative to its target, with a tolerance band. */
export function targetState(value: number, target: number, tol = 0.08): TargetState {
  if (target <= 0) return 'onTrack';
  const ratio = value / target;
  if (ratio < 1 - tol) return 'under';
  if (ratio > 1 + tol) return 'over';
  return 'onTrack';
}

export function pct(value: number, target: number): number {
  if (target <= 0) return 0;
  return Math.round((value / target) * 100);
}
