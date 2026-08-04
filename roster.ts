export type BirdDef = {
  name: string;
  color: string;
  size?: number; // 1 = default
  crest?: 'spike' | 'tuft' | 'crown'; // crown = peacock head dots
  crestColor?: string; // override crest color (cockatiel/cockatoo yellow)
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
  // --- parrots & cockatoos (from Asher's bird book) ---
  { name: 'Cockatiel', color: '#a7adb3', crest: 'tuft', crestColor: '#f2c521', cheek: '#f0902f', size: 0.95 },
  { name: 'Cockatoo', color: '#f5f6f8', crest: 'spike', crestColor: '#f2c521', beak: 'hook', size: 1.08 },
  { name: 'Galah', color: '#ef9ab0', crest: 'spike', crestColor: '#f7d0dc', belly: '#cfd3d8', beak: 'hook' },
  { name: 'African Grey', color: '#9aa0a6', beak: 'hook', tail: 'long', belly: '#c7ccd1' },
  { name: 'Kea', color: '#6f6a3a', beak: 'hook', belly: '#b5482f', size: 1.05 },
  { name: 'Kakapo', color: '#7f8a3c', crest: 'tuft', beak: 'hook', size: 1.12 },
  { name: 'Rosella', color: '#e23b2e', belly: '#f2c521', cheek: '#f2f4f7', beak: 'seed' },
  { name: 'Amazon', color: '#2fae5f', beak: 'hook', cheek: '#f2c521', tail: 'long' },
  { name: 'Parakeet', color: '#4fae4f', beak: 'hook', size: 0.82, cheek: '#ec5a7a' },
  { name: 'Budgie', color: '#5bc236', beak: 'seed', belly: '#f2e14a', cheek: '#f2f4f7', size: 0.8 },
  { name: 'Lovebird', color: '#3fae5f', beak: 'hook', cheek: '#f0902f', belly: '#f2c24b', size: 0.78 },
  { name: 'King Parrot', color: '#d5372a', belly: '#1f8f4f', beak: 'hook' },
  { name: 'Fish', color: '#ff8c1a', shape: 'fish' },
  // --- Macaws & parrots (Asher's wishlist, 2026-08-03). APPEND-ONLY: boards
  // persist numeric roster indices, so never reorder/insert above this line —
  // it would remap existing saved birds. New species go at the end. ---
  { name: 'Blue-and-Gold Macaw', color: '#1c5fb0', belly: '#f4b400', tail: 'long', beak: 'hook', cheek: '#f5f0e6' },
  { name: 'Green-winged Macaw', color: '#b3241d', belly: '#b3241d', tail: 'long', beak: 'hook', cheek: '#f5f0e6' },
  { name: 'Military Macaw', color: '#5b7a34', belly: '#7a9448', tail: 'long', beak: 'hook', cheek: '#e8dcc5' },
  { name: 'Hyacinth Macaw', color: '#33409e', belly: '#3a48b0', tail: 'long', beak: 'hook', leg: '#f4c20d', size: 1.08 },
  { name: 'Blue-throated Macaw', color: '#1f8fce', belly: '#f2c24b', tail: 'long', beak: 'hook', cheek: '#f5f0e6' },
  { name: "Hahn's Macaw", color: '#3a9a4f', hood: '#2456b0', tail: 'long', beak: 'hook', size: 0.82 },
  { name: 'Rainbow Lorikeet', color: '#2f9e44', hood: '#2456b0', belly: '#e8622a', beak: 'hook', size: 0.9 },
  { name: 'Eclectus', color: '#1f9d3a', belly: '#2fae5f', beak: 'hook', cheek: '#f2c24b', tail: 'long' },
  { name: 'Eclectus Female', color: '#c0202a', belly: '#5b3b8c', beak: 'hook', tail: 'long' },
];
