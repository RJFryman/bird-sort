// Owns species combinations that remain distinguishable at the board's small art size.
import { COLLECTIONS, CollectionId } from './roster';

// These are illustration families, not roster.color buckets. ParrotArt.tsx,
// SongbirdArt.tsx and WildBirdArt.tsx own the actual colors and silhouettes;
// update this list when those illustrations change. Names preserve saved indices.
const LOOKALIKE_FAMILIES: Record<CollectionId, readonly (readonly string[])[]> = {
  birds: [
    // Similar red heads/bodies and hooked beaks; wing details are too small to rely on.
    ['Scarlet Macaw', 'Green-winged Macaw', 'Rosella', 'King Parrot', 'Eclectus Female'],
    // Long or medium tails with broad green bodies. Yellow caps/red shoulders alone
    // shouldn't be the deciding clue, even where the species' proportions differ.
    ['Macaw', 'Military Macaw', "Hahn's Macaw", 'Amazon', 'Parakeet', 'Eclectus'],
    // Includes both blue/yellow macaws and the largely blue versions of this outline.
    ['Blue Macaw', 'Blue-and-Gold Macaw', 'Blue-throated Macaw', 'Hyacinth Macaw', 'Bluejay', 'Bluebird'],
    // The teal breast/long tail and lilac breast/round body differ, but conservatively
    // avoid asking a child to sort two purple parrots on the same board.
    ['Parrot', 'Purple Parrot', 'Hyacinth Macaw', 'Blue Macaw'],
    ['Kea', 'Kakapo', 'Military Macaw'],
    ["Hahn's Macaw", 'Rainbow Lorikeet'],
    ['Parakeet', 'Lovebird', 'Budgie'],
    ['Lovebird', 'Amazon', 'Macaw'],
    ['Canary', 'Goldfinch'],
    ['Dove', 'Seagull', 'Swan', 'Pelican', 'Cockatoo'],
    ['Galah', 'Flamingo', 'Eclectus Female'],
    ['Robin', 'Oriole'],
    ['Sun Conure', 'Budgie', 'Rosella', 'Lovebird'],
    ['Galah', 'African Grey', 'Cockatiel'],
  ],
  // New silhouettes still avoid close warm-color, striped, shark and ray families.
  // At least ten compatible choices remain across the expanded collection.
  fish: [
    ['Clownfish', 'Goldfish', 'Copperband Butterflyfish'],
    ['Yellow Tang', 'Yellow Longnose Butterflyfish', 'Longhorn Cowfish', 'Pufferfish'],
    ['Angelfish', 'Moorish Idol', 'Picasso Triggerfish'],
    ['Great White Shark', 'Hammerhead Shark', 'Atlantic Bluefin Tuna', 'Sturgeon'],
    ['Manta Ray', 'Spotted Eagle Ray'],
    ['Rainbow Trout', 'Sturgeon', 'Hammerhead Shark'],
    ['Blue Tang', 'Royal Blue Discus'],
    ['Atlantic Bluefin Tuna', 'Sailfish'],
    ['Whale Shark', 'Atlantic Bluefin Tuna', 'Great White Shark', 'Sturgeon'],
    ['Great White Shark', 'Rainbow Trout', 'Neon Tetra'],
    ['Flying Fish', 'Guppy', 'Neon Tetra'],
    ['Sailfish', 'Betta'],
    ['Sailfish', 'Flying Fish'],
    ['Hammerhead Shark', 'Whale Shark'],
    ['Koi', 'Clownfish', 'Goldfish'],
  ],
};

// The first three gentle levels introduce bold colors and very different outlines.
export const STARTER_SPECIES: Record<CollectionId, readonly string[]> = {
  birds: ['Cardinal', 'Bluebird', 'Canary', 'Toucan', 'Penguin', 'Owl', 'Flamingo'],
  fish: ['Clownfish', 'Blue Tang', 'Yellow Tang', 'Seahorse', 'Betta', 'Goldfish', 'Pufferfish'],
};

/** True for duplicate species or a pair that must never share a new deal. */
export function speciesConflict(a: number, b: number, collection: CollectionId): boolean {
  if (a === b) return true;
  const roster = COLLECTIONS[collection];
  const first = roster[a]?.name, second = roster[b]?.name;
  return LOOKALIKE_FAMILIES[collection].some(family =>
    family.includes(first) && family.includes(second));
}

function shuffle(candidates: number[], rng: () => number): void {
  for (let i = candidates.length - 1; i > 0; i--) {
    const random = rng();
    if (!Number.isFinite(random) || random < 0 || random >= 1) {
      throw new Error('Species selection requires an RNG result between 0 (inclusive) and 1 (exclusive).');
    }
    const j = Math.floor(random * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }
}

// A partition into conflicting cliques gives a safe upper bound: any valid deal
// can take at most one from each clique, including when conflict families overlap.
function availableSlots(candidates: number[], conflicts: (a: number, b: number) => boolean): number {
  const cliques: number[][] = [];
  for (const candidate of candidates) {
    const clique = cliques.find(group => group.every(other => conflicts(candidate, other)));
    if (clique) clique.push(candidate);
    else cliques.push([candidate]);
  }
  return cliques.length;
}

function choose(candidates: number[], count: number, conflicts: (a: number, b: number) => boolean): number[] | null {
  if (count === 0) return [];
  if (candidates.length < count || availableSlots(candidates, conflicts) < count) return null;

  // Try the shuffled order greedily. If future art adds overlapping conflict
  // families, backtrack over the finite candidate set instead of weakening a rule.
  for (let i = 0; i <= candidates.length - count; i++) {
    const candidate = candidates[i];
    const remaining = candidates.slice(i + 1).filter(other => !conflicts(candidate, other));
    const rest = choose(remaining, count - 1, conflicts);
    if (rest) return [candidate, ...rest];
  }
  return null;
}

/** Pick exact, unique, compatible saved-roster indices without excluding species. */
export function pickDistinctSpecies(count: number, collection: CollectionId, rng: () => number = Math.random, starter = false): number[] {
  const roster = COLLECTIONS[collection];
  if (!Number.isInteger(count) || count < 0 || count > roster.length) {
    throw new Error(`Cannot deal ${count} ${collection} species from a collection of ${roster.length}.`);
  }
  if (count === 0) return [];
  const candidates = roster.map((_, index) => index).filter(index =>
    !starter || STARTER_SPECIES[collection].includes(roster[index].name));
  shuffle(candidates, rng);
  const chosen = choose(candidates, count, (a, b) => speciesConflict(a, b, collection));
  if (!chosen) {
    throw new Error(`Cannot deal ${count} visually distinct ${collection} species: the illustration conflict rules leave too few compatible choices.`);
  }
  return chosen;
}
