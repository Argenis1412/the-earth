import test from 'node:test';
import assert from 'node:assert/strict';
import en from '../src/i18n/en.js';
import es from '../src/i18n/es.js';
import {
  DEFAULT_LANG,
  SUPPORTED,
  getLang,
  setLang,
  t,
} from '../src/i18n/index.js';
import { bearingToCompass } from '../src/geography/coordinates.js';

const placeholders = (value) =>
  (value.match(/\{(\w+)\}/g) || []).map((token) => token.slice(1, -1)).sort();

test('English and Spanish dictionaries have identical key sets', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(es).sort());
});

test('no dictionary value is empty and placeholders match across languages', () => {
  for (const key of Object.keys(en)) {
    assert.equal(typeof en[key], 'string', `en.${key} must be a string`);
    assert.equal(typeof es[key], 'string', `es.${key} must be a string`);
    assert.ok(en[key].trim().length > 0, `en.${key} is empty`);
    assert.ok(es[key].trim().length > 0, `es.${key} is empty`);
    assert.deepEqual(
      placeholders(en[key]),
      placeholders(es[key]),
      `Placeholders differ for ${key}`,
    );
  }
});

test('t() interpolates and falls back to English and then to the key', () => {
  assert.equal(DEFAULT_LANG, 'en');
  assert.deepEqual(SUPPORTED, ['en', 'es']);

  const spanish = t('error.NOT_FOUND', { query: 'Xyz' }, 'es');
  assert.ok(spanish.includes('Xyz'));

  assert.equal(t('panel.calc', {}, 'xx'), en['panel.calc']);
  assert.equal(t('definitely.missing.key'), 'definitely.missing.key');
});

test('setLang rejects unknown codes and accepts supported ones', () => {
  const before = getLang();
  assert.equal(setLang('fr'), false);
  assert.equal(getLang(), before);

  assert.equal(setLang('es'), true);
  assert.equal(getLang(), 'es');
  setLang(before);
});

test('English compass points differ from Spanish where expected', () => {
  assert.equal(bearingToCompass(270, 'en'), 'W');
  assert.equal(bearingToCompass(270, 'es'), 'O');
  assert.equal(bearingToCompass(315, 'en'), 'NW');
  assert.equal(bearingToCompass(315, 'es'), 'NO');
});
