/**
 * Meter — a horizontal progress track. The fill carries the series/macro color;
 * the unfilled track is a muted step so state reads across the whole bar. An
 * optional target marker shows where the goal sits when the value can overshoot.
 */
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme';

interface Props {
  /** 0..1 (values >1 are clamped for the bar but caller can show overage). */
  progress: number;
  color: string;
  track?: string;
  height?: number;
  /** Draw a tick at this fraction (e.g. limit line for sodium). */
  marker?: number;
  markerColor?: string;
  rounded?: boolean;
}

export function Meter({ progress, color, track, height = 8, marker, markerColor, rounded = true }: Props) {
  const { theme } = useTheme();
  const clamped = Math.max(0, Math.min(1, progress));
  const r = rounded ? height / 2 : 0;

  return (
    <View
      style={{
        height,
        borderRadius: r,
        backgroundColor: track ?? theme.color.trackMuted,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${clamped * 100}%`,
          backgroundColor: color,
          borderRadius: r,
        }}
      />
      {marker !== undefined && (
        <View
          style={{
            position: 'absolute',
            left: `${Math.max(0, Math.min(1, marker)) * 100}%`,
            top: -1,
            bottom: -1,
            width: 2,
            backgroundColor: markerColor ?? theme.color.text,
          }}
        />
      )}
    </View>
  );
}
