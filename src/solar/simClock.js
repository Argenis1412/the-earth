/**
 * Simulation clock: pure state, no DOM, no Three.js.
 * Speeds are simulated seconds per real second.
 */
export const SPEEDS = [
  { id: 'hour', secPerSec: 3600 },
  { id: 'day', secPerSec: 86400 },
  { id: 'week', secPerSec: 604800 },
  { id: 'month', secPerSec: 2629800 },
  { id: 'year', secPerSec: 31557600 },
  { id: 'decade', secPerSec: 315576000 },
];
export const DEFAULT_SPEED_INDEX = 2; // 1 week per second

/** The Keplerian elements are fitted for 1800–2050; beyond that they are extrapolated, so keep a sane window. */
export const MIN_TIME_MS = Date.UTC(1800, 0, 1);
export const MAX_TIME_MS = Date.UTC(2200, 0, 1);

const LUNAR_MONTH_S = 27.321661 * 86400;
/** Below this many real seconds per lunar orbit the Moon would strobe, so it gets hidden. */
export const MOON_MIN_ORBIT_SECONDS = 2.5;

/**
 * True when, at this speed, the Moon would complete an orbit too fast to read.
 * @param {number} secPerSec
 */
export function moonStrobes(secPerSec) {
  return LUNAR_MONTH_S / Math.abs(secPerSec) < MOON_MIN_ORBIT_SECONDS;
}

const clampTime = (ms) => Math.min(Math.max(ms, MIN_TIME_MS), MAX_TIME_MS);

/**
 * @param {{ start?: Date, speedIndex?: number }} [options]
 */
export function createSimClock({ start = new Date(), speedIndex = DEFAULT_SPEED_INDEX } = {}) {
  let time = clampTime(start.getTime());
  let index = Math.min(Math.max(speedIndex, 0), SPEEDS.length - 1);
  let direction = 1;
  let playing = true;

  const clock = {
    get time() {
      return time;
    },
    get date() {
      return new Date(time);
    },
    get speedIndex() {
      return index;
    },
    get speed() {
      return SPEEDS[index];
    },
    get direction() {
      return direction;
    },
    get playing() {
      return playing;
    },
    /** Signed simulated seconds per real second (0 when paused). */
    get rate() {
      return playing ? direction * SPEEDS[index].secPerSec : 0;
    },
    /** @param {number} dtSeconds real seconds elapsed */
    advance(dtSeconds) {
      if (!playing) return time;
      time = clampTime(time + dtSeconds * 1000 * direction * SPEEDS[index].secPerSec);
      return time;
    },
    setSpeedIndex(i) {
      index = Math.min(Math.max(i, 0), SPEEDS.length - 1);
      return index;
    },
    faster() {
      return clock.setSpeedIndex(index + 1);
    },
    slower() {
      return clock.setSpeedIndex(index - 1);
    },
    togglePlay() {
      playing = !playing;
      return playing;
    },
    toggleReverse() {
      direction = -direction;
      return direction;
    },
    /** Jumps to a date (default: right now), keeping speed and direction. */
    jump(date = new Date()) {
      time = clampTime(date.getTime());
      return time;
    },
  };
  return clock;
}
