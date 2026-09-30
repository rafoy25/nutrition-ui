import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme';

export function Divider({ inset = 0, vertical = false }: { inset?: number; vertical?: boolean }) {
  const { theme } = useTheme();
  return (
    <View
      style={
        vertical
          ? { width: 1, alignSelf: 'stretch', backgroundColor: theme.color.divider, marginVertical: inset }
          : { height: 1, backgroundColor: theme.color.divider, marginHorizontal: inset }
      }
    />
  );
}
