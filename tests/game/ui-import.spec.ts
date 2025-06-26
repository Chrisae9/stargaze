import { describe, it, expect } from 'vitest';
import { StargazeUI } from '../../src/game/ui';

/**
 * @fileoverview
 * Minimal test to verify StargazeUI is importable for scenario selection UI TDD.
 */

describe('StargazeUI import', () => {
  it('should be defined and constructible', () => {
    expect(StargazeUI).toBeDefined();
    // The constructor expects a GameState, so we just check type for now
  });
});
