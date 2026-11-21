// Verifies earned sticker persistence independently from previews and game saves.
jest.mock('@react-native-async-storage/async-storage', () => {
  let store: Record<string, string> = {};
  return { __esModule: true, default: {
    getItem: jest.fn((key: string) => Promise.resolve(store[key] ?? null)),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; return Promise.resolve(); }),
    __reset: () => { store = {}; },
  } };
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import { discoveryKey, getDiscoveryClue, loadDiscoveries, recordDiscoveries } from './journal';
import { COLLECTIONS } from './roster';

const getItem = AsyncStorage.getItem as jest.Mock;
const setItem = AsyncStorage.setItem as jest.Mock;

beforeEach(() => {
  (AsyncStorage as any).__reset();
  jest.clearAllMocks();
});

test('only explicit awards persist: reading the gallery or clues earns nothing', async () => {
  for (let index = 0; index < COLLECTIONS.birds.length; index++) getDiscoveryClue('birds', index);
  expect(await loadDiscoveries('birds')).toEqual([]);
  expect(setItem).not.toHaveBeenCalled();
});

test('winning species become an idempotent persisted union', async () => {
  expect(await recordDiscoveries('birds', [3, 1, 3])).toEqual([1, 3]);
  expect(await recordDiscoveries('birds', [1, 3])).toEqual([1, 3]);
  expect(setItem).toHaveBeenCalledTimes(1);
  expect(await recordDiscoveries('birds', [2, 1])).toEqual([1, 2, 3]);
  expect(await loadDiscoveries('birds')).toEqual([1, 2, 3]);
  expect(JSON.parse(await AsyncStorage.getItem(discoveryKey('birds')) ?? '')).toEqual({ v: 1, earned: [1, 2, 3] });
});

test('a fresh read reloads saved stickers and keeps collections separate', async () => {
  await AsyncStorage.setItem(discoveryKey('birds'), JSON.stringify({ v: 1, earned: [8, 2] }));
  expect(await loadDiscoveries('birds')).toEqual([2, 8]);
  expect(await loadDiscoveries('fish')).toEqual([]);
  await recordDiscoveries('fish', [2]);
  expect(await loadDiscoveries('birds')).toEqual([2, 8]);
  expect(await loadDiscoveries('fish')).toEqual([2]);
});

test('invalid IDs cannot enter awards or survive a stored-data reload', async () => {
  const invalid = [-1, 0.5, NaN, Infinity, COLLECTIONS.fish.length, '2', null];
  await AsyncStorage.setItem(discoveryKey('fish'), JSON.stringify({ v: 1, earned: [1, 1, ...invalid] }));
  expect(await loadDiscoveries('fish')).toEqual([1]);
  expect(await recordDiscoveries('fish', [0, ...invalid] as number[])).toEqual([0, 1]);
});

test.each(['{partial', '{}', '{"v":2,"earned":[1]}', '{"v":1,"earned":"all"}'])
('corrupt or unsupported discovery data remains safe: %s', async raw => {
  await AsyncStorage.setItem(discoveryKey('birds'), raw);
  expect(await loadDiscoveries('birds')).toEqual([]);
});

test('immediate duplicate calls and overlapping wins cannot overwrite stickers', async () => {
  let finishWrite!: () => void;
  const storedWrite = setItem.getMockImplementation()!;
  setItem.mockImplementationOnce((key, value) => new Promise<void>(resolve => {
    finishWrite = () => { storedWrite(key, value); resolve(); };
  }));
  const first = recordDiscoveries('birds', [0, 1]);
  // Let the first read enter its deliberately slow write.
  await Promise.resolve();
  await Promise.resolve();
  const duplicate = recordDiscoveries('birds', [0, 1]);
  const overlapping = recordDiscoveries('birds', [1, 2]);
  expect(getItem).toHaveBeenCalledTimes(1);
  const reloading = loadDiscoveries('birds');
  finishWrite();
  expect(await first).toEqual([0, 1]);
  expect(await duplicate).toEqual([0, 1]);
  expect(await overlapping).toEqual([0, 1, 2]);
  expect(await reloading).toEqual([0, 1, 2]);
  expect(setItem).toHaveBeenCalledTimes(2);
});

test('a slow bird save does not hold up fish discoveries', async () => {
  let finishWrite!: () => void;
  const storedWrite = setItem.getMockImplementation()!;
  setItem.mockImplementationOnce((key, value) => new Promise<void>(resolve => {
    finishWrite = () => { storedWrite(key, value); resolve(); };
  }));
  const birds = recordDiscoveries('birds', [4]);
  await Promise.resolve();
  await Promise.resolve();
  expect(await recordDiscoveries('fish', [3])).toEqual([3]);
  finishWrite();
  expect(await birds).toEqual([4]);
});

test('failed reads do not overwrite progress and the queue recovers after storage failure', async () => {
  await recordDiscoveries('birds', [1]);
  const warning = jest.spyOn(console, 'warn').mockImplementation(() => {});
  getItem.mockRejectedValueOnce(new Error('offline storage'));
  expect(await recordDiscoveries('birds', [2])).toEqual([]);
  expect(setItem).toHaveBeenCalledTimes(1);
  setItem.mockRejectedValueOnce(new Error('full storage'));
  expect(await recordDiscoveries('birds', [2])).toEqual([1]);
  expect(await recordDiscoveries('birds', [2])).toEqual([1, 2]);
  warning.mockRestore();
});

test('every friend has a clue, facts link to their source, and fantasy birds are labelled', () => {
  for (const collection of ['birds', 'fish'] as const) {
    COLLECTIONS[collection].forEach((_, index) => {
      const clue = getDiscoveryClue(collection, index);
      expect(clue.text.length).toBeGreaterThan(12);
      if (clue.source) {
        expect(clue.source).toMatch(/^https:\/\//);
        expect(clue.sourceLabel).toBeTruthy();
      } else {
        expect(clue.text).toMatch(/our drawing|imaginative|make-believe/);
      }
    });
  }
  const purple = COLLECTIONS.birds.findIndex(bird => bird.name === 'Purple Parrot');
  expect(getDiscoveryClue('birds', purple).text).toMatch(/imaginary|imaginative|make-believe/i);
});


test('every real fish has its own sourced journal fact and the imaginary fish is clearly labelled',()=>{
  for (let id=0;id<COLLECTIONS.fish.length;id++) {
    const entry=getDiscoveryClue('fish',id);
    expect(entry.text.length).toBeGreaterThan(15);
    if(COLLECTIONS.fish[id].name==='Green Fish') expect(entry.text).toMatch(/make-believe|imaginary/i);
    else { expect(entry.source).toMatch(/^https:\/\//); expect(entry.sourceLabel).toBeTruthy(); }
  }
});


test('all52 bird discoveries have specific sourced facts, with imaginary parrots clearly identified',()=>{
  const texts=new Set<string>();
  for(let id=0;id<COLLECTIONS.birds.length;id++){
    const clue=getDiscoveryClue('birds',id);
    expect(clue.source).toMatch(/^https:\/\//);
    expect(clue.sourceLabel).toBeTruthy();
    expect(clue.text).not.toMatch(/^Look for/);
    texts.add(clue.text);
    if(['Parrot','Purple Parrot'].includes(COLLECTIONS.birds[id].name))expect(clue.text).toMatch(/imaginary|imaginative|make-believe|made.up/i);
  }
  expect(texts.size).toBeGreaterThan(40);
});
