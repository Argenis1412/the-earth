import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OBLIQUITY_DEG,
  centuriesSinceJ2000,
  eclipticToScene,
  elementsAt,
  equatorialToScene,
  heliocentricPosition,
  julianDate,
  moonGeocentricPosition,
  moonOrbitPoints,
  orbitPoints,
  solveKepler,
} from '../src/solar/kepler.js';
import { BODIES, BODY_BY_ID, ORBITING_IDS, bodyVisualRadius, poleDirection } from '../src/solar/bodies.js';
import { compressDistance, compressVector } from '../src/solar/scale.js';
import { SPIN_SECONDS_PER_EARTH_DAY, secondsPerTurn, spinRate } from '../src/solar/rotation.js';
import en from '../src/i18n/en.js';
import es from '../src/i18n/es.js';

const DEG = Math.PI / 180;
const at = (iso) => centuriesSinceJ2000(new Date(iso));
const norm = (v) => Math.hypot(v.x, v.y, v.z);
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const lonDeg = (v) => (((Math.atan2(v.y, v.x) / DEG) % 360) + 360) % 360;
const angleDeg = (a, b) => Math.acos((a.x * b.x + a.y * b.y + a.z * b.z) / (norm(a) * norm(b))) / DEG;
const geocentric = (id, T) => sub(heliocentricPosition(id, T), heliocentricPosition('earth', T));

test('julianDate and centuries are anchored at J2000.0', () => {
  assert.equal(julianDate(new Date('2000-01-01T12:00:00Z')), 2451545.0);
  assert.equal(at('2000-01-01T12:00:00Z'), 0);
});

test('solveKepler satisfies M = E − e·sin E, including high eccentricities', () => {
  for (const e of [0, 0.0167, 0.2056, 0.2488, 0.9]) {
    for (const M of [-3, -1, 0, 0.5, 2, 3.1]) {
      const E = solveKepler(M, e);
      assert.ok(Math.abs(E - e * Math.sin(E) - M) < 1e-10, `e=${e} M=${M}`);
    }
  }
});

test('Earth reaches perihelion in early January and aphelion in early July (2026)', () => {
  const peri = norm(heliocentricPosition('earth', at('2026-01-03T17:00:00Z')));
  const aph = norm(heliocentricPosition('earth', at('2026-07-06T19:00:00Z')));
  assert.ok(Math.abs(peri - 0.9833) < 0.0007, `perihelion ${peri}`);
  assert.ok(Math.abs(aph - 1.0167) < 0.0007, `aphelion ${aph}`);
});

test('Jupiter–Saturn great conjunction of 21 Dec 2020 (≈ 300.2° ecliptic longitude)', () => {
  const T = at('2020-12-21T18:20:00Z');
  const jupiter = lonDeg(geocentric('jupiter', T));
  const saturn = lonDeg(geocentric('saturn', T));
  assert.ok(Math.abs(jupiter - 300.2) < 0.3, `jupiter ${jupiter}`);
  assert.ok(Math.abs(saturn - 300.2) < 0.3, `saturn ${saturn}`);
  assert.ok(Math.abs(jupiter - saturn) < 0.3);
});

test('closest approaches of Mars (6 Oct 2020) and Venus (3 Jun 2020)', () => {
  const mars = norm(geocentric('mars', at('2020-10-06T12:00:00Z')));
  const venus = norm(geocentric('venus', at('2020-06-03T12:00:00Z')));
  assert.ok(Math.abs(mars - 0.4149) < 0.003, `mars ${mars}`);
  assert.ok(Math.abs(venus - 0.2891) < 0.003, `venus ${venus}`);
});

test('Pluto matches known milestones: 1989 perihelion, 2015 New Horizons, 2114 aphelion', () => {
  const r = (iso) => norm(heliocentricPosition('pluto', at(iso)));
  assert.ok(Math.abs(r('1989-09-05T12:00:00Z') - 29.66) < 0.1);
  assert.ok(Math.abs(r('2015-07-14T12:00:00Z') - 32.9) < 0.2);
  assert.ok(Math.abs(r('2114-01-01T12:00:00Z') - 49.3) < 0.3);
});

test('orbitPoints closes the loop and stays on the ellipse', () => {
  const T = at('2026-11-26T12:00:00Z');
  for (const id of ORBITING_IDS) {
    const pts = orbitPoints(id, T, 64);
    assert.equal(pts.length, 65);
    assert.ok(norm(sub(pts[0], pts[64])) < 1e-9, `${id} not closed`);
    const rs = pts.map(norm);
    assert.ok(Math.max(...rs) / Math.min(...rs) >= 1);
  }
});

test('ecliptic → scene keeps lengths and puts the ecliptic pole at (0, cos ε, sin ε)', () => {
  const eps = OBLIQUITY_DEG * DEG;
  const pole = eclipticToScene({ x: 0, y: 0, z: 1 });
  assert.ok(Math.abs(pole.x) < 1e-12);
  assert.ok(Math.abs(pole.y - Math.cos(eps)) < 1e-12);
  assert.ok(Math.abs(pole.z - Math.sin(eps)) < 1e-12);

  const equinox = eclipticToScene({ x: 1, y: 0, z: 0 });
  assert.deepEqual([equinox.x, equinox.y, equinox.z].map((n) => Math.round(n * 1e9) / 1e9 + 0), [1, 0, 0]);

  const v = { x: 0.3, y: -1.2, z: 0.45 };
  assert.ok(Math.abs(norm(eclipticToScene(v)) - norm(v)) < 1e-12);
});

test('the Earth keeps its +Y pole and the ecliptic is tilted 23.44° from the equator', () => {
  const earthPole = poleDirection('earth');
  assert.ok(Math.abs(earthPole.y - 1) < 1e-12);
  const eclipticPole = eclipticToScene({ x: 0, y: 0, z: 1 });
  assert.ok(Math.abs(angleDeg(earthPole, eclipticPole) - OBLIQUITY_DEG) < 1e-6);
});

test('equatorialToScene returns unit vectors', () => {
  for (const [ra, dec] of [[0, 0], [90, 45], [257.31, -15.18]]) {
    assert.ok(Math.abs(norm(equatorialToScene(ra, dec)) - 1) < 1e-12);
  }
});

test('IAU poles + rotation sign reproduce the known axial tilts (angle between spin vector and ecliptic pole)', () => {
  const eclipticPole = eclipticToScene({ x: 0, y: 0, z: 1 });
  // [id, obliquity to orbit, tolerance]; tolerance covers the orbit's own inclination to the ecliptic.
  const expected = [
    ['mercury', 0.03, 7.5],
    ['venus', 177.36, 3.6],
    ['mars', 25.19, 2],
    ['jupiter', 3.13, 2],
    ['saturn', 26.73, 2.5],
    ['uranus', 97.77, 0.5],
    ['neptune', 28.32, 1],
    ['pluto', 122.53, 17.5],
  ];
  for (const [id, tilt, tol] of expected) {
    const sign = Math.sign(BODY_BY_ID[id].rotationHours);
    const pole = poleDirection(id);
    const spin = { x: pole.x * sign, y: pole.y * sign, z: pole.z * sign };
    const got = angleDeg(spin, eclipticPole);
    assert.ok(Math.abs(got - tilt) <= tol, `${id}: ${got.toFixed(2)}° vs ${tilt}°`);
  }
});

test('the Moon orbits at its real distance, close to the ecliptic plane', () => {
  for (const iso of ['2000-01-01T12:00:00Z', '2026-11-26T19:51:00Z', '2040-06-15T00:00:00Z']) {
    const p = moonGeocentricPosition(at(iso));
    const d = norm(p);
    assert.ok(d > 356000 && d < 407000, `${iso}: ${d} km`);
    assert.ok(Math.abs(Math.asin(p.z / d) / DEG) <= 5.2);
  }
  const ring = moonOrbitPoints(at('2026-11-26T19:51:00Z'), 32);
  assert.equal(ring.length, 33);
});

test('distance compression is monotonic and anchored: Earth at 18 units', () => {
  assert.equal(compressDistance(1), 18);
  assert.equal(compressDistance(0), 0);
  const au = [0.39, 0.72, 1, 1.52, 5.2, 9.58, 19.2, 30.07, 39.5];
  for (let i = 1; i < au.length; i++) assert.ok(compressDistance(au[i]) > compressDistance(au[i - 1]));
  const v = compressVector({ x: 3, y: 4, z: 0 });
  assert.ok(Math.abs(norm(v) - compressDistance(5)) < 1e-12);
  assert.ok(Math.abs(v.y / v.x - 4 / 3) < 1e-12, 'direction preserved');
});

test('visual radii keep the real ordering and Earth = 1', () => {
  assert.equal(bodyVisualRadius('earth'), 1);
  const order = ['pluto', 'mercury', 'mars', 'venus', 'earth', 'neptune', 'uranus', 'saturn', 'jupiter'];
  for (let i = 1; i < order.length; i++) {
    assert.ok(bodyVisualRadius(order[i]) > bodyVisualRadius(order[i - 1]), order[i]);
  }
  assert.ok(Math.abs(bodyVisualRadius('moon') - 0.2727) < 0.001);
});

test('drawn spheres of neighbouring orbits never overlap, from perihelion to aphelion', () => {
  // Neptune and Pluto genuinely cross (Pluto is inclined 17°), so Pluto is checked apart.
  const ids = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
  const range = (id) => {
    const { a, e } = elementsAt(id, at('2026-11-26T12:00:00Z'));
    return [compressDistance(a * (1 - e)), compressDistance(a * (1 + e))];
  };
  for (let i = 1; i < ids.length; i++) {
    const [, innerMax] = range(ids[i - 1]);
    const [outerMin] = range(ids[i]);
    const gap = outerMin - innerMax;
    const need = bodyVisualRadius(ids[i - 1]) + bodyVisualRadius(ids[i]);
    assert.ok(gap > need, `${ids[i - 1]}–${ids[i]}: gap ${gap.toFixed(2)} ≤ radii ${need.toFixed(2)}`);
  }
});

test('spin rates keep real ratios and signs; Earth takes SPIN_SECONDS_PER_EARTH_DAY', () => {
  assert.ok(Math.abs(secondsPerTurn(BODY_BY_ID.earth.rotationHours) - SPIN_SECONDS_PER_EARTH_DAY) < 1e-9);
  const jupiter = secondsPerTurn(BODY_BY_ID.jupiter.rotationHours);
  assert.ok(Math.abs(jupiter / SPIN_SECONDS_PER_EARTH_DAY - 9.925 / 23.9345) < 1e-9);
  assert.ok(spinRate(BODY_BY_ID.venus.rotationHours) < 0, 'Venus is retrograde');
  assert.ok(spinRate(BODY_BY_ID.uranus.rotationHours) < 0, 'Uranus is retrograde');
  assert.ok(spinRate(BODY_BY_ID.pluto.rotationHours) > 0, 'Pluto is retrograde through its tilt, not its sign');
  assert.ok(spinRate(BODY_BY_ID.mars.rotationHours) > 0);
});

test('catalogue is complete and every body has a name in both languages', () => {
  assert.equal(BODIES.length, 11);
  for (const body of BODIES) {
    assert.ok(en[`solar.${body.id}`], `en.solar.${body.id}`);
    assert.ok(es[`solar.${body.id}`], `es.solar.${body.id}`);
    assert.ok(body.radiusKm > 0);
    assert.ok(Math.abs(norm(poleDirection(body.id)) - 1) < 1e-12);
  }
  for (const id of ORBITING_IDS) assert.ok(BODY_BY_ID[id]);
});
