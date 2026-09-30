/**
 * ChartFrame — the container every chart mounts in. Owns the title/subtitle,
 * the legend row, and the table-view toggle (the accessibility twin of the
 * chart). Grows with content so the x-axis band is never clipped.
 */
import React, { useState } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { useTheme } from '@/theme';
import { Text } from '../ui/Text';
import { Icon } from '../ui/Icon';

export interface LegendItem {
  label: string;
  color: string;
  /** 'line' draws a short stroke; 'rect' a swatch. */
  shape?: 'rect' | 'line';
}

interface Props {
  title: string;
  subtitle?: string;
  legend?: LegendItem[];
  /** The chart itself. */
  children: React.ReactNode;
  /** The equivalent table, shown when the reader toggles table view. */
  table?: React.ReactNode;
  actions?: React.ReactNode;
}

export function ChartFrame({ title, subtitle, legend, children, table, actions }: Props) {
  const { theme, space, radius, font } = useTheme();
  const [showTable, setShowTable] = useState(false);

  return (
    <View style={{ gap: space.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: space.md }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="subtitle">{title}</Text>
          {subtitle ? (
            <Text variant="footnote" color="muted">
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', gap: space.xs, alignItems: 'center' }}>
          {actions}
          {table && (
            <Pressable
              onPress={() => setShowTable((s) => !s)}
              accessibilityRole="button"
              accessibilityLabel={showTable ? 'Show chart' : 'Show data table'}
              accessibilityState={{ selected: showTable }}
              style={({ pressed }) => ({
                width: 34,
                height: 34,
                borderRadius: radius.sm,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: showTable ? theme.color.brandTint : theme.color.surfaceSunken,
                opacity: pressed ? 0.8 : 1,
                ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
              })}
            >
              <Icon name="table" size={17} color={showTable ? theme.color.brand : theme.color.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      {legend && legend.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.md }}>
          {legend.map((item) => (
            <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
              {item.shape === 'line' ? (
                <View style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: item.color }} />
              ) : (
                <View style={{ width: 11, height: 11, borderRadius: 3, backgroundColor: item.color }} />
              )}
              <Text variant="caption" color="secondary" style={{ fontFamily: font.bodyMedium }}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      )}

      {showTable && table ? table : children}
    </View>
  );
}
