// Twelve field-guide songbirds, each drawn in its own right-facing silhouette.
import React from 'react';
import { G, Path } from 'react-native-svg';
import { BirdDef } from './roster';
import { BirdEye, BirdFeet, INK } from './BirdDetails';

const eye = (x: number, y: number, r = 3.6) => <G stroke="none"><BirdEye x={x} y={y} r={r} /></G>;
const feet = (x = 44, color = '#a17855') => <G stroke="none"><BirdFeet x={x} y={77} color={color} /></G>;

export function SongbirdArt({ bird }: { bird: BirdDef }) {
  let art: React.ReactNode;
  switch (bird.name) {
    case 'Cardinal':
      art = <>
        <Path d="M35 55 10 75 25 73 20 80 47 67Z" fill="#a72a35" />
        <Path d="m20 72 17-10" fill="none" stroke="#e96558" />
        {feet(46, '#a86248')}
        <Path d="M28 45Q34 39 44 38Q41 27 49 23L54 11 63 20Q72 21 75 31Q80 42 72 51Q74 67 60 75Q43 82 29 70Q19 59 28 45Z" fill="#dc423e" />
        <Path d="M60 47Q72 46 70 61Q67 74 54 75Q62 65 60 47Z" fill="#ef6650" stroke="none" />
        <Path d="M64 26Q74 25 77 35L73 45 65 49 59 42Q56 35 60 29Z" fill="#343440" stroke="none" />
        <Path d="M75 31 88 37 75 43Z" fill="#f7a03e" />
        <Path d="m77 37 8 0" fill="none" strokeWidth={1.3} />
        <Path d="M33 44Q49 41 57 54Q54 65 33 69Q39 63 35 58Q28 51 33 44Z" fill="#b52d3b" />
        <Path d="m35 50 12 5m-10 2 11 4" fill="none" stroke="#ea6b61" strokeWidth={1.6} />
        {eye(67, 33)}
      </>;
      break;
    case 'Bluebird':
      art = <>
        <Path d="m31 56-20 13 5 7 26-9Z" fill="#2863a9" />
        <Path d="m17 71 17-9" fill="none" stroke="#80b8ee" />
        {feet(45)}
        <Path d="M26 46Q31 41 42 39Q42 25 54 21Q67 17 73 29Q77 36 71 44Q79 56 68 69Q56 81 38 75Q21 69 22 56Q22 50 26 46Z" fill="#3f8cdb" />
        <Path d="M65 43Q76 47 71 61Q63 76 47 76Q36 76 32 66Q52 64 50 45Z" fill="#df8c4d" stroke="none" />
        <Path d="M45 69Q58 75 68 65Q62 78 48 77L38 73Z" fill="#fff4dd" stroke="none" />
        <Path d="m73 31 13 5-14 5Z" fill="#4c5660" />
        <Path d="M30 44Q44 39 54 50Q55 60 30 70Q23 61 26 51Q27 46 30 44Z" fill="#2564ac" />
        <Path d="M32 49q9-3 15 4m-12 3 10 3m-12 5 8-3" fill="none" stroke="#83bdf0" strokeWidth={1.7} />
        {eye(64, 31)}
      </>;
      break;
    case 'Canary':
      art = <>
        <Path d="m34 58-16 9 5 9 23-11Z" fill="#d9b43d" />
        {feet(45, '#bc8a5e')}
        <Path d="M29 47Q34 41 45 41Q43 27 55 22Q69 17 75 29Q79 37 72 45Q77 60 65 72Q52 82 38 74Q24 69 25 57Q25 51 29 47Z" fill="#f4d64d" />
        <Path d="M60 47Q71 47 69 61Q65 73 53 75Q60 63 56 53Z" fill="#fff0a1" stroke="none" />
        <Path d="m75 29 10 4-10 6Z" fill="#e6a26a" />
        <Path d="M32 46Q44 44 52 53Q50 62 35 68Q27 63 29 53Q29 48 32 46Z" fill="#e6bd3c" />
        <Path d="m34 51 10 4m-8 4 8 2" fill="none" stroke="#fff0a1" strokeWidth={1.7} />
        <Path d="M50 28q5-5 11-4" fill="none" stroke="#fff0a1" />
        {eye(65, 30, 3.4)}
      </>;
      break;
    case 'Crow':
      art = <>
        <Path d="M34 53 7 69 13 76 40 67Z" fill="#303642" />
        <Path d="m14 70 16-9" fill="none" stroke="#646c7c" />
        {feet(47, '#535963')}
        <Path d="M23 46Q31 37 43 38Q40 27 51 21Q64 15 73 25L76 40Q82 53 72 66Q61 78 42 76Q23 74 20 61Q18 53 23 46Z" fill="#343c49" />
        <Path d="M73 27Q83 26 90 37L76 40 71 34Z" fill="#454b56" />
        <Path d="m77 36 10 1" fill="none" strokeWidth={1.4} />
        <Path d="M61 44Q78 46 72 62Q67 72 56 75L62 61Z" fill="#45515e" stroke="none" />
        <Path d="M28 43Q45 38 58 50Q59 62 29 70Q38 61 31 57Q23 51 28 43Z" fill="#262d39" />
        <Path d="M31 48Q40 45 49 52M35 56l13 3m-16 6 12-4" fill="none" stroke="#657185" strokeWidth={1.7} />
        <Path d="m46 38 4 5 4-2 3 6" fill="none" stroke="#657185" strokeWidth={1.5} />
        <Path d="M48 27q7-5 14-3" fill="none" stroke="#717b8a" strokeWidth={2.1} />
        {eye(65, 31, 3.5)}
      </>;
      break;
    case 'Robin':
      art = <>
        <Path d="m33 55-23 10 4 9 29-8Z" fill="#615b55" />
        {feet(46, '#8c6550')}
        <Path d="M26 46Q31 40 43 38Q42 24 54 20Q66 17 72 29Q76 37 70 45Q79 56 68 71Q56 82 39 76Q22 70 22 57Q22 51 26 46Z" fill="#777269" />
        <Path d="M58 40Q72 42 75 54Q79 70 61 77Q43 84 33 69Q43 66 45 54Q45 44 58 40Z" fill="#e57b42" stroke="none" />
        <Path d="M45 72q12 8 22-4-6 13-21 8Z" fill="#fff1d7" stroke="none" />
        <Path d="m72 31 13 4-13 5Z" fill="#e7b74d" />
        <Path d="M30 44Q44 41 52 51Q54 62 29 70Q24 62 27 51Q27 46 30 44Z" fill="#5c605e" />
        <Path d="M32 50q8-1 13 5m-11 3 9 3" fill="none" stroke="#a7a79a" strokeWidth={1.6} />
        <Path d="m56 41 4 3 6-2" fill="none" stroke="#fff0d7" strokeWidth={2.1} />
        {eye(63, 31)}
      </>;
      break;
    case 'Sparrow':
      art = <>
        <Path d="m34 57-19 11 4 9 24-12Z" fill="#80654c" />
        <Path d="m20 71 14-8" fill="none" stroke="#c2a579" />
        {feet(45)}
        <Path d="M29 46Q35 41 44 41Q44 28 55 24Q69 20 74 33Q77 42 69 48Q79 59 67 72Q54 81 38 75Q21 70 24 57Q24 51 29 46Z" fill="#b19770" />
        <Path d="M55 43Q67 43 70 54Q74 67 60 74Q46 81 36 69L48 53Z" fill="#e7d8b5" stroke="none" />
        <Path d="M46 31Q53 21 63 24Q69 25 72 31L62 30 54 34Z" fill="#81513a" stroke="none" />
        <Path d="M49 34Q62 27 73 33L73 37Q61 32 51 39Z" fill="#fff0ce" stroke="none" />
        <Path d="M49 39Q56 34 62 37L63 43 54 46Z" fill="#6b4c37" stroke="none" />
        <Path d="m61 45 9-4-3 12-8-2Z" fill="#49413a" stroke="none" />
        <Path d="m74 34 11 5-12 5Z" fill="#bd9971" />
        <Path d="M31 45Q44 43 52 54Q52 63 31 70Q25 61 28 51Q29 47 31 45Z" fill="#8e6848" />
        <Path d="m33 49 10 4m-8 3 10 4m-9 5 8-2" fill="none" stroke="#edcca1" strokeWidth={2.1} />
        <Path d="m49 60 1 3m6-6 1 4m-7 7 1 2" fill="none" stroke="#a68a63" strokeWidth={1.5} />
        {eye(65, 36, 3.25)}
      </>;
      break;
    case 'Dove':
      art = <>
        <Path d="M35 58 12 73 17 79 44 69Z" fill="#b0b2b9" />
        <Path d="m18 73 17-9" fill="none" stroke="#e1e0df" />
        {feet(46, '#b77a83')}
        <Path d="M24 45Q35 36 49 40Q49 27 59 25Q70 21 75 31Q78 38 71 45Q81 55 72 68Q62 80 42 77Q21 75 19 60Q18 51 24 45Z" fill="#d6d5d6" />
        <Path d="M60 42Q74 46 74 57Q77 72 57 77Q41 80 33 71Q60 69 60 42Z" fill="#eee9e4" stroke="none" />
        <Path d="m75 33 10 4-11 3Z" fill="#717580" />
        <Path d="M28 45Q44 41 55 53Q53 67 28 69Q35 62 29 57Q24 50 28 45Z" fill="#b8bac2" />
        <Path d="m31 50 12 5m-10 2 11 5" fill="none" stroke="#e5e3e1" strokeWidth={2} />
        <Path d="M58 44q4 6 10 4m-11 0q4 6 10 4" fill="none" stroke="#9eafb1" strokeWidth={2} />
        <Path d="m38 55 2 1m5 2 2 1m-9 4 2 1" fill="none" stroke="#777c89" strokeWidth={2.4} />
        {eye(66, 33, 3.4)}
      </>;
      break;
    case 'Oriole':
      art = <>
        <Path d="m33 53-21 18 6 7 26-16Z" fill="#303643" />
        <Path d="m19 71 13-12" fill="none" stroke="#f5ae4a" />
        {feet(46, '#757276')}
        <Path d="M28 43Q35 37 44 37Q44 24 55 20Q68 17 73 29Q77 38 71 45Q79 55 69 69Q57 82 39 76Q23 70 23 56Q23 48 28 43Z" fill="#f99a37" />
        <Path d="M44 37Q44 24 55 20Q68 17 73 29Q77 38 71 45L64 54Q53 50 48 44Z" fill="#2e3542" stroke="none" />
        <Path d="M62 56Q74 53 72 63Q67 75 52 76L59 67Z" fill="#ffc35c" stroke="none" />
        <Path d="m73 30 14 5-14 5Z" fill="#818895" />
        <Path d="M31 41Q47 39 55 52Q53 64 30 69Q36 61 30 56Q26 48 31 41Z" fill="#303745" />
        <Path d="m32 47 14 4m-12 3 12 4" fill="none" stroke="#f6eed8" strokeWidth={2.4} />
        <Path d="m37 62 11-2" fill="none" stroke="#667080" strokeWidth={1.5} />
        {eye(65, 31, 3.5)}
      </>;
      break;
    case 'Goldfinch':
      art = <>
        <Path d="m34 56-20 13 6 8 25-14Z" fill="#333945" />
        <Path d="m20 71 13-8" fill="none" stroke="#fff5d8" />
        {feet(45, '#b28362')}
        <Path d="M29 45Q35 40 45 40Q44 27 55 23Q68 19 73 32Q76 40 69 47Q77 60 66 72Q53 81 38 75Q24 69 24 56Q24 49 29 45Z" fill="#f4d242" />
        <Path d="M56 46Q69 45 70 56Q72 69 58 75L49 76Q60 63 56 46Z" fill="#ffe784" stroke="none" />
        <Path d="M47 29Q51 22 59 22Q68 22 72 30L61 30 55 34 48 34Z" fill="#343944" stroke="none" />
        <Path d="m73 33 11 5-12 5Z" fill="#e5ad75" />
        <Path d="M32 43Q46 42 54 53Q54 63 31 69Q25 59 29 49Q29 45 32 43Z" fill="#343b47" />
        <Path d="m33 49 14 4m-11 4 11 3" fill="none" stroke="#fff4d6" strokeWidth={2.6} />
        <Path d="m37 64 9-2" fill="none" stroke="#8b98a1" strokeWidth={1.5} />
        {eye(64, 34, 3.35)}
      </>;
      break;
    case 'Bluejay':
      art = <>
        <Path d="M35 55 10 72 17 80 45 65Z" fill="#397fc6" />
        <Path d="m17 71 8 4m-3-8 9 4" fill="none" stroke="#263544" strokeWidth={2.4} />
        {feet(46, '#777581')}
        <Path d="M27 45Q34 39 44 38Q43 30 50 26L48 14 61 21 64 16 70 27Q78 31 73 44Q81 56 69 70Q57 81 39 75Q22 69 22 57Q22 49 27 45Z" fill="#5caae5" />
        <Path d="M58 40Q73 42 74 55Q75 70 58 76Q45 79 35 69L48 53Z" fill="#f4f0e5" stroke="none" />
        <Path d="M54 30Q65 25 73 32L72 43 63 47 54 42Z" fill="#fff6e9" stroke="none" />
        <Path d="m55 32 8 3 10-2m-17 9 4 6 11-4m-20-2q-1 10 11 13" fill="none" stroke="#303948" strokeWidth={3} />
        <Path d="m74 32 14 5-15 4Z" fill="#4f5866" />
        <Path d="M30 43Q46 39 56 52Q53 65 30 70Q36 61 30 57Q25 50 30 43Z" fill="#3981c4" />
        <Path d="m31 48 17 5m-15 2 14 5m-11 2 9 2" fill="none" stroke="#263544" strokeWidth={3.1} />
        <Path d="m32 47 16 5m-13 4 11 4" fill="none" stroke="#edf6f7" strokeWidth={1.8} />
        {eye(65, 34, 3.4)}
      </>;
      break;
    case 'Hummingbird':
      art = <>
        <Path d="M38 51Q17 33 16 13Q31 20 46 43Z" fill="#91c5b5" />
        <Path d="m21 23 19 23" fill="none" stroke="#d1e6d8" />
        <Path d="M37 58 16 76 19 81 43 65Z" fill="#275b60" />
        <Path d="m21 75 14-12" fill="none" stroke="#75ba9d" />
        <Path d="M35 45Q39 38 49 40Q49 30 58 29Q68 28 70 37Q72 43 65 48Q70 59 60 68Q47 76 36 67Q27 59 35 45Z" fill="#3ba58b" />
        <Path d="M60 45Q67 49 65 58Q60 69 48 70L44 63Q57 59 60 45Z" fill="#ecede0" stroke="none" />
        <Path d="m62 44 6 2-5 13-8-4 1-8Z" fill="#c94161" stroke="none" />
        <Path d="m59 48 3 2-2 5" fill="none" stroke="#f18491" strokeWidth={1.6} />
        <Path d="m70 37 20-1-20 4Z" fill="#45505b" strokeWidth={1.5} />
        <Path d="M43 49Q21 46 10 26Q28 27 51 45Q55 51 49 55Z" fill="#63b79f" />
        <Path d="M17 31q14 7 27 18m-20-9 19 12" fill="none" stroke="#b4d7c6" strokeWidth={1.6} />
        <Path d="m47 70 3 6-4 2m9-10 2 6-4 2" fill="none" stroke="#756f68" strokeWidth={2} />
        {eye(62, 37, 3.15)}
      </>;
      break;
    case 'Woodpecker':
      art = <>
        <Path d="m36 51-7 32 10-4 10-20Z" fill="#303844" />
        <Path d="m35 74 5-13" fill="none" stroke="#8a929a" />
        {feet(48, '#777780')}
        <Path d="M33 43Q39 38 48 37Q46 26 54 20Q65 15 73 25Q79 32 73 41Q79 50 72 65Q64 80 48 77Q33 75 29 64Q25 53 33 43Z" fill="#333b47" />
        <Path d="M59 40Q73 38 75 50Q78 62 65 74Q58 79 48 76Q58 68 55 55Z" fill="#f5f1e6" stroke="none" />
        <Path d="M51 25Q52 17 63 17Q71 18 74 25L64 25 56 29Z" fill="#dc4651" />
        <Path d="M54 30Q64 25 74 30L75 35 63 35 59 43 52 43Z" fill="#fff5e6" stroke="none" />
        <Path d="m57 42 10-4 5 3-10 7Z" fill="#fff5e6" stroke="none" />
        <Path d="m75 28 14 4-1 5-14 1Z" fill="#a5a7a0" />
        <Path d="m77 33 10 1" fill="none" strokeWidth={1.3} />
        <Path d="M35 42Q49 39 57 51Q54 66 34 73Q37 63 32 57Q29 49 35 42Z" fill="#2c3441" />
        <Path d="m36 47 10 3m-11 4 13 3m-12 4 10 2m-9 4 6 1" fill="none" stroke="#f5f0e4" strokeWidth={2.5} />
        {eye(66, 31, 3.4)}
      </>;
      break;
    default:
      return null;
  }
  return <G stroke={INK} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">{art}</G>;
}
