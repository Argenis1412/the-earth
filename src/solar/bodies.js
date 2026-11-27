import { equatorialToScene } from './kepler.js';
import { visualRadius, SUN_VISUAL_RADIUS, MOON_VISUAL_RADIUS } from './scale.js';

/**
 * Physical catalogue. Poles are IAU north-pole directions (RA/Dec, J2000);
 * rotation periods are sidereal, in hours; the sign is the IAU one (negative = turns
 * clockwise about the listed pole). Venus and Uranus are negative; Pluto's "retrograde"
 * spin comes from its 122.5° axial tilt, not from the sign.
 * The Moon is tidally locked: its period equals its orbital period, so it is
 * oriented every frame instead of spun.
 */
export const BODIES = [
  { id: 'sun', kind: 'star', radiusKm: 695700, pole: [286.13, 63.87], rotationHours: 609.12, color: '#ffb52e' },
  { id: 'mercury', kind: 'planet', radiusKm: 2439.7, pole: [281.01, 61.45], rotationHours: 1407.5, color: '#a39c94' },
  { id: 'venus', kind: 'planet', radiusKm: 6051.8, pole: [272.76, 67.16], rotationHours: -5832.5, color: '#e6c27a' },
  { id: 'earth', kind: 'planet', radiusKm: 6371, pole: [0, 90], rotationHours: 23.9345, color: '#4c8fe0' },
  { id: 'mars', kind: 'planet', radiusKm: 3389.5, pole: [317.68, 52.89], rotationHours: 24.6229, color: '#d2683f' },
  { id: 'jupiter', kind: 'planet', radiusKm: 69911, pole: [268.06, 64.5], rotationHours: 9.925, color: '#d9b48a' },
  { id: 'saturn', kind: 'planet', radiusKm: 58232, pole: [40.59, 83.54], rotationHours: 10.656, color: '#e3cf9c' },
  { id: 'uranus', kind: 'planet', radiusKm: 25362, pole: [257.31, -15.18], rotationHours: -17.24, color: '#8fd6dc' },
  { id: 'neptune', kind: 'planet', radiusKm: 24622, pole: [299.36, 43.46], rotationHours: 16.11, color: '#4a74e8' },
  { id: 'pluto', kind: 'dwarf', radiusKm: 1188.3, pole: [132.99, -6.16], rotationHours: 153.29, color: '#c7a98a' },
  { id: 'moon', kind: 'moon', radiusKm: 1737.4, pole: [269.99, 66.54], rotationHours: null, color: '#b9b9bd' },
];

export const BODY_BY_ID = Object.fromEntries(BODIES.map((b) => [b.id, b]));

/** Planets (and Pluto) that have a Keplerian orbit around the Sun. */
export const ORBITING_IDS = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

/**
 * Unit vector of a body's north pole in the scene frame.
 * @param {string} id
 */
export function poleDirection(id) {
  const [ra, dec] = BODY_BY_ID[id].pole;
  return equatorialToScene(ra, dec);
}

/**
 * Drawn radius of a body in scene units.
 * @param {string} id
 */
export function bodyVisualRadius(id) {
  if (id === 'sun') return SUN_VISUAL_RADIUS;
  if (id === 'moon') return MOON_VISUAL_RADIUS;
  return visualRadius(BODY_BY_ID[id].radiusKm);
}
