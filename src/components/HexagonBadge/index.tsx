import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Defs, LinearGradient, Stop } from 'react-native-svg';

interface HexagonBadgeProps {
  size: number;
  color: string;
  locked?: boolean;
  children?: React.ReactNode;
}

// Ponta pra cima, como um hexágono de mapa H3 — combina com o mecanismo
// central do app (território é literalmente feito de hexágonos).
function hexPoints(size: number, inset: number): string {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - inset;
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return points.join(' ');
}

// Escurece uma cor hex — usado pro degradê da face do medalhão, sem
// precisar de uma segunda cor definida à mão pra cada insígnia.
function shade(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export default function HexagonBadge({ size, color, locked, children }: HexagonBadgeProps) {
  const frameColor = locked ? '#4A4A4A' : '#D9D9D9';
  const gradId = `hexGrad-${color.replace('#', '')}-${locked ? 'l' : 'u'}-${size}`;
  const faceColor = locked ? '#2A2A2A' : color;
  const faceColorDark = locked ? '#1A1A1A' : shade(color, 40);

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={faceColor} stopOpacity={1} />
            <Stop offset="100%" stopColor={faceColorDark} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        {/* moldura — imita o contorno metálico da imagem de referência */}
        <Polygon points={hexPoints(size, 0)} fill={frameColor} />
        {/* face colorida, ligeiramente menor que a moldura */}
        <Polygon points={hexPoints(size, size * 0.07)} fill={`url(#${gradId})`} />
      </Svg>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
