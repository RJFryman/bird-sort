// Pure game-state layer: reducer + level setup, no React, no storage, no UI.
// Owned by the reliability track. This is the STABLE public API the UI (App.tsx)
// and persistence (storage.ts) build on — keep signatures steady.
import { generateLevel, canMove, applyMove, isWon, isCleared, Board } from './game';
import { COLLECTIONS, CollectionId } from './roster';

export const CAP = 4;
export const EXTRA = 2;

/**
 * Most branches a board may ever have is MAX_SPECIES + EXTRA = 12. Above that
 * the birds have to shrink past the point a toddler can tell them apart on a
 * phone, and the board stops fitting on screen at all. Difficulty past level 12
 * comes from the shuffle, not from more branches — `pickBirds` still draws a
 * different mix from the full 52-bird roster every level, so variety is intact.
 */
export const MAX_SPECIES = 10;

// Level ramp is relative to whichever collection is active (roster length is the
// species cap). Defaults to the birds count so old call sites keep working.
export const speciesForLevel = (l: number, rosterLen = COLLECTIONS.birds.length) =>
  Math.min(5 + Math.floor((l - 1) / 2), rosterLen, MAX_SPECIES);

// pick `count` distinct random species indices from a roster of `rosterLen` (so
// every level shows a different mix). Index-based — collection-agnostic.
export function pickBirds(
  count: number,
  rosterLen = COLLECTIONS.birds.length,
  rng: () => number = Math.random,
): number[] {
  const idx = Array.from({ length: rosterLen }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, count);
}

export type State = {
  level: number;
  maxLevel: number; // highest level ever reached -> unlocks
  collection: CollectionId; // which collection this game is playing
  board: Board;
  history: Board[];
  selected: number | null;
  won: boolean;
};

export function init(level: number, maxLevel = level, collection: CollectionId = 'birds'): State {
  const rosterLen = COLLECTIONS[collection].length;
  const count = speciesForLevel(level, rosterLen);
  const pick = pickBirds(count, rosterLen);
  // generate with sequential ids 0..count-1, then remap to random roster indices
  const board = generateLevel(count, CAP, EXTRA).map((br) => br.map((id) => pick[id]));
  return {
    level,
    maxLevel: Math.max(maxLevel, level),
    collection,
    board,
    history: [],
    selected: null,
    won: false,
  };
}

export type Action =
  | { type: 'TAP'; i: number }
  | { type: 'UNDO' }
  | { type: 'RESTART' }
  | { type: 'NEXT' }
  | { type: 'GOTO'; level: number }
  | { type: 'RESTORE'; state: State };

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'RESTORE':
      return a.state;
    case 'TAP': {
      const { i } = a;
      if (s.selected === null) {
        return s.board[i].length && !isCleared(s.board[i], CAP) ? { ...s, selected: i } : s;
      }
      if (s.selected === i) return { ...s, selected: null };
      if (canMove(s.board, s.selected, i, CAP)) {
        const board = applyMove(s.board, s.selected, i, CAP);
        return {
          ...s,
          board,
          history: [...s.history, s.board],
          selected: null,
          won: isWon(board, CAP),
        };
      }
      return { ...s, selected: s.board[i].length && !isCleared(s.board[i], CAP) ? i : null };
    }
    case 'UNDO':
      if (!s.history.length) return s;
      return {
        ...s,
        board: s.history[s.history.length - 1],
        history: s.history.slice(0, -1),
        selected: null,
        won: false,
      };
    case 'RESTART':
      return { ...s, board: s.history[0] ?? s.board, history: [], selected: null, won: false };
    case 'NEXT':
      return init(s.level + 1, s.maxLevel, s.collection);
    case 'GOTO':
      return init(Math.max(1, a.level), s.maxLevel, s.collection);
  }
}
