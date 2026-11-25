import en from './en.js';
import es from './es.js';

export const SUPPORTED = ['en', 'es'];
export const DEFAULT_LANG = 'en';

const STORAGE_KEY = 'globe.lang';
const DICTS = { en, es };
const listeners = new Set();
const warned = new Set();

const readStoredLang = () => {
  try {
    if (typeof localStorage === 'undefined') return null;
    const value = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(value) ? value : null;
  } catch {
    return null;
  }
};

let current = readStoredLang() || DEFAULT_LANG;

/**
 * Returns the active language code.
 * @returns {'en' | 'es'}
 */
export function getLang() {
  return current;
}

/**
 * Validates, persists, applies and broadcasts a language change.
 * @param {string} lang
 * @returns {boolean} false when the language code is unsupported.
 */
export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return false;
  current = lang;
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage unavailable */
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
  listeners.forEach((cb) => cb(lang));
  return true;
}

/**
 * Subscribes to language changes.
 * @param {(lang: 'en' | 'es') => void} cb
 * @returns {() => void} unsubscribe
 */
export function onLangChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function interpolate(template, params) {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    params[key] !== undefined ? String(params[key]) : match,
  );
}

/**
 * Translates a dictionary key with {placeholder} interpolation.
 * Fallback order: requested language → English → the key itself.
 * @param {string} key
 * @param {Record<string, unknown>} [params]
 * @param {'en' | 'es'} [lang]
 * @returns {string}
 */
export function t(key, params = {}, lang = getLang()) {
  let template = DICTS[lang]?.[key];
  if (template === undefined) template = DICTS[DEFAULT_LANG][key];
  if (template === undefined) {
    if (!warned.has(key)) {
      warned.add(key);
      console.warn(`[i18n] Missing key: ${key}`);
    }
    return key;
  }
  return interpolate(template, params);
}
