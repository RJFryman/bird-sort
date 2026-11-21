// Owns earned discovery stickers, serialized persistence, and sourced nature clues.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLLECTIONS, CollectionId } from './roster';
import { FISH_KNOWLEDGE } from './fish-knowledge';
import { BIRD_KNOWLEDGE } from './bird-knowledge';

export const discoveryKey = (collection: CollectionId) => `bird-sort-discoveries-v1:${collection}`;
const writes: Partial<Record<CollectionId, Promise<number[]>>> = {};

function validSpecies(collection: CollectionId, values: unknown): number[] {
  if (!Array.isArray(values)) return [];
  return [...new Set(values.filter((id): id is number =>
    typeof id === 'number' && Number.isInteger(id) && id >= 0 && id < COLLECTIONS[collection].length,
  ))].sort((a, b) => a - b);
}

function parseDiscoveries(collection: CollectionId, raw: string | null): number[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object' || !('v' in data) || data.v !== 1) return [];
    return validSpecies(collection, 'earned' in data ? data.earned : []);
  } catch {
    return [];
  }
}

export async function loadDiscoveries(collection: CollectionId): Promise<number[]> {
  await writes[collection];
  try {
    return parseDiscoveries(collection, await AsyncStorage.getItem(discoveryKey(collection)));
  } catch {
    return [];
  }
}

/** Call only for species on an actually won board; browsing never earns stickers. */
export function recordDiscoveries(collection: CollectionId, species: number[]): Promise<number[]> {
  const additions = validSpecies(collection, species);
  const previous = writes[collection] ?? Promise.resolve([]);
  const next = previous.then(async () => {
    // Reading inside the queue keeps simultaneous wins/StrictMode calls from
    // overwriting one another. A failed read must never overwrite an old save.
    let existing: number[];
    try {
      existing = parseDiscoveries(collection, await AsyncStorage.getItem(discoveryKey(collection)));
    } catch {
      console.warn('[journal] Could not read discovery stickers.');
      return [];
    }
    const earned = validSpecies(collection, [...existing, ...additions]);
    if (earned.length === existing.length) return existing;
    try {
      await AsyncStorage.setItem(discoveryKey(collection), JSON.stringify({ v: 1, earned }));
      return earned;
    } catch {
      console.warn('[journal] Could not save discovery stickers.');
      return existing;
    }
  });
  writes[collection] = next;
  void next.then(() => {
    if (writes[collection] === next) delete writes[collection];
  });
  return next;
}

export type DiscoveryClue = { text: string; source?: string; sourceLabel?: string };

// Both journals have primary-sourced entries; imagined game creatures say so.
export function getDiscoveryClue(collection: CollectionId, index: number): DiscoveryClue {
  const friend = COLLECTIONS[collection][index];
  if (!friend) return { text: 'Choose a friend to take a closer look.' };
  const knowledge = collection === 'birds' ? BIRD_KNOWLEDGE : FISH_KNOWLEDGE;
  return knowledge[friend.name] ?? { text: 'Look closely at this friend’s shape and colors.' };
}
