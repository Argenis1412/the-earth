import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { decodeWorld } from '../src/geography/countries.js';

const here = dirname(fileURLToPath(import.meta.url));
const worldData = JSON.parse(readFileSync(join(here, '../src/data/world.json'), 'utf8'));
const world = decodeWorld(worldData);

const jumps = (points) => {
  let count = 0;
  for (let i = 1; i < points.length; i++) {
    if (Math.abs(points[i][0] - points[i - 1][0]) > 180) count++;
  }
  return count;
};

let ringJumps = 0;
for (const country of world.countries) {
  for (const rings of country.polys) {
    for (const ring of rings) ringJumps += jumps(ring);
  }
}

let arcJumps = 0;
for (const arc of world.arcs) arcJumps += jumps(arc);

const antartida = world.countries.find((c) => c.name === 'Antártida');
let minLat = Infinity;
let maxLat = -Infinity;
if (antartida) {
  for (const rings of antartida.polys) {
    for (const ring of rings) {
      for (const [, lat] of ring) {
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
    }
  }
}

console.log(`(a) country-ring lon jumps > 180: ${ringJumps}`);
console.log(`(b) arc lon jumps > 180: ${arcJumps}`);
console.log(
  `(c) Antártida lat range: min ${Number.isFinite(minLat) ? minLat.toFixed(4) : 'n/a'} / max ${Number.isFinite(maxLat) ? maxLat.toFixed(4) : 'n/a'}`,
);
