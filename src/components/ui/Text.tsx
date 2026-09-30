/**
 * Typed text component. `variant` selects a role from the type scale and binds
 * the right family + size + line-height; `color` selects a text token. This is
 * the only place raw font sizes are read, so hierarchy stays consistent.
 */
import React from 'react';
import { Text as RNText, type TextProps, type StyleProp, type TextStyle } from 'react-native';
import { useTheme } from '@/theme';

export type TextVariant =
  | 'hero'
  | 'display'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'subtitle'
  | 'body'
  | 'bodyStrong'
  | 'callout'
  | 'label'
  | 'footnote'
  | 'caption'
  | 'micro'
  | 'overline'
  | 'mono'
  | 'monoStrong';

export type TextColor = 'text' | 'secondary' | 'muted' | 'brand' | 'onBrand' | 'inherit';

interface Props extends TextProps {
  variant?: TextVariant;
  color?: TextColor;
  align?: TextStyle['textAlign'];
  style?: StyleProp<TextStyle>;
}

export function Text({ variant = 'body', color = 'text', align, style, children, ...rest }: Props) {
  const { theme, fontSize, lineHeight, font } = useTheme();

  const colorValue =
    color === 'text'
      ? theme.color.text
      : color === 'secondary'
        ? theme.color.textSecondary
        : color === 'muted'
          ? theme.color.textMuted
          : color === 'brand'
            ? theme.color.brand
            : color === 'onBrand'
              ? theme.color.textOnBrand
              : undefined;

  const v: Record<TextVariant, TextStyle> = {
    hero: { fontFamily: font.display, fontSize: fontSize.hero, lineHeight: lineHeight.hero },
    display: { fontFamily: font.display, fontSize: fontSize.display, lineHeight: lineHeight.display },
    title1: { fontFamily: font.display, fontSize: fontSize.title1, lineHeight: lineHeight.title1 },
    title2: { fontFamily: font.display, fontSize: fontSize.title2, lineHeight: lineHeight.title2 },
    title3: { fontFamily: font.bodySemibold, fontSize: fontSize.title3, lineHeight: lineHeight.title3 },
    subtitle: { fontFamily: font.bodySemibold, fontSize: fontSize.subtitle, lineHeight: lineHeight.subtitle },
    body: { fontFamily: font.body, fontSize: fontSize.body, lineHeight: lineHeight.body },
    bodyStrong: { fontFamily: font.bodySemibold, fontSize: fontSize.body, lineHeight: lineHeight.body },
    callout: { fontFamily: font.bodyMedium, fontSize: fontSize.callout, lineHeight: lineHeight.callout },
    label: { fontFamily: font.bodySemibold, fontSize: fontSize.footnote, lineHeight: lineHeight.footnote },
    footnote: { fontFamily: font.body, fontSize: fontSize.footnote, lineHeight: lineHeight.footnote },
    caption: { fontFamily: font.body, fontSize: fontSize.caption, lineHeight: lineHeight.caption },
    micro: { fontFamily: font.bodyMedium, fontSize: fontSize.micro, lineHeight: lineHeight.micro },
    overline: {
      fontFamily: font.bodySemibold,
      fontSize: fontSize.micro,
      lineHeight: lineHeight.micro,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    mono: { fontFamily: font.mono, fontSize: fontSize.footnote, lineHeight: lineHeight.footnote },
    monoStrong: { fontFamily: font.monoSemibold, fontSize: fontSize.footnote, lineHeight: lineHeight.footnote },
  };

  return (
    <RNText {...rest} style={[v[variant], colorValue ? { color: colorValue } : null, align ? { textAlign: align } : null, style]}>
      {children}
    </RNText>
  );
}
