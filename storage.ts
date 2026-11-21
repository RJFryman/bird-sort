// Persistence owns versioned resumable saves and a last-good backup per collection.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Board, isWon } from './game';
import { State, CAP, EXTRA, Difficulty, init } from './state';
import { CollectionId, COLLECTIONS } from './roster';

// Keep the existing keys: changing the payload version must not strand progress.
export const SAVE_KEY = 'bird-sort-save-v1';
export const saveKey = (c: CollectionId) => `${SAVE_KEY}:${c}`;
export const backupKey = (c: CollectionId) => `${saveKey(c)}:backup`;

type LegacySave = { v: 1; level: number; maxLevel: number; board: Board };
type CurrentSave = {
  v: 2;
  level: number;
  maxLevel: number;
  board: Board;
  initialBoard: Board | null;
  difficulty: Difficulty;
};
export type SaveData = LegacySave | CurrentSave;
type PersistableState = Pick<State, 'level' | 'maxLevel' | 'board'> &
  Partial<Pick<State, 'difficulty' | 'initialBoard'>>;

const inferDifficulty = (board: Board): Difficulty =>
  new Set(board.flat()).size > 4 ? 'hard' : 'easy';

/** Only resumable facts belong on disk; null honestly marks an unknown old deal. */
export function toSave(s: PersistableState): CurrentSave {
  return {
    v: 2, level: s.level, maxLevel: Math.max(s.maxLevel, s.level, 1), board: s.board,
    initialBoard: s.initialBoard ?? null,
    difficulty: s.difficulty ?? inferDifficulty(s.board),
  };
}

export function serialize(s: PersistableState): string {
  return JSON.stringify(toSave(s));
}

function parse(raw: string | null | undefined): any {
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

function isBoard(x: unknown, collection: CollectionId): x is Board {
  const rosterLen = COLLECTIONS[collection].length;
  return Array.isArray(x) && x.length >= 2 && x.length <= rosterLen + EXTRA &&
    x.every(br => Array.isArray(br) && br.length <= CAP &&
      br.every(id => Number.isSafeInteger(id) && id >= 0 && id < rosterLen)) &&
    x.some(br => br.length > 0);
}

function samePieces(a: Board, b: Board): boolean {
  if (a.length !== b.length) return false;
  const pieces = (board: Board) => board.flat().sort((x, y) => x - y);
  return JSON.stringify(pieces(a)) === JSON.stringify(pieces(b));
}

/** Read both supported versions without mutating the saved board or roster IDs. */
export function deserialize(raw: string | null | undefined, collection: CollectionId = 'birds'): SaveData | null {
  const o = parse(raw);
  if (!o || (o.v !== 1 && o.v !== 2)) return null;
  if (!Number.isSafeInteger(o.level) || !Number.isSafeInteger(o.maxLevel)) return null;
  if (!isBoard(o.board, collection)) return null;
  if (o.v === 1) return { v: 1, level: o.level, maxLevel: o.maxLevel, board: o.board };
  if (o.difficulty !== 'easy' && o.difficulty !== 'medium' && o.difficulty !== 'hard') return null;
  if (o.initialBoard !== null &&
    (!isBoard(o.initialBoard, collection) || !samePieces(o.board, o.initialBoard))) return null;
  return {
    v: 2, level: o.level, maxLevel: o.maxLevel, board: o.board,
    initialBoard: o.initialBoard, difficulty: o.difficulty,
  };
}

/** Transient fields are rebuilt, including won, even when resuming a solved save. */
export function toResumeState(save: SaveData | null, collection: CollectionId = 'birds'): State | null {
  // Keep this public boundary defensive too; callers may supply parsed objects.
  const valid = save && deserialize(JSON.stringify(save), collection);
  if (!valid) return null;
  return {
    level: Math.max(1, valid.level), maxLevel: Math.max(valid.maxLevel, valid.level, 1),
    collection, board: valid.board,
    initialBoard: valid.v === 2 ? valid.initialBoard ?? undefined : undefined,
    difficulty: valid.v === 2 ? valid.difficulty : inferDifficulty(valid.board),
    history: [], selected: null, won: isWon(valid.board, CAP),
  };
}

// A damaged board can still retain trustworthy unlock metadata. Never use a
// partial JSON fragment or an unsupported version as a source of progress.
function savedMax(raw: string | null): number {
  const o = parse(raw);
  if (!o || (o.v !== 1 && o.v !== 2)) return 1;
  return Math.max(1, Number.isSafeInteger(o.maxLevel) ? o.maxLevel : 1,
    Number.isSafeInteger(o.level) ? o.level : 1);
}

function savedDifficulty(raw: string | null): Difficulty | null {
  const o = parse(raw);
  return o?.v === 2 && (o.difficulty === 'easy' || o.difficulty === 'medium' || o.difficulty === 'hard')
    ? o.difficulty : null;
}

async function readSaves(collection: CollectionId): Promise<(string | null)[]> {
  return Promise.all([saveKey(collection), backupKey(collection),
    ...(collection === 'birds' ? [SAVE_KEY] : [])].map(async key => {
    try { return await AsyncStorage.getItem(key); } catch { return null; }
  }));
}

/** Primary first, then last-good backup, then the pre-collection birds save. */
export async function loadGame(collection: CollectionId = 'birds'): Promise<State | null> {
  // A collection switch/reload in this process sees all already-requested saves.
  await pendingSaves[collection];
  const raws = await readSaves(collection);
  const save = raws.map(raw => deserialize(raw, collection)).find(Boolean) ?? null;
  const resumed = toResumeState(save, collection);
  const recoveredMax = Math.max(1, ...raws.map(savedMax));
  if (resumed) return { ...resumed, maxLevel: Math.max(resumed.maxLevel, recoveredMax) };
  // If a board is lost but its versioned unlock metadata survives, retain it.
  const difficulty = raws.map(savedDifficulty).find(value => value !== null);
  return recoveredMax > 1 || difficulty ? init(1, recoveredMax, collection, difficulty ?? 'easy') : null;
}

const pendingSaves: Partial<Record<CollectionId, Promise<void>>> = {};

/** Snapshot immediately and serialize writes so an older save cannot finish last. */
export async function saveGame(s: PersistableState & Pick<State, 'collection'>): Promise<void> {
  const collection = s.collection;
  const snapshot = serialize(s);
  const write = async () => {
    try {
      const next = deserialize(snapshot, collection);
      if (!next) return; // Never replace a good save with invalid runtime state.
      const raws = await readSaves(collection);
      const maxLevel = Math.max(next.maxLevel, next.level, ...raws.map(savedMax));
      const previous = raws.map(raw => deserialize(raw, collection)).find(Boolean);
      // Write a recoverable board BEFORE risking the primary. On first save the
      // new snapshot is also the backup; later writes retain the previous board.
      const backup = previous ?? next;
      await AsyncStorage.setItem(backupKey(collection), JSON.stringify({ ...backup, maxLevel }));
      await AsyncStorage.setItem(saveKey(collection), JSON.stringify({ ...next, maxLevel }));
    } catch (e) {
      console.warn('[storage] save failed:', (e as Error)?.message ?? e);
    }
  };
  const pending = (pendingSaves[collection] ?? Promise.resolve()).then(write);
  pendingSaves[collection] = pending;
  await pending;
  if (pendingSaves[collection] === pending) delete pendingSaves[collection];
}

// --- Last-played collection, so we open straight into it (spec §5 "<=1 tap to
// fun"). Own key, single value, never throws. ---
export const LAST_KEY = 'bird-sort-last-collection-v1';

export async function loadLastCollection(): Promise<CollectionId | null> {
  try {
    const v = await AsyncStorage.getItem(LAST_KEY);
    return v === 'birds' || v === 'fish' ? v : null;
  } catch {
    return null;
  }
}

export async function saveLastCollection(c: CollectionId): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_KEY, c);
  } catch {
    /* non-critical */
  }
}
