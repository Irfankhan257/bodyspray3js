import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { experience, pageVariant } from '../lib/experience';
import { fragrances } from '../data/content';

const COUNT = 150;

const vertexShader = /* glsl */ `
  attribute float aAlpha;
  attribute float aSize;
  varying float vAlpha;
  uniform float uPixelRatio;
  void main() {
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (320.0 / max(-mv.z, 0.1)) * uPixelRatio;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  uniform vec3 uColor;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float d = length(p);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.02, d) * vAlpha;
    gl_FragColor = vec4(uColor, a);
  }
`;

export default function Mist() {
  const points = useRef();
  const burstRef = useRef(-1);
  const data = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const alpha = new Float32Array(COUNT);
    const size = new Float32Array(COUNT);
    const vel = new Float32Array(COUNT * 3);
    const life = new Float32Array(COUNT);
    const maxLife = new Float32Array(COUNT);
    return { positions, alpha, size, vel, life, maxLife };
  }, []);

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color('#f2e6d2') },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
    }),
    [],
  );

  const spawn = (origin, color) => {
    uniforms.uColor.value.set(color);
    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spread = Math.random() * 0.22;
      const speed = 0.55 + Math.random() * 1.25;
      data.positions[i * 3] = origin.x + Math.cos(angle) * spread;
      data.positions[i * 3 + 1] = origin.y + Math.sin(angle) * spread;
      data.positions[i * 3 + 2] = origin.z + (Math.random() - 0.5) * 0.1;
      data.vel[i * 3] = Math.cos(angle) * 0.12 * speed;
      data.vel[i * 3 + 1] = (Math.random() * 0.35 + 0.05) * speed;
      data.vel[i * 3 + 2] = (0.55 + Math.random() * 0.9) * speed;
      data.maxLife[i] = 0.55 + Math.random() * 0.85;
      data.life[i] = data.maxLife[i];
      data.size[i] = 0.022 + Math.random() * 0.05;
      data.alpha[i] = 0;
    }
  };

  useFrame((state, delta) => {
    if (!points.current) return;
    const dt = Math.min(delta, 0.05);

    if (experience.mistBurst !== burstRef.current) {
      burstRef.current = experience.mistBurst;
      const page = experience.page;
      if (page > 1.2 && page < 10.8) {
        const variant = pageVariant(page);
        const f = fragrances[variant];
        const active = points.current.parent?.getObjectByName(`display-bottle-${variant}`);
        const origin = active
          ? active.localToWorld(new THREE.Vector3(0, 2.06, 0.28))
          : new THREE.Vector3(0, 2.05, 0.3);
        spawn(origin, f.accentSoft);
      }
    }

    let alive = false;
    for (let i = 0; i < COUNT; i++) {
      if (data.life[i] <= 0) {
        data.alpha[i] = 0;
        continue;
      }
      alive = true;
      data.life[i] -= dt;
      const t = Math.max(data.life[i], 0) / data.maxLife[i];
      data.positions[i * 3] += data.vel[i * 3] * dt;
      data.positions[i * 3 + 1] += data.vel[i * 3 + 1] * dt;
      data.positions[i * 3 + 2] += data.vel[i * 3 + 2] * dt;
      data.vel[i * 3 + 2] *= 0.965;
      data.vel[i * 3 + 1] -= 0.12 * dt;
      data.alpha[i] = Math.sin(Math.min(1, (1 - t) * 5) * Math.PI * 0.5) * Math.pow(t, 1.5) * 0.5;
      data.size[i] *= 1.006;
    }

    const geo = points.current.geometry;
    geo.attributes.position.needsUpdate = true;
    geo.attributes.aAlpha.needsUpdate = true;
    geo.attributes.aSize.needsUpdate = true;
    points.current.visible = alive;
  });

  return (
    <points ref={points} renderOrder={5} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-aAlpha" args={[data.alpha, 1]} />
        <bufferAttribute attach="attributes-aSize" args={[data.size, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
