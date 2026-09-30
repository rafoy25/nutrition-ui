/**
 * Log a meal — the form page. Pick a meal type, search foods and add them (each
 * with a quantity stepper), set the time, and submit. A live nutrition preview
 * updates as items change so the reader sees the impact before saving. On
 * submit the entry is added to the store and the user is routed to Today.
 */
import React, { useMemo, useState } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTheme, MACRO_ORDER } from '@/theme';
import { Screen, Row, Col } from '@/components/layout';
import { Card, Text, Icon, Button, Field, Input, Stepper, SegmentedControl, Divider, Badge } from '@/components/ui';
import { CalorieRing, MacroProgress } from '@/components/charts';
import { useStore } from '@/data/store';
import { searchFoods, FOODS } from '@/data/foods';
import { nutrientsFor } from '@/data/nutrition';
import { MEAL_TYPES, type MealType, type LoggedFood } from '@/data/types';

const MEAL_SEGMENTS = MEAL_TYPES.map((m) => ({ value: m, label: m }));

export default function LogScreen() {
  const { theme, space, radius, font } = useTheme();
  const { addEntry, today, targets } = useStore();

  const [meal, setMeal] = useState<MealType>('Lunch');
  const [time, setTime] = useState('12:30');
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [items, setItems] = useState<LoggedFood[]>([
    { foodKey: 'chicken', qty: 1 },
    { foodKey: 'rice', qty: 1 },
  ]);
  const [timeError, setTimeError] = useState<string>();

  const results = useMemo(() => searchFoods(query), [query]);
  const preview = useMemo(() => nutrientsFor(items), [items]);

  const addFood = (foodKey: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.foodKey === foodKey);
      if (existing) return prev.map((i) => (i.foodKey === foodKey ? { ...i, qty: Math.round((i.qty + 1) * 10) / 10 } : i));
      return [...prev, { foodKey, qty: 1 }];
    });
    setQuery('');
  };
  const setQty = (foodKey: string, qty: number) =>
    setItems((prev) => prev.map((i) => (i.foodKey === foodKey ? { ...i, qty } : i)));
  const removeFood = (foodKey: string) => setItems((prev) => prev.filter((i) => i.foodKey !== foodKey));

  const validTime = /^([01]?\d|2[0-3]):[0-5]\d$/.test(time);

  const submit = () => {
    if (!validTime) {
      setTimeError('Enter a time as HH:MM, e.g. 12:30.');
      return;
    }
    if (items.length === 0) return;
    addEntry({ date: today, time: time.padStart(5, '0'), meal, items });
    router.push('/');
  };

  return (
    <Screen title="Log a meal" subtitle="Search foods and build your entry" maxWidth={1000}>
      <Row gap="lg" align="stretch">
        {/* Form column */}
        <Col basis="58%" minWidth={320}>
          <Card padding="xl" gap="xl">
            {/* Meal + time */}
            <Row gap="lg">
              <Col basis="60%" minWidth={200}>
                <Field label="Meal">
                  <SegmentedControl segments={MEAL_SEGMENTS} value={meal} onChange={setMeal} size="sm" />
                </Field>
              </Col>
              <Col basis="36%" minWidth={140}>
                <Field label="Time" error={timeError} hint={!timeError ? '24-hour, HH:MM' : undefined}>
                  <Input
                    id="log-time"
                    value={time}
                    onChangeText={(t) => {
                      setTime(t);
                      setTimeError(undefined);
                    }}
                    icon="clock"
                    placeholder="12:30"
                    invalid={!!timeError}
                  />
                </Field>
              </Col>
            </Row>

            <Divider />

            {/* Food search */}
            <Field label="Add food" hint="Sample food database — type to search">
              <View style={{ position: 'relative', zIndex: 10 }}>
                <Input
                  id="log-search"
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search foods…"
                  icon="search"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                />
                {searchFocused && (
                  <Card
                    padding="xs"
                    elevated
                    style={{
                      position: 'absolute',
                      top: 54,
                      left: 0,
                      right: 0,
                      zIndex: 20,
                      gap: 2,
                    }}
                  >
                    {results.length === 0 ? (
                      <Text variant="footnote" color="muted" style={{ padding: space.sm }}>
                        No matches. Try “chicken”, “oats”, or “salad”.
                      </Text>
                    ) : (
                      results.map((f) => (
                        <Pressable
                          key={f.key}
                          onPress={() => addFood(f.key)}
                          style={({ pressed }) => ({
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: space.sm,
                            borderRadius: radius.sm,
                            backgroundColor: pressed ? theme.color.surfaceSunken : 'transparent',
                            ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
                          })}
                        >
                          <View style={{ flex: 1 }}>
                            <Text variant="footnote" style={{ color: theme.color.text }}>
                              {f.name}
                            </Text>
                            <Text variant="caption" color="muted">
                              {f.serving} · {f.kcal} kcal
                            </Text>
                          </View>
                          <Icon name="plus" size={16} color={theme.color.brand} />
                        </Pressable>
                      ))
                    )}
                  </Card>
                )}
              </View>
            </Field>

            {/* Selected items */}
            <View style={{ gap: space.sm }}>
              <Text variant="label" color="secondary">
                In this meal ({items.length})
              </Text>
              {items.length === 0 ? (
                <View style={{ paddingVertical: space.xl, alignItems: 'center' }}>
                  <Text variant="footnote" color="muted">
                    No foods yet — search above to add some.
                  </Text>
                </View>
              ) : (
                items.map((item) => {
                  const f = FOODS[item.foodKey];
                  const n = nutrientsFor([item]);
                  return (
                    <View
                      key={item.foodKey}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: space.md,
                        padding: space.sm,
                        borderRadius: radius.md,
                        backgroundColor: theme.color.surfaceSunken,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text variant="footnote" style={{ color: theme.color.text }}>
                          {f.name}
                        </Text>
                        <Text variant="caption" color="muted">
                          {f.serving} · {n.kcal} kcal
                        </Text>
                      </View>
                      <Stepper value={item.qty} onChange={(q) => setQty(item.foodKey, q)} />
                      <Pressable
                        onPress={() => removeFood(item.foodKey)}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${f.name}`}
                        style={{ padding: space.xs }}
                      >
                        <Icon name="close" size={18} color={theme.color.textMuted} />
                      </Pressable>
                    </View>
                  );
                })
              )}
            </View>

            <Button label="Save meal" icon="check" onPress={submit} fullWidth size="lg" disabled={items.length === 0} />
          </Card>
        </Col>

        {/* Live preview */}
        <Col basis="38%" minWidth={260}>
          <Card padding="xl" gap="lg" style={{ alignItems: 'center' }}>
            <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="overline" color="muted">
                This meal
              </Text>
              <Badge label={meal} tint={theme.color.brandTint} ink={theme.color.brand} icon="leaf" />
            </View>
            <CalorieRing value={preview.kcal} target={targets.kcal} size={148} caption="of daily goal" />
            <View style={{ alignSelf: 'stretch', gap: space.lg, marginTop: space.xs }}>
              {MACRO_ORDER.map((k) => (
                <MacroProgress key={k} macro={k} value={(preview as any)[k]} target={targets[k]} />
              ))}
            </View>
            <Divider />
            <View style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="footnote" color="muted">
                Fiber {Math.round(preview.fiber)}g
              </Text>
              <Text variant="footnote" color="muted">
                Sodium {preview.sodium.toLocaleString()} mg
              </Text>
            </View>
          </Card>
        </Col>
      </Row>
    </Screen>
  );
}
