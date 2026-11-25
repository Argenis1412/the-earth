import {
  formatPopulation,
  getCountryDetails,
  getLocalizedDetails,
} from '../data/countryDetails.js';
import { getLang, onLangChange } from '../i18n/index.js';

const $ = (selector, parent = document) => parent.querySelector(selector);

/**
 * Creates the country details card component.
 * Decoupled from Three.js and rendering pipelines.
 *
 * @param {{
 *   world?: { countries: Array<{ name: string, main?: { c: [number, number] } }> },
 *   onSetAsStop?: (slotId: string, point: { lat: number, lon: number, label: string }) => void,
 * }} options
 */
export function createCountryPanel({ world, onSetAsStop } = {}) {
  const cardEl = $('#countryCard');
  if (!cardEl) {
    throw new Error('Element #countryCard not found in DOM.');
  }

  const flagEl = $('#countryFlag', cardEl);
  const nameEl = $('#countryName', cardEl);
  const subEl = $('#countrySub', cardEl);
  const closeBtn = $('#btnCountryClose', cardEl);
  const capitalEl = $('#countryCapital', cardEl);
  const populationEl = $('#countryPopulation', cardEl);
  const languagesEl = $('#countryLanguages', cardEl);
  const currencyEl = $('#countryCurrency', cardEl);
  const btnAsA = $('#btnCountryAsA', cardEl);
  const btnAsB = $('#btnCountryAsB', cardEl);

  let currentCountry = null;
  let currentPoint = null;

  function findCentroid(countryName) {
    if (!world?.countries) return null;
    const item = world.countries.find((c) => c.name === countryName);
    if (item?.main?.c) {
      return {
        lat: item.main.c[1],
        lon: item.main.c[0],
      };
    }
    return null;
  }

  /**
   * Shows detailed country info in the panel.
   * @param {string|{name: string, main?: object}} countryTarget
   * @param {{lat: number, lon: number}|null} [coords=null]
   */
  function render() {
    if (!currentCountry) return;
    const lang = getLang();
    const details = getLocalizedDetails(currentCountry, lang);

    flagEl.textContent = currentCountry.flag || '🌐';
    nameEl.textContent = details.name;

    const isoLabels = [currentCountry.iso2, currentCountry.iso3].filter(Boolean).join(' / ');
    subEl.textContent = [details.continent, isoLabels].filter(Boolean).join(' · ');

    capitalEl.textContent = details.capital || '—';
    populationEl.textContent = formatPopulation(currentCountry.population, lang);
    languagesEl.textContent = details.languages?.length ? details.languages.join(', ') : '—';
    currencyEl.textContent = details.currency || '—';
  }

  function show(countryTarget, coords = null) {
    const rawName = typeof countryTarget === 'string' ? countryTarget : countryTarget?.name;
    if (!rawName) return false;

    const details = getCountryDetails(rawName);
    if (!details) return false;

    currentCountry = details;

    let targetCoords = coords;
    if (!targetCoords && typeof countryTarget === 'object' && countryTarget?.main?.c) {
      targetCoords = {
        lat: countryTarget.main.c[1],
        lon: countryTarget.main.c[0],
      };
    }
    if (!targetCoords) {
      targetCoords = findCentroid(details.name);
    }
    currentPoint = targetCoords;

    render();
    cardEl.hidden = false;
    cardEl.classList.add('visible');

    return true;
  }

  function hide() {
    cardEl.classList.remove('visible');
    cardEl.hidden = true;
    currentCountry = null;
    currentPoint = null;
  }

  closeBtn?.addEventListener('click', hide);

  function assignToStop(slotId) {
    if (!currentCountry || !onSetAsStop) return;
    const pt = currentPoint || findCentroid(currentCountry.name) || { lat: 0, lon: 0 };
    onSetAsStop(slotId, {
      lat: pt.lat,
      lon: pt.lon,
      label: getLocalizedDetails(currentCountry, getLang()).name,
      ref: { kind: 'country', iso2: currentCountry.iso2, approx: false },
    });
  }

  onLangChange(render);

  btnAsA?.addEventListener('click', () => assignToStop('A'));
  btnAsB?.addEventListener('click', () => assignToStop('B'));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !cardEl.hidden) {
      hide();
    }
  });

  return {
    show,
    showByName: (name, coords = null) => show(name, coords),
    hide,
    isOpen: () => !cardEl.hidden,
    getCurrentCountry: () => currentCountry,
  };
}
