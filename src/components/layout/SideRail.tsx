/**
 * SideRail — the wide-screen primary navigation. A fixed-width column with the
 * brand mark, the five destinations, and a prominent "Log a meal" action. The
 * active item is marked with a brand-tinted pill and a left indicator.
 */
import React, { useState } from 'react';
import { View, Pressable, Platform } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { useTheme } from '@/theme';
import { Text, Icon } from '@/components/ui';
import { NAV_ITEMS } from './nav';
import { BrandMark } from './BrandMark';

function RailItem({ item, active }: { item: (typeof NAV_ITEMS)[number]; active: boolean }) {
  const { theme, space, radius, font } = useTheme();
  const [hover, setHover] = useState(false);
  const fg = active ? theme.color.brand : hover ? theme.color.text : theme.color.textSecondary;

  return (
    <Link href={item.href} asChild>
      <Pressable
        onHoverIn={() => setHover(true)}
        onHoverOut={() => setHover(false)}
        accessibilityRole="link"
        accessibilityLabel={item.label}
        accessibilityState={{ selected: active }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.md,
          paddingVertical: space.md,
          paddingHorizontal: space.md,
          borderRadius: radius.md,
          backgroundColor: active ? theme.color.brandTint : hover ? theme.color.surfaceSunken : 'transparent',
          ...(Platform.OS === 'web' ? ({ cursor: 'pointer', transitionProperty: 'background-color, border-color', transitionDuration: '120ms' } as any) : null),
        }}
      >
        <Icon name={item.icon} size={22} color={fg} strokeWidth={active ? 2.4 : 2} />
        <Text style={{ fontFamily: active ? font.bodySemibold : font.bodyMedium, fontSize: 15, color: fg }}>
          {item.label}
        </Text>
      </Pressable>
    </Link>
  );
}

export function SideRail() {
  const { theme, space } = useTheme();
  const pathname = usePathname();

  return (
    <View
      style={{
        width: 244,
        backgroundColor: theme.color.chrome,
        borderRightWidth: 1,
        borderRightColor: theme.color.border,
        paddingHorizontal: space.md,
        paddingVertical: space.xl,
        gap: space.xl,
        justifyContent: 'flex-start',
      }}
    >
      <View style={{ paddingHorizontal: space.sm }}>
        <BrandMark />
      </View>

      <View style={{ gap: 2 }}>
        {NAV_ITEMS.filter((i) => i.match !== '/log').map((item) => (
          <RailItem key={item.match} item={item} active={pathname === item.match} />
        ))}
      </View>

      <View style={{ marginTop: space.sm }}>
        <Link href="/log" asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Log a meal"
            style={({ pressed }) => ({
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: space.sm,
              height: 48,
              borderRadius: 999,
              backgroundColor: pressed ? theme.color.brandStrong : theme.color.brand,
              ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : null),
            })}
          >
            <Icon name="plus" size={20} color={theme.color.onBrand} strokeWidth={2.4} />
            <Text variant="bodyStrong" style={{ color: theme.color.onBrand }}>
              Log a meal
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
