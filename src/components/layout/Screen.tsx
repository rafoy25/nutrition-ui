/**
 * Screen — the scrolling content container each page renders into. Owns the
 * page header (title, subtitle, actions, theme toggle), the side gutter, the
 * centered max-width column on wide screens, and bottom padding that clears the
 * phone tab bar. Content stacks with `gap`, never per-element margins.
 */
import React from 'react';
import { View, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, useResponsive } from '@/theme';
import { Text, Icon } from '@/components/ui';
import { BrandMark } from './BrandMark';

interface Props {
  title: string;
  subtitle?: string;
  /** e.g. a date pill or filter row, shown under the title. */
  toolbar?: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  /** Max content width on wide screens. */
  maxWidth?: number;
  scroll?: boolean;
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Pressable
      onPress={toggle}
      accessibilityRole="button"
      accessibilityLabel="Toggle light or dark theme"
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.color.surface,
        borderWidth: 1,
        borderColor: theme.color.border,
        opacity: pressed ? 0.85 : 1,
        ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
      })}
    >
      <Icon name={theme.scheme === 'dark' ? 'sun' : 'moon'} size={19} color={theme.color.textSecondary} />
    </Pressable>
  );
}

export function Screen({ title, subtitle, toolbar, headerActions, children, maxWidth = 1120, scroll = true }: Props) {
  const { theme, space } = useTheme();
  const { isWide, isPhone } = useResponsive();
  const insets = useSafeAreaInsets();

  const gutter = isPhone ? space.lg : space.xxl;

  const header = (
    <View style={{ gap: space.lg }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: space.md }}>
        <View style={{ flex: 1, gap: 4 }}>
          {isPhone && <View style={{ marginBottom: space.xs }}><BrandMark /></View>}
          <Text variant={isPhone ? 'title1' : 'display'} style={{ letterSpacing: -0.3 }}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="callout" color="secondary">
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', gap: space.sm, alignItems: 'center', paddingTop: isPhone ? space.xxl : space.sm }}>
          {headerActions}
          <ThemeToggle />
        </View>
      </View>
      {toolbar}
    </View>
  );

  const body = (
    <View style={{ width: '100%', maxWidth, alignSelf: 'center', gap: space.xl }}>
      {header}
      {children}
    </View>
  );

  if (!scroll) {
    return (
      <View style={{ flex: 1, paddingHorizontal: gutter, paddingTop: insets.top + space.xl }}>
        {body}
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingHorizontal: gutter,
        paddingTop: (isWide ? space.huge : insets.top + space.xl),
        paddingBottom: space.huge + (isPhone ? 40 : 0),
      }}
      showsVerticalScrollIndicator={false}
    >
      {body}
    </ScrollView>
  );
}
