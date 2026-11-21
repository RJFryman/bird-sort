// Owns bird/fish dimensions, illustration dispatch and celebration animation.
import React, { useEffect, useRef, useId } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, G, Path, Ellipse, Circle } from 'react-native-svg';
import { COLLECTIONS, CollectionId } from './roster';
import { ParrotArt } from './ParrotArt';
import { SongbirdArt } from './SongbirdArt';
import { WildBirdArt } from './WildBirdArt';

const ASvg = Animated.createAnimatedComponent(Svg);

// darken/lighten a #rrggbb by factor f
function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const c = (x: number) => Math.max(0, Math.min(255, Math.round(x * f)));
  return `rgb(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)})`;
}

// Owns creature sizing and celebration animation; bird families own the illustrations.
export function Bird({
  species,
  collection = 'birds',
  dancing,
  delay = 0,
  scale = 1,
}: {
  species: number;
  collection?: CollectionId;
  dancing?: boolean;
  delay?: number;
  scale?: number;
}) {
  const d = COLLECTIONS[collection][species];
  const s = d.size ?? 1;
  const col = d.color;
  const light = shade(col, 1.2);
  const dark = shade(col, 0.74);
  const wing = shade(col, 0.62);
  const OUT = shade(col, 0.4);

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
  const svgStyle = { transform: [{ translateY }, { rotate }] };

  const grad = (
    <Defs>
      <LinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor={light} />
        <Stop offset="1" stopColor={dark} />
      </LinearGradient>
    </Defs>
  );

  // reusable pair of big cute eyes centered at (ex, ey)
  const eyes = (ex: number, ey: number, r = 1) => (
    <>
      <Circle cx={ex - 4.5} cy={ey} r={4.6 * r} fill="#fff" stroke={OUT} strokeWidth={1.3} />
      <Circle cx={ex - 3.5} cy={ey + 1} r={2.8 * r} fill="#181818" />
      <Circle cx={ex - 2.5} cy={ey - 1} r={1.1 * r} fill="#fff" />
      <Circle cx={ex + 4.5} cy={ey} r={5.2 * r} fill="#fff" stroke={OUT} strokeWidth={1.3} />
      <Circle cx={ex + 5.9} cy={ey + 1} r={3.1 * r} fill="#181818" />
      <Circle cx={ex + 7.1} cy={ey - 1} r={1.2 * r} fill="#fff" />
    </>
  );

  if (collection === 'birds') {
    const artwork = ParrotArt({ bird: d }) ?? SongbirdArt({ bird: d }) ?? WildBirdArt({ bird: d });
    if (!artwork) throw new Error(`Missing bird illustration: ${d.name}`);
    return <ASvg width={48 * scale} height={56 * scale} viewBox="0 0 96 96" style={svgStyle}>
      {artwork}
    </ASvg>;
  }

  // ---- FISH: side-profile, big cute eye (the requested non-bird). Size scales
  // the whole body; stripe/spot/fan-tail give each species its tell. ----
  if (d.shape === 'fish') {
    // flowy fan tail (betta/guppy/angelfish) vs plain triangle tail
    const tailFin = d.tail === 'fan'
      ? 'M16 44 q-14 -18 -12 -1 q-2 17 12 1 z'
      : 'M14 44 l-9 -12 v24 z';
    return (
      <ASvg width={48 * scale} height={56 * scale} viewBox="0 0 72 84" style={svgStyle}>
        {grad}
        <G scale={s} originX={38} originY={44}>
          {/* tail fin */}
          <Path d={tailFin} fill={wing} stroke={OUT} strokeWidth={2} strokeLinejoin="round" />
          {/* dorsal + bottom fins */}
          <Path d="M34 30 q6 -12 14 -8 q-4 6 -3 12 z" fill={wing} stroke={OUT} strokeWidth={1.8} strokeLinejoin="round" />
          <Path d="M32 58 q4 8 12 7 q-3 -6 -2 -10 z" fill={wing} stroke={OUT} strokeWidth={1.6} strokeLinejoin="round" />
          {/* body */}
          <Ellipse cx={38} cy={46} rx={22} ry={15} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
          {/* body bands (clownfish/angelfish tell) */}
          {d.stripe && (
            <>
              <Ellipse cx={32} cy={46} rx={2.7} ry={12.5} fill={d.stripe} opacity={0.95} />
              <Ellipse cx={43} cy={46} rx={2.7} ry={11} fill={d.stripe} opacity={0.95} />
            </>
          )}
          {/* scattered spots (pufferfish/koi tell) */}
          {d.spot && [[30, 42], [36, 51], [45, 43], [41, 52]].map(([cx, cy], i) => (
            <Circle key={i} cx={cx} cy={cy} r={2.3} fill={d.spot} opacity={0.8} />
          ))}
          {/* gill line */}
          <Path d="M44 34 q-5 12 0 24" stroke={OUT} strokeWidth={1.6} fill="none" opacity={0.5} />
          {/* lips */}
          <Path d="M58 46 q6 -3 6 0 q0 3 -6 0 z" fill="#e0662f" stroke={OUT} strokeWidth={1.4} strokeLinejoin="round" />
          {/* blush */}
          <Ellipse cx={49} cy={50} rx={4} ry={2.8} fill="#ff6b8a" opacity={0.35} />
          {eyes(49, 42)}
        </G>
      </ASvg>
    );
  }

  return null;
}
