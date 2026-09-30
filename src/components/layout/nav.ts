import type { IconName } from '@/components/ui';
import type { Href } from 'expo-router';

export interface NavItem {
  href: Href;
  /** pathname used to decide the active state */
  match: string;
  label: string;
  icon: IconName;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/', match: '/', label: 'Today', icon: 'home' },
  { href: '/dashboard', match: '/dashboard', label: 'Trends', icon: 'chart' },
  { href: '/log', match: '/log', label: 'Log', icon: 'plus' },
  { href: '/diary', match: '/diary', label: 'Diary', icon: 'table' },
  { href: '/coach', match: '/coach', label: 'Coach', icon: 'chat' },
];
