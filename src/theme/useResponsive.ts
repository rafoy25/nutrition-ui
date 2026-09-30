/**
 * Layout hook — reports the active breakpoint bucket from the window width.
 * Drives the single responsive decision the shell makes: rail vs. bottom bar,
 * one column vs. multi-column grid.
 */
import { useWindowDimensions } from 'react-native';
import { breakpoint } from './primitives';

export type Layout = 'phone' | 'tablet' | 'wide';

export interface Responsive {
  width: number;
  layout: Layout;
  isWide: boolean;
  isPhone: boolean;
  /** Column count for the dashboard card grid. */
  columns: number;
}

export function useResponsive(): Responsive {
  const { width } = useWindowDimensions();
  const layout: Layout = width >= breakpoint.wide ? 'wide' : width >= breakpoint.mid ? 'tablet' : 'phone';
  return {
    width,
    layout,
    isWide: layout === 'wide',
    isPhone: layout === 'phone',
    columns: layout === 'wide' ? 12 : layout === 'tablet' ? 6 : 4,
  };
}
