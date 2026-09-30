/**
 * StatTile — the figure contract: label · value · optional delta · optional
 * sparkline. A colored dot beside the label carries category identity so the
 * value text itself stays in ink (text never wears the data color).
 */
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme';
import { Text } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { Sparkline } from './Sparkline';

interface Props {
  label: string;
  value: string;
  unit?: string;
  dotColor?: string;
  /** Signed delta vs a named period, e.g. "+12% vs last week". Sign drives color. */
  delta?: { text: string; direction: 'up' | 'down' | 'flat'; goodDirection?: 'up' | 'down' };
  spark?: { points: number[]; color?: string };
}

export function StatTile({ label, value, unit, dotColor, delta, spark }: Props) {
  const { theme, space, font, fontSize } = useTheme();

  let deltaColor = theme.color.textMuted;
  if (delta && delta.direction !== 'flat') {
    const isGood = delta.direction === (delta.goodDirection ?? 'up');
    deltaColor = isGood ? theme.color.status.good.ink : theme.color.status.critical.ink;
  }

  return (
    <View style={{ gap: space.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
        {dotColor && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dotColor }} />}
        <Text variant="label" color="muted">
          {label}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
        <Text style={{ fontFamily: font.bodyBold, fontSize: fontSize.title2, lineHeight: fontSize.title2 + 4, color: theme.color.text }}>
          {value}
        </Text>
        {unit && (
          <Text variant="footnote" color="muted" style={{ marginBottom: 3 }}>
            {unit}
          </Text>
        )}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm }}>
        {delta ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            {delta.direction !== 'flat' && (
              <Icon name={delta.direction === 'up' ? 'arrowUp' : 'arrowDown'} size={12} color={deltaColor} strokeWidth={2.6} />
            )}
            <Text variant="caption" style={{ color: deltaColor, fontFamily: font.bodySemibold }}>
              {delta.text}
            </Text>
          </View>
        ) : (
          <View />
        )}
        {spark && <Sparkline points={spark.points} color={spark.color} />}
      </View>
    </View>
  );
}
