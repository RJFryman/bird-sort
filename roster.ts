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
  // Fish-only traits (shape:'fish'). Additive — birds ignore them. Give a fish
  // its "tell": clownfish bands, puffer/koi spots (see Bird.tsx fish branch).
  stripe?: string; // vertical body bands (clownfish white, angelfish grey)
  spot?: string; // scattered dots (pufferfish, koi patches)
  // Silhouette archetype — the shape carries the species (see Bird.tsx + the
  // art-direction bible). Absent = the default perching songbird.
  shape?:
    | 'penguin'
    | 'fish'
    | 'parrot' // long streamer tail + hook beak + pale face patch (all macaws/parrots)
    | 'toucan' // oversized banana beak as big as the body
    | 'cockatoo' // parrot body + recurved crest fan
    | 'kingfisher' // oversized head + long dagger beak + stub tail
    | 'dove' // plump barrel body + small head + short beak
    | 'hummingbird'; // tiny + needle beak + hover pose
};

// Cutie-Bird roster: cute + bird-like. Add "every type of bird" over time =
// one row here; Bird.tsx renders from these traits.
export const ROSTER: BirdDef[] = [
  { name: 'Cardinal', color: '#d5372a', crest: 'spike', beak: 'seed', leg: '#c26a2f' },
  { name: 'Bluebird', color: '#2f74d0', belly: '#e9a24a' },
  { name: 'Canary', color: '#f2c521', size: 0.85, beak: 'seed' },
  { name: 'Macaw', color: '#2fae5f', beak: 'hook', cheek: '#f5f0e6', shape: 'parrot' },
  { name: 'Crow', color: '#26262b', size: 1.16, beak: 'dagger' },
  { name: 'Robin', color: '#6f5138', belly: '#e0662f' },
  { name: 'Flamingo', color: '#ef86b6', neck: 14, size: 0.9, beak: 'hook', leg: '#e06a9a' },
  { name: 'Sparrow', color: '#a9895f', size: 0.85, beak: 'seed' },
  { name: 'Dove', color: '#e2e2e6', size: 1.06, belly: '#f4f4f7', shape: 'dove' },
  { name: 'Kingfisher', color: '#22b6cf', belly: '#e8843a', cheek: '#ffffff', shape: 'kingfisher' },
  { name: 'Oriole', color: '#f2802a', belly: '#f7b955', beak: 'seed' },
  { name: 'Parrot', color: '#8b5cf6', beak: 'hook', cheek: '#f5f0e6', shape: 'parrot' },
  { name: 'Owl', color: '#7c6a4f', size: 1.14, crest: 'tuft' },
  { name: 'Toucan', color: '#1c1c22', belly: '#f7d84b', cheek: '#f2a71b', shape: 'toucan' },
  { name: 'Goldfinch', color: '#f4c20d', crest: 'spike', beak: 'seed', size: 0.9 },
  { name: 'Peacock', color: '#0e9aa7', tail: 'fan', crest: 'crown', size: 0.92 },
  { name: 'Bluejay', color: '#4aa3e0', crest: 'spike', cheek: '#f2f4f7' },
  { name: 'Hummingbird', color: '#2fae8f', size: 0.72, cheek: '#e0335f', shape: 'hummingbird' },
  // --- Asher's requests ---
  { name: 'Eagle', color: '#5a4630', hood: '#f4f1ea', beak: 'hook', size: 1.16, leg: '#f4b400' },
  { name: 'Hawk', color: '#8a6b4a', beak: 'hook', belly: '#e8dcc5', size: 1.05 },
  { name: 'Falcon', color: '#5f6b74', beak: 'hook', belly: '#e6e9ec', cheek: '#f2f4f7' },
  { name: 'Pelican', color: '#eef1f4', beak: 'pouch', size: 1.14, leg: '#e0a24a' },
  { name: 'Penguin', color: '#26262b', belly: '#ffffff', shape: 'penguin', leg: '#f4a72a' },
  { name: 'Scarlet Macaw', color: '#e23b2e', beak: 'hook', cheek: '#f5f0e6', belly: '#f2c521', shape: 'parrot' },
  { name: 'Blue Macaw', color: '#1f6fd0', beak: 'hook', belly: '#f2c521', cheek: '#f5f0e6', shape: 'parrot' },
  { name: 'Swan', color: '#f7f7fa', neck: 16, size: 1.02, beak: 'hook', leg: '#222' },
  { name: 'Duck', color: '#6a8f3c', belly: '#d8cdb0', beak: 'seed', size: 1.02 },
  { name: 'Seagull', color: '#f2f4f7', beak: 'hook', leg: '#e0a24a', size: 1.02 },
  { name: 'Woodpecker', color: '#1c1c22', crest: 'spike', belly: '#ffffff', beak: 'dagger' },
  // --- parrots & cockatoos (from Asher's bird book) ---
  { name: 'Cockatiel', color: '#a7adb3', crestColor: '#f2c521', cheek: '#f0902f', size: 0.95, shape: 'cockatoo' },
  { name: 'Cockatoo', color: '#f5f6f8', crestColor: '#f2c521', size: 1.08, shape: 'cockatoo' },
  { name: 'Galah', color: '#ef9ab0', crestColor: '#f7d0dc', belly: '#cfd3d8', shape: 'cockatoo' },
  { name: 'African Grey', color: '#9aa0a6', beak: 'hook', belly: '#c7ccd1', cheek: '#f0f1f3', shape: 'parrot' },
  { name: 'Kea', color: '#6f6a3a', beak: 'hook', belly: '#b5482f', size: 1.05, shape: 'parrot' },
  { name: 'Kakapo', color: '#7f8a3c', beak: 'hook', size: 1.12, cheek: '#e8e2c0', shape: 'parrot' },
  { name: 'Rosella', color: '#e23b2e', belly: '#f2c521', cheek: '#f2f4f7', shape: 'parrot' },
  { name: 'Amazon', color: '#2fae5f', beak: 'hook', cheek: '#f2c521', shape: 'parrot' },
  { name: 'Parakeet', color: '#4fae4f', beak: 'hook', size: 0.82, cheek: '#ec5a7a', shape: 'parrot' },
  { name: 'Budgie', color: '#5bc236', belly: '#f2e14a', cheek: '#f2f4f7', size: 0.8, shape: 'parrot' },
  { name: 'Lovebird', color: '#3fae5f', cheek: '#f0902f', belly: '#f2c24b', size: 0.78, shape: 'parrot' },
  { name: 'King Parrot', color: '#d5372a', belly: '#1f8f4f', cheek: '#f5f0e6', shape: 'parrot' },
  // Index 41 was a stray shape:'fish' that leaked into the BIRD roster (live
  // since 2026-08-03 — bird mode could deal a lone fish). Replaced IN PLACE:
  // saved boards persist numeric indices, so the row must stay at 41 and the
  // array length must not change. Sun Conure keeps the warm orange of the slot
  // it replaces, is a real parrot (Asher: "every parrot"), and is the only
  // gold/orange bird wearing the parrot silhouette.
  { name: 'Sun Conure', color: '#f79a18', hood: '#f7d21b', belly: '#ef6a24', beak: 'hook', cheek: '#f5f0e6', size: 0.92, shape: 'parrot' },
  // --- Macaws & parrots (Asher's wishlist, 2026-08-03). APPEND-ONLY: boards
  // persist numeric roster indices, so never reorder/insert above this line —
  // it would remap existing saved birds. New species go at the end. ---
  { name: 'Blue-and-Gold Macaw', color: '#1c5fb0', belly: '#f4b400', beak: 'hook', cheek: '#f5f0e6', shape: 'parrot' },
  { name: 'Green-winged Macaw', color: '#b3241d', belly: '#b3241d', beak: 'hook', cheek: '#f5f0e6', shape: 'parrot' },
  { name: 'Military Macaw', color: '#5b7a34', belly: '#7a9448', beak: 'hook', cheek: '#e8dcc5', shape: 'parrot' },
  { name: 'Hyacinth Macaw', color: '#33409e', belly: '#3a48b0', beak: 'hook', leg: '#f4c20d', cheek: '#f2c521', size: 1.08, shape: 'parrot' },
  { name: 'Blue-throated Macaw', color: '#1f8fce', belly: '#f2c24b', beak: 'hook', cheek: '#f5f0e6', shape: 'parrot' },
  { name: "Hahn's Macaw", color: '#3a9a4f', hood: '#2456b0', beak: 'hook', cheek: '#f5f0e6', size: 0.82, shape: 'parrot' },
  { name: 'Rainbow Lorikeet', color: '#2f9e44', hood: '#2456b0', belly: '#e8622a', beak: 'hook', size: 0.9, shape: 'parrot' },
  { name: 'Eclectus', color: '#1f9d3a', belly: '#2fae5f', beak: 'hook', cheek: '#f2c24b', shape: 'parrot' },
  { name: 'Eclectus Female', color: '#c0202a', belly: '#5b3b8c', beak: 'hook', cheek: '#f5f0e6', shape: 'parrot' },
  // Asher asked for "a purple" (interview 2026-08-03). Unmistakably purple parrot.
  { name: 'Purple Parrot', color: '#7b3fa0', belly: '#b57edc', beak: 'hook', cheek: '#efe3f7', shape: 'parrot' },
];

// FISH collection — a SECOND collection alongside birds (Noctowl's Fish Mode
// plan). Same engine, same trait vocab. Cute + recognizable, no macabre.
// APPEND-ONLY like ROSTER: boards persist numeric indices, so add at the end.
export const FISH: BirdDef[] = [
  { name: 'Clownfish', color: '#f2792a', shape: 'fish', belly: '#ffffff', stripe: '#ffffff' },
  { name: 'Blue Tang', color: '#2f74d0', shape: 'fish', belly: '#f2c521' },
  { name: 'Yellow Tang', color: '#f2c521', shape: 'fish', size: 0.9 },
  { name: 'Pufferfish', color: '#c9b27a', shape: 'fish', size: 1.1, belly: '#f4ead0', spot: '#8a7a4a' },
  { name: 'Seahorse', color: '#ef86b6', shape: 'fish', size: 0.9 },
  { name: 'Angelfish', color: '#e2e2e6', shape: 'fish', tail: 'fan', size: 1.05, stripe: '#9a9aa2' },
  { name: 'Betta', color: '#8b5cf6', shape: 'fish', tail: 'fan' },
  { name: 'Goldfish', color: '#f2802a', shape: 'fish', belly: '#f7b955' },
  { name: 'Guppy', color: '#22b6cf', shape: 'fish', size: 0.72, tail: 'fan' },
  { name: 'Koi', color: '#f4f1ea', shape: 'fish', belly: '#e8622f', spot: '#e8622f' },
  // --- Asher's picks (fill from what he names) ---
  { name: 'Green Fish', color: '#3fae5f', shape: 'fish', belly: '#bfe8c8' }, // Asher's, 2026-08
  // { name: '???', color: '#______', shape: 'fish' },
  // { name: '???', color: '#______', shape: 'fish' },
];

// One sort mechanic, two collections. `birds` aliases ROSTER for back-compat.
export type CollectionId = 'birds' | 'fish';
export const COLLECTIONS: Record<CollectionId, BirdDef[]> = { birds: ROSTER, fish: FISH };
