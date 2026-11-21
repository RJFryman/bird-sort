// Owns raptors, waterbirds, owl, toucan and peacock illustrations.
import React from 'react';
import { G, Path, Ellipse, Circle } from 'react-native-svg';
import type { BirdDef } from './roster';
import { BirdEye, BirdFeet, INK } from './BirdDetails';

// Each silhouette is drawn for the same 96px field: crown ≥ 5, toes ≤ 88.
const edge = { stroke: INK, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const Eye = ({ x, y, r = 3.2 }: { x: number; y: number; r?: number }) =>
  <G stroke="none"><BirdEye x={x} y={y} r={r} /></G>;

export function WildBirdArt({ bird }: { bird: BirdDef }) {
  switch (bird.name) {
    case 'Flamingo': return <G {...edge}>
      <Path d="M42 63v21l-7 2m19-23-1 10 8 5-5 7h-6" fill="none" stroke="#b64d77" strokeWidth={2.7} />
      <Path d="m24 47-13-5 7 17 20 6" fill="#d9578b" />
      <Path d="M27 43c-12 1-13 19 0 25 11 5 31 1 34-8l-6-8c-2-7-8-12-10-18-3-7 1-13 8-13 7 0 11 4 11 9 0 4-3 7-6 7l-1 9c9-2 16-10 15-19C71 12 55 9 44 16 29 26 40 41 42 45c-5-2-10-3-15-2Z" fill="#f29ab7" />
      <Path d="M24 49c11-4 25 0 30 9-7 10-23 9-30 0" fill="#e66e9e" />
      <Path d="m28 52 12 4m-9 1 10 4" fill="none" stroke="#be4c78" strokeWidth={1.5} />
      <Path d="M65 26c8-1 16 3 17 7l-7 12-8-4 4-8-6-1Z" fill="#ffe5d6" />
      <Path d="m77 31 5 2-7 12-5-3 5-9Z" fill="#30313b" />
      <Eye x={59} y={25} r={2.7} />
    </G>;
    case 'Kingfisher': return <G {...edge}>
      <BirdFeet x={40} y={76} color="#d26a3b" />
      <Path d="m29 61-14 14 17-3 9-11" fill="#126a91" />
      <Path d="M28 39c-9 11-9 26 1 35 10 9 30 5 36-6 5-9-2-23-6-26Z" fill="#ec9348" />
      <Path d="M27 41c-7-11 1-24 14-25l-4-5 11 4 8-2-1 5c9 2 15 9 15 18 0 9-7 16-16 16l-17-4Z" fill="#168cae" />
      <Path d="m65 29 25 10-26 4" fill="#384653" />
      <Path d="m68 36 18 3" fill="none" stroke="#769297" strokeWidth={1.4} />
      <Path d="M45 37c6 6 13 8 20 5-2 8-12 12-19 8l-8-5Z" fill="#fff5db" />
      <Path d="M29 44c11-2 22 8 23 20l-17 7c-11-5-15-19-6-27Z" fill="#137baf" />
      <Path d="M29 49q8 1 14 10m-15-3 12 9" fill="none" stroke="#55c9d2" strokeWidth={2.1} />
      <Path d="m35 22 8-2m5 1 5 1" fill="none" stroke="#70dae0" strokeWidth={2} />
      <Eye x={57} y={30} r={3.3} />
    </G>;
    case 'Owl': return <G {...edge}>
      <BirdFeet x={39} y={76} color="#c9984c" />
      <Path d="M24 45 20 13 35 22c9-5 19-5 28 0l14-9-3 32c8 20 2 35-25 35-25 0-33-16-25-35Z" fill="#8d7055" />
      <Path d="M25 46c-9 10-9 22 2 30l6-7m39-23c9 10 9 22-2 30l-6-7" fill="#6d5545" />
      <Path d="M33 49c-4 12-2 26 16 27 18-1 20-15 16-27" fill="#d7b88c" stroke="none" />
      <Path d="M48 29c-15-17-29 0-22 15 5 11 15 12 23 4 8 8 18 7 23-4 7-15-8-32-24-15Z" fill="#eee0bf" />
      <Path d="m30 23 12 4m14 0 12-4" fill="none" strokeWidth={2.5} />
      <Eye x={36} y={36} r={4.6} /><Eye x={61} y={36} r={4.6} />
      <Path d="m45 43 4 8 4-8-4-3Z" fill="#e4af52" />
      <Path d="m37 57 3 4 3-4m10 0 3 4 3-4M42 67l3 4 3-4m5 0 3 4 3-4" fill="none" stroke="#907151" strokeWidth={1.7} />
    </G>;
    case 'Toucan': return <G {...edge}>
      <BirdFeet x={38} y={76} color="#668b91" />
      <Path d="m27 61-12 19 18-3 7-15" fill="#263340" />
      <Path d="M24 44c-8 15-6 29 9 34 18 6 32-8 30-26l2-19c-3-13-22-16-31-7-4 4-6 10-5 16Z" fill="#263340" />
      <Path d="M43 33c8-3 17 1 20 8l-2 16c-1 9-8 16-16 13-10-5-8-15-8-21Z" fill="#fff0b6" />
      <Path d="M29 44c-12 8-8 24 6 28 7 2 11-3 11-7-11-4-10-17-17-21Z" fill="#394a59" />
      <Path d="M54 25c12-8 28-6 35 2l-1 14c-8 8-23 7-36-1Z" fill="#f7a837" />
      <Path d="M54 34c13-1 23 0 35 2l-1 5c-8 8-23 7-36-1Z" fill="#e98230" stroke="none" />
      <Path d="M81 23c4 1 7 2 8 4l-1 14-8 4c3-7 4-15 1-22Z" fill="#30333e" />
      <Path d="m56 36 26 2" fill="none" stroke="#bc6132" strokeWidth={1.4} />
      <Eye x={45} y={32} r={3.4} />
    </G>;
    case 'Peacock': return <G {...edge}>
      {/* The fanned train is an actual scalloped silhouette, behind the bird. */}
      <Path d="M45 72C27 78 10 67 9 56 3 48 6 38 13 34 6 23 14 14 24 16 25 5 37 4 43 12 50 3 61 7 63 16 74 11 83 20 80 30 90 33 92 45 85 51 89 64 72 77 55 74Z" fill="#438d60" />
      <Path d="M48 67 18 28m30 39-17-46m17 46 3-49m-3 49 20-42m-20 42 31-26M48 67 19 53m29 14 22-8" fill="none" stroke="#89b767" strokeWidth={2.5} />
      {[[18,29,-34],[31,20,-17],[51,18,3],[69,26,25],[80,42,48],[20,53,-60],[72,59,65]].map(([x,y,a]) =>
        <G key={`${x}`} transform={`rotate(${a} ${x} ${y})`} strokeWidth={1.4}>
          <Ellipse cx={x} cy={y} rx={6.4} ry={9.4} fill="#b8be57" />
          <Ellipse cx={x} cy={y-1} rx={4.2} ry={5.9} fill="#258f92" />
          <Ellipse cx={x} cy={y-1} rx={2.1} ry={3.2} fill="#244266" stroke="none" />
        </G>)}
      <BirdFeet x={42} y={76} color="#a78257" />
      <Path d="M35 63c1-10 8-14 13-15l5-14c-5-3-6-10-1-14 7-5 16-1 16 7 0 5-4 8-7 8l-1 21c7 3 9 9 5 16-7 12-31 9-30-9Z" fill="#1876a7" />
      <Path d="M37 61c-2 11 11 17 23 11-3-10-12-14-23-11Z" fill="#33847e" />
      <Path d="m42 64 10 5m-6-8 11 7" fill="none" stroke="#96b66a" strokeWidth={1.4} />
      <Path d="m66 26 9 4-9 3Z" fill="#d4c3a1" />
      <Path d="m56 17-3-7m7 7 1-8m2 10 5-6" fill="none" stroke="#246b9c" />
      <G fill="#279bb7"><Circle cx={52} cy={9} r={2.1}/><Circle cx={61} cy={8} r={2.1}/><Circle cx={69} cy={12} r={2.1}/></G>
      <Eye x={61} y={25} r={2.8} />
    </G>;
    case 'Eagle': return <G {...edge}>
      <BirdFeet x={42} y={76} color="#d8a33b" />
      <Path d="m27 60-13 19 22-1 9-13" fill="#eee9dc" />
      <Path d="M29 35c-13 10-16 29-6 39 11 11 37 8 43-6 5-10 0-26-8-30Z" fill="#6b503c" />
      <Path d="M28 39c-10 9-11 23-4 31 11 5 22 2 30-5L42 46Z" fill="#493e35" />
      <Path d="m26 49 13 13m-16-5 11 10m-5-24 15 14" fill="none" stroke="#8a6b4c" strokeWidth={1.8} />
      <Path d="M38 36c-5-13 0-24 13-25 13-2 22 7 21 18l-5 10-4 10-7-4-4 7-4-7-7 2Z" fill="#fbf4df" />
      <Path d="M68 25c11-2 19 3 19 10 0 5-4 7-8 8l1-8-12-1Z" fill="#edba43" />
      <Path d="m68 31 12 1" fill="none" stroke="#aa792e" strokeWidth={1.3} />
      <Eye x={59} y={25} r={3.6}/>
      <Path d="m53 18 11 3" fill="none" stroke="#c5bfae" strokeWidth={1.7} />
    </G>;
    case 'Hawk': return <G {...edge}>
      <BirdFeet x={42} y={76} color="#d5a13e" />
      <Path d="m30 61-13 17 18 2 11-17" fill="#b75f3d" />
      <Path d="m21 75 17 1m-12-8 14 2" fill="none" stroke="#6c4935" strokeWidth={2.3} />
      <Path d="M27 39c-12 12-12 30 0 38 13 8 33 1 37-11 3-9 0-19-6-24l5-5c9-10 4-24-9-26-12-2-23 10-20 22Z" fill="#a17c54" />
      <Path d="M49 35c10 3 16 15 15 28-1 13-15 19-24 14-6-5-8-16-5-26Z" fill="#f0dfb9" />
      <Path d="m48 49-2 7m9-2-2 7m-9 1-2 6m12-1-2 5" fill="none" stroke="#9e6845" strokeWidth={2.3} />
      <Path d="M29 40c-11 9-12 24-4 31 13 0 23-7 26-15-3-8-12-15-22-16Z" fill="#785b45" />
      <Path d="m29 47 13 10m-16-3 12 9m-13-3 7 6" fill="none" stroke="#b7976a" strokeWidth={1.7}/>
      <Path d="m63 26 16 4c2 4-1 8-5 10l-1-7-11-1Z" fill="#d6a344" />
      <Path d="m71 28 8 2c2 4-1 8-5 10l-1-7" fill="#414347" />
      <Path d="M40 24q9-8 20-2" fill="none" stroke="#e9d1a3" strokeWidth={3}/>
      <Eye x={55} y={27} r={3.2}/>
    </G>;
    case 'Falcon': return <G {...edge}>
      <BirdFeet x={43} y={76} color="#d1a338" />
      <Path d="m32 57-15 24 18-4 11-17" fill="#506376" />
      <Path d="M34 34c-12 9-14 27-5 39 9 11 28 7 34-6 3-8 1-18-3-25l5-7c8-11 2-23-10-24-13-1-21 9-21 23Z" fill="#647c90" />
      <Path d="M51 28c7 3 12 10 12 17 11 22-2 35-16 33-11-3-14-16-10-28Z" fill="#f1e6ce" />
      <Path d="m47 52 12 2m-15 5 15 2m-14 5 12 2m-9 4 7 1" fill="none" stroke="#8a7d6c" strokeWidth={1.6} />
      <Path d="M32 36c-15 12-13 30-11 40 19-9 26-20 28-29Z" fill="#43576d" />
      <Path d="m30 46-5 19m10-15-6 15" fill="none" stroke="#8da2b3" strokeWidth={1.6} />
      <Path d="M41 18c10-11 28-3 27 10l-8 3-1 18-8-5-1-16-12-1Z" fill="#354556" />
      <Path d="m66 27 12 4c1 4-1 6-5 8l-1-6-7-1Z" fill="#e3b746" />
      <Path d="m73 29 5 2c1 4-1 6-5 8l-1-6" fill="#39434b" />
      <Eye x={59} y={25} r={3}/>
    </G>;
    case 'Pelican': return <G {...edge}>
      <Path d="m36 74-1 9-10 3h18l-2-11m14-1 1 9-6 3h17l-5-5-1-8" fill="#d5a263" />
      <Path d="m24 50-15-5 7 20 19 6" fill="#d9e0df" />
      <Path d="M26 44c-14 3-16 23-2 31 14 9 38 3 41-11 1-8-6-15-12-19l5-12c6-5 8-15 1-20-8-6-21-2-22 9-1 6 2 11 5 14l-2 10Z" fill="#fbf6e7" />
      <Path d="M26 49c-12 7-7 22 7 24 10 2 18-2 22-8-7-9-17-15-29-16Z" fill="#d3dedf" />
      <Path d="m27 55 15 11m-16-4 11 7" fill="none" stroke="#9eafb4" strokeWidth={1.6}/>
      <Path d="M55 25h34c-1 12-14 23-28 26l-8-15Z" fill="#efc081" />
      <Path d="M55 25h34l-2 5-32 1Z" fill="#f4d18c" />
      <Path d="M60 35c8 0 15-2 21-4" fill="none" stroke="#cf9162" strokeWidth={1.4}/>
      <Eye x={49} y={23} r={3}/>
    </G>;
    case 'Penguin': return <G {...edge}>
      <Path d="m38 76-8 9c5 3 14 2 18-1l-1-8m10 0-3 8c6 4 15 3 20 0l-11-8" fill="#e9a13f" />
      <Path d="M31 40c-6-19 3-31 17-31 16 0 23 14 20 32 10 20 4 40-18 41-23 1-31-18-19-42Z" fill="#2c3b49" />
      <Path d="M39 38c-7 10-10 24-5 33 5 9 24 11 29 0 4-10 0-25-7-32Z" fill="#fbf7e7" />
      <Path d="M32 40c-11 3-14 13-16 28 7-2 14-10 18-20m30-6c9 5 12 16 13 25-6-1-10-7-13-12" fill="#405568" />
      <Path d="M51 29c-10 0-14 7-14 14l8 8 10-8Z" fill="#f3bd49" stroke="none" />
      <Path d="M55 21c8 2 10 8 7 15l-5 9-6-6 5-8Z" fill="#efa244" stroke="none" />
      <Path d="m64 26 15 6-15 5-4-5Z" fill="#e7a14c" />
      <Eye x={57} y={24} r={3.2}/>
    </G>;
    case 'Swan': return <G {...edge}>
      <Path d="m42 76-2 8-9 2h17m11-10-1 8-5 2h14" fill="none" stroke="#53616a" strokeWidth={2.5}/>
      <Path d="m26 49-15-8 4 19 13 10" fill="#e2e8e5" />
      <Path d="M27 48c-14 3-17 18-4 26 15 10 37 5 43-7 5-9-4-16-7-24-3-6-3-13 2-17 4-3 9-1 10 3l8-2c-1-11-12-18-22-12-14 7-13 20-6 31-9-1-17 0-24 2Z" fill="#fff9e9" />
      <Path d="M25 53c-10 8-1 20 14 18 9 0 16-5 18-11-9 3-10-3-16-7-4 5-9 4-16 0Z" fill="#e5ece8" />
      <Path d="m29 59 10 6m-2-9 10 5" fill="none" stroke="#b3c5c5" strokeWidth={1.5}/>
      <Path d="m70 27 17 6-12 8-6-9Z" fill="#ef9a4b" />
      <Path d="m70 26 6 3-3 8-4-5Z" fill="#303e47" />
      <Eye x={65} y={23} r={2.8}/>
    </G>;
    case 'Duck': return <G {...edge}>
      <Path d="m40 73-2 10-9 3h18l-2-11m14 0 1 8-6 3h17l-6-5-1-7" fill="#e2a043" />
      <Path d="m27 48-17-5 7 21 18 7" fill="#574e43" />
      <Path d="M25 43c-16 5-16 25 1 33 14 7 35 1 40-11 3-7-2-15-6-19l3-11-16-5-7 15Z" fill="#c6c7af" />
      <Path d="M45 40c2 6 13 4 17-1l1 11c-1 10-12 17-20 13-6-3-7-10-7-15Z" fill="#87513b" />
      <Path d="M43 37c-8-11-3-24 9-25 13-2 22 7 20 19-1 9-9 15-18 14Z" fill="#2f876b" />
      <Path d="M43 37c6 7 14 9 21 3l-1 6c-8 5-15 2-20-2Z" fill="#fbf1d6" stroke="none" />
      <Path d="M25 48c-12 5-10 18 1 22 12 5 25-1 29-9-10-9-18-14-30-13Z" fill="#9b9e8a" />
      <Path d="m27 57 17 1 7 5-19 2Z" fill="#4375b4" />
      <Path d="m27 56 16 1m-12 9 17-2" fill="none" stroke="#f7edd4" strokeWidth={2.2}/>
      <Path d="M68 27c10-1 18 2 20 5-1 5-12 7-21 4Z" fill="#e9bd4d" />
      <Path d="m72 32 11 1" fill="none" stroke="#ad863c" strokeWidth={1.2}/>
      <Eye x={60} y={25} r={3.1}/>
    </G>;
    case 'Seagull': return <G {...edge}>
      <Path d="m39 72-1 12-8 2h17m12-13 1 11-5 2h15" fill="none" stroke="#caa042" strokeWidth={2.5}/>
      <Path d="m27 46-17-7 5 24 23 8" fill="#f5f1df" />
      <Path d="M26 41c-16 6-17 24-3 33 14 9 37 4 42-9 3-7-1-14-6-19l4-7c11-3 15-15 8-23-9-10-27-4-28 8l-2 16Z" fill="#faf6e8" />
      <Path d="M25 45c-13 5-12 18-2 24 14 2 29-2 34-10-11-2-19-13-32-14Z" fill="#a3b3bf" />
      <Path d="M24 58c-7 1-8 5-4 10l-5 3c14 4 24-1 30-6-9 2-16-3-21-7Z" fill="#3d4b58" />
      <Path d="m24 65 5-1m3 4 5-2" fill="none" stroke="#fff6de" strokeWidth={2}/>
      <Path d="m69 25 19 6c1 4-9 6-19 4Z" fill="#ebbe4c" />
      <Path d="m78 32 3 1" fill="none" stroke="#d86d4a" strokeWidth={2.3}/>
      <Eye x={60} y={24} r={3.1}/>
    </G>;
    default: return null;
  }
}
