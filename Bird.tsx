import React, { useEffect, useRef, useId } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, G, Path, Ellipse, Circle } from 'react-native-svg';
import { COLLECTIONS, CollectionId } from './roster';

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

  // ---- PENGUIN: fully alternate upright silhouette ----
  if (d.shape === 'penguin') {
    return (
      <ASvg width={48 * scale} height={56 * scale} viewBox="0 0 72 84" style={svgStyle}>
        {grad}
        <G>
          {/* feet */}
          <Ellipse cx={26} cy={76} rx={7} ry={3.5} fill={leg} stroke={OUT} strokeWidth={1.4} />
          <Ellipse cx={40} cy={76} rx={7} ry={3.5} fill={leg} stroke={OUT} strokeWidth={1.4} />
          {/* body */}
          <Ellipse cx={33} cy={44} rx={20} ry={30} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
          {/* flippers */}
          <Ellipse cx={14} cy={46} rx={5} ry={16} fill={wing} stroke={OUT} strokeWidth={1.6} />
          <Ellipse cx={52} cy={46} rx={5} ry={16} fill={wing} stroke={OUT} strokeWidth={1.6} />
          {/* white belly — narrower + lower so the black "coat" and head-cap
             show as a real tuxedo (the penguin tell), not a white blob */}
          <Path d="M33 27 C23 27 22 46 24 58 C26 69 40 69 42 58 C44 46 43 27 33 27 Z" fill={belly} />
          {/* beak */}
          <Path d="M28 40 l10 3 -10 3 z" fill="#f4a72a" stroke={OUT} strokeWidth={1.4} strokeLinejoin="round" />
          {/* king-penguin signature: orange ear-patches + yellow throat wash */}
          <Path d="M28 44 q5 6 10 0 q-1 8 -5 9 q-4 -1 -5 -9 z" fill="#f4c53a" opacity={0.75} />
          <Ellipse cx={19} cy={34} rx={4} ry={7} fill="#f39a1c" stroke={OUT} strokeWidth={1} />
          <Ellipse cx={47} cy={34} rx={4} ry={7} fill="#f39a1c" stroke={OUT} strokeWidth={1} />
          {/* blush */}
          <Ellipse cx={24} cy={40} rx={3.5} ry={2.6} fill="#ff6b8a" opacity={0.3} />
          <Ellipse cx={42} cy={40} rx={3.5} ry={2.6} fill="#ff6b8a" opacity={0.3} />
          {eyes(33, 32)}
        </G>
      </ASvg>
    );
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

  // ---- PARROT / MACAW: long streamer tail + hook beak + pale face patch ----
  // The long tail (longer than the body) is the macaw tell; color does the species.
  if (d.shape === 'parrot') {
    const face = d.cheek ?? '#f5f0e6';
    return (
      <ASvg width={48 * scale} height={56 * scale} viewBox="0 0 72 84" style={svgStyle}>
        {grad}
        <G>
          {/* long streamer tail — the macaw tell. Starts high, splays well below
             the body so a clear pointed tail reads at 48px. */}
          <Path d="M30 46 Q17 72 23 84 Q31 70 38 58 Z" fill={col} stroke={OUT} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M37 46 Q37 78 45 84 Q47 66 45 56 Z" fill={wing} stroke={OUT} strokeWidth={2} strokeLinejoin="round" />
          {/* feet */}
          <Path d="M30 60 v7 M40 60 v7" stroke={leg} strokeWidth={3} strokeLinecap="round" />
          {/* upright chunky body (sits above the tail so the tail stays visible) */}
          <Ellipse cx={34} cy={44} rx={16 * s} ry={18 * s} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
          <Ellipse cx={34} cy={52} rx={10 * s} ry={13 * s} fill={belly} />
          {/* big head (hood = a differently-coloured cap, e.g. lorikeet's blue) */}
          <Circle cx={40} cy={27} r={14 * s} fill={d.hood ?? `url(#${gid})`} stroke={OUT} strokeWidth={2} />
          {/* pale bare face patch cradling the eye */}
          <Ellipse cx={43} cy={27} rx={9 * s} ry={10 * s} fill={face} stroke={OUT} strokeWidth={1} />
          {/* big hooked beak */}
          <Path d="M50 21 q12 1 13 9 q-1 8 -10 6 q5 -6 -3 -11 z" fill="#48484f" stroke={OUT} strokeWidth={1.8} strokeLinejoin="round" />
          <Path d="M51 31 q7 1 9 3" stroke={OUT} strokeWidth={1.2} fill="none" opacity={0.5} />
          {eyes(43, 26, s)}
        </G>
      </ASvg>
    );
  }

  // ---- TOUCAN: the beak IS the bird — as big as the body, downcurved ----
  if (d.shape === 'toucan') {
    const bib = d.belly ?? '#f7d84b';
    const beakC = d.cheek ?? '#f2a71b';
    return (
      <ASvg width={48 * scale} height={56 * scale} viewBox="0 0 72 84" style={svgStyle}>
        {grad}
        <G>
          {/* feet */}
          <Path d="M27 66 v6 M37 66 v6" stroke={leg} strokeWidth={3} strokeLinecap="round" />
          {/* small round body */}
          <Ellipse cx={29} cy={52} rx={16} ry={16} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
          {/* white/yellow bib */}
          <Path d="M21 44 q8 -6 16 0 q2 13 -8 17 q-10 -4 -8 -17 z" fill={bib} />
          {/* head */}
          <Circle cx={31} cy={34} r={12} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
          {/* OVERSIZED banana beak (as long as the body), gentle downcurve */}
          <Path d="M39 26 q27 -2 31 11 q-1 8 -9 10 q-15 2 -23 -6 q-3 -9 1 -15 z" fill={beakC} stroke={OUT} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M39 37 q17 6 27 3 q-4 6 -13 6 q-10 0 -15 -5 z" fill={shade(beakC, 0.85)} stroke={OUT} strokeWidth={1.6} strokeLinejoin="round" />
          {/* dark beak tip */}
          <Path d="M64 32 q6 2 6 7 q-1 5 -6 5 q2 -7 0 -12 z" fill="#c0392b" stroke={OUT} strokeWidth={1.4} strokeLinejoin="round" />
          <Path d="M39 29 q25 -1 30 10" stroke={shade(beakC, 0.55)} strokeWidth={1.4} fill="none" opacity={0.6} />
          {eyes(31, 32, 1)}
        </G>
      </ASvg>
    );
  }

  // ---- COCKATOO: parrot body + big recurved crest fan ----
  if (d.shape === 'cockatoo') {
    const crestC = d.crestColor ?? shade(col, 1.1);
    return (
      <ASvg width={48 * scale} height={56 * scale} viewBox="0 0 72 84" style={svgStyle}>
        {grad}
        <G>
          {/* short tail */}
          <Path d="M27 58 Q23 72 30 78 Q34 70 38 62 Z" fill={wing} stroke={OUT} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M29 62 v8 M39 62 v8" stroke={leg} strokeWidth={3} strokeLinecap="round" />
          {/* recurved crest: plumes sweeping up and back over the head */}
          {[0, 1, 2, 3].map((i) => (
            <Path
              key={i}
              d={`M${35 + i * 3} 19 q-2 -12 ${3 + i * 2} -17`}
              stroke={crestC}
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
            />
          ))}
          {/* body */}
          <Ellipse cx={34} cy={47} rx={16 * s} ry={20 * s} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
          <Ellipse cx={34} cy={51} rx={9 * s} ry={12 * s} fill={belly} />
          {/* head */}
          <Circle cx={38} cy={28} r={13 * s} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
          {d.cheek && <Ellipse cx={41} cy={31} rx={5} ry={6} fill={d.cheek} />}
          {/* hook beak */}
          <Path d="M47 25 q10 1 11 8 q-1 6 -9 5 q4 -5 -2 -9 z" fill="#5a5a62" stroke={OUT} strokeWidth={1.6} strokeLinejoin="round" />
          {eyes(38, 27, s)}
        </G>
      </ASvg>
    );
  }

  // ---- KINGFISHER: oversized head + long straight dagger beak + stub tail ----
  if (d.shape === 'kingfisher') {
    return (
      <ASvg width={48 * scale} height={56 * scale} viewBox="0 0 72 84" style={svgStyle}>
        {grad}
        <G>
          {/* stubby tail */}
          <Path d="M17 52 l-8 4 8 5 z" fill={wing} stroke={OUT} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M30 62 v7 M38 62 v7" stroke={leg} strokeWidth={2.6} strokeLinecap="round" />
          {/* compact body */}
          <Ellipse cx={32} cy={50} rx={15} ry={15} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
          <Ellipse cx={34} cy={54} rx={9} ry={11} fill={belly} />
          {/* oversized head */}
          <Circle cx={32} cy={28} r={16} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
          {d.cheek && <Ellipse cx={26} cy={30} rx={4} ry={5} fill={d.cheek} />}
          {/* long straight dagger beak */}
          <Path d="M45 25 l23 3.5 -23 4 z" fill="#3a3a42" stroke={OUT} strokeWidth={1.6} strokeLinejoin="round" />
          {eyes(34, 26, 1)}
        </G>
      </ASvg>
    );
  }

  // ---- DOVE / PIGEON: plump barrel body + small head + short beak ----
  if (d.shape === 'dove') {
    return (
      <ASvg width={48 * scale} height={56 * scale} viewBox="0 0 72 84" style={svgStyle}>
        {grad}
        <G>
          {/* short fanned tail */}
          <Path d="M13 48 l-6 -4 v16 z" fill={wing} stroke={OUT} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M31 66 v6 M41 66 v6" stroke={leg} strokeWidth={2.6} strokeLinecap="round" />
          {/* plump barrel body */}
          <Ellipse cx={34} cy={48} rx={21} ry={19} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
          <Ellipse cx={37} cy={52} rx={12} ry={13} fill={belly} />
          {/* wing line */}
          <Path d="M24 42 q16 -3 24 6" stroke={OUT} strokeWidth={1.4} fill="none" opacity={0.4} />
          {/* small head */}
          <Circle cx={49} cy={30} r={9} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
          {/* short beak */}
          <Path d="M56 29 l7 2 -6 3 z" fill="#c9954a" stroke={OUT} strokeWidth={1.3} strokeLinejoin="round" />
          {eyes(50, 29, 0.8)}
        </G>
      </ASvg>
    );
  }

  // ---- HUMMINGBIRD: tiny body + needle beak + hover pose + throat gorget ----
  if (d.shape === 'hummingbird') {
    const gorget = d.cheek ?? d.belly ?? '#e0335f';
    return (
      <ASvg width={40 * scale} height={48 * scale} viewBox="0 0 72 84" style={svgStyle}>
        {grad}
        <G>
          {/* swept-back hover wings */}
          <Ellipse cx={22} cy={44} rx={17} ry={6} fill={wing} stroke={OUT} strokeWidth={1.6} opacity={0.9} rotation={-26} originX={22} originY={44} />
          <Ellipse cx={44} cy={44} rx={17} ry={6} fill={wing} stroke={OUT} strokeWidth={1.6} opacity={0.9} rotation={26} originX={44} originY={44} />
          {/* tiny body */}
          <Ellipse cx={33} cy={47} rx={11} ry={13} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
          {/* head */}
          <Circle cx={40} cy={33} r={9} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
          {/* throat gorget */}
          <Path d="M35 39 q6 4 10 1 q-1 6 -6 7 q-4 -1 -4 -8 z" fill={gorget} />
          {/* long needle beak */}
          <Path d="M46 32 l21 2 -21 2 z" fill="#2b2b30" stroke={OUT} strokeWidth={1} strokeLinejoin="round" />
          {eyes(40, 32, 0.75)}
        </G>
      </ASvg>
    );
  }

  // ---- DEFAULT bird ----
  const bx = 30, by = 48, rx = 16 * s, ry = 15 * s;
  const hx = 40, hy = 28 - neck, hr = 14 * s;
  const legLen = neck ? 16 : 9;
  const legY = by + ry - 3;
  const headFill = d.hood ? d.hood : `url(#${gid})`;

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

  // peacock fan: teal feathers with eyespots, drawn behind the body
  const fan = d.tail === 'fan'
    ? [-52, -26, 0, 26, 52].map((deg, i) => {
        const a = (deg * Math.PI) / 180;
        const px = bx, py = by + 4;
        const len = 34;
        const tx = px + Math.sin(a) * len;
        const ty = py - Math.cos(a) * len;
        return { key: i, tx, ty };
      })
    : null;

  return (
    <ASvg width={48 * scale} height={56 * scale} viewBox="0 0 72 84" style={svgStyle}>
      {grad}
      <G>
        {/* peacock fan behind everything */}
        {fan?.map((f) => (
          <React.Fragment key={f.key}>
            <Path d={`M${bx} ${by + 4} L${f.tx} ${f.ty}`} stroke="#0e9aa7" strokeWidth={3.4} strokeLinecap="round" />
            <Circle cx={f.tx} cy={f.ty} r={5} fill="#1f6fd0" stroke="#0e6b73" strokeWidth={1.4} />
            <Circle cx={f.tx} cy={f.ty} r={2.2} fill="#f2c521" />
          </React.Fragment>
        ))}
        {/* legs + feet */}
        <Path d={legsPath} stroke={leg} strokeWidth={2.6 * s} strokeLinecap="round" fill="none" />
        {crestPath && (
          <Path d={crestPath} fill={d.crestColor ?? col} stroke={OUT} strokeWidth={d.crest === 'tuft' ? 3 : 2} strokeLinejoin="round" />
        )}
        {/* peacock crown: three dotted plumes */}
        {d.crest === 'crown' && [-6, 0, 6].map((dx, i) => (
          <React.Fragment key={i}>
            <Path d={`M${hx + dx} ${hy - hr + 2} v-8`} stroke={OUT} strokeWidth={1.6} />
            <Circle cx={hx + dx} cy={hy - hr - 8} r={2.4} fill="#1f6fd0" stroke={OUT} strokeWidth={1} />
          </React.Fragment>
        ))}
        {neckPath && <Path d={neckPath} fill={col} stroke={OUT} strokeWidth={2} />}
        <Path d={tailPath} fill={wing} stroke={OUT} strokeWidth={2} strokeLinejoin="round" />
        <Ellipse cx={bx} cy={by} rx={rx} ry={ry} fill={`url(#${gid})`} stroke={OUT} strokeWidth={2} />
        <Path d={bellyPath} fill={belly} />
        <Path d={wingPath} fill={wing} stroke={OUT} strokeWidth={1.6} strokeLinejoin="round" />
        <Circle cx={hx} cy={hy} r={hr} fill={headFill} stroke={OUT} strokeWidth={2} />
        {d.cheek && <Ellipse cx={hx + 2} cy={hy + 3} rx={6 * s} ry={7 * s} fill={d.cheek} />}
        {/* blush */}
        <Ellipse cx={hx + 1 - 9} cy={hy + 3 + 4.5 * s * 0.7} rx={4.5 * s} ry={4.5 * s * 0.7} fill="#ff6b8a" opacity={0.35} />
        <Ellipse cx={hx + 1 + 11} cy={hy + 3 + 4.5 * s * 0.7} rx={4.5 * s} ry={4.5 * s * 0.7} fill="#ff6b8a" opacity={0.35} />
        {/* beak: toucan + pouch are big custom shapes */}
        {d.beak === 'toucan' ? (
          <>
            <Path d={`M${bkx - 1} ${bky - 6} q22 -4 26 8 q-2 9 -13 8 q-9 -1 -13 -6 z`} fill="#f2a71b" stroke={OUT} strokeWidth={1.8} strokeLinejoin="round" />
            <Path d={`M${bkx + 18} ${bky - 4} q7 2 7 6 q-1 5 -6 5 q3 -6 -1 -11 z`} fill="#d5372a" stroke={OUT} strokeWidth={1.4} strokeLinejoin="round" />
            <Path d={`M${bkx - 1} ${bky - 6} q22 -4 26 8`} stroke="#7a4a12" strokeWidth={1.6} fill="none" />
          </>
        ) : d.beak === 'pouch' ? (
          <>
            <Path d={`M${bkx - 1} ${bky - 3} q20 0 24 4 q-3 4 -10 4 q-9 0 -14 -3 z`} fill="#f2c24b" stroke={OUT} strokeWidth={1.6} strokeLinejoin="round" />
            <Path d={`M${bkx + 2} ${bky + 4} q10 6 20 1`} stroke="#e0a24a" strokeWidth={1.6} fill="none" />
          </>
        ) : (
          <Path d={beakPath} fill="#f4a72a" stroke={OUT} strokeWidth={1.6} strokeLinejoin="round" />
        )}
        {eyes(hx + 1, hy - 1, s)}
      </G>
    </ASvg>
  );
}
