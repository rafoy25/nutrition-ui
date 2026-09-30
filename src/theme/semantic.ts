/**
 * Tier 0 — Semantic tokens (roles).
 *
 * Maps primitive values onto the roles components actually use. Two complete
 * sets, light and dark; each is internally consistent (every text role has a
 * validated contrast against the surface it sits on). Components read these
 * through `useTheme()` and never branch on the color scheme themselves.
 */
import { palette as p } from './primitives';

export type MacroKey = 'protein' | 'carbs' | 'fat';
export type StatusKey = 'good' | 'warning' | 'critical';

export interface MacroColor {
  /** The mark color — bars, ring arcs, dots. */
  base: string;
  /** A soft wash for chips and fills behind the mark color. */
  tint: string;
}

export interface StatusColor {
  base: string;
  tint: string;
  /** Text color that clears contrast on `tint`. */
  ink: string;
}

export interface Theme {
  scheme: 'light' | 'dark';
  color: {
    // Grounds — the page plane, raised cards, and sunken wells.
    ground: string;
    surface: string;
    surfaceRaised: string;
    surfaceSunken: string;
    /** Nav rail / bottom bar ground. */
    chrome: string;

    // Brand
    brand: string;
    brandStrong: string;
    brandTint: string;
    onBrand: string;

    // Text
    text: string;
    textSecondary: string;
    textMuted: string;
    /** Text placed on top of a brand-colored surface. */
    textOnBrand: string;

    // Lines
    border: string;
    borderStrong: string;
    divider: string;

    // Chart furniture
    grid: string;
    axis: string;
    trackMuted: string;

    // Focus ring (keyboard / web)
    focus: string;

    // Macro categorical hues
    macro: Record<MacroKey, MacroColor>;
    fiber: string;

    // Status
    status: Record<StatusKey, StatusColor>;

    // Overlay behind modals / sheets
    scrim: string;
  };
}

export const lightTheme: Theme = {
  scheme: 'light',
  color: {
    ground: p.sage150,
    surface: p.white,
    surfaceRaised: p.white,
    surfaceSunken: p.sage200,
    chrome: p.white,

    brand: p.green600,
    brandStrong: p.green700,
    brandTint: p.green100,
    onBrand: p.white,

    text: p.ink,
    textSecondary: p.sage700,
    textMuted: p.sage600,
    textOnBrand: p.white,

    border: p.sage300,
    borderStrong: p.sage400,
    divider: p.sage200,

    grid: p.sage200,
    axis: p.sage400,
    trackMuted: p.sage200,

    focus: p.green500,

    macro: {
      protein: { base: p.proteinL, tint: p.proteinTintL },
      carbs: { base: p.carbsL, tint: p.carbsTintL },
      fat: { base: p.fatL, tint: p.fatTintL },
    },
    fiber: p.fiberL,

    status: {
      good: { base: p.goodL, tint: p.goodTintL, ink: p.goodInkL },
      warning: { base: p.warnL, tint: p.warnTintL, ink: p.warnInkL },
      critical: { base: p.critL, tint: p.critTintL, ink: p.critInkL },
    },

    scrim: 'rgba(14, 21, 17, 0.44)',
  },
};

export const darkTheme: Theme = {
  scheme: 'dark',
  color: {
    ground: p.sage950,
    surface: p.sage900,
    surfaceRaised: p.sage850,
    surfaceSunken: p.sage950,
    chrome: p.sage850,

    brand: p.green300,
    brandStrong: p.green200,
    brandTint: '#1D3A2D',
    onBrand: p.sage950,

    text: '#E5ECE7',
    textSecondary: '#B3C1B8',
    textMuted: '#8C9C93',
    textOnBrand: p.sage950,

    border: '#2E3A33',
    borderStrong: '#43514840',
    divider: '#26312B',

    grid: '#26312B',
    axis: '#3A473F',
    trackMuted: '#26312B',

    focus: p.green300,

    macro: {
      protein: { base: p.proteinD, tint: p.proteinTintD },
      carbs: { base: p.carbsD, tint: p.carbsTintD },
      fat: { base: p.fatD, tint: p.fatTintD },
    },
    fiber: p.fiberD,

    status: {
      good: { base: p.goodD, tint: p.goodTintD, ink: p.goodInkD },
      warning: { base: p.warnD, tint: p.warnTintD, ink: p.warnInkD },
      critical: { base: p.critD, tint: p.critTintD, ink: p.critInkD },
    },

    scrim: 'rgba(0, 0, 0, 0.6)',
  },
};

export const MACRO_ORDER: MacroKey[] = ['protein', 'carbs', 'fat'];
export const MACRO_LABEL: Record<MacroKey, string> = {
  protein: 'Protein',
  carbs: 'Carbs',
  fat: 'Fat',
};
