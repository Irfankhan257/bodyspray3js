import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { makeDotTexture } from '../lib/labels';
import { experience } from '../lib/experience';

const rand = (min, max) => min + Math.random() * (max - min);

export default function Dust() {
  const group = useRef();
  const dot = useMemo(() => makeDotTexture(), []);

  const { dustPositions, bokehPositions } = useMemo(() => {
    const dust = new Float32Array(260 * 3);
    const bokeh = new Float32Array(42 * 3);
    for (let i = 0; i < 260; i++) {
      dust[i * 3] = rand(-11, 11);
      dust[i * 3 + 1] = rand(-5, 5);
      dust[i * 3 + 2] = rand(-5, 2.5);
    }
    for (let i = 0; i < 42; i++) {
      bokeh[i * 3] = rand(-9, 9);
      bokeh[i * 3 + 1] = rand(-4, 4);
      bokeh[i * 3 + 2] = rand(-6, 1.5);
    }
    return { dustPositions: dust, bokehPositions: bokeh };
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    const reduced = experience.reducedMotion;
    group.current.rotation.y = reduced ? 0 : Math.sin(t * 0.035) * 0.22;
    group.current.rotation.x = reduced ? 0 : Math.cos(t * 0.028) * 0.06;
    group.current.position.y = reduced ? 0 : Math.sin(t * 0.12) * 0.12;
  });

  return (
    <group ref={group} renderOrder={2}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={dot}
          color="#f4e9d8"
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bokehPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          map={dot}
          color="#ffffff"
          size={0.22}
          sizeAttenuation
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
