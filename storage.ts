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

export const SAVE_KEY = 'bird-sort-save-v1';

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
export function toResumeState(save: SaveData | null): State | null {
  if (!save) return null;
  return {
    level: Math.max(1, save.level),
    maxLevel: Math.max(save.maxLevel, save.level, 1),
    board: save.board,
    history: [],
    selected: null,
    won: isWon(save.board, CAP),
  };
}

/** Load + rebuild resume state in one call. Never throws. */
export async function loadGame(): Promise<State | null> {
  try {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    return toResumeState(deserialize(raw));
  } catch (e) {
    console.warn('[storage] load failed:', (e as Error)?.message ?? e);
    return null;
  }
}

/** Persist the resumable facts. Never throws (logs on failure). */
export async function saveGame(s: Pick<State, 'level' | 'maxLevel' | 'board'>): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVE_KEY, serialize(s));
  } catch (e) {
    console.warn('[storage] save failed:', (e as Error)?.message ?? e);
  }
}
