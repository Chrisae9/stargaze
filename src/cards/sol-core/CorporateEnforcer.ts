import { ShipDefinition } from '../../game/core';

/**
 * @classdesc Sol-Core: Corporate security ship, increases pursuit limit and generates charge.
 */
export const CorporateEnforcer: ShipDefinition = {
  key: 'corporate_enforcer',
  name: 'Corporate Enforcer',
  points: 3,
  passive: {
    effect: 'Gain 2 VP when activated as a passive.',
    value: 1,
    points: 2
  }
};
