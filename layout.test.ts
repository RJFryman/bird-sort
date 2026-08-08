import { fitGrid, cellWidth, cellHeight, verticalChrome } from './layout';
import { speciesForLevel, EXTRA, MAX_SPECIES, CAP } from './state';

// The screens Asher actually plays on, plus the extremes.
const SCREENS = {
  iphoneSE: [320, 568],
  iphone13: [390, 844],
  iphone13Land: [844, 390],
  ipad: [820, 1180],
  desktop: [1440, 900],
} as const;

// n = species + EXTRA, and species is capped, so this is the whole real range.
const COUNTS = Array.from({ length: MAX_SPECIES + EXTRA - 3 }, (_, i) => i + 4);

describe('fitGrid', () => {
  test('the whole board always fits on screen — no scrolling, no clipping', () => {
    for (const [, [w, h]] of Object.entries(SCREENS)) {
      for (const n of COUNTS) {
        const g = fitGrid(n, w, h);
        expect(g.cols * g.rows).toBeGreaterThanOrEqual(n); // every branch has a cell
        expect(cellWidth(g.slot, CAP, g.touchMin) * g.cols).toBeLessThanOrEqual(Math.min(w, 1000) - 16 - 32);
        expect(cellHeight(g.slot) * g.rows).toBeLessThanOrEqual(h - verticalChrome(h));
        expect(g.boardW).toBeCloseTo(cellWidth(g.slot, CAP, g.touchMin) * g.cols);
      }
    }
  });

  test('every level fits, forever — the species cap is what guarantees it', () => {
    for (const [, [w, h]] of Object.entries(SCREENS)) {
      for (const level of [1, 5, 12, 40, 200]) {
        const n = speciesForLevel(level) + EXTRA;
        const g = fitGrid(n, w, h);
        expect(cellHeight(g.slot) * g.rows).toBeLessThanOrEqual(h - verticalChrome(h));
        expect(g.slot).toBeGreaterThanOrEqual(14);
      }
    }
  });

  test('every real screen keeps the full 96px toddler touch target', () => {
    // A horizontal perch is `cap` slots wide, so the cell clears 96px on its own
    // and the hitbox floor stops binding. Stacked branches had to drop to 44 on
    // a 320px screen; this layout never does on a device anyone actually holds.
    for (const [, [w, h]] of Object.entries(SCREENS)) {
      for (const n of COUNTS) {
        expect(fitGrid(n, w, h).touchMin).toBe(96);
      }
    }
    // Only a window smaller than any real device still gives up the target.
    expect(fitGrid(12, 300, 300).touchMin).toBe(44);
  });

  test('the regression: a full board on a small phone stays readable', () => {
    // The screenshot that started this: 7 branches drawn at the slot floor in
    // two cramped columns. Then, once scrolling was ruled out, a full 12-branch
    // board on an iPhone SE bottomed out at slot 17 — technically fitting,
    // barely legible. Perching sideways is what bought that back.
    expect(fitGrid(7, 390, 844).slot).toBeGreaterThanOrEqual(50);
    expect(fitGrid(12, 320, 568).slot).toBeGreaterThanOrEqual(22);
    const g = fitGrid(7, 390, 844);
    expect(g.rows * g.cols - 7).toBeLessThanOrEqual(2); // and not a wasteful grid
  });

  test('a bigger screen never gives smaller birds', () => {
    for (const n of COUNTS) {
      const phone = fitGrid(n, 390, 844).slot;
      const pad = fitGrid(n, 820, 1180).slot;
      expect(pad).toBeGreaterThanOrEqual(phone);
    }
  });

  test('landscape uses the width instead of stacking rows off-screen', () => {
    const portrait = fitGrid(8, 390, 844);
    const landscape = fitGrid(8, 844, 390);
    expect(landscape.cols).toBeGreaterThan(portrait.cols);
    expect(landscape.rows).toBeLessThan(portrait.rows);
  });

  test('a window too small for the floor still returns a usable grid', () => {
    const g = fitGrid(12, 300, 300);
    expect(g.cols).toBeGreaterThanOrEqual(1);
    expect(g.slot).toBeGreaterThan(0);
    expect(g.cols * g.rows).toBeGreaterThanOrEqual(12);
  });
});

describe('speciesForLevel', () => {
  test('ramps, then caps so the board can always fit', () => {
    expect(speciesForLevel(1)).toBe(5);
    expect(speciesForLevel(3)).toBe(6);
    expect(speciesForLevel(11)).toBe(MAX_SPECIES);
    expect(speciesForLevel(500)).toBe(MAX_SPECIES); // was 52 — a 54-branch board
  });
});
