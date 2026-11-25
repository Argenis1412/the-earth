export const POLE_RADIUS_DEG = 4;

/**
 * Detects whether a latitude falls within the pole capture radius.
 * @param {number} lat
 * @returns {'north' | 'south' | null}
 */
export function poleAt(lat) {
  if (typeof lat !== 'number' || !Number.isFinite(lat)) return null;
  if (90 - Math.abs(lat) > POLE_RADIUS_DEG) return null;
  return lat >= 0 ? 'north' : 'south';
}
