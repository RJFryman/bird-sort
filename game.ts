export type Species = number;
export type Branch = Species[];
export type Board = Branch[];

export function topGroup(branch: Branch): number {
  if (branch.length === 0) return 0;
  const c = branch[branch.length - 1];
  let n = 0;
  for (let i = branch.length - 1; i >= 0 && branch[i] === c; i--) n++;
  return n;
}

export function isCleared(branch: Branch, capacity: number): boolean {
  return branch.length === capacity && branch.every((c) => c === branch[0]);
}

export function canMove(board: Board, from: number, to: number, capacity: number): boolean {
  if (from === to || board[from].length === 0) return false;
  if (isCleared(board[from], capacity)) return false; // locked, solved branch
  if (board[to].length >= capacity) return false;
  if (board[to].length === 0) return true;
  return board[to][board[to].length - 1] === board[from][board[from].length - 1];
}

export function applyMove(board: Board, from: number, to: number, capacity: number): Board {
  const next = board.map((b) => b.slice());
  const n = Math.min(topGroup(next[from]), capacity - next[to].length);
  for (let i = 0; i < n; i++) next[to].push(next[from].pop() as Species);
  return next;
}

export function isWon(board: Board, capacity: number): boolean {
  return board.every((b) => b.length === 0 || isCleared(b, capacity));
}

// Canonical branch order collapses equivalent positions during solver search.
const canonical = (b: Board) => b.map((br) => br.join(',')).sort().join('|');

export function isSolvable(board: Board, capacity: number): boolean {
  const seen = new Set<string>();
  const walk = (b: Board): boolean => {
    if (isWon(b, capacity)) return true;
    const k = canonical(b);
    if (seen.has(k)) return false;
    seen.add(k);
    for (let from = 0; from < b.length; from++) {
      for (let to = 0; to < b.length; to++) {
        if (!canMove(b, from, to, capacity)) continue;
        // Tipping a whole uniform branch into an empty one only relabels
        // branches. The canonical key can't see that, so prune it here.
        if (b[to].length === 0 && b[from].every((c) => c === b[from][0])) continue;
        if (walk(applyMove(b, from, to, capacity))) return true;
      }
    }
    return false;
  };
  return walk(board.map((br) => br.slice()));
}

// Hard-mode random shuffle: colour-ignoring moves need solver validation.
// Retry exhaustion falls back to a proven reversible scramble, never to a
// rejected board. rng is injectable for reproducible tests.
export function generateLevel(
  species: number,
  capacity: number,
  extra: number,
  rng: () => number = Math.random,
): Board {
  const build = (): Board => {
    const b: Board = [];
    for (let s = 0; s < species; s++) b.push(Array(capacity).fill(s));
    for (let e = 0; e < extra; e++) b.push([]);
    const pick = (pred: (br: Branch, i: number) => boolean): number => {
      const ok = b.map((br, i) => (pred(br, i) ? i : -1)).filter((i) => i >= 0);
      return ok.length ? ok[Math.floor(rng() * ok.length)] : -1;
    };
    for (let i = 0; i < 80 * species; i++) {
      const from = pick((br) => br.length > 0);
      if (from < 0) continue;
      const to = pick((br, idx) => idx !== from && br.length < capacity);
      if (to < 0) continue;
      b[to].push(b[from].pop() as Species);
    }
    return b;
  };
  let b = build();
  let guard = 0;
  while ((isWon(b, capacity) || !isSolvable(b, capacity)) && guard++ < 50) b = build();
  // Never return the last rejected candidate when random retries run out.
  if (isWon(b, capacity) || !isSolvable(b, capacity)) {
    return generateGentleLevel(species, capacity, extra, 6, rng);
  }
  return b;
}


// Reverse only moves that the real rules can undo exactly. Each accepted step
// prepends a legal move to a solution, so scrambleSteps bounds winning effort.
// Cleared branches are locked in play; testing the inverse includes that rule.
export function generateGentleLevel(
  species: number,
  capacity: number,
  extra: number,
  scrambleSteps: number,
  rng: () => number = Math.random,
): Board {
  let board: Board = Array.from({ length: species }, (_, id) => Array(capacity).fill(id));
  board.push(...Array.from({ length: extra }, () => []));
  const seen = new Set([canonical(board)]);
  for (let step = 0; step < scrambleSteps; step++) {
    const candidates: Board[] = [];
    for (let from = 0; from < board.length; from++) {
      for (let to = 0; to < board.length; to++) {
        if (from === to) continue;
        for (let n = 1; n <= Math.min(topGroup(board[from]), capacity - board[to].length); n++) {
          const next = board.map((br) => br.slice());
          next[to].push(...next[from].splice(-n));
          if (seen.has(canonical(next)) || !canMove(next, to, from, capacity)) continue;
          if (JSON.stringify(applyMove(next, to, from, capacity)) !== JSON.stringify(board)) continue;
          candidates.push(next);
        }
      }
    }
    if (!candidates.length) break;
    board = candidates[Math.floor(rng() * candidates.length)];
    seen.add(canonical(board));
  }
  return board;
}
