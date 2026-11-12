import React, { useMemo } from 'react';
import * as THREE from 'three';

const BODY_PROFILE = [
  [0.0, -1.24],
  [0.42, -1.24],
  [0.5, -1.21],
  [0.545, -1.14],
  [0.558, -1.02],
  [0.558, 0.94],
  [0.55, 1.06],
  [0.515, 1.15],
  [0.45, 1.23],
  [0.36, 1.29],
  [0.285, 1.33],
  [0.248, 1.37],
  [0.24, 1.43],
  [0.24, 1.54],
];

const bodyGeometry = new THREE.LatheGeometry(
  BODY_PROFILE.map(([x, y]) => new THREE.Vector2(x, y)),
  72,
);

const labelGeometry = new THREE.CylinderGeometry(0.566, 0.566, 1.88, 72, 1, true);
const baseRingGeometry = new THREE.CylinderGeometry(0.565, 0.565, 0.035, 72, 1, true);
const shoulderRingGeometry = new THREE.CylinderGeometry(0.555, 0.555, 0.024, 72, 1, true);
const collarGeometry = new THREE.CylinderGeometry(0.305, 0.325, 0.07, 48);
const capGeometry = new THREE.CylinderGeometry(0.286, 0.286, 0.44, 48);
const capTopGeometry = new THREE.CylinderGeometry(0.286, 0.286, 0.012, 48);
const rimGeometry = new THREE.TorusGeometry(0.278, 0.014, 10, 48);
const actuatorGeometry = new THREE.BoxGeometry(0.36, 0.095, 0.235);
const nozzleGeometry = new THREE.CylinderGeometry(0.045, 0.045, 0.12, 20);
const nozzleTipGeometry = new THREE.CylinderGeometry(0.024, 0.024, 0.025, 16);
const topDetailGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.008, 32);

export const NOZZLE_LOCAL = new THREE.Vector3(0, 2.075, 0.26);

export default function Bottle({ fragrance, labelTexture, capBump, opacity = 1 }) {
  const materials = useMemo(() => {
    const body = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(fragrance.metal),
      metalness: 0.94,
      roughness: 0.24,
      clearcoat: 0.45,
      clearcoatRoughness: 0.18,
      envMapIntensity: 1.25,
      transparent: true,
      opacity: 1,
    });

    const accent = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(fragrance.accent),
      metalness: 0.9,
      roughness: 0.26,
      clearcoat: 0.6,
      clearcoatRoughness: 0.18,
      envMapIntensity: 1.2,
      transparent: true,
      opacity: 1,
    });

    const cap = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#111110'),
      metalness: 0.82,
      roughness: 0.28,
      clearcoat: 1,
      clearcoatRoughness: 0.14,
      envMapIntensity: 1.1,
      bumpMap: capBump,
      bumpScale: 0.012,
      transparent: true,
      opacity: 1,
    });

    const label = new THREE.MeshPhysicalMaterial({
      map: labelTexture,
      color: new THREE.Color('#ffffff'),
      metalness: 0.18,
      roughness: 0.4,
      clearcoat: 0.7,
      clearcoatRoughness: 0.28,
      envMapIntensity: 0.75,
      transparent: true,
      opacity: 1,
    });

    const rubber = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0a0a0a'),
      metalness: 0.2,
      roughness: 0.7,
      transparent: true,
      opacity: 1,
    });

    return { body, accent, cap, label, rubber };
  }, [fragrance, labelTexture, capBump]);

  // Keep opacity in sync without re-creating materials each frame.
  useMemo(() => {
    const set = new Set(Object.values(materials));
    set.forEach((m) => {
      m.opacity = opacity;
      m.visible = opacity > 0.002;
    });
  }, [materials, opacity]);

  return (
    <group>
      {/* aluminium body */}
      <mesh geometry={bodyGeometry} material={materials.body} castShadow receiveShadow />

      {/* printed label wrap */}
      <mesh geometry={labelGeometry} material={materials.label} rotation={[0, -Math.PI / 2, 0]} />

      {/* foil rings */}
      <mesh geometry={baseRingGeometry} material={materials.accent} position={[0, -0.99, 0]} />
      <mesh geometry={shoulderRingGeometry} material={materials.accent} position={[0, 0.96, 0]} />

      {/* collar + actuator cap */}
      <mesh geometry={collarGeometry} material={materials.accent} position={[0, 1.545, 0]} />
      <mesh geometry={capGeometry} material={materials.cap} position={[0, 1.79, 0]} />
      <mesh geometry={capTopGeometry} material={materials.cap} position={[0, 2.012, 0]} />
      <mesh geometry={rimGeometry} material={materials.accent} position={[0, 2.008, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={topDetailGeometry} material={materials.accent} position={[0, 2.019, 0]} />

      {/* spray head */}
      <mesh geometry={actuatorGeometry} material={materials.cap} position={[0, 2.062, 0.015]} />
      <mesh geometry={nozzleGeometry} material={materials.cap} position={[0, 2.068, 0.175]} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nozzleTipGeometry} material={materials.rubber} position={[0, 2.068, 0.242]} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}
