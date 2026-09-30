/**
 * SegmentedControl — a compact single-select used for meal type, chart range,
 * and the theme toggle. Selection is a filled pill sliding within a sunken
 * track; hover gives a ghost wash so it never competes with selection.
 */
import React, { useState } from 'react';
import { View, Pressable, Platform, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

export interface Segment<T extends string> {
  value: T;
  label?: string;
  icon?: IconName;
}

interface Props<T extends string> {
  segments: Segment<T>[];
  value: T;
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
}

export function SegmentedControl<T extends string>({ segments, value, onChange, size = 'md', style }: Props<T>) {
  const { theme, space, radius, font, fontSize } = useTheme();
  const [hover, setHover] = useState<string | null>(null);
  const h = size === 'sm' ? 32 : 40;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          backgroundColor: theme.color.surfaceSunken,
          borderRadius: radius.pill,
          padding: 3,
          gap: 2,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {segments.map((seg) => {
        const active = seg.value === value;
        const isHover = hover === seg.value && !active;
        const fg = active ? theme.color.text : theme.color.textSecondary;
        return (
          <Pressable
            key={seg.value}
            onPress={() => onChange(seg.value)}
            onHoverIn={() => setHover(seg.value)}
            onHoverOut={() => setHover(null)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={seg.label ?? seg.value}
            style={{
              height: h,
              minWidth: seg.label ? undefined : h,
              paddingHorizontal: seg.label ? (size === 'sm' ? space.md : space.lg) : 0,
              borderRadius: radius.pill,
              backgroundColor: active ? theme.color.surface : isHover ? theme.color.surface + '80' : 'transparent',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: space.xs,
              ...(active && theme.scheme === 'light'
                ? Platform.select({
                    web: { boxShadow: '0 1px 3px rgba(20,34,27,0.12)' } as ViewStyle,
                    default: { shadowColor: '#14221B', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
                  })!
                : null),
              ...(Platform.OS === 'web' ? ({ cursor: 'pointer', transitionProperty: 'background-color', transitionDuration: '140ms' } as any) : null),
            }}
          >
            {seg.icon && <Icon name={seg.icon} size={size === 'sm' ? 15 : 17} color={fg} />}
            {seg.label && (
              <Text style={{ color: fg, fontFamily: active ? font.bodySemibold : font.bodyMedium, fontSize: size === 'sm' ? fontSize.caption : fontSize.footnote }}>
                {seg.label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
