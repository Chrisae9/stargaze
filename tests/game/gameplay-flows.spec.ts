import { describe, it, expect, beforeEach } from 'vitest';
import { GameState, SECTORS_COUNT } from '../../src/game/core';

// Utility: create a scenario with all slots filled
function fillAllSlots(game: GameState) {
  const keys = Object.keys(game.shipDefinitions);
  for (let i = 1; i <= SECTORS_COUNT; i++) {
    game.deployShip(keys[i % keys.length], i);
  }
}

describe('Gameplay Flows', () => {
  let game: GameState;

  beforeEach(() => {
    game = new GameState();
    game.initialize();
  });

  it('should start with a valid, playable state', () => {
    expect(game.scrap).toBeGreaterThanOrEqual(0);
    expect(game.commandConsole.length).toBe(SECTORS_COUNT + 1);
    expect(game.currentPhase).toBe('SECTOR_PLAY');
  });

  it('should allow dice rolling and allocation to valid slots', () => {
    fillAllSlots(game);
    game.startPlayerTurn();
    expect(game.rolled).toBe(true);
    const [d1, d2] = game.dice;
    // Try all valid allocations
    if (d1 >= 1 && d1 <= SECTORS_COUNT && d2 >= 1 && d2 <= SECTORS_COUNT) {
      game.allocateDice([d1, d2]);
      expect(game.allocated).toBe(true);
    }
  });

  it('should not allow allocation if dice not rolled', () => {
    fillAllSlots(game);
    expect(() => game.allocateDice([1, 2])).toThrow();
  });

  it('should destroy ships when durability reaches zero', () => {
    fillAllSlots(game);
    // Set all ships to 1 durability
    for (let i = 1; i <= SECTORS_COUNT; i++) {
      if (game.commandConsole[i]) game.commandConsole[i]!.currentDurability = 1;
    }
    game.startPlayerTurn();
    const [d1, d2] = game.dice;
    game.allocateDice([d1, d2]);
    // At least one ship should be destroyed
    const destroyed = game.commandConsole.filter(s => s === null).length;
    expect(destroyed).toBeGreaterThanOrEqual(1);
  });

  it('should trigger game over if all ships are destroyed', () => {
    for (let i = 1; i <= SECTORS_COUNT; i++) {
      game.commandConsole[i] = null;
    }
    game.checkEndConditions();
    expect(game.currentPhase).toBe('GAME_OVER');
  });

  it('should handle edge case: all slots empty at start', () => {
    // No ships deployed
    for (let i = 1; i <= SECTORS_COUNT; i++) {
      expect(game.commandConsole[i]).toBeNull();
    }
    game.checkEndConditions();
    // Should not crash, should trigger game over
    expect(game.currentPhase).toBe('GAME_OVER');
  });
});
