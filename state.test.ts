import { reducer, init, State, CAP } from './state';
import { Board } from './game';

// Build a deterministic State (no rng) so transitions are exact.
function make(board: Board, over: Partial<State> = {}): State {
  return { level: 1, maxLevel: 1, collection: 'birds', board, history: [], selected: null, won: false, ...over };
}

test('TAP selects a non-empty, non-cleared branch', () => {
  const s = make([[0, 0], []]);
  expect(reducer(s, { type: 'TAP', i: 0 }).selected).toBe(0);
});

test('TAP on empty branch with nothing selected is a no-op (no dead selection)', () => {
  const s = make([[0, 0], []]);
  expect(reducer(s, { type: 'TAP', i: 1 }).selected).toBeNull();
});

test('TAP same selected branch deselects', () => {
  const s = make([[0, 0], []], { selected: 0 });
  expect(reducer(s, { type: 'TAP', i: 0 }).selected).toBeNull();
});

test('TAP performs a legal move: board updates, history grows, won recomputed', () => {
  const s = make([[0, 0], []], { selected: 0 });
  const n = reducer(s, { type: 'TAP', i: 1 });
  expect(n.board[0]).toEqual([]);
  expect(n.board[1]).toEqual([0, 0]);
  expect(n.history.length).toBe(1);
  expect(n.selected).toBeNull();
  expect(n.won).toBe(false);
});

test('TAP illegal move re-selects the target instead of dead-ending', () => {
  // top of 0 is 0, top of 1 is 9 -> cannot move; should select branch 1
  const s = make([[0, 0], [9]], { selected: 0 });
  const n = reducer(s, { type: 'TAP', i: 1 });
  expect(n.selected).toBe(1);
  expect(n.board).toEqual(s.board); // no move happened
});

test('TAP that fills the last branch sets won', () => {
  // move the single 0 onto [0,0,0] -> [0,0,0,0] full, other branch empty -> win
  const s = make([[0, 0, 0], [0]], { selected: 1 });
  const n = reducer(s, { type: 'TAP', i: 0 });
  expect(n.board[0]).toEqual([0, 0, 0, 0]);
  expect(n.won).toBe(true);
});

test('UNDO restores the previous board and clears won', () => {
  const prev: Board = [[0, 0], []];
  const s = make([[0], [0]], { history: [prev], won: false });
  const n = reducer(s, { type: 'UNDO' });
  expect(n.board).toEqual(prev);
  expect(n.history.length).toBe(0);
  expect(n.won).toBe(false);
});

test('UNDO with empty history is a no-op', () => {
  const s = make([[0, 0], []]);
  expect(reducer(s, { type: 'UNDO' })).toBe(s);
});

test('RESTART returns to the first board in history', () => {
  const first: Board = [[0, 0], []];
  const s = make([[0], [0]], { history: [first, [[0, 0], []]] });
  const n = reducer(s, { type: 'RESTART' });
  expect(n.board).toEqual(first);
  expect(n.history).toEqual([]);
});

test('GOTO clamps level to >= 1 and preserves maxLevel unlocks', () => {
  const s = make([[0]], { level: 3, maxLevel: 5 });
  const n = reducer(s, { type: 'GOTO', level: -2 });
  expect(n.level).toBe(1);
  expect(n.maxLevel).toBe(5); // unlocks never regress
});

test('RESTORE swaps in the given state verbatim', () => {
  const s = make([[0]]);
  const restored = make([[1, 1]], { level: 7, maxLevel: 7 });
  expect(reducer(s, { type: 'RESTORE', state: restored })).toBe(restored);
});

test('CAP is the branch capacity used by transitions', () => {
  expect(CAP).toBe(4);
});

test('init carries the collection; NEXT/GOTO preserve it (fish stays fish)', () => {
  const f = init(1, 1, 'fish');
  expect(f.collection).toBe('fish');
  expect(reducer(f, { type: 'NEXT' }).collection).toBe('fish');
  expect(reducer(f, { type: 'GOTO', level: 3 }).collection).toBe('fish');
  // default is birds
  expect(init(1).collection).toBe('birds');
});
