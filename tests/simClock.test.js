import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_SPEED_INDEX,
  MAX_TIME_MS,
  MIN_TIME_MS,
  SPEEDS,
  createSimClock,
  moonStrobes,
} from '../src/solar/simClock.js';

const start = new Date('2026-11-26T12:00:00Z');
const DAY = 86400000;

test('advance moves simulated time at the selected speed', () => {
  const clock = createSimClock({ start, speedIndex: 1 }); // 1 day / s
  clock.advance(2);
  assert.equal(clock.time - start.getTime(), 2 * DAY);
});

test('default speed is one week per second', () => {
  assert.equal(SPEEDS[DEFAULT_SPEED_INDEX].id, 'week');
  const clock = createSimClock({ start });
  clock.advance(1);
  assert.equal(clock.time - start.getTime(), 7 * DAY);
});

test('pause freezes time and reports a zero rate; resume restores it', () => {
  const clock = createSimClock({ start });
  assert.equal(clock.togglePlay(), false);
  assert.equal(clock.rate, 0);
  clock.advance(5);
  assert.equal(clock.time, start.getTime());
  assert.equal(clock.togglePlay(), true);
  assert.ok(clock.rate > 0);
});

test('reverse runs time backwards at the same speed', () => {
  const clock = createSimClock({ start, speedIndex: 1 });
  clock.toggleReverse();
  clock.advance(3);
  assert.equal(start.getTime() - clock.time, 3 * DAY);
  assert.ok(clock.rate < 0);
});

test('speed index is clamped at both ends', () => {
  const clock = createSimClock({ start });
  for (let i = 0; i < 20; i++) clock.faster();
  assert.equal(clock.speedIndex, SPEEDS.length - 1);
  for (let i = 0; i < 20; i++) clock.slower();
  assert.equal(clock.speedIndex, 0);
});

test('time is clamped to the supported window', () => {
  const clock = createSimClock({ start, speedIndex: SPEEDS.length - 1 });
  clock.advance(1e6);
  assert.equal(clock.time, MAX_TIME_MS);
  clock.toggleReverse();
  clock.advance(1e7);
  assert.equal(clock.time, MIN_TIME_MS);
});

test('jump sets the date and keeps speed and direction', () => {
  const clock = createSimClock({ start, speedIndex: 3 });
  clock.toggleReverse();
  clock.jump(new Date('2030-01-01T00:00:00Z'));
  assert.equal(clock.date.toISOString(), '2030-01-01T00:00:00.000Z');
  assert.equal(clock.speedIndex, 3);
  assert.equal(clock.direction, -1);
});

test('the Moon is hidden once its orbit would strobe (≥ 1 month per second)', () => {
  const byId = Object.fromEntries(SPEEDS.map((s) => [s.id, s.secPerSec]));
  assert.equal(moonStrobes(byId.hour), false);
  assert.equal(moonStrobes(byId.day), false);
  assert.equal(moonStrobes(byId.week), false);
  assert.equal(moonStrobes(byId.month), true);
  assert.equal(moonStrobes(byId.decade), true);
  assert.equal(moonStrobes(-byId.month), true, 'direction does not matter');
});
