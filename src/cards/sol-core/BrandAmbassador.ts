import { ShipDefinition } from '../../game/core';

/**
 * @classdesc Sol-Core: Boosts all Sol-Core ships, generates charge.
 */
export const BrandAmbassador: ShipDefinition = {
  key: 'brand_ambassador',
  name: 'Brand Ambassador',
  points: 2,
  passive: {
    effect: 'Gain 1 VP when activated as a passive.',
    value: 1,
    points: 1
  }
};
