/**
 * MealEntryRow — one logged meal in the timeline / diary. Shows the meal type
 * badge, time, the foods in plain language, calorie total, and macro chips.
 * Optional delete action appears on hover (web) or always (touch).
 */
import React, { useState } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { useTheme } from '@/theme';
import { Text, Icon, IconButton } from '@/components/ui';
import type { LogEntry } from '@/data/types';
import { FOODS } from '@/data/foods';
import { nutrientsFor } from '@/data/nutrition';
import { displayTime } from '@/data/format';
import { MacroChips } from './MacroChips';

const MEAL_ICON = { Breakfast: 'sun', Lunch: 'flame', Dinner: 'moon', Snack: 'leaf' } as const;

export function foodsSummary(entry: LogEntry): string {
  return entry.items
    .map(({ foodKey, qty }) => {
      const f = FOODS[foodKey];
      if (!f) return '';
      return qty === 1 ? f.name : `${f.name} ×${qty % 1 === 0 ? qty : qty.toFixed(1)}`;
    })
    .filter(Boolean)
    .join(', ');
}

export function MealEntryRow({
  entry,
  onDelete,
  showTime = true,
}: {
  entry: LogEntry;
  onDelete?: (id: string) => void;
  showTime?: boolean;
}) {
  const { theme, space, radius, font } = useTheme();
  const [hover, setHover] = useState(false);
  const n = nutrientsFor(entry.items);

  return (
    <Pressable
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={{
        flexDirection: 'row',
        gap: space.md,
        paddingVertical: space.md,
        ...(Platform.OS === 'web' ? ({ cursor: 'default' } as any) : null),
      }}
    >
      {/* Meal icon */}
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: radius.md,
          backgroundColor: theme.color.surfaceSunken,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 2,
        }}
      >
        <Icon name={MEAL_ICON[entry.meal]} size={19} color={theme.color.textSecondary} />
      </View>

      {/* Body */}
      <View style={{ flex: 1, gap: space.xs }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' }}>
          <Text variant="bodyStrong">{entry.meal}</Text>
          {showTime && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Icon name="clock" size={12} color={theme.color.textMuted} />
              <Text variant="caption" color="muted" style={{ fontFamily: font.mono }}>
                {displayTime(entry.time)}
              </Text>
            </View>
          )}
        </View>
        <Text variant="footnote" color="secondary" numberOfLines={2}>
          {foodsSummary(entry)}
        </Text>
        <MacroChips n={n} />
      </View>

      {/* Trailing: calories + delete */}
      <View style={{ alignItems: 'flex-end', gap: space.xs, justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 3 }}>
          <Text style={{ fontFamily: font.bodyBold, fontSize: 17, color: theme.color.text }}>{n.kcal}</Text>
          <Text variant="caption" color="muted">
            kcal
          </Text>
        </View>
        {onDelete && (hover || Platform.OS !== 'web') && (
          <IconButton name="trash" size={30} tone="ghost" accessibilityLabel={`Delete ${entry.meal}`} onPress={() => onDelete(entry.id)} />
        )}
      </View>
    </Pressable>
  );
}
