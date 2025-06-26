import { GameState, SECTORS_COUNT } from './core';
import { ScenarioBot } from './ScenarioBot';

/**
 * Utility to generate a recommendation string for the current game state.
 * Used in dev mode to suggest the best action after each player move.
 */
export function getRecommendedAction(game: GameState): string {
  if (!game.rolled) {
    return 'Recommendation: Roll the dice to start your turn.';
  }
  if (!game.allocated) {
    // Score all allocations
    const allocations = ScenarioBot.getPossibleAllocations(game);
    if (allocations.length === 0) return 'No valid dice allocations.';
    const scored = allocations.map(alloc => ({
      alloc,
      score: ScenarioBot.scoreAllocation(game, alloc)
    }));
    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    // Estimate chance of success (normalize score to 0-100%)
    const total = scored.reduce((sum, s) => sum + s.score, 0) || 1;
    const percent = Math.round((best.score / total) * 100);
    return `Recommendation: Allocate dice to [${best.alloc.join(', ')}]. Estimated best outcome chance: ${percent}%.`;
  }
  // After allocation, recommend ending turn
  return 'Recommendation: End your turn to gain salvage income and proceed.';
}
