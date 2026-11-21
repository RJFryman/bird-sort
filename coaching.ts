// Optional first-play teaching and bounded winning-path help; never moves pieces for the child.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Board, canMove, applyMove, isWon } from './game';

const TUTORIAL_KEY = 'bird-sort-tutorial-v1';
export const tutorialSeen = async () => {
  try { return await AsyncStorage.getItem(TUTORIAL_KEY) === '1'; } catch { return false; }
};
export const rememberTutorial = async () => {
  try { await AsyncStorage.setItem(TUTORIAL_KEY, '1'); } catch { /* teaching remains optional */ }
};
export type CoachingMove = { from: number; to: number };
const key = (board: Board) => board.map(b => b.join(',')).sort().join('|');

export type CoachingResult = { status: 'move'; move: CoachingMove } | { status: 'solved' | 'limited' | 'blocked' };
const plans = new Map<string, CoachingMove>();
const exactKey = (board: Board, cap: number) => `${cap}:${JSON.stringify(board)}`;

/** Depth-first winning paths avoid breadth-first explosion on large Hard boards. */
export function findCoachingMove(board: Board, cap = 4, budget = 100000): CoachingResult {
  if (isWon(board, cap)) return { status: 'solved' };
  const cached = plans.get(exactKey(board, cap));
  if (cached && canMove(board, cached.from, cached.to, cap)) return { status: 'move', move: cached };
  const seen = new Set<string>();
  let limited = false;
  function walk(current: Board, depth: number): boolean {
    if (isWon(current, cap)) return true;
    if (seen.size >= budget || depth >= 240) { limited = true; return false; }
    const id = key(current);
    if (seen.has(id)) return false;
    seen.add(id);
    const moves: { from: number; to: number; next: Board; score: number }[] = [];
    const children = new Set<string>();
    for (let from = 0; from < current.length; from++) for (let to = 0; to < current.length; to++) {
      if (!canMove(current, from, to, cap)) continue;
      // A uniform group into empty space merely renames equivalent branches.
      if (!current[to].length && current[from].every(id => id === current[from][0])) continue;
      const next = applyMove(current, from, to, cap);
      const child = key(next);
      if (children.has(child) || seen.has(child)) continue;
      children.add(child);
      moves.push({ from, to, next, score: (current[to].length ? 10 : 0) + (!next[from].length ? 8 : 0) + (next[to].length === cap ? 12 : 0) });
    }
    moves.sort((a, b) => b.score - a.score);
    for (const move of moves) {
      if (walk(move.next, depth + 1)) {
        if (plans.size > 4000) plans.clear();
        plans.set(exactKey(current, cap), { from: move.from, to: move.to });
        return true;
      }
      if (seen.size >= budget) break;
    }
    return false;
  }
  if (walk(board, 0)) return { status: 'move', move: plans.get(exactKey(board, cap))! };
  return { status: limited ? 'limited' : 'blocked' };
}

export function winningMove(board: Board, cap = 4, budget = 100000): CoachingMove | null {
  const result = findCoachingMove(board, cap, budget);
  return result.status === 'move' ? result.move : null;
}

export function say(text: string): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return false;
  window.speechSynthesis.cancel();
  const words = new SpeechSynthesisUtterance(text);
  words.rate = .85;
  window.speechSynthesis.speak(words);
  return true;
}
