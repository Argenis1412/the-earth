import test from 'node:test';
import assert from 'node:assert/strict';
import { POLE_RADIUS_DEG, poleAt } from '../src/geography/poles.js';

test('poleAt detects the poles within the capture radius', () => {
  assert.equal(POLE_RADIUS_DEG, 4);
  assert.equal(poleAt(90), 'north');
  assert.equal(poleAt(86.5), 'north');
  assert.equal(poleAt(85), null);
  assert.equal(poleAt(-88), 'south');
  assert.equal(poleAt(0), null);
});

test('poleAt returns null for missing or non-finite latitudes', () => {
  assert.equal(poleAt(NaN), null);
  assert.equal(poleAt(undefined), null);
  assert.equal(poleAt(null), null);
});
