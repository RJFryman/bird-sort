import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse, Circle } from 'react-native-svg';

// Quiet scenery stays outside the puzzle's hit targets and reading area.
export function Habitat({ fish }: { fish: boolean }) {
  const leaf = fish ? '#91beb0' : '#a9b98a';
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>
    <Svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      <Circle cx="850" cy="100" r="90" fill={fish ? '#cbe6d9' : '#f0e4b5'} opacity={0.6} />
      <Path d="M0 890 Q240 810 500 925 T1000 870 L1000 1000 L0 1000Z" fill={fish ? '#c1dfd0' : '#dce2c5'} />
      <Path d="M-30 200 Q50 250 95 490 M1030 350 Q950 490 970 700" stroke={fish ? '#89afa2' : '#bdc4a0'} strokeWidth="7" fill="none" />
      {[0, 1, 2, 3, 4].map(i => <React.Fragment key={i}>
        <Ellipse cx={18 + i * 14} cy={250 + i * 45} rx="34" ry="12" rotation="-30" origin={`${18 + i * 14}, ${250 + i * 45}`} fill={leaf} opacity={0.65} />
        <Ellipse cx={985 - i * 4} cy={440 + i * 45} rx="30" ry="11" rotation="30" origin={`${985 - i * 4}, ${440 + i * 45}`} fill={leaf} opacity={0.65} />
      </React.Fragment>)}
    </Svg>
  </View>;
}
