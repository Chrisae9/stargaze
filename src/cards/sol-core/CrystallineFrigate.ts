import { ShipDefinition } from '../../game/core';

/**
 * @classdesc Sol-Core: Defensive ship, can shield allies.
 */
export const CrystallineFrigate: ShipDefinition = {
  key: 'crystalline_frigate',
  name: 'Crystalline Frigate',
  points: 2,
  passive: {
    effect: 'Gain 1 VP when activated as a passive.',
    value: 1,
    points: 1
  }
};
