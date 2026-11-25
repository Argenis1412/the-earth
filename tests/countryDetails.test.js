import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  COUNTRY_DETAILS,
  formatPopulation,
  getCountryDetails,
} from '../src/data/countryDetails.js';

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
  assert.equal(formatPopulation(1_428_627_663), '1,43 B hab.');
  assert.equal(formatPopulation(47_420_000), '47,4 M hab.');
  assert.equal(formatPopulation(215_313_498), '215,3 M hab.');
  assert.equal(formatPopulation(80_088), '80.088 hab.');
  assert.equal(formatPopulation(825), '825 hab.');
  assert.equal(formatPopulation(0), 'Deshabitado');
  assert.equal(formatPopulation(null), '—');
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
