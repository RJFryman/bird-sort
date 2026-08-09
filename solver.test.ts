import { generateLevel, isSolvable, isWon } from './game';
import { speciesForLevel, CAP, EXTRA, init } from './state';

// The shuffle in generateLevel ignores colour, so it can land on a dead board.
// A kid can't tell "I'm stuck" from "this was never winnable" — every board the
// generator ships must be finishable.
test('every generated board is solvable', () => {
  for (const level of [1, 5, 9, 15, 30]) {
    const n = speciesForLevel(level);
    for (let i = 0; i < 200; i++) {
      const b = generateLevel(n, CAP, EXTRA);
      expect(isWon(b, CAP)).toBe(false);
      expect(isSolvable(b, CAP)).toBe(true);
    }
  }
}, 600000);

test('init() boards are solvable too (species remap must not break it)', () => {
  for (let level = 1; level <= 12; level++) {
    expect(isSolvable(init(level).board, CAP)).toBe(true);
  }
});

test('isSolvable rejects a genuinely dead board', () => {
  // Two species, two full mixed branches, no spare room anywhere.
  expect(isSolvable([[0, 1, 0, 1], [1, 0, 1, 0]], 4)).toBe(false);
});
