import { GameState } from './core';
import { StargazeUI } from './ui';

window.addEventListener('DOMContentLoaded', () => {
  const game = new GameState();
  game.initialize();
  const ui = new StargazeUI(game);
  ui.init();
});
