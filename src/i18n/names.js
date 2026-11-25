/**
 * Display-name helpers for the city catalog. These are the only functions that
 * read a city's name/country fields, so the record shape can change freely.
 */

/**
 * @param {{name: string}} city
 * @param {string} [lang]
 * @returns {string}
 */
export function cityName(city, lang) {
  return city.name;
}

/**
 * @param {{country: string}} city
 * @param {string} [lang]
 * @returns {string}
 */
export function cityCountry(city, lang) {
  return city.country;
}
