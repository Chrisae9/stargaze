import { ShipDefinition } from '../../game/core';

/**
 * @classdesc Sol-Core: Fast courier, increases progress and can swap dice.
 */
export const ParadiseCourier: ShipDefinition = {
  key: 'paradise_courier',
  name: 'Paradise Courier',
  points: 2,
  passive: {
    effect: 'Gain 1 VP when activated as a passive.',
    value: 1,
    points: 1
  }
};
