import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { getLang, t } from '../i18n/index.js';
import { BODY_BY_ID, ORBITING_IDS, bodyVisualRadius, poleDirection } from './bodies.js';
import {
  MOON_MEAN_DISTANCE_KM,
  centuriesSinceJ2000,
  eclipticToScene,
  heliocentricPosition,
  moonGeocentricPosition,
  moonOrbitPoints,
  orbitPoints,
} from './kepler.js';
import { createPlanetMaterial, setPlanetTexture } from './planetMaterial.js';
import { spinRate } from './rotation.js';
import { MOON_VISUAL_ORBIT, compressVector } from './scale.js';
import { paintBodyTexture, paintGlowTexture, paintRingTexture } from './textures.js';

/** Distance from the Earth (scene units) beyond which the camera frames the whole system. */
export const OVERVIEW_DISTANCE = 700;
/** The Earth's own orbit line is cut open this far around the Earth so it doesn't skewer the globe. */
const EARTH_ORBIT_GAP = 3;
const ORBIT_COLOR = {
  mercury: '#a39c94',
  venus: '#e6c27a',
  earth: '#6fa8ff',
  mars: '#e0774c',
  jupiter: '#e3bd90',
  saturn: '#eedaa0',
  uranus: '#8fd6dc',
  neptune: '#5f85f0',
  pluto: '#c7a98a',
};
/** Texture build order: the most visible bodies first. */
const TEXTURE_ORDER = ['sun', 'moon', 'mars', 'jupiter', 'saturn', 'mercury', 'venus', 'uranus', 'neptune', 'pluto'];

/** Orbit lines are invisible up close (so the default Earth view stays clean) and fade in over this range. */
const LINES_FADE_FROM = 8;
const LINES_FADE_TO = 18;
/** A label is hidden once the camera is farther than this many times the body's distance from the Sun. */
const LABEL_FAR_FACTOR = 20;
const UP = new THREE.Vector3(0, 1, 0);
const toV3 = ({ x, y, z }) => new THREE.Vector3(x, y, z);
const clamp01 = (x) => Math.min(Math.max(x, 0), 1);
const smoothstep = (a, b, x) => {
  const k = clamp01((x - a) / (b - a));
  return k * k * (3 - 2 * k);
};

function drawLabel(canvas, text) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '600 34px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 7;
  ctx.strokeStyle = 'rgba(3, 5, 10, 0.92)';
  ctx.strokeText(text, canvas.width / 2, canvas.height / 2 + 2);
  ctx.fillStyle = '#e8edf5';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
}

/**
 * Builds the Sun, the eight planets, Pluto and the Moon around the existing Earth.
 *
 * The Earth stays at the scene origin; everything else lives in a `system` group
 * offset by minus the Earth's heliocentric position, so the default view is
 * untouched and nothing needs large coordinates.
 *
 * @param {{
 *   globe: ReturnType<import('../globe/createGlobe.js').createGlobe>,
 *   date?: Date,
 *   reduceMotion?: boolean,
 * }} options
 */
export function createSolarSystem({ globe, date = new Date(), reduceMotion = false }) {
  const { scene, camera, renderer, addUpdater } = globe;
  const T = centuriesSinceJ2000(date);
  const anisotropy = renderer.capabilities.getMaxAnisotropy();

  // --- Positions (scene frame, compressed) ---------------------------------
  const helio = {};
  for (const id of ORBITING_IDS) {
    helio[id] = toV3(compressVector(eclipticToScene(heliocentricPosition(id, T))));
  }
  const earthPos = helio.earth.clone();

  const system = new THREE.Group();
  system.name = 'solar-system';
  system.position.copy(earthPos).negate();
  scene.add(system);

  /** Unit vector from the Earth towards the Sun. */
  const sunDirection = system.position.clone().normalize();

  // --- Helpers ------------------------------------------------------------
  const disposables = [];
  const lineMaterials = [];
  const lines = [];
  const bodies = new Map();
  const labels = [];

  function addLine(points, color, opacity, parent, width = 1.4) {
    const flat = [];
    for (const p of points) flat.push(p.x, p.y, p.z);
    const geometry = new LineGeometry();
    geometry.setPositions(flat);
    // Opaque and pre-dimmed: translucent fat lines add up at every joint and look beaded.
    const base = new THREE.Color(color).multiplyScalar(opacity);
    const material = new LineMaterial({ color: base.clone(), linewidth: width });
    material.resolution.set(innerWidth, innerHeight);
    const line = new Line2(geometry, material);
    line.visible = false;
    parent.add(line);
    lineMaterials.push(material);
    lines.push({ line, material, base });
    disposables.push(geometry, material);
    return line;
  }

  function addLabel(id, parent, radius, position, farLimit = Infinity) {
    const canvas = Object.assign(document.createElement('canvas'), { width: 256, height: 64 });
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      sizeAttenuation: false,
      opacity: 0,
    });
    const sprite = new THREE.Sprite(material);
    sprite.center.set(0.5, 0);
    sprite.scale.set(0.08, 0.02, 1);
    sprite.position.copy(position ?? new THREE.Vector3(0, radius * 1.25, 0));
    sprite.renderOrder = 10;
    sprite.visible = false;
    parent.add(sprite);
    disposables.push(texture, material);
    const label = { id, sprite, canvas, texture, radius, farLimit };
    labels.push(label);
    drawLabel(canvas, t(`solar.${id}`));
    texture.needsUpdate = true;
    return label;
  }

  /** Group → tilt (pole direction) → spinning mesh. */
  function addBody(id, parent, position) {
    const def = BODY_BY_ID[id];
    const radius = bodyVisualRadius(id);
    const group = new THREE.Group();
    group.position.copy(position);
    parent.add(group);

    const tilt = new THREE.Group();
    tilt.quaternion.setFromUnitVectors(UP, toV3(poleDirection(id)));
    group.add(tilt);

    const material =
      id === 'sun' ? new THREE.MeshBasicMaterial({ color: def.color }) : createPlanetMaterial(def.color);
    const geometry = new THREE.SphereGeometry(radius, 64, 48);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = id;
    tilt.add(mesh);
    disposables.push(geometry, material);

    const body = {
      id,
      group,
      tilt,
      mesh,
      material,
      radius,
      spin: reduceMotion || def.rotationHours == null ? 0 : spinRate(def.rotationHours),
    };
    bodies.set(id, body);
    addLabel(id, group, radius, undefined, id === 'sun' ? Infinity : LABEL_FAR_FACTOR * position.length());
    return body;
  }

  // --- Sun ----------------------------------------------------------------
  const sun = addBody('sun', system, new THREE.Vector3(0, 0, 0));
  const glowTexture = new THREE.CanvasTexture(paintGlowTexture());
  glowTexture.colorSpace = THREE.SRGBColorSpace;
  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  glow.scale.setScalar(sun.radius * 2 * 3.4);
  sun.group.add(glow);
  disposables.push(glowTexture, glow.material);

  // --- Planets (the Earth is the existing globe) --------------------------
  for (const id of ORBITING_IDS) {
    if (id === 'earth') continue;
    addBody(id, system, helio[id]);
  }

  // Saturn's rings live in the equatorial plane of its tilt group.
  {
    const saturn = bodies.get('saturn');
    const inner = saturn.radius * 1.24;
    const outer = saturn.radius * 2.27;
    const geometry = new THREE.RingGeometry(inner, outer, 160, 1);
    const pos = geometry.attributes.position;
    const uv = geometry.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getY(i));
      uv.setXY(i, (r - inner) / (outer - inner), 0.5);
    }
    const texture = new THREE.CanvasTexture(paintRingTexture());
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = anisotropy;
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const rings = new THREE.Mesh(geometry, material);
    rings.rotation.x = -Math.PI / 2;
    saturn.tilt.add(rings);
    disposables.push(geometry, texture, material);
  }

  // --- Orbit lines --------------------------------------------------------
  for (const id of ORBITING_IDS) {
    let points = orbitPoints(id, T, 256).map((p) => toV3(compressVector(eclipticToScene(p))));
    if (id === 'earth') {
      points = points.slice(0, -1);
      let nearest = 0;
      points.forEach((p, i) => {
        if (p.distanceTo(earthPos) < points[nearest].distanceTo(earthPos)) nearest = i;
      });
      points = points.slice(nearest).concat(points.slice(0, nearest));
      let start = 0;
      while (start < points.length && points[start].distanceTo(earthPos) < EARTH_ORBIT_GAP) start++;
      let end = points.length - 1;
      while (end > start && points[end].distanceTo(earthPos) < EARTH_ORBIT_GAP) end--;
      points = points.slice(start, end + 1);
    }
    addLine(points, ORBIT_COLOR[id], id === 'earth' ? 0.6 : 0.5, system);
  }

  // --- Earth label (the globe itself is not ours to modify) ----------------
  addLabel('earth', scene, 1, new THREE.Vector3(0, 1.3, 0));

  // --- Moon (geocentric, so it hangs off the scene, not the system) --------
  const moonRadius = bodyVisualRadius('moon');
  const moonGroup = new THREE.Group();
  scene.add(moonGroup);
  const moonMaterial = createPlanetMaterial(BODY_BY_ID.moon.color);
  const moonGeometry = new THREE.SphereGeometry(moonRadius, 48, 32);
  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMesh.name = 'moon';
  moonGroup.add(moonMesh);
  disposables.push(moonGeometry, moonMaterial);
  addLabel('moon', moonGroup, moonRadius, undefined, 150);

  const km2scene = MOON_VISUAL_ORBIT / MOON_MEAN_DISTANCE_KM;
  moonGroup.position.copy(toV3(eclipticToScene(moonGeocentricPosition(T)))).multiplyScalar(km2scene);
  addLine(
    moonOrbitPoints(T, 128).map((p) => toV3(eclipticToScene(p)).multiplyScalar(km2scene)),
    '#9aa3b5',
    0.35,
    scene,
    1.1,
  );
  bodies.set('moon', { id: 'moon', group: moonGroup, mesh: moonMesh, material: moonMaterial, radius: moonRadius, spin: 0 });

  /** Tidal lock: the near-side meridian (+Z of the mesh) always faces the Earth. */
  const moonPole = toV3(poleDirection('moon'));
  const basisX = new THREE.Vector3();
  const basisZ = new THREE.Vector3();
  const basisMatrix = new THREE.Matrix4();
  function orientMoon() {
    basisZ.copy(moonGroup.position).negate().normalize();
    basisZ.addScaledVector(moonPole, -basisZ.dot(moonPole)).normalize();
    basisX.crossVectors(moonPole, basisZ).normalize();
    basisMatrix.makeBasis(basisX, moonPole, basisZ);
    moonMesh.quaternion.setFromRotationMatrix(basisMatrix);
  }
  orientMoon();

  // --- Lighting direction per body ----------------------------------------
  function updateSunDirections() {
    for (const body of bodies.values()) {
      if (!body.material.uniforms) continue;
      const dir = body.material.uniforms.uSunDir.value;
      if (body.id === 'moon') dir.copy(system.position).sub(moonGroup.position);
      else dir.copy(body.group.position).negate();
      dir.normalize();
    }
  }
  updateSunDirections();

  // --- Per-frame update ---------------------------------------------------
  const worldPos = new THREE.Vector3();
  addUpdater((dt) => {
    for (const body of bodies.values()) {
      if (body.spin) body.mesh.rotation.y += body.spin * dt;
    }
    const fade = smoothstep(LINES_FADE_FROM, LINES_FADE_TO, camera.position.length());
    for (const { line, material, base } of lines) {
      line.visible = fade > 0.01;
      if (line.visible) material.color.copy(base).multiplyScalar(fade);
    }
    for (const label of labels) {
      label.sprite.getWorldPosition(worldPos);
      const dist = camera.position.distanceTo(worldPos);
      const near = clamp01((dist - 8 * label.radius) / (4 * label.radius));
      const far = Number.isFinite(label.farLimit)
        ? clamp01((label.farLimit * 1.25 - dist) / (label.farLimit * 0.25))
        : 1;
      const opacity = near * far;
      label.sprite.material.opacity = opacity;
      label.sprite.visible = opacity > 0.01;
    }
  });

  // --- Progressive texture generation -------------------------------------
  let disposed = false;
  let queue = 0;
  function buildNextTexture() {
    if (disposed || queue >= TEXTURE_ORDER.length) return;
    const id = TEXTURE_ORDER[queue++];
    try {
      const canvas = paintBodyTexture(id);
      const body = bodies.get(id);
      if (canvas && body) {
        if (id === 'sun') {
          const tex = new THREE.CanvasTexture(canvas);
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = anisotropy;
          tex.wrapS = THREE.RepeatWrapping;
          body.material.map = tex;
          body.material.color.set(0xffffff);
          body.material.needsUpdate = true;
        } else {
          setPlanetTexture(body.material, canvas, anisotropy);
        }
      }
    } catch (error) {
      console.error(`Texture for ${id} failed`, error);
    }
    setTimeout(buildNextTexture, 40);
  }
  setTimeout(buildNextTexture, 300);

  // --- Language & resize --------------------------------------------------
  function setLanguage(lang = getLang()) {
    for (const label of labels) {
      drawLabel(label.canvas, t(`solar.${label.id}`, {}, lang));
      label.texture.needsUpdate = true;
    }
  }
  const onResize = () => lineMaterials.forEach((m) => m.resolution.set(innerWidth, innerHeight));
  addEventListener('resize', onResize);

  // --- Camera framing for the "Solar system" button -----------------------
  const eclipticNormal = toV3(eclipticToScene({ x: 0, y: 0, z: 1 }));
  const side = new THREE.Vector3().crossVectors(eclipticNormal, sunDirection).normalize();
  const elevation = (35 * Math.PI) / 180;
  const overviewDirection = eclipticNormal
    .clone()
    .multiplyScalar(Math.sin(elevation))
    .addScaledVector(side, Math.cos(elevation))
    .normalize();

  function dispose() {
    disposed = true;
    removeEventListener('resize', onResize);
    scene.remove(system, moonGroup);
    for (const label of labels) label.sprite.parent?.remove(label.sprite);
    for (const item of disposables) item.dispose?.();
    bodies.forEach((b) => b.material.uniforms?.uMap.value.dispose?.());
  }

  return {
    system,
    bodies,
    date,
    sunDirection,
    overviewDirection,
    overviewDistance: OVERVIEW_DISTANCE,
    setLanguage,
    dispose,
  };
}
