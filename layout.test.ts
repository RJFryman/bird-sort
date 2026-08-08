import { fitGrid, cellWidth, cellHeight, verticalChrome } from './layout';
import { speciesForLevel, EXTRA, MAX_SPECIES } from './state';

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
        expect(cellWidth(g.slot, g.touchMin) * g.cols).toBeLessThanOrEqual(Math.min(w, 1000) - 16 - 32);
        expect(cellHeight(g.slot) * g.rows).toBeLessThanOrEqual(h - verticalChrome(h));
        expect(g.boardW).toBeCloseTo(cellWidth(g.slot, g.touchMin) * g.cols);
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

  test('the touch target only shrinks when the full one would not fit', () => {
    // Roomy screens keep the 96px toddler target.
    expect(fitGrid(12, 390, 844).touchMin).toBe(96);
    expect(fitGrid(12, 820, 1180).touchMin).toBe(96);
    // 320px physically cannot hold three 96px cells, and 2 columns of 12 needs
    // 6 rows that don't fit the height. The hitbox gives, not the fit.
    expect(fitGrid(12, 320, 568).touchMin).toBe(44);
  });

  test('the regression: 7 branches on a phone no longer collapse to the slot floor', () => {
    // This is the screenshot. The old `boardW / n` math gave slot = 30 (the
    // floor) in two cramped columns with an orphan branch below the fold.
    const g = fitGrid(7, 390, 844);
    expect(g.slot).toBeGreaterThan(30);
    expect(g.cols).toBeGreaterThanOrEqual(3); // 7 in 2 columns is what left the orphan
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
