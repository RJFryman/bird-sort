export type BirdDef = {
  name: string;
  color: string;
  overlay?: string; // wing/tail shade; defaults to translucent black
  size?: number; // 1 = default
  crest?: boolean; // tuft on head (cardinal)
  neck?: number; // extra head height in px (flamingo)
  tail?: 'short' | 'long'; // macaw = long
  beak?: 'short' | 'long'; // kingfisher/crow = long
  belly?: string; // second-color breast patch (robin)
};

// Each species = distinct silhouette + color. Add "every type of bird" over
// time = one row here; Bird.tsx draws from these traits, no other changes.
export const ROSTER: BirdDef[] = [
  { name: 'Cardinal', color: '#e5533d', crest: true },
  { name: 'Bluebird', color: '#3d7de5' },
  { name: 'Canary', color: '#f2c14e', size: 0.82 },
  { name: 'Macaw', color: '#4a9d6f', tail: 'long', beak: 'long' },
  { name: 'Crow', color: '#2b2b2b', overlay: 'rgba(255,255,255,.18)', size: 1.15, beak: 'long' },
  { name: 'Robin', color: '#8a6a4a', belly: '#e07a3d' },
  { name: 'Flamingo', color: '#e07bb0', neck: 12, size: 0.95 },
  { name: 'Sparrow', color: '#a9895f', size: 0.85 },
  { name: 'Dove', color: '#e8e8e8', overlay: 'rgba(0,0,0,.12)', size: 1.05 },
  { name: 'Kingfisher', color: '#3fb6c9', beak: 'long' },
];
