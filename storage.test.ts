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
  saveKey,
  backupKey,
} from './storage';
import { State, reducer } from './state';
import { COLLECTIONS } from './roster';
import { Board } from './game';

const solved: Board = [[3, 3, 3, 3], []]; // a won board (one species full, rest empty)
const mid: Board = [[0, 1], [1, 0], []];

function fullState(board: Board, over: Partial<State> = {}): State {
  return { level: 4, maxLevel: 6, collection: 'birds', board, history: [board, board], selected: 1, won: true, ...over };
}

test('serialize/deserialize round-trips the resumable facts', () => {
  const s = fullState(mid);
  const back = deserialize(serialize(s));
  expect(back).toEqual({ v: 2, level: 4, maxLevel: 6, board: mid, initialBoard: null, difficulty: 'easy' });
});

test('save persists ONLY resumable facts — no history/selected/won bloat', () => {
  const raw = serialize(fullState(mid));
  const obj = JSON.parse(raw);
  expect(Object.keys(obj).sort()).toEqual(['board', 'difficulty', 'initialBoard', 'level', 'maxLevel', 'v']);
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

const AS = require('@react-native-async-storage/async-storage').default;
beforeEach(() => AS.__reset());
afterEach(() => jest.restoreAllMocks());

const legacy = (board = mid, over = {}) => JSON.stringify({ v: 1, level: 4, maxLevel: 6, board, ...over });

test('original deal and Hard choice survive a solved save, reload, and exact Restart', async () => {
  const initialBoard: Board = [[3, 3, 3], [3], []];
  const board: Board = [[3, 3, 3, 3], [], []];
  await saveGame(fullState(board, { initialBoard, difficulty: 'hard' }));
  const resumed = (await loadGame())!;
  expect(resumed.won).toBe(true);
  expect(resumed.difficulty).toBe('hard');
  const restarted = reducer(resumed, { type: 'RESTART' });
  expect(restarted.board).toEqual(initialBoard);
  expect(restarted.won).toBe(false);
  expect(restarted.history).toEqual([]);
});

test('legacy Hard boards retain their board and unlocks, infer Hard, and only redeal on Restart', async () => {
  const board = Array.from({ length: 5 }, (_, id) => [id, id, id, id]);
  board.push([], []);
  await AS.setItem(saveKey('birds'), legacy(board, { level: 1, maxLevel: 28 }));
  const resumed = (await loadGame())!;
  expect(resumed.board).toEqual(board);
  expect(resumed.difficulty).toBe('hard');
  expect(resumed.initialBoard).toBeUndefined();
  expect(resumed.maxLevel).toBe(28);
  await saveGame(resumed);
  const migrated = (await loadGame())!;
  expect(migrated.board).toEqual(board);
  expect(JSON.parse(await AS.getItem(saveKey('birds'))).v).toBe(2);
  const restarted = reducer(migrated, { type: 'RESTART' });
  expect(restarted.won).toBe(false);
  expect(restarted.initialBoard).toEqual(restarted.board);
  expect(restarted.maxLevel).toBe(28);
});

test.each([
  [], [[]], [[], []], [[-1], []], [[0.5], []], [[Number.MAX_SAFE_INTEGER + 1], []],
  [[null], []], [[0, 0, 0, 0, 0], []], Array.from({ length: 55 }, () => [0]),
].map(board => [board]))('rejects malformed or unsafe board %j', board => {
  expect(deserialize(legacy(board as Board))).toBeNull();
});

test('validates roster IDs against the collection and accepts legacy last roster index', () => {
  const lastBird = COLLECTIONS.birds.length - 1;
  const lastFish = COLLECTIONS.fish.length - 1;
  expect(deserialize(legacy([[lastBird], []]))).not.toBeNull();
  expect(deserialize(legacy([[lastFish], []]), 'fish')).not.toBeNull();
  expect(deserialize(legacy([[lastBird], []]), 'fish')).toBeNull();
  expect(deserialize(legacy([[COLLECTIONS.birds.length], []]))).toBeNull();
});

test.each([{ level: 1.5 }, { maxLevel: 2.5 }, { level: Number.MAX_SAFE_INTEGER + 1 }])(
  'rejects unsafe progress metadata %j', over => expect(deserialize(legacy(mid, over))).toBeNull(),
);

test('v2 requires a valid difficulty and a start board with the same pieces and branch count', () => {
  const good = JSON.parse(serialize(fullState(mid, { initialBoard: mid })));
  expect(deserialize(JSON.stringify(good))).not.toBeNull();
  for (const change of [
    { difficulty: 'expert' }, { difficulty: undefined }, { initialBoard: undefined },
    { initialBoard: [[0, 0], [0, 0], []] }, { initialBoard: [[0, 1, 1, 0], []] },
    { initialBoard: [[-1], [], []] },
  ]) expect(deserialize(JSON.stringify({ ...good, ...change }))).toBeNull();
});

test('corrupt primary recovers the last-good board and the greatest saved unlock', async () => {
  await saveGame(fullState(mid, { maxLevel: 9 }));
  await saveGame(fullState(solved, { maxLevel: 30 }));
  await AS.setItem(saveKey('birds'), '{partial');
  const resumed = (await loadGame())!;
  expect(resumed.board).toEqual(mid);
  expect(resumed.maxLevel).toBe(30);
});

test('invalid primary start board preserves its valid unlock metadata when recovering backup', async () => {
  await saveGame(fullState(mid));
  await AS.setItem(saveKey('birds'), JSON.stringify({
    v: 2, level: 12, maxLevel: 50, board: mid, difficulty: 'easy', initialBoard: solved,
  }));
  const resumed = (await loadGame())!;
  expect(resumed.board).toEqual(mid);
  expect(resumed.maxLevel).toBe(50);
  await saveGame({ ...resumed, level: 2, maxLevel: 2 });
  expect((await loadGame())!.maxLevel).toBe(50);
});

test('unknown versions fall back to a supported backup without adopting unknown metadata', async () => {
  await AS.setItem(backupKey('birds'), legacy());
  await AS.setItem(saveKey('birds'), JSON.stringify({ v: 99, level: 20, maxLevel: 99, board: solved }));
  expect((await loadGame())!.maxLevel).toBe(6);
  expect((await loadGame())!.board).toEqual(mid);
});

test('corrupt or absent backup leaves a good primary intact; corrupt primary alone cannot resume', async () => {
  await AS.setItem(saveKey('fish'), legacy());
  expect((await loadGame('fish'))!.board).toEqual(mid);
  await AS.setItem(backupKey('fish'), 'broken');
  expect((await loadGame('fish'))!.board).toEqual(mid);
  await AS.setItem(saveKey('fish'), 'broken');
  expect(await loadGame('fish')).toBeNull();
});

test('first save has a recoverable backup even if the primary write is truncated', async () => {
  const originalSet = AS.setItem;
  jest.spyOn(AS, 'setItem').mockImplementation((key, value) =>
    originalSet(key, key === saveKey('birds') ? '{partial' : value));
  await saveGame(fullState(mid, { maxLevel: 17 }));
  expect((await loadGame())!.board).toEqual(mid);
  expect((await loadGame())!.maxLevel).toBe(17);
});

test('failed backup write does not overwrite primary; failed primary write retains backup and unlocks', async () => {
  await saveGame(fullState(mid));
  const originalSet = AS.setItem;
  const warning = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const set = jest.spyOn(AS, 'setItem').mockImplementation((key, value) =>
    key === backupKey('birds') ? Promise.reject(new Error('backup failed')) : originalSet(key, value));
  await saveGame(fullState(solved, { maxLevel: 20 }));
  expect((await loadGame())!.board).toEqual(mid);
  set.mockImplementation((key, value) =>
    key === saveKey('birds') ? Promise.reject(new Error('primary failed')) : originalSet(key, value));
  await saveGame(fullState(solved, { maxLevel: 20 }));
  expect((await loadGame())!.board).toEqual(mid);
  expect((await loadGame())!.maxLevel).toBe(20);
  expect(warning).toHaveBeenCalledTimes(2);
});

test('concurrent saves serialize per collection and snapshot before caller mutation', async () => {
  const originalSet = AS.setItem;
  let release!: () => void;
  const blocked = new Promise<void>(resolve => { release = resolve; });
  let started!: () => void;
  const entered = new Promise<void>(resolve => { started = resolve; });
  let first = true;
  jest.spyOn(AS, 'setItem').mockImplementation(async (key, value) => {
    if (key === saveKey('birds') && first) {
      first = false; started(); await blocked;
    }
    return originalSet(key, value);
  });
  const initial = fullState(mid.map(br => [...br]), { maxLevel: 10 });
  const older = saveGame(initial);
  await entered;
  const newer = saveGame(fullState(solved, { level: 8, maxLevel: 8 }));
  initial.board[0][0] = 2;
  // Independent collections can still save while the birds write is blocked.
  await saveGame(fullState(mid, { collection: 'fish', level: 2 }));
  expect((await loadGame('fish'))!.level).toBe(2);
  release();
  await Promise.all([older, newer]);
  const latest = (await loadGame())!;
  expect(latest.board).toEqual(solved);
  expect(latest.maxLevel).toBe(10);
  expect(deserialize(await AS.getItem(backupKey('birds')))!.board).toEqual(mid);
});

test('invalid runtime state cannot overwrite a valid save', async () => {
  await saveGame(fullState(mid));
  await saveGame(fullState([[999], []], { maxLevel: 30 }));
  expect((await loadGame())!.board).toEqual(mid);
});


test('damaged board still retains trustworthy unlock progress even without a backup', async () => {
  await AS.setItem(saveKey('birds'), JSON.stringify({v:2, level:7, maxLevel:24, board:'damaged', initialBoard:null, difficulty:'easy'}));
  const recovered = await loadGame('birds');
  expect(recovered!.maxLevel).toBe(24);
  expect(recovered!.board.flat().length).toBeGreaterThan(0);
});


test('Medium survives save reload with its exact deal and starting board',async()=>{
  const state=fullState(mid,{difficulty:'medium',initialBoard:mid});
  await saveGame(state);
  const resumed=await loadGame('birds');
  expect(resumed!.difficulty).toBe('medium');
  expect(resumed!.board).toEqual(mid);
  expect(resumed!.initialBoard).toEqual(mid);
});
