/**
 * CalorieRing — the dashboard's hero figure. A single progress arc around the
 * day's calorie total vs. target, with the number set large in the display
 * sans (the one hero figure per view). The arc is one hue; the track is a muted
 * step of the same family so state reads across the whole ring.
 */
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '@/theme';
import { Text } from '../ui/Text';

interface Props {
  value: number;
  target: number;
  size?: number;
  /** Label under the big number, e.g. "of 2,000 kcal". */
  caption?: string;
}

export function CalorieRing({ value, target, size = 176, caption }: Props) {
  const { theme, font } = useTheme();
  const stroke = 14;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const ratio = target > 0 ? value / target : 0;
  const clamped = Math.max(0, Math.min(1, ratio));
  const over = ratio > 1.05;

  const arcColor = over ? theme.color.status.critical.base : theme.color.brand;
  const remaining = Math.max(0, target - value);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <G transform={`rotate(-90 ${cx} ${cy})`}>
          <Circle cx={cx} cy={cy} r={r} stroke={theme.color.trackMuted} strokeWidth={stroke} fill="none" />
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={arcColor}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${circ}`}
            strokeDashoffset={circ * (1 - clamped)}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={{ alignItems: 'center', gap: 2 }}>
        <Text style={{ fontFamily: font.display, fontSize: 44, lineHeight: 48, color: theme.color.text }}>
          {value.toLocaleString()}
        </Text>
        {caption ? (
          <Text variant="caption" color="muted">
            {caption}
          </Text>
        ) : null}
        <Text variant="caption" style={{ color: over ? theme.color.status.critical.ink : theme.color.brand, marginTop: 2 }}>
          {over ? `${(value - target).toLocaleString()} over` : `${remaining.toLocaleString()} left`}
        </Text>
      </View>
    </View>
  );
}
