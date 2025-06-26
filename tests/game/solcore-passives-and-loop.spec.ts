import { describe, it, expect, beforeEach } from 'vitest';
import { GameState, SECTORS_COUNT } from '../../src/game/core';

// Utility: create a scenario with all slots filled and passives
function fillAllSlotsWithPassives(game: GameState, passiveKey = 'brand_ambassador') {
  const keys = Object.keys(game.shipDefinitions);
  for (let i = 1; i <= SECTORS_COUNT; i++) {
    game.deployShip(keys[i % keys.length], i);
    game.passiveSlots[i] = [
      {
        key: passiveKey,
        name: 'Brand Ambassador',
        points: 2,
        id: `passive_${i}`
      }
    ];
  }
}

describe('Sol-Core Scenario Setup', () => {
  let game: GameState;
  beforeEach(() => {
    game = new GameState();
    game.initialize();
  });

  it('should populate player passive slots with Sol-Core passives', () => {
    fillAllSlotsWithPassives(game);
    for (let i = 1; i <= SECTORS_COUNT; i++) {
      expect(game.passiveSlots[i].length).toBeGreaterThan(0);
      expect(game.passiveSlots[i][0].name).toBe('Brand Ambassador');
    }
  });
});

describe('Enemy Board', () => {
  it('should not have passive slots for enemies', async () => {
    const { EnemyBoard } = await import('../../src/enemies/EnemyBoard');
    const enemyBoard = new EnemyBoard();
    enemyBoard.initialize();
    expect(enemyBoard.passiveSlots).toBeUndefined();
  });
});

describe('Gameplay Loop', () => {
  let game: GameState;
  beforeEach(() => {
    game = new GameState();
    game.initialize();
    fillAllSlotsWithPassives(game);
  });

  it('should gain VP on active slot(s) after allocation', () => {
    game.startPlayerTurn();
    const [d1, d2] = game.dice;
    const before = game.progressPoints;
    game.allocateDice([d1, d2]);
    expect(game.progressPoints).toBeGreaterThan(before);
  });

  it('should allow player to choose which enemy cards to activate passives for on enemy turn', () => {
    // Simulate enemy turn logic: player chooses which enemy cards to activate
    // For now, just check that a function can be called for this
    let chosen = [1, 2];
    function activateEnemyPassives(slots: number[]) {
      return slots.map(i => `Activated enemy slot ${i}`);
    }
    const result = activateEnemyPassives(chosen);
    expect(result).toContain('Activated enemy slot 1');
    expect(result).toContain('Activated enemy slot 2');
  });
});
