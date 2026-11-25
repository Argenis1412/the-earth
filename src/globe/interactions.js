import * as THREE from 'three';
import { formatCoordinates } from '../geography/coordinates.js';
import { countryAt, formatContinents } from '../geography/countries.js';
import { poleAt } from '../geography/poles.js';
import { getLang, t } from '../i18n/index.js';
import { countryName } from '../i18n/names.js';
import { toLatLon } from './createGlobe.js';
import { drawCountryPath } from './mapTextures.js';

const projectHighlight = (lon, lat) => [((lon + 180) / 360) * 2048, ((90 - lat) / 180) * 1024];

/**
 * Sets up pointer raycasting, country hover highlighting, tooltip, and click-to-pick on the globe.
 * @param {{
 *   globe: ReturnType<import('./createGlobe.js').createGlobe>,
 *   world: object,
 *   tooltipEl: HTMLElement,
 *   onGlobeClick: (coords: {lat: number, lon: number}) => void,
 *   poleMarkers?: THREE.Object3D[],
 * }} options
 */
export function setupInteractions({ globe, world, tooltipEl, onGlobeClick, poleMarkers = [] }) {
  const { canvasEl, camera, earth, hlCtx, hlTex } = globe;
  const raycaster = new THREE.Raycaster();
  raycaster.params.Line.threshold = 0.02;
  const ndc = new THREE.Vector2();

  function cast(event) {
    const rect = canvasEl.getBoundingClientRect();
    ndc.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
    const earthHit = raycaster.intersectObject(earth, false)[0] || null;
    const rawMarkerHit = poleMarkers.length
      ? raycaster.intersectObjects(poleMarkers, true)[0] || null
      : null;
    const markerHit =
      rawMarkerHit && rawMarkerHit.distance <= (earthHit ? earthHit.distance : Infinity)
        ? rawMarkerHit
        : null;
    return { earthHit, markerHit };
  }

  const markerPole = (markerHit) => (markerHit.point.y >= 0 ? 'north' : 'south');

  let hoveredCountry = null;

  function setHighlight(country) {
    if (country === hoveredCountry) return;
    hoveredCountry = country;
    hlCtx.clearRect(0, 0, 2048, 1024);
    if (country) {
      drawCountryPath(hlCtx, country, projectHighlight);
      hlCtx.fillStyle = 'rgba(255,255,255,.30)';
      hlCtx.fill('evenodd');
    }
    hlTex.needsUpdate = true;
  }

  function hideTip() {
    tooltipEl.style.opacity = '0';
    setHighlight(null);
    canvasEl.classList.remove('pointing');
  }

  let moveRaf = 0;
  let lastMove = null;

  canvasEl.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || event.buttons) return;
    lastMove = event;
    if (moveRaf) return;
    moveRaf = requestAnimationFrame(() => {
      moveRaf = 0;
      const e = lastMove;
      const { earthHit, markerHit } = cast(e);
      const coords = earthHit ? toLatLon(earthHit.point) : null;
      const poleId = markerHit
        ? markerPole(markerHit)
        : coords
          ? poleAt(coords.lat)
          : null;

      if (poleId) {
        setHighlight(null);
        tooltipEl.innerHTML = `<b>${t(`pole.${poleId}.title`)}</b><span>${t(`pole.${poleId}.sub`)}</span>`;
      } else if (coords) {
        const country = countryAt(world, coords.lon, coords.lat);
        setHighlight(country);
        const lang = getLang();
        tooltipEl.innerHTML = country
          ? `<b>${countryName(country.name, lang)}</b><span>${formatContinents(country, lang)} · ${formatCoordinates(coords.lat, coords.lon)}</span>`
          : `<b>${t('place.ocean')}</b><span>${formatCoordinates(coords.lat, coords.lon)}</span>`;
      } else {
        hideTip();
        return;
      }

      tooltipEl.style.left = `${e.clientX}px`;
      tooltipEl.style.top = `${e.clientY}px`;
      tooltipEl.style.opacity = '1';
      canvasEl.classList.add('pointing');
    });
  });

  canvasEl.addEventListener('pointerleave', hideTip);

  let downState = null;
  canvasEl.addEventListener('pointerdown', (event) => {
    downState = { x: event.clientX, y: event.clientY, t: performance.now(), button: event.button };
  });

  canvasEl.addEventListener('pointerup', (event) => {
    if (!downState || downState.button !== 0) return;
    const moved = Math.hypot(event.clientX - downState.x, event.clientY - downState.y);
    const dt = performance.now() - downState.t;
    downState = null;
    if (moved < 6 && dt < 600) {
      const { earthHit, markerHit } = cast(event);
      const coords = markerHit
        ? { lat: markerPole(markerHit) === 'north' ? 90 : -90, lon: 0 }
        : earthHit
          ? toLatLon(earthHit.point)
          : null;
      if (coords) onGlobeClick(coords);
    }
  });

  return { hideTip };
}
