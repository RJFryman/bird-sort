import { CAP } from './state';

/**
 * Board layout: fit N branches to whatever screen we're actually on.
 *
 * The old math was `branchW = boardW / n` — the width of one row of n branches.
 * But the board is `flexWrap: 'wrap'`, so the moment it wraps that number is
 * fiction. On a phone with 7 branches it produced a 53px cell, hit the slot
 * floor, and drew thumbnail birds in a mostly-empty screen: two cramped
 * columns, a lone orphan branch at the bottom, and dead space everywhere.
 *
 * Instead we pick the grid on purpose. Try every column count; for each, find
 * the biggest slot that fits BOTH the cell width and the row height; keep the
 * column count that makes the birds biggest. The caller then pins the board to
 * exactly `cols` cells wide so flexWrap breaks where we decided it should.
 *
 * The whole board must always be on screen — no scrolling, no clipping. So the
 * touch target is what gives, not the fit: we solve at the full toddler target
 * and at the HIG minimum and keep whichever draws bigger birds. In practice it
 * only ever drops on a 320px screen, because past ~42px slot the stick alone is
 * wider than 96 and the floor stops binding. `speciesForLevel` caps the branch
 * count so a fit always exists on a real device.
 */

/** The toddler touch target we want (spec §1)... */
const TOUCH_WANT = 96;
/** ...and the floor we degrade to rather than scroll. 44 = Apple HIG minimum. */
const TOUCH_FLOOR = 44;
const SLOT_MIN = 14;
const SLOT_MAX = 92; // past this the birds stop reading as a stack on an iPad

/** Gutter between branches, and the 👆 hint size. Both scale with the slot. */
export const marginFor = (slot: number) => Math.max(8, Math.round(slot * 0.22));
export const handFor = (slot: number) => Math.round(slot * 0.9);

/** Everything in a cell that isn't a slot: stick 10 + its 4 margin + 20 padding. */
const CELL_CHROME = 34;

export const cellWidth = (slot: number, touchMin = TOUCH_WANT) =>
  Math.max(touchMin, slot * 1.7 + 24) + marginFor(slot) * 2;

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
  /** Hitbox width floor this grid was solved at; Branch must use the same one. */
  touchMin: number;
};

/** Chrome outside the board: title, grown-ups chip, bottom buttons. */
export const verticalChrome = (height: number) => Math.min(220, Math.round(height * 0.3));

function bestGrid(
  n: number,
  usableW: number,
  usableH: number,
  cap: number,
  touchMin: number,
): Grid | null {
  // Columns are bounded by width alone — no slot size buys a narrower cell than
  // the touch minimum, so this is the most columns that can ever fit.
  const maxCols = Math.max(1, Math.floor(usableW / cellWidth(SLOT_MIN, touchMin)));
  let best: Grid | null = null;

  for (let cols = 1; cols <= Math.min(n, maxCols); cols++) {
    const rows = Math.ceil(n / cols);
    // 1px scan: the closed form is a two-branch max(), not worth the algebra.
    for (let slot = SLOT_MAX; slot >= SLOT_MIN; slot--) {
      if (cellWidth(slot, touchMin) * cols > usableW) continue;
      if (cellHeight(slot, cap) * rows > usableH) continue;
      if (!best || slot > best.slot) {
        best = { slot, cols, rows, boardW: cellWidth(slot, touchMin) * cols, touchMin };
      }
      break; // first fit at this column count is the biggest one
    }
  }
  return best;
}

export function fitGrid(n: number, width: number, height: number, cap = CAP): Grid {
  // 16 keeps us off the screen edges, 32 is the board's own horizontal padding.
  const usableW = Math.min(width, 1000) - 16 - 32;
  const usableH = height - verticalChrome(height);

  // Solve at both hitbox floors and take the bigger bird, tie going to the
  // bigger target. Preferring 96 outright looked safer and wasn't: on a 320px
  // screen it forced 2 columns and 17px birds inside cells that were mostly
  // empty padding, where 44 fits 3 columns of 25px birds in an 82px cell —
  // more bird AND a target only 13px under the one we were protecting.
  const want = bestGrid(n, usableW, usableH, cap, TOUCH_WANT);
  const floor = bestGrid(n, usableW, usableH, cap, TOUCH_FLOOR);
  if (want && (!floor || floor.slot <= want.slot)) return want;
  if (floor) return floor;

  // Only reachable in a window smaller than any real device (a desktop browser
  // dragged down to a sliver). Smallest everything, widest grid — the birds
  // are unusable at this size either way, but nothing crashes.
  const cols = Math.max(1, Math.floor(usableW / cellWidth(SLOT_MIN, TOUCH_FLOOR)));
  return {
    slot: SLOT_MIN,
    cols,
    rows: Math.ceil(n / cols),
    boardW: cellWidth(SLOT_MIN, TOUCH_FLOOR) * cols,
    touchMin: TOUCH_FLOOR,
  };
}
