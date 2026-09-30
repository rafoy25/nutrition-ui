/** Small display formatters shared across screens. */
import { TODAY } from './seed';

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function relativeDay(iso: string): string {
  if (iso === TODAY) return 'Today';
  const today = parseISO(TODAY).getTime();
  const diff = Math.round((today - parseISO(iso).getTime()) / 86400000);
  if (diff === 1) return 'Yesterday';
  if (diff > 1 && diff < 7) return parseISO(iso).toLocaleDateString('en-US', { weekday: 'long' });
  return parseISO(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function longDate(iso: string): string {
  return parseISO(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function shortDate(iso: string): string {
  return parseISO(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** 24h "HH:MM" → "7:45 AM" */
export function displayTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, '0')} ${period}`;
}

export function compact(n: number): string {
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${n}`;
}
