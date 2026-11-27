/**
 * Procedural planet textures. Noise is sampled on the sphere in 3D, so maps tile
 * seamlessly and don't pinch at the poles. Everything is deterministic (seeded).
 * The mapping matches THREE.SphereGeometry: u = 0.5 → +X, u = 0.25 → +Z, v = 0 → north.
 */

function hash3(ix, iy, iz, seed) {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(iz, 2147483629) ^ Math.imul(seed, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function noise3(x, y, z, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const fx = x - xi;
  const fy = y - yi;
  const fz = z - zi;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const w = fz * fz * (3 - 2 * fz);
  const c = (dx, dy, dz) => hash3(xi + dx, yi + dy, zi + dz, seed);
  const x00 = c(0, 0, 0) + (c(1, 0, 0) - c(0, 0, 0)) * u;
  const x10 = c(0, 1, 0) + (c(1, 1, 0) - c(0, 1, 0)) * u;
  const x01 = c(0, 0, 1) + (c(1, 0, 1) - c(0, 0, 1)) * u;
  const x11 = c(0, 1, 1) + (c(1, 1, 1) - c(0, 1, 1)) * u;
  const y0 = x00 + (x10 - x00) * v;
  const y1 = x01 + (x11 - x01) * v;
  return y0 + (y1 - y0) * w;
}

/** Fractal noise in [0, 1]. */
function fbm(x, y, z, seed, octaves = 4) {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise3(x * freq, y * freq, z * freq, seed + i * 17);
    norm += amp;
    freq *= 2;
    amp *= 0.5;
  }
  return sum / norm;
}

const clamp01 = (x) => Math.min(Math.max(x, 0), 1);
const smoothstep = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fills a canvas pixel by pixel from f(dirX, dirY, dirZ, lat, lon) → [r, g, b].
 * lat/lon are in radians (lat +π/2 at the north pole).
 */
function paint(width, height, f) {
  const canvas = Object.assign(document.createElement('canvas'), { width, height });
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(width, height);
  const cosPhi = new Float32Array(width);
  const sinPhi = new Float32Array(width);
  for (let i = 0; i < width; i++) {
    const phi = ((i + 0.5) / width) * 2 * Math.PI;
    cosPhi[i] = Math.cos(phi);
    sinPhi[i] = Math.sin(phi);
  }
  for (let j = 0; j < height; j++) {
    const theta = ((j + 0.5) / height) * Math.PI;
    const st = Math.sin(theta);
    const ct = Math.cos(theta);
    const lat = Math.PI / 2 - theta;
    for (let i = 0; i < width; i++) {
      const [r, g, b] = f(-cosPhi[i] * st, ct, sinPhi[i] * st, lat, ((i + 0.5) / width) * 2 * Math.PI);
      const k = (j * width + i) * 4;
      img.data[k] = r;
      img.data[k + 1] = g;
      img.data[k + 2] = b;
      img.data[k + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/** Draws crater discs onto an equirectangular canvas (wrapping across the seam). */
function craters(canvas, { count, seed, minR, maxR, dark = 0.28, rim = 0.18 }) {
  const ctx = canvas.getContext('2d');
  const { width: W, height: H } = canvas;
  const rand = mulberry32(seed);
  for (let n = 0; n < count; n++) {
    const lat = Math.asin(rand() * 2 - 1);
    const x = rand() * W;
    const y = (0.5 - lat / Math.PI) * H;
    const r = minR + (maxR - minR) * rand() ** 3;
    const squeeze = 1 / Math.max(Math.cos(lat), 0.25);
    for (const dx of [-W, 0, W]) {
      const cx = x + dx;
      if (cx + r * squeeze < 0 || cx - r * squeeze > W) continue;
      ctx.save();
      ctx.translate(cx, y);
      ctx.scale(squeeze, 1);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0, `rgba(0,0,0,${dark})`);
      g.addColorStop(0.78, `rgba(0,0,0,${dark * 0.4})`);
      g.addColorStop(0.9, `rgba(255,255,255,${rim})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

/** Latitude-band texture shared by the gas and ice giants. */
function banded({ w, h, seed, palette, bands, turbulence, stretch = 2.2, tint }) {
  return paint(w, h, (x, y, z) => {
    const warp = (fbm(x * 3, y * 7, z * 3, seed, 4) - 0.5) * turbulence;
    const t = y * bands + warp;
    const s = 0.5 + 0.5 * Math.sin(t * Math.PI) * 0.7 + 0.5 * (fbm(x * stretch, y * bands * 0.9, z * stretch, seed + 9, 3) - 0.5);
    const idx = clamp01(s) * (palette.length - 1);
    const i = Math.min(Math.floor(idx), palette.length - 2);
    let c = mix(palette[i], palette[i + 1], idx - i);
    if (tint) c = tint(c, x, y, z);
    return c;
  });
}

const PAINTERS = {
  sun: () =>
    paint(1024, 512, (x, y, z) => {
      const cells = fbm(x * 14, y * 14, z * 14, 3, 3);
      const flow = fbm(x * 4, y * 4, z * 4, 8, 3);
      const t = clamp01(0.35 + cells * 0.75 + (flow - 0.5) * 0.3);
      return mix(hex('#e8620c'), hex('#ffe9a0'), smoothstep(0.15, 0.95, t));
    }),

  mercury: () => {
    const base = paint(512, 256, (x, y, z) => {
      const n = fbm(x * 5, y * 5, z * 5, 11, 5);
      return mix(hex('#6f6a66'), hex('#b3aba2'), smoothstep(0.25, 0.8, n));
    });
    craters(base, { count: 420, seed: 5, minR: 2, maxR: 20 });
    return base;
  },

  venus: () =>
    paint(512, 256, (x, y, z) => {
      const warp = fbm(x * 2, y * 2, z * 2, 21, 3) * 2.2;
      const n = fbm(x * 2.2 + warp, y * 6 + warp, z * 2.2 - warp, 22, 5);
      return mix(hex('#c99a52'), hex('#f3dca2'), smoothstep(0.2, 0.85, n));
    }),

  mars: () => {
    const base = paint(1024, 512, (x, y, z) => {
      const big = fbm(x * 2.2, y * 2.2, z * 2.2, 31, 5);
      const small = fbm(x * 9, y * 9, z * 9, 33, 4);
      let c = mix(hex('#c5683c'), hex('#8c4a2c'), smoothstep(0.42, 0.62, big));
      c = mix(c, hex('#e1a06e'), smoothstep(0.55, 0.9, small) * 0.45);
      const cap = smoothstep(0.9, 0.96, Math.abs(y) + (small - 0.5) * 0.06);
      return mix(c, hex('#f4f1ec'), cap);
    });
    craters(base, { count: 160, seed: 7, minR: 2, maxR: 14, dark: 0.2, rim: 0.1 });
    return base;
  },

  jupiter: () => {
    const canvas = banded({
      w: 1024,
      h: 512,
      seed: 41,
      bands: 9,
      turbulence: 0.9,
      palette: [hex('#7e5a3e'), hex('#b98b62'), hex('#e9d6b6'), hex('#c4936a'), hex('#f1e3c7'), hex('#a8764f'), hex('#d9bd94')],
    });
    // Great Red Spot, ~22°S
    const ctx = canvas.getContext('2d');
    const gx = canvas.width * 0.62;
    const gy = canvas.height * (0.5 + 22 / 180);
    const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 46);
    g.addColorStop(0, 'rgba(190,78,52,0.95)');
    g.addColorStop(0.65, 'rgba(205,110,80,0.7)');
    g.addColorStop(1, 'rgba(205,110,80,0)');
    ctx.save();
    ctx.translate(gx, gy);
    ctx.scale(1.5, 0.8);
    ctx.translate(-gx, -gy);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(gx, gy, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return canvas;
  },

  saturn: () =>
    banded({
      w: 1024,
      h: 512,
      seed: 51,
      bands: 7,
      turbulence: 0.35,
      palette: [hex('#b89a64'), hex('#dcc48c'), hex('#efdfb2'), hex('#cdb078'), hex('#e6d3a0')],
    }),

  uranus: () =>
    banded({
      w: 512,
      h: 256,
      seed: 61,
      bands: 5,
      turbulence: 0.25,
      palette: [hex('#7ec8cf'), hex('#9adde1'), hex('#8ed2d8'), hex('#a9e4e6')],
    }),

  neptune: () => {
    const canvas = banded({
      w: 512,
      h: 256,
      seed: 71,
      bands: 6,
      turbulence: 0.7,
      palette: [hex('#2f55cf'), hex('#4573e8'), hex('#3560d8'), hex('#6d97f2')],
    });
    const ctx = canvas.getContext('2d');
    const x = canvas.width * 0.3;
    const y = canvas.height * (0.5 + 20 / 180);
    const g = ctx.createRadialGradient(x, y, 0, x, y, 20);
    g.addColorStop(0, 'rgba(20,35,110,0.85)');
    g.addColorStop(1, 'rgba(20,35,110,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    return canvas;
  },

  pluto: () => {
    const canvas = paint(512, 256, (x, y, z) => {
      const n = fbm(x * 4, y * 4, z * 4, 81, 5);
      let c = mix(hex('#6f5340'), hex('#d1b49a'), smoothstep(0.25, 0.8, n));
      // Tombaugh Regio: the bright "heart", ~20°N, 180°E
      const lat = Math.asin(y);
      const lon = Math.atan2(z, -x);
      const d = Math.hypot((lat - 0.3) * 1.6, (Math.abs(lon - Math.PI) - 0.2) * 1.1);
      c = mix(c, hex('#f2e6d6'), smoothstep(0.42, 0.28, d) * 0.9);
      return c;
    });
    return canvas;
  },

  moon: () => {
    const base = paint(1024, 512, (x, y, z) => {
      const n = fbm(x * 6, y * 6, z * 6, 91, 5);
      let c = mix(hex('#7d7d80'), hex('#c4c2bd'), smoothstep(0.25, 0.8, n));
      // Maria cluster on the near side (+Z)
      const maria = fbm(x * 2.4 + 5, y * 2.4, z * 2.4, 93, 4);
      const near = smoothstep(-0.1, 0.55, z) * smoothstep(0.95, 0.4, Math.abs(y));
      c = mix(c, hex('#4a4b50'), smoothstep(0.52, 0.64, maria) * near * 0.85);
      return c;
    });
    craters(base, { count: 650, seed: 3, minR: 1.5, maxR: 22, dark: 0.22, rim: 0.2 });
    return base;
  },
};

/**
 * Creates the canvas for a body, or null when the id has no painter.
 * @param {string} id
 * @returns {HTMLCanvasElement | null}
 */
export function paintBodyTexture(id) {
  return PAINTERS[id]?.() ?? null;
}

/** 1-D texture for Saturn's rings: x runs from the inner to the outer edge. */
export function paintRingTexture() {
  const width = 1024;
  const canvas = Object.assign(document.createElement('canvas'), { width, height: 4 });
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(width, 4);
  const inner = 1.24;
  const outer = 2.27;
  for (let i = 0; i < width; i++) {
    const r = inner + (i / (width - 1)) * (outer - inner); // in Saturn radii
    let a;
    if (r < 1.52) a = 0.16; // C ring
    else if (r < 1.95) a = 0.88; // B ring
    else if (r < 2.03) a = 0.05; // Cassini division
    else a = 0.62; // A ring
    if (r > 2.2 && r < 2.215) a *= 0.15; // Encke gap
    const grain = 0.75 + 0.25 * noise3(r * 60, 0.5, 0.5, 5) + 0.15 * noise3(r * 220, 0.5, 0.5, 6);
    const c = mix(hex('#b79e76'), hex('#eadbb8'), clamp01(grain - 0.55));
    for (let j = 0; j < 4; j++) {
      const k = (j * width + i) * 4;
      img.data[k] = c[0];
      img.data[k + 1] = c[1];
      img.data[k + 2] = c[2];
      img.data[k + 3] = Math.round(clamp01(a * (0.7 + 0.3 * grain)) * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/** Radial glow sprite texture for the Sun. */
export function paintGlowTexture() {
  const size = 256;
  const canvas = Object.assign(document.createElement('canvas'), { width: size, height: size });
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,214,140,1)');
  g.addColorStop(0.22, 'rgba(255,170,70,0.55)');
  g.addColorStop(0.5, 'rgba(255,120,30,0.16)');
  g.addColorStop(1, 'rgba(255,100,20,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}
