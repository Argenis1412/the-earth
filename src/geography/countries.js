import { normalizeText, parseCoordinates } from './coordinates.js';

export const CONTINENT_NAMES = [
  'América del Norte',
  'América del Sur',
  'Europa',
  'África',
  'Asia',
  'Oceanía',
  'Antártida',
];

const PALETTE = [
  '#9bb56b',
  '#7fa35f',
  '#bcc27a',
  '#d6bb72',
  '#cf9f55',
  '#bf8460',
  '#a98b66',
  '#c9ad88',
  '#88a98a',
];

const CONTINENT_COLOR_PREFS = [
  [1, 0, 3, 2, 8, 4, 7],
  [0, 2, 1, 8, 3, 7, 4],
  [2, 0, 1, 8, 3, 7, 6],
  [4, 3, 5, 7, 6, 2, 0],
  [3, 7, 0, 6, 4, 2, 5],
  [8, 5, 0, 3, 1, 7, 4],
  [7],
];

/**
 * Decodes the embedded TopoJSON world payload into country polygons, centroids,
 * neighbor sets, and separated border/coastline arc indices.
 * @param {{topo: object, names: string[], cont: string, alt: Record<string, number>}} worldData
 */
export function decodeWorld(worldData) {
  const topo = worldData.topo;
  const [sx, sy] = topo.transform.scale;
  const [tx, ty] = topo.transform.translate;

  const arcs = topo.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * sx + tx, y * sy + ty];
    });
  });

  const owners = arcs.map(() => new Set());
  const countries = topo.objects.countries.geometries.map((geom, index) => {
    const rawPolys = geom.type === 'Polygon' ? [geom.arcs] : geom.arcs;
    const polys = rawPolys.map((rings) =>
      rings.map((arcIndices) => {
        const pts = [];
        arcIndices.forEach((ai, k) => {
          const r = ai < 0 ? ~ai : ai;
          owners[r].add(index);
          const arc = ai < 0 ? arcs[r].slice().reverse() : arcs[r];
          for (let j = k ? 1 : 0; j < arc.length; j++) {
            pts.push(arc[j]);
          }
        });
        return pts;
      }),
    );

    let best = null;
    let totalArea = 0;

    polys.forEach((rings) => {
      const outer = rings[0];
      let minX = 1e9;
      let maxX = -1e9;
      let minY = 1e9;
      let maxY = -1e9;
      let signedArea2 = 0;
      let cx = 0;
      let cy = 0;

      for (let j = 0; j < outer.length; j++) {
        const [x, y] = outer[j];
        const [x2, y2] = outer[(j + 1) % outer.length];
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        const cross = x * y2 - x2 * y;
        signedArea2 += cross;
        cx += (x + x2) * cross;
        cy += (y + y2) * cross;
      }

      rings.bbox = [minX, minY, maxX, maxY];
      const area = Math.abs(signedArea2) / 2;
      totalArea += area;

      if (!best || area > best.area) {
        best = {
          area,
          bbox: rings.bbox,
          c: signedArea2
            ? [cx / (3 * signedArea2), cy / (3 * signedArea2)]
            : [(minX + maxX) / 2, (minY + maxY) / 2],
        };
      }
    });

    return {
      i: index,
      name: worldData.names[index],
      cont: Number(worldData.cont[index]),
      alt: worldData.alt[index],
      polys,
      area: totalArea,
      main: best,
    };
  });

  const nb = countries.map(() => new Set());
  const borderArcs = [];
  const coastArcs = [];

  owners.forEach((set, arcIndex) => {
    if (set.size > 1) {
      borderArcs.push(arcIndex);
      const list = [...set];
      list.forEach((a) => list.forEach((b) => a !== b && nb[a].add(b)));
    } else {
      coastArcs.push(arcIndex);
    }
  });

  return { arcs, countries, nb, borderArcs, coastArcs };
}

/**
 * Assigns fill colors to countries so adjacent borders never share a color.
 * @param {ReturnType<typeof decodeWorld>} world
 * @returns {string[]}
 */
export function colorCountries(world) {
  const order = world.countries.map((c) => c.i).sort((a, b) => world.nb[b].size - world.nb[a].size);
  const assigned = new Array(world.countries.length).fill(-1);

  for (const i of order) {
    const used = new Set([...world.nb[i]].map((j) => assigned[j]));
    const prefs = CONTINENT_COLOR_PREFS[world.countries[i].cont].concat(PALETTE.map((_, k) => k));
    assigned[i] = prefs.find((k) => !used.has(k));
  }

  return world.countries.map((country, i) =>
    country.name === 'Antártida' || country.name === 'Groenlandia' ? '#e4e9e5' : PALETTE[assigned[i]],
  );
}

/**
 * Finds the country containing the given longitude and latitude using even-odd ray casting.
 * @param {ReturnType<typeof decodeWorld>} world
 * @param {number} lon
 * @param {number} lat
 */
export function countryAt(world, lon, lat) {
  for (const country of world.countries) {
    for (const rings of country.polys) {
      const bbox = rings.bbox;
      if (lon < bbox[0] || lon > bbox[2] || lat < bbox[1] || lat > bbox[3]) continue;

      let inside = false;
      for (const ring of rings) {
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
          const [xi, yi] = ring[i];
          const [xj, yj] = ring[j];
          if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
            inside = !inside;
          }
        }
      }

      if (inside) return country;
    }
  }
  return null;
}

/**
 * Formats the continent(s) label in Spanish for a decoded country.
 * @param {{cont: number, alt?: number}} country
 * @returns {string}
 */
export function formatContinents(country) {
  return country.alt != null
    ? `${CONTINENT_NAMES[country.cont]} y ${CONTINENT_NAMES[country.alt]}`
    : CONTINENT_NAMES[country.cont];
}

/**
 * Builds a normalized search index for the city catalog.
 * @param {Array<{name: string, country: string, lat: number, lon: number}>} cities
 */
export function createCityIndex(cities) {
  return cities.map((city) => ({
    ...city,
    normalizedName: normalizeText(city.name),
  }));
}

/**
 * Resolves a user query (coordinates, city name, or country name) into a geographic point.
 * @param {string} query
 * @param {ReturnType<typeof decodeWorld>} world
 * @param {ReturnType<typeof createCityIndex>} cityIndex
 */
export function resolveLocation(query, world, cityIndex) {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const parsedCoords = parseCoordinates(trimmed);
  if (parsedCoords) {
    if ('error' in parsedCoords) return parsedCoords;
    const country = countryAt(world, parsedCoords.lon, parsedCoords.lat);
    return {
      lat: parsedCoords.lat,
      lon: parsedCoords.lon,
      label: country ? country.name : 'Océano / mar abierto',
      countryName: country ? country.name : null,
    };
  }

  const normalized = normalizeText(trimmed);
  const city =
    cityIndex.find((c) => c.normalizedName === normalized) ||
    cityIndex.find((c) => c.normalizedName.startsWith(normalized)) ||
    (normalized.length > 2 && cityIndex.find((c) => c.normalizedName.includes(normalized)));

  if (city) {
    return {
      lat: city.lat,
      lon: city.lon,
      label: `${city.name}, ${city.country}`,
      countryName: city.country,
    };
  }

  const searchableCountries = world.countries.filter((c) => c.main);
  const country =
    searchableCountries.find((c) => normalizeText(c.name) === normalized) ||
    searchableCountries.find((c) => normalizeText(c.name).startsWith(normalized)) ||
    (normalized.length > 2 && searchableCountries.find((c) => normalizeText(c.name).includes(normalized)));

  if (country) {
    return {
      lat: country.main.c[1],
      lon: country.main.c[0],
      label: `${country.name} (centro aprox.)`,
      countryName: country.name,
    };
  }

  return { error: `No encuentro «${trimmed}». Prueba otra ciudad, un país o «lat, lon».` };
}
