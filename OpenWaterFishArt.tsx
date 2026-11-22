// Open-water and river fish: broad field-guide marks remain legible on the board.
import React from 'react';
import { Circle, G, Path } from 'react-native-svg';
import { BirdDef } from './roster';
import { BirdEye, INK } from './BirdDetails';

const edge = { stroke: INK, strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const eye = (x: number, y: number, r = 3) => <G stroke="none"><BirdEye x={x} y={y} r={r} /></G>;

export function OpenWaterFishArt({ fish }: { fish: BirdDef }) {
  switch (fish.name) {
    case 'Great White Shark': return <G {...edge}>
      <Path d="M43 38q2-17 13-24l5 24Z" fill="#416c87" />
      <Path d="M45 57l-8 15 20-11Z" fill="#416c87" />
      <Path d="M31 44C19 39 18 27 10 21q1 18 9 27L9 65q11-1 22-13" fill="#416c87" />
      <Path d="M25 44C40 33 64 30 78 39l11 9q-10 15-31 16C42 63 32 56 25 51Z" fill="#658fa5" />
      <Path d="M29 49c15 3 24 6 38 4l20-4C77 61 62 65 48 61Z" fill="#f5f1df" stroke="none" />
      <Path d="M58 51q-5 14-15 18 2-11 4-19" fill="#416c87" />
      <Path d="m64 43-2 5m-3-7-2 5m18 7q5 3 9-2" fill="none" strokeWidth={1.5} />
      {eye(77, 43)}
    </G>;
    case 'Hammerhead Shark': return <G {...edge}>
      <Path d="M41 41q-1-19 12-23l5 23Z" fill="#337e99" />
      <Path d="M41 59l-7 13 20-10Z" fill="#337e99" />
      <Path d="M31 48Q15 37 13 22q-4 16 3 28L8 66q11-1 23-10" fill="#337e99" />
      <Path d="M24 46C39 38 53 37 62 35Q67 32 70 24Q78 16 86 22L89 29Q85 46 88 65L84 71Q76 75 70 67Q65 58 59 57C46 61 33 58 25 53Z" fill="#56a2b4" />
      <Path d="M29 52Q46 56 60 51Q66 49 72 50L76 57L71 60Q65 56 59 57Q43 60 29 54Z" fill="#f5f2d9" stroke="none" />
      <Path d="M53 51q-1 13-12 18l3-14Z" fill="#337e99" />
      <Path d="M66 41l-2 6m-3-7-2 6m-3-5-2 5m27-16 4-2m-4 33 3 2" fill="none" strokeWidth={1.5} />
      {eye(81, 27, 2.7)}{eye(80, 65, 2.5)}
    </G>;
    case 'Whale Shark': return <G {...edge}>
      <Path d="M30 45C20 39 16 26 10 22q-3 17 8 28L9 67q12-3 22-14M45 35q2-17 14-22l7 21M45 61l-7 13 22-9" fill="#2d627c" />
      <Path d="M25 44c15-11 29-15 46-15 13-1 19 4 19 12v14c0 9-10 13-23 11C48 64 36 56 25 53Z" fill="#3e839d" />
      <Path d="M30 52q29 12 59 2c0 8-10 12-22 10-16-2-28-7-37-10Z" fill="#fff2cf" stroke="none" />
      <Path d="M33 44q20-11 41-9M36 49q20-8 37-7" fill="none" stroke="#91c9d1" strokeWidth={2.3} />
      <G fill="#f9edcb" stroke="none">
        <Circle cx={42} cy={39} r={2.2}/><Circle cx={51} cy={35} r={2.2}/><Circle cx={60} cy={33} r={2.2}/><Circle cx={69} cy={33} r={2.2}/>
        <Circle cx={39} cy={47} r={2.2}/><Circle cx={49} cy={43} r={2.3}/><Circle cx={59} cy={41} r={2.3}/><Circle cx={69} cy={40} r={2.3}/>
        <Circle cx={45} cy={53} r={2.2}/><Circle cx={55} cy={51} r={2.3}/><Circle cx={65} cy={49} r={2.3}/><Circle cx={76} cy={48} r={2.2}/><Circle cx={82} cy={40} r={1.7}/>
      </G>
      <Path d="M60 53q-6 18-19 22l6-21" fill="#2d627c" />
      <Path d="m69 51-1 7m-5-7-1 5M87 40q-2 9 0 16" fill="none" strokeWidth={1.6} />
      {eye(78, 35, 3.1)}
    </G>;
    case 'Manta Ray': return <G {...edge}>
      <Path d="M49 55C43 69 60 75 51 88" fill="none" strokeWidth={2.7} />
      <Path d="M40 31C28 28 20 18 7 13c1 16 7 36 23 48l14-6q7 10 16 0l12 5C85 44 88 27 89 16 73 22 68 28 57 30l-3-9-7 4Z" fill="#354e68" />
      <Path d="M40 32C31 34 20 25 11 19q5 22 20 35l12-5Z" fill="#52778a" stroke="none" />
      <Path d="M57 32C63 36 72 33 84 23q-3 17-14 31l-11-5Z" fill="#52778a" stroke="none" />
      <Path d="M43 49q8 9 16 0l-4 6q-6 6-11 0Z" fill="#8ba8b7" stroke="none" />
      <Path d="M41 30q-8-12-1-15l5 7 5-1 5-7q8 4-1 16" fill="#73939e" />
      <Path d="M39 43q10 9 20-1l-4 11q-5 5-11 0Z" fill="#e4e9db" stroke="none" />
      <Path d="M45 33q5 4 10-1" fill="none" strokeWidth={1.5} />
      {eye(39, 28, 2.4)}{eye(58, 27, 2.4)}
    </G>;
    case 'Spotted Eagle Ray': return <G {...edge}>
      <Path d="M49 58C51 73 36 79 44 88" fill="none" strokeWidth={2.4} />
      <Path d="M40 34C28 33 20 25 8 23q5 25 23 45l13-9q7 9 15 0l11 8q17-18 19-43C77 28 69 34 59 34l-3-13q-5-5-10 0Z" fill="#293f50" />
      <Path d="M41 35q-14 7-27-4c4 12 11 23 19 30l11-10q7 9 13 0l12 10q10-12 15-29-13 10-25 3Z" fill="#506d76" stroke="none" />
      <G fill="#fff0d6" stroke="none">
        <Circle cx={25} cy={37} r={2.5}/><Circle cx={31} cy={48} r={2.6}/><Circle cx={37} cy={36} r={2.2}/><Circle cx={38} cy={57} r={2.3}/>
        <Circle cx={69} cy={37} r={2.5}/><Circle cx={65} cy={49} r={2.6}/><Circle cx={76} cy={44} r={2.1}/><Circle cx={61} cy={57} r={2.3}/>
      </G>
      <Path d="M44 24q5-4 11 0l2 10q-7 5-15 0Z" fill="#a8b9a8" stroke="none" />
      <Path d="M45 36q5 3 10-1" fill="none" strokeWidth={1.5} />
      {eye(42, 29, 2.5)}{eye(59, 29, 2.5)}
    </G>;
    case 'Moray Eel': return <G {...edge}>
      <Path d="M11 75C29 86 45 72 38 58 28 37 42 20 64 23l9 10C51 28 43 40 52 53 69 78 40 92 21 84Z" fill="#8c9c5e" />
      <Path d="M11 75c17 6 31-4 23-18C20 33 37 18 59 27c12-4 26 3 29 13l-1 10-14 4C55 52 48 42 44 46c-6 7 13 21 4 31-9 10-27 12-37-2Z" fill="#b8bc78" />
      <Path d="M13 77q21 10 30-4c6-9-12-20-4-32q6-9 19-4l14 12 15-2-1 4-13 3C55 52 48 42 44 46c-6 7 13 21 4 31-9 10-27 12-35 0Z" fill="#ded7a0" stroke="none" />
      <G fill="#6e8051" stroke="none">
        <Circle cx={31} cy={74} r={3}/><Circle cx={38} cy={65} r={2.6}/><Circle cx={33} cy={48} r={2.5}/>
        <Circle cx={43} cy={32} r={3}/><Circle cx={57} cy={32} r={3.2}/><Circle cx={65} cy={42} r={2.7}/>
      </G>
      <Path d="m75 45q7 3 12-1m-21-6-2 6" fill="none" strokeWidth={1.5} />
      {eye(77, 36, 3.1)}
    </G>;
    case 'Sailfish': return <G {...edge}>
      <Path d="M28 43C25 29 26 14 35 9c11-3 17 15 24 15q8 0 10 17Z" fill="#716ab0" />
      <Path d="M31 38q-2-16 3-22m8 23q1-11-3-21m13 22-5-14m15 15-5-10" fill="none" stroke="#aaa4d8" strokeWidth={1.7} />
      <Path d="M28 46C18 42 14 29 8 24q-1 16 9 25Q9 60 9 72c7-7 9-15 20-19" fill="#485b86" />
      <Path d="M43 55l-8 15 22-13" fill="#485b86" />
      <Path d="M23 46c16-6 32-8 48-3l19-5-16 12c-15 10-35 11-51 3Z" fill="#529db7" />
      <Path d="M27 51q24 4 45-3c-10 10-29 12-45 4Z" fill="#e7eddf" stroke="none" />
      <Path d="M60 50Q51 64 39 67l9-15" fill="#485b86" />
      <Path d="m37 44 3 4m7-6 2 5m6-5 2 4m15 4 6-3" fill="none" stroke="#304660" strokeWidth={1.7} />
      {eye(69, 44, 2.8)}
    </G>;
    case 'Flying Fish': return <G {...edge}>
      <Path d="M59 44C50 23 29 11 15 12c-1 18 10 32 31 37" fill="#deedf3" />
      <Path d="M51 53C38 73 23 79 12 75c3-16 16-25 29-27" fill="#deedf3" />
      <Path d="M49 41Q34 21 21 18m23 32Q28 58 19 69" fill="none" stroke="#6198bf" strokeWidth={2} />
      <Path d="M29 45 14 34l3 14-7 21q15-6 20-16M47 38q4-12 13-13l8 14" fill="#367eae" />
      <Path d="M25 45c18-10 39-11 54-4l9 7c-14 14-38 14-63 4Z" fill="#3d99c6" />
      <Path d="M29 50q25 5 56-2c-14 13-35 13-56 3Z" fill="#f1eed8" stroke="none" />
      <Path d="M66 48C57 55 45 69 29 70c1-13 14-23 24-26Z" fill="#e6f1e9" />
      <Path d="M56 49Q45 59 35 65m37-19-2 7m10-3 5-1" fill="none" strokeWidth={1.6} />
      {eye(77, 43, 2.9)}
    </G>;
    case 'Atlantic Bluefin Tuna': return <G {...edge}>
      <Path d="M29 45C17 39 16 26 10 19 7 34 13 44 17 49q-9 10-7 25c6-10 9-18 19-20M43 34q5-13 14-16l4 17" fill="#254b85" />
      <Path d="M43 62l12 13 7-14" fill="#254b85" />
      <Path d="M24 46C44 27 62 23 78 38l11 12-11 12c-17 16-35 7-54-9Z" fill="#356fba" />
      <Path d="M28 50q32 6 59 0C73 69 52 67 28 52Z" fill="#f5f0d6" stroke="none" />
      <Path d="M32 43q21-12 35-8" fill="none" stroke="#79c5e4" strokeWidth={2.6} />
      <Path d="M61 48q-9 12-23 17l13-16" fill="#254b85" />
      <Path d="m37 39-2-6-4 8m-1 17 3 5 4-4m-8-16-3-5-3 7m-1 11 2 5 3-3" fill="#eac75d" strokeWidth={1.5} />
      <Path d="m70 40-2 13m12 1 5-2" fill="none" strokeWidth={1.6} />
      {eye(77, 43, 3.1)}
    </G>;
    case 'Rainbow Trout': return <G {...edge}>
      <Path d="m29 43-18-12 4 16-4 17 18-11M42 36l10-16 11 15M43 61l7 12 13-13m5-24 5-9 7 12" fill="#7d9c7e" />
      <Path d="M24 44c19-12 42-15 57-5l8 9-10 9c-16 11-36 5-55-5Z" fill="#aec2a4" />
      <Path d="M27 49q30 4 59-1C75 63 49 68 27 52Z" fill="#e4e6ce" stroke="none" />
      <Path d="M27 47q26-3 55-1l-2 7q-30-3-53-3Z" fill="#df94a0" stroke="none" />
      <G fill="#416653" stroke="none">
        <Circle cx={38} cy={40} r={2.1}/><Circle cx={49} cy={36} r={2.3}/><Circle cx={60} cy={39} r={2.2}/>
        <Circle cx={19} cy={40} r={2.2}/><Circle cx={52} cy={26} r={1.7}/><Circle cx={68} cy={35} r={2.2}/>
      </G>
      <Path d="M60 52q-4 10-14 11l6-12" fill="#a3b88e" />
      <Path d="m71 43-2 9m11-2 5-1" fill="none" strokeWidth={1.5} />
      {eye(77, 42, 2.8)}
    </G>;
    case 'Sockeye Salmon': return <G {...edge}>
      <Path d="m28 43-17-13 5 18-5 15 18-11M41 34l13-17 10 17M41 61l10 13 10-13" fill="#c94e45" />
      <Path d="M24 43c17-14 33-15 48-9l10 7 6 5-4 6-6-1q-12 17-31 12L24 52Z" fill="#e36950" />
      <Path d="M28 51q27 9 46-2l6 2c-14 17-32 15-52 1Z" fill="#f1a36a" stroke="none" />
      <Path d="M68 33q9 1 14 8l6 5-4 6-6-1-5 6q-10-8-10-17Z" fill="#71996e" />
      <Path d="M79 48q8 1 9-5l1 8q-4 6-11 0" fill="#a6b88c" />
      <Path d="M56 51q-5 11-14 14l6-14" fill="#b44940" />
      <Path d="m66 41-2 9m15-2 6 1" fill="none" strokeWidth={1.5} />
      {eye(76, 40, 2.7)}
    </G>;
    case 'Sturgeon': return <G {...edge}>
      <Path d="M31 47C20 40 17 23 10 15q-4 19 7 34L9 63q13-1 22-10M36 41q2-12 13-15l9 13" fill="#52658c" />
      <Path d="M40 57q-2 12-10 17l23-13" fill="#52658c" />
      <Path d="M25 46C39 38 51 32 66 36Q72 37 78 41L90 46L77 50Q73 57 66 59C51 65 36 58 25 52Z" fill="#8191b0" />
      <Path d="M29 52Q47 59 67 53L74 52L69 57Q51 63 33 55Z" fill="#f6edcf" stroke="none" />
      <G fill="#f7efd2" stroke="none">
        <Path d="M30 44L36 39L42 41L48 36L54 39L60 35L66 39L72 40L69 44L63 42L58 44L53 42L47 46L42 44L36 48Z" />
      </G>
      <Path d="M60 52q-4 13-17 15l7-14" fill="#52658c" />
      <Path d="m68 44-2 7m14-3-1 7m-4-5-1 7m-3-1q3 3 6 0" fill="none" strokeWidth={1.6} />
      {eye(73, 43, 2.9)}
    </G>;
    default: return null;
  }
}
