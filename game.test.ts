import { topGroup, isCleared, canMove, applyMove, isWon, generateLevel } from './game';

const CAP = 4;

test('topGroup counts consecutive same species from top', () => {
  expect(topGroup([0, 1, 1])).toBe(2);
  expect(topGroup([2])).toBe(1);
  expect(topGroup([])).toBe(0);
  expect(topGroup([3, 3, 3])).toBe(3);
});

test('isCleared: full and one species', () => {
  expect(isCleared([3, 3, 3, 3], CAP)).toBe(true);
  expect(isCleared([3, 3, 3], CAP)).toBe(false); // not full
  expect(isCleared([3, 3, 3, 4], CAP)).toBe(false); // mixed
  expect(isCleared([], CAP)).toBe(false);
});

test('canMove: onto empty, onto matching top, rejects full/mismatch/same/locked', () => {
  const b = [[0, 0], [1], [], [2, 2, 2, 2]];
  expect(canMove(b, 0, 2, CAP)).toBe(true); // onto empty
  expect(canMove(b, 0, 1, CAP)).toBe(false); // top 0 vs top 1
  expect(canMove(b, 1, 1, CAP)).toBe(false); // same branch
  expect(canMove(b, 3, 2, CAP)).toBe(false); // source locked
  expect(canMove(b, 2, 0, CAP)).toBe(false); // empty source
});

test('applyMove relocates the WHOLE top group (regression)', () => {
  const b = [[0, 1, 1], []];
  const nb = applyMove(b, 0, 1, CAP);
  expect(nb[1]).toEqual([1, 1]);
  expect(nb[0]).toEqual([0]);
  expect(b[0]).toEqual([0, 1, 1]); // original untouched (immutable)
});

test('applyMove caps group by destination space', () => {
  const b = [[5, 5, 5], [5, 5]]; // dest room for 2 only
  const nb = applyMove(b, 0, 1, CAP);
  expect(nb[1]).toEqual([5, 5, 5, 5]);
  expect(nb[0]).toEqual([5]);
});

test('isWon: all empty or cleared', () => {
  expect(isWon([[], [0, 0, 0, 0]], CAP)).toBe(true);
  expect(isWon([[0], [0, 0, 0, 0]], CAP)).toBe(false);
});

test('generateLevel: correct counts, solvable-shape, not already won', () => {
  // seeded-ish rng: cycles through values deterministically
  let i = 0;
  const seq = [0.1, 0.4, 0.7, 0.2, 0.9, 0.5, 0.3, 0.8, 0.6, 0.0];
  const rng = () => seq[i++ % seq.length];
  const SP = 3, EXTRA = 2;
  const b = generateLevel(SP, CAP, EXTRA, rng);
  expect(b.length).toBe(SP + EXTRA);
  const counts: Record<number, number> = {};
  b.flat().forEach((s) => (counts[s] = (counts[s] || 0) + 1));
  for (let s = 0; s < SP; s++) expect(counts[s]).toBe(CAP);
  expect(isWon(b, CAP)).toBe(false);
});
