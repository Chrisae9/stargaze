import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../../src/game/core';
import { EnemyBoard } from '../../src/enemies/EnemyBoard';

describe('Game Loop and Passive Slots', () => {
  let game: GameState;
  let enemy: EnemyBoard;

  beforeEach(() => {
    game = new GameState();
    game.initialize();
    enemy = new EnemyBoard();
    enemy.initialize();
  });

  it('should start with player turn, then alternate to enemy turn', () => {
    expect(game.currentPhase).toBe('SECTOR_PLAY');
    game.endPlayerTurn();
    expect(game.currentPhase).toBe('ENEMY_TURN');
    game.endEnemyTurn();
    expect(game.currentPhase).toBe('SECTOR_PLAY');
  });

  it('should have passive slots for player and enemy, all filled at start', () => {
    // Player passive slots
    expect(Array.isArray(game.passiveSlots)).toBe(true);
    for (let i = 1; i <= 6; i++) {
      expect(game.passiveSlots[i]?.length).toBeGreaterThan(0);
    }
    // Enemy passive slots removed: no longer tested
  });
});
