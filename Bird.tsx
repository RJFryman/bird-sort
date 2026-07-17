import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Ellipse, Circle, Path, G } from 'react-native-svg';
import { ROSTER } from './roster';

const ASvg = Animated.createAnimatedComponent(Svg);

// Parametric bird drawn from roster traits. viewBox 0 0 52 56.
// Body sits low; head raised by `neck`; crest/tail/beak/belly optional.
export function Bird({
  species,
  dancing,
  delay = 0,
}: {
  species: number;
  dancing?: boolean;
  delay?: number;
}) {
  const def = ROSTER[species];
  const { color, overlay = 'rgba(0,0,0,.18)', size = 1, crest, neck = 0, tail, beak, belly } = def;

  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!dancing) {
      t.stopAnimation();
      t.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: 300, delay, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: 300, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [dancing, delay, t]);

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '8deg'] });

  // geometry
  const bx = 22, by = 36;                 // body center
  const rx = 14 * size, ry = 11 * size;   // body radii
  const hr = 8.5 * size;                  // head radius
  const hx = 33, hy = 20 - neck;          // head center (raised by neck)

  const tailPath = tail === 'long'
    ? `M${bx - rx + 3} ${by} q-16 -1 -24 8 q11 3 24 -3 z`
    : `M${bx - rx + 3} ${by} q-7 2 -11 8 q9 2 13 -3 z`;

  const beakPath = beak === 'long'
    ? `M${hx + hr - 1} ${hy - 2} l13 2 -12 4 z`
    : `M${hx + hr - 1} ${hy - 2} l7 2 -7 3 z`;

  // neck: trapezoid linking body to a raised head
  const neckPath = neck > 0
    ? `M${hx - 5} ${hy} L${hx + 4} ${hy} L${bx + 4} ${by - 4} L${bx - 4} ${by - 4} Z`
    : null;

  // crest: three little spikes on top of the head
  const crestPath = crest
    ? `M${hx - 6} ${hy - hr + 2} l2 -8 3 6 2 -7 3 7 2 -6 2 8 z`
    : null;

  return (
    <ASvg width={44} height={46} viewBox="0 0 52 56" style={{ transform: [{ translateY }, { rotate }] }}>
      <G>
        {crestPath && <Path d={crestPath} fill={color} />}
        {neckPath && <Path d={neckPath} fill={color} />}
        <Path d={tailPath} fill={color} />
        <Ellipse cx={bx} cy={by} rx={rx} ry={ry} fill={color} />
        {belly && <Ellipse cx={bx + 4} cy={by + 2} rx={rx * 0.55} ry={ry * 0.7} fill={belly} />}
        <Circle cx={hx} cy={hy} r={hr} fill={color} />
        {/* wing shade */}
        <Path d={`M${bx - 8} ${by - 3} q7 -5 17 -1 q-6 9 -17 5 z`} fill={overlay} />
        <Path d={beakPath} fill="#f4a63b" />
        <Circle cx={hx + 2} cy={hy - 1} r={2.4 * size} fill="#fff" />
        <Circle cx={hx + 2.7} cy={hy - 0.6} r={1.2 * size} fill="#222" />
      </G>
    </ASvg>
  );
}
