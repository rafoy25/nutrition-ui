/**
 * Button — primary / secondary / ghost variants with hover + press + focus
 * states. Uses Pressable's onHoverIn/Out for web hover (the style callback only
 * exposes `pressed`). Every control states exactly what it does via its label.
 */
import React, { useState } from 'react';
import { Pressable, View, ActivityIndicator, type ViewStyle, type StyleProp, Platform } from 'react-native';
import { useTheme } from '@/theme';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  disabled,
  loading,
  fullWidth,
  style,
  accessibilityLabel,
}: Props) {
  const { theme, space, radius, font, fontSize } = useTheme();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const heights: Record<Size, number> = { sm: 36, md: 44, lg: 52 };
  const padX: Record<Size, number> = { sm: space.md, md: space.lg, lg: space.xl };
  const textSize: Record<Size, number> = { sm: fontSize.footnote, md: fontSize.body, lg: fontSize.callout };
  const iconSize: Record<Size, number> = { sm: 16, md: 18, lg: 20 };

  let bg = 'transparent';
  let fg = theme.color.text;
  let border = 'transparent';

  if (variant === 'primary') {
    bg = hovered ? theme.color.brandStrong : theme.color.brand;
    fg = theme.color.onBrand;
  } else if (variant === 'secondary') {
    bg = hovered ? theme.color.surfaceSunken : theme.color.surface;
    fg = theme.color.text;
    border = theme.color.border;
  } else if (variant === 'ghost') {
    bg = hovered ? theme.color.surfaceSunken : 'transparent';
    fg = theme.color.brand;
  } else if (variant === 'danger') {
    bg = hovered ? theme.color.status.critical.base : theme.color.status.critical.tint;
    fg = hovered ? '#FFFFFF' : theme.color.status.critical.ink;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      style={({ pressed }) => [
        {
          height: heights[size],
          paddingHorizontal: padX[size],
          borderRadius: radius.pill,
          backgroundColor: bg,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: border,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space.sm,
          opacity: disabled ? 0.45 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          ...(Platform.OS === 'web' ? ({ cursor: disabled ? 'not-allowed' : 'pointer', transitionProperty: 'background-color, transform, border-color', transitionDuration: '120ms' } as any) : null),
        },
        focused ? { borderWidth: 2, borderColor: theme.color.focus } : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        <>
          {icon && <Icon name={icon} size={iconSize[size]} color={fg} />}
          <Text style={{ color: fg, fontFamily: font.bodySemibold, fontSize: textSize[size] }}>{label}</Text>
          {iconRight && <Icon name={iconRight} size={iconSize[size]} color={fg} />}
        </>
      )}
    </Pressable>
  );
}

/** Icon-only round button for chrome (header, cards). */
export function IconButton({
  name,
  onPress,
  size = 40,
  tone = 'surface',
  color,
  accessibilityLabel,
}: {
  name: IconName;
  onPress?: () => void;
  size?: number;
  tone?: 'surface' | 'ghost' | 'brand';
  color?: string;
  accessibilityLabel: string;
}) {
  const { theme, radius } = useTheme();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const bgBase =
    tone === 'brand' ? theme.color.brand : tone === 'surface' ? theme.color.surface : 'transparent';
  const bgHover =
    tone === 'brand' ? theme.color.brandStrong : theme.color.surfaceSunken;
  const fg = color ?? (tone === 'brand' ? theme.color.onBrand : theme.color.textSecondary);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: radius.pill,
          backgroundColor: hovered ? bgHover : bgBase,
          borderWidth: tone === 'surface' ? 1 : 0,
          borderColor: theme.color.border,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.85 : 1,
          ...(Platform.OS === 'web' ? ({ cursor: 'pointer', transitionProperty: 'background-color, border-color', transitionDuration: '120ms' } as any) : null),
        },
        focused ? { borderWidth: 2, borderColor: theme.color.focus } : null,
      ]}
    >
      <Icon name={name} size={size * 0.5} color={fg} />
    </Pressable>
  );
}
