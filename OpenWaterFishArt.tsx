// Open-water and river fish: broad field-guide marks remain legible on the board.
import React from 'react';
import { Circle, G, Path } from 'react-native-svg';
import { BirdDef } from './roster';
import { BirdEye, INK } from './BirdDetails';

const edge = { stroke: INK, strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const eye = (x: number, y: number, r = 2.8) => <G stroke="none"><BirdEye x={x} y={y} r={r} /></G>;

export function OpenWaterFishArt({ fish }: { fish: BirdDef }) {
  switch (fish.name) {
    case 'Great White Shark': return <G {...edge}>
      <Path d="M31 44C19 39 18 27 10 21q1 18 9 27L9 65q11-1 22-13M43 38q2-17 13-24l5 24M45 57l-8 15 20-11" fill="#78949f" />
      <Path d="M25 44C40 33 64 30 78 39l11 9q-10 15-31 16C42 63 32 56 25 51Z" fill="#8ba8b2" />
      <Path d="M29 49c15 3 24 6 38 4l20-4C77 61 62 65 48 61Z" fill="#f5f1df" stroke="none" />
      <Path d="M58 51q-5 14-15 18 2-11 4-19" fill="#718e9b" />
      <Path d="m64 43-2 5m-3-7-2 5m18 7q5 3 9-2" fill="none" strokeWidth={1.5} />
      {eye(77, 43)}
    </G>;
    case 'Hammerhead Shark': return <G {...edge}>
      <Path d="M31 48Q15 37 13 22q-4 16 3 28L8 66q11-1 23-10M41 41q-1-19 12-23l5 23M41 59l-7 13 20-10" fill="#659b9d" />
      <Path d="M24 47q16-12 41-8l3-14q9-9 17-5l2 13-10 8-1 10 10 6-2 14q-10 2-17-8l-2-9q-18 10-40 1Z" fill="#83b7b3" />
      <Path d="M29 52q18 4 38-6l4 5-1 10-4-7q-18 10-37 1Z" fill="#d7e7d7" stroke="none" />
      <Path d="M53 51q-1 13-12 18l3-14M70 30l-3 7m-4 5-2 5m-4-4-2 5m21 8 4 2" fill="none" strokeWidth={1.5} />
      {eye(79, 27, 2.7)}
    </G>;
    case 'Whale Shark': return <G {...edge}>
      <Path d="M30 42 12 25q-2 16 7 23L10 66q12-3 21-13M45 34q3-18 13-20l6 20M49 62l-9 12 20-9" fill="#376375" />
      <Path d="M25 43c13-13 36-17 54-10 9 3 9 10 9 16s-3 12-11 15c-19 7-39-2-52-12Z" fill="#365d72" />
      <Path d="M29 51q26 12 58 1c-2 10-12 14-25 13-15-1-25-7-33-11Z" fill="#d8dfcd" stroke="none" />
      <G fill="#f6e4af" stroke="none">
        <Circle cx={40} cy={42} r={2.3}/><Circle cx={49} cy={35} r={2.2}/><Circle cx={57} cy={44} r={2.7}/>
        <Circle cx={65} cy={34} r={2.5}/><Circle cx={70} cy={44} r={2.2}/><Circle cx={44} cy={52} r={2.1}/>
      </G>
      <Path d="M58 53q-1 12-12 17l3-15" fill="#42798a" />
      <Path d="m71 51-1 6m-5-7-1 6m14-2q5 2 8-1" fill="none" strokeWidth={1.5} />
      {eye(79, 42, 3)}
    </G>;
    case 'Manta Ray': return <G {...edge}>
      <Path d="M49 55C43 69 60 75 51 88" fill="none" strokeWidth={2.7} />
      <Path d="M40 31C28 28 20 18 7 13c1 16 7 36 23 48l14-6q7 10 16 0l12 5C85 44 88 27 89 16 73 22 68 28 57 30l-3-9-7 4Z" fill="#354e68" />
      <Path d="M40 32C31 34 20 25 11 19q5 22 20 35l12-5q8 9 16 0l11 5q11-14 14-31C72 33 63 36 57 32Z" fill="#52778a" stroke="none" />
      <Path d="M41 30q-8-12-1-15l5 7 5-1 5-7q8 4-1 16" fill="#73939e" />
      <Path d="M39 43q10 9 20-1l-4 11q-5 5-11 0Z" fill="#e4e9db" stroke="none" />
      <Path d="M45 33q5 4 10-1" fill="none" strokeWidth={1.5} />
      {eye(39, 28, 2.4)}{eye(58, 27, 2.4)}
    </G>;
    case 'Spotted Eagle Ray': return <G {...edge}>
      <Path d="M49 54C51 68 36 78 44 88" fill="none" strokeWidth={2.4} />
      <Path d="M40 32 8 35q10 15 23 26l13-6q7 8 15 0l11 5q13-12 19-26L59 32l-3-11q-5-5-10 0Z" fill="#293f50" />
      <Path d="M41 33q-14 5-28 4l19 18 12-7q6 8 13 0l12 6 15-17q-13 4-25-4Z" fill="#425c68" stroke="none" />
      <G fill="#fff0d6" stroke="none">
        <Circle cx={26} cy={36} r={2.7}/><Circle cx={34} cy={44} r={2.6}/><Circle cx={38} cy={34} r={2.2}/>
        <Circle cx={67} cy={36} r={2.8}/><Circle cx={63} cy={45} r={2.6}/><Circle cx={76} cy={32} r={2.1}/>
      </G>
      <Path d="M44 24q5-4 11 0l2 10q-7 5-15 0Z" fill="#9aa798" stroke="none" />
      <Path d="M45 36q5 3 10-1" fill="none" strokeWidth={1.5} />
      {eye(42, 29, 2.3)}{eye(59, 29, 2.3)}
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
      <Path d="M27 42C25 28 28 13 37 10q9 0 13 13 11-4 15 13l4 8Z" fill="#5c67a1" />
      <Path d="m33 36 2-19m7 20-1-19m10 21-3-10m12 12-5-9" fill="none" stroke="#9ba8d6" strokeWidth={1.7} />
      <Path d="M29 44Q16 34 9 24q-1 16 9 25Q9 60 9 72l21-19M42 55l-9 15 21-11" fill="#52799a" />
      <Path d="M24 45c15-7 32-8 47-3l19-2-16 9q-19 13-49 4Z" fill="#4b93b5" />
      <Path d="M28 50q26 6 45-3c-12 11-31 13-45 3Z" fill="#e1e9da" stroke="none" />
      <Path d="M57 50 41 66l5-14M46 43l-1 4m8-5-1 5m8-4-1 4m14 3 5-3" fill="none" strokeWidth={1.5} />
      {eye(69, 44, 2.4)}
    </G>;
    case 'Flying Fish': return <G {...edge}>
      <Path d="M54 43C42 23 29 15 18 13q-1 17 12 30l16 5M52 52C37 72 23 77 15 75q1-15 16-25" fill="#abd9de" />
      <Path d="m47 42-22-22m20 30L23 68" fill="none" stroke="#609fae" strokeWidth={1.8} />
      <Path d="m30 43-17-9 3 14-6 19q14-5 20-15M49 37l7-12 13 14" fill="#73b3bd" />
      <Path d="M26 44c20-10 40-10 53-3l9 7q-13 15-35 10l-27-7Z" fill="#72bccb" />
      <Path d="M29 49q27 5 57-1c-12 12-33 14-57 2Z" fill="#e0efdf" stroke="none" />
      <Path d="M62 49C52 55 44 65 33 69q0-14 14-22Z" fill="#b4dfe0" />
      <Path d="m53 52-13 12m32-17-2 6m9-3 5-1" fill="none" strokeWidth={1.5} />
      {eye(77, 43, 2.7)}
    </G>;
    case 'Atlantic Bluefin Tuna': return <G {...edge}>
      <Path d="M29 44Q14 33 10 20q-4 19 7 28Q8 59 10 74q6-15 19-23M43 35l12-17 6 18M44 61l10 12 8-13" fill="#416a88" />
      <Path d="M25 44c20-13 41-15 55-3l9 9-12 10c-17 9-34 1-52-9Z" fill="#467b9c" />
      <Path d="M29 49q31 6 58 1c-13 17-36 16-58 0Z" fill="#c8dad5" stroke="none" />
      <Path d="M56 48Q45 56 39 65l19-11" fill="#2e526f" />
      <Path d="m37 38-3-5-3 7m-1 16 3 5 3-3m-9-16-3-3-2 5" fill="#e6bb52" strokeWidth={1.3} />
      <Path d="m70 43-2 9m11 1q4 1 6-2" fill="none" strokeWidth={1.5} />
      {eye(77, 44, 2.8)}
    </G>;
    case 'Rainbow Trout': return <G {...edge}>
      <Path d="m29 43-18-12 4 16-4 17 18-11M42 36l10-16 11 15M43 61l7 12 13-13m5-24 5-9 7 12" fill="#7d9c7e" />
      <Path d="M24 44c19-12 42-15 57-5l8 9-10 9c-16 11-36 5-55-5Z" fill="#aec2a4" />
      <Path d="M27 49q30 4 59-1C75 63 49 68 27 52Z" fill="#e4e6ce" stroke="none" />
      <Path d="M27 47q26-3 55-1l-2 7q-30-3-53-3Z" fill="#df94a0" stroke="none" />
      <G fill="#416653" stroke="none">
        <Circle cx={38} cy={40} r={2.1}/><Circle cx={49} cy={36} r={2.3}/><Circle cx={60} cy={39} r={2.2}/>
        <Circle cx={19} cy={40} r={1.8}/><Circle cx={52} cy={26} r={1.7}/><Circle cx={68} cy={35} r={1.8}/>
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
      <Path d="M29 46Q18 33 11 19q-4 19 6 30L9 64q12-2 20-12M43 39l15-17 6 17M41 58l-8 14 24-11" fill="#85989b" />
      <Path d="M25 45c15-9 34-11 48-6l17 11-17 5q-23 12-48-3Z" fill="#a6b4af" />
      <Path d="M29 50q23 7 59 0l-16 6q-23 9-43-4Z" fill="#e6e5d2" stroke="none" />
      <Path d="m33 42 5-5 5 4 6-5 6 4 6-4 6 5M35 51l5-3 5 4 6-3 6 3 6-3 6 3" fill="none" stroke="#f2edda" strokeWidth={3.2} />
      <Path d="M59 52q-5 11-17 12l6-12" fill="#7f9999" />
      <Path d="m74 53-2 6m7-7-1 6m-9-15-2 7m14 1 5-1" fill="none" strokeWidth={1.5} />
      {eye(73, 44, 2.5)}
    </G>;
    default: return null;
  }
}
