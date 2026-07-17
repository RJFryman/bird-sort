import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Ellipse, Circle, Path, G } from 'react-native-svg';
import { ROSTER } from './roster';

const ASvg = Animated.createAnimatedComponent(Svg);

// darken/lighten a #rrggbb by factor f (f<1 darker, f>1 lighter)
function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const c = (x: number) => Math.max(0, Math.min(255, Math.round(x * f)));
  return `rgb(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

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
  const { color, size = 1, crest, neck = 0, tail, beak, belly } = def;
  const wing = shade(color, 0.78);
  const chest = belly ?? shade(color, 1.18);

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
  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: ['-7deg', '7deg'] });

  // geometry (viewBox 0 0 56 56)
  const bx = 25, by = 37;                 // body center
  const rx = 14 * size, ry = 12 * size;   // body radii
  const hr = 8.2 * size;                  // head radius
  const hx = 36, hy = 21 - neck;          // head center (raised by neck)

  const tailPath = tail === 'long'
    ? `M${bx - rx + 4} ${by - 2} q-15 -3 -23 5 q-1 3 2 4 q9 1 21 -5 z`
    : `M${bx - rx + 4} ${by - 2} q-9 0 -13 6 q-1 3 2 3 q7 0 13 -6 z`;

  const beakPath = beak === 'long'
    ? `M${hx + hr - 2} ${hy - 1} l14 3 -13 4 z`
    : `M${hx + hr - 2} ${hy - 1} l8 2 -7 3.5 z`;

  // smooth curved neck for tall-necked birds (flamingo)
  const neckPath = neck > 0
    ? `M${bx + 2} ${by - ry + 2} C${bx + 2} ${by - 12}, ${hx - 10} ${hy + 10}, ${hx - 4} ${hy + hr - 1} L${hx + 3} ${hy + hr - 1} C${hx - 3} ${hy + 8}, ${bx + 9} ${by - 12}, ${bx + 9} ${by - ry + 4} Z`
    : null;

  // swept-back crest feathers (cardinal)
  const crestPath = crest
    ? `M${hx - 5} ${hy - hr + 3} q-6 -8 -1 -12 q1 5 5 6 q-2 -7 3 -10 q0 6 4 8 q0 -5 4 -6 q1 6 -2 11 z`
    : null;

  return (
    <ASvg width={46} height={46} viewBox="0 0 56 56" style={{ transform: [{ translateY }, { rotate }] }}>
      <G>
        {crestPath && <Path d={crestPath} fill={wing} />}
        {neckPath && <Path d={neckPath} fill={color} />}
        <Path d={tailPath} fill={wing} />
        {/* body */}
        <Ellipse cx={bx} cy={by} rx={rx} ry={ry} fill={color} />
        {/* chest / belly patch */}
        <Path
          d={`M${bx + rx * 0.2} ${by - ry * 0.5} a${rx * 0.75} ${ry * 0.85} 0 0 0 0 ${ry * 1.6} q${rx * 0.7} 0 ${rx * 0.75} -${ry * 0.8} q0 -${ry * 0.8} -${rx * 0.75} -${ry * 0.8} z`}
          fill={chest}
        />
        {/* folded wing */}
        <Path d={`M${bx - 8} ${by - 6} q13 -2 18 8 q-9 5 -18 1 q-3 -5 0 -9 z`} fill={wing} />
        {/* head */}
        <Circle cx={hx} cy={hy} r={hr} fill={color} />
        <Path d={beakPath} fill="#f6a623" />
        {/* eye */}
        <Circle cx={hx + 2.5} cy={hy - 1.5} r={2.6 * size} fill="#fff" />
        <Circle cx={hx + 3.2} cy={hy - 1} r={1.4 * size} fill="#222" />
        <Circle cx={hx + 3.8} cy={hy - 1.8} r={0.5 * size} fill="#fff" />
      </G>
    </ASvg>
  );
}
