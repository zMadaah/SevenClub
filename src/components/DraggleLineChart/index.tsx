import React, { useRef, useState } from 'react';
import { View, Text, PanResponder, LayoutChangeEvent } from 'react-native';
import Svg, { Line, Polyline, Circle } from 'react-native-svg';

import { colors } from '../../theme/colors';
import { styles } from './styles';

interface ChartPoint {
  label: string;
  value: number;
}

interface DraggableLineChartProps {
  data: ChartPoint[];
  height?: number;
  maxY?: number;
  xAxisLabels?: string[];
}

const PADDING_TOP = 20;
const PADDING_BOTTOM = 24;
const GRID_STEPS = 5;
const TOOLTIP_WIDTH = 84;

export default function DraggableLineChart({
  data,
  height = 220,
  maxY,
  xAxisLabels,
}: DraggableLineChartProps) {
  const [width, setWidth] = useState(0);

  const [selectedIndex, setSelectedIndex] = useState(() => {
    const reversedIndex = [...data].reverse().findIndex((d) => d.value > 0);
    return reversedIndex >= 0 ? data.length - 1 - reversedIndex : data.length - 1;
  });

  const computedMax = maxY ?? Math.max(1, ...data.map((d) => d.value));
  const chartHeight = height - PADDING_TOP - PADDING_BOTTOM;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  function valueToY(value: number) {
    const ratio = value / computedMax;
    return PADDING_TOP + chartHeight - ratio * chartHeight;
  }

  function xToIndex(x: number) {
    if (stepX === 0) return 0;
    return Math.min(Math.max(Math.round(x / stepX), 0), data.length - 1);
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => setSelectedIndex(xToIndex(evt.nativeEvent.locationX)),
      onPanResponderMove: (evt) => setSelectedIndex(xToIndex(evt.nativeEvent.locationX)),
    })
  ).current;

  function handleLayout(e: LayoutChangeEvent) {
    setWidth(e.nativeEvent.layout.width);
  }

  const points = data.map((d, i) => `${i * stepX},${valueToY(d.value)}`).join(' ');
  const selectedPoint = data[selectedIndex];
  const selectedX = selectedIndex * stepX;
  const selectedY = selectedPoint ? valueToY(selectedPoint.value) : 0;

  const gridLines = Array.from({ length: GRID_STEPS + 1 }, (_, i) => {
    const ratio = i / GRID_STEPS;
    return {
      y: PADDING_TOP + chartHeight - ratio * chartHeight,
      label: (computedMax * ratio).toFixed(computedMax <= 1 ? 1 : 0),
    };
  });

  const tooltipLeft = Math.min(
    Math.max(selectedX - TOOLTIP_WIDTH / 2, 0),
    Math.max(width - TOOLTIP_WIDTH, 0)
  );

  return (
    <View style={styles.row}>
      <View style={[styles.yAxis, { height }]}>
        {gridLines.map((line) => (
          <Text key={line.y} style={[styles.yAxisLabel, { top: line.y - 7 }]}>
            {line.label}
          </Text>
        ))}
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ height }} onLayout={handleLayout} {...panResponder.panHandlers}>
          {width > 0 && (
            <Svg width={width} height={height}>
              {gridLines.map((line) => (
                <Line
                  key={line.y}
                  x1={0}
                  y1={line.y}
                  x2={width}
                  y2={line.y}
                  stroke={colors.border}
                  strokeWidth={1}
                  strokeDasharray="4,4"
                />
              ))}

              <Polyline points={points} fill="none" stroke={colors.accent} strokeWidth={2} />

              {selectedPoint && (
                <>
                  <Line
                    x1={selectedX}
                    y1={PADDING_TOP}
                    x2={selectedX}
                    y2={height - PADDING_BOTTOM}
                    stroke={colors.accent}
                    strokeWidth={2}
                  />
                  <Circle cx={selectedX} cy={selectedY} r={5} fill={colors.accent} />
                </>
              )}
            </Svg>
          )}

          {selectedPoint && width > 0 && (
            <View style={[styles.tooltip, { left: tooltipLeft, top: height / 2 - 16 }]}>
              <Text style={styles.tooltipText}>{selectedPoint.label}</Text>
            </View>
          )}
        </View>

        {xAxisLabels && (
          <View style={styles.xAxisRow}>
            {xAxisLabels.map((label) => (
              <Text key={label} style={styles.xAxisLabel}>
                {label}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}