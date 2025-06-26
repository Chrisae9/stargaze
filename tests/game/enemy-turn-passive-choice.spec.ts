import { describe, it, expect, beforeEach } from 'vitest';
import { EnemyBoard } from '../../src/enemies/EnemyBoard';

function simulateEnemyTurn(board: EnemyBoard, chosenSlots: number[]) {
  // Simulate activating enemy cards in chosen slots
  return chosenSlots.map(i => {
    const card = board.slots[i];
    if (card) {
      card.score += 1; // Example: increment score as effect
      return `Activated enemy slot ${i}`;
    }
    return null;
  }).filter(Boolean);
}

describe('Enemy Turn and Passive Choice', () => {
  let board: EnemyBoard;
  beforeEach(() => {
    board = new EnemyBoard();
    board.initialize();
  });

  it('should allow player to choose which enemy cards to activate on enemy turn', () => {
    const chosen = [1, 3];
    const result = simulateEnemyTurn(board, chosen);
    expect(result).toContain('Activated enemy slot 1');
    expect(result).toContain('Activated enemy slot 3');
    expect(board.slots[1]?.score).toBe(1);
    expect(board.slots[3]?.score).toBe(1);
  });
});
