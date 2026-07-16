import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Ellipse, Circle, Path } from 'react-native-svg';
import { ROSTER } from './roster';

const ASvg = Animated.createAnimatedComponent(Svg);

export function Bird({
  species,
  dancing,
  delay = 0,
}: {
  species: number;
  dancing?: boolean;
  delay?: number;
}) {
  const { color, overlay = 'rgba(0,0,0,.18)' } = ROSTER[species];
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!dancing) {
      t.stopAnimation();
      t.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, {
          toValue: 1,
          duration: 300,
          delay,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(t, {
          toValue: 0,
          duration: 300,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [dancing, delay, t]);

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '8deg'] });

  return (
    <ASvg
      width={40}
      height={36}
      viewBox="0 0 44 40"
      style={{ transform: [{ translateY }, { rotate }] }}
    >
      <Ellipse cx={19} cy={24} rx={14} ry={11} fill={color} />
      <Circle cx={29} cy={15} r={9} fill={color} />
      <Path d="M6 24 q-6 2 -9 7 q7 1 11 -3 z" fill={color} />
      <Path d="M9 21 q7 -5 17 -1 q-6 9 -17 5 z" fill={overlay} />
      <Path d="M37 13 l9 2 -9 4 z" fill="#f4a63b" />
      <Circle cx={31} cy={13} r={2.6} fill="#fff" />
      <Circle cx={31.8} cy={13.4} r={1.3} fill="#222" />
    </ASvg>
  );
}
