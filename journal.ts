// Owns earned discovery stickers, serialized persistence, and sourced nature clues.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLLECTIONS, CollectionId } from './roster';

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

// Nature facts checked against these primary institutions. Generic roster names
// use observations about our illustrations rather than invented species biology.
const facts: Partial<Record<CollectionId, Record<string, DiscoveryClue>>> = {
  birds: {
    Flamingo: {
      text: 'Flamingos get their pink color from the food they eat!',
      source: 'https://sdzwildlifeexplorers.org/animals/flamingo',
      sourceLabel: 'San Diego Zoo',
    },
    Kea: {
      text: 'Kea are curious parrots from New Zealand. They live in mountains and forests.',
      source: 'https://www.doc.govt.nz/nature/native-animals/birds/birds-a-z/kea/',
      sourceLabel: 'New Zealand Department of Conservation',
    },
    Kakapo: {
      text: 'Kākāpō are parrots that cannot fly. They are awake at night!',
      source: 'https://www.doc.govt.nz/kakapo/',
      sourceLabel: 'New Zealand Department of Conservation',
    },
    'Scarlet Macaw': {
      text: 'Scarlet macaws sleep together in tall trees and nest in tree hollows.',
      source: 'https://parrots.org/encyclopedia/scarlet-macaw/',
      sourceLabel: 'World Parrot Trust',
    },
    'Blue-and-Gold Macaw': {
      text: 'Blue-and-gold macaws are bright blue above and golden yellow below.',
      source: 'https://parrots.org/encyclopedia/blue-and-yellow-macaw/',
      sourceLabel: 'World Parrot Trust',
    },
    'Hyacinth Macaw': {
      text: 'A hyacinth macaw can spread its wings wider than four feet!',
      source: 'https://animals.sandiegozoo.org/animals/macaw',
      sourceLabel: 'San Diego Zoo',
    },
    'Rainbow Lorikeet': {
      text: 'Rainbow lorikeets find nectar and pollen in flowers.',
      source: 'https://parrots.org/encyclopedia/rainbow-lorikeet/',
      sourceLabel: 'World Parrot Trust',
    },
  },
  fish: {
    Clownfish: {
      text: 'Clownfish can hide among a sea anemone’s stinging tentacles.',
      source: 'https://ocean.si.edu/ocean-life/fish/clownfish-their-host-anemone',
      sourceLabel: 'Smithsonian Ocean',
    },
    Seahorse: {
      text: 'A father seahorse carries the eggs in a special pouch!',
      source: 'https://oceanservice.noaa.gov/facts/seahorse.html',
      sourceLabel: 'NOAA Ocean Service',
    },
  },
};

export function getDiscoveryClue(collection: CollectionId, index: number): DiscoveryClue {
  const bird = COLLECTIONS[collection][index];
  if (!bird) return { text: 'Choose a friend to take a closer look.' };
  const fact = facts[collection]?.[bird.name];
  if (fact) return fact;
  if (bird.name === 'Purple Parrot' || bird.name === 'Parrot') {
    return { text: 'Our purple parrot is an imaginative game bird. Look for its curved beak!' };
  }
  if (bird.name === 'Green Fish') return { text: 'A make-believe green fish for our game. Look for its round eye!' };
  if (collection === 'birds' && bird.name.includes('Macaw')) {
    return {
      text: 'Macaws use their strong, curved beaks to crack nuts and seeds.',
      source: 'https://animals.sandiegozoo.org/animals/macaw',
      sourceLabel: 'San Diego Zoo',
    };
  }
  const detail = bird.shape === 'fish' ? (bird.stripe ? 'striped body' : bird.spot ? 'spotted body' : bird.tail === 'fan' ? 'fan-shaped tail' : 'fins and round eye')
    : bird.shape === 'toucan' ? 'huge beak'
    : bird.shape === 'penguin' ? 'flippers and white belly'
    : bird.shape === 'cockatoo' || bird.crest ? 'feather crest'
    : bird.shape === 'hummingbird' ? 'long, thin beak'
    : bird.beak === 'pouch' ? 'long beak and pouch'
    : bird.beak === 'hook' ? 'curved beak'
    : bird.neck ? 'long neck'
    : bird.tail === 'fan' ? 'fan-shaped tail'
    : 'wings and tail';
  return { text: `Look for the ${detail} in our drawing!` };
}
