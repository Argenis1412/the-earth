import { ELEMENTS } from './elements.js';

const DEG = Math.PI / 180;
const J2000_JD = 2451545.0;
const MS_PER_DAY = 86400000;

/** Mean obliquity of the ecliptic at J2000 (degrees). */
export const OBLIQUITY_DEG = 23.43928;
/** Kilometers in one astronomical unit. */
export const AU_KM = 149597870.7;
/** Speed of light in km/s. */
export const LIGHT_SPEED_KM_S = 299792.458;

/**
 * Julian date for a JS Date (UTC; TT−UTC ≈ 69 s is negligible here).
 * @param {Date} date
 */
export function julianDate(date) {
  return date.getTime() / MS_PER_DAY + 2440587.5;
}

/**
 * Julian centuries elapsed since J2000.0.
 * @param {Date} date
 */
export function centuriesSinceJ2000(date) {
  return (julianDate(date) - J2000_JD) / 36525;
}

const wrapDeg = (deg) => ((((deg + 180) % 360) + 360) % 360) - 180;

/**
 * Solves Kepler's equation M = E − e·sin(E) for E (radians) with Newton's method.
 * @param {number} M mean anomaly in radians
 * @param {number} e eccentricity (0 ≤ e < 1)
 */
export function solveKepler(M, e) {
  let E = e < 0.8 ? M : Math.PI;
  for (let i = 0; i < 30; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-12) break;
  }
  return E;
}

/**
 * Elements at time T (Julian centuries since J2000), converted to radians.
 * @param {keyof typeof ELEMENTS} id
 * @param {number} T
 */
export function elementsAt(id, T) {
  const el = ELEMENTS[id];
  const at = ([v0, rate]) => v0 + rate * T;
  const Ldeg = at(el.L);
  const wDeg = at(el.w);
  const ODeg = at(el.O);
  return {
    a: at(el.a),
    e: at(el.e),
    I: at(el.I) * DEG,
    O: ODeg * DEG,
    w: (wDeg - ODeg) * DEG, // argument of perihelion
    M: wrapDeg(Ldeg - wDeg) * DEG,
  };
}

/** Rotates in-plane orbital coordinates (xp, yp) into the ecliptic frame. */
function orbitalToEcliptic({ I, O, w }, xp, yp) {
  const cw = Math.cos(w);
  const sw = Math.sin(w);
  const cO = Math.cos(O);
  const sO = Math.sin(O);
  const cI = Math.cos(I);
  const sI = Math.sin(I);
  return {
    x: (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
    y: (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
    z: sw * sI * xp + cw * sI * yp,
  };
}

/**
 * Heliocentric position in the J2000 ecliptic frame, in AU.
 * @param {keyof typeof ELEMENTS} id
 * @param {number} T Julian centuries since J2000
 * @returns {{x: number, y: number, z: number}}
 */
export function heliocentricPosition(id, T) {
  const el = elementsAt(id, T);
  const E = solveKepler(el.M, el.e);
  const xp = el.a * (Math.cos(E) - el.e);
  const yp = el.a * Math.sqrt(1 - el.e * el.e) * Math.sin(E);
  return orbitalToEcliptic(el, xp, yp);
}

/**
 * Points along the instantaneous orbit ellipse (ecliptic frame, AU), starting at perihelion.
 * @param {keyof typeof ELEMENTS} id
 * @param {number} T
 * @param {number} [segments]
 * @returns {Array<{x: number, y: number, z: number}>} segments + 1 points (closed loop)
 */
export function orbitPoints(id, T, segments = 256) {
  const el = elementsAt(id, T);
  const b = el.a * Math.sqrt(1 - el.e * el.e);
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const E = (i / segments) * 2 * Math.PI;
    points.push(orbitalToEcliptic(el, el.a * (Math.cos(E) - el.e), b * Math.sin(E)));
  }
  return points;
}

/**
 * Geocentric position of the Moon in the J2000-ish ecliptic frame, in km.
 * Mean-element orbit with eccentricity: good to a couple of degrees, which is
 * plenty for a visualisation (it ignores evection, variation and friends).
 * @param {number} T Julian centuries since J2000
 */
export function moonGeocentricPosition(T) {
  const L = 218.3164477 + 481267.88123421 * T; // mean longitude
  const Mdeg = 134.9633964 + 477198.8675055 * T; // mean anomaly
  const Odeg = 125.0445479 - 1934.1362891 * T; // ascending node
  const wDeg = L - Mdeg; // longitude of perigee
  const el = {
    I: 5.145396 * DEG,
    O: Odeg * DEG,
    w: (wDeg - Odeg) * DEG,
  };
  const a = 384399;
  const e = 0.0549;
  const E = solveKepler(wrapDeg(Mdeg) * DEG, e);
  const p = orbitalToEcliptic(el, a * (Math.cos(E) - e), a * Math.sqrt(1 - e * e) * Math.sin(E));
  return p;
}

/**
 * Converts an ecliptic-J2000 vector to the scene frame, where +Y is the Earth's
 * north pole (celestial north) and +X points to the vernal equinox:
 *   equatorial = Rx(ε)·ecliptic;  scene = (x_eq, z_eq, −y_eq).
 * @param {{x: number, y: number, z: number}} v
 */
export function eclipticToScene({ x, y, z }) {
  const eps = OBLIQUITY_DEG * DEG;
  const yEq = y * Math.cos(eps) - z * Math.sin(eps);
  const zEq = y * Math.sin(eps) + z * Math.cos(eps);
  return { x, y: zEq, z: -yEq };
}

/**
 * Converts equatorial (RA, Dec) in degrees to a unit vector in the scene frame.
 * @param {number} raDeg
 * @param {number} decDeg
 */
export function equatorialToScene(raDeg, decDeg) {
  const ra = raDeg * DEG;
  const dec = decDeg * DEG;
  const xEq = Math.cos(dec) * Math.cos(ra);
  const yEq = Math.cos(dec) * Math.sin(ra);
  const zEq = Math.sin(dec);
  return { x: xEq, y: zEq, z: -yEq };
}
