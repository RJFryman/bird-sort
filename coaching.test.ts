import { findCoachingMove, winningMove } from './coaching';
import { applyMove, canMove, isWon } from './game';
jest.mock('@react-native-async-storage/async-storage', () => ({ getItem: jest.fn(), setItem: jest.fn() }));
test('optional coaching leads a child to a win through legal moves without changing the original board', () => {
  const start = [[0,0,0],[1,1,1,0],[1],[]];
  let board = start;
  for (let i = 0; i < 8 && !isWon(board, 4); i++) {
    const hint = winningMove(board);
    expect(hint).not.toBeNull();
    expect(canMove(board, hint!.from, hint!.to, 4)).toBe(true);
    board = applyMove(board, hint!.from, hint!.to, 4);
  }
  expect(isWon(board, 4)).toBe(true);
  expect(start).toEqual([[0,0,0],[1,1,1,0],[1],[]]);
});
test('coaching returns no invented winning move for a solved or blocked board', () => {
  expect(winningMove([[0,0,0,0],[1,1,1,1],[],[]])).toBeNull();
  expect(winningMove([[0,1],[1,0]], 2)).toBeNull();
});


import { generateLevel } from './game';
function seeded(seed:number) { let x=seed; return () => ((x=(Math.imul(x,1664525)+1013904223)>>>0)/0x100000000); }
test('Hard coaching finds complete winning paths for fresh nine- and ten-species boards', () => {
  for (const species of [9,10]) for(let seed=1;seed<=30;seed++) {
    let board=generateLevel(species,4,2,seeded(seed));
    for(let step=0;step<240&&!isWon(board,4);step++) {
      const result=findCoachingMove(board);
      expect(result.status).toBe('move');
      if(result.status!=='move') throw Error(`No hint for ${species} species seed ${seed}: ${result.status}`);
      expect(canMove(board,result.move.from,result.move.to,4)).toBe(true);
      board=applyMove(board,result.move.from,result.move.to,4);
    }
    expect(isWon(board,4)).toBe(true);
  }
},30000);
test('a search limit is distinguished from a blocked puzzle',()=>{
  expect(findCoachingMove([[40,41],[41,40],[],[]],2,0).status).toBe('limited');
  expect(findCoachingMove([[40,41],[41,40]],2).status).toBe('blocked');
});
