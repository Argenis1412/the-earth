# the-earth

Globo terráqueo 3D interactivo construido con [Three.js](https://threejs.org/) y [Vite](https://vite.dev/).

## Desarrollo

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
npm test         # ejecutar los tests
```

## Sistema solar

Alrededor de la Tierra hay ahora el Sol, los planetas, Plutón y la Luna, en sus **posiciones reales de hoy**
(elementos keplerianos del JPL) dibujados con una escala comprimida.

- La vista por defecto sigue siendo la Tierra. Al alejar el zoom aparecen las órbitas y los demás cuerpos.
- El botón **Sistema solar** vuela a una vista general.
- Plan, decisiones de diseño y próximas fases: [`docs/PLAN.md`](docs/PLAN.md).
