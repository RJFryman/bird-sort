// Shared facial details keep the species illustrations in one friendly visual style.
import React from 'react';
import { Circle, Path } from 'react-native-svg';

export const INK = '#263544';
export function BirdEye({ x, y, r = 4 }: { x: number; y: number; r?: number }) {
  return <><Circle cx={x} cy={y} r={r + 1.4} fill="#fff8e8" />
    <Circle cx={x + .6} cy={y} r={r} fill={INK} />
    <Circle cx={x + 1.5} cy={y - 1.5} r={Math.max(1, r * .3)} fill="#fff" /></>;
}
export function BirdFeet({ x = 42, y = 78, color = '#bc8049' }: { x?: number; y?: number; color?: string }) {
  return <Path d={`M${x} ${y}v7m-4 1 4-1 5 1m7-8v7m-4 1 4-1 5 1`}
    fill="none" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />;
}
