export type BirdDef = {
  name: string;
  color: string;
  size?: number; // 1 = default
  crest?: 'spike' | 'tuft';
  neck?: number; // raises head + gives long legs (flamingo)
  tail?: 'long';
  beak?: 'seed' | 'dagger' | 'hook';
  belly?: string; // breast patch color
  cheek?: string; // face patch color
  leg?: string; // leg color override
};

// Cutie-Bird roster: cute + bird-like. Every color represented. Add "every
// type of bird" over time = one row here; Bird.tsx renders from these traits.
export const ROSTER: BirdDef[] = [
  { name: 'Cardinal', color: '#d5372a', crest: 'spike', beak: 'seed', leg: '#c26a2f' },
  { name: 'Bluebird', color: '#2f74d0', belly: '#e9a24a' },
  { name: 'Canary', color: '#f2c521', size: 0.85, beak: 'seed' },
  { name: 'Macaw', color: '#2fae5f', tail: 'long', beak: 'hook', cheek: '#f5f0e6' },
  { name: 'Crow', color: '#26262b', size: 1.16, beak: 'dagger' },
  { name: 'Robin', color: '#6f5138', belly: '#e0662f' },
  { name: 'Flamingo', color: '#ef86b6', neck: 14, size: 0.9, beak: 'hook', leg: '#e06a9a' },
  { name: 'Sparrow', color: '#a9895f', size: 0.85, beak: 'seed' },
  { name: 'Dove', color: '#e2e2e6', size: 1.06 },
  { name: 'Kingfisher', color: '#22b6cf', beak: 'dagger', crest: 'tuft', cheek: '#ffffff' },
  { name: 'Oriole', color: '#f2802a', belly: '#f7b955', beak: 'seed' },
  { name: 'Parrot', color: '#8b5cf6', tail: 'long', beak: 'hook', cheek: '#f5f0e6' },
  { name: 'Owl', color: '#7c6a4f', size: 1.14, crest: 'tuft' },
  { name: 'Toucan', color: '#1c1c22', beak: 'hook', cheek: '#f7d84b' },
  { name: 'Goldfinch', color: '#f4c20d', crest: 'spike', beak: 'seed', size: 0.9 },
  { name: 'Peacock', color: '#0e9aa7', tail: 'long' },
  { name: 'Bluejay', color: '#4aa3e0', crest: 'spike', cheek: '#f2f4f7' },
  { name: 'Hummingbird', color: '#2fae8f', size: 0.72, beak: 'dagger' },
];
