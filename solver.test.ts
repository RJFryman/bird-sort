import { generateLevel, generateGentleLevel, canMove, applyMove, isSolvable, isWon } from './game';
import { speciesForLevel, scrambleForLevel, CAP, EXTRA, init } from './state';

// The shuffle in generateLevel ignores colour, so it can land on a dead board.
// A kid can't tell "I'm stuck" from "this was never winnable" — every board the
// generator ships must be finishable.
test('every generated board is solvable', () => {
  for (const level of [1, 5, 9, 15, 30]) {
    const n = speciesForLevel(level, 52, 'hard');
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

// Independent breadth-first search measures actual legal winning moves, rather
// than trusting the generator's reverse-step counter.
function winningMoves(board: number[][], limit: number): number {
  const key = (b: number[][]) => b.map(br => br.join(',')).sort().join('|');
  const queue: [number[][], number][] = [[board, 0]];
  const seen = new Set([key(board)]);
  for (let head = 0; head < queue.length; head++) {
    const [b, depth] = queue[head];
    if (isWon(b, CAP)) return depth;
    if (depth === limit) continue;
    for (let from = 0; from < b.length; from++) for (let to = 0; to < b.length; to++) {
      if (!canMove(b, from, to, CAP)) continue;
      const next = applyMove(b, from, to, CAP);
      const k = key(next);
      if (!seen.has(k)) { seen.add(k); queue.push([next, depth + 1]); }
    }
  }
  return Infinity;
}

function seeded(seed: number) {
  return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
}

test('easy boards have short legal solutions, intact counts and bounded branches across seeds', () => {
  for (const level of [1, 3, 4, 5, 8, 99, 100]) {
    const count = speciesForLevel(level);
    const budget = scrambleForLevel(level);
    for (let seed = 1; seed <= 25; seed++) {
      const board = generateGentleLevel(count, CAP, EXTRA, budget, seeded(seed));
      expect(board.length).toBeLessThanOrEqual(6);
      expect(board.every(br => br.length <= CAP)).toBe(true);
      for (let id = 0; id < count; id++) expect(board.flat().filter(b => b === id)).toHaveLength(CAP);
      expect(winningMoves(board, budget)).toBeGreaterThan(0);
      expect(winningMoves(board, budget)).toBeLessThanOrEqual(budget);
    }
  }
});

test('constant random input cannot leak solved or impossible boards from either generator', () => {
  for (const rng of [() => 0, () => 0.999]) {
    expect(isWon(generateGentleLevel(3, CAP, EXTRA, 7, rng), CAP)).toBe(false);
    const board = generateLevel(5, CAP, EXTRA, rng);
    expect(isWon(board, CAP)).toBe(false);
    expect(isSolvable(board, CAP)).toBe(true);
  }
});

test('stretch levels offer more sorting effort than the introductory boards', () => {
  const effort = (level: number) => {
    let total = 0;
    for (let seed = 1; seed <= 25; seed++) {
      total += winningMoves(generateGentleLevel(speciesForLevel(level), CAP, EXTRA,
        scrambleForLevel(level), seeded(seed)), scrambleForLevel(level));
    }
    return total;
  };
  expect(effort(4)).toBeGreaterThan(effort(1));
  expect(effort(5)).toBeLessThan(effort(4));
});


test('Medium stays solvable at each middle-rung milestone and breather',()=>{
  for(const level of [1,5,9,12,30])for(let seed=1;seed<=20;seed++){
    const count=speciesForLevel(level,52,'medium');
    const b=generateGentleLevel(count,CAP,EXTRA,scrambleForLevel(level,'medium'),seeded(seed));
    expect(isWon(b,CAP)).toBe(false);
    expect(isSolvable(b,CAP)).toBe(true);
    expect(new Set(b.flat()).size).toBe(count);
  }
});
