export const DEG_TO_RAD = Math.PI / 180;
export const EARTH_RADIUS_KM = 6371.0088;
export const KM_PER_MILE = 1.609344;
export const KM_PER_NAUTICAL_MILE = 1.852;

const COMPASS_POINTS_ES = [
  'N', 'NNE', 'NE', 'ENE',
  'E', 'ESE', 'SE', 'SSE',
  'S', 'SSO', 'SO', 'OSO',
  'O', 'ONO', 'NO', 'NNO',
];

/**
 * Converts a distance in kilometers to the requested unit ('km', 'mi', 'NM').
 * @param {number} km
 * @param {'km' | 'mi' | 'NM'} unit
 * @returns {number}
 */
export function convertDistance(km, unit = 'km') {
  switch (unit) {
    case 'mi':
      return km / KM_PER_MILE;
    case 'NM':
      return km / KM_PER_NAUTICAL_MILE;
    case 'km':
    default:
      return km;
  }
}

/**
 * Converts bearing degrees [0, 360) into a Spanish 16-wind compass abbreviation.
 * @param {number} degrees
 * @returns {string}
 */
export function bearingToCompass(degrees) {
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return COMPASS_POINTS_ES[index];
}

/**
 * Formats bearing in degrees and compass point (e.g., "41° NE").
 * @param {number} degrees
 * @returns {string}
 */
export function formatBearing(degrees) {
  const normalized = Math.round(((degrees % 360) + 360) % 360);
  const compass = bearingToCompass(normalized);
  return `${normalized}° ${compass}`;
}

/**
 * Formats estimated flight time at a given cruise speed in km/h.
 * Returns Spanish formatted duration (e.g. "10 h 14 min" or "45 min").
 * @param {number} km
 * @param {number} [speedKmh=850]
 * @returns {string}
 */
export function formatFlightTime(km, speedKmh = 850) {
  if (km <= 0 || speedKmh <= 0) return '0 min';
  const totalMinutes = Math.round((km / speedKmh) * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return `${hours} h ${minutes} min`;
}

/**
 * Normalizes text for accent-insensitive and case-insensitive matching.
 * @param {string} value
 * @returns {string}
 */
export function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Formats latitude and longitude for display.
 * @param {number} lat
 * @param {number} lon
 * @returns {string}
 */
export function formatCoordinates(lat, lon) {
  return `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
}

/**
 * Parses a coordinate pair string such as "-25.43, -49.27".
 * Returns null if the input does not look like coordinates, or an error object if out of range.
 * @param {string} query
 * @returns {{lat: number, lon: number} | {error: string} | null}
 */
export function parseCoordinates(query) {
  const match = query
    .trim()
    .replace(/[−–]/g, '-')
    .match(/^(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)$/);

  if (!match) return null;

  const lat = Number(match[1]);
  const lon = Number(match[2]);
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return { error: 'Coordenadas fuera de rango (lat ±90, lon ±180)' };
  }

  return { lat, lon };
}

/**
 * Computes great-circle distance in kilometers using the Haversine formula.
 * @param {{lat: number, lon: number}} a
 * @param {{lat: number, lon: number}} b
 * @returns {number}
 */
export function haversineDistance(a, b) {
  const dLat = (b.lat - a.lat) * DEG_TO_RAD;
  const dLon = (b.lon - a.lon) * DEG_TO_RAD;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * DEG_TO_RAD) * Math.cos(b.lat * DEG_TO_RAD) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Computes initial great-circle bearing in degrees [0, 360) from point a to point b.
 * @param {{lat: number, lon: number}} a
 * @param {{lat: number, lon: number}} b
 * @returns {number}
 */
export function initialBearing(a, b) {
  const lat1 = a.lat * DEG_TO_RAD;
  const lat2 = b.lat * DEG_TO_RAD;
  const dLon = (b.lon - a.lon) * DEG_TO_RAD;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  return ((Math.atan2(y, x) / DEG_TO_RAD) + 360) % 360;
}

/**
 * Converts geographic coordinates to 3D Cartesian coordinates matching the globe mesh.
 * @param {number} lat
 * @param {number} lon
 * @param {number} [radius=1]
 * @returns {{x: number, y: number, z: number}}
 */
export function latLonToCartesian(lat, lon, radius = 1) {
  const cosLat = Math.cos(lat * DEG_TO_RAD);
  return {
    x: radius * cosLat * Math.cos(lon * DEG_TO_RAD),
    y: radius * Math.sin(lat * DEG_TO_RAD),
    z: -radius * cosLat * Math.sin(lon * DEG_TO_RAD),
  };
}

/**
 * Converts 3D Cartesian coordinates back to latitude and longitude in degrees.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {{lat: number, lon: number}}
 */
export function cartesianToLatLon(x, y, z) {
  const len = Math.hypot(x, y, z) || 1;
  const ny = Math.min(1, Math.max(-1, y / len));
  return {
    lat: Math.asin(ny) / DEG_TO_RAD,
    lon: Math.atan2(-z / len, x / len) / DEG_TO_RAD,
  };
}

/**
 * Generates unit-sphere points along the shortest great-circle arc between two unit vectors.
 * Handles antipodal points deterministically.
 * @param {{x: number, y: number, z: number}} a
 * @param {{x: number, y: number, z: number}} b
 * @param {number} segments
 * @returns {Array<{x: number, y: number, z: number}>}
 */
export function greatCirclePoints(a, b, segments) {
  const clampUnit = (v) => Math.min(1, Math.max(-1, v));
  const dot = clampUnit(a.x * b.x + a.y * b.y + a.z * b.z);

  const slerp = (p, q, t) => {
    const theta = Math.acos(clampUnit(p.x * q.x + p.y * q.y + p.z * q.z));
    if (theta < 1e-6) return { ...p };
    const sinTheta = Math.sin(theta);
    const w0 = Math.sin((1 - t) * theta) / sinTheta;
    const w1 = Math.sin(t * theta) / sinTheta;
    return {
      x: p.x * w0 + q.x * w1,
      y: p.y * w0 + q.y * w1,
      z: p.z * w0 + q.z * w1,
    };
  };

  if (dot > -0.99999) {
    return Array.from({ length: segments + 1 }, (_, i) => slerp(a, b, i / segments));
  }

  // Antipodal points: pick an orthogonal axis to form a valid great circle.
  const ref = Math.abs(a.y) < 0.9 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 };
  const cx = a.y * ref.z - a.z * ref.y;
  const cy = a.z * ref.x - a.x * ref.z;
  const cz = a.x * ref.y - a.y * ref.x;
  const len = Math.hypot(cx, cy, cz) || 1;
  const mid = { x: cx / len, y: cy / len, z: cz / len };

  const half = segments / 2;
  return Array.from({ length: segments + 1 }, (_, i) =>
    i <= half ? slerp(a, mid, i / half) : slerp(mid, b, (i - half) / half),
  );
}
