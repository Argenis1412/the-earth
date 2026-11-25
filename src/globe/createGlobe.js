import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DEG_TO_RAD, cartesianToLatLon, latLonToCartesian } from '../geography/coordinates.js';
import { drawBaseMap, drawCountryLabels, drawSpecMap } from './mapTextures.js';

const HOME = { lat: 12, lon: -48 };
const SUN_VIEW = new THREE.Vector3(-0.62, 0.5, 0.78).normalize();
const clamp01 = (x) => Math.min(Math.max(x, 0), 1);

/**
 * Converts geographic coordinates to a THREE.Vector3 on the globe.
 * @param {number} lat
 * @param {number} lon
 * @param {number} [radius=1]
 * @returns {THREE.Vector3}
 */
export function toVec(lat, lon, radius = 1) {
  const { x, y, z } = latLonToCartesian(lat, lon, radius);
  return new THREE.Vector3(x, y, z);
}

/**
 * Converts a THREE.Vector3 point on the globe surface to latitude/longitude.
 * @param {THREE.Vector3} vec
 * @returns {{lat: number, lon: number}}
 */
export function toLatLon(vec) {
  return cartesianToLatLon(vec.x, vec.y, vec.z);
}

/**
 * Creates and runs the 3D globe scene, camera, controls, atmosphere, lighting, and starfield.
 * @param {{
 *   container: HTMLElement,
 *   world: object,
 *   colors: string[],
 *   reduceMotion: boolean,
 *   spinBtn: HTMLButtonElement,
 *   resetBtn: HTMLButtonElement,
 *   onControlsStart?: () => void,
 * }} options
 */
export function createGlobe({ container, world, colors, reduceMotion, spinBtn, resetBtn, onControlsStart }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0x03050a);

  const canvasEl = renderer.domElement;
  container.appendChild(canvasEl);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 200);
  const defaultDist = () => {
    const aspect = innerWidth / innerHeight;
    return Math.min(Math.max(1.25 / (Math.tan(20 * DEG_TO_RAD) * Math.min(aspect, 1)), 3.3), 6.5);
  };
  camera.position.copy(toVec(HOME.lat, HOME.lon, defaultDist()));

  // Canvas-generated textures
  const maxTex = renderer.capabilities.maxTextureSize;
  const texWidth = maxTex >= 4096 ? 4096 : 2048;
  const anisotropy = renderer.capabilities.getMaxAnisotropy();

  const makeTexture = (canvas, srgb = true) => {
    const tex = new THREE.CanvasTexture(canvas);
    if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = anisotropy;
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  };

  const mapTex = makeTexture(drawBaseMap(world, colors, texWidth, texWidth / 2));
  const specTex = makeTexture(drawSpecMap(world, 1024, 512), false);
  const labelTex = makeTexture(drawCountryLabels(world, texWidth, texWidth / 2));

  const hlCv = Object.assign(document.createElement('canvas'), { width: 2048, height: 1024 });
  const hlCtx = hlCv.getContext('2d');
  const hlTex = makeTexture(hlCv);

  // Earth sphere
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 128, 96),
    new THREE.MeshPhongMaterial({
      map: mapTex,
      specularMap: specTex,
      specular: new THREE.Color(0x2b4259),
      shininess: 90,
    }),
  );
  scene.add(earth);

  function createPoleMarker(label, lat) {
    const group = new THREE.Group();

    const pin = new THREE.Mesh(
      new THREE.SphereGeometry(0.015, 20, 16),
      new THREE.MeshPhongMaterial({
        color: 0xe9b35f,
        shininess: 120,
        specular: new THREE.Color(0xffffff),
      }),
    );
    group.add(pin);

    const stem = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0.055),
      ]),
      new THREE.LineBasicMaterial({ color: 0xe9b35f }),
    );
    group.add(stem);

    const cv = Object.assign(document.createElement('canvas'), {
      width: 128,
      height: 128,
    });
    const ctx = cv.getContext('2d');
    ctx.fillStyle = 'rgba(13, 19, 31, 0.85)';
    ctx.beginPath();
    ctx.arc(64, 64, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(233, 179, 95, 0.8)';
    ctx.stroke();
    ctx.fillStyle = '#e9b35f';
    ctx.font = '700 64px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 64, 68);

    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: tex, transparent: true }),
    );
    sprite.scale.set(0.07, 0.07, 1);
    sprite.position.z = 0.085;
    group.add(sprite);

    const outward = toVec(lat, 0, 1).normalize();
    group.position.copy(outward).multiplyScalar(1.002);
    group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), outward);
    return group;
  }

  const northPoleMarker = createPoleMarker('N', 90);
  const southPoleMarker = createPoleMarker('S', -90);
  scene.add(northPoleMarker, southPoleMarker);

  const addOverlay = (tex, radius, MaterialClass, extra) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 96, 64),
      new MaterialClass({ map: tex, transparent: true, depthWrite: false, ...extra }),
    );
    scene.add(mesh);
    return mesh;
  };

  const labels = addOverlay(labelTex, 1.0012, THREE.MeshLambertMaterial, { opacity: 0 });
  addOverlay(hlTex, 1.0006, THREE.MeshBasicMaterial, {});

  // Atmosphere: translucent shell + Fresnel rim shader
  scene.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(1.02, 96, 64),
      new THREE.MeshLambertMaterial({ color: 0x5aaaff, transparent: true, opacity: 0.1, depthWrite: false }),
    ),
  );

  scene.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(1.14, 96, 64),
      new THREE.ShaderMaterial({
        uniforms: { uSun: { value: SUN_VIEW } },
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader:
          'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader: `uniform vec3 uSun; varying vec3 vN;
          void main(){
            float rim = pow(max(0.0, 0.8 - dot(vN, vec3(0.0, 0.0, 1.0))), 8.0) * 0.13;
            float lit = 0.35 + 0.65 * clamp(dot(vN, uSun) * 0.5 + 0.5, 0.0, 1.0);
            vec3 c = mix(vec3(0.16, 0.40, 0.95), vec3(0.55, 0.80, 1.0), lit);
            gl_FragColor = vec4(c * rim * lit * 1.5, 1.0);
          }`,
      }),
    ),
  );

  // Lights
  scene.add(new THREE.AmbientLight(0x8fa8d0, 0.95));
  const sun = new THREE.DirectionalLight(0xfff1dc, 3.3);
  scene.add(sun);

  // Starfields
  const addStars = (count, size, opacity) => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1;
      const a = Math.random() * Math.PI * 2;
      const r = 60 + Math.random() * 40;
      const s = Math.sqrt(1 - u * u);
      positions.set([r * s * Math.cos(a), r * u, r * s * Math.sin(a)], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    scene.add(
      new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          size: size * renderer.getPixelRatio(),
          sizeAttenuation: false,
          color: 0xdfe8ff,
          transparent: true,
          opacity,
          depthWrite: false,
        }),
      ),
    );
  };
  addStars(1400, 1.1, 0.7);
  addStars(250, 2, 0.9);

  // OrbitControls
  const controls = new OrbitControls(camera, canvasEl);
  Object.assign(controls, {
    enableDamping: true,
    dampingFactor: 0.07,
    enablePan: false,
    minDistance: 1.3,
    maxDistance: 7,
    zoomSpeed: 0.8,
    autoRotateSpeed: 0.45,
  });

  let spinWanted = !reduceMotion;
  let routeActive = false;
  let idleTimer = 0;
  let flight = null;

  function setSpin(on) {
    spinWanted = on;
    controls.autoRotate = on;
    spinBtn.setAttribute('aria-pressed', String(on));
  }

  function setRouteActive(active) {
    routeActive = active;
  }

  function flyTo(direction, distance, duration = 1.5) {
    flight = {
      d0: camera.position.clone().normalize(),
      r0: camera.position.length(),
      d1: direction.clone().normalize(),
      r1: distance,
      t: 0,
      dur: duration,
    };
  }

  setSpin(spinWanted);
  spinBtn.addEventListener('click', () => setSpin(!spinWanted));
  resetBtn.addEventListener('click', () => flyTo(toVec(HOME.lat, HOME.lon), defaultDist()));

  controls.addEventListener('start', () => {
    flight = null;
    controls.autoRotate = false;
    clearTimeout(idleTimer);
    canvasEl.classList.add('grabbing');
    onControlsStart?.();
  });

  controls.addEventListener('end', () => {
    canvasEl.classList.remove('grabbing');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (spinWanted && !routeActive) controls.autoRotate = true;
    }, 2500);
  });

  // Animation loop
  const updaters = [];
  const addUpdater = (fn) => updaters.push(fn);

  addUpdater((dt) => {
    if (!flight) return;
    flight.t += dt;
    const k = clamp01(flight.t / flight.dur);
    const eased = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const q = new THREE.Quaternion().setFromUnitVectors(flight.d0, flight.d1);
    const qi = new THREE.Quaternion().slerp(q, eased);
    camera.position.copy(
      flight.d0
        .clone()
        .applyQuaternion(qi)
        .multiplyScalar(flight.r0 + (flight.r1 - flight.r0) * eased),
    );
    camera.lookAt(0, 0, 0);
    if (k >= 1) flight = null;
  });

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), 0.5);
    const elapsed = clock.elapsedTime;
    updaters.forEach((fn) => fn(dt, elapsed));

    const dist = camera.position.length();
    controls.rotateSpeed = 0.25 + 0.75 * clamp01((dist - 1.3) / 2);
    const labelOpacity = clamp01((2.75 - dist) / 0.75);
    labels.material.opacity = labelOpacity;
    labels.visible = labelOpacity > 0.01;

    sun.position.copy(SUN_VIEW).applyQuaternion(camera.quaternion).multiplyScalar(10);
    controls.update();
    renderer.render(scene, camera);
  });

  function resize() {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    if (innerWidth > 900) {
      camera.setViewOffset(innerWidth, innerHeight, -110, 0, innerWidth, innerHeight);
    } else {
      camera.clearViewOffset();
    }
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize);
  resize();

  function dispose() {
    renderer.setAnimationLoop(null);
    clearTimeout(idleTimer);
    removeEventListener('resize', resize);

    mapTex.dispose();
    specTex.dispose();
    labelTex.dispose();
    hlTex.dispose();

    scene.traverse((obj) => {
      obj.geometry?.dispose();
      if (Array.isArray(obj.material)) {
        obj.material.forEach((m) => {
          m.map?.dispose();
          m.dispose();
        });
      } else if (obj.material) {
        obj.material.map?.dispose();
        obj.material.dispose();
      }
    });

    controls.dispose();
    renderer.dispose();
    if (canvasEl.parentElement) {
      canvasEl.parentElement.removeChild(canvasEl);
    }
  }

  return {
    THREE,
    scene,
    camera,
    controls,
    renderer,
    canvasEl,
    earth,
    hlCtx,
    hlTex,
    setSpin,
    setRouteActive,
    flyTo,
    addUpdater,
    dispose,
    northPoleMarker,
    southPoleMarker,
  };
}
