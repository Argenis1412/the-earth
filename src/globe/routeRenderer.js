import * as THREE from 'three';
import { greatCirclePoints, latLonToCartesian } from '../geography/coordinates.js';
import { toVec } from './createGlobe.js';

function createMarkerMesh(letter, color) {
  const group = new THREE.Group();
  const hex = `#${new THREE.Color(color).getHexString()}`;

  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.012, 16, 12),
    new THREE.MeshBasicMaterial({ color }),
  );
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.02, 0.027, 40),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  const stem = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0.065),
    ]),
    new THREE.LineBasicMaterial({ color }),
  );

  const cv = Object.assign(document.createElement('canvas'), { width: 128, height: 128 });
  const ctx = cv.getContext('2d');
  ctx.fillStyle = hex;
  ctx.beginPath();
  ctx.arc(64, 64, 56, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(0,0,0,.35)';
  ctx.stroke();
  ctx.fillStyle = '#0a0f18';
  ctx.font = '700 70px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(letter, 64, 68);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sprite.scale.set(0.085, 0.085, 1);
  sprite.position.z = 0.1;

  group.add(dot, ring, stem, sprite);
  group.userData.ring = ring;
  group.visible = false;
  return group;
}

/**
 * Manages 3D stop markers and animated great-circle route arcs on the globe.
 * Accepts a dynamic list of stops to support multi-stop routes without architectural rewrites.
 * @param {ReturnType<import('./createGlobe.js').createGlobe>} globe
 */
export function createRouteRenderer(globe) {
  const { scene, addUpdater } = globe;
  const markers = new Map();
  let activeRoute = null;

  function ensureMarker(stop) {
    if (!markers.has(stop.id)) {
      const marker = createMarkerMesh(stop.id, stop.color);
      markers.set(stop.id, marker);
      scene.add(marker);
    }
    return markers.get(stop.id);
  }

  function syncMarkers(stops) {
    const activeIds = new Set(stops.map((s) => s.id));
    for (const [id, marker] of markers.entries()) {
      if (!activeIds.has(id)) {
        marker.visible = false;
      }
    }
    stops.forEach((stop) => {
      const marker = ensureMarker(stop);
      if (stop.pt) {
        marker.position.copy(toVec(stop.pt.lat, stop.pt.lon, 1.002));
        marker.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          toVec(stop.pt.lat, stop.pt.lon, 1).normalize(),
        );
        marker.visible = true;
      } else {
        marker.visible = false;
      }
    });
  }

  function clearRoute() {
    if (!activeRoute) return;
    scene.remove(activeRoute.group);
    activeRoute.group.traverse((obj) => {
      obj.geometry?.dispose();
      obj.material?.dispose();
    });
    activeRoute = null;
  }

  function buildLeg(stopA, stopB) {
    const segments = 180;
    const radialSegments = 8;
    const unitA = latLonToCartesian(stopA.pt.lat, stopA.pt.lon, 1);
    const unitB = latLonToCartesian(stopB.pt.lat, stopB.pt.lon, 1);
    const unitPoints = greatCirclePoints(unitA, unitB, segments).map(
      (p) => new THREE.Vector3(p.x, p.y, p.z),
    );

    const dot = Math.min(1, Math.max(-1, unitPoints[0].dot(unitPoints[segments])));
    const theta = Math.acos(dot);
    const arcHeight = 0.03 + 0.2 * (theta / Math.PI);

    const curve = new THREE.CatmullRomCurve3(
      unitPoints.map((u, i) =>
        u.clone().multiplyScalar(1.004 + arcHeight * Math.sin((Math.PI * i) / segments)),
      ),
    );

    const tubeGeo = new THREE.TubeGeometry(curve, segments, 0.0034, radialSegments, false);
    const colors = new Float32Array(tubeGeo.attributes.position.count * 3);
    const cStart = new THREE.Color(stopA.color);
    const cEnd = new THREE.Color(stopB.color);
    const cMid = new THREE.Color(0xfff0c8);
    const colorTmp = new THREE.Color();

    for (let i = 0; i <= segments; i++) {
      const k = i / segments;
      if (k < 0.5) colorTmp.copy(cStart).lerp(cMid, k * 2);
      else colorTmp.copy(cMid).lerp(cEnd, k * 2 - 1);
      for (let j = 0; j <= radialSegments; j++) {
        colors.set([colorTmp.r, colorTmp.g, colorTmp.b], (i * (radialSegments + 1) + j) * 3);
      }
    }
    tubeGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mesh = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({ vertexColors: true }));
    mesh.geometry.setDrawRange(0, 0);

    const trace = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(unitPoints.map((u) => u.clone().multiplyScalar(1.003))),
      new THREE.LineDashedMaterial({
        color: 0xffffff,
        dashSize: 0.014,
        gapSize: 0.012,
        transparent: true,
        opacity: 0.65,
      }),
    );
    trace.computeLineDistances();

    const dotMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.01, 12, 10),
      new THREE.MeshBasicMaterial({ color: 0xfff3c4 }),
    );
    dotMesh.visible = false;

    const legGroup = new THREE.Group();
    legGroup.add(mesh, trace, dotMesh);

    return {
      group: legGroup,
      mesh,
      dot: dotMesh,
      curve,
      segments,
      radialSegments,
      theta,
      mid: unitPoints[segments / 2],
    };
  }

  /**
   * Builds and animates great-circle arcs across all consecutive stops that have coordinates.
   * @param {Array<{id: string, color: number, pt: {lat: number, lon: number} | null}>} stops
   */
  function buildRoute(stops) {
    clearRoute();
    const validStops = stops.filter((s) => s.pt);
    if (validStops.length < 2) return null;

    const group = new THREE.Group();
    const legs = [];
    for (let i = 0; i < validStops.length - 1; i++) {
      const leg = buildLeg(validStops[i], validStops[i + 1]);
      legs.push(leg);
      group.add(leg.group);
    }

    scene.add(group);
    activeRoute = {
      group,
      legs,
      prog: 0,
      theta: legs[0].theta,
      mid: legs[0].mid,
    };

    return activeRoute;
  }

  addUpdater((dt, elapsed) => {
    let idx = 0;
    for (const marker of markers.values()) {
      if (marker.visible) {
        const phase = (elapsed * 0.8 + idx * 0.5) % 1;
        const ring = marker.userData.ring;
        ring.scale.setScalar(1 + phase * 1.1);
        ring.material.opacity = 0.9 * (1 - phase);
      }
      idx++;
    }

    if (activeRoute) {
      activeRoute.prog = Math.min(1, activeRoute.prog + dt / 1.5);
      const eased = 1 - Math.pow(1 - activeRoute.prog, 3);
      for (const leg of activeRoute.legs) {
        leg.mesh.geometry.setDrawRange(
          0,
          Math.floor(eased * leg.segments) * leg.radialSegments * 6,
        );
        if (activeRoute.prog >= 1) {
          leg.dot.visible = true;
          leg.dot.position.copy(leg.curve.getPointAt((elapsed * 0.28) % 1));
        }
      }
    }
  });

  function dispose() {
    clearRoute();
    for (const marker of markers.values()) {
      scene.remove(marker);
      marker.traverse((obj) => {
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
    }
    markers.clear();
  }

  return {
    syncMarkers,
    buildRoute,
    clearRoute,
    hasRoute: () => Boolean(activeRoute),
    dispose,
  };
}
