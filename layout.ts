import { CAP } from './state';

/**
 * Board layout: fit N branches to whatever screen we're actually on.
 *
 * The old math was `branchW = boardW / n` — the width of one row of n branches.
 * But the board is `flexWrap: 'wrap'`, so the moment it wraps that number is
 * fiction. On a phone with 7 branches it produced a 53px cell, hit the 30px
 * slot floor, and drew thumbnail birds in a mostly-empty screen: two cramped
 * columns, a lone orphan branch at the bottom, and dead space everywhere.
 *
 * Instead we pick the grid on purpose. Try every column count; for each, find
 * the biggest slot that fits BOTH the cell width and the row height; keep the
 * column count that makes the birds biggest. The caller then pins the board to
 * exactly `cols` cells wide so flexWrap breaks where we decided it should.
 */

/** Toddler touch target floor (spec §1) — a cell never gets narrower than this. */
export const TOUCH_MIN = 96;
const SLOT_MIN = 30;
const SLOT_MAX = 92; // past this the birds stop reading as a stack on an iPad

/** Gutter between branches, and the 👆 hint size. Both scale with the slot. */
export const marginFor = (slot: number) => Math.max(8, Math.round(slot * 0.22));
export const handFor = (slot: number) => Math.round(slot * 0.9);

/** Everything in a cell that isn't a slot: stick 10 + its 4 margin + 20 padding. */
const CELL_CHROME = 34;

export const cellWidth = (slot: number) =>
  Math.max(TOUCH_MIN, slot * 1.7 + 24) + marginFor(slot) * 2;

// The 👆 hint is drawn as an overlay above the stack, not as a reserved row.
// Reserving it cost `0.9 * slot` of height on every branch whether or not a
// hint was showing — on a phone that alone held the birds ~20% smaller.
export const cellHeight = (slot: number, cap = CAP) => cap * (slot * 0.96) + CELL_CHROME;

export type Grid = {
  slot: number;
  cols: number;
  rows: number;
  /** Exact board width for `cols` cells — this is what forces the wrap point. */
  boardW: number;
  /**
   * True when even the smallest slot can't fit every row on screen. `species`
   * climbs with the level all the way to the roster size, so a late board can
   * be 50+ branches — this is a normal state, not a broken one. The caller
   * scrolls the board; the alternative is what happens today, where the last
   * row is quietly clipped behind the corner buttons.
   */
  overflow: boolean;
};

/** Chrome outside the board: title, grown-ups chip, bottom buttons. */
export const verticalChrome = (height: number) => Math.min(220, Math.round(height * 0.3));

export function fitGrid(n: number, width: number, height: number, cap = CAP): Grid {
  // 16 keeps us off the screen edges, 32 is the board's own horizontal padding.
  const usableW = Math.min(width, 1000) - 16 - 32;
  const usableH = height - verticalChrome(height);

  // Columns are bounded by width alone — no slot size buys a narrower cell than
  // the touch minimum, so this is the most columns that can ever fit.
  const maxCols = Math.max(1, Math.floor(usableW / cellWidth(SLOT_MIN)));

  let best: Grid | null = null;

  for (let cols = 1; cols <= Math.min(n, maxCols); cols++) {
    const rows = Math.ceil(n / cols);
    // 1px scan: the closed form is a two-branch max(), not worth the algebra.
    for (let slot = SLOT_MAX; slot >= SLOT_MIN; slot--) {
      if (cellWidth(slot) * cols > usableW) continue;
      if (cellHeight(slot, cap) * rows > usableH) continue;
      if (!best || slot > best.slot) {
        best = { slot, cols, rows, boardW: cellWidth(slot) * cols, overflow: false };
      }
      break; // first fit at this column count is the biggest one
    }
  }

  if (best) return best;

  // Nothing fits vertically. Use every column the width allows — that's the
  // fewest rows possible — and let the caller scroll the remainder.
  return {
    slot: SLOT_MIN,
    cols: maxCols,
    rows: Math.ceil(n / maxCols),
    boardW: cellWidth(SLOT_MIN) * maxCols,
    overflow: true,
  };
}
