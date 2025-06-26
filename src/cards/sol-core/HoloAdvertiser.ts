import { ShipDefinition } from '../../game/core';

/**
 * @classdesc Sol-Core: Generates credits and can distract enemies.
 */
export const HoloAdvertiser: ShipDefinition = {
  key: 'holo_advertiser',
  name: 'Holo Advertiser',
  points: 1,
  passive: {
    effect: 'Gain 1 VP when activated as a passive.',
    value: 1,
    points: 1
  }
};
