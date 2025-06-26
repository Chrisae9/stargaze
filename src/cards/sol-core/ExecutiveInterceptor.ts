import { ShipDefinition } from '../../game/core';

/**
 * @classdesc Sol-Core: Elite police ship, disables enemy abilities and generates credits.
 */
export const ExecutiveInterceptor: ShipDefinition = {
  key: 'executive_interceptor',
  name: 'Executive Interceptor',
  points: 3,
  passive: {
    effect: 'Gain 2 VP when activated as a passive.',
    value: 1,
    points: 2
  }
};
