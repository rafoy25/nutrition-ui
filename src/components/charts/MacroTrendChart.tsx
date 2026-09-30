/**
 * MacroTrendChart — daily calorie intake, stacked by macro (protein / carbs /
 * fat, each × its kcal factor), across the selected range. A dashed-free solid
 * target line marks the calorie goal. Segments are separated by a 2px surface
 * gap (never a stroke). Each column is a hit target: hover/focus lifts it and
 * shows a tooltip listing every macro's kcal at that day. A table-view twin
 * carries the same numbers.
 */
import React, { useState } from 'react';
import { View, Pressable, Platform, ScrollView } from 'react-native';
import { useTheme, MACRO_ORDER, MACRO_LABEL, type MacroKey } from '@/theme';
import type { DaySummary } from '@/data/types';
import { macroCalories } from '@/data/nutrition';
import { Text } from '../ui/Text';

interface Props {
  days: DaySummary[];
  targetKcal: number;
  height?: number;
}

function shortDate(iso: string) {
  const [, m, d] = iso.split('-').map(Number);
  return `${d}`;
}
function weekday(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { weekday: 'short' });
}
function fullDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function MacroTrendChart({ days, targetKcal, height = 210 }: Props) {
  const { theme, space, radius, font } = useTheme();
  const [active, setActive] = useState<number | null>(null);

  const kcalOf = (d: DaySummary) => {
    const mc = macroCalories(d);
    return { protein: mc.protein, carbs: mc.carbs, fat: mc.fat, total: mc.protein + mc.carbs + mc.fat };
  };

  const maxVal = Math.max(targetKcal * 1.15, ...days.map((d) => kcalOf(d).total), 1);
  // round axis to a clean step
  const step = maxVal > 2500 ? 1000 : 500;
  const axisMax = Math.ceil(maxVal / step) * step;
  const ticks = [];
  for (let t = 0; t <= axisMax; t += step) ticks.push(t);

  const plotH = height;
  const barCap = 22;
  const gap = 2;
  const yAxisW = 40;

  const many = days.length > 10;
  const colW = many ? 26 : 40;

  const macroColor = (k: MacroKey) => theme.color.macro[k].base;

  const bars = (
    <View style={{ flexDirection: 'row' }}>
      {/* Y axis */}
      <View style={{ width: yAxisW, height: plotH + 22 }}>
        {ticks
          .slice()
          .reverse()
          .map((t) => (
            <View
              key={t}
              style={{
                position: 'absolute',
                right: 6,
                top: (1 - t / axisMax) * plotH - 7,
              }}
            >
              <Text style={{ fontFamily: font.mono, fontSize: 10, color: theme.color.textMuted }}>
                {t >= 1000 ? `${t / 1000}k` : t}
              </Text>
            </View>
          ))}
      </View>

      {/* Plot */}
      <View style={{ flex: 1 }}>
        <View style={{ height: plotH, position: 'relative' }}>
          {/* Gridlines */}
          {ticks.map((t) => (
            <View
              key={t}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: (1 - t / axisMax) * plotH,
                height: 1,
                backgroundColor: theme.color.grid,
              }}
            />
          ))}
          {/* Target line */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: (1 - targetKcal / axisMax) * plotH,
              height: 2,
              backgroundColor: theme.color.brand,
              opacity: 0.9,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: 0,
              top: (1 - targetKcal / axisMax) * plotH - 16,
              backgroundColor: theme.color.brandTint,
              paddingHorizontal: 6,
              paddingVertical: 1,
              borderRadius: 4,
            }}
          >
            <Text style={{ fontFamily: font.monoSemibold, fontSize: 10, color: theme.color.brand }}>
              Goal {targetKcal >= 1000 ? `${(targetKcal / 1000).toFixed(1)}k` : targetKcal}
            </Text>
          </View>

          {/* Columns */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: 'row', alignItems: 'flex-end', height: plotH, gap: many ? 4 : 8, paddingHorizontal: 2 }}
          >
            {days.map((d, i) => {
              const k = kcalOf(d);
              const isActive = active === i;
              const isDim = active !== null && !isActive;
              return (
                <Pressable
                  key={d.date}
                  onHoverIn={() => setActive(i)}
                  onHoverOut={() => setActive((a) => (a === i ? null : a))}
                  onPress={() => setActive((a) => (a === i ? null : i))}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive((a) => (a === i ? null : a))}
                  accessibilityRole="button"
                  accessibilityLabel={`${fullDate(d.date)}: ${Math.round(k.total)} kcal, protein ${Math.round(k.protein)}, carbs ${Math.round(k.carbs)}, fat ${Math.round(k.fat)}`}
                  style={{
                    width: colW,
                    height: plotH,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
                  }}
                >
                  <View style={{ width: barCap, opacity: isDim ? 0.42 : 1, alignItems: 'stretch' }}>
                    {MACRO_ORDER.map((mk, idx) => {
                      const val = k[mk];
                      const h = (val / axisMax) * plotH;
                      if (h < 0.5) return null;
                      const isTop = idx === 0; // protein drawn first = top of stack (drawn column-reverse below)
                      return (
                        <View
                          key={mk}
                          style={{
                            height: h,
                            backgroundColor: macroColor(mk),
                            marginBottom: idx === MACRO_ORDER.length - 1 ? 0 : gap,
                            borderTopLeftRadius: isTop ? 4 : 0,
                            borderTopRightRadius: isTop ? 4 : 0,
                          }}
                        />
                      );
                    }).reverse()}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* X axis labels */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={{ flexDirection: 'row', gap: many ? 4 : 8, paddingHorizontal: 2, marginTop: 6 }}
        >
          {days.map((d, i) => (
            <View key={d.date} style={{ width: colW, alignItems: 'center' }}>
              <Text style={{ fontFamily: font.mono, fontSize: 10, color: active === i ? theme.color.text : theme.color.textMuted }}>
                {many ? shortDate(d.date) : weekday(d.date)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  // Floating tooltip (rendered above the chart region)
  const tip =
    active !== null && days[active] ? (
      <View
        style={{
          backgroundColor: theme.color.text,
          borderRadius: radius.md,
          paddingVertical: space.sm,
          paddingHorizontal: space.md,
          gap: 6,
          alignSelf: 'flex-start',
        }}
      >
        <Text style={{ fontFamily: font.bodySemibold, fontSize: 12, color: theme.color.surface }}>
          {fullDate(days[active].date)}
        </Text>
        {MACRO_ORDER.map((mk) => (
          <View key={mk} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 14, height: 3, borderRadius: 2, backgroundColor: macroColor(mk) }} />
            <Text style={{ fontFamily: font.monoSemibold, fontSize: 12, color: theme.color.surface }}>
              {Math.round(kcalOf(days[active])[mk]).toLocaleString()}
            </Text>
            <Text style={{ fontFamily: font.body, fontSize: 11, color: theme.color.surface, opacity: 0.75 }}>
              {MACRO_LABEL[mk]} kcal
            </Text>
          </View>
        ))}
        <View style={{ height: 1, backgroundColor: theme.color.surface, opacity: 0.2, marginVertical: 1 }} />
        <Text style={{ fontFamily: font.monoSemibold, fontSize: 12, color: theme.color.surface }}>
          {Math.round(kcalOf(days[active]).total).toLocaleString()} kcal total
        </Text>
      </View>
    ) : (
      <Text variant="caption" color="muted">
        Hover or tap a day to see its macro breakdown.
      </Text>
    );

  return (
    <View style={{ gap: space.md }}>
      <View style={{ minHeight: 54, justifyContent: 'flex-end' }}>{tip}</View>
      {bars}
    </View>
  );
}
