# the-earth

Interactive 3D globe (Three.js + Vite) with a great-circle distance calculator, bilingual UI (EN/ES)
and, since the solar-system update, the Sun, the planets, Pluto and the Moon around the Earth.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # node --test
npm run build
```

- Default view: the Earth. Drag to rotate, scroll to zoom out; **Solar system** flies to an overview.
- Planet positions are real for today's date (Keplerian elements, JPL), drawn on a compressed scale.
- Roadmap and design decisions: [`docs/PLAN.md`](docs/PLAN.md).
