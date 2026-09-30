/**
 * Grid — a simple responsive row that wraps children into columns. `min` sets
 * the minimum column width before wrapping; on phones everything stacks to one
 * column. Children are sized by flex-basis so a row fills evenly.
 */
import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { useTheme, useResponsive } from '@/theme';

export function Row({
  children,
  gap = 'lg',
  wrap = true,
  align = 'stretch',
  style,
}: {
  children: React.ReactNode;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
  align?: ViewStyle['alignItems'];
  style?: ViewStyle;
}) {
  const { space } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', flexWrap: wrap ? 'wrap' : 'nowrap', gap: space[gap], alignItems: align }, style]}>
      {children}
    </View>
  );
}

export function Col({
  children,
  basis,
  grow = 1,
  minWidth,
  style,
}: {
  children: React.ReactNode;
  /** flex-basis as a percent string or number */
  basis?: number | string;
  grow?: number;
  minWidth?: number;
  style?: ViewStyle;
}) {
  const { isPhone } = useResponsive();
  return (
    <View
      style={[
        {
          flexGrow: grow,
          flexShrink: 1,
          flexBasis: isPhone ? '100%' : (basis as any) ?? 0,
          minWidth: isPhone ? undefined : minWidth,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
