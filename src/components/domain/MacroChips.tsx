/**
 * MacroChips — the compact P / C / F row shown on every logged entry, echoing
 * the reference app's colored macro dots. Each chip is a macro-tinted pill with
 * the gram value; the letter + number carry the meaning, color supplements it.
 */
import React from 'react';
import { View } from 'react-native';
import { useTheme, MACRO_ORDER, type MacroKey } from '@/theme';
import { Text } from '@/components/ui';
import type { Nutrients } from '@/data/types';

const LETTER: Record<MacroKey, string> = { protein: 'P', carbs: 'C', fat: 'F' };

export function MacroChips({ n, size = 'md' }: { n: Nutrients; size?: 'sm' | 'md' }) {
  const { theme, space, font } = useTheme();
  const grams: Record<MacroKey, number> = { protein: n.protein, carbs: n.carbs, fat: n.fat };
  const fs = size === 'sm' ? 10 : 11;

  return (
    <View style={{ flexDirection: 'row', gap: space.xs, flexWrap: 'wrap' }}>
      {MACRO_ORDER.map((k) => (
        <View
          key={k}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 6,
            backgroundColor: theme.color.macro[k].tint,
          }}
        >
          <Text style={{ fontFamily: font.monoSemibold, fontSize: fs, color: theme.color.macro[k].base }}>
            {LETTER[k]}
          </Text>
          <Text style={{ fontFamily: font.mono, fontSize: fs, color: theme.color.textSecondary }}>
            {Math.round(grams[k])}g
          </Text>
        </View>
      ))}
    </View>
  );
}
