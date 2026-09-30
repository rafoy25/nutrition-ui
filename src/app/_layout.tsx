/**
 * Root layout. Loads the three type families (mapped to the names the theme's
 * `fontFamily` tokens expect), mounts the theme + store providers, sets the
 * web document background per theme, and renders the AppShell around the router
 * Slot. Backend is out of scope — state is the in-memory sample store.
 */
import React, { useEffect } from 'react';
import { View, Platform } from 'react-native';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { YoungSerif_400Regular } from '@expo-google-fonts/young-serif';
import {
  AtkinsonHyperlegibleNext_400Regular,
  AtkinsonHyperlegibleNext_500Medium,
  AtkinsonHyperlegibleNext_600SemiBold,
  AtkinsonHyperlegibleNext_700Bold,
} from '@expo-google-fonts/atkinson-hyperlegible-next';
import {
  AtkinsonHyperlegibleMono_400Regular,
  AtkinsonHyperlegibleMono_600SemiBold,
} from '@expo-google-fonts/atkinson-hyperlegible-mono';

import { ThemeProvider, useTheme } from '@/theme';
import { StoreProvider } from '@/data/store';
import { AppShell } from '@/components/layout';

SplashScreen.preventAutoHideAsync().catch(() => {});

function ThemedRoot() {
  const { theme } = useTheme();

  // Keep the web document background in sync so overscroll matches the theme.
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.body.style.backgroundColor = theme.color.ground;
      document.documentElement.style.backgroundColor = theme.color.ground;
    }
  }, [theme]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.color.ground }}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <AppShell>
        <Slot />
      </AppShell>
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    YoungSerif: YoungSerif_400Regular,
    AtkinsonNext: AtkinsonHyperlegibleNext_400Regular,
    AtkinsonNextMedium: AtkinsonHyperlegibleNext_500Medium,
    AtkinsonNextSemibold: AtkinsonHyperlegibleNext_600SemiBold,
    AtkinsonNextBold: AtkinsonHyperlegibleNext_700Bold,
    AtkinsonMono: AtkinsonHyperlegibleMono_400Regular,
    AtkinsonMonoSemibold: AtkinsonHyperlegibleMono_600SemiBold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StoreProvider>
          <ThemedRoot />
        </StoreProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
