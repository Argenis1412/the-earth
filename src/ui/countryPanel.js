import { formatPopulation, getCountryDetails } from '../data/countryDetails.js';

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

    // Populate data
    flagEl.textContent = details.flag || '🌐';
    nameEl.textContent = details.name;

    const isoLabels = [details.iso2, details.iso3].filter(Boolean).join(' / ');
    subEl.textContent = [details.continent, isoLabels].filter(Boolean).join(' · ');

    capitalEl.textContent = details.capital || '—';
    populationEl.textContent = formatPopulation(details.population);
    languagesEl.textContent = details.languages?.length ? details.languages.join(', ') : '—';
    currencyEl.textContent = details.currency || '—';

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
      label: currentCountry.name,
    });
  }

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
