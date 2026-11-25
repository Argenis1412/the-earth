import test from 'node:test';
import assert from 'node:assert/strict';
import { CITIES } from '../src/data/cities.js';
import { createCityIndex, searchPlaces } from '../src/geography/countries.js';

const cityIndex = createCityIndex(CITIES);

test('searchPlaces is accent-insensitive', () => {
  const results = searchPlaces('sao', cityIndex, 'es');
  assert.equal(results[0].label, 'São Paulo');
  assert.equal(results[0].sub, 'Brasil');
  assert.equal(results[0].value, 'São Paulo');

  assert.ok(searchPlaces('são', cityIndex, 'es').some((r) => r.label === 'São Paulo'));
});

test('searchPlaces returns an empty list for empty queries', () => {
  assert.deepEqual(searchPlaces('', cityIndex), []);
  assert.deepEqual(searchPlaces('   ', cityIndex), []);
});

test('searchPlaces ranks prefix, word-start and substring matches in order', () => {
  const synthetic = [
    { name: 'Newyorkville', country: 'X', search: ['newyorkville'] },
    { name: 'New York', country: 'X', search: ['new york'] },
    { name: 'York', country: 'X', search: ['york'] },
  ];
  const ranked = searchPlaces('york', synthetic, 'en');
  assert.deepEqual(ranked.map((r) => r.label), ['York', 'New York', 'Newyorkville']);
});

test('short queries do not match substrings', () => {
  const synthetic = [{ name: 'Xoxo', country: 'X', search: ['xoxo'] }];
  assert.deepEqual(searchPlaces('o', synthetic, 'en'), []);
  assert.equal(searchPlaces('ox', synthetic, 'en')[0].label, 'Xoxo');
});

test('searchPlaces respects the limit', () => {
  const results = searchPlaces('a', cityIndex, 'es', 3);
  assert.equal(results.length, 3);
});

test('searchPlaces matches English and Spanish city names in the active language', () => {
  assert.equal(searchPlaces('Tokyo', cityIndex, 'en')[0].label, 'Tokyo');
  assert.equal(searchPlaces('Tokyo', cityIndex, 'en')[0].sub, 'Japan');
  assert.equal(searchPlaces('Tokio', cityIndex, 'es')[0].label, 'Tokio');
  assert.equal(searchPlaces('Tokio', cityIndex, 'es')[0].sub, 'Japón');
  assert.equal(searchPlaces('Seoul', cityIndex, 'en')[0].label, 'Seoul');
  assert.equal(searchPlaces('Seúl', cityIndex, 'es')[0].label, 'Seúl');
  assert.equal(searchPlaces('New York', cityIndex, 'en')[0].label, 'New York');
  assert.equal(searchPlaces('Nueva York', cityIndex, 'es')[0].label, 'Nueva York');
});
