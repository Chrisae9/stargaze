import { GameState } from './core';
import { getRecommendedAction } from './ui-recommendation';
import { EnemyBoard } from '../enemies/EnemyBoard';

/**
 * Stargaze UI manager: handles DOM rendering and user interaction.
 * This is a minimal scaffold for the first interactive run.
 */

export class StargazeUI {
  private game: GameState;
  private enemyBoard: EnemyBoard;
  private log: string[] = [];
  private lastHighlighted: number[] = [];
  private container: HTMLDivElement | null = null;

  constructor(game: GameState) {
    this.game = game;
    this.enemyBoard = new EnemyBoard();
    this.enemyBoard.initialize();
  }

  /**
   * Initialize the UI and render the initial state.
   */
  init() {
    const root = document.getElementById('game-root') || document.body;
    const container = document.createElement('div');
    container.id = 'stargaze-ui';
    this.container = container;
    // Scenario selection modal (shown on boot)
    const modal = document.createElement('div');
    modal.className = 'scenario-selection-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.85)';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000'; // Ensure modal is on top
    modal.innerHTML = `
      <div style="background:#18181b;padding:2rem 2.5rem;border-radius:1rem;box-shadow:0 0 24px #000;max-width:420px;width:90vw;">
        <h2 style="margin-bottom:1rem;">Select a Scenario</h2>
        <div class="scenario-list" style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1rem;"></div>
        <button class="scenario-start-btn" style="margin-top:1rem;width:100%;padding:0.5rem 0.75rem;font-size:1rem;">Start Game</button>
        <div class="ui-error" style="color:#f87171;margin-top:0.5rem;display:none;"></div>
      </div>
    `;
    // Populate scenario options
    const scenarios = [
      { key: 'solcore', name: 'Sol-Core Fleet', desc: 'All Sol-Core ships. (Demo)' },
      // Add more scenarios here as needed
    ];
    const list = modal.querySelector('.scenario-list');
    let selected: any = null;
    scenarios.forEach((sc, i) => {
      const opt = document.createElement('button');
      opt.className = 'scenario-option';
      opt.textContent = sc.name;
      opt.style.padding = '0.5rem 0.75rem';
      opt.style.background = '#27272a';
      opt.style.color = '#e4e4e7';
      opt.style.border = '1px solid #52525b';
      opt.style.borderRadius = '0.5rem';
      opt.style.cursor = 'pointer';
      opt.onclick = () => {
        selected = sc;
        // Highlight selected
        Array.from(list!.children).forEach((el, idx) => {
          (el as HTMLElement).style.background = idx === i ? '#334155' : '#27272a';
        });
      };
      list!.appendChild(opt);
    });
    // Start button logic
    const startBtn = modal.querySelector('.scenario-start-btn') as HTMLButtonElement;
    const errorDiv = modal.querySelector('.ui-error') as HTMLDivElement;
    startBtn.onclick = () => {
      if (!selected) {
        errorDiv.textContent = 'Please select a scenario.';
        errorDiv.style.display = 'block';
        return;
      }
      // Initialize game state for Sol-Core scenario
      if (selected.key === 'solcore') {
        // Import Sol-Core ships
        // Dynamically import to avoid circular deps
        import('../cards/sol-core').then(solcore => {
          const solCoreShips = [
            solcore.BrandAmbassador,
            solcore.BrandingSatellite,
            solcore.CorporateEnforcer,
            solcore.CrystallineFrigate,
            solcore.ExecutiveInterceptor,
            solcore.FinanceDrone,
            solcore.HoloAdvertiser,
            solcore.ParadiseCourier,
            solcore.PoliteSecurity,
            solcore.SurveillanceArray,
          ];
          // For demo: each slot gets an active and a passive card (like a deckbuilder's starting deck)
          this.game.commandConsole = Array(9).fill(null);
          this.game.passiveSlots = Array(9).fill(null).map(() => []);
          for (let i = 1; i <= 8; i++) {
            // For 6 slots, always assign a passive, and show VP value in UI
            const activeOrder = [0, 1, 2, 3, 4, 5];
            const passiveOrder = [1, 2, 3, 4, 5, 0];
            const activeDef = solCoreShips[activeOrder[(i-1)%6]];
            const passiveDef = solCoreShips[passiveOrder[(i-1)%6]];
            this.game.commandConsole[i] = {
              ...activeDef,
              id: `solcore_active_${activeDef.key}_${i}`
            };
            this.game.passiveSlots[i] = [
              {
                ...passiveDef,
                id: `solcore_passive_${passiveDef.key}_${i}`
              }
            ];
          }
          // Hide modal and render main UI
          modal.remove();
          this.render();
        });
        return;
      }
      // Hide modal and render main UI
      modal.remove();
      this.render();
    };
    // Main game UI (hidden until scenario selected)
    container.innerHTML = `
      <h1>Stargaze Deckbuilder (Prototype)</h1>
      <div id="sector-info-panel" style="margin-bottom:1rem;">
        <strong>Sector:</strong> <span id="sector-name"></span> |
        <strong>Goal:</strong> <span id="sector-goal"></span> |
        <strong>Pursuit:</strong> <span id="sector-pursuit"></span> |
        <span id="sector-effect" style="font-style:italic;"></span>
      </div>
      <div id="game-state-summary">
        <p>Scrap: <span id="scrap-value">${this.game.scrap}</span></p>
        <p>Progress: <span id="progress-value">${this.game.progressPoints}</span></p>
        <p>Charge: <span id="charge-value">${this.game.charge}</span></p>
        <button id="roll-dice-btn">Roll Dice</button>
        <div id="dice-display"></div>
        <div id="allocation-controls"></div>
      </div>
      <div id="sector-slots" style="display:flex;flex-direction:column;gap:1.5rem;margin-top:2rem;"></div>
      <h2 style="margin-top:2.5rem;">Enemy Board</h2>
      <div id="enemy-board" style="display:flex;flex-direction:column;gap:1.5rem;margin-top:1rem;"></div>
      <div id="event-log" style="margin-top:2rem;background:#222;border-radius:0.5rem;padding:0.5rem;max-height:120px;overflow-y:auto;font-size:0.85em;"></div>
    `;
    // Add event delegation for passive activation
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('passive-btn')) {
        const slot = Number(target.getAttribute('data-slot'));
        const idx = Number(target.getAttribute('data-idx'));
        const passive = this.game.passiveSlots?.[slot]?.[idx];
        if (passive) {
          this.game.progressPoints += passive.points || 1;
          this.logMessage(`Activated passive: ${passive.name} (+${passive.points || 1} VP)`);
          this.render();
        }
      }
    });
    root.appendChild(container);
    // Attach modal to root after main UI so it is always on top
    root.appendChild(modal);
    this.attachHandlers();
    this.render();
    // Only render after scenario selection
  }

  private attachHandlers() {
    const rollBtn = document.getElementById('roll-dice-btn');
    if (rollBtn) {
      rollBtn.onclick = () => {
    this.logMessage('Rolled dice.');
    this.logMessage(getRecommendedAction(this.game));
        this.game.startPlayerTurn();
        this.render();
      };
    }
  }

  /**
   * Render the current game state to the UI.
   */
  render() {
    // Enemy Board rendering
    const enemyBoardDiv = document.getElementById('enemy-board');
    if (enemyBoardDiv) {
      enemyBoardDiv.innerHTML = '';
      // Two rows of 3 slots each
      for (let row = 0; row < 2; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'enemy-row';
        rowDiv.style.display = 'flex';
        rowDiv.style.gap = '1rem';
        for (let i = 1 + row * 3; i <= 3 + row * 3; i++) {
          const slot = this.enemyBoard.slots[i];
          const div = document.createElement('div');
          div.className = 'enemy-slot';
          div.style.border = '1px solid #b91c1c';
          div.style.borderRadius = '0.5rem';
          div.style.background = '#1e293b';
          div.style.padding = '0.5rem';
          div.style.minHeight = '90px';
          div.style.display = 'flex';
          div.style.flexDirection = 'column';
          div.style.justifyContent = 'space-between';
          div.style.position = 'relative';
          div.dataset.sector = String(i);
          // Add slot label at the top
          const label = document.createElement('div');
          label.textContent = `Enemy Slot ${i}`;
          label.style.fontSize = '0.85rem';
          label.style.fontWeight = 'bold';
          label.style.color = '#f87171';
          label.style.marginBottom = '0.25rem';
          div.appendChild(label);
          if (slot) {
            let html = `<div class='enemy-card' style="position:relative;padding-bottom:0.5rem;">
              <div class=\"enemy-name\" style="font-weight:600;color:#fca5a5;font-size:1rem;">${slot.name}</div>
              <div class=\"enemy-points\" style="font-size:0.8rem;color:#fbbf24;">Points: ${slot.points}</div>
              <div class=\"enemy-score\" style="font-size:0.8rem;color:#a3e635;">Score: ${slot.score}</div>
            </div>`;
            // (Removed: enemy passive cards)
            div.innerHTML += html;
          } else {
            div.innerHTML += `<div style="color:#fca5a5;font-style:italic;">Empty Slot</div>`;
          }
          rowDiv.appendChild(div);
        }
        enemyBoardDiv.appendChild(rowDiv);
      }
    }
    // Sector info panel removed for minimal gameplay loop

    // Resources
    const scrapEl = document.getElementById('scrap-value');
    if (scrapEl) scrapEl.textContent = String(this.game.scrap);
    // Resource bar - improved contrast, larger font, colored badges
    const progressEl = document.getElementById('progress-value');
    if (progressEl) progressEl.textContent = String(this.game.progressPoints);
    const chargeEl = document.getElementById('charge-value');
    if (chargeEl) chargeEl.textContent = String(this.game.charge);

    // Dice
    // Command Console (ship cards) - improved color, badges, backgrounds
    const diceDisplay = document.getElementById('dice-display');
    if (diceDisplay) {
      diceDisplay.textContent = this.game.rolled ? `Dice: ${this.game.dice[0]}, ${this.game.dice[1]}` : '';
    }

    // Allocation controls (split/combine)
    const alloc = document.getElementById('allocation-controls');
    if (alloc) {
      // Dice and action panel - improved button color, dice style, spacing
      alloc.innerHTML = '';
      if (this.game.rolled && !this.game.allocated) {
        const d1 = this.game.dice[0], d2 = this.game.dice[1], sum = d1 + d2;
        // Split
        const btnSplit = document.createElement('button');
        btnSplit.textContent = `Split: ${d1} & ${d2}`;
        btnSplit.setAttribute('data-testid', 'split-btn');
        btnSplit.onmouseenter = () => this.highlightSectors([d1, d2]);
        btnSplit.onmouseleave = () => this.clearHighlights();
        btnSplit.onclick = () => {
          this.logMessage(`Allocated dice to sectors ${d1} & ${d2}.`);
          this.logMessage(getRecommendedAction(this.game));
          this.game.allocateDice([d1, d2]);
          this.clearHighlights();
          this.render();
        };
        alloc.appendChild(btnSplit);
        // Combine
        if (sum >= 1 && sum <= 8) {
          const btnCombine = document.createElement('button');
          btnCombine.textContent = `Combine: ${sum}`;
          btnCombine.setAttribute('data-testid', 'combine-btn');
          btnCombine.onmouseenter = () => this.highlightSectors([sum]);
          btnCombine.onmouseleave = () => this.clearHighlights();
          btnCombine.onclick = () => {
            this.logMessage(`Allocated dice to sector ${sum}.`);
            this.logMessage(getRecommendedAction(this.game));
            this.game.allocateDice([sum]);
            this.clearHighlights();
            this.render();
          };
          alloc.appendChild(btnCombine);
        }
      }
    }

    // Sector slots grid - now split into two rows: 1-3 and 4-6
    const sectorSlots = document.getElementById('sector-slots');
    if (sectorSlots) {
      sectorSlots.innerHTML = '';
      // Render both rows using a single loop for 1-6
      for (let row = 0; row < 2; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'sector-row';
        rowDiv.style.display = 'flex';
        rowDiv.style.gap = '1rem';
        rowDiv.style.marginBottom = row === 0 ? '1rem' : '';
        for (let i = 1 + row * 3; i <= 3 + row * 3; i++) {
          const slot = this.game.commandConsole[i];
          const div = document.createElement('div');
          div.className = 'sector-slot';
          div.style.border = '1px solid #52525b';
          div.style.borderRadius = '0.5rem';
          div.style.background = '#27272a';
          div.style.padding = '0.5rem';
          div.style.minHeight = '90px';
          div.style.display = 'flex';
          div.style.flexDirection = 'column';
          div.style.justifyContent = 'space-between';
          div.style.position = 'relative';
          div.dataset.sector = String(i);
          if (this.lastHighlighted.includes(i)) {
            div.style.boxShadow = '0 0 10px #60a5fa, 0 0 0 2px #60a5fa';
          } else {
            div.style.boxShadow = '';
          }
          // Add slot label at the top
          const label = document.createElement('div');
          label.textContent = `Slot ${i}`;
          label.style.fontSize = '0.85rem';
          label.style.fontWeight = 'bold';
          label.style.color = '#a3a3a3';
          label.style.marginBottom = '0.25rem';
          div.appendChild(label);
          if (slot) {
            let html = `<div class='card-active' style="position:relative;padding-bottom:0.5rem;">
              <div class=\"card-name\" style="font-weight:600;color:#e4e4e7;font-size:1rem;">${slot.name}</div>
              <div class=\"card-points\" style="font-size:0.8rem;color:#a3e635;">Points: ${slot.points}</div>
            </div>`;
            div.innerHTML += html;
          } else {
            div.innerHTML += `<div style="color:#a1a1aa;font-style:italic;">Empty Slot</div>`;
          }
          // Player passive slots
          let passives: any[] = [];
          if (Array.isArray(this.game.passiveSlots) && this.game.passiveSlots[i]) {
            passives = this.game.passiveSlots[i];
          }
          if (passives.length > 0) {
            const passivesDiv = document.createElement('div');
            passivesDiv.className = 'player-passives';
            passivesDiv.style.marginTop = '0.25rem';
            passivesDiv.innerHTML = `<span style='color:#38bdf8;font-size:0.8rem;'>Passive:</span> ` +
              passives.map((p, idx) => `<button class='passive-btn' data-slot='${i}' data-idx='${idx}' style='color:#a3e635;margin-left:0.25rem;background:#222;border:none;border-radius:0.25rem;padding:0.1rem 0.5rem;cursor:pointer;'>${p.name} (+${p.passive?.points ?? p.points ?? 1} VP)</button>`).join(', ');
            div.appendChild(passivesDiv);
          }
          rowDiv.appendChild(div);
        }
        sectorSlots.appendChild(rowDiv);
      }
    }

    // Event log
    const logEl = document.getElementById('event-log');
    if (logEl) {
      logEl.innerHTML = this.log.slice(0, 10).map(msg => `<div>${msg}</div>`).join('');
    }
  }

  private highlightSectors(sectors: number[]) {
    this.lastHighlighted = sectors;
    this.render();
  }

  private clearHighlights() {
    this.lastHighlighted = [];
    this.render();
  }

  private logMessage(msg: string) {
    this.log.unshift(msg);
    if (this.log.length > 50) this.log.pop();
    this.render();
  }
}
