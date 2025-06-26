
// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Wait for a DOM condition to be true, polling every 10ms up to timeout ms.
 * @param {() => boolean} condition
 * @param {number} timeout
 */
async function waitFor(condition: () => boolean, timeout = 500) {
  const start = Date.now();
  return new Promise<void>((resolve, reject) => {
    function check() {
      if (condition()) return resolve();
      if (Date.now() - start > timeout) return reject(new Error('waitFor timeout'));
      setTimeout(check, 10);
    }
    check();
  });
}
import { StargazeUI } from '../../src/game/ui';

/**
 * @fileoverview
 * Scenario selection and UI/game boot flow tests for Stargaze.
 * Ensures scenario selection UI is shown on boot, and game always starts in a valid, playable state after scenario selection.
 */

declare global {
  interface Window {
    StargazeUI?: any;
  }
}

describe('Scenario Selection UI & Game Boot', () => {

  it('shows scenario selection modal above the main UI on boot', () => {
    // Set up DOM root for UI rendering
    root.id = 'game-root';
    ui.init();
    const modal = document.querySelector('.scenario-selection-modal') as HTMLElement;
    expect(modal).toBeTruthy();
    // Modal should be visible
    expect(getComputedStyle(modal).display).not.toBe('none');
    // Modal should be on top (z-index or DOM order)
    // Check that modal is the last child of root (rendered after main UI)
    expect(root.lastElementChild).toBe(modal);
    // Optionally, check for a high z-index (if set)
    // expect(Number(getComputedStyle(modal).zIndex) || 0).toBeGreaterThanOrEqual(10);
  });
  let root: HTMLElement;
  let ui: StargazeUI;
  let mockGameState: any;

  beforeEach(() => {
    // Set up DOM root for UI rendering
    root = document.createElement('div');
    root.id = 'root';
    document.body.innerHTML = '';
    document.body.appendChild(root);
    window.localStorage.clear();
    // Minimal mock GameState for UI construction
    mockGameState = {
      scrap: 10,
      progressPoints: 0,
      charge: 0,
      actProgress: 0,
      pursuitLevel: 0,
      rolled: false,
      dice: [1, 1],
      allocated: false,
      commandConsole: {},
      startPlayerTurn: () => {},
      allocateDice: () => {},
    };
    ui = new StargazeUI(mockGameState);
  });

  it('shows scenario selection UI on boot', () => {
    // Patch: StargazeUI expects #game-root, so set id
    root.id = 'game-root';
    ui.init();
    const scenarioModal = document.querySelector('.scenario-selection-modal');
    expect(scenarioModal).toBeTruthy();
    expect(scenarioModal?.textContent).toMatch(/select.*scenario/i);
  });

  it('populates scenario list and allows selection', async () => {
    root.id = 'game-root';
    ui.init();
    const options = document.querySelectorAll('.scenario-option');
    expect(options.length).toBeGreaterThan(0);
    // Simulate clicking the first scenario
    (options[0] as HTMLElement).click();
    // Simulate clicking Start Game
    const startBtn = document.querySelector('.scenario-start-btn') as HTMLElement;
    expect(startBtn).toBeTruthy();
    startBtn.click();
    // Wait for modal to disappear (async scenario setup)
    await waitFor(() => !document.querySelector('.scenario-selection-modal'));
    expect(document.querySelector('.scenario-selection-modal')).toBeFalsy();
  });

  it('starts game in valid, playable state after scenario selection', async () => {
    root.id = 'game-root';
    ui.init();
    const options = document.querySelectorAll('.scenario-option');
    (options[0] as HTMLElement).click();
    // Simulate clicking Start Game
    const startBtn = document.querySelector('.scenario-start-btn') as HTMLElement;
    expect(startBtn).toBeTruthy();
    startBtn.click();
    // Wait for sector slots to be populated (async scenario setup)
    await waitFor(() => {
      const slotEls = document.querySelectorAll('.sector-slot');
      return slotEls.length === 6 && Array.from(slotEls).every(slot => {
        // Check for card name and points in each slot
        const name = slot.querySelector('.card-name');
        const points = slot.querySelector('.card-points');
        return name && points;
      });
    });
    const slotEls = document.querySelectorAll('.sector-slot');
    expect(slotEls.length).toBe(6);
    slotEls.forEach(slot => {
      expect(slot.querySelector('.card-name')).toBeTruthy();
      expect(slot.querySelector('.card-points')).toBeTruthy();
    });
    // No error banners or broken state
    expect(document.querySelector('.ui-error')).toBeFalsy();
  });

  it('shows error if scenario selection fails or is invalid', () => {
    root.id = 'game-root';
    ui.init();
    // Simulate invalid selection (e.g., click nothing and try to start)
    const startBtn = document.querySelector('.scenario-start-btn') as HTMLElement;
    if (startBtn) startBtn.click();
    expect(document.querySelector('.ui-error')).toBeTruthy();
  });
});
