/**
 * BottomBar — the phone-width primary navigation. Four destinations flank a
 * raised center "Log" action, matching the reference apps' pattern. The active
 * tab colors its icon + label in the brand hue; the bar respects the safe-area
 * inset so it clears the home indicator.
 */
import React from 'react';
import { View, Pressable, Platform } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Text, Icon } from '@/components/ui';
import { NAV_ITEMS } from './nav';

export function BottomBar() {
  const { theme, space } = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const tabs = NAV_ITEMS.filter((i) => i.match !== '/log');
  const logItem = NAV_ITEMS.find((i) => i.match === '/log')!;

  const left = tabs.slice(0, 2);
  const right = tabs.slice(2);

  const Tab = ({ item }: { item: (typeof NAV_ITEMS)[number] }) => {
    const active = pathname === item.match;
    const fg = active ? theme.color.brand : theme.color.textMuted;
    return (
      <Link href={item.href} asChild>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={item.label}
          accessibilityState={{ selected: active }}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, paddingVertical: space.sm }}
        >
          <Icon name={item.icon} size={23} color={fg} strokeWidth={active ? 2.4 : 2} />
          <Text variant="micro" style={{ color: fg }}>
            {item.label}
          </Text>
        </Pressable>
      </Link>
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.color.chrome,
        borderTopWidth: 1,
        borderTopColor: theme.color.border,
        paddingBottom: insets.bottom,
        paddingTop: 2,
        paddingHorizontal: space.sm,
      }}
    >
      {left.map((item) => (
        <Tab key={item.match} item={item} />
      ))}

      <View style={{ width: 64, alignItems: 'center' }}>
        <Link href={logItem.href} asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Log a meal"
            style={({ pressed }) => ({
              width: 52,
              height: 52,
              borderRadius: 999,
              marginTop: -18,
              backgroundColor: pressed ? theme.color.brandStrong : theme.color.brand,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 4,
              borderColor: theme.color.chrome,
            })}
          >
            <Icon name="plus" size={26} color={theme.color.onBrand} strokeWidth={2.6} />
          </Pressable>
        </Link>
      </View>

      {right.map((item) => (
        <Tab key={item.match} item={item} />
      ))}
    </View>
  );
}
