import { ShipDefinition } from '../../game/core';

/**
 * @classdesc Sol-Core: Increases all rewards for Sol-Core ships.
 */
export const BrandingSatellite: ShipDefinition = {
  key: 'branding_satellite',
  name: 'Branding Satellite',
  points: 2,
  passive: {
    effect: 'Gain 1 VP when activated as a passive.',
    value: 1,
    points: 1
  }
};
