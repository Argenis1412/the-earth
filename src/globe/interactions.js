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
 *   getDraggableMarkers?: () => THREE.Object3D[],
 *   onMarkerDrag?: (slotId: string, coords: {lat: number, lon: number} | null, phase: 'start' | 'move' | 'end') => void,
 *   poleMarkers?: THREE.Object3D[],
 * }} options
 */
export function setupInteractions({
  globe,
  world,
  tooltipEl,
  onGlobeClick,
  getDraggableMarkers = () => [],
  onMarkerDrag,
  poleMarkers = [],
}) {
  const { canvasEl, camera, earth, hlCtx, hlTex } = globe;
  const raycaster = new THREE.Raycaster();
  raycaster.params.Line.threshold = 0.02;
  const ndc = new THREE.Vector2();

  const titleHintEl = document.querySelector('#title p');
  canvasEl.addEventListener(
    'pointerdown',
    () => titleHintEl?.classList.add('is-hidden'),
    { once: true, capture: true },
  );

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
    const stopMarkers = getDraggableMarkers();
    const rawStopHit = stopMarkers.length ? raycaster.intersectObjects(stopMarkers, true)[0] || null : null;
    const stopHit =
      rawStopHit && rawStopHit.distance <= (earthHit ? earthHit.distance : Infinity)
        ? rawStopHit
        : null;
    return { earthHit, markerHit, stopHit };
  }

  const markerPole = (markerHit) => (markerHit.point.y >= 0 ? 'north' : 'south');

  function stopIdForHit(hit) {
    let object = hit?.object;
    while (object && object.userData.stopId === undefined) object = object.parent;
    return object?.userData.stopId ?? null;
  }

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
    canvasEl.classList.remove('draggable');
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
      const { earthHit, markerHit, stopHit } = cast(e);
      canvasEl.classList.toggle('draggable', Boolean(stopHit));
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
  let dragState = null;
  canvasEl.addEventListener('pointerdown', (event) => {
    downState = { x: event.clientX, y: event.clientY, t: performance.now(), button: event.button };
    if (event.button !== 0 || !onMarkerDrag) return;
    const { stopHit } = cast(event);
    const stopId = stopIdForHit(stopHit);
    if (!stopId) return;

    dragState = { pointerId: event.pointerId, stopId, coords: null };
    canvasEl.classList.remove('draggable');
    canvasEl.classList.add('dragging-marker');
    canvasEl.setPointerCapture(event.pointerId);
    onMarkerDrag(stopId, null, 'start');
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  canvasEl.addEventListener('pointermove', (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const { earthHit } = cast(event);
    if (!earthHit) return;
    dragState.coords = toLatLon(earthHit.point);
    onMarkerDrag(dragState.stopId, dragState.coords, 'move');
  }, true);

  function finishMarkerDrag(event) {
    if (!dragState || dragState.pointerId !== event.pointerId) return false;
    event.preventDefault();
    event.stopImmediatePropagation();
    const drag = dragState;
    dragState = null;
    const { earthHit } = cast(event);
    const coords = earthHit ? toLatLon(earthHit.point) : drag.coords;
    onMarkerDrag(drag.stopId, coords, 'end');
    canvasEl.classList.remove('dragging-marker');
    if (canvasEl.hasPointerCapture(event.pointerId)) {
      canvasEl.releasePointerCapture(event.pointerId);
    }
    downState = null;
    return true;
  }

  canvasEl.addEventListener('pointerup', (event) => {
    if (finishMarkerDrag(event)) return;
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
  canvasEl.addEventListener('pointercancel', finishMarkerDrag, true);

  return { hideTip };
}
