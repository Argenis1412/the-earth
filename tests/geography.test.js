import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  EARTH_RADIUS_KM,
  bearingToCompass,
  cartesianToLatLon,
  convertDistance,
  formatBearing,
  formatCoordinates,
  formatFlightTime,
  greatCirclePoints,
  haversineDistance,
  initialBearing,
  latLonToCartesian,
  normalizeText,
  parseCoordinates,
} from '../src/geography/coordinates.js';
import {
  colorCountries,
  countryAt,
  createCityIndex,
  decodeWorld,
  formatContinents,
  resolveLocation,
} from '../src/geography/countries.js';
import { CITIES } from '../src/data/cities.js';
import { labelFromRef } from '../src/i18n/names.js';

const worldData = JSON.parse(
  readFileSync(new URL('../src/data/world.json', import.meta.url), 'utf8'),
);
const world = decodeWorld(worldData);
const cityIndex = createCityIndex(CITIES);

test('haversineDistance computes accurate great-circle distances', () => {
  assert.equal(haversineDistance({ lat: 0, lon: 0 }, { lat: 0, lon: 0 }), 0);

  const curitiba = { lat: -25.4284, lon: -49.2733 };
  const madrid = { lat: 40.4168, lon: -3.7038 };
  const dist = haversineDistance(curitiba, madrid);
  assert.ok(Math.abs(dist - 8705.476664) < 0.01, `Unexpected distance: ${dist}`);

  const antipodal = haversineDistance({ lat: 0, lon: 0 }, { lat: 0, lon: 180 });
  assert.ok(Math.abs(antipodal - Math.PI * EARTH_RADIUS_KM) < 1e-6);
});

test('initialBearing computes cardinal directions', () => {
  assert.ok(Math.abs(initialBearing({ lat: 0, lon: 0 }, { lat: 10, lon: 0 }) - 0) < 1e-6);
  assert.ok(Math.abs(initialBearing({ lat: 0, lon: 0 }, { lat: 0, lon: 10 }) - 90) < 1e-6);
  assert.ok(Math.abs(initialBearing({ lat: 0, lon: 0 }, { lat: -10, lon: 0 }) - 180) < 1e-6);
  assert.ok(Math.abs(initialBearing({ lat: 0, lon: 0 }, { lat: 0, lon: -10 }) - 270) < 1e-6);
});

test('convertDistance, bearingToCompass, formatBearing, and formatFlightTime calculate correctly', () => {
  const km = 8705.48;
  const miles = convertDistance(km, 'mi');
  const nm = convertDistance(km, 'NM');
  assert.ok(Math.abs(miles - 5409.33) < 0.1);
  assert.ok(Math.abs(nm - 4700.58) < 0.1);
  assert.equal(convertDistance(km, 'km'), km);

  assert.equal(bearingToCompass(0), 'N');
  assert.equal(bearingToCompass(41), 'NE');
  assert.equal(bearingToCompass(90), 'E');
  assert.equal(bearingToCompass(180), 'S');
  assert.equal(bearingToCompass(270, 'es'), 'O');
  assert.equal(bearingToCompass(315, 'es'), 'NO');

  assert.equal(formatBearing(41.2), '41° NE');
  assert.equal(formatBearing(0), '0° N');

  assert.equal(formatFlightTime(850, 850), '1 h 0 min');
  assert.equal(formatFlightTime(425, 850), '30 min');
  assert.equal(formatFlightTime(8705.48, 850), '10 h 15 min');
});

test('latLonToCartesian and cartesianToLatLon round-trip accurately', () => {
  const samples = [
    { lat: 0, lon: 0 },
    { lat: -25.4284, lon: -49.2733 },
    { lat: 40.4168, lon: -3.7038 },
    { lat: 35.6762, lon: 139.6503 },
    { lat: -54.8019, lon: -68.303 },
  ];

  for (const pt of samples) {
    const vec = latLonToCartesian(pt.lat, pt.lon, 1);
    const len = Math.hypot(vec.x, vec.y, vec.z);
    assert.ok(Math.abs(len - 1) < 1e-12);
    const back = cartesianToLatLon(vec.x, vec.y, vec.z);
    assert.ok(Math.abs(back.lat - pt.lat) < 1e-9);
    assert.ok(Math.abs(back.lon - pt.lon) < 1e-9);
  }
});

test('latLonToCartesian places poles correctly on the Y axis', () => {
  const north = latLonToCartesian(90, 0, 1);
  assert.ok(Math.abs(north.x) < 1e-10, 'North pole x ≈ 0');
  assert.ok(Math.abs(north.y - 1) < 1e-10, 'North pole y ≈ 1');
  assert.ok(Math.abs(north.z) < 1e-10, 'North pole z ≈ 0');

  const south = latLonToCartesian(-90, 0, 1);
  assert.ok(Math.abs(south.x) < 1e-10, 'South pole x ≈ 0');
  assert.ok(Math.abs(south.y + 1) < 1e-10, 'South pole y ≈ -1');
  assert.ok(Math.abs(south.z) < 1e-10, 'South pole z ≈ 0');
});

test('cartesianToLatLon recovers pole coordinates', () => {
  const north = cartesianToLatLon(0, 1, 0);
  assert.ok(Math.abs(north.lat - 90) < 0.01, 'North pole lat ≈ 90');

  const south = cartesianToLatLon(0, -1, 0);
  assert.ok(Math.abs(south.lat + 90) < 0.01, 'South pole lat ≈ -90');
});

test('greatCirclePoints handles normal and antipodal arcs', () => {
  const a = latLonToCartesian(0, 0, 1);
  const b = latLonToCartesian(0, 180, 1);
  const points = greatCirclePoints(a, b, 20);
  assert.equal(points.length, 21);
  for (const p of points) {
    assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.z));
    assert.ok(Math.abs(Math.hypot(p.x, p.y, p.z) - 1) < 1e-9);
  }
});

test('parseCoordinates, formatCoordinates, and normalizeText behave as expected', () => {
  assert.deepEqual(parseCoordinates('-25.43, -49.27'), { lat: -25.43, lon: -49.27 });
  assert.deepEqual(parseCoordinates('40.4168; -3.7038'), { lat: 40.4168, lon: -3.7038 });
  assert.deepEqual(parseCoordinates('−12.04 -77.04'), { lat: -12.04, lon: -77.04 });
  assert.ok('error' in parseCoordinates('95, 10'));
  assert.ok('error' in parseCoordinates('10, 190'));
  assert.equal(parseCoordinates('Curitiba'), null);

  assert.equal(formatCoordinates(-25.4284, -49.2733), '-25.43°, -49.27°');
  assert.equal(normalizeText('  São Paulo '), 'sao paulo');
});

test('decodeWorld and colorCountries produce valid non-conflicting country data', () => {
  assert.equal(world.countries.length, 241);
  const colors = colorCountries(world);
  assert.equal(colors.length, 241);

  for (const country of world.countries) {
    for (const neighborIdx of world.nb[country.i]) {
      assert.notEqual(
        colors[country.i],
        colors[neighborIdx],
        `Neighboring countries ${country.name} and ${world.countries[neighborIdx].name} share color`,
      );
    }
  }
});

test('countryAt and formatContinents identify countries and oceans', () => {
  const brasil = countryAt(world, -49.2733, -25.4284);
  assert.equal(brasil?.name, 'Brasil');
  assert.equal(formatContinents(brasil, 'es'), 'América del Sur');
  assert.equal(formatContinents(brasil, 'en'), 'South America');

  const spain = countryAt(world, -3.7038, 40.4168);
  assert.equal(spain?.name, 'España');
  assert.equal(formatContinents(spain, 'es'), 'Europa');

  const ocean = countryAt(world, -30, 0);
  assert.equal(ocean, null);
});

test('resolveLocation resolves coordinates, cities, countries, and errors', () => {
  const byCity = resolveLocation('Curitiba', world, cityIndex, 'es');
  assert.equal(byCity.label, 'Curitiba, Brasil');
  assert.ok(Math.abs(byCity.lat - -25.4284) < 1e-6);
  assert.deepEqual(byCity.ref, { kind: 'city', id: 'curitiba' });

  const byCountry = resolveLocation('japon', world, cityIndex, 'es');
  assert.equal(byCountry.label, 'Japón (centro aprox.)');
  assert.deepEqual(byCountry.ref, { kind: 'country', iso2: 'JP', approx: true });

  const byCoords = resolveLocation('-25.43, -49.27', world, cityIndex, 'es');
  assert.equal(byCoords.label, 'Brasil');
  assert.deepEqual(byCoords.ref, { kind: 'point', iso2: 'BR' });

  const unknown = resolveLocation('CiudadInexistenteXYZ', world, cityIndex, 'es');
  assert.ok('error' in unknown);
});

test('resolveLocation accepts both languages for the same city', () => {
  const english = resolveLocation('Rio de Janeiro', world, cityIndex, 'en');
  const spanish = resolveLocation('Río de Janeiro', world, cityIndex, 'es');
  assert.equal(english.label, 'Rio de Janeiro, Brazil');
  assert.equal(spanish.label, 'Río de Janeiro, Brasil');
  assert.deepEqual(english.ref, { kind: 'city', id: 'rio-de-janeiro' });
  assert.deepEqual(spanish.ref, english.ref);

  assert.equal(resolveLocation('Japan', world, cityIndex, 'en').label, 'Japan (approx. center)');
  assert.equal(resolveLocation('Tokyo', world, cityIndex, 'es').label, 'Tokio, Japón');
  assert.equal(resolveLocation('Tokio', world, cityIndex, 'en').label, 'Tokyo, Japan');
});

test('labelFromRef rebuilds labels in both languages', () => {
  assert.equal(labelFromRef({ kind: 'city', id: 'tokyo' }, 'en'), 'Tokyo, Japan');
  assert.equal(labelFromRef({ kind: 'city', id: 'tokyo' }, 'es'), 'Tokio, Japón');
  assert.equal(labelFromRef({ kind: 'country', iso2: 'JP', approx: true }, 'en'), 'Japan (approx. center)');
  assert.equal(labelFromRef({ kind: 'country', iso2: 'JP', approx: true }, 'es'), 'Japón (centro aprox.)');
  assert.equal(labelFromRef({ kind: 'point', iso2: 'BR' }, 'es'), 'Brasil');
  assert.equal(labelFromRef({ kind: 'point', iso2: null }, 'en'), 'Open ocean');
  assert.equal(labelFromRef({ kind: 'pole', id: 'north' }, 'es'), 'Polo Norte');
});
