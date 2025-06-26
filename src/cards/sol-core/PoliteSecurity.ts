import { ShipDefinition } from '../../game/core';

/**
 * @classdesc Sol-Core: Security ship, can return destroyed ships to hand.
 */
export const PoliteSecurity: ShipDefinition = {
  key: 'polite_security',
  name: 'Polite Security',
  points: 2,
  passive: {
    effect: 'Gain 1 VP when activated as a passive.',
    value: 1,
    points: 1
  }
};
