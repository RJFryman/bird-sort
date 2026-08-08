// In-memory AsyncStorage stub so loadGame/saveGame round-trip without a device.
jest.mock('@react-native-async-storage/async-storage', () => {
  let store: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      getItem: (k: string) => Promise.resolve(store[k] ?? null),
      setItem: (k: string, v: string) => {
        store[k] = v;
        return Promise.resolve();
      },
      removeItem: (k: string) => {
        delete store[k];
        return Promise.resolve();
      },
      __reset: () => {
        store = {};
      },
    },
  };
});

import {
  serialize,
  deserialize,
  toResumeState,
  saveGame,
  loadGame,
  SAVE_KEY,
} from './storage';
import { State } from './state';
import { Board } from './game';

const solved: Board = [[3, 3, 3, 3], []]; // a won board (one species full, rest empty)
const mid: Board = [[0, 1], [1, 0], []];

function fullState(board: Board, over: Partial<State> = {}): State {
  return { level: 4, maxLevel: 6, collection: 'birds', board, history: [board, board], selected: 1, won: true, ...over };
}

test('serialize/deserialize round-trips the resumable facts', () => {
  const s = fullState(mid);
  const back = deserialize(serialize(s));
  expect(back).toEqual({ v: 1, level: 4, maxLevel: 6, board: mid });
});

test('save persists ONLY resumable facts — no history/selected/won bloat', () => {
  const raw = serialize(fullState(mid));
  const obj = JSON.parse(raw);
  expect(Object.keys(obj).sort()).toEqual(['board', 'level', 'maxLevel', 'v']);
  expect('history' in obj).toBe(false);
  expect('selected' in obj).toBe(false);
  expect('won' in obj).toBe(false);
});

test('deserialize is defensive: missing/corrupt/partial/old never throws -> null', () => {
  expect(deserialize(null)).toBeNull();
  expect(deserialize('')).toBeNull();
  expect(deserialize('{not json')).toBeNull(); // partial write
  expect(deserialize('{"v":1,"level":2}')).toBeNull(); // missing board
  expect(deserialize('{"v":99,"level":2,"maxLevel":2,"board":[[]]}')).toBeNull(); // unknown version
  expect(deserialize('{"v":1,"level":"x","maxLevel":2,"board":[[]]}')).toBeNull(); // bad type
  expect(deserialize('{"v":1,"level":2,"maxLevel":2,"board":[[1,"a"]]}')).toBeNull(); // bad board cell
});

test('toResumeState RECOMPUTES won from the board (the dead-end-board fix)', () => {
  // saved on a solved board -> resume must show won:true (win overlay), not a dead board
  const resumed = toResumeState({ v: 1, level: 2, maxLevel: 3, board: solved })!;
  expect(resumed.won).toBe(true);
  expect(resumed.history).toEqual([]);
  expect(resumed.selected).toBeNull();

  // saved mid-play -> won:false
  const midResume = toResumeState({ v: 1, level: 2, maxLevel: 3, board: mid })!;
  expect(midResume.won).toBe(false);
});

test('toResumeState clamps level>=1 and never regresses unlocks', () => {
  const r = toResumeState({ v: 1, level: 0, maxLevel: 9, board: mid })!;
  expect(r.level).toBe(1);
  expect(r.maxLevel).toBe(9);
});

test('toResumeState(null) is null', () => {
  expect(toResumeState(null)).toBeNull();
});

test('saveGame -> loadGame resume-after-reload: level/maxLevel/board survive', async () => {
  await saveGame(fullState(mid, { level: 5, maxLevel: 8 }));
  const resumed = await loadGame();
  expect(resumed).not.toBeNull();
  expect(resumed!.level).toBe(5);
  expect(resumed!.maxLevel).toBe(8);
  expect(resumed!.board).toEqual(mid);
  // transient state rebuilt fresh
  expect(resumed!.history).toEqual([]);
  expect(resumed!.selected).toBeNull();
});

test('loadGame with nothing saved returns null (fresh start, not a crash)', async () => {
  const AS = require('@react-native-async-storage/async-storage').default;
  AS.__reset();
  expect(await loadGame()).toBeNull();
});

test('SAVE_KEY is the versioned key', () => {
  expect(SAVE_KEY).toBe('bird-sort-save-v1');
});

test('saves are per-collection: birds and fish do not clobber each other', async () => {
  const AS = require('@react-native-async-storage/async-storage').default;
  AS.__reset();
  await saveGame({ level: 3, maxLevel: 3, board: mid, collection: 'birds' });
  await saveGame({ level: 7, maxLevel: 8, board: solved, collection: 'fish' });
  const b = (await loadGame('birds'))!;
  const f = (await loadGame('fish'))!;
  expect(b.level).toBe(3);
  expect(b.collection).toBe('birds');
  expect(f.level).toBe(7);
  expect(f.collection).toBe('fish');
});

test('pre-Fish-Mode save (bare key) migrates into the birds slot', async () => {
  const AS = require('@react-native-async-storage/async-storage').default;
  AS.__reset();
  await AS.setItem(SAVE_KEY, JSON.stringify({ v: 1, level: 4, maxLevel: 6, board: mid }));
  const b = (await loadGame('birds'))!;
  expect(b.level).toBe(4);
  expect(b.maxLevel).toBe(6);
  expect(b.collection).toBe('birds');
  // fish slot is untouched by the migration
  expect(await loadGame('fish')).toBeNull();
});
