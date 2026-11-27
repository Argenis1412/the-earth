# the-earth — Plan: sistema solar en movimiento

> Repo de curiosidad. Sin presión de portafolio: la meta es que sea bonito, nítido y
> físicamente honesto donde se pueda, y claramente "estilizado" donde no.

## 1. Qué se quiere construir

1. Añadir el **Sol, los 8 planetas, Plutón y la Luna**, con el mismo formato visual de la
   Tierra pero menos detallados.
2. Botón **Simular trayectoria**:
   - **Activado**: los cuerpos orbitan en tiempo simulado y dejan estelas nítidas.
   - **Desactivado**: posiciones estáticas (las de hoy), pero cada cuerpo sigue girando sobre
     su propio eje.
3. La **vista por defecto sigue siendo la Tierra**. Al rotar la cámara / alejarse aparecen los
   demás cuerpos.
4. La calculadora **A / B** acepta también cuerpos celestes: planeta a planeta, hasta el Sol
   o hasta la Luna, expresando la distancia en km, UA y **tiempo a la velocidad de la luz**.

## 2. Lo que ya existe (hallazgos del repo)

Stack: **Three.js 0.160 + Vite, JavaScript plano**, tests con `node --test` (35 pasan hoy).

| Pieza | Estado actual | Consecuencia para el plan |
|---|---|---|
| Tierra | Esfera de radio 1 **fija en el origen**. No gira sobre su eje. | La cámara orbita el origen; "Spin" gira la **cámara**, no la Tierra. |
| Marcadores A/B, polos, ruta | Hijos directos de `scene` en coordenadas fijas a la Tierra | Para que la Tierra rote de verdad habrá que re-parentarlos (Fase 2). |
| Luz | `DirectionalLight` fija **respecto a la cámara** (faro) | No coincide con la posición real del Sol; hay que mezclar al alejarse. |
| Cámara | `far = 200`, `maxDistance = 7`, estrellas a radio 60–100 | Todo eso se queda corto: hay que reescalar profundidad y estrellas. |
| i18n | `en.js` / `es.js`, un test exige **mismas claves** en ambos | Todo texto nuevo entra en los dos idiomas. |
| Calculadora | `stops[]` con A y B, Haversine, URL `?from=&to=` | Se extiende sin romper los enlaces existentes. |
| API de depuración | `window.__globe` | Se mantiene y se amplía (`__globe.solar`). |

Archivos relevantes: `src/globe/createGlobe.js` (escena, luz, cámara), `src/globe/routeRenderer.js`,
`src/globe/interactions.js`, `src/ui/distancePanel.js`, `src/main.js`, `src/i18n/*`.

## 3. Decisiones de diseño

### 3.1 La Tierra queda en el origen (marco geocéntrico de cámara)

Todo el sistema solar vive en un grupo `system` cuya posición es `−posiciónTierra(t)`. Así:

- La Tierra existente no se toca y sigue en (0,0,0): la vista por defecto es idéntica.
- No hay problemas de precisión con coordenadas grandes.
- Con la simulación activa, el grupo se desplaza cada frame y la Tierra "se queda quieta".

### 3.2 Orientación: la escena es el marco ecuatorial J2000

`+Y` = polo norte de la Tierra (como ya es hoy), `+X` = equinoccio de marzo.
Conversión eclíptica → escena: `eq = Rx(ε)·ecl`, `escena = (x_eq, z_eq, −y_eq)`, con
ε = 23,43928°. Consecuencias gratis y correctas:

- El plano de la eclíptica queda **inclinado 23,44°** respecto al ecuador de la Tierra.
- Los ejes de giro de los demás cuerpos se toman de los valores IAU (AR/Dec del polo norte),
  que ya están en ese marco. Eso reproduce la inclinación de Urano (**97,72°** calculado vs 97,77°
  real), el giro retrógrado de Venus (178,8° vs 177,4°) y Plutón (112,8° vs 122,5°), etc., sin números
  mágicos. Hay un test automático que lo comprueba.

### 3.3 Escala: real para calcular, comprimida para dibujar

Con distancias reales Neptuno estaría a ~30 UA ≈ 700 000 radios terrestres: invisible. Así que:

| Magnitud | Visual | Fórmula |
|---|---|---|
| Distancia al Sol | raíz cuadrada | `d = 30 · √(UA)` unidades (Tierra→30, Neptuno→≈164, Plutón→≈188) |
| Radio de los planetas | potencia 0,45 | `r = (R / R_tierra)^0.45` (Tierra=1, Júpiter≈2,9, Plutón≈0,5) |
| Sol | fijo | radio 6 |
| Luna | **comprimida** | órbita de **4,0** radios terrestres (la real son 60), radio real 0,273 |
| Calculadora y paneles | **real** | km, UA, tiempo luz con datos reales |

Se verificó que con esos números **ningún par de órbitas vecinas solapa sus esferas** en
perihelio/afelio (test automático, excepto Neptuno–Plutón, que se cruzan de verdad).

> **Corrección respecto a lo que te dije antes:** había propuesto la Luna "a escala real
> (60 radios)". A 60 radios sería un punto de ~7 px en la vista por defecto, así que la
> comprimo a 4. Los números de la calculadora siguen siendo los reales (384 400 km).

### 3.4 Posiciones reales de hoy

Elementos keplerianos de Standish (JPL, tabla 1, válida 1800–2050) y para la Luna una órbita
de elementos medios.

**Validación hecha** contra el efemérides integrado de astropy (independiente):

| Cuerpo | Error de posición (4 fechas, 2000–2040) |
|---|---|
| Mercurio, Venus, Tierra, Marte | < 0,01° |
| Júpiter, Urano, Neptuno | < 0,1° |
| Saturno | ≤ 0,15° |
| Luna | 0,5°–1,8° en dirección, ~1 % en distancia |
| Plutón | no hay referencia en astropy; contrastado con hechos: **29,66 UA** en el perihelio de 1989, **32,9 UA** en el sobrevuelo de New Horizons (2015), afelio **49,3 UA** en 2114 |

La Tierra es el baricentro Tierra–Luna (lo que da la tabla): error ≈ 4 700 km, irrelevante.

### 3.5 Luz

- Planetas y Luna: shader propio (Lambert + ambiente) con la **dirección real al Sol**.
  Así la Luna muestra la fase real y los planetas tienen su lado noche.
- Tierra: conserva su faro de cámara cerca. Al alejarse (≈ 9 → 40 unidades) la luz se
  **mezcla** hacia la dirección real al Sol, para que la iluminación sea coherente en la vista
  del sistema. De cerca no cambia nada.
- El Sol es emisivo (sin sombreado) + halo aditivo.

### 3.6 Cámara y profundidad

- `far` 20 000; estrellas a radio 8 000–10 000.
  (Una primera prueba con K=18 y exponente 0,55 dejaba a Júpiter y Venus gigantes al fondo de la
  vista inicial; por eso la escala final es más espaciada y los radios más modestos.)
- `near` dinámico = `max(0.05, 0.015 · distancia)` para conservar precisión de z con las
  capas finas de la Tierra (etiquetas 1.0012, atmósfera 1.02).
- `maxDistance` 1200. Botón **"Sistema solar"** vuela a una vista cenital-oblicua (35° sobre la
  eclíptica, distancia ≈ 700). **"Reset view"** vuelve a la Tierra.

### 3.7 Rotaciones propias

- Períodos sidéreos reales y signados: Mercurio 1407,5 h; Venus −5832,5 h; Tierra 23,934 h;
  Marte 24,623 h; Júpiter 9,925 h; Saturno 10,656 h; Urano −17,24 h; Neptuno 16,11 h;
  Plutón 153,29 h (su giro "retrógrado" viene de la inclinación axial de 122,5°, no del signo); Sol 609 h; Luna = 1 órbita (acoplada).
- **Se conservan las proporciones reales**; la escala temporal es una constante
  (`1 día terrestre = 60 s`). Resultado: Júpiter gira en ~25 s, Marte en ~62 s, Mercurio en
  ~59 min. Que Venus/Mercurio parezcan quietos **es correcto**.
- La Luna **siempre muestra la misma cara a la Tierra** (rotación acoplada).
- `prefers-reduced-motion` congela las rotaciones.

### 3.8 Texturas

Procedurales (canvas con ruido determinista): cero archivos, nítidas a cualquier zoom, sin
problemas de licencia. Generación escalonada tras el primer frame para no retrasar la carga.
Opción futura: texturas reales 1k–2k (NASA / Solar System Scope, CC BY 4.0) si existe
`public/textures/<id>.jpg`.

## 4. Arquitectura de módulos

```
src/solar/
  elements.js        tabla de elementos keplerianos (datos)
  kepler.js          Kepler, posición heliocéntrica, órbita, Luna, conversiones de marco   [puro]
  bodies.js          catálogo: radios, ejes (AR/Dec), períodos, colores, claves i18n        [puro]
  scale.js           compresión de distancias y radios                                      [puro]
  rotation.js        ángulo de giro y cuaternión del eje                                    [puro]
  lightTravel.js     (Fase 3) distancia entre cuerpos y formato de tiempo luz               [puro]
  textures.js        texturas procedurales por cuerpo                                       [navegador]
  planetMaterial.js  shader Lambert con dirección al Sol                                    [navegador]
  createSolarSystem.js  construye escena: cuerpos, órbitas, etiquetas, anillos; update(t)   [navegador]
tests/solar.test.js  matemática pura
```

La lógica pura no importa Three.js, de modo que se prueba con `node --test` como el resto.
`createSolarSystem` recibe el `globe` existente (usa `scene`, `addUpdater`, `camera`).

## 5. Interfaz

| Elemento | Cuándo | Detalle |
|---|---|---|
| Chip **Sistema solar** | Fase 1 | Junto a Spin / Reset view. Vuela a la vista general. |
| Etiquetas de cuerpos | Fase 1 | Texto de tamaño constante en pantalla; aparecen solo al alejarse (la vista por defecto queda limpia). |
| Chip **Simular trayectoria** | Fase 2 | `aria-pressed`. Muestra una barra de tiempo. |
| Barra de tiempo | Fase 2 | Fecha simulada, pausa, ◀ ▶, velocidades 1 h/s · 1 d/s · 1 sem/s · 1 mes/s · 1 año/s · 10 años/s, botón "Hoy". |
| Clic en cuerpo | Fase 3 | Tarjeta como la de país: diámetro, distancia al Sol (ahora), período orbital, duración del día, inclinación axial, satélites. Botones Origen / Destino. |
| Calculadora | Fase 3 | Los campos A/B aceptan "Marte", "Sun", "Luna", "Plutón"… (autocompletado en ES/EN). |

Estado en URL (compatible con enlaces actuales): `?from=Mars&to=Sun`; en Fase 2 se añade `&t=ISO-8601`.

## 6. Calculadora entre cuerpos (Fase 3)

- Distancia **centro a centro** en línea recta (en el instante simulado) y, como dato
  secundario, **superficie a superficie** (restando radios).
- Resultado principal: km / mi / NM (existentes) + **UA**; tiempo de luz con formato
  automático (`1,3 s`, `8 min 19 s`, `4 h 10 min`).
- Referencias reales para los tests: Tierra–Sol ≈ 8 min 19 s (1 UA = 499,0 s);
  Tierra–Luna ≈ 1,28 s; Tierra–Marte entre ≈ 3 y 22 min; Tierra–Neptuno ≈ 4 h; Sol–Plutón entre 4,1 y 6,8 h.
- Con la simulación activa, el valor se actualiza en vivo.
- Si un extremo es un punto de la superficie terrestre (ciudad / lat,lon) y el otro un cuerpo,
  la Tierra cuenta como cuerpo **desde su centro** y se avisa en la nota de la tarjeta.
- Dibujo: segmento entre cuerpos en la escena comprimida + marcadores A/B (anillo con letra).
  Se rotula "no a escala". Extra opcional: pulso de luz recorriendo el segmento.
- Comparativa opcional de tiempos de viaje: avión (850 km/h, ya existente), Voyager 1 (≈ 17 km/s), luz.

## 7. Simulación (Fase 2)

- Reloj simulado `simTime` (arranca en "ahora"), con pausa, inversión y velocidad.
- Cada frame: 10 evaluaciones de Kepler (coste despreciable) → posiciones → `system.position = −Tierra`.
- **Estelas**: buffer circular por cuerpo con `Line2` (líneas con ancho real en píxeles, nítidas),
  degradado de opacidad hacia la cola. Anclado al grupo `system` ⇒ son trayectorias heliocéntricas correctas.
- Órbita completa tenue siempre visible; estela brillante encima.
- La Luna se desvanece por encima de 1 mes/s (aliasing: daría 13 vueltas por segundo).
- **Tierra girando**: se re-parentan marcadores, polos y overlays a un `earthRoot`; el ángulo
  sale del tiempo sidéreo de Greenwich; el raycast convierte a coordenadas locales.
  "Spin" pasaría a significar *la Tierra gira* (hoy gira la cámara) — **decisión abierta, ver §10**.

## 8. Fases y criterios de aceptación

### Fase 1 — Sistema solar estático  ✅ *completada*
- Sol, Mercurio…Neptuno, **Plutón**, **Luna**, anillos de Saturno, líneas de órbita nítidas.
- Posiciones reales de hoy; ejes y giros propios de cada cuerpo (la Tierra aún no gira, §3.7/§7).
- Etiquetas ES/EN, chip "Sistema solar", cámara/profundidad/estrellas reescaladas, luz mezclada.
- Tests de matemática pura; `npm test` y `npm run build` en verde.
- **Notas de implementación:** las órbitas son líneas opacas atenuadas (las translúcidas se ven
  punteadas) y **solo aparecen al alejar la cámara** (> 8 unidades) para no ensuciar la vista de la
  Tierra; las etiquetas de los planetas internos se ocultan en la vista general para no amontonarse.
  La Tierra aún no gira sobre su eje (Fase 2). Con la cámara por defecto pueden asomar por los bordes
  la Luna o algún planeta lejano, según la fecha: es el cielo real detrás de la Tierra.
- **Aceptación:** la vista inicial es visualmente la de siempre; al alejarse se ven todos los
  cuerpos con su fase de luz correcta; la calculadora actual sigue funcionando igual.

### Fase 2 — Simulación de trayectoria
- Botón, reloj, velocidades, estelas, Luna orbitando, Tierra girando (según decisión §10).
- **Aceptación:** 1 año/s → la Tierra "cierra" una vuelta en 1 s respecto al Sol; Júpiter ≈ 11,86 s.

### Fase 3 — Calculadora interplanetaria y tarjetas
- Autocompletado de cuerpos, clic en cuerpo, tarjeta, segmento A–B, distancia y tiempo luz.
- **Aceptación:** Tierra→Sol = 8 min 19 s ±5 s; valores coherentes con la tabla de §6.

### Fase 4 — Extras (a gusto)
- Texturas reales opcionales · día/noche real en la Tierra · anillos tenues de Urano ·
  cinturón de asteroides · fases lunares y eclipses · **modo hélice** (ver §9) · sonido ambiente… lo que apetezca.

## 9. Sobre la "hélice" de la foto de referencia

Ese dibujo es la trayectoria de los planetas **vistos desde las estrellas cercanas**: el Sol
se desplaza ≈ 19–20 km/s respecto a ellas, y cada planeta describe una hélice alrededor de
esa línea. Es un marco de referencia real, no un invento, y para los planetas internos el
efecto es muy marcado (la Tierra avanza ≈ 4 UA por cada vuelta suya). Para los externos la
hélice se estira muchísimo (Neptuno ≈ 680 UA por vuelta) y el resultado parece casi una recta.

> **Corrección:** antes dije que "la hélice se vería casi como líneas rectas" en general;
> eso solo vale para los planetas lejanos. Para los internos es justo la imagen de la foto.

Plan: modo opcional (Fase 4) donde el Sol avanza por la escena y las estelas quedan fijas en
el espacio, con la velocidad de avance **exagerada y rotulada como estilizada**, porque con
la compresión de distancias de §3.3 el paso exacto no se conserva.

## 10. Decisiones abiertas

1. **Spin y la Tierra.** Hoy "Spin" gira la cámara. Propuesta: en Fase 2 "Spin" hace girar la
   Tierra de verdad (como el resto de planetas) y la cámara deja de auto-rotar. Implica
   re-parentar marcadores; es el cambio con más riesgo de regresión.
2. **Texturas reales** (Fase 4): ¿se añaden archivos al repo o se mantiene todo procedural?
3. **Plutón**: incluido como planeta enano (decidido). Se rotula como "planeta enano" en la tarjeta.

## 11. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Z-fighting de las capas finas de la Tierra al alejarse | `near` dinámico; capas ya con `depthWrite:false` |
| Línea de la órbita terrestre atravesando la Tierra | Se deja un hueco en la órbita alrededor de la Tierra |
| Coste de generar 11 texturas | Escalonado con `setTimeout` tras el primer frame; 512×256 salvo cuerpos grandes |
| Regresiones en la calculadora | Los tests existentes siguen siendo la red de seguridad; no se toca `distancePanel` hasta la Fase 3 |
| Precisión de la Luna (±2°) | Declarado; es visual, no astronómico |
| Móvil | `devicePixelRatio` ya limitado a 2; etiquetas y líneas escalan; chips en la barra existente |

## 12. Fuera de alcance

Efemérides de precisión (eclipses exactos, ocultaciones), lunas distintas de la nuestra,
cometas, naves, y cualquier cosa que requiera datos de red en tiempo de ejecución.

## Referencias

- E. M. Standish, *Keplerian Elements for Approximate Positions of the Major Planets*, JPL SSD.
- IAU WGCCRE, *Report of the Working Group on Cartographic Coordinates and Rotational Elements*.
- Validación cruzada: astropy `solar_system_ephemeris = 'builtin'`.
