import { describe, it, expect, beforeEach } from 'vitest';
import { EnemyBoard } from '../../src/enemies/EnemyBoard';

describe('Enemy Board', () => {
  let enemy: EnemyBoard;
  beforeEach(() => {
    enemy = new EnemyBoard();
    enemy.initialize();
  });

  it('should have 6 enemy slots', () => {
    expect(enemy.slots.length).toBe(7); // 1-based, 6 slots
    for (let i = 1; i <= 6; i++) {
      expect(enemy.slots[i]).not.toBeUndefined();
    }
  });

  it('should populate each slot with an enemy card (name, points)', () => {
    for (let i = 1; i <= 6; i++) {
      const card = enemy.slots[i];
      expect(card).toBeTruthy();
      expect(typeof card.name).toBe('string');
      expect(typeof card.points).toBe('number');
    }
  });

  it('should not use player card pool for enemy cards', () => {
    // Enemy cards are defined in their own config, not from player pool
    for (let i = 1; i <= 6; i++) {
      const card = enemy.slots[i];
      expect(card.name).toMatch(/^Enemy/);
    }
  });
});
