/**
 * Card — the standard raised surface. `tone` picks the fill; card styling
 * (border + subtle shadow) is applied by role, not everywhere, so hierarchy
 * stays legible. `padding` maps to the spacing scale.
 */
import React from 'react';
import { View, type ViewStyle, type StyleProp, Platform } from 'react-native';
import { useTheme, type SpaceToken } from '@/theme';

interface Props {
  children: React.ReactNode;
  tone?: 'surface' | 'raised' | 'sunken' | 'brand';
  padding?: SpaceToken;
  gap?: SpaceToken;
  bordered?: boolean;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  tone = 'surface',
  padding = 'lg',
  gap,
  bordered = true,
  elevated = true,
  style,
}: Props) {
  const { theme, space, radius } = useTheme();

  const bg =
    tone === 'brand'
      ? theme.color.brand
      : tone === 'sunken'
        ? theme.color.surfaceSunken
        : tone === 'raised'
          ? theme.color.surfaceRaised
          : theme.color.surface;

  const shadow: ViewStyle =
    elevated && theme.scheme === 'light'
      ? Platform.select({
          web: { boxShadow: '0 1px 2px rgba(20,34,27,0.04), 0 6px 20px rgba(20,34,27,0.06)' } as ViewStyle,
          default: {
            shadowColor: '#14221B',
            shadowOpacity: 0.08,
            shadowRadius: 14,
            shadowOffset: { width: 0, height: 6 },
            elevation: 2,
          },
        })!
      : {};

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderRadius: radius.lg,
          padding: space[padding],
          borderWidth: bordered && tone !== 'brand' ? 1 : 0,
          borderColor: theme.color.border,
        },
        gap ? { gap: space[gap] } : null,
        shadow,
        style,
      ]}
    >
      {children}
    </View>
  );
}
