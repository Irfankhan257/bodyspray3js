import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { fragrances } from '../data/content';
import { experience, pageVariant } from '../lib/experience';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uDeep;
  uniform vec3 uGlow;
  uniform vec3 uAccent;
  uniform float uTime;
  uniform float uAspect;
  uniform float uGlowStrength;
  uniform float uLine;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv - vec2(0.5, 0.5);
    p.x *= uAspect;

    float d = length(p * vec2(0.88, 1.15));
    float core = smoothstep(0.78, 0.0, d);
    float tight = smoothstep(0.34, 0.0, d);

    // slow organic drift
    float n = noise(uv * vec2(3.0, 2.0) + vec2(uTime * 0.018, uTime * 0.012));
    float n2 = noise(uv * vec2(7.0, 5.0) - vec2(uTime * 0.009, uTime * 0.015));

    vec3 col = vec3(0.008, 0.008, 0.009);
    col = mix(col, uDeep, smoothstep(0.95, 0.12, d) * 0.85);
    col += uGlow * pow(core, 2.1) * 0.34 * uGlowStrength;
    col += uAccent * pow(tight, 5.0) * 0.22 * uGlowStrength;
    col += uGlow * (n - 0.5) * 0.035 * core;
    col += uAccent * (n2 - 0.5) * 0.028 * core;

    // top light haze
    float top = smoothstep(0.25, 1.0, uv.y);
    col += vec3(0.018, 0.017, 0.015) * top;

    // bottom falloff into black
    float bottom = smoothstep(0.0, 0.42, uv.y);
    col *= mix(0.32, 1.0, bottom);

    // fine dither to kill banding
    float grain = (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Backdrop() {
  const mesh = useRef();
  const { camera, size } = useThree();
  const forward = useMemo(() => new THREE.Vector3(), []);
  const targetDeep = useMemo(() => new THREE.Color(), []);
  const targetGlow = useMemo(() => new THREE.Color(), []);
  const targetAccent = useMemo(() => new THREE.Color(), []);

  const uniforms = useMemo(
    () => ({
      uDeep: { value: new THREE.Color('#140f0a') },
      uGlow: { value: new THREE.Color('#8a5f2c') },
      uAccent: { value: new THREE.Color('#c9a26a') },
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uGlowStrength: { value: 1 },
      uLine: { value: 0 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const page = experience.page;
    const p = Math.round(page);
    const variant = p <= 1 ? experience.heroIndex : pageVariant(page);
    const f = fragrances[variant];

    targetDeep.set(f.deep);
    targetGlow.set(f.glowA);
    targetAccent.set(f.accent);

    const k = 1 - Math.exp(-2.6 * Math.min(delta, 0.05));
    uniforms.uDeep.value.lerp(targetDeep, k);
    uniforms.uGlow.value.lerp(targetGlow, k);
    uniforms.uAccent.value.lerp(targetAccent, k);
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uAspect.value = size.width / size.height;
    uniforms.uGlowStrength.value +=
      ((p >= 2 ? 1.0 : 0.9) - uniforms.uGlowStrength.value) * k;

    if (mesh.current) {
      camera.getWorldDirection(forward);
      mesh.current.position.copy(camera.position).addScaledVector(forward, 24);
      mesh.current.quaternion.copy(camera.quaternion);
      const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 24;
      const w = h * camera.aspect;
      mesh.current.scale.set(w * 1.25, h * 1.25, 1);
    }
  });

  return (
    <mesh ref={mesh} renderOrder={-1000} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
