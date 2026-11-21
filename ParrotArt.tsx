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
  'Blue-and-Gold Macaw': { body: '#238dbc', breast: '#f8bc3c', wing: '#236db0', flights: '#284d87', tail: '#286e98' },
  'Green-winged Macaw': { body: '#c83d43', breast: '#de5650', wing: '#4b9c61', flights: '#397caa', tail: '#a83c52' },
  'Military Macaw': { body: '#76964c', breast: '#a4b764', wing: '#537c4d', flights: '#398899', tail: '#527e87' },
  'Blue-throated Macaw': { body: '#32a4c3', breast: '#f9ca51', wing: '#348bab', flights: '#326c9c', tail: '#2f87a7' },
};

function Macaw({ name }: { name: string }) {
  const c = macaws[name];
  const blueGold = name === 'Blue-and-Gold Macaw', throat = name === 'Blue-throated Macaw';
  const military = name === 'Military Macaw', green = name === 'Macaw';
  return <G>
    <P d={throat ? 'M36 56Q26 73 23 88Q35 83 45 64Z' : green ? 'M34 52Q19 69 12 88Q30 85 45 64Z' : military ? 'M34 54L13 85Q29 84 44 65Z' : 'M35 54Q24 69 16 87Q29 84 43 64Z'} fill={c.tail} />
    <P d={throat ? 'M43 56L35 88Q45 79 49 63Z' : green ? 'M43 53L27 88Q43 84 51 62Z' : 'M42 54L28 88Q42 81 49 61Z'} fill={c.flights} />
    <Lines d="M35 67L24 82M42 69L35 82" color="#b5d3dc" w={1} />
    <BirdFeet x={43} y={77} color="#7b7d83" />
    <P d={throat ? 'M41 32C30 40 27 65 38 75Q55 85 67 64Q72 53 68 30Z' : green ? 'M35 29C18 39 20 63 34 76Q55 87 71 63L72 32Z' : military ? 'M35 31C19 40 21 64 35 76Q57 86 70 62L71 34Z' : 'M39 32C25 39 23 62 35 74C49 86 67 71 69 52L69 34Z'} fill={c.body} />
    <P d={throat ? 'M54 43Q43 57 49 76Q63 73 67 59L66 43Z' : 'M51 40C43 46 45 70 51 75Q66 71 67 55L65 38Z'} fill={c.breast} w={0} />
    <P d={throat ? 'M40 35C25 22 12 24 8 39Q18 54 36 58L49 51Z' : military ? 'M31 39C19 46 26 68 33 74Q48 68 53 53Q46 36 31 39Z' : 'M35 41C23 48 28 68 34 73Q48 68 52 54Q47 39 35 41Z'} fill={c.flights} />
    <P d={throat ? 'M38 33Q20 24 11 34Q10 45 30 53L46 50Q48 40 38 33Z' : military ? 'M31 38Q20 42 26 58Q39 65 49 53Q47 39 31 38Z' : 'M34 40Q24 44 29 59Q38 64 49 54Q49 42 34 40Z'} fill={c.wing} />
    <Lines d={throat ? "M17 35Q23 44 34 47M17 45L29 52" : "M32 54Q36 58 42 56M34 64L43 62"} color="#c5e0bb" w={1.3} />
    {name === 'Macaw' && <P d="M32 40Q40 38 45 44L40 49L31 47Z" fill="#eac14a" w={1.2} />}
    <G transform={throat ? 'rotate(-8 58 37)' : military ? 'rotate(4 57 37)' : undefined}>
    <P d={military ? 'M43 42C31 35 34 19 45 14L58 13Q75 14 78 29Q80 43 65 48L51 47Z' : throat ? 'M48 43C37 35 40 19 51 15Q69 9 77 24Q81 40 67 48L57 48Z' : 'M46 42C34 36 36 19 48 15C63 10 78 20 77 34Q75 49 61 48Z'} fill={c.head ?? c.body} />
    {blueGold && <P d="M38 30Q34 17 48 14Q65 8 75 24L68 29Q51 21 38 30Z" fill="#4b9a50" w={0} />}
    {military && <P d="M57 14Q71 13 77 25L64 28L55 21Z" fill="#db5147" w={1.1} />}
    {blueGold && <P d="M52 36L75 35Q74 51 65 59L57 56L49 45Z" fill="#263846" w={0} />}
    {throat && <P d="M50 34L76 32Q76 51 63 59L54 55L47 45Z" fill="#167b9e" w={0} />}
    <P d={military ? 'M61 25Q72 22 77 31L72 41Q60 47 55 37Z' : throat ? 'M60 20Q71 18 76 26L73 36Q64 42 57 34Z' : 'M58 21Q71 18 76 28L72 39Q61 45 54 35Z'} fill={paper} w={1.25} />
    <Lines d={name === 'Green-winged Macaw' ? 'M57 31L63 33M61 38L69 40' : 'M56 31L62 33M61 38L69 40'} color={name === 'Green-winged Macaw' ? '#ba4e4c' : '#566976'} w={1.1} />
    <Hook x={75} y={29} color={name === 'Scarlet Macaw' || name === 'Green-winged Macaw' ? '#edd6ad' : '#3e4653'} />
    <BirdEye x={65} y={28} r={3.7} />
    <Lines d="M45 23Q48 18 54 18" color="#fff3d6" w={1.7} />
    </G>
  </G>;
}

// The two blue birds use different builds: a pale, lean long-tailed macaw
// and the upright, heavy-billed hyacinth with its yellow bare skin.
function BlueMacaw() {
  return <G>
    <P d="M35 54Q20 73 13 87Q31 82 45 62Z" fill="#3977b8" />
    <P d="M43 58L28 88Q41 83 51 65Z" fill="#70b9d9" />
    <BirdFeet x={45} y={77} color="#78858c" />
    <P d="M37 35C23 43 23 64 37 74Q55 84 68 64L71 37Z" fill="#62b7dd" />
    <P d="M56 39Q47 53 51 76Q64 73 68 58L67 39Z" fill="#b9e2ea" w={0} />
    <P d="M31 40C21 47 24 66 31 76Q47 68 52 50Q44 38 31 40Z" fill="#327eb8" />
    <P d="M31 40Q23 44 27 55Q38 61 48 51Q45 40 31 40Z" fill="#459acf" />
    <Lines d="M28 57Q34 63 42 58M31 68L39 64" color="#a1d9e8" w={1.6} />
    <G transform="rotate(-9 59 34)">
      <P d="M43 39C32 31 37 17 49 15Q64 11 73 22Q80 32 70 43Q59 51 43 39Z" fill="#7ecde4" />
      <P d="M60 21Q70 19 74 28L70 37Q61 42 55 33Z" fill="#d8edf0" w={1.2} />
      <Hook x={73} y={28} color="#475363" small />
      <BirdEye x={65} y={26} r={3.5} />
      <Lines d="M43 23Q47 18 53 18" color="#c2e6eb" w={1.7} />
    </G>
  </G>;
}

function HyacinthMacaw() {
  return <G>
    <P d="M34 55L17 86Q31 86 46 66Z" fill="#394492" />
    <P d="M42 57L30 88Q44 82 51 65Z" fill="#4a56aa" />
    <Lines d="M44 77L41 85L36 86M41 85L47 86M57 75L59 83L65 84M59 83L55 86" color="#737887" w={2.8} />
    <P d="M34 29C19 42 23 65 36 76Q56 84 70 64Q75 49 69 32Z" fill="#4d5db6" />
    <P d="M56 39Q48 53 51 76Q65 73 69 58L68 37Z" fill="#6b7bcb" w={0} />
    <P d="M31 37C18 45 26 67 34 74Q49 67 53 50Q48 37 31 37Z" fill="#394b9c" />
    <P d="M30 39Q24 44 29 55Q40 61 48 51Q44 39 30 39Z" fill="#4c5db2" w={0} />
    <Lines d="M29 58Q35 63 43 58M34 67L41 64" color="#7f8ed6" w={1.6} />
    <P d="M42 41C30 32 36 16 49 13Q66 9 75 23Q80 37 68 46Q53 54 42 41Z" fill="#586bc1" />
    <P d="M68 29Q77 24 80 30L77 41Q71 45 67 42L71 35Z" fill="#f3ce43" w={1.1} />
    <Hook x={75} y={27} color="#343d4a" />
    <Circle cx={62} cy={25} r={6.5} fill="#f1ce42" />
    <BirdEye x={62} y={25} r={3.6} />
    <Lines d="M42 22Q47 16 53 17" color="#91a1df" w={1.7} />
  </G>;
}

// A mini-macaw: the short tail, small bill and low, round build carry its size
// difference before the red shoulder is visible.
function HahnsMacaw() {
  return <G>
    <P d="M36 62L24 81Q35 84 47 69Z" fill="#30745b" />
    <P d="M40 66L34 83L51 69Z" fill="#34817e" />
    <BirdFeet x={43} y={77} color="#7b7d83" />
    <P d="M36 42C24 48 27 69 39 76Q58 84 68 65Q74 53 64 43Z" fill="#50aa65" />
    <P d="M54 49Q47 60 51 76Q66 72 67 58Z" fill="#8bc17b" w={0} />
    <P d="M34 46C24 49 29 66 37 71Q49 66 53 55Q48 43 34 46Z" fill="#34817e" />
    <P d="M33 45Q27 49 31 58Q40 63 49 55Q48 45 33 45Z" fill="#38885e" />
    <P d="M33 45Q40 43 46 48L43 54Q36 56 31 52Z" fill="#df5a49" w={1.2} />
    <Lines d="M34 61Q39 65 45 60M37 68L43 65" color="#b7d5a6" w={1.3} />
    <G transform="rotate(7 59 42)">
      <P d="M46 48C36 42 39 28 50 25Q66 21 74 34Q78 47 65 53L55 53Z" fill="#50aa65" />
      <P d="M41 37Q40 27 51 25Q63 22 70 31L62 35Q51 30 41 37Z" fill="#45878e" w={0} />
      <P d="M61 32Q70 29 75 36L72 45Q65 49 58 42Z" fill={paper} w={1.2} />
      <Hook x={73} y={37} small />
      <BirdEye x={66} y={36} r={3.6} />
      <Lines d="M47 30L52 28" color="#b6d7b9" w={1.6} />
    </G>
  </G>;
}

function Cockatoo({ name }: { name: string }) {
  const tiel = name === 'Cockatiel', galah = name === 'Galah';
  const body = tiel ? '#9ba5af' : galah ? '#df779b' : '#f7f4e9';
  const wing = tiel ? '#778594' : galah ? '#99a3af' : '#dddcd4';
  return <G>
    <P d={tiel ? 'M32 59L19 88L40 76L47 61Z' : 'M34 63L25 82Q33 88 45 76L48 64Z'} fill={wing} />
    <Lines d={tiel ? 'M34 70L25 82M38 73L32 81' : 'M34 74L32 80M39 74L37 80'} color="#f0eee3" />
    <BirdFeet x={43} y={77} color="#7c8186" />
    <P d="M39 33C22 38 24 66 36 76C49 85 68 72 69 54L66 36Z" fill={body} />
    <P d="M35 41C24 46 29 68 35 73Q49 67 52 53Q47 40 35 41Z" fill={wing} />
    <P d={tiel ? 'M35 45Q31 50 34 63L43 60L47 50Z' : 'M34 44Q28 51 34 65Q42 63 46 55Q42 44 34 44Z'} fill={tiel ? '#fff6e9' : galah ? '#bec6cf' : '#fffbf0'} w={0} />
    <Lines d="M35 66L43 62M35 70L41 67" color={galah || tiel ? '#596c7c' : '#9da5a5'} />
    <G transform={galah ? 'rotate(-7 58 36)' : undefined}>
    {galah ? <P d="M39 27Q32 15 42 12Q46 8 51 12Q57 9 62 16L65 25Z" fill="#f8d5dd" /> : tiel ?
      <P d="M45 27Q30 16 33 6Q40 15 45 17Q39 7 45 6L54 20Q53 9 59 9L60 26Z" fill="#f7d463" /> :
      <P d="M44 26Q25 15 30 8Q38 16 43 16Q33 6 39 6L53 17Q46 5 53 7Q61 14 63 24Z" fill="#f3cf4d" />}
    <P d="M47 43C34 37 35 22 46 18C59 12 74 21 74 33Q73 48 58 48Z" fill={tiel ? '#f6da75' : galah ? '#ed9bb6' : '#fffaf0'} />
    {galah && <P d="M38 27Q38 17 50 16Q61 14 68 22Q56 19 48 26Z" fill="#f7d3db" w={0} />}
    {tiel && <Circle cx={59} cy={38} r={5.9} fill="#ed9343" />}
    <Hook x={71} y={31} color={galah ? '#d8c2ae' : '#596674'} small />
    <BirdEye x={63} y={28} r={3.8} />
    {!tiel && <Lines d="M45 29Q43 24 49 21" color="#fffdf5" w={1.9} />}
    </G>
  </G>;
}

// Broad facial discs and low, flightless build are visible before feather marks.
function Kakapo() {
  return <G>
    <P d="M29 62Q17 67 12 77Q24 82 40 75L48 64Z" fill="#637c45" />
    <Lines d="M36 77L33 84L26 86M33 84L40 85M57 78L62 84L70 85M62 84L57 87" color="#a09872" w={3} />
    <P d="M31 35C12 40 13 66 28 77C42 86 70 83 76 65C83 44 65 31 49 32Z" fill="#a2af62" />
    <P d="M29 40C16 43 18 64 29 73Q44 72 50 55Q46 41 29 40Z" fill="#718e4c" />
    <Lines d="M23 48Q29 55 37 49M24 59Q31 66 41 58M31 68Q36 72 42 66" color="#c7ce83" w={2} />
    <P d="M31 35C26 22 38 13 53 14C72 13 82 28 75 44Q68 58 49 54Q34 50 31 35Z" fill="#a6b46a" />
    <P d="M54 25C43 14 32 28 39 39Q43 48 54 45Q64 52 72 40C80 27 66 15 54 25Z" fill="#e3dca9" w={1.3} />
    <P d="M53 39Q58 35 63 40Q64 46 59 50L57 44L53 43Z" fill="#d4bf92" w={1.4} />
    <BirdEye x={45} y={31} r={3.1} /><BirdEye x={65} y={32} r={3.8} />
    <Lines d="M39 23L43 21M68 22L72 25M40 40L44 42M65 46L68 43M51 60Q55 65 60 61M58 71L62 73" color="#65733e" w={1.6} />
  </G>;
}

// The lifted wing shows the kea's orange flight feathers; its long bill is a
// silhouette feature, rather than another small patch on a round parrot.
function Kea() {
  return <G>
    <P d="M35 55Q21 65 12 85Q26 83 46 66Z" fill="#697347" />
    <P d="M38 60L26 87Q36 83 48 64Z" fill="#8b8c58" />
    <BirdFeet x={47} y={77} color="#757675" />
    <P d="M37 32C26 39 26 64 39 75Q58 84 69 63L71 36Z" fill="#929e60" />
    <P d="M55 41Q48 56 53 73Q64 71 67 57Z" fill="#adb477" w={0} />
    <P d="M35 37C21 29 10 36 10 47Q12 62 34 71Q47 64 52 50Z" fill="#5c7948" />
    <P d="M14 46Q18 60 34 67L45 55Q30 51 27 41Z" fill="#de8748" w={1.2} />
    <P d="M34 36Q18 30 12 42Q20 52 34 52L45 48Z" fill="#7b9152" />
    <Lines d="M17 40Q23 46 29 42M27 37Q32 43 38 40M20 54L26 59M30 58L36 62" color="#b5bd7c" w={1.6} />
    <P d="M45 42C34 34 39 19 52 16Q68 13 76 28L72 43L59 49Z" fill="#9caa68" />
    <P d="M72 25C85 25 90 35 85 45Q82 50 77 52Q83 39 72 36L69 31Z" fill="#626d70" />
    <Lines d="M77 29Q85 32 84 39" color="#b6bca7" w={1.5} />
    <BirdEye x={64} y={27} r={3.5} />
    <Lines d="M45 25Q48 30 52 27M44 34Q48 39 52 35M56 43L60 45M59 57L63 60M55 67L59 70" color="#687e46" w={1.6} />
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
    <Lines d="M40 23Q48 28 53 24M39 30Q46 35 51 31M42 37L49 39" color="#3e6240" w={2.8} />
    <P d="M71 31Q80 30 81 35Q79 42 74 42L75 36L70 36Z" fill="#d6ae73" w={1.5} />
    <Ellipse cx={73} cy={31} rx={4} ry={2.3} fill="#5f8dba" />
    <P d="M57 37L64 36L61 42L56 41Z" fill="#4268b2" w={0} />
    <Circle cx={54} cy={45} r={1.7} fill={INK} /><Circle cx={61} cy={46} r={1.7} fill={INK} />
    <BirdEye x={63} y={28} r={3.6} />
  </G>;
}

function Lovebird() {
  return <G>
    <P d="M30 65L24 73Q30 77 40 73L43 67Z" fill="#388e83" />
    <BirdFeet x={43} y={77} color="#b2948c" />
    <P d="M31 38C16 43 18 67 33 76C51 86 75 75 75 55Q75 35 53 34Z" fill="#82bf6b" />
    <P d="M50 40Q68 38 70 51Q73 64 60 70L49 63Q53 53 50 40Z" fill="#f4b075" w={0} />
    <P d="M28 45Q19 51 28 66Q40 70 48 58Q45 44 28 45Z" fill="#348f65" />
    <Lines d="M32 54Q38 60 45 55M36 64L43 62" color="#a4d28b" w={1.7} />
    <G transform="rotate(7 58 39)">
      <P d="M43 45C31 38 36 21 50 19Q69 15 75 31Q79 47 63 54Q51 57 43 45Z" fill="#ed9678" />
      <P d="M45 25Q58 18 68 25L66 32Q53 28 45 36Z" fill="#f5b18b" w={0} />
      <P d="M48 44Q58 48 70 40Q68 54 60 58L49 52Z" fill="#f3a578" w={0} />
      <Hook x={72} y={33} color="#efd6ae" small />
      <BirdEye x={63} y={31} r={3.9} />
    </G>
  </G>;
}

const smallParrots: Record<string, { body: string; wing: string; head: string; breast: string; tail: string }> = {
  Parrot: { body: '#bd469b', wing: '#85376e', head: '#d65eb4', breast: '#f2b66c', tail: '#8b417f' },
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
  const amazon = name === 'Amazon';
  const short = grey || name.startsWith('Eclectus') || name === 'Amazon' || purple;
  const eclectus = name.startsWith('Eclectus'), ringneck = name === 'Parakeet';
  const bodyShape = purple ? 'M31 38C14 43 18 70 35 78Q61 87 75 64L70 40Z'
    : eclectus ? 'M40 31C26 40 24 66 39 77Q61 85 72 62L70 34Z'
    : name === 'Amazon' ? 'M30 30C17 39 21 69 35 78Q60 86 74 61L72 32Z'
    : ringneck ? 'M43 31C34 39 32 60 40 73Q52 80 61 62L65 34Z'
    : lorikeet ? 'M38 34C28 42 26 62 36 73Q52 81 63 62L68 36Z'
    : short ? 'M35 34C21 43 26 68 39 76Q58 84 69 63L68 38Z'
    : 'M35 34C22 43 26 65 38 74Q58 82 68 60L67 37Z';
  const headShape = purple ? 'M39 47C22 39 26 20 45 16C65 10 83 24 78 41Q73 57 54 54Z'
    : eclectus ? 'M44 45C29 38 33 18 49 14C65 10 80 23 77 36Q75 51 59 51Z'
    : ringneck ? 'M48 43C37 36 39 20 52 18C66 15 77 24 76 35Q74 46 63 48Z'
    : name === 'Amazon' ? 'M38 45Q29 36 32 23L39 14Q58 9 72 19L78 30Q80 48 60 50Z'
    : 'M46 44C33 38 35 20 49 16C63 11 77 21 77 34Q75 49 61 50Z';
  return <G>
    <P d={ringneck ? 'M43 57L11 88L17 88L51 62Z' : amazon ? 'M29 61L24 79L43 79L49 64Z' : short ? 'M33 61L23 77L37 81L47 66Z' : 'M34 57L17 87L29 83L46 63Z'} fill={c.tail} />
    {!short && !ringneck && <P d="M40 61L29 87L49 66Z" fill={c.wing} />}
    <BirdFeet x={43} y={77} color="#8c8582" />
    <P d={bodyShape} fill={c.body} />
    <P d="M51 39Q42 56 49 74Q65 71 67 54L63 38Z" fill={c.breast} w={0} />
    {lorikeet && <Lines d="M51 51L64 53M49 57L65 59M49 64L62 66" color="#e5bc54" w={2.5} />}
    <P d={amazon ? 'M28 38C15 43 18 68 29 73Q45 68 50 49Q43 37 28 38Z'
      : eclectus ? 'M41 36C22 25 10 35 9 49Q15 65 36 70L53 49Q51 36 41 36Z'
      : ringneck ? 'M39 40C30 44 31 63 38 70Q49 62 54 48Q48 39 39 40Z'
      : 'M34 40C22 45 28 64 35 71Q49 65 53 51Q47 39 34 40Z'} fill={c.wing} />
    {eclectus && <P d="M11 49Q18 61 36 68L44 57Q26 58 20 44Z" fill={female ? '#5265a3' : '#3c83b7'} w={1.3} />}
    {rosella ? <>
      <P d="M34 42L29 48L34 52L40 46L44 51L48 47L44 42Z" fill="#e9cf76" w={1.2} />
      <P d="M30 55L36 60L47 53L48 59L36 68L33 64Z" fill="#4297ba" w={1.2} />
    </> : <Lines d={amazon ? "M26 48Q33 56 42 51M27 59L38 62" : eclectus ? "M15 44Q25 43 34 51M17 53L31 60M30 38L40 46" : ringneck ? "M36 48L44 53M37 57L43 61" : "M31 49Q36 54 44 51M34 60L43 62"} color={grey ? '#d7dcd4' : '#b2d1a0'} w={1.4} />}
    {(name === 'King Parrot' || name === 'Amazon' || name === 'Eclectus') && <P d={name === 'Eclectus' ? "M40 44Q46 42 49 47L44 51Q41 51 40 49Z" : "M30 44L38 42L44 47L37 51L30 49Z"} fill={name === 'King Parrot' ? '#9bd09b' : '#dd6754'} w={0} />}
    <G transform={purple ? 'rotate(-6 58 36)' : grey ? 'rotate(10 58 36)' : ringneck ? 'rotate(-10 59 35)' : undefined}>
    <P d={headShape} fill={c.head} />
    {(grey || rosella) && <P d={grey ? 'M57 22Q70 19 75 29L72 41Q62 47 53 37Z' : 'M56 33Q65 28 73 34L70 44Q60 48 54 39Z'} fill={paper} w={1.1} />}
    {name === 'Amazon' && <P d="M34 24L40 15Q61 9 73 22L72 32Q57 27 49 28Z" fill="#f0cf64" w={0} />}
    {name === 'Parakeet' && <><P d="M49 40Q60 50 72 38L69 45Q57 54 48 44Z" fill="#456b60" w={0} /><P d="M55 45Q64 49 69 45" fill="none" stroke="#da8d8e" w={2} /></>}
    {name === 'Sun Conure' && <P d="M60 24Q72 23 75 34L70 45L60 48L54 40Z" fill="#f4a04f" w={0} />}
    {lorikeet && <P d="M46 41Q52 46 57 45L54 51L46 48Z" fill="#b2c866" w={0} />}
    {name === 'Purple Parrot' && <P d="M53 32Q63 27 72 32L70 43Q60 48 53 40Z" fill="#d9b8e9" w={0} />}
    {grey && <Lines d="M42 27l5 3M43 37l4 2M54 59l4 3M53 68l4 2" color="#8999a2" />}
    <Hook x={74} y={30} color={name === 'Eclectus' ? '#f3a53b' : lorikeet ? '#ec8a47' : ringneck ? '#cf6360' : name === 'King Parrot' ? '#e2a16c' : female ? '#3c4551' : rosella ? '#d9c2ac' : '#566270'} small={!eclectus} />
    <BirdEye x={65} y={28} r={3.7} />
    <Lines d="M44 24Q46 20 52 19" color={female ? '#f4a2a0' : lorikeet ? '#8499d5' : '#e4e5bd'} w={1.6} />
    </G>
  </G>;
}

export function ParrotArt({ bird }: { bird: BirdDef }) {
  if (bird.shape !== 'parrot' && bird.shape !== 'cockatoo') return null;
  if (bird.name === "Hahn's Macaw") return <HahnsMacaw />;
  if (bird.name === 'Blue Macaw') return <BlueMacaw />;
  if (bird.name === 'Hyacinth Macaw') return <HyacinthMacaw />;
  if (macaws[bird.name]) return <Macaw name={bird.name} />;
  if (bird.shape === 'cockatoo') return <Cockatoo name={bird.name} />;
  if (bird.name === 'Kakapo') return <Kakapo />;
  if (bird.name === 'Kea') return <Kea />;
  if (bird.name === 'Budgie') return <Budgie />;
  if (bird.name === 'Lovebird') return <Lovebird />;
  if (bird.name === 'Amazon') return <G transform="translate(96 0) scale(-1 1)"><SmallParrot name={bird.name} /></G>;
  if (smallParrots[bird.name]) return <SmallParrot name={bird.name} />;
  return null;
}
