// Pure game-state layer: reducer + level setup, no React, no storage, no UI.
// Owned by the reliability track. This is the STABLE public API the UI (App.tsx)
// and persistence (storage.ts) build on — keep signatures steady.
import { generateLevel, generateGentleLevel, canMove, applyMove, isWon, isCleared, Board } from './game';
import { COLLECTIONS, CollectionId } from './roster';
import { pickDistinctSpecies } from './species-selection';

export const CAP = 4;
export const EXTRA = 2;

// Easy stays small forever, with a breather after each stretch level.
// Hard is opt-in; both the choice and the original deal survive reloads.
export type Difficulty = 'easy' | 'hard';
export const MAX_SPECIES = 10;
export const speciesForLevel = (l: number, rosterLen = COLLECTIONS.birds.length, difficulty: Difficulty = 'easy') =>
  Math.min(difficulty === 'hard' ? 5 + Math.floor((l - 1) / 2) : l <= 3 ? 2 : l % 4 === 0 ? 4 : 3,
    rosterLen, MAX_SPECIES);
export const scrambleForLevel = (level: number) => level <= 3 ? 4 : level % 4 === 0 ? 12 : 7;

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
  difficulty?: Difficulty; // absent on hand-built/legacy states means easy
  initialBoard?: Board; // absent only when an old save did not retain its deal
  level: number;
  maxLevel: number; // highest level ever reached -> unlocks
  collection: CollectionId; // which collection this game is playing
  board: Board;
  history: Board[];
  selected: number | null;
  won: boolean;
};

export function init(level: number, maxLevel = level, collection: CollectionId = 'birds', difficulty: Difficulty = 'easy'): State {
  const rosterLen = COLLECTIONS[collection].length;
  const count = speciesForLevel(level, rosterLen, difficulty);
  const pick = pickDistinctSpecies(count, collection);
  // generate with sequential ids 0..count-1, then remap to random roster indices
  const generated = difficulty === 'hard'
    ? generateLevel(count, CAP, EXTRA)
    : generateGentleLevel(count, CAP, EXTRA, scrambleForLevel(level));
  const board = generated.map((br) => br.map((id) => pick[id]));
  return {
    difficulty,
    level,
    maxLevel: Math.max(maxLevel, level),
    collection,
    board,
    initialBoard: board,
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
  | { type: 'DIFFICULTY'; difficulty: Difficulty }
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
    case 'RESTART': {
      const board = s.initialBoard ?? s.history[0];
      // A legacy reload has no original deal. Only an explicit restart replaces
      // that resumed position; it must never leave a solved board marked unwon.
      if (!board) return init(s.level, s.maxLevel, s.collection, s.difficulty);
      return { ...s, initialBoard: board, board, history: [], selected: null, won: isWon(board, CAP) };
    }
    case 'DIFFICULTY':
      return (s.difficulty ?? 'easy') === a.difficulty
        ? s
        : init(s.level, s.maxLevel, s.collection, a.difficulty);
    case 'NEXT':
      return init(s.level + 1, s.maxLevel, s.collection, s.difficulty);
    case 'GOTO':
      return init(Math.max(1, a.level), s.maxLevel, s.collection, s.difficulty);
  }
}
