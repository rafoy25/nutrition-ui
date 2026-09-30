/**
 * Theme context + provider.
 *
 * Resolves the active theme from the OS color scheme, but also lets the user
 * override it (light / dark / system) from the header toggle. The resolved
 * `Theme` object plus the primitive scales are exposed through `useTheme()`.
 */
import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, type Theme } from './semantic';
import { space, radius, fontSize, lineHeight, fontFamily, duration, breakpoint } from './primitives';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
  toggle: () => void;
  space: typeof space;
  radius: typeof radius;
  fontSize: typeof fontSize;
  lineHeight: typeof lineHeight;
  font: typeof fontFamily;
  duration: typeof duration;
  breakpoint: typeof breakpoint;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme() ?? 'light';
  const [preference, setPreference] = useState<ThemePreference>('system');

  const scheme = preference === 'system' ? system : preference;
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const toggle = useCallback(() => {
    setPreference((prev) => {
      const active = prev === 'system' ? system : prev;
      return active === 'dark' ? 'light' : 'dark';
    });
  }, [system]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      preference,
      setPreference,
      toggle,
      space,
      radius,
      fontSize,
      lineHeight,
      font: fontFamily,
      duration,
      breakpoint,
    }),
    [theme, preference, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
