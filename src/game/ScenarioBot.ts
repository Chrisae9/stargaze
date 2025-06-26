import { GameState, SECTORS_COUNT } from './core';

/**
 * ScenarioBot: Automated player for scenario testing.
 * Uses weighted priorities and randomness to simulate a sensible player.
 */
export class ScenarioBot {
  /**
   * Weights for different action types. Adjust for balance testing.
   */
  static readonly ACTION_WEIGHTS = {
    allocateToProgress: 1.0, // Prioritize progress
    allocateToScrap: 0.7,    // Scrap/resource gain
    allocateToCharge: 0.5,   // Charge gain
    avoidDamage: 0.8,        // Avoiding damage
    useAbility: 0.6,         // Using ship abilities
    randomMove: 0.1,         // Chance to do something suboptimal
  };

  /**
   * Decide and perform the next action for the bot.
   * Returns a string describing the action taken.
   */
  static takeTurn(game: GameState): string {
    // Example: prioritize allocating dice to sectors with ships that give progress, else scrap, else random
    if (!game.rolled) {
      game.startPlayerTurn();
      return 'Rolled dice';
    }
    if (!game.allocated) {
      // Score each possible allocation
      const allocations = ScenarioBot.getPossibleAllocations(game);
      const scored = allocations.map(alloc => ({
        alloc,
        score: ScenarioBot.scoreAllocation(game, alloc)
      }));
      // Weighted random pick: usually best, sometimes random
      scored.sort((a, b) => b.score - a.score);
      const best = scored[0];
      const doRandom = Math.random() < ScenarioBot.ACTION_WEIGHTS.randomMove;
      const pick = doRandom && scored.length > 1 ? scored[1] : best;
      game.allocateDice(pick.alloc);
      return `Allocated dice: [${pick.alloc.join(', ')}]`;
    }
    // End turn if nothing else to do
    game.endTurn();
    return 'Ended turn';
  }

  /**
   * Generate all possible dice allocations (simple: split or combine)
   */
  static getPossibleAllocations(game: GameState): number[][] {
    const [d1, d2] = game.dice;
    const allocations: number[][] = [];
    if (d1 >= 1 && d1 <= SECTORS_COUNT) allocations.push([d1]);
    if (d2 >= 1 && d2 <= SECTORS_COUNT && d2 !== d1) allocations.push([d2]);
    if (d1 !== d2 && d1 >= 1 && d2 >= 1 && d1 <= SECTORS_COUNT && d2 <= SECTORS_COUNT) allocations.push([d1, d2]);
    if (d1 + d2 >= 1 && d1 + d2 <= SECTORS_COUNT) allocations.push([d1 + d2]);
    return allocations;
  }

  /**
   * Score an allocation based on weights and current game state.
   */
  static scoreAllocation(game: GameState, alloc: number[]): number {
    let score = 0;
    for (const sector of alloc) {
      const ship = game.commandConsole[sector];
      if (!ship) continue;
      // Prioritize progress
      if (ship.reward?.pp) score += ScenarioBot.ACTION_WEIGHTS.allocateToProgress * ship.reward.pp;
      // Scrap
      if (ship.reward?.scrap) score += ScenarioBot.ACTION_WEIGHTS.allocateToScrap * ship.reward.scrap;
      // Charge
      if (ship.reward?.charge) score += ScenarioBot.ACTION_WEIGHTS.allocateToCharge * ship.reward.charge;
      // Use ability if available
      if (ship.ability) score += ScenarioBot.ACTION_WEIGHTS.useAbility;
      // Avoid damage (if ship is low durability)
      if (ship.currentDurability < ship.maxDurability / 2) score += ScenarioBot.ACTION_WEIGHTS.avoidDamage;
    }
    // Add a small random factor
    score += Math.random() * 0.1;
    return score;
  }
}
