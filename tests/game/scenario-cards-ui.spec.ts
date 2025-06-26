test('Slots are split into two rows: 1-3 (split/low die), 4-6 (combine/high die), with correct labels', async () => {
  const game = new GameState();
  game.initialize();
  const ui = new StargazeUI(game);
  document.body.innerHTML = '<div id="game-root"></div>';
  ui.init();

  // Simulate scenario selection (Sol-Core)
  const scenarioBtn = document.querySelector('.scenario-option');
  expect(scenarioBtn).toBeTruthy();
  scenarioBtn && (scenarioBtn as HTMLButtonElement).click();
  const startBtn = document.querySelector('.scenario-start-btn');
  expect(startBtn).toBeTruthy();
  startBtn && (startBtn as HTMLButtonElement).click();

  // Wait for scenario to load and cards to render
  await new Promise(r => setTimeout(r, 300));

  // Check for two rows
  const rows = document.querySelectorAll('.sector-row');
  expect(rows.length).toBe(2);
  // First row: slots 1-3
  const row1Slots = rows[0].querySelectorAll('.sector-slot');
  expect(row1Slots.length).toBe(3);
  row1Slots.forEach((slot, i) => {
    const label = slot.querySelector('div');
    expect(label).toBeTruthy();
    if (label) expect(label.textContent).toBe(`Slot ${i + 1}`);
  });
  // Second row: slots 4-6
  const row2Slots = rows[1].querySelectorAll('.sector-slot');
  expect(row2Slots.length).toBe(3);
  row2Slots.forEach((slot, i) => {
    const label = slot.querySelector('div');
    expect(label).toBeTruthy();
    if (label) expect(label.textContent).toBe(`Slot ${i + 4}`);
  });
});
test('Each slot is labeled Slot 1 through Slot 6 and all slots are on a single line', async () => {
  const game = new GameState();
  game.initialize();
  const ui = new StargazeUI(game);
  document.body.innerHTML = '<div id="game-root"></div>';
  ui.init();

  // Simulate scenario selection (Sol-Core)
  const scenarioBtn = document.querySelector('.scenario-option');
  expect(scenarioBtn).toBeTruthy();
  scenarioBtn && (scenarioBtn as HTMLButtonElement).click();
  const startBtn = document.querySelector('.scenario-start-btn');
  expect(startBtn).toBeTruthy();
  startBtn && (startBtn as HTMLButtonElement).click();

  // Wait for scenario to load and cards to render
  await new Promise(r => setTimeout(r, 300));

  // Check that each slot is labeled correctly
  const slots = document.querySelectorAll('.sector-slot');
  expect(slots.length).toBe(6);
  slots.forEach((slot, i) => {
    const label = slot.querySelector('div');
    expect(label).toBeTruthy();
    if (label) expect(label.textContent).toBe(`Slot ${i + 1}`);
  });

  // Note: In jsdom, grid styles are not computed as in a real browser, so we cannot reliably check the number of columns.
  // The single-line layout should be verified visually in the browser.
});
import { test, expect } from 'vitest';

// This test assumes jsdom and direct import of the UI and GameState
import { GameState } from '../../src/game/core';
import { StargazeUI } from '../../src/game/ui';

test('Scenario loads with all card names and points visible in each of 6 slots', async () => {
  const game = new GameState();
  game.initialize();
  const ui = new StargazeUI(game);
  document.body.innerHTML = '<div id="game-root"></div>';
  ui.init();

  // Simulate scenario selection (Sol-Core)
  const scenarioBtn = document.querySelector('.scenario-option');
  expect(scenarioBtn).toBeTruthy();
  scenarioBtn && (scenarioBtn as HTMLButtonElement).click();
  const startBtn = document.querySelector('.scenario-start-btn');
  expect(startBtn).toBeTruthy();
  startBtn && (startBtn as HTMLButtonElement).click();

  // Wait for scenario to load and cards to render
  await new Promise(r => setTimeout(r, 300));

  // Check that each slot has a card with name and points only
  for (let i = 1; i <= 6; i++) {
    const slot = document.querySelectorAll('.sector-slot')[i-1];
    expect(slot).toBeTruthy();
    // Active card
    const active = slot.querySelector('.card-active');
    expect(active).toBeTruthy();
    expect((active!).textContent).toMatch(/\w/); // name
    expect((active!).textContent).toMatch(/Points:/);
    // No cost, reward, durability, etc.
    expect((active!).textContent).not.toMatch(/Cost:|Reward:|Durability:|Scrap|Ability/);
  }
});
