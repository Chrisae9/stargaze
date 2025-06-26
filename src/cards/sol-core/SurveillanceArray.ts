import { ShipDefinition } from '../../game/core';

/**
 * @classdesc Sol-Core: Reveals enemy hand and increases pursuit limit.
 */
export const SurveillanceArray: ShipDefinition = {
  key: 'surveillance_array',
  name: 'Surveillance Array',
  points: 1,
  passive: {
    effect: 'Gain 1 VP when activated as a passive.',
    value: 1,
    points: 1
  }
};
