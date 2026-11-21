import { reducer, init, State, CAP, speciesForLevel } from './state';
import { Board, canMove } from './game';

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

test('easy progression stays small, alternates stretch and breather, and hard requires opt in', () => {
  expect([1, 2, 3, 4, 5, 6, 7, 8, 1000].map(l => speciesForLevel(l))).toEqual([2, 2, 2, 4, 3, 3, 3, 4, 4]);
  expect(speciesForLevel(1, 52, 'hard')).toBe(5);
  expect(speciesForLevel(1000, 52, 'hard')).toBe(10);
  expect(speciesForLevel(4, 2)).toBe(2);
});

test('difficulty changes regenerate a board but retain progress and collection', () => {
  const original = init(8, 20, 'fish');
  const hard = reducer(original, { type: 'DIFFICULTY', difficulty: 'hard' });
  expect(hard.difficulty).toBe('hard');
  expect(hard.maxLevel).toBe(20);
  expect(hard.level).toBe(8);
  expect(hard.collection).toBe('fish');
  expect(hard.board).not.toBe(original.board);
  expect(reducer(hard, { type: 'NEXT' }).difficulty).toBe('hard');
  expect(reducer(hard, { type: 'GOTO', level: 1 }).difficulty).toBe('hard');
  expect(reducer(hard, { type: 'DIFFICULTY', difficulty: 'easy' }).board.length).toBe(6);
});

test('legacy saves retain their exact board and unlocks, then advance gently', () => {
  const legacy = make([[0, 1, 0, 1], []], { level: 40, maxLevel: 50 });
  expect(reducer(init(1), { type: 'RESTORE', state: legacy })).toBe(legacy);
  const next = reducer(legacy, { type: 'NEXT' });
  expect(next.level).toBe(41);
  expect(next.maxLevel).toBe(50);
  expect(next.difficulty).toBe('easy');
  expect(next.board.length).toBe(5);
});

test('init retains its exact level-start board through moves, undo, and Restart', () => {
  const s = init(1);
  const start = s.initialBoard;
  expect(start).toEqual(s.board);
  const moves = s.board.flatMap((_, from) => s.board.map((__, to) => [from, to]));
  const [from, to] = moves.find(([from, to]) => canMove(s.board, from, to, CAP))!;
  const moved = reducer(reducer(s, { type: 'TAP', i: from }), { type: 'TAP', i: to });
  expect(moved.board).not.toEqual(start);
  expect(moved.initialBoard).toEqual(start);
  const undone = reducer(moved, { type: 'UNDO' });
  expect(undone.board).toEqual(start);
  const restarted = reducer(moved, { type: 'RESTART' });
  expect(restarted.board).toEqual(start);
  expect(restarted.initialBoard).toEqual(start);
  expect(restarted.selected).toBeNull();
});

test('reselecting the active difficulty preserves the exact state and current attempt', () => {
  for (const difficulty of ['easy', 'medium', 'hard'] as const) {
    const s = init(1, 12, 'fish', difficulty);
    expect(reducer(s, { type: 'DIFFICULTY', difficulty })).toBe(s);
  }
  const legacy = make([[0, 1], [1, 0], []]);
  expect(reducer(legacy, { type: 'DIFFICULTY', difficulty: 'easy' })).toBe(legacy);
});

test('a legacy resumed solved board without its original deal gets a playable fresh Restart', () => {
  const s = make([[0, 0, 0, 0], [], []], { won: true, level: 1, maxLevel: 20 });
  const restarted = reducer(s, { type: 'RESTART' });
  expect(restarted.won).toBe(false);
  expect(restarted.board).not.toEqual(s.board);
  expect(restarted.initialBoard).toBe(restarted.board);
  expect(restarted.maxLevel).toBe(20);
});


test('Medium offers a gradual middle rung without changing Easy',()=>{
  expect([1,5,9,13].map(level=>speciesForLevel(level,52,'medium'))).toEqual([4,5,6,6]);
  expect(speciesForLevel(12,52,'medium')).toBe(5);
  expect(speciesForLevel(99,52,'easy')).toBeLessThanOrEqual(4);
  const state=init(5,9,'fish','medium');
  expect(new Set(state.board.flat()).size).toBe(5);
  expect(reducer(state,{type:'NEXT'}).difficulty).toBe('medium');
  expect(reducer(state,{type:'DIFFICULTY',difficulty:'medium'})).toBe(state);
});
