import { describe, it, expect, beforeEach } from 'vitest';
import { EnemyBoard } from '../../src/enemies/EnemyBoard';

describe('EnemyBoard scoring', () => {
  let board: EnemyBoard;

  beforeEach(() => {
    board = new EnemyBoard();
    board.initialize();
  });

  it('should initialize all enemies with score 0', () => {
    for (let i = 1; i <= 6; i++) {
      expect(board.slots[i]?.score).toBe(0);
    }
  });

  it('should allow incrementing an enemy score', () => {
    board.incrementScore(2, 5);
    expect(board.slots[2]?.score).toBe(5);
    board.incrementScore(2, 3);
    expect(board.slots[2]?.score).toBe(8);
  });

  it('should not increment score for empty slot', () => {
    board.slots[3] = null;
    expect(() => board.incrementScore(3, 2)).toThrow();
  });
});
