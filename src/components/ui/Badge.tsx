/**
 * Badge / Pill — a small status or category marker. Status badges pair color
 * with an icon + label so meaning is never carried by hue alone (a11y rule).
 */
import React from 'react';
import { View, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme, type StatusKey } from '@/theme';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

interface Props {
  label: string;
  status?: StatusKey;
  icon?: IconName;
  /** Custom fill + text, e.g. a macro chip. */
  tint?: string;
  ink?: string;
  dot?: string;
  style?: StyleProp<ViewStyle>;
}

const STATUS_ICON: Record<StatusKey, IconName> = {
  good: 'check',
  warning: 'info',
  critical: 'arrowUp',
};

export function Badge({ label, status, icon, tint, ink, dot, style }: Props) {
  const { theme, space, radius, font, fontSize } = useTheme();

  const bg = status ? theme.color.status[status].tint : tint ?? theme.color.surfaceSunken;
  const fg = status ? theme.color.status[status].ink : ink ?? theme.color.textSecondary;
  const glyph = icon ?? (status ? STATUS_ICON[status] : undefined);

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.xs,
          paddingVertical: space.xxs + 2,
          paddingHorizontal: space.sm,
          borderRadius: radius.pill,
          backgroundColor: bg,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {dot && <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: dot }} />}
      {glyph && <Icon name={glyph} size={13} color={fg} strokeWidth={2.4} />}
      <Text style={{ color: fg, fontFamily: font.bodySemibold, fontSize: fontSize.caption }}>{label}</Text>
    </View>
  );
}
