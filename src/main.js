import './styles.css';
import { CITIES } from './data/cities.js';
import { haversineDistance } from './geography/coordinates.js';
import {
  colorCountries,
  countryAt,
  createCityIndex,
  decodeWorld,
  resolveLocation,
} from './geography/countries.js';
import { createGlobe } from './globe/createGlobe.js';
import { setupInteractions } from './globe/interactions.js';
import { createRouteRenderer } from './globe/routeRenderer.js';
import { createSolarSystem } from './solar/createSolarSystem.js';
import { createDistancePanel } from './ui/distancePanel.js';
import { createCountryPanel } from './ui/countryPanel.js';
import { applyStaticTranslations } from './i18n/dom.js';
import { SUPPORTED, getLang, onLangChange, setLang, t } from './i18n/index.js';

const $ = (selector) => document.querySelector(selector);
const loadingEl = $('#loading');

const showFailure = (message) => {
  loadingEl.innerHTML = `<div style="max-width:36ch;text-align:center;line-height:1.5">${message}</div>`;
};

function initLanguage() {
  const urlLang = new URLSearchParams(window.location.search).get('lang');
  setLang(SUPPORTED.includes(urlLang) ? urlLang : getLang());
  applyStaticTranslations();

  const buttons = document.querySelectorAll('.lang-btn');
  const syncPressed = () => {
    buttons.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === getLang()));
    });
  };
  syncPressed();
  buttons.forEach((btn) => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
  onLangChange(() => {
    syncPressed();
    applyStaticTranslations();
  });
}

async function init() {
  initLanguage();
  const { default: worldData } = await import('./data/world.json');
  const world = decodeWorld(worldData);
  const colors = colorCountries(world);
  const cityIndex = createCityIndex(CITIES);
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let globe;
  let interactions;

  try {
    globe = createGlobe({
      container: $('#stage'),
      world,
      colors,
      reduceMotion,
      spinBtn: $('#btnSpin'),
      resetBtn: $('#btnReset'),
      onControlsStart: () => interactions?.hideTip(),
    });
  } catch (error) {
    console.error(error);
    showFailure(t('app.webglError'));
    return;
  }

  const routeRenderer = createRouteRenderer(globe);
  globe.setLanguage(getLang());
  onLangChange((lang) => globe.setLanguage(lang));

  // Sun, planets and Moon around the Earth (the default view stays on the Earth)
  const solar = createSolarSystem({ globe, reduceMotion });
  globe.setSunWorldDirection(solar.sunDirection);
  solar.setLanguage(getLang());
  onLangChange((lang) => solar.setLanguage(lang));
  $('#btnSystem')?.addEventListener('click', () =>
    globe.flyTo(solar.overviewDirection, solar.overviewDistance, 2.4),
  );

  const panel = createDistancePanel({
    world,
    cities: CITIES,
    cityIndex,
    globe,
    routeRenderer,
    reduceMotion,
  });

  // Country detail card — wired to both globe clicks and the calculator
  const countryPanel = createCountryPanel({
    world,
    onSetAsStop: (slotId, point) => {
      panel.setPoint(slotId, point, {
        fly: true,
        gentleZoom: true,
        fillInput: true,
        recalculate: true,
      });
      // Expand the calculator panel if collapsed
      const panelEl = $('#panel');
      if (panelEl?.classList.contains('collapsed')) {
        panelEl.classList.remove('collapsed');
        $('#btnCollapse')?.setAttribute('aria-expanded', 'true');
      }
    },
  });

  interactions = setupInteractions({
    globe,
    world,
    tooltipEl: $('#tip'),
    getDraggableMarkers: routeRenderer.getMarkerObjects,
    onMarkerDrag: panel.dragStopPoint,
    poleMarkers: [globe.northPoleMarker, globe.southPoleMarker],
    onGlobeClick: (coords) => {
      // Fill calculator slot as before
      panel.handleGlobeClick(coords);

      // Show country detail card if a country was clicked
      const country = countryAt(world, coords.lon, coords.lat);
      if (country) {
        countryPanel.show(country, { lat: coords.lat, lon: coords.lon });
      } else {
        countryPanel.hide();
      }
    },
  });

  panel.restoreFromUrl(window.location.search);
  window.addEventListener('popstate', () => {
    panel.restoreFromUrl(window.location.search);
  });

  requestAnimationFrame(() =>
    requestAnimationFrame(() => loadingEl.classList.add('done')),
  );

  // Debug hook preserving compatibility with the original monolith
  window.__globe = {
    THREE: globe.THREE,
    scene: globe.scene,
    camera: globe.camera,
    controls: globe.controls,
    stops: panel.stops,
    get state() {
      return panel.getState();
    },
    resolve: (query) => resolveLocation(query, world, cityIndex, getLang()),
    haversine: haversineDistance,
    calculate: panel.calculate,
    setPoint: panel.setPoint,
    countryAt: (lon, lat) => countryAt(world, lon, lat),
    G: world,
    setSpin: globe.setSpin,
    countryPanel,
    solar,
    poleMarkers: { north: globe.northPoleMarker, south: globe.southPoleMarker },
  };
}

init().catch((error) => {
  console.error(error);
  showFailure(t('app.initError'));
});
