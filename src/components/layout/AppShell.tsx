/**
 * AppShell — the responsive frame around every screen. Wide screens get the
 * SideRail on the left and the content in a centered max-width column; phones
 * get the BottomBar under a scrolling content area. The single responsive
 * decision (rail vs. bar) lives here so screens stay layout-agnostic.
 */
import React from 'react';
import { View } from 'react-native';
import { useTheme, useResponsive } from '@/theme';
import { SideRail } from './SideRail';
import { BottomBar } from './BottomBar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { isWide } = useResponsive();

  if (isWide) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme.color.ground }}>
        <SideRail />
        <View style={{ flex: 1 }}>{children}</View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.color.ground }}>
      <View style={{ flex: 1 }}>{children}</View>
      <BottomBar />
    </View>
  );
}
