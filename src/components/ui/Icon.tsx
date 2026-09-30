/**
 * Icon set — a small family of stroke icons drawn as inline SVG paths so they
 * inherit `color` and stay crisp on web and native. One consistent 24px grid,
 * 2px stroke, round caps. Add new glyphs to PATHS only.
 */
import React from 'react';
import Svg, { Path, Circle, Line, Polyline, Rect } from 'react-native-svg';
import { useTheme } from '@/theme';

export type IconName =
  | 'home'
  | 'chart'
  | 'table'
  | 'chat'
  | 'plus'
  | 'leaf'
  | 'flame'
  | 'target'
  | 'clock'
  | 'search'
  | 'close'
  | 'check'
  | 'chevronRight'
  | 'chevronDown'
  | 'trash'
  | 'filter'
  | 'sun'
  | 'moon'
  | 'send'
  | 'sparkle'
  | 'arrowUp'
  | 'arrowDown'
  | 'minus'
  | 'bell'
  | 'info';

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 22, color, strokeWidth = 2 }: Props) {
  const { theme } = useTheme();
  const stroke = color ?? theme.color.text;
  const common = {
    stroke,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'home' && (
        <>
          <Path d="M3 10.5 12 3l9 7.5" {...common} />
          <Path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" {...common} />
        </>
      )}
      {name === 'chart' && (
        <>
          <Line x1="4" y1="20" x2="20" y2="20" {...common} />
          <Rect x="6" y="11" width="3.4" height="6" rx="1" {...common} />
          <Rect x="11.5" y="7" width="3.4" height="10" rx="1" {...common} />
          <Rect x="17" y="13.5" width="3.4" height="3.5" rx="1" {...common} />
        </>
      )}
      {name === 'table' && (
        <>
          <Rect x="3.5" y="4.5" width="17" height="15" rx="2" {...common} />
          <Line x1="3.5" y1="9.5" x2="20.5" y2="9.5" {...common} />
          <Line x1="9.5" y1="9.5" x2="9.5" y2="19.5" {...common} />
          <Line x1="3.5" y1="14.5" x2="20.5" y2="14.5" {...common} />
        </>
      )}
      {name === 'chat' && (
        <Path d="M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3.5V16.5H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" {...common} />
      )}
      {name === 'plus' && (
        <>
          <Line x1="12" y1="5" x2="12" y2="19" {...common} />
          <Line x1="5" y1="12" x2="19" y2="12" {...common} />
        </>
      )}
      {name === 'minus' && <Line x1="5" y1="12" x2="19" y2="12" {...common} />}
      {name === 'leaf' && (
        <>
          <Path d="M20 4c-8 0-14 3.5-14 11 0 2 .8 3.7 2 5C10 15 14 11.5 19 10c-4 2.4-7 5.5-9 10" {...common} />
        </>
      )}
      {name === 'flame' && (
        <Path d="M12 3c1.5 3 4.5 4.5 4.5 8.5A4.5 4.5 0 0 1 12 16a4.5 4.5 0 0 1-4.5-4.5c0-1.6.8-2.6 1.6-3.6C10 9.5 11 10 11.2 11 12 9 10.5 6 12 3Z" {...common} />
      )}
      {name === 'target' && (
        <>
          <Circle cx="12" cy="12" r="8" {...common} />
          <Circle cx="12" cy="12" r="4" {...common} />
          <Circle cx="12" cy="12" r="1.2" fill={stroke} stroke="none" />
        </>
      )}
      {name === 'clock' && (
        <>
          <Circle cx="12" cy="12" r="8" {...common} />
          <Polyline points="12,7.5 12,12 15,13.5" {...common} />
        </>
      )}
      {name === 'search' && (
        <>
          <Circle cx="11" cy="11" r="6.5" {...common} />
          <Line x1="16" y1="16" x2="20.5" y2="20.5" {...common} />
        </>
      )}
      {name === 'close' && (
        <>
          <Line x1="6" y1="6" x2="18" y2="18" {...common} />
          <Line x1="18" y1="6" x2="6" y2="18" {...common} />
        </>
      )}
      {name === 'check' && <Polyline points="5,12.5 10,17.5 19.5,7" {...common} />}
      {name === 'chevronRight' && <Polyline points="9,5 16,12 9,19" {...common} />}
      {name === 'chevronDown' && <Polyline points="5,9 12,16 19,9" {...common} />}
      {name === 'trash' && (
        <>
          <Polyline points="4,6.5 20,6.5" {...common} />
          <Path d="M9 6.5V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5" {...common} />
          <Path d="M6.5 6.5 7.4 20a1 1 0 0 0 1 .9h7.2a1 1 0 0 0 1-.9l.9-13.5" {...common} />
        </>
      )}
      {name === 'filter' && <Path d="M4 5.5h16l-6 7v6l-4-2v-4l-6-7Z" {...common} />}
      {name === 'sun' && (
        <>
          <Circle cx="12" cy="12" r="4" {...common} />
          <Line x1="12" y1="2.5" x2="12" y2="5" {...common} />
          <Line x1="12" y1="19" x2="12" y2="21.5" {...common} />
          <Line x1="2.5" y1="12" x2="5" y2="12" {...common} />
          <Line x1="19" y1="12" x2="21.5" y2="12" {...common} />
          <Line x1="5.2" y1="5.2" x2="7" y2="7" {...common} />
          <Line x1="17" y1="17" x2="18.8" y2="18.8" {...common} />
          <Line x1="18.8" y1="5.2" x2="17" y2="7" {...common} />
          <Line x1="7" y1="17" x2="5.2" y2="18.8" {...common} />
        </>
      )}
      {name === 'moon' && <Path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" {...common} />}
      {name === 'send' && (
        <>
          <Path d="M4.5 12 20 4.5 15 20l-3.5-6.5L4.5 12Z" {...common} />
          <Line x1="11.5" y1="13.5" x2="20" y2="4.5" {...common} />
        </>
      )}
      {name === 'sparkle' && (
        <Path d="M12 3.5c.6 3.8 1.7 4.9 5.5 5.5-3.8.6-4.9 1.7-5.5 5.5-.6-3.8-1.7-4.9-5.5-5.5C10.3 8.4 11.4 7.3 12 3.5Z" {...common} />
      )}
      {name === 'arrowUp' && (
        <>
          <Line x1="12" y1="19" x2="12" y2="6" {...common} />
          <Polyline points="6.5,11 12,5.5 17.5,11" {...common} />
        </>
      )}
      {name === 'arrowDown' && (
        <>
          <Line x1="12" y1="5" x2="12" y2="18" {...common} />
          <Polyline points="6.5,13 12,18.5 17.5,13" {...common} />
        </>
      )}
      {name === 'bell' && (
        <>
          <Path d="M6 10a6 6 0 0 1 12 0c0 5 1.5 6.5 2 7H4c.5-.5 2-2 2-7Z" {...common} />
          <Path d="M10 20a2 2 0 0 0 4 0" {...common} />
        </>
      )}
      {name === 'info' && (
        <>
          <Circle cx="12" cy="12" r="8.5" {...common} />
          <Line x1="12" y1="11" x2="12" y2="16.5" {...common} />
          <Circle cx="12" cy="7.6" r="1.1" fill={stroke} stroke="none" />
        </>
      )}
    </Svg>
  );
}
