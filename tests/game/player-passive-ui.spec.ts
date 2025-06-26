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

describe('Player Passive Slots UI', () => {
  let game: GameState;
  beforeEach(() => {
    game = new GameState();
    game.initialize();
    fillAllSlotsWithPassives(game);
  });

  it('should display player passive slots in the UI', async () => {
    // Simulate UI rendering
    const { StargazeUI } = await import('../../src/game/ui');
    const root = document.createElement('div');
    root.id = 'game-root';
    document.body.appendChild(root);
    const ui = new StargazeUI(game);
    ui.init();
    // Check for player-passives class in DOM
    const passives = document.querySelectorAll('.player-passives');
    expect(passives.length).toBeGreaterThan(0);
    document.body.removeChild(root);
  });
});
