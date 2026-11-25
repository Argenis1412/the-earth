import { CITIES } from '../data/cities.js';
import { getCountryDetails, getLocalizedDetails } from '../data/countryDetails.js';
import { DEFAULT_LANG, t } from './index.js';

/**
 * Display-name helpers for the city and country catalogues. These are the only
 * functions that read a city's name/country fields, so the record shape can
 * change freely.
 */

/**
 * @param {{name: string | {en: string, es: string}}} city
 * @param {'en' | 'es'} [lang]
 * @returns {string}
 */
export function cityName(city, lang = DEFAULT_LANG) {
  if (!city) return '';
  if (typeof city.name === 'string') return city.name;
  return city.name?.[lang] ?? city.name?.[DEFAULT_LANG] ?? '';
}

/**
 * @param {{country: string}} city
 * @param {'en' | 'es'} [lang]
 * @returns {string}
 */
export function cityCountry(city, lang = DEFAULT_LANG) {
  return countryName(city?.country, lang);
}

/**
 * Builds the "City, Country" label used by the calculator.
 * @param {object} city
 * @param {'en' | 'es'} [lang]
 * @returns {string}
 */
export function cityLabel(city, lang = DEFAULT_LANG) {
  return `${cityName(city, lang)}, ${cityCountry(city, lang)}`;
}

/**
 * Resolves a Spanish country name or an ISO-2 code to a localized display name.
 * @param {string} target
 * @param {'en' | 'es'} [lang]
 * @returns {string}
 */
export function countryName(target, lang = DEFAULT_LANG) {
  if (!target) return '';
  const details = getCountryDetails(target);
  return details ? getLocalizedDetails(details, lang).name : target;
}

/**
 * Finds a city in the catalogue by its stable id.
 * @param {string} id
 * @returns {object | null}
 */
export function cityById(id) {
  return CITIES.find((city) => city.id === id) || null;
}

/**
 * Rebuilds a stop label from a language-neutral reference.
 * @param {{kind: 'city'|'country'|'point'|'pole', id?: string, iso2?: string|null, approx?: boolean}} ref
 * @param {'en' | 'es'} [lang]
 * @returns {string}
 */
export function labelFromRef(ref, lang = DEFAULT_LANG) {
  if (!ref) return '';

  if (ref.kind === 'city') {
    const city = cityById(ref.id);
    return city ? cityLabel(city, lang) : ref.id || '';
  }

  if (ref.kind === 'country') {
    const name = countryName(ref.iso2, lang);
    return ref.approx ? t('place.approxCenter', { name }, lang) : name;
  }

  if (ref.kind === 'pole') {
    return t(`pole.${ref.id}.title`, {}, lang);
  }

  if (ref.kind === 'point') {
    return ref.iso2 ? countryName(ref.iso2, lang) : t('place.ocean', {}, lang);
  }

  return '';
}
