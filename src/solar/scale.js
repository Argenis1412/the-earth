/**
 * Visual scale used to draw the solar system. Real numbers are only compressed
 * for rendering; every calculation (distances, light time) uses real values.
 */
export const EARTH_RADIUS_KM = 6371;

/** Scene units per sqrt(AU): Earth sits at 18, Neptune at ≈99, Pluto at ≈113. */
export const ORBIT_SCALE = 18;
/** Planet radius = (R / R_earth) ^ exponent, so Jupiter ≈ 3.7 and Pluto ≈ 0.4. */
export const RADIUS_EXPONENT = 0.55;
/** The Sun is drawn at a fixed radius (a true-ratio Sun would swallow the inner planets). */
export const SUN_VISUAL_RADIUS = 4.5;
/** The Moon orbits at 4 Earth radii instead of the real ≈60 (which would be a speck). */
export const MOON_VISUAL_ORBIT = 4.0;
/** The Moon keeps its true size relative to the Earth. */
export const MOON_VISUAL_RADIUS = 1737.4 / EARTH_RADIUS_KM;

/**
 * Compressed distance from the Sun, in scene units.
 * @param {number} au
 */
export function compressDistance(au) {
  return ORBIT_SCALE * Math.sqrt(Math.max(au, 0));
}

/**
 * Radially compresses a heliocentric vector (AU) into scene units.
 * @param {{x: number, y: number, z: number}} v
 */
export function compressVector({ x, y, z }) {
  const r = Math.hypot(x, y, z);
  if (r === 0) return { x: 0, y: 0, z: 0 };
  const k = compressDistance(r) / r;
  return { x: x * k, y: y * k, z: z * k };
}

/**
 * Drawn radius of a planet, in scene units (Earth = 1).
 * @param {number} radiusKm
 */
export function visualRadius(radiusKm) {
  return (radiusKm / EARTH_RADIUS_KM) ** RADIUS_EXPONENT;
}
