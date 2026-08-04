// Pure game-state layer: reducer + level setup, no React, no storage, no UI.
// Owned by the reliability track. This is the STABLE public API the UI (App.tsx)
// and persistence (storage.ts) build on — keep signatures steady.
import { generateLevel, canMove, applyMove, isWon, isCleared, Board } from './game';
import { ROSTER } from './roster';

export const CAP = 4;
export const EXTRA = 2;

export const speciesForLevel = (l: number) =>
  Math.min(5 + Math.floor((l - 1) / 2), ROSTER.length);

// pick `count` distinct random bird indices from the full roster (so every level
// shows a different mix, not always Cardinal..Crow)
export function pickBirds(count: number, rng: () => number = Math.random): number[] {
  const idx = ROSTER.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, count);
}

export type State = {
  level: number;
  maxLevel: number; // highest level ever reached -> unlocks
  board: Board;
  history: Board[];
  selected: number | null;
  won: boolean;
};

export function init(level: number, maxLevel = level): State {
  const count = speciesForLevel(level);
  const pick = pickBirds(count);
  // generate with sequential ids 0..count-1, then remap to random roster indices
  const board = generateLevel(count, CAP, EXTRA).map((br) => br.map((id) => pick[id]));
  return {
    level,
    maxLevel: Math.max(maxLevel, level),
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
      return init(s.level + 1, s.maxLevel);
    case 'GOTO':
      return init(Math.max(1, a.level), s.maxLevel);
  }
}
