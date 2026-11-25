import * as THREE from 'three';
import { formatCoordinates } from '../geography/coordinates.js';
import { countryAt, formatContinents } from '../geography/countries.js';
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
 * }} options
 */
export function setupInteractions({ globe, world, tooltipEl, onGlobeClick }) {
  const { canvasEl, camera, earth, hlCtx, hlTex } = globe;
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();

  function pick(event) {
    const rect = canvasEl.getBoundingClientRect();
    ndc.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObject(earth, false)[0];
    return hit ? toLatLon(hit.point) : null;
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
      const coords = pick(e);
      if (!coords) {
        hideTip();
        return;
      }
      const country = countryAt(world, coords.lon, coords.lat);
      setHighlight(country);
      tooltipEl.innerHTML = country
        ? `<b>${country.name}</b><span>${formatContinents(country)} · ${formatCoordinates(coords.lat, coords.lon)}</span>`
        : `<b>Océano</b><span>${formatCoordinates(coords.lat, coords.lon)}</span>`;
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
      const coords = pick(event);
      if (coords) onGlobeClick(coords);
    }
  });

  return { hideTip };
}
