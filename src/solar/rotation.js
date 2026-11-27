const EARTH_DAY_HOURS = 23.9345;

/** One Earth day lasts this many real seconds on screen; other bodies keep their true ratios. */
export const SPIN_SECONDS_PER_EARTH_DAY = 60;

/**
 * Angular speed (rad/s of real time) for a body with the given sidereal period.
 * Negative periods (retrograde rotators) give negative speeds.
 * @param {number} rotationHours
 */
export function spinRate(rotationHours) {
  return ((2 * Math.PI) / SPIN_SECONDS_PER_EARTH_DAY) * (EARTH_DAY_HOURS / rotationHours);
}

/**
 * Seconds of real time a body needs for one full turn at the on-screen speed.
 * @param {number} rotationHours
 */
export function secondsPerTurn(rotationHours) {
  return Math.abs((2 * Math.PI) / spinRate(rotationHours));
}
