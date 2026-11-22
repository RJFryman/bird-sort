// Nine reef and aquarium fish, drawn for both the field guide and small puzzle tokens.
import React from 'react';
import { Circle, G, Path } from 'react-native-svg';
import { BirdDef } from './roster';
import { BirdEye, INK } from './BirdDetails';

const edge = { stroke: INK, strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const eye = (x: number, y: number, r = 3) => <G stroke="none"><BirdEye x={x} y={y} r={r} /></G>;

export function ReefFishArt({ fish }: { fish: BirdDef }) {
  switch (fish.name) {
    case 'Lionfish': return <G {...edge}>
      <Path d="M30 42Q17 28 10 32q-5 13 1 28l21-7Z" fill="#edbf9a" />
      <Path d="m14 35 3 22m5-17 2 15" fill="none" stroke="#a35349" strokeWidth={3} />
      <Path d="M30 39Q25 27 24 16q9 5 14 17Q36 15 42 8q6 9 7 23Q54 13 61 12l-2 24Q71 21 76 25l-7 17Z" fill="#b75f53" />
      <Path d="m29 24 7 15m8-23 1 21m12-15-3 16m13-7-5 9" fill="none" stroke="#ffe5c4" strokeWidth={3} />
      <Path d="M32 55Q24 68 27 79l12-9q1 11 8 14l6-16q9 10 16 8l-6-21Z" fill="#b75f53" />
      <Path d="m34 71 8-16m5 19 4-18m11 11-6-12" fill="none" stroke="#ffe5c4" strokeWidth={3} />
      <Path d="M28 41c15-12 34-11 45-2l7 8 7 4-9 5-6 8c-17 4-34-1-43-10Z" fill="#bd6956" />
      <Path d="M34 38q0 12 8 22l7 2q-9-15-8-26ZM52 35q-1 14 8 28l6-1q-8-13-7-26ZM67 37q-2 11 5 21l4-5q-5-7-4-13Z" fill="#ffe5c4" stroke="none" />
      <Path d="M58 48Q36 45 18 65q10 11 25 10 13-3 18-20Z" fill="#e6af88" />
      <Path d="m53 52-29 13m31-10L33 72m23-15L44 73" fill="none" stroke="#a55348" strokeWidth={2.8} />
      <Path d="m79 51 5 0m-12 10 4 5" fill="none" strokeWidth={1.5} />
      {eye(73, 44, 3)}
    </G>;
    case 'Moorish Idol': return <G {...edge}>
      <Path d="m32 46-17-9q3 12-1 25l18-7Z" fill="#303e4a" />
      <Path d="M33 41Q40 24 47 22C45 12 34 8 24 8c16-5 32 5 34 23l10 9-15 6Z" fill="#fff6df" />
      <Path d="M32 44c2-13 15-21 28-15 8 4 11 12 13 19l13 5-13 5C69 69 61 78 50 77 37 77 28 64 32 44Z" fill="#fff6df" />
      <Path d="M35 39q3-6 8-9c-4 15-3 31 5 46-7-1-13-7-16-15q-3-12 3-22ZM52 28l8 1c-4 16-3 32 2 44l-9 4c-6-18-8-34-1-49ZM66 35q5 7 7 13l10 4-11 1-5-6Z" fill="#303e4a" stroke="none" />
      <Path d="M44 32q4-3 8-3c-4 13-3 33 1 43l-6-3c-5-12-5-26-3-37Z" fill="#f1cf4d" stroke="none" />
      <Path d="m75 51 8 2-9 3" fill="#eeb95a" strokeWidth={1.5} />
      <Path d="M61 54q-10 2-10 12l11-7Z" fill="#f4db83" strokeWidth={1.5} />
      {eye(66, 46, 2.9)}
    </G>;
    case 'Copperband Butterflyfish': return <G {...edge}>
      <Path d="m31 44-17-9 3 13-3 13 17-7Z" fill="#eee5cf" />
      <Path d="M30 42Q33 21 49 20q14 0 22 20l4 8 14 5-15 4-9 12q-13 14-29 3c-7-7-9-20-6-30Z" fill="#fff3dc" />
      <G fill="#eaa451" stroke="none">
        <Path d="M34 28q3-5 8-7c-4 16-3 36 2 54l-8-3q-8-22-2-44ZM49 20l7 2q-3 29 4 52l-8 1q-8-25-3-55ZM62 28l6 8q-1 14 4 25l-6 8q-7-21-4-41Z" />
      </G>
      <Path d="M29 42q-2 12 3 22m39-16 15 5m-12 2 13-2" fill="none" strokeWidth={1.5} />
      <Circle cx={37} cy={34} r={5.8} fill="#fff3dc" stroke="#eaa451" strokeWidth={2} />
      <Circle cx={37} cy={34} r={3.8} fill={INK} stroke="none" />
      <Path d="M58 53q-10 1-11 12l12-7Z" fill="#f4ce90" strokeWidth={1.5} />
      {eye(67, 45, 2.9)}
    </G>;
    case 'Royal Blue Discus': return <G {...edge}>
      <Path d="m33 43-18-9q3 13 0 26l18-8Z" fill="#759bd0" />
      <Path d="M31 36Q35 18 54 17q22 0 27 23l-2 24Q65 83 43 78L29 60Z" fill="#328ccc" />
      <Path d="M37 26c13-9 30-6 40 9 8 13 4 29-8 38-13 8-30 3-37-10-7-12-4-28 5-37Z" fill="#4ab7db" />
      <Path d="M40 29c-5 12 11 9 7 21s-6 15 1 22l4-1c-7-8-3-12 0-21s-11-13-7-22Z" fill="#dc6e66" stroke="none" />
      <Path d="M53 25c-6 12 11 14 5 25s-5 16 1 23l4-2c-6-6-3-11 0-21s-10-14-6-25Z" fill="#dc6e66" stroke="none" />
      <Path d="M66 29c-5 10 8 14 5 24s-6 13-4 16l4-2c-1-3 3-7 4-14s-9-18-5-21Z" fill="#dc6e66" stroke="none" />
      <Path d="M32 35q-6 16 2 29m5-41q16-10 31 1M42 76q15 6 29-5" fill="none" stroke="#8bdde3" strokeWidth={2.5} />
      <Path d="M63 51q-12 3-12 14l13-8Z" fill="#398ecc" strokeWidth={1.5} />
      <Path d="m77 49 5 1m-64-10 9 7-9 6" fill="none" strokeWidth={1.5} />
      {eye(71, 43, 3.1)}
    </G>;
    case 'Neon Tetra': return <G {...edge}>
      <Path d="M31 43 13 32l4 15-4 16 18-10" fill="#acc9c8" />
      <Path d="M45 39q5-13 15-10l4 12" fill="#acc9c8" />
      <Path d="M43 56l8 12 10-11" fill="#acc9c8" />
      <Path d="M27 44c16-10 35-10 49-3l10 8-10 8c-16 6-32 1-49-4Z" fill="#e0eddf" />
      <Path d="M28 45q24-9 45-3l6 5q-21-5-51 3Z" fill="#237d9d" stroke="none" />
      <Path d="M28 47q21-6 43-2l5 4q-25-3-48 2Z" fill="#44d4e5" stroke="none" />
      <Path d="M28 51q15-2 32 0l-1 9c-11-1-22-4-31-7Z" fill="#e9505a" stroke="none" />
      <Path d="m17 39 10 8-10 9m62-6 5-1" fill="none" strokeWidth={1.5} />
      {eye(75, 45, 2.9)}
    </G>;
    case 'Mandarinfish': return <G {...edge}>
      <Path d="M50 35q8-15 17-9l-3 14Z" fill="#ed964e" />
      <Path d="M35 57q5 16 20 13l10-11Z" fill="#ed964e" />
      <Path d="M31 43Q15 29 11 41q-4 12 7 21l15-8Z" fill="#ed964e" />
      <Path d="M32 40Q34 24 45 22l5 13Z" fill="#ed964e" />
      <Path d="M27 44c12-10 26-7 37-9 8-5 17 1 17 9l6 5-7 5c-2 9-11 12-18 7-11 3-27 0-35-8Z" fill="#e9974c" />
      <G fill="none" stroke="#20788d" strokeWidth={6}>
        <Path d="M32 46c14-11 30 0 21 7-7 5-16-2-9-5M62 40c-7 4-4 12 3 13M69 37q-8 10 5 18M20 40q-3 9 4 16" />
      </G>
      <G fill="none" stroke="#50cbd1" strokeWidth={3}>
        <Path d="M32 46c14-11 30 0 21 7-7 5-16-2-9-5M62 40c-7 4-4 12 3 13M69 37q-8 10 5 18M20 40q-3 9 4 16" />
      </G>
      <Path d="M65 50q-17 0-15 15 13 4 18-9Z" fill="#48b6c3" strokeWidth={1.5} />
      <Path d="M63 54q-10 2-10 8m-15-31 6 6m10-7 6 6m20 13 4 0" fill="none" strokeWidth={1.5} />
      {eye(75, 42, 3)}
    </G>;
    case 'Picasso Triggerfish': return <G {...edge}>
      <Path d="m29 43-16-9 3 13-3 13 16-8M43 33q5-15 16-13l-3 13M40 59q6 16 20 12l4-12" fill="#d2c5a3" />
      <Path d="M25 43c7-6 13-17 26-17 14 0 22 10 26 16l10 6-9 6C69 67 53 75 42 65L25 53Z" fill="#e9dfc5" />
      <Path d="M34 35q6-6 13-7l3 11-13 14-9-3Z" fill="#33454b" stroke="none" />
      <Path d="M56 28q10 2 17 11l-9 5 2 17-9 7-8-11 7-15Z" fill="#33454b" stroke="none" />
      <Path d="M38 54l10-5 7 11-6 4Z" fill="#fff6df" stroke="none" />
      <Path d="M64 37l10 4 3 6-12-1Z" fill="#43a7be" stroke="none" />
      <Path d="m78 44 9 4-9 6-4-5Z" fill="#efc74f" stroke="none" />
      <Path d="M66 47q-10 1-9 9l10-4Z" fill="#dab74b" strokeWidth={1.5} />
      <Path d="m45 30 7-9m26 27 6 0" fill="none" strokeWidth={1.5} />
      {eye(70, 39, 3)}
    </G>;
    case 'Yellow Longnose Butterflyfish': return <G {...edge}>
      <Path d="m31 43-17-9 3 13-3 15 17-8Z" fill="#f3d86e" />
      <Path d="M29 39Q31 19 46 17q16-2 22 22l3 6 18 5-18 4-8 13q-12 15-25 6c-9-7-13-22-9-34Z" fill="#f3d34d" />
      <Path d="M51 19q12 3 17 20l3 6 16 5-18 2-10-8Z" fill="#303f49" stroke="none" />
      <Path d="m60 48 9-1 18 3-16 4-8 13-6 5q5-14 3-24Z" fill="#fff4d9" stroke="none" />
      <Path d="M31 34q-4 16 2 29m12-43q-6 3-9 10" fill="none" stroke="#fff1a0" strokeWidth={2.4} />
      <Circle cx={36} cy={64} r={3.2} fill={INK} stroke="none" />
      <Path d="M54 49q-11 3-10 13l12-7Z" fill="#e9b93f" strokeWidth={1.5} />
      <Path d="m72 51 15-1" fill="none" strokeWidth={1.5} />
      {eye(64, 42, 3)}
    </G>;
    case 'Longhorn Cowfish': return <G {...edge}>
      <Path d="m36 46-15-5-10-10q-3 17 2 32l12-9 12 2M42 37q2-12 12-12l6 13" fill="#edc86d" />
      <Path d="M34 39q11-9 28-4l12 4 7 12-4 16q-18 10-40 0l-8-12Z" fill="#e7c665" />
      <Path d="M59 37 60 22q8 4 10 17m2 1 12-15q2 10-4 20" fill="#f7dda0" />
      <Path d="M64 37q13-2 16 9l5 10-7 13-17-2q-8-16 3-30Z" fill="#f4d886" />
      <Path d="M41 54q-13-6-11 7 4 9 14 1Z" fill="#f9e7ad" strokeWidth={1.5} />
      <Path d="M43 56q-8 0-10 5m28-18q-5 10 1 21m15-7q4 3 7-1" fill="none" strokeWidth={1.5} />
      <G fill="#b89b43" stroke="none">
        <Circle cx={41} cy={42} r={2.5}/><Circle cx={51} cy={46} r={2.8}/><Circle cx={46} cy={61} r={2.5}/>
        <Circle cx={53} cy={66} r={2}/><Circle cx={35} cy={49} r={2}/><Circle cx={70} cy={60} r={2}/>
      </G>
      <Path d="m14 38 7 11-7 8" fill="none" strokeWidth={1.5} />
      {eye(72, 47, 3.2)}
    </G>;
    default: return null;
  }
}
