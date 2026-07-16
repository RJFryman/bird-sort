export type BirdDef = { name: string; color: string; overlay?: string };

// Starter roster. Each species = distinct color (+ shape later). Add "every type
// of bird" over time = one row each; nothing else changes. `overlay` tints
// wing/tail; defaults to translucent black in Bird.tsx.
export const ROSTER: BirdDef[] = [
  { name: 'Cardinal', color: '#e5533d' },
  { name: 'Bluebird', color: '#3d7de5' },
  { name: 'Canary', color: '#f2c14e' },
  { name: 'Macaw', color: '#4a9d6f' },
  { name: 'Crow', color: '#2b2b2b', overlay: 'rgba(255,255,255,.18)' },
  { name: 'Robin', color: '#d98a3d' },
  { name: 'Flamingo', color: '#e07bb0' },
  { name: 'Sparrow', color: '#8a6a4a' },
  { name: 'Dove', color: '#e8e8e8', overlay: 'rgba(0,0,0,.12)' },
  { name: 'Kingfisher', color: '#3fb6c9' },
];
