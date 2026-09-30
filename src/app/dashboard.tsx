/**
 * Trends — the dashboard. A single date-range filter row scopes everything
 * below it: KPI stat tiles (averages + sparklines), the stacked macro trend
 * chart with a goal line, today's macro split, and a fiber/sodium panel with a
 * top-sources table. Every chart re-renders against the same slice.
 */
import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTheme, MACRO_ORDER, MACRO_LABEL, type MacroKey } from '@/theme';
import { Screen, Row, Col } from '@/components/layout';
import { Card, Text, SegmentedControl, Badge, Icon, Divider, Meter } from '@/components/ui';
import { StatTile, ChartFrame, MacroTrendChart, MacroSplitBar } from '@/components/charts';
import { useStore } from '@/data/store';
import { macroCalories } from '@/data/nutrition';
import { FOODS } from '@/data/foods';
import { shortDate } from '@/data/format';

type Range = '7' | '14' | '30';
const RANGE_DAYS: Record<Range, number> = { '7': 7, '14': 14, '30': 30 };

export default function DashboardScreen() {
  const { theme, space, font } = useTheme();
  const { daySeries, targets, today, log } = useStore();
  const [range, setRange] = useState<Range>('7');

  const n = RANGE_DAYS[range];
  const days = useMemo(() => daySeries(n), [daySeries, n]);
  const loggedDays = days.filter((d) => d.kcal > 0);

  const avg = useMemo(() => {
    const base = loggedDays.length || 1;
    const sum = loggedDays.reduce(
      (a, d) => ({
        kcal: a.kcal + d.kcal,
        protein: a.protein + d.protein,
        carbs: a.carbs + d.carbs,
        fat: a.fat + d.fat,
        fiber: a.fiber + d.fiber,
        sodium: a.sodium + d.sodium,
      }),
      { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 },
    );
    return {
      kcal: Math.round(sum.kcal / base),
      protein: Math.round(sum.protein / base),
      carbs: Math.round(sum.carbs / base),
      fat: Math.round(sum.fat / base),
      fiber: Math.round(sum.fiber / base),
      sodium: Math.round(sum.sodium / base),
    };
  }, [loggedDays]);

  const todayTotals = days[days.length - 1];

  // Top sodium sources over the range.
  const topSodium = useMemo(() => {
    const cutoff = days[0]?.date ?? today;
    const acc: Record<string, { na: number; count: number }> = {};
    for (const e of log) {
      if (e.date < cutoff || e.date > today) continue;
      for (const { foodKey, qty } of e.items) {
        const f = FOODS[foodKey];
        if (!f) continue;
        acc[foodKey] = acc[foodKey] ?? { na: 0, count: 0 };
        acc[foodKey].na += f.sodium * qty;
        acc[foodKey].count += 1;
      }
    }
    return Object.entries(acc)
      .map(([k, v]) => ({ name: FOODS[k].name, na: Math.round(v.na), count: v.count }))
      .sort((a, b) => b.na - a.na)
      .slice(0, 5);
  }, [log, days, today]);

  const legend = MACRO_ORDER.map((k) => ({ label: MACRO_LABEL[k], color: theme.color.macro[k].base }));

  const sparkFor = (key: keyof typeof avg) => days.map((d) => (d[key] as number) || 0);

  const rangeFilter = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, flexWrap: 'wrap' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
        <Icon name="filter" size={16} color={theme.color.textMuted} />
        <Text variant="label" color="muted">
          Range
        </Text>
      </View>
      <SegmentedControl
        segments={[
          { value: '7', label: '7 days' },
          { value: '14', label: '14 days' },
          { value: '30', label: '30 days' },
        ]}
        value={range}
        onChange={setRange}
      />
      <Text variant="footnote" color="muted">
        {days[0] ? `${shortDate(days[0].date)} – ${shortDate(today)}` : ''} · {loggedDays.length} days logged
      </Text>
    </View>
  );

  return (
    <Screen title="Trends" subtitle="How your intake tracks against goal" toolbar={rangeFilter}>
      {/* KPI row */}
      <Row gap="lg">
        <Col basis="23%" minWidth={168}>
          <Card padding="lg">
            <StatTile
              label="Avg calories"
              value={avg.kcal.toLocaleString()}
              unit="kcal/day"
              delta={{
                text: `${avg.kcal <= targets.kcal ? 'under' : 'over'} goal`,
                direction: avg.kcal <= targets.kcal ? 'down' : 'up',
                goodDirection: 'down',
              }}
              spark={{ points: sparkFor('kcal') }}
            />
          </Card>
        </Col>
        {MACRO_ORDER.map((k) => (
          <Col key={k} basis="23%" minWidth={168}>
            <Card padding="lg">
              <StatTile
                label={`Avg ${MACRO_LABEL[k].toLowerCase()}`}
                value={`${avg[k]}`}
                unit="g/day"
                dotColor={theme.color.macro[k].base}
                delta={{
                  text: `goal ${targets[k]}g`,
                  direction: 'flat',
                }}
                spark={{ points: sparkFor(k), color: theme.color.macro[k].base }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main trend chart */}
      <Card padding="xl">
        <ChartFrame
          title="Daily calories by macro"
          subtitle="Stacked intake vs. your calorie goal line"
          legend={[...legend, { label: 'Goal', color: theme.color.brand, shape: 'line' as const }]}
          table={<MacroTrendTable days={days} />}
        >
          <MacroTrendChart days={days} targetKcal={targets.kcal} />
        </ChartFrame>
      </Card>

      <Row gap="lg" align="stretch">
        {/* Macro split today */}
        <Col basis="48%" minWidth={300}>
          <Card padding="xl" gap="lg" style={{ flex: 1 }}>
            <ChartFrame title="Today’s macro split" subtitle="Share of calories from each macro">
              <MacroSplitBar totals={todayTotals} />
            </ChartFrame>
          </Card>
        </Col>

        {/* Sodium panel */}
        <Col basis="48%" minWidth={300}>
          <Card padding="xl" gap="lg" style={{ flex: 1 }}>
            <ChartFrame title="Sodium watch" subtitle={`Avg ${(avg.sodium / 1000).toFixed(1)}g of ${(targets.sodiumLimit / 1000).toFixed(1)}g daily limit`}>
              <View style={{ gap: space.md }}>
                <Meter
                  progress={avg.sodium / targets.sodiumLimit}
                  color={avg.sodium > targets.sodiumLimit ? theme.color.status.critical.base : theme.color.status.good.base}
                  height={10}
                  marker={1}
                  markerColor={theme.color.textMuted}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Badge
                    label={avg.sodium > targets.sodiumLimit ? 'Above limit' : 'Within limit'}
                    status={avg.sodium > targets.sodiumLimit ? 'critical' : 'good'}
                  />
                  <Text variant="caption" color="muted" style={{ fontFamily: font.mono }}>
                    limit {(targets.sodiumLimit / 1000).toFixed(1)}g
                  </Text>
                </View>

                <Divider />
                <Text variant="label" color="secondary">
                  Top sources this range
                </Text>
                {topSodium.map((s, i) => (
                  <View key={s.name} style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                    <Text variant="footnote" color="muted" style={{ fontFamily: font.mono, width: 16 }}>
                      {i + 1}
                    </Text>
                    <Text variant="footnote" style={{ flex: 1, color: theme.color.text }} numberOfLines={1}>
                      {s.name}
                    </Text>
                    <Text variant="footnote" style={{ fontFamily: font.monoSemibold, color: theme.color.text }}>
                      {s.na.toLocaleString()} mg
                    </Text>
                  </View>
                ))}
              </View>
            </ChartFrame>
          </Card>
        </Col>
      </Row>
    </Screen>
  );
}

/** Table-view twin of the trend chart. */
function MacroTrendTable({ days }: { days: ReturnType<ReturnType<typeof useStore>['daySeries']> }) {
  const { theme, space, font } = useTheme();
  const cell = (v: string, w: number, strong = false, color?: string) => (
    <Text
      style={{
        width: w,
        fontFamily: strong ? font.monoSemibold : font.mono,
        fontSize: 12,
        color: color ?? theme.color.textSecondary,
        textAlign: 'right',
      }}
    >
      {v}
    </Text>
  );
  return (
    <View style={{ gap: space.xs }}>
      <View style={{ flexDirection: 'row', gap: space.md, paddingBottom: space.xs, borderBottomWidth: 1, borderBottomColor: theme.color.divider }}>
        <Text style={{ flex: 1, fontFamily: font.bodySemibold, fontSize: 11, color: theme.color.textMuted }}>DATE</Text>
        {['P', 'C', 'F', 'KCAL'].map((h, i) => (
          <Text key={h} style={{ width: i === 3 ? 52 : 40, textAlign: 'right', fontFamily: font.bodySemibold, fontSize: 11, color: theme.color.textMuted }}>
            {h}
          </Text>
        ))}
      </View>
      {days
        .slice()
        .reverse()
        .map((d) => {
          const mc = macroCalories(d);
          return (
            <View key={d.date} style={{ flexDirection: 'row', gap: space.md, alignItems: 'center' }}>
              <Text style={{ flex: 1, fontFamily: font.mono, fontSize: 12, color: theme.color.text }}>{shortDate(d.date)}</Text>
              {cell(`${Math.round(d.protein)}`, 40, false, theme.color.macro.protein.base)}
              {cell(`${Math.round(d.carbs)}`, 40, false, theme.color.macro.carbs.base)}
              {cell(`${Math.round(d.fat)}`, 40, false, theme.color.macro.fat.base)}
              {cell(`${Math.round(mc.protein + mc.carbs + mc.fat).toLocaleString()}`, 52, true, theme.color.text)}
            </View>
          );
        })}
    </View>
  );
}
