// Owns the no-lookalike, exact-count and roster-reachability deal contract.
import { COLLECTIONS, CollectionId, ROSTER } from './roster';
import { pickDistinctSpecies, speciesConflict, STARTER_SPECIES } from './species-selection';

function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function index(name: string, collection: CollectionId = 'birds'): number {
  const found = COLLECTIONS[collection].findIndex(species => species.name === name);
  if (found < 0) throw new Error(`Unknown test species ${name}`);
  return found;
}

function assertDistinct(deal: number[], count: number, collection: CollectionId): void {
  expect(deal).toHaveLength(count);
  expect(new Set(deal).size).toBe(count);
  for (let i = 0; i < deal.length; i++) {
    expect(Number.isInteger(deal[i])).toBe(true);
    expect(deal[i]).toBeGreaterThanOrEqual(0);
    expect(deal[i]).toBeLessThan(COLLECTIONS[collection].length);
    for (let j = i + 1; j < deal.length; j++) {
      expect(speciesConflict(deal[i], deal[j], collection)).toBe(false);
    }
  }
}

test('red parrots never require tiny wing markings as the sorting clue', () => {
  const red = ['Scarlet Macaw', 'Green-winged Macaw', 'Rosella', 'King Parrot', 'Eclectus Female'];
  for (const a of red) for (const b of red) {
    expect(speciesConflict(index(a), index(b), 'birds')).toBe(true);
  }
});

test('similar illustration families conflict regardless of the roster color', () => {
  const pairs = [
    ['Blue-and-Gold Macaw', 'Blue-throated Macaw'],
    ['Blue Macaw', 'Hyacinth Macaw'],
    ['Macaw', 'Amazon'],
    ["Hahn's Macaw", 'Parakeet'],
    ['Military Macaw', 'Eclectus'],
    ['Parrot', 'Purple Parrot'],
    ['Kea', 'Kakapo'],
    ['Canary', 'Goldfinch'],
    ['Dove', 'Seagull'],
  ];
  for (const [a, b] of pairs) {
    expect(speciesConflict(index(a), index(b), 'birds')).toBe(true);
    expect(speciesConflict(index(b), index(a), 'birds')).toBe(true);
  }
});

test('large silhouette and color patches keep other species available together', () => {
  // Gray body/yellow face/orange cheek versus cream body/face, and pink Galah.
  for (const [a, b] of [['Cockatiel', 'Cockatoo'], ['Cockatoo', 'Galah'],
    ['Cardinal', 'Scarlet Macaw'], ['Swan', 'Canary'], ['Budgie', 'Toucan']]) {
    expect(speciesConflict(index(a), index(b), 'birds')).toBe(false);
  }
});

test('1000 seeded deals at every size from two through ten contain no forbidden pairs', () => {
  for (let seed = 0; seed < 1000; seed++) {
    const rng = seeded(seed);
    for (let count = 2; count <= 10; count++) {
      assertDistinct(pickDistinctSpecies(count, 'birds', rng), count, 'birds');
    }
  }
});

test('every one of the 52 saved bird indices remains reachable in easy and hard deals', () => {
  expect(ROSTER).toHaveLength(52);
  for (const count of [2, 4, 10]) {
    const reached = new Set<number>();
    for (let seed = 0; seed < 1000; seed++) {
      for (const species of pickDistinctSpecies(count, 'birds', seeded(seed))) reached.add(species);
    }
    expect([...reached].sort((a, b) => a - b)).toEqual(ROSTER.map((_, i) => i));
  }
});

test('fish can deal ten exact species while keeping the two orange fish apart', () => {
  expect(speciesConflict(index('Clownfish', 'fish'), index('Goldfish', 'fish'), 'fish')).toBe(true);
  const reached = new Set<number>();
  for (let seed = 0; seed < 1000; seed++) {
    const deal = pickDistinctSpecies(10, 'fish', seeded(seed));
    assertDistinct(deal, 10, 'fish');
    for (const species of deal) reached.add(species);
  }
  expect(reached.size).toBe(COLLECTIONS.fish.length);
});

test('the same random sequence gives the same saved indices without changing either roster', () => {
  const before = JSON.stringify(COLLECTIONS);
  for (const collection of ['birds', 'fish'] as const) {
    expect(pickDistinctSpecies(10, collection, seeded(423))).toEqual(pickDistinctSpecies(10, collection, seeded(423)));
    assertDistinct(pickDistinctSpecies(10, collection, () => 0), 10, collection);
    assertDistinct(pickDistinctSpecies(10, collection, () => 0.999999), 10, collection);
  }
  expect(JSON.stringify(COLLECTIONS)).toBe(before);
});

test('impossible deals throw instead of returning fewer species or allowing lookalikes', () => {
  expect(() => pickDistinctSpecies(COLLECTIONS.fish.length, 'fish', seeded(1))).toThrow(/visually distinct fish/);
  expect(() => pickDistinctSpecies(52, 'birds', seeded(1))).toThrow(/52.*visually distinct birds/);
  for (const invalid of [-1, 2.5, NaN, Infinity, 53]) {
    expect(() => pickDistinctSpecies(invalid, 'birds')).toThrow(/Cannot deal/);
  }
  expect(pickDistinctSpecies(0, 'birds')).toEqual([]);
});


test('the expanded reef preserves all original saved fish positions and has32 unique names',()=>{
  expect(COLLECTIONS.fish.slice(0,11).map(f=>f.name)).toEqual(['Clownfish','Blue Tang','Yellow Tang','Pufferfish','Seahorse','Angelfish','Betta','Goldfish','Guppy','Koi','Green Fish']);
  expect(COLLECTIONS.fish).toHaveLength(32);
  expect(new Set(COLLECTIONS.fish.map(f=>f.name)).size).toBe(32);
});
test('new deals separate the extra blue, pink and pale bird families',()=>{
  for(const names of [['Hyacinth Macaw','Bluejay'],['Galah','Flamingo'],['Pelican','Cockatoo'],['Robin','Oriole']])
    expect(speciesConflict(index(names[0]),index(names[1]),'birds')).toBe(true);
});


test('Hard-size lookalike pairs from the independent review are excluded',()=>{
  for(const [a,b,c] of [["Hahn's Macaw",'Rainbow Lorikeet','birds'],['Kea','Military Macaw','birds'],['Parakeet','Lovebird','birds'],['Rainbow Trout','Sturgeon','fish']] as const)
    expect(speciesConflict(index(a,c),index(b,c),c)).toBe(true);
});


test('reviewed green-parrot and open-water blue lookalikes cannot share new deals',()=>{
  for(const [a,b,c]of [['Lovebird','Amazon','birds'],['Macaw','Lovebird','birds'],['Atlantic Bluefin Tuna','Sailfish','fish'],['Flying Fish','Neon Tetra','fish'],['Flying Fish','Guppy','fish']]as const)
    expect(speciesConflict(index(a,c),index(b,c),c)).toBe(true);
});

// Early gentle deals must teach clear silhouettes without reducing the later roster.
test('starter deals stay vivid, exact and compatible for both worlds', () => {
  for (const collection of ['birds', 'fish'] as const) for (let seed = 0; seed < 100; seed++) {
    const deal = pickDistinctSpecies(2, collection, seeded(seed), true);
    assertDistinct(deal, 2, collection);
    for (const id of deal) expect(STARTER_SPECIES[collection]).toContain(COLLECTIONS[collection][id].name);
  }
});
test('small-size review pairs never share a new board', () => {
  for (const [a,b,c] of [
    ['Whale Shark','Atlantic Bluefin Tuna','fish'],['Great White Shark','Rainbow Trout','fish'],
    ['Great White Shark','Neon Tetra','fish'],['Parrot','Hyacinth Macaw','birds'],
    ['Parrot','Blue Macaw','birds'],['Sun Conure','Budgie','birds'],
    ['Sun Conure','Rosella','birds'],['Sun Conure','Lovebird','birds'],
    ['Galah','African Grey','birds'],['African Grey','Cockatiel','birds'],
  ] as const) expect(speciesConflict(index(a,c),index(b,c),c)).toBe(true);
});

test('reviewed tall-fin, teal-shark and warm koi pairs stay separate', () => {
  for (const [a,b] of [['Sailfish','Betta'],['Sailfish','Flying Fish'],
    ['Hammerhead Shark','Whale Shark'],['Koi','Clownfish'],['Koi','Goldfish']])
    expect(speciesConflict(index(a,'fish'),index(b,'fish'),'fish')).toBe(true);
});
