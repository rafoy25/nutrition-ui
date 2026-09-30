/**
 * Form field primitives — labelled TextInput, a numeric stepper, and the field
 * wrapper (label + control + optional hint / error). Focus shows a visible
 * brand ring; errors explain what to fix, without apology.
 */
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Platform,
  type StyleProp,
  type ViewStyle,
  type KeyboardTypeOptions,
} from 'react-native';
import { useTheme } from '@/theme';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

export function Field({
  label,
  hint,
  error,
  required,
  children,
  style,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme, space } = useTheme();
  return (
    <View style={[{ gap: space.sm }, style]}>
      <View style={{ flexDirection: 'row', gap: space.xs, alignItems: 'center' }}>
        <Text variant="label" color="secondary">
          {label}
        </Text>
        {required && (
          <Text variant="label" style={{ color: theme.color.status.critical.base }}>
            *
          </Text>
        )}
      </View>
      {children}
      {error ? (
        <View style={{ flexDirection: 'row', gap: space.xs, alignItems: 'center' }}>
          <Icon name="info" size={13} color={theme.color.status.critical.base} />
          <Text variant="caption" style={{ color: theme.color.status.critical.ink }}>
            {error}
          </Text>
        </View>
      ) : hint ? (
        <Text variant="caption" color="muted">
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

interface InputProps {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  icon?: IconName;
  rightSlot?: React.ReactNode;
  invalid?: boolean;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  id?: string;
  multiline?: boolean;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  icon,
  rightSlot,
  invalid,
  autoFocus,
  onFocus,
  onBlur,
  id,
  multiline,
}: InputProps) {
  const { theme, space, radius, font, fontSize } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = invalid
    ? theme.color.status.critical.base
    : focused
      ? theme.color.focus
      : theme.color.border;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: multiline ? 'flex-start' : 'center',
        gap: space.sm,
        minHeight: 48,
        paddingHorizontal: space.md,
        paddingVertical: multiline ? space.md : 0,
        backgroundColor: theme.color.surface,
        borderRadius: radius.md,
        borderWidth: focused || invalid ? 2 : 1,
        borderColor,
      }}
    >
      {icon && <Icon name={icon} size={18} color={theme.color.textMuted} />}
      <TextInput
        nativeID={id}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.color.textMuted}
        keyboardType={keyboardType}
        autoFocus={autoFocus}
        multiline={multiline}
        onFocus={() => {
          setFocused(true);
          onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        style={[
          {
            flex: 1,
            color: theme.color.text,
            fontFamily: font.body,
            fontSize: fontSize.body,
            paddingVertical: multiline ? 0 : space.md,
            minHeight: multiline ? 72 : undefined,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null,
        ]}
      />
      {rightSlot}
    </View>
  );
}

/** Numeric stepper — quantity control for servings. */
export function Stepper({
  value,
  onChange,
  step = 0.5,
  min = 0.5,
  max = 20,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  const { theme, space, radius, font, fontSize } = useTheme();
  const dec = () => onChange(Math.max(min, Math.round((value - step) * 10) / 10));
  const inc = () => onChange(Math.min(max, Math.round((value + step) * 10) / 10));

  const btn = (name: IconName, onPress: () => void, label: string, disabled: boolean) => (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        width: 40,
        height: 40,
        borderRadius: radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.color.surface,
        opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
        ...(Platform.OS === 'web' ? ({ cursor: disabled ? 'default' : 'pointer' } as any) : null),
      })}
    >
      <Icon name={name} size={18} color={theme.color.text} />
    </Pressable>
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.color.surfaceSunken,
        borderRadius: radius.md,
        padding: 3,
      }}
    >
      {btn('minus', dec, 'Decrease quantity', value <= min)}
      <Text
        style={{
          minWidth: 48,
          textAlign: 'center',
          fontFamily: font.monoSemibold,
          fontSize: fontSize.body,
          color: theme.color.text,
        }}
      >
        {value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}
      </Text>
      {btn('plus', inc, 'Increase quantity', value >= max)}
    </View>
  );
}
