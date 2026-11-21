import { winningMove } from './coaching';
import { applyMove, canMove, isWon } from './game';
jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(), setItem: jest.fn() }));
test('optional coaching leads a child to a win through legal moves without changing the original board', () => {
  const start = [[0,0,0],[1,1,1,0],[1],[]];
  let board = start;
  for (let i = 0; i < 8 && !isWon(board, 4); i++) {
    const hint = winningMove(board);
    expect(hint).not.toBeNull();
    expect(canMove(board, hint!.from, hint!.to, 4)).toBe(true);
    board = applyMove(board, hint!.from, hint!.to, 4);
  }
  expect(isWon(board, 4)).toBe(true);
  expect(start).toEqual([[0,0,0],[1,1,1,0],[1],[]]);
});
test('coaching returns no invented winning move for a solved or blocked board', () => {
  expect(winningMove([[0,0,0,0],[1,1,1,1],[],[]])).toBeNull();
  expect(winningMove([[0,1],[1,0]], 2)).toBeNull();
});
