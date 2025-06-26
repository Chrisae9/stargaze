/**
 * @fileoverview
 * Stargaze core gameplay logic: sector slots, card stack logic, dice rolling, split/combine, turn order, and scrap management.
 * Card/slot theming is based on docs/sectors.md. Card names are generic for now.
 * This file is the implementation to match the tests in tests/game/StargazeCore.spec.ts.
 */

export type Card = {
  id: string;
  name: string;
  sector: string;
  rarity: 'common' | 'uncommon' | 'rare';
  activeAbility?: string;
  passiveAbility?: string;
};

export type SectorSlot = {
  sector: string;
  active: Card;
  passive: Card[]; // max 2
};

export type PlayerState = {
  slots: SectorSlot[];
  scrap: number;
};

export type DiceRoll = [number, number];

export const SECTORS = [
  'Sol-Core',
  'Orion Fringe',
  'Kyber Industrial Belt',
  'Echo Sector',
  'Veridian Nexus',
  'Aethel Dominion',
  'Hive-Mind Cluster',
  'Celestial Expanse',
];

/**
 * Creates a generic card for a given sector.
 * @param sector The sector name.
 * @param i Index for unique id.
 * @returns {Card}
 */
export function createDefaultCard(sector: string, i: number): Card {
  return {
    id: `${sector}-card-${i}`,
    name: `${sector} Card`,
    sector,
    rarity: 'common',
    activeAbility: 'None',
    passiveAbility: 'None',
  };
}

/**
 * Creates the initial player state with 8 sector slots, each with 1 active and 1 passive card, and 10 scrap.
 * @returns {PlayerState}
 */
export function createInitialPlayerState(): PlayerState {
  return {
    slots: SECTORS.map((sector, i) => ({
      sector,
      active: createDefaultCard(sector, 1),
      passive: [createDefaultCard(sector, 2)],
    })),
    scrap: 10,
  };
}

/**
 * Rolls a 4-sided die.
 * @returns {number} A value between 1 and 4.
 * @example
 * rollD4(); // 3
 */
export function rollD4(): number {
  return Math.floor(Math.random() * 4) + 1;
}

/**
 * Activates slots based on dice roll and mode.
 * @param player The player state.
 * @param dice The two dice values.
 * @param mode 'split' to activate two slots, 'combine' to activate one slot.
 * @returns {number[]} The indices of activated slots.
 * @example
 * activateSlots(player, [2,3], 'split'); // [1,2]
 * activateSlots(player, [2,3], 'combine'); // [4]
 */
export function activateSlots(player: PlayerState, dice: [number, number], mode: 'split' | 'combine'): number[] {
  if (mode === 'split') {
    return [dice[0] - 1, dice[1] - 1];
  } else {
    return [dice[0] + dice[1] - 1];
  }
}

/**
 * Adds a new card to a slot, demoting active to passive, scrapping oldest if full.
 * @param slot The sector slot.
 * @param card The new card to add as active.
 */
export function addCardToSlot(slot: SectorSlot, card: Card) {
  slot.passive.push(slot.active);
  if (slot.passive.length > 2) slot.passive.shift();
  slot.active = card;
}

/**
 * Spends scrap from the player.
 * @param player The player state.
 * @param amount Amount to spend.
 */
export function spendScrap(player: PlayerState, amount: number) {
  player.scrap -= amount;
}

/**
 * Earns scrap for the player.
 * @param player The player state.
 * @param amount Amount to earn.
 */
export function earnScrap(player: PlayerState, amount: number) {
  player.scrap += amount;
}

/**
 * Saves player state to localStorage.
 * @param player The player state.
 */
export function savePlayerState(player: PlayerState) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('stargaze-player', JSON.stringify(player));
  }
}

/**
 * Loads player state from localStorage.
 * @returns {PlayerState | undefined}
 */
export function loadPlayerState(): PlayerState | undefined {
  if (typeof window !== 'undefined') {
    const data = window.localStorage.getItem('stargaze-player');
    if (data) return JSON.parse(data);
  }
  return undefined;
}
