/**
 * Today — the home screen. Leads with the day's calorie ring (the single hero
 * figure), the macro targets, a coach nudge derived from the day's gaps, and
 * the timeline of meals logged today. Opens in a realistic working state from
 * the sample store.
 */
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Link } from 'expo-router';
import { useTheme, MACRO_ORDER } from '@/theme';
import { Screen, Row, Col } from '@/components/layout';
import { Card, Text, Badge, Button, Icon, Divider } from '@/components/ui';
import { CalorieRing, MacroProgress } from '@/components/charts';
import { MealEntryRow } from '@/components/domain';
import { useStore } from '@/data/store';
import { targetState, pct, DEFAULT_TARGETS } from '@/data/nutrition';
import { longDate } from '@/data/format';

export default function TodayScreen() {
  const { theme, space } = useTheme();
  const { today, targets, totalsFor, entriesFor, deleteEntry } = useStore();

  const totals = totalsFor(today);
  const entries = entriesFor(today);

  // A simple coach nudge: name the macro furthest under target.
  const nudge = useMemo(() => {
    const gaps = MACRO_ORDER.map((k) => {
      const remaining = targets[k] - (totals as any)[k];
      return { k, remaining, percent: pct((totals as any)[k], targets[k]) };
    }).sort((a, b) => b.remaining - a.remaining);
    return gaps[0];
  }, [totals, targets]);

  const calState = targetState(totals.kcal, targets.kcal);
  const sodiumOver = totals.sodium > targets.sodiumLimit;

  return (
    <Screen title="Today" subtitle={longDate(today)}>
      <Row gap="lg" align="stretch">
        {/* Hero: calorie ring */}
        <Col basis="38%" minWidth={280}>
          <Card padding="xl" gap="md" style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="overline" color="muted">
                Calories
              </Text>
              <Badge
                label={calState === 'onTrack' ? 'On track' : calState === 'over' ? 'Over goal' : 'Room to eat'}
                status={calState === 'over' ? 'warning' : 'good'}
              />
            </View>
            <CalorieRing value={totals.kcal} target={targets.kcal} caption={`of ${targets.kcal.toLocaleString()} kcal`} />
            <View style={{ flexDirection: 'row', gap: space.xxl, marginTop: space.xs }}>
              <View style={{ alignItems: 'center' }}>
                <Text variant="caption" color="muted">
                  Fiber
                </Text>
                <Text variant="bodyStrong" style={{ color: theme.color.text }}>
                  {Math.round(totals.fiber)}g
                </Text>
              </View>
              <Divider vertical inset={2} />
              <View style={{ alignItems: 'center' }}>
                <Text variant="caption" color="muted">
                  Sodium
                </Text>
                <Text variant="bodyStrong" style={{ color: sodiumOver ? theme.color.status.critical.ink : theme.color.text }}>
                  {(totals.sodium / 1000).toFixed(1)}g
                </Text>
              </View>
            </View>
          </Card>
        </Col>

        {/* Macro targets */}
        <Col basis="30%" minWidth={240}>
          <Card padding="xl" gap="lg" style={{ flex: 1 }}>
            <Text variant="overline" color="muted">
              Macro targets
            </Text>
            <View style={{ gap: space.lg }}>
              {MACRO_ORDER.map((k) => (
                <MacroProgress key={k} macro={k} value={(totals as any)[k]} target={targets[k]} />
              ))}
            </View>
          </Card>
        </Col>

        {/* Coach nudge */}
        <Col basis="26%" minWidth={220}>
          <Card tone="brand" padding="xl" gap="md" elevated={false} style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
              <Icon name="sparkle" size={18} color={theme.color.onBrand} />
              <Text variant="overline" style={{ color: theme.color.onBrand, opacity: 0.9 }}>
                Coach
              </Text>
            </View>
            <Text variant="title3" style={{ color: theme.color.onBrand }}>
              {nudge.remaining > 5
                ? `You're ${Math.round(nudge.remaining)}g short on ${nudge.k}.`
                : `Macros look balanced today — nice work.`}
            </Text>
            <Text variant="footnote" style={{ color: theme.color.onBrand, opacity: 0.85 }}>
              {nudge.remaining > 5
                ? 'A high-protein snack would close the biggest gap before dinner.'
                : 'Keep sodium under your limit and you’ll finish the day green.'}
            </Text>
            <Link href="/coach" asChild>
              <Button label="Ask the coach" variant="secondary" iconRight="chevronRight" size="sm" style={{ backgroundColor: theme.color.surface }} />
            </Link>
          </Card>
        </Col>
      </Row>

      {/* Timeline */}
      <Card padding="xl" gap="sm">
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text variant="subtitle">Today’s meals</Text>
          <Link href="/log" asChild>
            <Button label="Add" icon="plus" variant="ghost" size="sm" />
          </Link>
        </View>
        {entries.length === 0 ? (
          <View style={{ paddingVertical: space.xxl, alignItems: 'center', gap: space.sm }}>
            <Icon name="leaf" size={28} color={theme.color.textMuted} />
            <Text variant="body" color="muted">
              Nothing logged yet. Add your first meal to start the day.
            </Text>
          </View>
        ) : (
          entries.map((entry, i) => (
            <View key={entry.id}>
              {i > 0 && <Divider />}
              <MealEntryRow entry={entry} onDelete={deleteEntry} />
            </View>
          ))
        )}
      </Card>
    </Screen>
  );
}
