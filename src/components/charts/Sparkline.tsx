/**
 * Sparkline — a 12-point trend line in a de-emphasis hue with the endpoint
 * marked in the accent. Used inside stat tiles. No axes; it's a shape, not a
 * chart you read values off.
 */
import React from 'react';
import Svg, { Polyline, Circle } from 'react-native-svg';
import { useTheme } from '@/theme';

interface Props {
  points: number[];
  width?: number;
  height?: number;
  color?: string;
}

export function Sparkline({ points, width = 72, height = 28, color }: Props) {
  const { theme } = useTheme();
  if (points.length < 2) return <Svg width={width} height={height} />;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const pad = 3;
  const stepX = (width - pad * 2) / (points.length - 1);
  const y = (v: number) => pad + (1 - (v - min) / span) * (height - pad * 2);
  const coords = points.map((v, i) => `${(pad + i * stepX).toFixed(1)},${y(v).toFixed(1)}`);
  const last = points[points.length - 1];
  const accent = color ?? theme.color.brand;

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={coords.join(' ')}
        fill="none"
        stroke={theme.color.borderStrong}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={pad + (points.length - 1) * stepX} cy={y(last)} r={3.2} fill={accent} stroke={theme.color.surface} strokeWidth={1.6} />
    </Svg>
  );
}
