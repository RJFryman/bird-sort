import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Ellipse, Circle, Defs, LinearGradient, RadialGradient, Stop, Rect } from 'react-native-svg';

// The illustration hugs the screen edges; the middle is open water for the
// puzzle. Screen coordinates keep the little bubbles round on narrow phones.
function ReefHabitat() {
  const { width: w, height: h } = useWindowDimensions();
  const floor = h - 26;
  const kelpTop = Math.max(164, h * 0.32);
  return <View pointerEvents="none" accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
    <Svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} accessible={false}>
      <Defs>
        <LinearGradient id="reef-water" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#def1ed" />
          <Stop offset="0.6" stopColor="#e8f5ef" />
          <Stop offset="1" stopColor="#d5ece7" />
        </LinearGradient>
        <RadialGradient id="reef-clearing" cx="0.5" cy="0.44" rx="0.62" ry="0.65">
          <Stop offset="0" stopColor="#fffdf0" stopOpacity="0.44" />
          <Stop offset="1" stopColor="#fffdf0" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Rect width={w} height={h} fill="url(#reef-water)" />
      {/* Broad, barely visible light through the surface. Nothing moves. */}
      <Path d={`M${w * 0.12} 0 L${w * 0.25} 0 L${w * 0.54} ${h * 0.33} L${w * 0.37} ${h * 0.33}Z`} fill="#fffdf1" opacity="0.23" />
      <Path d={`M${w * 0.6} 0 L${w * 0.67} 0 L${w * 0.92} ${h * 0.27} L${w * 0.81} ${h * 0.27}Z`} fill="#fffdf1" opacity="0.18" />
      <Rect width={w} height={h} fill="url(#reef-clearing)" />
      <Path d={`M0 ${h - 64} Q${w * 0.18} ${h - 94} ${w * 0.4} ${h - 45} T${w} ${h - 62} V${h} H0Z`} fill="#b7dcd3" opacity="0.48" />
      <Path d={`M0 ${h - 22} Q${w * 0.3} ${h - 58} ${w * 0.65} ${h - 20} T${w} ${h - 35} V${h} H0Z`} fill="#c6dfcf" opacity="0.55" />

      {/* Sea grass stays in the margins, below the heading and behind controls. */}
      <Path d={`M7 ${floor} C24 ${h * 0.72} -8 ${h * 0.58} 9 ${kelpTop} C19 ${h * 0.53} 30 ${h * 0.72} 7 ${floor}Z`} fill="#86b9aa" opacity="0.48" />
      <Path d={`M0 ${floor} C13 ${h * 0.76} -8 ${h * 0.7} -4 ${h * 0.52} C9 ${h * 0.67} 22 ${h * 0.8} 0 ${floor}Z`} fill="#699f95" opacity="0.32" />
      <Path d={`M${w - 6} ${floor} C${w - 25} ${h * 0.77} ${w + 11} ${h * 0.62} ${w - 11} ${h * 0.43} C${w - 28} ${h * 0.65} ${w - 5} ${h * 0.75} ${w - 6} ${floor}Z`} fill="#88bcb0" opacity="0.48" />
      <Path d={`M${w} ${floor} C${w - 14} ${h * 0.84} ${w + 9} ${h * 0.76} ${w + 4} ${h * 0.62} C${w - 10} ${h * 0.77} ${w - 19} ${h * 0.84} ${w} ${floor}Z`} fill="#679f99" opacity="0.35" />

      {/* Tiny coral fans and a few stones anchor the seabed at the corners. */}
      <Path d={`M16 ${h} V${h - 40} M16 ${h - 19} Q1 ${h - 27} 3 ${h - 43} M16 ${h - 28} Q30 ${h - 38} 28 ${h - 52} M16 ${h - 10} Q34 ${h - 15} 36 ${h - 29}`} fill="none" stroke="#d5ab96" strokeWidth="6" strokeLinecap="round" opacity="0.68" />
      <Path d={`M${w - 18} ${h} V${h - 34} M${w - 18} ${h - 17} Q${w - 35} ${h - 26} ${w - 32} ${h - 39} M${w - 18} ${h - 10} Q${w - 4} ${h - 22} ${w - 4} ${h - 45}`} fill="none" stroke="#8cb9bb" strokeWidth="7" strokeLinecap="round" opacity="0.75" />
      <Ellipse cx="40" cy={h - 5} rx="12" ry="6" fill="#a8c8bd" />
      <Ellipse cx={w - 47} cy={h - 3} rx="15" ry="7" fill="#b0d0c8" />
      {[
        { x: 20, y: h * 0.26, r: 4 },
        { x: 12, y: h * 0.26 - 20, r: 2.5 },
        { x: w - 18, y: h * 0.4, r: 5 },
        { x: w - 10, y: h * 0.4 - 23, r: 2.5 },
        { x: 26, y: h * 0.74, r: 3 },
        { x: w - 24, y: h * 0.82, r: 3.5 },
      ].map(({ x, y, r }, i) => <Circle key={i} cx={x} cy={y} r={r} fill="#f7fff9" fillOpacity="0.35" stroke="#91bdb6" strokeWidth="1.1" opacity="0.62" />)}
    </Svg>
  </View>;
}

// Quiet scenery stays outside the puzzle's hit targets and reading area.
export function Habitat({ fish }: { fish: boolean }) {
  if (fish) return <ReefHabitat />;
  const leaf = '#a9b98a';
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      <Circle cx="850" cy="100" r="90" fill="#f0e4b5" opacity={0.6} />
      <Path d="M0 890 Q240 810 500 925 T1000 870 L1000 1000 L0 1000Z" fill="#dce2c5" />
      <Path d="M-30 200 Q50 250 95 490 M1030 350 Q950 490 970 700" stroke="#bdc4a0" strokeWidth="7" fill="none" />
      {[0, 1, 2, 3, 4].map(i => <React.Fragment key={i}>
        <Ellipse cx={18 + i * 14} cy={250 + i * 45} rx="34" ry="12" rotation="-30" origin={`${18 + i * 14}, ${250 + i * 45}`} fill={leaf} opacity={0.65} />
        <Ellipse cx={985 - i * 4} cy={440 + i * 45} rx="30" ry="11" rotation="30" origin={`${985 - i * 4}, ${440 + i * 45}`} fill={leaf} opacity={0.65} />
      </React.Fragment>)}
    </Svg>
  </View>;
}
