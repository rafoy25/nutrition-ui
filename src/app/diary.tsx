/**
 * Diary — the table + filter page. Every logged entry across all days in one
 * filterable, sortable table. Filters (meal type + text search) sit in one row
 * above the table and scope it together; sorting toggles on the column headers.
 * Grouped-by-day on phones, columnar on wide screens. The daily total row
 * summarizes each day.
 */
import React, { useMemo, useState } from 'react';
import { View, Pressable, Platform, ScrollView } from 'react-native';
import { useTheme, type MacroKey, MACRO_ORDER } from '@/theme';
import { Screen } from '@/components/layout';
import { useResponsive } from '@/theme';
import { Card, Text, Icon, SegmentedControl, Input, Badge, Divider, IconButton } from '@/components/ui';
import { MealEntryRow, MacroChips, foodsSummary } from '@/components/domain';
import { useStore } from '@/data/store';
import { nutrientsFor, addNutrients, EMPTY } from '@/data/nutrition';
import { FOODS } from '@/data/foods';
import { relativeDay, displayTime, shortDate } from '@/data/format';
import type { LogEntry, MealType } from '@/data/types';

type MealFilter = 'All' | MealType;
type SortKey = 'time' | 'kcal';

export default function DiaryScreen() {
  const { theme, space, font } = useTheme();
  const { isPhone } = useResponsive();
  const { log, deleteEntry, dates, entriesFor, totalsFor } = useStore();

  const [mealFilter, setMealFilter] = useState<MealFilter>('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'time', dir: 'desc' });

  const q = query.trim().toLowerCase();

  const matches = (e: LogEntry) => {
    if (mealFilter !== 'All' && e.meal !== mealFilter) return false;
    if (!q) return true;
    if (e.meal.toLowerCase().includes(q)) return true;
    return e.items.some(({ foodKey }) => FOODS[foodKey]?.name.toLowerCase().includes(q));
  };

  const filtered = useMemo(() => log.filter(matches), [log, mealFilter, q]);

  const resultCount = filtered.length;

  const toolbar = (
    <View style={{ gap: space.md }}>
      <View style={{ flexDirection: 'row', gap: space.md, flexWrap: 'wrap', alignItems: 'center' }}>
        <SegmentedControl
          segments={[
            { value: 'All', label: 'All' },
            { value: 'Breakfast', label: 'Breakfast' },
            { value: 'Lunch', label: 'Lunch' },
            { value: 'Dinner', label: 'Dinner' },
            { value: 'Snack', label: 'Snack' },
          ]}
          value={mealFilter}
          onChange={setMealFilter}
          size="sm"
        />
        <View style={{ flex: 1, minWidth: 200, maxWidth: 320 }}>
          <Input value={query} onChangeText={setQuery} placeholder="Search foods or meals…" icon="search" id="diary-search" />
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.xs }}>
        <Icon name="filter" size={14} color={theme.color.textMuted} />
        <Text variant="caption" color="muted">
          {resultCount} {resultCount === 1 ? 'entry' : 'entries'}
          {mealFilter !== 'All' ? ` · ${mealFilter}` : ''}
          {q ? ` · “${query}”` : ''}
        </Text>
      </View>
    </View>
  );

  // Wide: columnar table grouped by day. Phone: stacked cards.
  return (
    <Screen title="Diary" subtitle="Every meal you’ve logged" toolbar={toolbar}>
      {resultCount === 0 ? (
        <Card padding="xl">
          <View style={{ alignItems: 'center', gap: space.sm, paddingVertical: space.xxl }}>
            <Icon name="search" size={28} color={theme.color.textMuted} />
            <Text variant="body" color="muted">
              No entries match these filters. Clear the search or pick a different meal.
            </Text>
          </View>
        </Card>
      ) : isPhone ? (
        <PhoneDiary
          dates={dates}
          filter={matches}
          entriesFor={entriesFor}
          totalsFor={totalsFor}
          onDelete={deleteEntry}
        />
      ) : (
        <WideDiary
          dates={dates}
          filter={matches}
          entriesFor={entriesFor}
          totalsFor={totalsFor}
          onDelete={deleteEntry}
          sort={sort}
          setSort={setSort}
        />
      )}
    </Screen>
  );
}

// -------- Phone: grouped cards --------
function PhoneDiary({
  dates,
  filter,
  entriesFor,
  totalsFor,
  onDelete,
}: {
  dates: string[];
  filter: (e: LogEntry) => boolean;
  entriesFor: (d: string) => LogEntry[];
  totalsFor: (d: string) => ReturnType<typeof nutrientsFor>;
  onDelete: (id: string) => void;
}) {
  const { theme, space, font } = useTheme();
  return (
    <View style={{ gap: space.lg }}>
      {dates.map((date) => {
        const entries = entriesFor(date).filter(filter);
        if (entries.length === 0) return null;
        const dayTotal = entries.reduce((a, e) => addNutrients(a, nutrientsFor(e.items)), { ...EMPTY });
        return (
          <Card key={date} padding="lg" gap="xs">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="subtitle">{relativeDay(date)}</Text>
              <Text style={{ fontFamily: font.monoSemibold, fontSize: 14, color: theme.color.text }}>
                {dayTotal.kcal.toLocaleString()} kcal
              </Text>
            </View>
            <Text variant="caption" color="muted">
              {shortDate(date)}
            </Text>
            {entries.map((e, i) => (
              <View key={e.id}>
                {i > 0 && <Divider />}
                <MealEntryRow entry={e} onDelete={onDelete} />
              </View>
            ))}
          </Card>
        );
      })}
    </View>
  );
}

// -------- Wide: columnar table --------
function SortHeader({
  label,
  active,
  dir,
  onPress,
  width,
  align = 'left',
}: {
  label: string;
  active: boolean;
  dir: 'asc' | 'desc';
  onPress: () => void;
  width?: number;
  align?: 'left' | 'right';
}) {
  const { theme, space, font } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{
        width,
        flex: width ? undefined : 1,
        flexDirection: 'row',
        gap: 3,
        alignItems: 'center',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
      }}
    >
      <Text style={{ fontFamily: font.bodySemibold, fontSize: 11, letterSpacing: 0.6, color: active ? theme.color.text : theme.color.textMuted }}>
        {label.toUpperCase()}
      </Text>
      {active && <Icon name={dir === 'asc' ? 'arrowUp' : 'arrowDown'} size={11} color={theme.color.brand} strokeWidth={2.6} />}
    </Pressable>
  );
}

function WideDiary({
  dates,
  filter,
  entriesFor,
  totalsFor,
  onDelete,
  sort,
  setSort,
}: {
  dates: string[];
  filter: (e: LogEntry) => boolean;
  entriesFor: (d: string) => LogEntry[];
  totalsFor: (d: string) => ReturnType<typeof nutrientsFor>;
  onDelete: (id: string) => void;
  sort: { key: SortKey; dir: 'asc' | 'desc' };
  setSort: (s: { key: SortKey; dir: 'asc' | 'desc' }) => void;
}) {
  const { theme, space, font } = useTheme();
  const toggle = (key: SortKey) =>
    setSort(sort.key === key ? { key, dir: sort.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });

  const W = { meal: 128, cals: 88, macros: 210, actions: 44 };

  return (
    <Card padding="none" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          gap: space.md,
          paddingVertical: space.md,
          paddingHorizontal: space.lg,
          backgroundColor: theme.color.surfaceSunken,
          alignItems: 'center',
        }}
      >
        <View style={{ width: W.meal }}>
          <Text style={{ fontFamily: font.bodySemibold, fontSize: 11, letterSpacing: 0.6, color: theme.color.textMuted }}>MEAL</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: font.bodySemibold, fontSize: 11, letterSpacing: 0.6, color: theme.color.textMuted }}>FOODS</Text>
        </View>
        <View style={{ width: W.macros }}>
          <Text style={{ fontFamily: font.bodySemibold, fontSize: 11, letterSpacing: 0.6, color: theme.color.textMuted }}>MACROS (P · C · F)</Text>
        </View>
        <SortHeader label="Cals" active={sort.key === 'kcal'} dir={sort.dir} onPress={() => toggle('kcal')} width={W.cals} align="right" />
        <View style={{ width: W.actions }} />
      </View>

      {dates.map((date) => {
        let entries = entriesFor(date).filter(filter);
        if (entries.length === 0) return null;
        entries = [...entries].sort((a, b) => {
          if (sort.key === 'kcal') {
            const d = nutrientsFor(a.items).kcal - nutrientsFor(b.items).kcal;
            return sort.dir === 'asc' ? d : -d;
          }
          const d = a.time.localeCompare(b.time);
          return sort.dir === 'asc' ? d : -d;
        });
        const dayTotal = entries.reduce((a, e) => addNutrients(a, nutrientsFor(e.items)), { ...EMPTY });

        return (
          <View key={date}>
            {/* Day divider row */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: space.sm,
                paddingHorizontal: space.lg,
                backgroundColor: theme.color.ground,
                borderTopWidth: 1,
                borderTopColor: theme.color.divider,
              }}
            >
              <View style={{ flexDirection: 'row', gap: space.sm, alignItems: 'baseline' }}>
                <Text variant="label" style={{ color: theme.color.text }}>
                  {relativeDay(date)}
                </Text>
                <Text variant="caption" color="muted" style={{ fontFamily: font.mono }}>
                  {shortDate(date)}
                </Text>
              </View>
              <Text style={{ fontFamily: font.monoSemibold, fontSize: 12, color: theme.color.textSecondary }}>
                {dayTotal.kcal.toLocaleString()} kcal · {Math.round(dayTotal.protein)}P {Math.round(dayTotal.carbs)}C {Math.round(dayTotal.fat)}F
              </Text>
            </View>

            {entries.map((e) => {
              const n = nutrientsFor(e.items);
              return (
                <DiaryRow key={e.id} entry={e} kcal={n.kcal} macros={n} widths={W} onDelete={onDelete} />
              );
            })}
          </View>
        );
      })}
    </Card>
  );
}

function DiaryRow({
  entry,
  kcal,
  macros,
  widths,
  onDelete,
}: {
  entry: LogEntry;
  kcal: number;
  macros: ReturnType<typeof nutrientsFor>;
  widths: { meal: number; cals: number; macros: number; actions: number };
  onDelete: (id: string) => void;
}) {
  const { theme, space, font } = useTheme();
  const [hover, setHover] = useState(false);
  const MEAL_ICON = { Breakfast: 'sun', Lunch: 'flame', Dinner: 'moon', Snack: 'leaf' } as const;

  return (
    <Pressable
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={{
        flexDirection: 'row',
        gap: space.md,
        paddingVertical: space.md,
        paddingHorizontal: space.lg,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.color.divider,
        backgroundColor: hover ? theme.color.surfaceSunken : theme.color.surface,
        ...(Platform.OS === 'web' ? ({ transitionProperty: 'background-color', transitionDuration: '100ms' } as any) : null),
      }}
    >
      <View style={{ width: widths.meal, flexDirection: 'row', gap: space.sm, alignItems: 'center' }}>
        <Icon name={MEAL_ICON[entry.meal]} size={16} color={theme.color.textMuted} />
        <View>
          <Text variant="footnote" style={{ fontFamily: font.bodySemibold, color: theme.color.text }}>
            {entry.meal}
          </Text>
          <Text variant="caption" color="muted" style={{ fontFamily: font.mono }}>
            {displayTime(entry.time)}
          </Text>
        </View>
      </View>
      <Text variant="footnote" color="secondary" style={{ flex: 1 }} numberOfLines={1}>
        {foodsSummary(entry)}
      </Text>
      <View style={{ width: widths.macros }}>
        <MacroChips n={macros} size="sm" />
      </View>
      <Text style={{ width: widths.cals, textAlign: 'right', fontFamily: font.monoSemibold, fontSize: 14, color: theme.color.text }}>
        {kcal.toLocaleString()}
      </Text>
      <View style={{ width: widths.actions, alignItems: 'center' }}>
        {hover && <IconButton name="trash" size={30} tone="ghost" accessibilityLabel={`Delete ${entry.meal}`} onPress={() => onDelete(entry.id)} />}
      </View>
    </Pressable>
  );
}
