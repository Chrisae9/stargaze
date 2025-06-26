/**
 * Stargaze core game logic module.
 * Defines GameState, Sector, Ship, and related constants/types for the deckbuilding roguelike.
 * All logic is decoupled from UI and DOM.
 * @module core
 */

export const SECTORS_COUNT = 6;

export const ACT_STRUCTURE = [
  { name: "Abandoned Minefield", ppGoal: 6, pursuitLimit: 12, type: 'normal', sectorType: 'Minefield', effectText: "Mining ships gain +1 Scrap." },
  { name: "Asteroid Belt", ppGoal: 15, pursuitLimit: 15, type: 'normal', sectorType: 'Hazard', effectText: "Roll 7: Random ship loses 1 Dur." },
  { name: "Nebula Passage", ppGoal: 12, pursuitLimit: 13, type: 'normal', sectorType: 'Nebula', effectText: "End Turn costs 0 Pursuit." },
  { name: "Federation Listening Post", ppGoal: 20, pursuitLimit: 16, type: 'normal', sectorType: 'Military', effectText: "Military ships gain +1 PP." },
  { name: "Sector Command: 'The Hammer'", ppGoal: 35, pursuitLimit: 20, type: 'boss', sectorType: 'Military', effectText: "Boss attacks end of turn." }
];

export interface ShipPassive {
  effect: string;
  value: number;
  points: number; // VP value for scoring when activated as a passive
}

export interface ShipDefinition {
  key: string;
  name: string;
  points: number;
  passive?: ShipPassive;
}

export interface Ship extends ShipDefinition {
  id: string;
}

export class Sector {
  ship: Ship | null = null;
  level: number = 1;
}

export class GameState {
  scrap: number = 0;
  salvageIncome: number = 0;
  progressPoints: number = 0;
  charge: number = 0;
  actProgress: number = 0;
  pursuitLevel: number = 0;
  dice: [number, number] = [0, 0];
  rolled: boolean = false;
  allocated: boolean = false;
  commandConsole: (Ship | null)[] = Array(SECTORS_COUNT + 1).fill(null);
  passiveSlots: Ship[][] = Array(SECTORS_COUNT + 1).fill(null).map(() => []); // 1-based, 6 slots
  currentPhase: string = 'SECTOR_PLAY';
  shipDefinitions: Record<string, ShipDefinition> = {
    'scrap_drone':    { key: 'scrap_drone', name: 'Scrap Drone', points: 1 },
    'prospector':     { key: 'prospector', name: 'Prospector', points: 2 },
    'laser_turret':   { key: 'laser_turret', name: 'Laser Turret', points: 3 },
    'target_sys':     { key: 'target_sys', name: 'Targeting Sys', points: 4 },
    // ...add more as needed
  };

  initialize() {
    this.scrap = 15;
    this.salvageIncome = 2;
    this.progressPoints = 0;
    this.charge = 1;
    this.actProgress = 0;
    this.pursuitLevel = 0;
    this.dice = [0, 0];
    this.rolled = false;
    this.allocated = false;
    this.commandConsole = Array(SECTORS_COUNT + 1).fill(null);
    this.passiveSlots = Array(SECTORS_COUNT + 1).fill(null).map(() => []);
    // Fill passive slots with dummy ships for now
    for (let i = 1; i <= SECTORS_COUNT; i++) {
      this.passiveSlots[i] = [
        {
          key: 'passive_ship_' + i,
          name: 'Passive Ship ' + i,
          points: 1,
          id: `passive_ship_${i}_${Date.now()}_${Math.random()}`
        }
      ];
    }
    // this.sectorLevels = Array(SECTORS_COUNT + 1).fill(1); // Not used in minimal loop
    this.currentPhase = 'SECTOR_PLAY';
  }

  /**
   * End the player's turn and switch to enemy turn.
   */
  endPlayerTurn() {
    this.currentPhase = 'ENEMY_TURN';
  }

  /**
   * End the enemy's turn and switch to player turn.
   */
  endEnemyTurn() {
    this.currentPhase = 'SECTOR_PLAY';
  }

  deployShip(shipKey: string, sectorIndex: number): boolean {
    if (sectorIndex < 1 || sectorIndex > SECTORS_COUNT) return false;
    const def = this.shipDefinitions[shipKey];
    if (!def) return false;
    const ship: Ship = {
      ...def,
      id: `ship_${Date.now()}_${Math.random()}`,
    };
    this.commandConsole[sectorIndex] = ship;
    return true;
  }

  startPlayerTurn() {
    this.dice = [this.rollDie(), this.rollDie()];
    this.rolled = true;
    this.allocated = false;
  }

  rollDie(): number {
    return Math.floor(Math.random() * 3) + 1;
  }

  allocateDice(sectors: number[]) {
    if (!this.rolled) throw new Error('Dice not rolled');
    sectors.forEach(sectorNum => {
      if (sectorNum < 1 || sectorNum > SECTORS_COUNT) return;
      const ship = this.commandConsole[sectorNum];
      if (ship) {
        // Add points to progressPoints
        this.progressPoints += ship.points;
      }
    });
    this.allocated = true;
  }

  /**
   * Ends the player's turn: apply income, reset flags, check end conditions.
   */
  endTurn() {
    // Reset dice and allocation flags
    this.rolled = false;
    this.allocated = false;
    // Check win/lose conditions
    this.checkEndConditions();
  }

  checkEndConditions() {
    // Win: 10 points for now (simplified)
    if (this.progressPoints >= 10) {
      this.currentPhase = 'MAP';
      return;
    }
    // Lose: all cards destroyed
    const remaining = this.commandConsole.filter(s => s !== null).length;
    if (remaining === 0) {
      this.currentPhase = 'GAME_OVER';
      return;
    }
  }
}
