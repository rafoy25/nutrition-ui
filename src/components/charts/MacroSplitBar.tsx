/**
 * MacroSplitBar — a single horizontal part-to-whole bar showing how the day's
 * calories divide across protein / carbs / fat. Segments carry the macro color,
 * separated by 2px surface gaps; each is direct-labeled with its percentage
 * when it's wide enough, and every value is listed below as a legend row so
 * nothing depends on the segment fitting a label.
 */
import React from 'react';
import { View } from 'react-native';
import { useTheme, MACRO_ORDER, MACRO_LABEL, type MacroKey } from '@/theme';
import { macroCalories } from '@/data/nutrition';
import type { Nutrients } from '@/data/types';
import { Text } from '../ui/Text';

export function MacroSplitBar({ totals }: { totals: Pick<Nutrients, 'protein' | 'carbs' | 'fat'> }) {
  const { theme, space, radius, font } = useTheme();
  const mc = macroCalories(totals);
  const total = mc.protein + mc.carbs + mc.fat || 1;
  const grams: Record<MacroKey, number> = { protein: totals.protein, carbs: totals.carbs, fat: totals.fat };
  const pctOf = (k: MacroKey) => Math.round((mc[k] / total) * 100);

  return (
    <View style={{ gap: space.md }}>
      <View style={{ flexDirection: 'row', height: 16, borderRadius: radius.sm, overflow: 'hidden', backgroundColor: theme.color.surfaceSunken }}>
        {MACRO_ORDER.map((k, idx) => {
          const w = (mc[k] / total) * 100;
          const p = pctOf(k);
          return (
            <View
              key={k}
              style={{
                width: `${w}%`,
                backgroundColor: theme.color.macro[k].base,
                marginRight: idx === MACRO_ORDER.length - 1 ? 0 : 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {w > 14 && (
                <Text style={{ fontFamily: font.monoSemibold, fontSize: 10, color: '#FFFFFF' }}>{p}%</Text>
              )}
            </View>
          );
        })}
      </View>

      <View style={{ flexDirection: 'row', gap: space.md, flexWrap: 'wrap' }}>
        {MACRO_ORDER.map((k) => (
          <View key={k} style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs, flex: 1, minWidth: 90 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: theme.color.macro[k].base }} />
            <View>
              <Text variant="caption" color="secondary" style={{ fontFamily: font.bodyMedium }}>
                {MACRO_LABEL[k]}
              </Text>
              <Text style={{ fontFamily: font.monoSemibold, fontSize: 13, color: theme.color.text }}>
                {Math.round(grams[k])}g · {pctOf(k)}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
