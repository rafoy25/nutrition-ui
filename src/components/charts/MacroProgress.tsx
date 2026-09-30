/**
 * MacroProgress — a compact per-macro progress row: label, current/target in
 * grams, a meter in the macro color, and a status pill. Used in the form's live
 * preview and the dashboard's targets card. Meaning is carried by the label +
 * number, not color alone.
 */
import React from 'react';
import { View } from 'react-native';
import { useTheme, MACRO_LABEL, type MacroKey } from '@/theme';
import { targetState, pct } from '@/data/nutrition';
import { Text } from '../ui/Text';
import { Meter } from '../ui/Meter';

export function MacroProgress({
  macro,
  value,
  target,
}: {
  macro: MacroKey;
  value: number;
  target: number;
}) {
  const { theme, space, font } = useTheme();
  const color = theme.color.macro[macro].base;
  const state = targetState(value, target);
  const percent = pct(value, target);

  const stateLabel = state === 'under' ? 'Under' : state === 'over' ? 'Over' : 'On track';
  const stateColor =
    state === 'onTrack' ? theme.color.status.good.ink : state === 'over' ? theme.color.status.warning.ink : theme.color.textMuted;

  return (
    <View style={{ gap: space.xs }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
          <View style={{ width: 9, height: 9, borderRadius: 3, backgroundColor: color }} />
          <Text variant="footnote" style={{ fontFamily: font.bodyMedium, color: theme.color.text }}>
            {MACRO_LABEL[macro]}
          </Text>
        </View>
        <Text style={{ fontFamily: font.mono, fontSize: 12, color: theme.color.textSecondary }}>
          <Text style={{ fontFamily: font.monoSemibold, color: theme.color.text }}>{Math.round(value)}</Text>
          {` / ${target}g`}
        </Text>
      </View>
      <Meter progress={value / target} color={color} height={7} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="caption" style={{ color: stateColor, fontFamily: font.bodySemibold }}>
          {stateLabel}
        </Text>
        <Text variant="caption" color="muted" style={{ fontFamily: font.mono }}>
          {percent}%
        </Text>
      </View>
    </View>
  );
}
