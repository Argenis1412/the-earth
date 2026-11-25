import { DEG_TO_RAD } from '../geography/coordinates.js';

const CONTINENT_LABELS = [
  { t: ['AMÉRICA', 'DEL NORTE'], lon: -101, lat: 51 },
  { t: ['AMÉRICA', 'DEL SUR'], lon: -60, lat: -14 },
  { t: ['EUROPA'], lon: 16, lat: 52, size: 38 },
  { t: ['ÁFRICA'], lon: 19, lat: 5 },
  { t: ['ASIA'], lon: 92, lat: 46 },
  { t: ['OCEANÍA'], lon: 134, lat: -25, size: 42 },
  { t: ['ANTÁRTIDA'], lon: 0, lat: -77, size: 38 },
];

const OCEAN_LABELS = [
  { t: 'OCÉANO PACÍFICO', lon: -140, lat: 6 },
  { t: 'OCÉANO PACÍFICO', lon: 152, lat: 15 },
  { t: 'OCÉANO ATLÁNTICO', lon: -32, lat: 21 },
  { t: 'OCÉANO ATLÁNTICO', lon: -14, lat: -30 },
  { t: 'OCÉANO ÍNDICO', lon: 78, lat: -22 },
];

const isOnSeam = (p, q) =>
  (Math.abs(p[0]) > 179.98 && Math.abs(q[0]) > 179.98 && p[0] * q[0] > 0) ||
  (Math.abs(p[1]) > 89.9 && Math.abs(q[1]) > 89.9);

/**
 * Unwraps a ring's longitudes so consecutive points never jump more than 180°.
 * @param {Array<[number, number]>} ring
 * @returns {Array<[number, number]>}
 */
function unwrapRing(ring) {
  const unwrapped = [[ring[0][0], ring[0][1]]];
  for (let i = 1; i < ring.length; i++) {
    let lon = ring[i][0];
    const prevLon = unwrapped[i - 1][0];
    while (lon - prevLon > 180) lon -= 360;
    while (lon - prevLon < -180) lon += 360;
    unwrapped.push([lon, ring[i][1]]);
  }
  return unwrapped;
}

/**
 * Traces all polygon rings of a country onto a 2D canvas context.
 * Rings are unwrapped and repeated at ±360° so polygons that cross the
 * antimeridian fill seamlessly. Rings that enclose a pole (whose unwrapped
 * end drifts a full turn) are skipped.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} country
 * @param {(lon: number, lat: number) => [number, number]} project
 */
export function drawCountryPath(ctx, country, project) {
  ctx.beginPath();
  for (const rings of country.polys) {
    for (const ring of rings) {
      if (!ring.length) continue;
      const unwrapped = unwrapRing(ring);
      const drift = unwrapped[unwrapped.length - 1][0] - unwrapped[0][0];
      if (Math.abs(drift) > 180) continue;
      for (const shift of [-360, 0, 360]) {
        unwrapped.forEach(([lon, lat], idx) => {
          const [x, y] = project(lon + shift, lat);
          if (idx) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        });
        ctx.closePath();
      }
    }
  }
}

function strokeArcs(ctx, world, arcList, project) {
  ctx.beginPath();
  for (const arcIndex of arcList) {
    const arc = world.arcs[arcIndex];
    let open = false;
    for (let j = 1; j < arc.length; j++) {
      if (isOnSeam(arc[j - 1], arc[j]) || Math.abs(arc[j][0] - arc[j - 1][0]) > 180) {
        open = false;
        continue;
      }
      if (!open) {
        const [x0, y0] = project(arc[j - 1][0], arc[j - 1][1]);
        ctx.moveTo(x0, y0);
        open = true;
      }
      const [x, y] = project(arc[j][0], arc[j][1]);
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

function drawSpacedText(ctx, text, x, y, spacing, stroke) {
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (widths.length - 1);
  let cx = x - total / 2;
  ctx.textAlign = 'left';
  [...text].forEach((ch, idx) => {
    if (stroke) ctx.strokeText(ch, cx, y);
    ctx.fillText(ch, cx, y);
    cx += widths[idx] + spacing;
  });
  return total;
}

/**
 * Draws text on an equirectangular canvas, compensating for horizontal stretch by latitude.
 */
function drawMapText(ctx, project, lines, lon, lat, opts) {
  const [x, y] = project(lon, lat);
  const k = Math.min(1 / Math.max(Math.cos(lat * DEG_TO_RAD), 0.01), opts.maxK || 4);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, 1);
  ctx.font = opts.font;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = opts.fill;
  if (opts.stroke) {
    ctx.strokeStyle = opts.stroke;
    ctx.lineWidth = opts.sw || 3;
    ctx.lineJoin = 'round';
  }
  lines.forEach((line, idx) => {
    drawSpacedText(ctx, line, 0, (idx - (lines.length - 1) / 2) * opts.lh, opts.sp, Boolean(opts.stroke));
  });
  ctx.restore();
}

/**
 * Renders the equirectangular base map texture (oceans, graticule, coasts, countries, labels).
 * @param {object} world
 * @param {string[]} colors
 * @param {number} width
 * @param {number} height
 * @returns {HTMLCanvasElement}
 */
export function drawBaseMap(world, colors, width, height) {
  const cv = document.createElement('canvas');
  cv.width = width;
  cv.height = height;
  const ctx = cv.getContext('2d');
  const project = (lon, lat) => [((lon + 180) / 360) * width, ((90 - lat) / 180) * height];
  const scale = width / 4096;

  // Ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#12476b');
  oceanGrad.addColorStop(0.5, '#0a3454');
  oceanGrad.addColorStop(1, '#12476b');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle graticule
  ctx.strokeStyle = 'rgba(255,255,255,.055)';
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  for (let lon = -180; lon <= 180; lon += 30) {
    const [x] = project(lon, 0);
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const [, y] = project(0, lat);
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // Coastal shelf halo
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(96,178,206,.20)';
  ctx.lineWidth = 9 * scale;
  strokeArcs(ctx, world, world.coastArcs, project);
  ctx.strokeStyle = 'rgba(130,208,226,.22)';
  ctx.lineWidth = 4.5 * scale;
  strokeArcs(ctx, world, world.coastArcs, project);

  // Countries
  world.countries.forEach((country, idx) => {
    drawCountryPath(ctx, country, project);
    ctx.fillStyle = colors[idx];
    ctx.fill('evenodd');
  });

  // Borders and coastlines
  ctx.strokeStyle = 'rgba(70,52,34,.75)';
  ctx.lineWidth = 1.15 * scale;
  strokeArcs(ctx, world, world.borderArcs, project);
  ctx.strokeStyle = 'rgba(24,58,70,.8)';
  ctx.lineWidth = 1.5 * scale;
  strokeArcs(ctx, world, world.coastArcs, project);

  // Ocean and continent labels
  OCEAN_LABELS.forEach((item) =>
    drawMapText(ctx, project, [item.t], item.lon, item.lat, {
      font: `italic 400 ${34 * scale}px system-ui, sans-serif`,
      fill: 'rgba(176,212,238,.5)',
      sp: 7 * scale,
      lh: 0,
    }),
  );

  CONTINENT_LABELS.forEach((item) =>
    drawMapText(ctx, project, item.t, item.lon, item.lat, {
      font: `700 ${(item.size || 46) * scale}px system-ui, sans-serif`,
      fill: 'rgba(255,248,230,.78)',
      stroke: 'rgba(30,22,10,.4)',
      sw: 3.5 * scale,
      sp: 9 * scale,
      lh: (item.size || 46) * 1.1 * scale,
    }),
  );

  return cv;
}

/**
 * Renders the specular mask: glossy ocean, matte land.
 * @param {object} world
 * @param {number} width
 * @param {number} height
 * @returns {HTMLCanvasElement}
 */
export function drawSpecMap(world, width, height) {
  const cv = document.createElement('canvas');
  cv.width = width;
  cv.height = height;
  const ctx = cv.getContext('2d');
  const project = (lon, lat) => [((lon + 180) / 360) * width, ((90 - lat) / 180) * height];

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#0c0c0c';
  world.countries.forEach((country) => {
    drawCountryPath(ctx, country, project);
    ctx.fill('evenodd');
  });

  return cv;
}

/**
 * Renders country name labels (revealed on zoom), avoiding overlaps and narrow polygons.
 * @param {object} world
 * @param {number} width
 * @param {number} height
 * @returns {HTMLCanvasElement}
 */
export function drawCountryLabels(world, width, height) {
  const cv = document.createElement('canvas');
  cv.width = width;
  cv.height = height;
  const ctx = cv.getContext('2d');
  const project = (lon, lat) => [((lon + 180) / 360) * width, ((90 - lat) / 180) * height];
  const scale = width / 4096;
  const placed = [];

  [...world.countries]
    .sort((a, b) => b.area - a.area)
    .forEach((country) => {
      if (!country.main || country.name === 'Antártida' || country.area < 6) return;
      const [lon, lat] = country.main.c;
      if (Math.abs(lat) > 72) return;

      const k = Math.min(1 / Math.cos(lat * DEG_TO_RAD), 4);
      const boxWidth = ((country.main.bbox[2] - country.main.bbox[0]) / 360) * width;

      for (let f = 24 * scale; f >= 13 * scale; f -= 2 * scale) {
        ctx.font = `600 ${f}px system-ui, sans-serif`;
        const w = ctx.measureText(country.name).width * k;
        const h = f * 1.25;
        const [x, y] = project(lon, lat);
        if (w > boxWidth * 0.92) continue;

        const rect = [x - w / 2, y - h / 2, x + w / 2, y + h / 2];
        if (placed.some((q) => rect[0] < q[2] && rect[2] > q[0] && rect[1] < q[3] && rect[3] > q[1])) {
          return;
        }
        placed.push(rect);
        drawMapText(ctx, project, [country.name], lon, lat, {
          font: ctx.font,
          fill: '#fffbea',
          stroke: 'rgba(14,20,10,.8)',
          sw: 4 * scale,
          sp: 0,
          lh: 0,
        });
        return;
      }
    });

  return cv;
}
