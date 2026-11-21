// Eleven fish silhouettes, with species markings in the shared field-guide style.
import React from 'react';
import { Circle, G, Path } from 'react-native-svg';
import { BirdDef } from './roster';
import { BirdEye, INK } from './BirdDetails';

const edge = { stroke: INK, strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const eye = (x: number, y: number, r = 3.1) => <G stroke="none"><BirdEye x={x} y={y} r={r} /></G>;

export function FishArt({ fish }: { fish: BirdDef }) {
  switch (fish.name) {
    case 'Clownfish': return <G {...edge}>
      <Path d="M30 35Q43 19 62 25L68 34M29 57Q43 76 62 68L66 59" fill="#ed8334" />
      <Path d="m24 40-13-9q-6 14 0 29l13-10Z" fill="#f6913c" />
      <Path d="m12 35 2 21" fill="none" stroke="#fff5dd" strokeWidth={3.8} />
      <Path d="M23 40C38 27 67 28 79 39l7 7-7 7C66 66 39 68 24 54Z" fill="#f38b37" />
      <Path d="M33 34q-3 12 0 27l8 1q-5-16-1-30ZM61 32q-6 15-1 29l8-4q-4-10 0-22ZM24 39l-4 3 1 12 7 3q-4-9-4-18Z" fill="#fff8e8" />
      <Path d="M45 49q-3 13 8 12l5-10Z" fill="#d8662d" />
      <Path d="m48 53 5 3m25-8 5-1" fill="none" strokeWidth={1.5} />
      {eye(73, 42)}
    </G>;
    case 'Blue Tang': return <G {...edge}>
      <Path d="M30 34Q43 14 61 22L70 33M30 59Q44 79 61 69L68 59" fill="#2570c9" />
      <Path d="m28 42-17-9q3 12 0 27l17-8Z" fill="#f5d34c" />
      <Path d="M27 39C39 23 65 25 77 37l9 11-9 8C62 73 35 70 27 55Z" fill="#307cdb" />
      <Path d="M28 42c9-10 20-11 32-9l9 5c-12-1-21 1-24 8-4 8 6 13 15 12l14-5c-8 12-28 13-37 5-6-5-8-10-9-16Z" fill="#253a52" stroke="none" />
      <Path d="M39 43c4-5 9-5 12-3-7 3-10 9-9 14-5-2-6-6-3-11Z" fill="#4999e8" stroke="none" />
      <Path d="M64 49q-8 4-7 12l11-7Z" fill="#f1d64c" />
      <Path d="m78 49 5-1" fill="none" strokeWidth={1.5} />
      {eye(73, 41)}
    </G>;
    case 'Yellow Tang': return <G {...edge}>
      <Path d="M30 37Q38 12 57 16L70 34M30 59Q39 80 58 77L70 61" fill="#f6d14a" />
      <Path d="m29 41-17-9 3 14-3 15 17-8Z" fill="#e8b939" />
      <Path d="M28 37C36 24 56 22 67 32l7 10 12 6-12 5-6 9C57 75 37 71 29 60c-5-7-6-15-1-23Z" fill="#f6d64c" />
      <Path d="M30 42q-4 12 5 19" fill="none" stroke="#fff0a1" strokeWidth={3} />
      <Path d="M58 46q-9 0-12 12 11 2 15-7Z" fill="#e9bc36" />
      <Path d="m53 50-4 5m29-7 5 0" fill="none" strokeWidth={1.5} />
      <Path d="m29 48 5 0" fill="none" stroke="#fff9d8" strokeWidth={3} />
      {eye(67, 40, 3.2)}
    </G>;
    case 'Pufferfish': return <G {...edge}>
      <Path d="m27 43-14-8 2 12-2 13 14-7" fill="#b29b61" />
      <Path d="m33 30-3-3m13-5-1-4m14 3 1-4m12 10 3-3m7 15 4-1m-4 17 4 2M69 68l2 4M57 73v4m-16-6-2 4m-9-17-4 2" fill="none" stroke="#9a8555" strokeWidth={2} />
      <Circle cx={53} cy={47} r={26} fill="#cfb77f" />
      <Path d="M29 51q7-10 22-4 14 5 26 0c3 15-7 26-23 26-15 0-26-9-25-22Z" fill="#fff0cf" stroke="none" />
      <Path d="M36 50q-16-4-11 7 6 5 13-2" fill="#dec895" />
      <Path d="M63 55q6 4 10 0" fill="none" strokeWidth={1.6} />
      <G fill="#9a8555" stroke="none">
        <Circle cx={41} cy={31} r={2.1}/><Circle cx={53} cy={27} r={2}/><Circle cx={64} cy={30} r={2.2}/>
        <Circle cx={35} cy={41} r={2}/><Circle cx={48} cy={38} r={2.6}/><Circle cx={57} cy={45} r={1.8}/>
        <Circle cx={41} cy={60} r={1.6}/><Circle cx={53} cy={65} r={1.5}/>
      </G>
      {eye(68, 43, 3.5)}
    </G>;
    case 'Seahorse': return <G {...edge}>
      <Path d="M45 40q-14 1-14 14l15-3Z" fill="#e5a0b5" />
      <Path d="M46 30q-8-7-3-15l6 2 3-8 5 8 7-3 1 7c7 1 9 5 9 9l12 4-2 8-18-5c-7 8-7 13-2 20 8 13 0 21-11 25-13 6-27 1-25-10 1-8 12-10 16-4 3 5-2 10-6 7-2-2-1-4 1-4-6-2-9 7-1 9 9 3 20-4 14-11-10-10-13-20-9-31Z" fill="#ee95b7" />
      <Path d="M57 38c-8 12-6 20 2 29l4-4c2-5-1-8-4-12-2-4-2-7 1-11Z" fill="#ffe0d4" stroke="none" />
      <Path d="m48 44 7 3m-8 4 8 3m-5 5 8 2m-4 5 6 1m19-30 4 1" fill="none" stroke="#b96187" strokeWidth={1.5} />
      <Path d="M51 36q-8 1-8-5m0 20-5 1" fill="none" strokeWidth={1.5} />
      {eye(64, 28, 3)}
    </G>;
    case 'Angelfish': return <G {...edge}>
      <Path d="m31 42-17-13-3 9 4 10-4 11 3 8 17-14Z" fill="#a8b9c4" />
      <Path d="M30 38Q45 27 51 9q17 6 15 25l15 13-14 14q-3 17-15 24-2-19-23-29Z" fill="#dce5e5" />
      <Path d="M35 37q9-5 17-7l14 4 15 13-14 14-15 6-17-9Z" fill="#f1eee0" stroke="none" />
      <Path d="M45 26 51 15q6 23 1 60l-6-12q3-20-1-37ZM62 31l6 5q-4 12 0 23l-7 6q-5-18 1-34ZM30 39l5-3q-3 13 1 23l-6-4Z" fill="#384857" stroke="none" />
      <Path d="m55 63-8 23m15-25 4 22" fill="none" stroke="#c5d6db" strokeWidth={2.8} />
      <Path d="M56 48q-12 0-14 10l15-6Z" fill="#b7cbd1" />
      <Path d="m75 48 4-1" fill="none" strokeWidth={1.5} />
      {eye(71, 42, 2.8)}
    </G>;
    case 'Betta': return <G {...edge}>
      <Path d="M42 42C30 30 28 16 18 19q-9 2-5 12-9 2-4 12-6 8 4 14-6 11 5 14 5 11 13 4c13-5 19-18 15-27Z" fill="#9b65d4" />
      <Path d="M41 45 18 25m22 23-26-13m26 16-26-1m28 5-23 12m26-12L32 72" fill="none" stroke="#d9a5ec" strokeWidth={1.8} />
      <Path d="M40 37q0-16 13-19 6-4 8 4 8-2 7 8l-4 9M40 54q-3 15 9 23 6 8 11-2 8 6 10-5 10 1 5-11l-4-8" fill="#a66ddb" />
      <Path d="m45 35 10-10m-7 31 6 15m2-16 9 12" fill="none" stroke="#e0b4ed" strokeWidth={1.7} />
      <Path d="M36 43c11-9 24-11 36-7 7 3 11 8 14 12l-9 7c-14 6-28 3-41-4Z" fill="#5576d1" />
      <Path d="M40 44q15-7 29-4" fill="none" stroke="#91d9e3" strokeWidth={2.8} />
      <Path d="M65 50q-9 3-10 13l11-6Z" fill="#b485df" />
      <Path d="m69 55-2 19m5-19 3 16m5-22 4-1" fill="none" strokeWidth={1.5} />
      {eye(75, 43, 2.9)}
    </G>;
    case 'Goldfish': return <G {...edge}>
      <Path d="M39 43C30 23 15 20 10 29q-2 5 4 12l8 6C14 48 8 56 12 64q6 12 17 3 12-3 16-14Z" fill="#ed8840" />
      <Path d="M38 48 15 34m24 16L14 50m26 2L23 65" fill="none" stroke="#ffd377" strokeWidth={1.9} />
      <Path d="M42 35q4-17 18-18l1 9 10 7M48 61q-2 12 12 17l5-13" fill="#e48035" />
      <Path d="M39 39c7-12 26-12 37-2 6 5 8 10 9 15l-7 6c-7 14-30 15-39 2-4-6-4-15 0-21Z" fill="#f49a3e" />
      <Path d="M43 54q17-7 35 1c-6 12-25 14-35 3Z" fill="#ffce72" stroke="none" />
      <Path d="M60 48q-14 1-11 13 9-1 15-10Z" fill="#e78030" />
      <Path d="m54 53-1 5m25-6 5 0" fill="none" strokeWidth={1.5} />
      {eye(72, 43, 3.3)}
    </G>;
    case 'Guppy': return <G {...edge}>
      <Path d="M46 43 16 22Q6 32 10 45q-4 12 6 25l30-21Z" fill="#eb877d" />
      <Path d="m44 45-28-17m28 19L14 45m31 4L17 64" fill="none" stroke="#ffd19b" strokeWidth={1.8} />
      <G fill="#6a5598" stroke="none">
        <Circle cx={22} cy={35} r={2.6}/><Circle cx={30} cy={43} r={2.5}/><Circle cx={19} cy={49} r={2.8}/>
        <Circle cx={25} cy={57} r={2.5}/><Circle cx={37} cy={48} r={2}/>
      </G>
      <Path d="M48 40q4-17 15-17l4 8 6 7M56 52l-2 14 13-12" fill="#4da8c0" />
      <Path d="M43 43c11-8 27-9 35-2l8 7-9 5c-12 4-22 0-34-4Z" fill="#66c4cc" />
      <Path d="M46 45q7-1 12 3l-2 5-12-4Z" fill="#e6b850" stroke="none" />
      <Path d="M61 48q-2 6 6 7l3-5" fill="#b8e0d2" />
      <Path d="m79 48 4 0" fill="none" strokeWidth={1.5} />
      {eye(75, 43, 2.7)}
    </G>;
    case 'Koi': return <G {...edge}>
      <Path d="m29 43-17-13 3 16-3 16 17-12M38 37q12-13 28-10l-4 12M38 54l-4 15 17-9m9-3 7 11 3-14" fill="#d8e2dc" />
      <Path d="M24 43c14-8 32-11 45-7 9 2 15 6 18 12l-7 7c-17 10-39 4-56-5Z" fill="#fff4df" />
      <Path d="M34 39q7-3 14-3l4 8-8 5-11-1ZM57 36q7-1 13 1l3 8-9 5-8-4ZM44 53l9-5 10 4-1 8q-11 0-18-4ZM77 41l5 2 4 5-6 4-6-3Z" fill="#df6245" stroke="none" />
      <Path d="M61 49q-10 0-12 12 11 0 17-8Z" fill="#e6e8d8" />
      <Path d="m53 56 7-4M82 51q7 5 7 12m-8-9q2 9-4 13" fill="none" strokeWidth={1.6} />
      {eye(76, 44, 2.8)}
    </G>;
    case 'Green Fish': return <G {...edge}>
      <Path d="M28 37 35 22l8 7 8-11 7 11 10-4 1 13M33 59l8 14 11-5 12 4 6-14" fill="#3b9965" />
      <Path d="m28 41-17-14 4 19-4 19 17-14Z" fill="#4fba78" />
      <Path d="M25 40c14-10 34-10 48-1l13 9-10 9c-14 12-37 9-51-3Z" fill="#62bc79" />
      <Path d="M28 51q22-3 47 6c-14 10-33 8-47-3Z" fill="#c3e2ab" stroke="none" />
      <Path d="m32 39q7 5 0 10m10-13q7 5 0 10m10-12q7 5 0 10m-14 2q7 5 0 10m10-13q7 5 0 10" fill="none" stroke="#318557" strokeWidth={1.5} />
      <Path d="M60 49q-11 2-11 13 11-1 16-9Z" fill="#3d9965" />
      <Path d="m78 49 5-1m-66-8 9 7-9 8" fill="none" strokeWidth={1.5} />
      {eye(73, 43, 3.2)}
    </G>;
    default: return null;
  }
}
