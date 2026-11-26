import {
  DEG_TO_RAD,
  convertDistance,
  formatBearing,
  formatCoordinates,
  formatFlightTime,
  haversineDistance,
  initialBearing,
} from '../geography/coordinates.js';
import { countryAt, resolveLocation, searchPlaces } from '../geography/countries.js';
import { poleAt } from '../geography/poles.js';
import { toVec } from '../globe/createGlobe.js';
import { getLang, onLangChange, t } from '../i18n/index.js';
import { labelFromRef } from '../i18n/names.js';
import { getCountryDetails } from '../data/countryDetails.js';
import { createAutocomplete } from './autocomplete.js';

const formatNumber = (value) =>
  new Intl.NumberFormat(getLang() === 'es' ? 'es-ES' : 'en-US', {
    maximumFractionDigits: value < 100 ? 1 : 0,
  }).format(value);

/**
 * Controls the distance calculator panel, using a `stops[]` collection model
 * (currently configured with stops A and B) and syncing with the globe and route renderer.
 * @param {{
 *   world: object,
 *   cities: Array<{name: string, country: string, lat: number, lon: number}>,
 *   cityIndex: Array<object>,
 *   globe: ReturnType<import('../globe/createGlobe.js').createGlobe>,
 *   routeRenderer: ReturnType<import('../globe/routeRenderer.js').createRouteRenderer>,
 *   reduceMotion: boolean,
 * }} deps
 */
export function createDistancePanel({ world, cities, cityIndex, globe, routeRenderer, reduceMotion }) {
  const $ = (selector) => document.querySelector(selector);

  const panelEl = $('#panel');
  const resultEl = $('#result');
  const kmValEl = $('#kmVal');
  const unitLabelEl = $('#unitLabel');
  const bearingValEl = $('#bearingVal');
  const flightTimeValEl = $('#flightTimeVal');
  const routeEl = $('#route');
  const btnShareRoute = $('#btnShareRoute');
  const shareToast = $('#shareToast');
  const hintEl = $('#hint');
  const unitButtons = document.querySelectorAll('#result .unit-btn');

  /**
   * Ordered list of route stops. Currently A and B are exposed in the UI;
   * multi-stop routes can append additional stops to this array in future stages.
   */
  const stops = [
    {
      id: 'A',
      color: 0xff7a59,
      cssVar: 'var(--a)',
      pt: null,
      text: '',
      error: null,
      linkedInput: false,
      input: $('#inA'),
      meta: $('#metaA'),
      row: document.querySelector('[data-slot="A"]'),
      emptyHint: 'panel.emptyHint',
    },
    {
      id: 'B',
      color: 0x4cc9f0,
      cssVar: 'var(--b)',
      pt: null,
      text: '',
      error: null,
      linkedInput: false,
      input: $('#inB'),
      meta: $('#metaB'),
      row: document.querySelector('[data-slot="B"]'),
      emptyHint: '',
    },
  ];

  setMeta(stops[0], t(stops[0].emptyHint));

  let activeIndex = 0;
  let countUp = null;
  let currentTotalKm = 0;
  let gentleZoomApplied = false;
  let currentUnit = 'km';
  let shareToastTimer = 0;

  function updateUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const hasPoints = stops.every((s) => s.pt);
    if (hasPoints) {
      params.set('from', stops[0].input.value.trim());
      params.set('to', stops[1].input.value.trim());
      if (currentUnit !== 'km') params.set('unit', currentUnit);
      else params.delete('unit');
    } else {
      params.delete('from');
      params.delete('to');
      params.delete('unit');
    }
    const query = params.toString();
    const newUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  }

  function setUnit(unit, animate = true) {
    if (!['km', 'mi', 'NM'].includes(unit)) return;
    currentUnit = unit;
    unitButtons.forEach((btn) => btn.classList.toggle('active', btn.dataset.unit === unit));
    unitLabelEl.textContent = unit;

    const targetVal = convertDistance(currentTotalKm, currentUnit);
    if (animate) {
      countUp = { t: 0, from: 0, to: targetVal };
    } else {
      countUp = null;
      kmValEl.textContent = formatNumber(targetVal);
    }
    updateUrlParams();
  }

  unitButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setUnit(btn.dataset.unit, true);
    });
  });

  const findStopIndex = (id) => stops.findIndex((s) => s.id === id);

  function setActiveIndex(index) {
    activeIndex = index;
    stops.forEach((stop, idx) => stop.row.classList.toggle('active', idx === index));
  }

  function setMeta(stop, text, isError = false) {
    stop.meta.textContent = text;
    stop.meta.classList.toggle('err', Boolean(isError));
  }

  function syncHint() {
    const hasText = stops.some((stop) => stop.input.value.trim());
    hintEl.classList.toggle('is-hidden', hasText || !resultEl.hidden);
  }

  function invalidate() {
    routeRenderer.clearRoute();
    countUp = null;
    currentTotalKm = 0;
    globe.setRouteActive(false);
    resultEl.hidden = true;
    updateUrlParams();
    syncHint();
  }

  function setStopPoint(stop, resolved, options = {}) {
    stop.pt = {
      lat: resolved.lat,
      lon: resolved.lon,
      label: resolved.label,
      ref: resolved.ref || null,
    };
    stop.error = null;
    if (options.fillInput) {
      stop.input.value = resolved.label;
      stop.linkedInput = true;
    } else if (options.click) {
      stop.input.value = `${resolved.lat.toFixed(4)}, ${resolved.lon.toFixed(4)}`;
      stop.linkedInput = false;
    }
    stop.text = stop.input.value.trim();
    setMeta(stop, `${resolved.label} · ${formatCoordinates(resolved.lat, resolved.lon)}`);
    routeRenderer.syncMarkers(stops);
    invalidate();

    if (options.fly) {
      globe.setSpin(false);
      if (options.gentleZoom) {
        // One-time 10% zoom-in; later picks only recenter, never accumulate zoom.
        const currentDistance = globe.camera.position.length();
        const distance = gentleZoomApplied
          ? currentDistance
          : Math.max(1.3, currentDistance * 0.9);
        gentleZoomApplied = true;
        globe.flyTo(toVec(resolved.lat, resolved.lon), distance);
      } else {
        globe.flyTo(toVec(resolved.lat, resolved.lon), Math.min(globe.camera.position.length(), 2.6));
      }
    }

    const other = stops.find((item) => item !== stop);
    if (options.fillInput && other && !other.pt) setActiveIndex(stops.indexOf(other));
    if (options.recalculate && stops.every((item) => item.pt)) {
      calculate({ preserveCamera: options.gentleZoom });
    }
  }

  function clearStop(stop) {
    stop.pt = null;
    stop.text = '';
    stop.error = null;
    stop.linkedInput = false;
    routeRenderer.syncMarkers(stops);
    setMeta(stop, stop.emptyHint ? t(stop.emptyHint) : '');
    invalidate();
  }

  function commitStop(stop, options) {
    const text = stop.input.value.trim();
    if (!text) {
      clearStop(stop);
      return true;
    }
    const resolved = resolveLocation(text, world, cityIndex, getLang());
    if (resolved.error) {
      stop.pt = null;
      stop.text = text;
      stop.error = { code: resolved.error, query: resolved.query };
      routeRenderer.syncMarkers(stops);
      setMeta(stop, t('error.' + resolved.error, { query: resolved.query }), true);
      invalidate();
      return false;
    }
    setStopPoint(stop, resolved, options);
    return true;
  }

  function renderRouteLine() {
    routeEl.textContent = '';
    stops.forEach((stop, idx) => {
      if (!stop.pt) return;
      const tag = document.createElement('i');
      tag.textContent = stop.id;
      tag.style.color = stop.cssVar;
      routeEl.append(tag, ` ${stop.pt.label}`);
      if (idx < stops.length - 1) routeEl.append(' → ');
    });
  }

  function renderStopTexts() {
    const lang = getLang();
    stops.forEach((stop) => {
      if (stop.pt) {
        if (stop.pt.ref) stop.pt.label = labelFromRef(stop.pt.ref, lang);
        if (stop.linkedInput) {
          stop.input.value = stop.pt.label;
          stop.text = stop.pt.label;
        }
        setMeta(stop, `${stop.pt.label} · ${formatCoordinates(stop.pt.lat, stop.pt.lon)}`);
      } else if (stop.error) {
        setMeta(stop, t(`error.${stop.error.code}`, { query: stop.error.query }, lang), true);
      } else {
        setMeta(stop, stop.emptyHint ? t(stop.emptyHint, {}, lang) : '');
      }
    });

    updateUrlParams();
    if (resultEl.hidden) return;
    if (stops[0]?.pt && stops[1]?.pt) {
      const bearing = initialBearing(stops[0].pt, stops[1].pt);
      bearingValEl.textContent = formatBearing(bearing, lang);
    }
    countUp = null;
    kmValEl.textContent = formatNumber(convertDistance(currentTotalKm, currentUnit));
    renderRouteLine();
  }

  function calculate(options = {}) {
    for (const stop of stops) {
      const text = stop.input.value.trim();
      if (text && (text !== stop.text || !stop.pt)) {
        commitStop(stop);
      } else if (!text && !stop.pt) {
        setMeta(stop, t('panel.missingPoint'), true);
      }
    }

    const firstMissing = stops.findIndex((s) => !s.pt);
    if (firstMissing !== -1) {
      setActiveIndex(firstMissing);
      return undefined;
    }

    let totalKm = 0;
    for (let i = 0; i < stops.length - 1; i++) {
      totalKm += haversineDistance(stops[i].pt, stops[i + 1].pt);
    }
    currentTotalKm = totalKm;

    invalidate();
    currentTotalKm = totalKm;
    const route = routeRenderer.buildRoute(stops);
    globe.setRouteActive(true);
    globe.setSpin(false);

    renderRouteLine();

    if (stops.length >= 2 && stops[0].pt && stops[1].pt) {
      const bearing = initialBearing(stops[0].pt, stops[1].pt);
      bearingValEl.textContent = formatBearing(bearing, getLang());
      flightTimeValEl.textContent = formatFlightTime(totalKm, 850);
    }

    resultEl.hidden = false;
    syncHint();
    const targetVal = convertDistance(totalKm, currentUnit);
    countUp = { t: 0, to: targetVal };
    updateUrlParams();

    const phi = route.theta / 2;
    const k = Math.tan(20 * DEG_TO_RAD) * Math.min(globe.camera.aspect, 1) * 0.7;
    const dist = Math.min(
      6.5,
      Math.max(1.45, Math.cos(phi) + Math.sin(phi) / k, 1 / Math.cos(Math.min(phi * 0.95, 1.25))),
    );
    if (!options.preserveCamera) globe.flyTo(route.mid, dist, 1.6);

    return totalKm;
  }

  function resolveGlobePoint(coords) {
    const pole = poleAt(coords.lat);
    const country = countryAt(world, coords.lon, coords.lat);
    const ref = pole
      ? { kind: 'pole', id: pole }
      : {
          kind: 'point',
          iso2: country ? getCountryDetails(country.name)?.iso2 || null : null,
        };
    const resolved = {
      lat: pole === 'north' ? 90 : pole === 'south' ? -90 : coords.lat,
      lon: pole ? 0 : coords.lon,
      label: labelFromRef(ref, getLang()),
      ref,
    };
    return resolved;
  }

  function handleGlobeClick(coords) {
    panelEl.classList.remove('collapsed');
    const currentStop = stops[activeIndex];
    const resolved = resolveGlobePoint(coords);
    setStopPoint(currentStop, resolved, { click: true });
    setActiveIndex((activeIndex + 1) % stops.length);
  }

  function dragStopPoint(slotId, coords, phase) {
    const index = findStopIndex(slotId);
    if (index === -1) return;
    const stop = stops[index];

    if (phase === 'start') {
      setActiveIndex(index);
      invalidate();
      return;
    }
    if (!coords) {
      if (phase === 'end' && stops.every((item) => item.pt)) {
        calculate({ preserveCamera: true });
      } else if (phase === 'end') {
        updateUrlParams();
      }
      return;
    }

    const resolved = resolveGlobePoint(coords);
    stop.pt = {
      lat: resolved.lat,
      lon: resolved.lon,
      label: resolved.label,
      ref: resolved.ref,
    };
    stop.error = null;
    stop.linkedInput = false;
    stop.input.value = `${resolved.lat.toFixed(4)}, ${resolved.lon.toFixed(4)}`;
    stop.text = stop.input.value;
    setMeta(stop, `${resolved.label} · ${formatCoordinates(resolved.lat, resolved.lon)}`);
    routeRenderer.syncMarkers(stops);

    if (phase === 'end') {
      if (stops.every((item) => item.pt)) calculate({ preserveCamera: true });
      else updateUrlParams();
    }
  }

  globe.addUpdater((dt) => {
    if (!countUp) return;
    countUp.t += dt;
    const k = Math.min(Math.max(countUp.t / 0.9, 0), 1);
    const eased = 1 - Math.pow(1 - k, 3);
    kmValEl.textContent = formatNumber(countUp.to * eased);
    if (k >= 1) countUp = null;
  });

  stops.forEach((stop) => {
    createAutocomplete({
      input: stop.input,
      listEl: document.getElementById(`list${stop.id}`),
      search: (query) => searchPlaces(query, cityIndex, getLang()),
      onPick: (item) => {
        stop.input.value = item.value;
        commitStop(stop, { fly: true });
      },
    });
  });

  stops.forEach((stop, idx) => {
    stop.row.addEventListener('pointerdown', () => setActiveIndex(idx));
    stop.row.querySelector('.pick').addEventListener('click', () => {
      setActiveIndex(idx);
      setMeta(stop, t('panel.pickHint', { id: stop.id }));
    });
    stop.input.addEventListener('focus', () => setActiveIndex(idx));
    stop.input.addEventListener('input', () => {
      stop.linkedInput = false;
      syncHint();
    });
    stop.input.addEventListener('change', () => commitStop(stop, { fly: true }));
    stop.input.addEventListener('keydown', (e) => {
      if (e.defaultPrevented) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
      }
    });
  });

  $('#btnCalc').addEventListener('click', calculate);

  $('#btnClear').addEventListener('click', () => {
    stops.forEach((stop) => {
      stop.input.value = '';
      clearStop(stop);
    });
    setActiveIndex(0);
    globe.setSpin(!reduceMotion);
  });

  $('#btnSwap').addEventListener('click', () => {
    const values = stops.map((s) => s.input.value);
    const reversed = values.slice().reverse();
    stops.forEach((stop, idx) => {
      stop.input.value = reversed[idx];
    });
    const hadRoute = routeRenderer.hasRoute();
    stops.forEach((stop) => commitStop(stop));
    if (hadRoute && stops.every((s) => s.pt)) {
      calculate();
    }
  });

  $('#btnCollapse').addEventListener('click', (e) => {
    const collapsed = panelEl.classList.toggle('collapsed');
    e.currentTarget.setAttribute('aria-expanded', String(!collapsed));
    e.currentTarget.firstElementChild.style.transform = collapsed ? 'rotate(180deg)' : '';
  });

  if (innerWidth < 640) {
    $('#btnCollapse').click();
  }

  btnShareRoute.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      shareToast.classList.add('show');
      clearTimeout(shareToastTimer);
      shareToastTimer = setTimeout(() => {
        shareToast.classList.remove('show');
      }, 2200);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  });

  function restoreFromUrl(searchString) {
    const params = new URLSearchParams(searchString || window.location.search);
    const fromVal = params.get('from');
    const toVal = params.get('to');
    const unitVal = params.get('unit');

    if (unitVal && ['km', 'mi', 'NM'].includes(unitVal)) {
      setUnit(unitVal, false);
    }

    if (fromVal && toVal) {
      stops[0].input.value = fromVal;
      stops[1].input.value = toVal;
      const okA = commitStop(stops[0]);
      const okB = commitStop(stops[1]);
      if (okA && okB) {
        calculate();
      }
    }
  }

  onLangChange(renderStopTexts);

  return {
    stops,
    calculate,
    handleGlobeClick,
    dragStopPoint,
    restoreFromUrl,
    setPoint: (slotId, resolved, options) => {
      const idx = findStopIndex(slotId);
      if (idx !== -1) setStopPoint(stops[idx], resolved, options);
    },
    getState: () =>
      Object.fromEntries(stops.map((s) => [s.id, { pt: s.pt, text: s.text }])),
  };
}
