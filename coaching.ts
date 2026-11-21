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

export function winningMove(board: Board, cap = 4, budget = 10000): CoachingMove | null {
  if (isWon(board, cap)) return null;
  const seen = new Set([key(board)]);
  const queue: { board: Board; first?: CoachingMove }[] = [{ board }];
  for (let cursor = 0; cursor < queue.length && seen.size <= budget; cursor++) {
    const current = queue[cursor];
    for (let from = 0; from < current.board.length; from++) {
      for (let to = 0; to < current.board.length; to++) {
        if (!canMove(current.board, from, to, cap)) continue;
        const next = applyMove(current.board, from, to, cap);
        const first = current.first ?? { from, to };
        if (isWon(next, cap)) return first;
        const id = key(next);
        if (seen.has(id)) continue;
        seen.add(id);
        queue.push({ board: next, first });
      }
    }
  }
  return null;
}

export function say(text: string): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') return false;
  window.speechSynthesis.cancel();
  const words = new SpeechSynthesisUtterance(text);
  words.rate = .85;
  window.speechSynthesis.speak(words);
  return true;
}
