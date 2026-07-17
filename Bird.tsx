import React, { useEffect, useRef, useId } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, G, Path, Ellipse, Circle } from 'react-native-svg';
import { ROSTER } from './roster';

const ASvg = Animated.createAnimatedComponent(Svg);

// darken/lighten a #rrggbb by factor f
function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const c = (x: number) => Math.max(0, Math.min(255, Math.round(x * f)));
  return `rgb(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

// Cutie-Bird: cute (big eyes + blush) AND bird-like (crest/tail/beak/legs).
// viewBox 0 0 72 84. See bird-lab.html styleCuteBird for the coordinate source.
export function Bird({
  species,
  dancing,
  delay = 0,
  scale = 1,
}: {
  species: number;
  dancing?: boolean;
  delay?: number;
  scale?: number;
}) {
  const d = ROSTER[species];
  const s = d.size ?? 1;
  const col = d.color;
  const light = shade(col, 1.2);
  const dark = shade(col, 0.74);
  const wing = shade(col, 0.62);
  const OUT = shade(col, 0.4);
  const belly = d.belly ?? shade(col, 1.3);
  const leg = d.leg ?? '#e0a24a';
  const neck = d.neck ?? 0;

  const gid = 'bg' + useId().replace(/[^a-zA-Z0-9]/g, '');

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

  // geometry
  const bx = 30, by = 48, rx = 16 * s, ry = 15 * s;
  const hx = 40, hy = 28 - neck, hr = 14 * s;
  const legLen = neck ? 16 : 9;
  const legY = by + ry - 3;

  const tailPath = d.tail === 'long'
    ? `M${bx - rx + 4} ${by - 2} q-20 -3 -30 8 q-2 4 3 5 q13 1 28 -7 z`
    : `M${bx - rx + 3} ${by - 1} q-12 -1 -17 7 q-1 4 3 4 q10 0 16 -7 z`;

  const neckPath = neck > 0
    ? `M${bx + 4} ${by - ry + 3} C${bx + 3} ${by - 16}, ${hx - 13} ${hy + 13}, ${hx - 5} ${hy + hr - 1} L${hx + 5} ${hy + hr - 1} C${hx - 4} ${hy + 10}, ${bx + 13} ${by - 16}, ${bx + 12} ${by - ry + 5} Z`
    : null;

  const crestPath =
    d.crest === 'spike'
      ? `M${hx - 4} ${hy - hr + 3} q-6 -11 1 -16 q1 6 5 7 q-2 -9 5 -12 q0 8 4 10 q1 -6 6 -7 q1 9 -3 15 z`
      : d.crest === 'tuft'
        ? `M${hx - 7} ${hy - hr + 3} q-5 -5 -2 -11 q4 4 6 3 M${hx + 6} ${hy - hr + 3} q5 -5 2 -11 q-4 4 -6 3`
        : null;

  const bkx = hx + hr - 3, bky = hy + 1;
  const beakPath =
    d.beak === 'dagger' ? `M${bkx} ${bky - 2} l16 3 -15 5 z`
    : d.beak === 'hook' ? `M${bkx} ${bky - 3} q12 0 13 6 q-2 5 -9 3 q-3 -1 -4 -3 z`
    : d.beak === 'seed' ? `M${bkx} ${bky - 2} l9 3.5 -8 4 z`
    : `M${bkx} ${bky - 2} l11 3 -10 4.5 z`;

  const legsPath =
    `M${bx - 3} ${legY} v${legLen} M${bx + 5} ${legY} v${legLen} ` +
    `M${bx - 7} ${legY + legLen} h7 M${bx + 1} ${legY + legLen} h7`;

  const bellyPath =
    `M${bx + 3} ${by - ry * 0.6} a${rx * 0.72} ${ry * 0.92} 0 0 0 0 ${ry * 1.75} q${rx * 0.72} 0 ${rx * 0.72} -${ry * 0.88} q0 -${ry * 0.88} -${rx * 0.72} -${ry * 0.88} z`;
  const wingPath = `M${bx - 10} ${by - 6} q17 -4 23 8 q-11 6 -23 2 q-3 -6 0 -10 z`;

  return (
    <ASvg
      width={48 * scale}
      height={56 * scale}
      viewBox="0 0 72 84"
      style={{ transform: [{ translateY }, { rotate }] }}
    >
      <Defs>
        <LinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={light} />
          <Stop offset="1" stopColor={dark} />
        </LinearGradient>
      </Defs>
      <G>
        {/* legs + feet */}
        <Path d={legsPath} stroke={leg} strokeWidth={2.6 * s} strokeLinecap="round" fill="none" />
        {crestPath && (
          <Path
            d={crestPath}
            fill={d.crest === 'tuft' ? col : col}
            stroke={OUT}
            strokeWidth={d.crest === 'tuft' ? 3 : 2}
            strokeLinejoin="round"
          />
        )}
        {neckPath && <Path d={neckPath} fill={col} stroke={OUT} strokeWidth={2} />}
        <Path d={tailPath} fill={wing} stroke={OUT} strokeWidth={2} strokeLinejoin="round" />
        <Ellipse cx={bx} cy={by} rx={rx} ry={ry} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
        <Path d={bellyPath} fill={belly} />
        <Path d={wingPath} fill={wing} stroke={OUT} strokeWidth={1.6} strokeLinejoin="round" />
        <Circle cx={hx} cy={hy} r={hr} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
        {d.cheek && <Ellipse cx={hx + 2} cy={hy + 3} rx={6 * s} ry={7 * s} fill={d.cheek} />}
        {/* blush */}
        <Ellipse cx={hx + 1 - 9} cy={hy + 3 + 4.5 * s * 0.7} rx={4.5 * s} ry={4.5 * s * 0.7} fill="#ff6b8a" opacity={0.35} />
        <Ellipse cx={hx + 1 + 11} cy={hy + 3 + 4.5 * s * 0.7} rx={4.5 * s} ry={4.5 * s * 0.7} fill="#ff6b8a" opacity={0.35} />
        <Path d={beakPath} fill="#f4a72a" stroke={OUT} strokeWidth={1.6} strokeLinejoin="round" />
        {/* eyes */}
        <Circle cx={hx - 3} cy={hy - 1} r={4.6 * s} fill="#fff" stroke={OUT} strokeWidth={1.3} />
        <Circle cx={hx - 2} cy={hy} r={2.8 * s} fill="#181818" />
        <Circle cx={hx - 1} cy={hy - 2} r={1.1 * s} fill="#fff" />
        <Circle cx={hx + 6} cy={hy - 1} r={5.2 * s} fill="#fff" stroke={OUT} strokeWidth={1.3} />
        <Circle cx={hx + 7.4} cy={hy} r={3.1 * s} fill="#181818" />
        <Circle cx={hx + 8.6} cy={hy - 2} r={1.2 * s} fill="#fff" />
      </G>
    </ASvg>
  );
}
