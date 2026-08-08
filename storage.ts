// Persistence layer. Owns the save-key and the on-disk shape. Defensive by
// design: a corrupt/partial/old blob must NEVER throw and NEVER pretend the
// child's progress "just isn't there" beyond what's truly unrecoverable.
//
// Root cause of the progress-loss bug this fixes:
//  1. The old code stored the WHOLE reducer state (incl. transient `won`,
//     `selected`, and an unbounded `history`). On reload it forced `won:false`
//     but kept the *solved* board -> no win overlay, no Next button -> a
//     dead-ended, "started over"-feeling board.
//  2. A partial write (tab closed mid-save) left invalid JSON; the loader's
//     catch swallowed it and silently reset to level 1.
//
// Fix: persist only the resumable facts (level, maxLevel, board). Rebuild the
// transient bits on resume, RECOMPUTING `won` from the board so a saved win
// resumes to the celebration, not a dead board.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Board, isWon } from './game';
import { State, CAP } from './state';
import { CollectionId } from './roster';

// Base key. Each collection gets its own slot (`${SAVE_KEY}:birds` / `:fish`) so
// birds and fish progress never clobber each other. The bare SAVE_KEY is the
// pre-Fish-Mode save — still read once for birds so no child loses progress.
export const SAVE_KEY = 'bird-sort-save-v1';
export const saveKey = (c: CollectionId) => `${SAVE_KEY}:${c}`;

// Only the facts needed to resume. Versioned so future shape changes are safe.
export type SaveData = {
  v: 1;
  level: number;
  maxLevel: number;
  board: Board;
};

/** Reduce full game state down to the persistable facts. */
export function toSave(s: Pick<State, 'level' | 'maxLevel' | 'board'>): SaveData {
  return { v: 1, level: s.level, maxLevel: s.maxLevel, board: s.board };
}

/** Serialize for storage. */
export function serialize(s: Pick<State, 'level' | 'maxLevel' | 'board'>): string {
  return JSON.stringify(toSave(s));
}

/** True if x is a well-formed board (array of arrays of numbers). */
function isBoard(x: unknown): x is Board {
  return (
    Array.isArray(x) &&
    x.every((br) => Array.isArray(br) && br.every((c) => typeof c === 'number'))
  );
}

/**
 * Parse a stored blob into SaveData, or null if missing/corrupt/unknown-version.
 * NEVER throws — bad data degrades to "no save", not a crash.
 */
export function deserialize(raw: string | null | undefined): SaveData | null {
  if (!raw) return null;
  let o: any;
  try {
    o = JSON.parse(raw);
  } catch {
    return null; // partial/corrupt write
  }
  if (!o || o.v !== 1) return null;
  if (typeof o.level !== 'number' || typeof o.maxLevel !== 'number') return null;
  if (!isBoard(o.board)) return null;
  return { v: 1, level: o.level, maxLevel: o.maxLevel, board: o.board };
}

/**
 * Rebuild resumable game state from a save. Transient fields are reconstructed;
 * `won` is RECOMPUTED from the board so a saved win resumes to the win overlay
 * (the dead-end-board fix). Returns null if the save is unusable.
 */
export function toResumeState(save: SaveData | null, collection: CollectionId = 'birds'): State | null {
  if (!save) return null;
  return {
    level: Math.max(1, save.level),
    maxLevel: Math.max(save.maxLevel, save.level, 1),
    collection,
    board: save.board,
    history: [],
    selected: null,
    won: isWon(save.board, CAP),
  };
}

/** Load + rebuild resume state for a collection. Never throws. */
export async function loadGame(collection: CollectionId = 'birds'): Promise<State | null> {
  try {
    let raw = await AsyncStorage.getItem(saveKey(collection));
    // migrate the pre-Fish-Mode single save into the birds slot (once)
    if (raw == null && collection === 'birds') raw = await AsyncStorage.getItem(SAVE_KEY);
    return toResumeState(deserialize(raw), collection);
  } catch (e) {
    console.warn('[storage] load failed:', (e as Error)?.message ?? e);
    return null;
  }
}

/** Persist the resumable facts under the game's collection slot. Never throws. */
export async function saveGame(s: Pick<State, 'level' | 'maxLevel' | 'board' | 'collection'>): Promise<void> {
  try {
    await AsyncStorage.setItem(saveKey(s.collection), serialize(s));
  } catch (e) {
    console.warn('[storage] save failed:', (e as Error)?.message ?? e);
  }
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

// --- Parent-gate setting (Robert's ask: a SETTING, default OFF, name-gated). ---
// Kept here because storage.ts owns on-disk keys. Single boolean, own key so it
// can't corrupt or be corrupted by the game save. Never throws.
export const GATE_KEY = 'bird-sort-gate-v1';

/** Is the "ask a grown-up first" gate enabled? Default OFF (Robert's ask). */
export async function loadGateOn(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(GATE_KEY)) === '1';
  } catch {
    return false;
  }
}

/** Persist the gate on/off setting. Never throws. */
export async function saveGateOn(on: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(GATE_KEY, on ? '1' : '0');
  } catch {
    /* setting is non-critical; ignore write failure */
  }
}
