import { fitGrid, cellWidth, cellHeight, verticalChrome, TOUCH_MIN } from './layout';

// The screens Asher actually plays on, plus the extremes.
const SCREENS = {
  iphoneSE: [320, 568],
  iphone13: [390, 844],
  iphone13Land: [844, 390],
  ipad: [820, 1180],
  desktop: [1440, 900],
} as const;

// n grows with level; 4..12 is the real range the generator produces.
const COUNTS = [4, 5, 6, 7, 8, 9, 10, 11, 12];

describe('fitGrid', () => {
  test('the grid always fits the width, and fits the height unless it says it overflows', () => {
    for (const [name, [w, h]] of Object.entries(SCREENS)) {
      for (const n of COUNTS) {
        const g = fitGrid(n, w, h);
        expect(g.cols * g.rows).toBeGreaterThanOrEqual(n); // every branch has a cell
        // Width is never violated — that's what caused the cramped two columns.
        expect(cellWidth(g.slot) * g.cols).toBeLessThanOrEqual(Math.min(w, 1000) - 16 - 32);
        expect(g.boardW).toBeCloseTo(cellWidth(g.slot) * g.cols);
        // A cell never drops below the toddler touch target (spec §1).
        expect(cellWidth(g.slot)).toBeGreaterThanOrEqual(TOUCH_MIN);
        // Height either fits, or the grid admits it doesn't so the caller scrolls.
        const fitsH = cellHeight(g.slot) * g.rows <= h - verticalChrome(h);
        expect(fitsH || g.overflow).toBe(true);
      }
    }
  });

  test('overflow is only ever set when nothing could have fit', () => {
    // If it claims overflow, even the smallest slot in the widest grid must fail.
    const g = fitGrid(40, 390, 844);
    expect(g.overflow).toBe(true);
    expect(cellHeight(30) * g.rows).toBeGreaterThan(844 - verticalChrome(844));
    // ...and a board that comfortably fits must not be scrollable.
    expect(fitGrid(6, 390, 844).overflow).toBe(false);
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
