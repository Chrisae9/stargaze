import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../../src/game/core';
import { StargazeUI } from '../../src/game/ui';

describe('Passive UI and Gameplay Loop', () => {
  let game: GameState;
  let ui: StargazeUI;
  beforeEach(() => {
    game = new GameState();
    game.initialize();
    document.body.innerHTML = '<div id="game-root"></div>';
    ui = new StargazeUI(game);
    ui.init();
    // Simulate scenario selection and start
    const scenarioBtn = document.querySelector('.scenario-option');
    scenarioBtn && (scenarioBtn as HTMLButtonElement).click();
    const startBtn = document.querySelector('.scenario-start-btn');
    startBtn && (startBtn as HTMLButtonElement).click();
  });

  it('should show a passive button for all 6 slots', async () => {
    await new Promise(r => setTimeout(r, 200));
    // Find all sector slots (across both rows)
    const slots = Array.from(document.querySelectorAll('.sector-slot'));
    expect(slots.length).toBe(6);
    slots.forEach((slot, idx) => {
      const passives = slot.querySelector('.player-passives');
      expect(passives).toBeTruthy();
      // Should have a passive button
      const btn = passives?.querySelector('button');
      expect(btn).toBeTruthy();
    });
  });

  it('should allow a full loop: roll, combine, activate passive, and repeat', async () => {
    // Roll dice
    const rollBtn = document.getElementById('roll-dice-btn') as HTMLButtonElement;
    expect(rollBtn).toBeTruthy();
    rollBtn.click();
    await new Promise(r => setTimeout(r, 100));
    // Click combine (should always be present)
    const combineBtn = document.querySelector('[data-testid="combine-btn"]') as HTMLButtonElement;
    expect(combineBtn).toBeTruthy();
    combineBtn.click();
    await new Promise(r => setTimeout(r, 100));
    // Activate a passive (first slot)
    const passiveBtn = document.querySelector('.player-passives button') as HTMLButtonElement;
    expect(passiveBtn).toBeTruthy();
    passiveBtn.click();
    await new Promise(r => setTimeout(r, 100));
    // Progress should have increased
    const progress = document.getElementById('progress-value');
    expect(Number(progress?.textContent)).toBeGreaterThanOrEqual(1);
    // Try to roll again (should be possible after turn ends)
    rollBtn.click();
    await new Promise(r => setTimeout(r, 100));
    expect(document.querySelector('[data-testid="combine-btn"]')).toBeTruthy();
  });
});
