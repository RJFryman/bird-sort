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

// Build a solved board, then reverse-shuffle with legal single-bird moves so the
// result is always solvable. rng injectable for deterministic tests.
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
  while (isWon(b, capacity) && guard++ < 20) b = build();
  return b;
}
