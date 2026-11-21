// Owns the parrot and cockatoo species illustrations.
import React from 'react';
import { G, Path, Ellipse, Circle } from 'react-native-svg';
import { BirdDef } from './roster';
import { BirdEye, BirdFeet, INK } from './BirdDetails';

// Flat, layered field-guide illustrations. Shapes are intentionally drawn per
// silhouette family: a kakapo's ground-dwelling build is not a shortened macaw.
const paper = '#fff6df';
function P({ d, fill, stroke = INK, w = 1.8 }: { d: string; fill: string; stroke?: string; w?: number }) {
  return <Path d={d} fill={fill} stroke={stroke} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
}
function Lines({ d, color = INK, w = 1.4 }: { d: string; color?: string; w?: number }) {
  return <Path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
}
function Hook({ x = 73, y = 29, color = '#434957', small = false }: { x?: number; y?: number; color?: string; small?: boolean }) {
  return <G transform={`translate(${x} ${y}) scale(${small ? .76 : 1})`}>
    <P d="M-1-6C9-8 16-1 14 6Q13 12 7 14Q10 5 2 4L-1 0Z" fill={color} />
    <P d="M1 4Q8 4 9 8Q4 11 0 7Z" fill="#777a7e" w={1.5} />
    <Lines d="M3-3Q9-3 11 1" color="#ffffff" w={1.4} />
    <Circle cx={3} cy={-1} r={1} fill={INK} />
  </G>;
}

type MacawColors = { body: string; breast: string; wing: string; flights: string; tail: string; head?: string };
const macaws: Record<string, MacawColors> = {
  Macaw: { body: '#48ad62', breast: '#a1cd58', wing: '#218b69', flights: '#167d9c', tail: '#23788e', head: '#69bc69' },
  'Scarlet Macaw': { body: '#eb4c3b', breast: '#f36c43', wing: '#f5cc42', flights: '#2d86c3', tail: '#b92f3e' },
  'Blue Macaw': { body: '#52a9df', breast: '#b9e3ee', wing: '#287dc4', flights: '#284d91', tail: '#3466a8', head: '#76c9e2' },
  'Blue-and-Gold Macaw': { body: '#238dbc', breast: '#f8bc3c', wing: '#236db0', flights: '#284d87', tail: '#286e98' },
  'Green-winged Macaw': { body: '#c83d43', breast: '#de5650', wing: '#4b9c61', flights: '#397caa', tail: '#a83c52' },
  'Military Macaw': { body: '#76964c', breast: '#a4b764', wing: '#537c4d', flights: '#398899', tail: '#527e87' },
  'Hyacinth Macaw': { body: '#5062be', breast: '#6579d0', wing: '#3e4c9f', flights: '#354786', tail: '#3f4b98' },
  'Blue-throated Macaw': { body: '#32a4c3', breast: '#f9ca51', wing: '#348bab', flights: '#326c9c', tail: '#2f87a7' },
  "Hahn's Macaw": { body: '#50aa65', breast: '#83bd75', wing: '#38885e', flights: '#34817e', tail: '#30745b', head: '#45878e' },
};

function Macaw({ name }: { name: string }) {
  const c = macaws[name], hyacinth = name === 'Hyacinth Macaw', hahn = name === "Hahn's Macaw";
  const blueGold = name === 'Blue-and-Gold Macaw', throat = name === 'Blue-throated Macaw';
  return <G>
    <P d={hahn ? 'M34 62L19 84Q30 82 43 67Z' : 'M35 54Q24 69 16 87Q29 84 43 64Z'} fill={c.tail} />
    <P d={hahn ? 'M39 65L29 86L48 68Z' : 'M42 54L28 88Q42 81 49 61Z'} fill={c.flights} />
    <Lines d="M35 67L24 82M42 69L35 82" color="#b5d3dc" w={1} />
    <BirdFeet x={43} y={77} color="#7b7d83" />
    <P d={hahn ? 'M34 39C23 45 25 67 36 75C49 84 66 73 68 55L68 38Z' : 'M39 32C25 39 23 62 35 74C49 86 67 71 69 52L69 34Z'} fill={c.body} />
    <P d="M51 40C43 46 45 70 51 75Q66 71 67 55L65 38Z" fill={c.breast} stroke={c.breast} w={0} />
    <P d="M35 41C23 48 28 68 34 73Q48 68 52 54Q47 39 35 41Z" fill={c.flights} />
    <P d="M34 40Q24 44 29 59Q38 64 49 54Q49 42 34 40Z" fill={c.wing} />
    <Lines d="M32 54Q36 58 42 56M33 61Q39 64 44 60M34 68L42 65" color="#c5e0bb" w={1.1} />
    {(hahn || name === 'Macaw') && <P d="M32 40Q40 38 45 44L40 49L31 47Z" fill={hahn ? '#e65a46' : '#eac14a'} w={1.2} />}
    <P d={hahn ? 'M46 42C35 36 37 21 48 18C61 13 74 23 74 35Q72 47 59 48Z' : 'M46 42C34 36 36 19 48 15C63 10 78 20 77 34Q75 49 61 48Z'} fill={c.head ?? c.body} />
    {blueGold && <P d="M38 29Q36 15 52 14Q68 11 75 25L65 28Q50 20 38 29Z" fill="#49934c" w={0} />}
    {name === 'Military Macaw' && <P d="M62 16Q71 17 75 25L63 25L58 20Z" fill="#cf4d41" w={1.1} />}
    {blueGold && <P d="M55 35L74 35Q73 56 61 58L51 45Z" fill="#263c4e" w={0} />}
    {throat && <P d="M53 35L74 35Q72 66 57 64L49 47Z" fill="#247eab" w={0} />}
    {!hyacinth && <>
      <P d={hahn ? 'M59 23Q71 20 74 29L71 38Q62 43 56 35Z' : 'M58 21Q71 18 76 28L72 39Q61 45 54 35Z'} fill={paper} w={1.25} />
      <Lines d={name === 'Green-winged Macaw' ? 'M57 31L61 32M58 35L66 37M62 39L69 40' : 'M56 31L60 32M58 35L65 37M63 39L69 40'} color={name === 'Green-winged Macaw' ? '#ba4e4c' : '#566976'} w={1.1} />
    </>}
    {hyacinth && <P d="M69 29Q75 27 77 31L75 39L68 40Q73 35 69 29Z" fill="#efca4d" w={1.1} />}
    <Hook x={hahn ? 72 : 75} y={29} color={name === 'Scarlet Macaw' || name === 'Green-winged Macaw' ? '#edd6ad' : '#3e4653'} small={hahn} />
    {hyacinth && <Circle cx={64} cy={28} r={6.2} fill="#f4ce48" />}
    <BirdEye x={hahn ? 64 : 65} y={28} r={hyacinth ? 3.6 : 3.7} />
    <Lines d="M45 23Q48 18 54 18" color={hyacinth ? '#8d9ee5' : '#fff3d6'} w={1.7} />
  </G>;
}

function Cockatoo({ name }: { name: string }) {
  const tiel = name === 'Cockatiel', galah = name === 'Galah';
  const body = tiel ? '#9ba5af' : galah ? '#e99aaf' : '#f7f4e9';
  const wing = tiel ? '#778594' : galah ? '#99a3af' : '#dddcd4';
  return <G>
    <P d={tiel ? 'M32 59L19 88L40 76L47 61Z' : 'M34 63L25 82Q33 88 45 76L48 64Z'} fill={wing} />
    <Lines d={tiel ? 'M34 70L25 82M38 73L32 81' : 'M34 74L32 80M39 74L37 80'} color="#f0eee3" />
    <BirdFeet x={43} y={77} color="#7c8186" />
    <P d="M39 33C22 38 24 66 36 76C49 85 68 72 69 54L66 36Z" fill={body} />
    <P d="M35 41C24 46 29 68 35 73Q49 67 52 53Q47 40 35 41Z" fill={wing} />
    <P d={tiel ? 'M35 45Q31 50 34 63L43 60L47 50Z' : 'M34 44Q28 51 34 65Q42 63 46 55Q42 44 34 44Z'} fill={tiel ? '#fff6e9' : galah ? '#bec6cf' : '#fffbf0'} w={0} />
    <Lines d="M35 66L43 62M35 70L41 67" color={galah || tiel ? '#596c7c' : '#9da5a5'} />
    {galah ? <P d="M39 27Q32 15 42 12Q46 8 51 12Q57 9 62 16L65 25Z" fill="#f8d5dd" /> : tiel ?
      <P d="M45 27Q30 16 33 6Q40 15 45 17Q39 7 45 6L54 20Q53 9 59 9L60 26Z" fill="#f7d463" /> :
      <P d="M44 26Q25 15 30 8Q38 16 43 16Q33 6 39 6L53 17Q46 5 53 7Q61 14 63 24Z" fill="#f3cf4d" />}
    <P d="M47 43C34 37 35 22 46 18C59 12 74 21 74 33Q73 48 58 48Z" fill={tiel ? '#f6da75' : galah ? '#f1b4c2' : '#fffaf0'} />
    {galah && <P d="M38 27Q38 17 50 16Q61 14 68 22Q56 19 48 26Z" fill="#f7d3db" w={0} />}
    {tiel && <Circle cx={59} cy={38} r={5.9} fill="#ed9343" />}
    <Hook x={71} y={31} color={galah ? '#d8c2ae' : '#596674'} small />
    <BirdEye x={63} y={28} r={3.8} />
    {!tiel && <Lines d="M45 29Q43 24 49 21" color="#fffdf5" w={1.9} />}
  </G>;
}

function Kakapo() {
  return <G>
    <P d="M27 62L16 76L34 79L46 69Z" fill="#647943" />
    <BirdFeet x={42} y={77} color="#9e9876" />
    <P d="M29 35C9 42 14 70 31 78C50 86 76 77 76 58Q76 36 54 33Z" fill="#9eaa60" />
    <P d="M29 40C14 41 16 63 28 71Q40 68 49 54Q44 40 29 40Z" fill="#6e8749" />
    <Lines d="M26 48l4 3 4-2M25 56l5 3 5-2M29 63l5 2 4-3M40 44l2 3M43 57l2 3" color="#c4cc7f" w={2} />
    <P d="M37 44C25 31 33 16 49 15C68 12 82 27 75 44Q68 58 50 54Z" fill="#a7b56a" />
    <P d="M51 21Q65 17 72 28L74 40Q67 51 55 47Q46 45 43 36Q43 25 51 21Z" fill="#e8dfb6" w={1.3} />
    <P d="M68 31Q79 29 83 35Q81 42 74 43L75 36L68 35Z" fill="#d8c6a0" w={1.6} />
    <BirdEye x={63} y={30} r={4.1} />
    <Lines d="M48 26l3-2M46 33l3-1M48 40l3 1M54 45l2 1M57 20l2 1M40 22l2 2M37 29l2 2M53 60l1 3M60 65l1 3M47 68l1 3M61 55l1 3" color="#596b40" w={1.6} />
    <Lines d="M70 38l-5 1M70 41l-5 2" color="#9a906d" w={1} />
  </G>;
}

function Kea() {
  return <G>
    <P d="M33 57L13 81Q24 85 45 67Z" fill="#677349" />
    <Lines d="M30 70L20 79M36 71L29 79" color="#b8b887" />
    <BirdFeet x={44} y={77} color="#737575" />
    <P d="M34 34C20 43 25 68 38 76Q60 84 69 63L69 39Z" fill="#8b955c" />
    <P d="M33 41Q22 49 30 66L45 63L50 49Z" fill="#b96c43" />
    <P d="M33 38C21 43 27 62 35 69Q47 62 53 50Q45 36 33 38Z" fill="#667c4b" />
    <Lines d="M31 45l5 3 5-2M30 52l6 3 6-3M33 59l5 2 6-3M38 65l5-3" color="#b6bb7b" w={1.8} />
    <P d="M45 44C32 36 37 19 50 17Q70 14 75 33L70 48L58 51Z" fill="#a3a36c" />
    <P d="M72 27C87 29 89 42 80 51Q82 39 73 37L68 34Z" fill="#687176" />
    <Lines d="M77 31Q84 36 82 42" color="#bac0b6" />
    <BirdEye x={63} y={29} r={3.5} />
    <Lines d="M47 23l3 2M43 30l3 2M45 37l3 2M51 43l3 2M57 48l3 2M58 20l2 2M60 56l2 2M57 63l2 2M52 70l2 2" color="#697449" w={1.6} />
  </G>;
}

function Budgie() {
  return <G>
    <P d="M37 59L18 88Q32 85 46 64Z" fill="#247f84" />
    <P d="M40 63L29 88L50 66Z" fill="#5f9a85" />
    <BirdFeet x={43} y={77} color="#a48b87" />
    <P d="M36 36C23 44 26 68 39 76Q58 83 68 60L67 38Z" fill="#9bca55" />
    <P d="M50 42Q42 57 50 74Q65 70 66 54Z" fill="#b5db63" w={0} />
    <P d="M34 40Q21 46 31 69Q43 66 51 52Q44 38 34 40Z" fill="#d1d995" />
    <Lines d="M30 45l5 3 7-1M28 50l7 3 8-2M29 56l7 3 9-3M31 62l6 2 6-2" color="#3b6650" w={2.1} />
    <P d="M46 45C33 37 36 19 49 16Q70 11 76 31Q78 46 62 49Z" fill="#f1df6c" />
    <Lines d="M41 25l6 2M40 31l6 2M42 37l6 2M45 21l5 2" color="#597c47" w={1.8} />
    <P d="M71 31Q80 30 81 35Q79 42 74 42L75 36L70 36Z" fill="#d6ae73" w={1.5} />
    <Ellipse cx={73} cy={31} rx={4} ry={2.3} fill="#5f8dba" />
    <P d="M57 37L64 36L61 42L56 41Z" fill="#4268b2" w={0} />
    <Circle cx={54} cy={45} r={1.7} fill={INK} /><Circle cx={61} cy={46} r={1.7} fill={INK} />
    <BirdEye x={63} y={28} r={3.6} />
  </G>;
}

function Lovebird() {
  return <G>
    <P d="M30 63L22 77Q31 83 42 75L43 66Z" fill="#3d9891" />
    <BirdFeet x={43} y={77} color="#b2948c" />
    <P d="M35 35C19 43 23 68 37 76C53 85 72 71 71 51L62 35Z" fill="#79bc6b" />
    <P d="M34 43C22 47 27 66 35 71Q49 66 52 53Q46 40 34 43Z" fill="#3c966b" />
    <Lines d="M32 53Q38 58 46 54M34 61L42 60M35 67L40 65" color="#9ccb85" />
    <P d="M44 44C31 36 36 18 51 16Q73 13 77 33Q77 49 61 52Z" fill="#f09b7f" />
    <P d="M48 21Q63 16 73 27L71 35Q62 30 50 35Q42 31 48 21Z" fill="#f5b18b" w={0} />
    <P d="M53 46Q65 48 70 40Q69 56 59 59L49 50Z" fill="#efc77c" w={0} />
    <Hook x={73} y={31} color="#ead7b3" small />
    <BirdEye x={65} y={29} r={3.9} />
  </G>;
}

const smallParrots: Record<string, { body: string; wing: string; head: string; breast: string; tail: string }> = {
  Parrot: { body: '#6652b4', wing: '#40367e', head: '#7e65c8', breast: '#69b8d1', tail: '#484b94' },
  'Purple Parrot': { body: '#9b67bd', wing: '#754795', head: '#9b67bd', breast: '#d2a1e3', tail: '#7650a5' },
  'African Grey': { body: '#a4afb5', wing: '#7d8c98', head: '#bac4c8', breast: '#cbd1cc', tail: '#d44c47' },
  Rosella: { body: '#e45145', wing: '#789954', head: '#ed5b4b', breast: '#f4d36a', tail: '#3f84a6' },
  Amazon: { body: '#66b56b', wing: '#37885b', head: '#71b96a', breast: '#96c677', tail: '#35846a' },
  Parakeet: { body: '#7abc73', wing: '#3a9b78', head: '#83c677', breast: '#a5ce7a', tail: '#428f9b' },
  'King Parrot': { body: '#e5624b', wing: '#348e68', head: '#e6604d', breast: '#e9694d', tail: '#346976' },
  'Sun Conure': { body: '#f4c84b', wing: '#91ad4b', head: '#f8ce51', breast: '#f39840', tail: '#3c9292' },
  'Rainbow Lorikeet': { body: '#58aa63', wing: '#388756', head: '#526cb5', breast: '#ed9250', tail: '#428768' },
  Eclectus: { body: '#51ad70', wing: '#278560', head: '#6bbd72', breast: '#87c879', tail: '#377b6f' },
  'Eclectus Female': { body: '#ca5360', wing: '#aa3f58', head: '#db5e66', breast: '#8162a3', tail: '#993c58' },
};

function SmallParrot({ name }: { name: string }) {
  const c = smallParrots[name], grey = name === 'African Grey', rosella = name === 'Rosella';
  const lorikeet = name === 'Rainbow Lorikeet', female = name === 'Eclectus Female';
  const purple = name === 'Purple Parrot';
  const short = grey || name.startsWith('Eclectus') || name === 'Amazon' || purple;
  const eclectus = name.startsWith('Eclectus'), ringneck = name === 'Parakeet';
  const bodyShape = purple ? 'M31 38C14 43 18 70 35 78Q61 87 75 64L70 40Z'
    : eclectus ? 'M43 33C30 43 29 68 43 77Q60 81 68 61L66 34Z'
    : name === 'Amazon' ? 'M30 30C17 39 21 69 35 78Q60 86 74 61L72 32Z'
    : ringneck || lorikeet ? 'M38 34C28 42 26 62 36 73Q52 81 63 62L68 36Z'
    : short ? 'M35 34C21 43 26 68 39 76Q58 84 69 63L68 38Z'
    : 'M35 34C22 43 26 65 38 74Q58 82 68 60L67 37Z';
  const headShape = purple ? 'M39 47C22 39 26 20 45 16C65 10 83 24 78 41Q73 57 54 54Z'
    : eclectus ? 'M44 45C29 38 33 18 49 14C65 10 80 23 77 36Q75 51 59 51Z'
    : ringneck ? 'M48 43C37 36 39 20 52 18C66 15 77 24 76 35Q74 46 63 48Z'
    : name === 'Amazon' ? 'M38 45Q29 36 32 23L39 14Q58 9 72 19L78 30Q80 48 60 50Z'
    : 'M46 44C33 38 35 20 49 16C63 11 77 21 77 34Q75 49 61 50Z';
  return <G>
    <P d={short ? 'M33 61L23 77L37 81L47 66Z' : 'M34 57L17 87L29 83L46 63Z'} fill={c.tail} />
    {!short && <P d="M40 61L29 87L49 66Z" fill={c.wing} />}
    <BirdFeet x={43} y={77} color="#8c8582" />
    <P d={bodyShape} fill={c.body} />
    <P d="M51 39Q42 56 49 74Q65 71 67 54L63 38Z" fill={c.breast} w={0} />
    {lorikeet && <Lines d="M51 51L64 53M49 57L65 59M49 64L62 66" color="#e5bc54" w={2.5} />}
    <P d="M34 40C22 45 28 64 35 71Q49 65 53 51Q47 39 34 40Z" fill={c.wing} />
    {rosella ? <>
      <P d="M34 42L29 48L34 52L40 46L44 51L48 47L44 42Z" fill="#e9cf76" w={1.2} />
      <P d="M30 55L36 60L47 53L48 59L36 68L33 64Z" fill="#4297ba" w={1.2} />
    </> : <Lines d="M31 49Q36 54 44 51M32 57Q38 61 46 56M35 65L43 61" color={grey ? '#d7dcd4' : '#b2d1a0'} w={1.4} />}
    {(name === 'King Parrot' || name === 'Amazon' || name === 'Eclectus') && <P d="M30 44L38 42L44 47L37 51L30 49Z" fill={name === 'King Parrot' ? '#9bd09b' : '#dd6754'} w={0} />}
    <P d={headShape} fill={c.head} />
    {(grey || rosella) && <P d={grey ? 'M57 22Q70 19 75 29L72 41Q62 47 53 37Z' : 'M56 33Q65 28 73 34L70 44Q60 48 54 39Z'} fill={paper} w={1.1} />}
    {name === 'Amazon' && <P d="M34 24L40 15Q61 9 73 22L72 32Q57 27 49 28Z" fill="#f0cf64" w={0} />}
    {name === 'Parakeet' && <><P d="M49 40Q60 50 72 38L69 45Q57 54 48 44Z" fill="#456b60" w={0} /><P d="M55 45Q64 49 69 45" fill="none" stroke="#da8d8e" w={2} /></>}
    {name === 'Sun Conure' && <P d="M60 24Q72 23 75 34L70 45L60 48L54 40Z" fill="#f4a04f" w={0} />}
    {lorikeet && <P d="M46 41Q52 46 57 45L54 51L46 48Z" fill="#b2c866" w={0} />}
    {name === 'Purple Parrot' && <P d="M53 32Q63 27 72 32L70 43Q60 48 53 40Z" fill="#d9b8e9" w={0} />}
    {grey && <Lines d="M42 24l4 2M40 31l4 2M43 39l3 2M54 57l3 2M54 64l3 2M53 70l3 2" color="#8999a2" />}
    <Hook x={74} y={30} color={name === 'Eclectus' ? '#f3a53b' : lorikeet ? '#ec8a47' : ringneck ? '#cf6360' : name === 'King Parrot' ? '#e2a16c' : female ? '#3c4551' : rosella ? '#d9c2ac' : '#566270'} small={!eclectus} />
    <BirdEye x={65} y={28} r={3.7} />
    <Lines d="M44 24Q46 20 52 19" color={female ? '#f4a2a0' : lorikeet ? '#8499d5' : '#e4e5bd'} w={1.6} />
  </G>;
}

export function ParrotArt({ bird }: { bird: BirdDef }) {
  if (bird.shape !== 'parrot' && bird.shape !== 'cockatoo') return null;
  if (macaws[bird.name]) return <Macaw name={bird.name} />;
  if (bird.shape === 'cockatoo') return <Cockatoo name={bird.name} />;
  if (bird.name === 'Kakapo') return <Kakapo />;
  if (bird.name === 'Kea') return <Kea />;
  if (bird.name === 'Budgie') return <Budgie />;
  if (bird.name === 'Lovebird') return <Lovebird />;
  if (smallParrots[bird.name]) return <SmallParrot name={bird.name} />;
  return null;
}
