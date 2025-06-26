import { ShipDefinition } from '../../game/core';

/**
 * @classdesc Sol-Core: Generates extra scrap each turn.
 */
export const FinanceDrone: ShipDefinition = {
  key: 'finance_drone',
  name: 'Finance Drone',
  points: 1,
  passive: {
    effect: 'Gain 1 VP when activated as a passive.',
    value: 1,
    points: 1
  }
};
