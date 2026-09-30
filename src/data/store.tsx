/**
 * App store — the single source of truth for the log and targets, shared by all
 * four screens. Backend is intentionally out of scope: this is in-memory state
 * seeded from sample data, with derived selectors memoized. Adding an entry on
 * the log screen updates the dashboard, table, and coach immediately.
 */
import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { SEED_LOG, TODAY } from './seed';
import { DEFAULT_TARGETS, nutrientsFor, addNutrients, EMPTY } from './nutrition';
import type { LogEntry, LoggedFood, MealType, Nutrients, Targets, DaySummary } from './types';

let idCounter = 1000;
const nextId = () => `log_${idCounter++}`;

export interface NewEntry {
  date: string;
  time: string;
  meal: MealType;
  items: LoggedFood[];
}

interface StoreValue {
  today: string;
  log: LogEntry[];
  targets: Targets;
  addEntry: (e: NewEntry) => void;
  deleteEntry: (id: string) => void;
  /** All distinct dates present, newest first. */
  dates: string[];
  /** Per-day totals for the last `n` days ending today, oldest→newest. */
  daySeries: (n: number) => DaySummary[];
  /** Total nutrients for one date. */
  totalsFor: (date: string) => Nutrients;
  entriesFor: (date: string) => LogEntry[];
}

const StoreContext = createContext<StoreValue | null>(null);

function isoDaysAgo(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const t = Date.UTC(y, m - 1, d) - n * 86400000;
  return new Date(t).toISOString().slice(0, 10);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [log, setLog] = useState<LogEntry[]>(SEED_LOG);

  const addEntry = useCallback((e: NewEntry) => {
    const entry: LogEntry = { id: nextId(), ...e };
    setLog((prev) =>
      [entry, ...prev].sort((a, b) =>
        b.date === a.date ? b.time.localeCompare(a.time) : b.date.localeCompare(a.date),
      ),
    );
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setLog((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const value = useMemo<StoreValue>(() => {
    const byDate = new Map<string, LogEntry[]>();
    for (const e of log) {
      const arr = byDate.get(e.date) ?? [];
      arr.push(e);
      byDate.set(e.date, arr);
    }
    const dates = [...byDate.keys()].sort((a, b) => b.localeCompare(a));

    const totalsFor = (date: string): Nutrients =>
      (byDate.get(date) ?? []).reduce((acc, e) => addNutrients(acc, nutrientsFor(e.items)), { ...EMPTY });

    const entriesFor = (date: string): LogEntry[] =>
      [...(byDate.get(date) ?? [])].sort((a, b) => b.time.localeCompare(a.time));

    const daySeries = (n: number): DaySummary[] => {
      const out: DaySummary[] = [];
      for (let i = n - 1; i >= 0; i--) {
        const date = isoDaysAgo(TODAY, i);
        out.push({ date, ...totalsFor(date) });
      }
      return out;
    };

    return {
      today: TODAY,
      log,
      targets: DEFAULT_TARGETS,
      addEntry,
      deleteEntry,
      dates,
      daySeries,
      totalsFor,
      entriesFor,
    };
  }, [log, addEntry, deleteEntry]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
