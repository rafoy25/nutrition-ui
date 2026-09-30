/**
 * Tier 0 — Primitive tokens.
 *
 * Raw, context-free values: the full color ramps, the spacing scale, radii,
 * type sizes, and durations. Nothing here knows about light vs. dark or about
 * "background" vs. "text" — those roles are assigned one layer up, in
 * `semantic.ts`. Components never import primitives directly; they read the
 * resolved semantic theme via `useTheme()`.
 *
 * The categorical macro hues (protein / carbs / fat) and every text/surface
 * pairing below were validated with the data-viz palette validator and a WCAG
 * contrast pass — see docs/DESIGN.md for the recorded numbers.
 */

export const palette = {
  // Brand — a deep garden green (the herb "lovage"). Anchors nav, primary
  // actions, and the calorie ring.
  green900: '#0E2A1E',
  green800: '#123724',
  green700: '#17452E',
  green600: '#1E5B45',
  green500: '#2C7355',
  green400: '#4E9E77',
  green300: '#86CFA7',
  green200: '#B7E4CD',
  green100: '#E1EEE6',
  green050: '#F0F6F2',

  // Warm neutral greens — the off-white "paper" grounds and hairlines, biased
  // very slightly toward the brand hue so grey never reads as accidental.
  sage050: '#FBFCFB',
  sage100: '#F5F7F3',
  sage150: '#F0F3EE',
  sage200: '#E7ECE5',
  sage300: '#D6DDD3',
  sage400: '#B9C3B6',
  sage500: '#9AA89F',
  sage600: '#687870',
  sage700: '#44554B',
  sage800: '#2A362F',
  sage850: '#1F2A24',
  sage900: '#16201B',
  sage950: '#0E1511',
  ink: '#14221B',
  white: '#FFFFFF',

  // Macro categorical hues — protein (coral), carbs (blue), fat (olive).
  // Light steps validated on #FFFFFF; dark steps validated on #16201B.
  proteinL: '#E0603E',
  proteinD: '#EC8163',
  proteinTintL: '#FBE7E0',
  proteinTintD: '#3A241D',

  carbsL: '#3E7BD6',
  carbsD: '#6FA6EE',
  carbsTintL: '#E2ECFA',
  carbsTintD: '#1C2C42',

  fatL: '#84932A',
  fatD: '#B6C24E',
  fatTintL: '#EDF0DC',
  fatTintD: '#2C3115',

  // Fiber — a supporting fourth measure, used only in its own isolated views
  // (never beside all three macros at once).
  fiberL: '#7A5EA8',
  fiberD: '#B49FE0',

  // Status — fixed, never themed by role. Steps chosen distinct from macros.
  goodL: '#23824A',
  goodD: '#4CC27A',
  goodTintL: '#E3F2E7',
  goodTintD: '#173424',
  goodInkL: '#1B6B3C',
  goodInkD: '#7BD9A0',

  warnL: '#B57900',
  warnD: '#E0A93A',
  warnTintL: '#FBEFD3',
  warnTintD: '#3A2E14',
  warnInkL: '#7F5300',
  warnInkD: '#F0C36A',

  critL: '#C4362B',
  critD: '#EF6B5E',
  critTintL: '#FBE5E2',
  critTintD: '#3D1C19',
  critInkL: '#A32117',
  critInkD: '#F59A90',
} as const;

/** 4px base spacing scale. Layout uses `gap`, not per-element margins. */
export const space = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  jumbo: 56,
} as const;

export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
  round: 9999,
} as const;

/** Type scale — one ratio, held to across the app. */
export const fontSize = {
  micro: 11,
  caption: 12,
  footnote: 13,
  body: 15,
  callout: 16,
  subtitle: 18,
  title3: 20,
  title2: 24,
  title1: 30,
  display: 40,
  hero: 52,
} as const;

export const lineHeight = {
  micro: 14,
  caption: 16,
  footnote: 18,
  body: 22,
  callout: 22,
  subtitle: 24,
  title3: 26,
  title2: 30,
  title1: 36,
  display: 46,
  hero: 56,
} as const;

export const fontFamily = {
  /** Characterful display face — used only for hero figures and screen titles. */
  display: 'YoungSerif',
  /** Body / UI — Atkinson Hyperlegible Next, tuned for legibility. */
  body: 'AtkinsonNext',
  bodyMedium: 'AtkinsonNextMedium',
  bodySemibold: 'AtkinsonNextSemibold',
  bodyBold: 'AtkinsonNextBold',
  /** Tabular data — the mono cut aligns digits in tables and axes. */
  mono: 'AtkinsonMono',
  monoSemibold: 'AtkinsonMonoSemibold',
} as const;

export const duration = {
  fast: 120,
  base: 200,
  slow: 320,
} as const;

/** Layout breakpoint: at/above this width the app shows the rail + wide grid. */
export const breakpoint = {
  wide: 900,
  mid: 640,
} as const;

export type SpaceToken = keyof typeof space;
export type RadiusToken = keyof typeof radius;
export type FontSizeToken = keyof typeof fontSize;
