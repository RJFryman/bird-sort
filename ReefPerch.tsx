import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Ellipse, Circle } from 'react-native-svg';

// Same measured footprint as the bird perch. Branch supplies the four-pixel gap.
// A low scalloped coral shelf gives each swimming channel a quiet boundary.
export function ReefPerch({ width, done }: { width: number; done: boolean }) {
  const fill = done ? '#87c5b4' : '#b5d8db';
  const edge = done ? '#397c72' : '#779fae';
  const shade = done ? '#66a995' : '#91bdc6';
  const lobes = Math.max(3, Math.round((width - 18) / 22));
  const step = (width - 18) / lobes;
  const crest = Array.from({ length: lobes }, (_, i) =>
    `Q${9 + (i + 0.5) * step} ${i % 2 ? 0 : 1} ${9 + (i + 1) * step} 4`,
  ).join(' ');
  return <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width, height: 10, overflow: 'hidden' }}>
    <Svg width={width} height={10} viewBox={`0 0 ${width} 10`} accessible={false}>
      <Path d={`M5 4 H9 ${crest} H${width - 5} L${width - 5} 7 Q${width * 0.7} 10 ${width * 0.5} 8 Q${width * 0.25} 10 5 7Z`} fill={fill} stroke={edge} strokeWidth="1" />
      <Path d={`M11 7 Q${width * 0.27} 8 ${width * 0.5} 7 Q${width * 0.75} 8 ${width - 11} 7`} fill="none" stroke={shade} strokeWidth="2" strokeLinecap="round" />
      {[0.22, 0.49, 0.77].map((at, i) => <Ellipse key={at} cx={width * at} cy={i === 1 ? 3.8 : 4.5} rx={i === 1 ? 6 : 4} ry="1.5" fill="#f0fbf4" opacity="0.65" />)}
      <Circle cx="5" cy="5" r="4" fill={fill} stroke={edge} strokeWidth="1" />
      <Circle cx={width - 5} cy="5" r="4" fill={fill} stroke={edge} strokeWidth="1" />
      <Circle cx="4" cy="4" r="1.1" fill="#f4fff8" />
      <Circle cx={width - 6} cy="4" r="1.1" fill="#f4fff8" />
    </Svg>
  </View>;
}
