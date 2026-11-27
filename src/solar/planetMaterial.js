import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uSunDir;
  uniform float uAmbient;
  varying vec2 vUv;
  varying vec3 vNormalW;
  void main() {
    vec3 albedo = texture2D(uMap, vUv).rgb;
    float d = clamp(dot(normalize(vNormalW), uSunDir), 0.0, 1.0);
    float shade = uAmbient + (1.0 - uAmbient) * pow(d, 0.75);
    gl_FragColor = vec4(albedo * shade * 1.25, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/**
 * Lambert-style material lit by a world-space direction towards the Sun.
 * It deliberately ignores scene lights so the Earth's camera-fixed light
 * doesn't leak onto the other bodies.
 * @param {string} baseColor '#rrggbb' colour shown until the real texture is ready
 */
export function createPlanetMaterial(baseColor) {
  const bytes = [1, 3, 5].map((i) => parseInt(baseColor.slice(i, i + 2), 16));
  const placeholder = new THREE.DataTexture(new Uint8Array([...bytes, 255]), 1, 1);
  placeholder.colorSpace = THREE.SRGBColorSpace;
  placeholder.needsUpdate = true;

  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: placeholder },
      uSunDir: { value: new THREE.Vector3(1, 0, 0) },
      uAmbient: { value: 0.1 },
    },
    vertexShader,
    fragmentShader,
  });
}

/**
 * Swaps in the finished canvas texture.
 * @param {THREE.ShaderMaterial} material
 * @param {HTMLCanvasElement} canvas
 * @param {number} anisotropy
 */
export function setPlanetTexture(material, canvas, anisotropy = 4) {
  const old = material.uniforms.uMap.value;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  tex.wrapS = THREE.RepeatWrapping;
  material.uniforms.uMap.value = tex;
  old?.dispose();
}
