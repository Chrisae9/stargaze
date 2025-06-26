import { describe, it, expect, beforeEach, beforeAll } from 'vitest';

/**
 * @fileoverview
 * Vitest suite for Stargaze core gameplay loop: sector slots, card stack logic, dice rolling, split/combine, turn order, and scrap management.
 * Card/slot theming is based on docs/sectors.md. Card names are generic for now.
 */

type Card = {
  id: string;
  name: string;
  sector: string;
  rarity: 'common' | 'uncommon' | 'rare';
  activeAbility?: string;
  passiveAbility?: string;
};

type SectorSlot = {
  sector: string;
  active: Card;
  passive: Card[]; // max 2
};

type PlayerState = {
  slots: SectorSlot[];
  scrap: number;
};

type DiceRoll = [number, number];

const SECTORS = [
  'Sol-Core',
  'Orion Fringe',
  'Kyber Industrial Belt',
  'Echo Sector',
  'Veridian Nexus',
  'Aethel Dominion',
  'Hive-Mind Cluster',
  'Celestial Expanse',
];

function createDefaultCard(sector: string, i: number): Card {
  return {
    id: `${sector}-card-${i}`,
    name: `${sector} Card`,
    sector,
    rarity: 'common',
    activeAbility: 'None',
    passiveAbility: 'None',
  };
}

function createInitialPlayerState(): PlayerState {
  return {
    slots: SECTORS.map((sector, i) => ({
      sector,
      active: createDefaultCard(sector, 1),
      passive: [createDefaultCard(sector, 2)],
    })),
    scrap: 10,
  };
}

describe('Stargaze Core Gameplay Loop', () => {
  // Mock window and localStorage for Vitest Node environment
  beforeAll(() => {
    if (typeof global !== 'undefined' && typeof (global as any).window === 'undefined') {
      (global as any).window = {};
    }
    if (typeof (global as any).window !== 'undefined' && !(global as any).window.localStorage) {
      let store: Record<string, string> = {};
      (global as any).window.localStorage = {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
        key: (i: number) => Object.keys(store)[i] || null,
        length: 0,
      } as Storage;
    }
  });
  let player: PlayerState;

  beforeEach(() => {
    player = createInitialPlayerState();
  });

  it('should initialize with 8 sector slots, each with 1 active and 1 passive card', () => {
    expect(player.slots).toHaveLength(8);
    for (const slot of player.slots) {
      expect(slot.active).toBeDefined();
      expect(slot.passive).toHaveLength(1);
    }
  });

  it('should allow rolling two 4-sided dice and return values 1-4', () => {
    for (let i = 0; i < 100; i++) {
      const roll: DiceRoll = [rollD4(), rollD4()];
      expect(roll[0]).toBeGreaterThanOrEqual(1);
      expect(roll[0]).toBeLessThanOrEqual(4);
      expect(roll[1]).toBeGreaterThanOrEqual(1);
      expect(roll[1]).toBeLessThanOrEqual(4);
    }
  });

  it('should allow activating two slots (split) or one slot (combine) based on dice roll', () => {
    // Split: roll 2 and 3, activate slot 2 and slot 3
    let activated = activateSlots(player, [2, 3], 'split');
    expect(activated).toEqual([1, 2]); // slot indices
    // Combine: roll 2 and 3, activate slot 5
    activated = activateSlots(player, [2, 3], 'combine');
    expect(activated).toEqual([4]);
  });

  it('should add a new card to a slot, demoting active to passive, scrapping oldest if full', () => {
    const newCard: Card = { ...player.slots[0].active, id: 'new', name: 'New Card' };
    // Add to slot 0 (already has 1 passive)
    addCardToSlot(player.slots[0], newCard);
    expect(player.slots[0].active).toEqual(newCard);
    expect(player.slots[0].passive).toHaveLength(2);
    // Add another card, should scrap oldest passive
    const anotherCard: Card = { ...player.slots[0].active, id: 'another', name: 'Another Card' };
    addCardToSlot(player.slots[0], anotherCard);
    expect(player.slots[0].active).toEqual(anotherCard);
    expect(player.slots[0].passive).toHaveLength(2);
    expect(player.slots[0].passive[1].id).toEqual('new');
  });

  it('should manage scrap: spend and earn', () => {
    expect(player.scrap).toBe(10);
    spendScrap(player, 3);
    expect(player.scrap).toBe(7);
    earnScrap(player, 5);
    expect(player.scrap).toBe(12);
  });

  it('should save and load state from localStorage', () => {
    savePlayerState(player);
    const loaded = loadPlayerState();
    expect(loaded).toEqual(player);
  });
});

// --- Mocked/Stubbed Game Logic for Tests ---
function rollD4(): number {
  return Math.floor(Math.random() * 4) + 1;
}

function activateSlots(player: PlayerState, dice: [number, number], mode: 'split' | 'combine'): number[] {
  if (mode === 'split') {
    return [dice[0] - 1, dice[1] - 1];
  } else {
    return [dice[0] + dice[1] - 1];
  }
}

function addCardToSlot(slot: SectorSlot, card: Card) {
  slot.passive.push(slot.active);
  if (slot.passive.length > 2) slot.passive.shift();
  slot.active = card;
}

function spendScrap(player: PlayerState, amount: number) {
  player.scrap -= amount;
}

function earnScrap(player: PlayerState, amount: number) {
  player.scrap += amount;
}

function savePlayerState(player: PlayerState) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('stargaze-player', JSON.stringify(player));
  }
}

function loadPlayerState(): PlayerState | undefined {
  if (typeof window !== 'undefined') {
    const data = window.localStorage.getItem('stargaze-player');
    if (data) return JSON.parse(data);
  }
  return undefined;
}
