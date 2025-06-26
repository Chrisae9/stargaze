import { describe, it, expect } from 'vitest';
import { GameState, ShipDefinition } from '../../src/game/core';

// Example scenario definition for test
const testScenario = {
  name: 'Sol-Core Start',
  deck: [
    { key: 'scrap_drone', slot: 1 },
    { key: 'prospector', slot: 2 },
    { key: 'laser_turret', slot: 3 },
    { key: 'target_sys', slot: 4 },
  ],
  resources: { scrap: 10, salvageIncome: 2, charge: 1 },
};

function applyScenario(game: GameState, scenario: typeof testScenario) {
  game.scrap = scenario.resources.scrap;
  game.salvageIncome = scenario.resources.salvageIncome;
  game.charge = scenario.resources.charge;
  scenario.deck.forEach(card => {
    game.deployShip(card.key, card.slot);
  });
}

describe('Scenario Initialization', () => {
  it('should populate 6 slots with cards (name, points) and leave others empty', () => {
    const game = new GameState();
    game.initialize();
    // Simulate scenario: fill 1-4, leave 5-6 empty
    game.deployShip('scrap_drone', 1);
    game.deployShip('prospector', 2);
    game.deployShip('laser_turret', 3);
    game.deployShip('target_sys', 4);
    expect(game.commandConsole[1]?.name).toBeDefined();
    expect(typeof game.commandConsole[1]?.points).toBe('number');
    expect(game.commandConsole[2]?.name).toBeDefined();
    expect(typeof game.commandConsole[2]?.points).toBe('number');
    expect(game.commandConsole[3]?.name).toBeDefined();
    expect(typeof game.commandConsole[3]?.points).toBe('number');
    expect(game.commandConsole[4]?.name).toBeDefined();
    expect(typeof game.commandConsole[4]?.points).toBe('number');
    // Slots 5 and 6 should be empty
    expect(game.commandConsole[5]).toBeNull();
    expect(game.commandConsole[6]).toBeNull();
  });
});
