/**
 * BrandMark — the "Lovage" wordmark with a leaf glyph in a brand-filled tile.
 * The name is set in the display serif; the leaf is drawn, not an emoji.
 */
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme';
import { Text, Icon } from '@/components/ui';

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const { theme, space, radius, font } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
      <View
        style={{
          width: 34,
          height: 34,
          borderRadius: radius.md,
          backgroundColor: theme.color.brand,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="leaf" size={20} color={theme.color.onBrand} strokeWidth={2} />
      </View>
      {!compact && (
        <Text style={{ fontFamily: font.display, fontSize: 22, color: theme.color.text }}>Lovage</Text>
      )}
    </View>
  );
}
