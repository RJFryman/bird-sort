export type BirdDef = {
  name: string;
  color: string;
  size?: number; // 1 = default
  crest?: 'spike' | 'tuft' | 'crown'; // crown = peacock head dots
  neck?: number; // raises head + gives long legs (flamingo / swan)
  tail?: 'long' | 'fan'; // fan = peacock
  beak?: 'seed' | 'dagger' | 'hook' | 'toucan' | 'pouch';
  belly?: string; // breast patch color
  cheek?: string; // face patch color
  leg?: string; // leg color override
  hood?: string; // white/pale cap over the head (bald eagle)
  shape?: 'penguin' | 'fish'; // fully alternate silhouette
};

// Cutie-Bird roster: cute + bird-like. Add "every type of bird" over time =
// one row here; Bird.tsx renders from these traits.
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
  { name: 'Toucan', color: '#1c1c22', beak: 'toucan', belly: '#f7d84b', cheek: '#f7d84b' },
  { name: 'Goldfinch', color: '#f4c20d', crest: 'spike', beak: 'seed', size: 0.9 },
  { name: 'Peacock', color: '#0e9aa7', tail: 'fan', crest: 'crown', size: 0.92 },
  { name: 'Bluejay', color: '#4aa3e0', crest: 'spike', cheek: '#f2f4f7' },
  { name: 'Hummingbird', color: '#2fae8f', size: 0.72, beak: 'dagger' },
  // --- Asher's requests ---
  { name: 'Eagle', color: '#5a4630', hood: '#f4f1ea', beak: 'hook', size: 1.16, leg: '#f4b400' },
  { name: 'Hawk', color: '#8a6b4a', beak: 'hook', belly: '#e8dcc5', size: 1.05 },
  { name: 'Falcon', color: '#5f6b74', beak: 'hook', belly: '#e6e9ec', cheek: '#f2f4f7' },
  { name: 'Pelican', color: '#eef1f4', beak: 'pouch', size: 1.14, leg: '#e0a24a' },
  { name: 'Penguin', color: '#26262b', belly: '#ffffff', shape: 'penguin', leg: '#f4a72a' },
  { name: 'Scarlet Macaw', color: '#e23b2e', tail: 'long', beak: 'hook', cheek: '#f5f0e6', belly: '#f2c521' },
  { name: 'Blue Macaw', color: '#1f6fd0', tail: 'long', beak: 'hook', belly: '#f2c521' },
  { name: 'Swan', color: '#f7f7fa', neck: 16, size: 1.02, beak: 'hook', leg: '#222' },
  { name: 'Duck', color: '#6a8f3c', belly: '#d8cdb0', beak: 'seed', size: 1.02 },
  { name: 'Seagull', color: '#f2f4f7', beak: 'hook', leg: '#e0a24a', size: 1.02 },
  { name: 'Woodpecker', color: '#1c1c22', crest: 'spike', belly: '#ffffff', beak: 'dagger' },
  { name: 'Fish', color: '#ff8c1a', shape: 'fish' },
];
