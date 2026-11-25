import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  COUNTRY_DETAILS,
  formatPopulation,
  getCountryDetails,
  getLocalizedDetails,
} from '../src/data/countryDetails.js';
import {
  CAPITAL_EN,
  CONTINENT_EN,
  CURRENCY_EN,
  LANGUAGE_EN,
  NAME_EN,
  NAME_EN_BY_NAME,
} from '../src/data/countryDetails.en.js';

const worldData = JSON.parse(
  readFileSync(new URL('../src/data/world.json', import.meta.url), 'utf8'),
);

test('getCountryDetails resolves countries by exact Spanish name', () => {
  const spain = getCountryDetails('España');
  assert.ok(spain);
  assert.equal(spain.name, 'España');
  assert.equal(spain.capital, 'Madrid');
  assert.equal(spain.iso2, 'ES');
  assert.equal(spain.iso3, 'ESP');
  assert.equal(spain.flag, '🇪🇸');
  assert.equal(spain.currency, 'Euro (€)');
  assert.deepEqual(spain.languages, ['Español']);

  const brazil = getCountryDetails('Brasil');
  assert.ok(brazil);
  assert.equal(brazil.capital, 'Brasilia');
  assert.equal(brazil.iso2, 'BR');
  assert.equal(brazil.flag, '🇧🇷');
  assert.deepEqual(brazil.languages, ['Portugués']);
});

test('getCountryDetails resolves countries by normalized and case-insensitive names', () => {
  const spain = getCountryDetails('espana');
  assert.ok(spain);
  assert.equal(spain.name, 'España');

  const us = getCountryDetails('estados unidos');
  assert.ok(us);
  assert.equal(us.name, 'Estados Unidos');

  const japan = getCountryDetails('JAPON');
  assert.ok(japan);
  assert.equal(japan.name, 'Japón');
});

test('getCountryDetails resolves countries by ISO-2 and ISO-3 codes', () => {
  const es = getCountryDetails('ES');
  assert.equal(es?.name, 'España');

  const esp = getCountryDetails('ESP');
  assert.equal(esp?.name, 'España');

  const br = getCountryDetails('br');
  assert.equal(br?.name, 'Brasil');

  const bra = getCountryDetails('bra');
  assert.equal(bra?.name, 'Brasil');

  const usa = getCountryDetails('USA');
  assert.equal(usa?.name, 'Estados Unidos');
});

test('getCountryDetails handles prefix matches and unknown queries gracefully', () => {
  const arg = getCountryDetails('Argen');
  assert.equal(arg?.name, 'Argentina');

  assert.equal(getCountryDetails(''), null);
  assert.equal(getCountryDetails('   '), null);
  assert.equal(getCountryDetails('AtlantisNonExistentPlaceXYZ'), null);
  assert.equal(getCountryDetails(null), null);
  assert.equal(getCountryDetails(undefined), null);
});

test('formatPopulation formats populations accurately in Spanish', () => {
  assert.equal(formatPopulation(1_428_627_663, 'es'), '1,43 B hab.');
  assert.equal(formatPopulation(47_420_000, 'es'), '47,4 M hab.');
  assert.equal(formatPopulation(215_313_498, 'es'), '215,3 M hab.');
  assert.equal(formatPopulation(80_088, 'es'), '80.088 hab.');
  assert.equal(formatPopulation(825, 'es'), '825 hab.');
  assert.equal(formatPopulation(0, 'es'), 'Deshabitado');
  assert.equal(formatPopulation(null, 'es'), '—');
  assert.equal(formatPopulation(undefined, 'es'), '—');
});

test('formatPopulation formats populations accurately in English', () => {
  assert.equal(formatPopulation(1_428_627_663, 'en'), '1.43 B');
  assert.equal(formatPopulation(47_420_000, 'en'), '47.4 M');
  assert.equal(formatPopulation(80_088, 'en'), '80,088');
  assert.equal(formatPopulation(825, 'en'), '825');
  assert.equal(formatPopulation(0, 'en'), 'Uninhabited');
  assert.equal(formatPopulation(null, 'en'), '—');
  assert.equal(formatPopulation(undefined), '—');
});

test('every country in world.json has valid details in COUNTRY_DETAILS', () => {
  assert.ok(COUNTRY_DETAILS.length >= 240);
  const names = new Set(worldData.names);

  for (const name of names) {
    const details = getCountryDetails(name);
    assert.ok(details, `Missing details for world country: ${name}`);
    assert.ok(details.capital, `Missing capital for: ${name}`);
    assert.ok(details.iso2, `Missing ISO-2 for: ${name}`);
    assert.ok(details.flag, `Missing flag for: ${name}`);
    assert.ok(details.continent, `Missing continent for: ${name}`);
    assert.ok(details.currency, `Missing currency for: ${name}`);
    assert.ok(Array.isArray(details.languages) && details.languages.length > 0, `Missing languages for: ${name}`);
  }
});

test('English translation tables cover every country and every unique value', () => {
  for (const country of COUNTRY_DETAILS) {
    assert.ok(NAME_EN[country.iso2], `Missing NAME_EN for ${country.iso2}`);
    assert.ok(CAPITAL_EN[country.iso2], `Missing CAPITAL_EN for ${country.iso2}`);
    assert.ok(CONTINENT_EN[country.continent], `Missing CONTINENT_EN for ${country.continent}`);
    assert.ok(CURRENCY_EN[country.currency], `Missing CURRENCY_EN for ${country.currency}`);
    for (const language of country.languages) {
      assert.ok(LANGUAGE_EN[language], `Missing LANGUAGE_EN for ${language}`);
    }
  }
  assert.ok(NAME_EN_BY_NAME['Chipre del Norte'], 'Missing duplicate-ISO override');
});

test('getCountryDetails matches English names and getLocalizedDetails switches fields', () => {
  assert.equal(getCountryDetails('Spain')?.name, 'España');
  assert.equal(getCountryDetails('Japan')?.name, 'Japón');
  assert.equal(getCountryDetails('Mexico')?.name, 'México');

  const japan = getCountryDetails('Japón');
  assert.deepEqual(getLocalizedDetails(japan, 'en'), {
    name: 'Japan',
    capital: 'Tokyo',
    continent: 'Asia',
    languages: ['Japanese'],
    currency: 'Japanese yen (¥)',
  });
  assert.equal(getLocalizedDetails(japan, 'es').name, 'Japón');

  const spain = getCountryDetails('España');
  assert.equal(getLocalizedDetails(spain, 'es').currency, 'Euro (€)');
});
