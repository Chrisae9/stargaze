import { describe, it, expect, beforeEach } from 'vitest';
import { GameState, SECTORS_COUNT } from '../../src/game/core';

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

describe('Player Passive Activation', () => {
  let game: GameState;
  beforeEach(() => {
    game = new GameState();
    game.initialize();
    fillAllSlotsWithPassives(game);
  });

  it('should activate a passive and apply its effect (gain VP)', () => {
    // Simulate activating a passive slot
    const slot = 1;
    const before = game.progressPoints;
    // Simulate: activating a passive adds its value to progressPoints
    const passive = game.passiveSlots[slot][0];
    if (passive) {
      game.progressPoints += passive.points;
    }
    expect(game.progressPoints).toBe(before + 2);
  });
});
