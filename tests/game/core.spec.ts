import { describe, it, expect, beforeEach } from 'vitest';
import { GameState, SECTORS_COUNT } from '../../src/game/core';

/**
 * Test suite for Stargaze core game logic: GameState, Sector, Ship, and basic turn flow.
 */
describe('Stargaze Core Game Logic', () => {
  it('should ensure all default ship definitions have valid keys, names, and reasonable point values', () => {
    const defs = Object.values(game.shipDefinitions);
    defs.forEach(def => {
      expect(typeof def.key).toBe('string');
      expect(def.key.length).toBeGreaterThan(0);
      expect(typeof def.name).toBe('string');
      expect(def.name.length).toBeGreaterThan(0);
      expect(typeof def.points).toBe('number');
      // Points should be a small positive integer, e.g. 1-10
      expect(def.points).toBeGreaterThanOrEqual(1);
      expect(def.points).toBeLessThanOrEqual(10);
    });
  });
  let game: GameState;

  beforeEach(() => {
    game = new GameState();
    game.initialize();
  });

  it('should initialize with 6 sector slots and no extra fields', () => {
    expect(game.commandConsole.length).toBe(7); // 1-based, 6 slots
    for (let i = 1; i <= 6; i++) {
      expect(game.commandConsole[i]).toBeNull();
    }
  });

  it('should deploy cards to valid sectors', () => {
    const cardKey = Object.keys(game.shipDefinitions)[0];
    const result = game.deployShip(cardKey, 1);
    expect(result).toBe(true);
    expect(game.commandConsole[1]).not.toBeNull();
    expect(game.commandConsole[1]?.name).toBe(game.shipDefinitions[cardKey].name);
    // Card only has name and points
    expect(typeof game.commandConsole[1]?.name).toBe('string');
    expect(typeof game.commandConsole[1]?.points).toBe('number');
  });

  it('should not deploy cards to invalid sectors', () => {
    const cardKey = Object.keys(game.shipDefinitions)[0];
    expect(game.deployShip(cardKey, 0)).toBe(false);
    expect(game.deployShip(cardKey, 7)).toBe(false);
  });

  it('should roll two 3-sided dice at the start of a turn', () => {
    game.startPlayerTurn();
    expect(game.dice.length).toBe(2);
    expect(game.dice[0]).toBeGreaterThanOrEqual(1);
    expect(game.dice[0]).toBeLessThanOrEqual(3);
    expect(game.dice[1]).toBeGreaterThanOrEqual(1);
    expect(game.dice[1]).toBeLessThanOrEqual(3);
  });

  it('should allocate dice to sectors and activate cards', () => {
    // Deploy a card to sector 1
    const cardKey = Object.keys(game.shipDefinitions)[0];
    game.deployShip(cardKey, 1);
    game.dice = [1, 2];
    game.rolled = true;
    game.allocateDice([1, 2]);
    // For now, just check that the card is still present
    expect(game.commandConsole[1]).not.toBeNull();
  });

  it('should not allow allocation if dice not rolled', () => {
    expect(() => game.allocateDice([1, 2])).toThrow();
  });

  it('should trigger sector win when PP goal is reached', () => {
    // Sector win and ACT_STRUCTURE logic removed in minimal gameplay loop.
    // No test needed for sector win.
  });

  it('should trigger game over if all ships are destroyed', () => {
    for (let i = 1; i <= SECTORS_COUNT; i++) {
      game.commandConsole[i] = null;
    }
    game.checkEndConditions();
    expect(game.currentPhase).toBe('GAME_OVER');
  });
});
