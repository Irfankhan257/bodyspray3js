import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

import Bottle from './Bottle';
import Backdrop from './Backdrop';
import Dust from './Dust';
import Mist from './Mist';
import {
  createSceneState,
  displayWeights,
  lineupTransform,
  sampleScene,
} from './choreography';
import {
  carousel,
  clamp,
  damp,
  experience,
  HERO_REPEATS,
  HERO_SPACING,
  mod,
  pageVariant,
  ui,
} from '../lib/experience';
import { fragrances } from '../data/content';
import { getLabelTextures, makeCapBump } from '../lib/labels';

const TOTAL_CAROUSEL = fragrances.length * HERO_REPEATS;
const HALF_RANGE = (TOTAL_CAROUSEL * HERO_SPACING) / 2;

const wrap = (value) => {
  const size = HALF_RANGE * 2;
  let v = ((value + HALF_RANGE) % size + size) % size - HALF_RANGE;
  return v;
};

const tmpVec = new THREE.Vector3();
const camTarget = new THREE.Vector3();
const camGoal = new THREE.Vector3();
const targetRim = new THREE.Color();
const targetAccent = new THREE.Color();
const linePos = { x: 0, y: 0, z: 0, ry: 0, rz: 0, scale: 1 };
const weights = [0, 0, 0, 0, 0];

const setGroupOpacity = (group, opacity, cache) => {
  if (!group) return;
  const last = cache.get(group);
  if (last !== undefined && Math.abs(last - opacity) < 0.002) return;
  cache.set(group, opacity);
  group.visible = opacity > 0.003;
  group.traverse((o) => {
    if (o.isMesh && o.material) {
      o.material.opacity = opacity;
      o.material.transparent = true;
      o.material.depthWrite = opacity > 0.965;
    }
  });
};

function Lights() {
  const key = useRef();
  const rim = useRef();
  const spot = useRef();
  const accent = useRef();
  const fill = useRef();
  const keyIntensity = useRef(30);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const page = clamp(experience.page, 0, 11);
    const variant = Math.round(page) <= 1 ? experience.heroIndex : pageVariant(page);
    const f = fragrances[variant];
    const sceneState = sampleScene(page);

    targetRim.set(f.accent);
    targetAccent.set(f.accentSoft);

    keyIntensity.current = damp(keyIntensity.current, sceneState.keyLight * 34, 4, dt);

    if (key.current) {
      key.current.intensity = keyIntensity.current;
      key.current.position.x = 2.4 + Math.sin(state.clock.elapsedTime * 0.18) * 0.4;
    }
    if (rim.current) {
      rim.current.intensity = damp(rim.current.intensity, sceneState.rim * 20, 4, dt);
      rim.current.color.lerp(targetRim, 1 - Math.exp(-3 * dt));
      rim.current.position.x = -1.2 + Math.sin(state.clock.elapsedTime * 0.22) * 0.5;
    }
    if (spot.current) {
      spot.current.intensity = damp(spot.current.intensity, sceneState.spot * 45, 4, dt);
    }
    if (accent.current) {
      accent.current.color.lerp(targetAccent, 1 - Math.exp(-3 * dt));
      accent.current.intensity = damp(accent.current.intensity, 3 + sceneState.rim * 3, 4, dt);
    }
    if (fill.current) {
      fill.current.intensity = damp(fill.current.intensity, 4.5 + sceneState.keyLight * 2, 4, dt);
    }
  });

  return (
    <>
      <ambientLight intensity={0.16} color="#c9c3ba" />
      <spotLight
        ref={key}
        position={[2.4, 5.2, 4.6]}
        angle={0.62}
        penumbra={1}
        intensity={34}
        distance={24}
        color="#fff3e2"
      />
      <spotLight
        ref={rim}
        position={[-1.2, 1.6, -3.4]}
        angle={1.15}
        penumbra={1}
        intensity={14}
        distance={18}
        color="#c9a26a"
      />
      <spotLight
        ref={spot}
        position={[0, 6.5, 2]}
        angle={0.32}
        penumbra={0.9}
        intensity={20}
        distance={22}
        color="#fff8ef"
      />
      <pointLight ref={accent} position={[0, -0.4, -2.2]} intensity={5} color="#c9a26a" distance={9} />
      <pointLight ref={fill} position={[-4.5, 1.2, 3.5]} intensity={6} color="#9dbbd6" distance={16} />
    </>
  );
}

function StudioEnvironment() {
  return (
    <Environment resolution={128} frames={1} background={false}>
      <Lightformer
        form="rect"
        intensity={4.5}
        color="#fff6ea"
        scale={[12, 5, 1]}
        position={[0, 6, -5]}
        rotation={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={2.6}
        color="#ffffff"
        scale={[3, 8, 1]}
        position={[-6, 1, 2]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Lightformer
        form="rect"
        intensity={2.2}
        color="#dfe9ff"
        scale={[3, 8, 1]}
        position={[6, 1, 2]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <Lightformer
        form="ring"
        intensity={3}
        color="#ffe3ba"
        scale={5}
        position={[0, 1.5, -7]}
        rotation={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={1.4}
        color="#ffffff"
        scale={[10, 3, 1]}
        position={[0, -5, 1]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </Environment>
  );
}

function SceneEffects() {
  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.72}
        luminanceSmoothing={0.24}
        mipmapBlur
        radius={0.7}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.00045, 0.00055]}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette offset={0.18} darkness={0.82} eskil={false} />
      <Noise opacity={0.032} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
}

export default function Experience() {
  const [labels, setLabels] = useState(null);
  const [capBump] = useState(() => makeCapBump());
  const { camera, size } = useThree();

  const carouselGroup = useRef();
  const carouselRefs = useRef([]);
  const displayGroup = useRef();
  const displayRefs = useRef([]);
  const opacityCache = useRef(new Map());
  const lastIndex = useRef(0);
  const lastVariant = useRef(0);
  const sceneState = useMemo(() => createSceneState(), []);
  const cameraTargetSmooth = useRef(new THREE.Vector3(0, 0.1, 0));
  const cameraPosSmooth = useRef(new THREE.Vector3(0, 0.15, 30));
  const lastFov = useRef(22);
  const intro = useRef(1);
  const dragging = useRef({
    active: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    velocity: 0,
    moved: 0,
    axis: 0,
  });

  useEffect(() => {
    let mounted = true;
    getLabelTextures().then((map) => {
      if (!mounted) return;
      setLabels(map);
      experience.ready = true;
      window.dispatchEvent(new CustomEvent('noire:ready'));
    });
    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------- pointer / drag ------------------------- */
  useEffect(() => {
    const isInteractive = (el) =>
      el && el.closest && el.closest('a, button, input, textarea, select, [data-ui]');

    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      experience.pointerX = nx;
      experience.pointerY = -ny;

      const d = dragging.current;
      if (!d.active) return;
      const dx = e.clientX - d.lastX;
      const dy = e.clientY - d.startY;
      d.lastX = e.clientX;
      d.moved += Math.abs(dx);
      experience.dragMoved = d.moved;

      if (d.axis === 0) {
        if (Math.abs(e.clientX - d.startX) > 4 || Math.abs(dy) > 4) {
          d.axis = Math.abs(e.clientX - d.startX) > Math.abs(dy) ? 1 : 2;
        }
      }
      if (d.axis === 1) {
        experience.carouselTarget -= dx * 0.018;
        d.velocity = -dx * 0.018;
        experience.dragging = true;
        document.documentElement.classList.add('is-dragging');
      }
    };

    const onDown = (e) => {
      if (e.target.tagName !== 'CANVAS') return;
      if (isInteractive(e.target)) return;
      if (!experience.loaderDone) return;
      if (experience.page > 0.75) return;
      if (e.button !== undefined && e.button !== 0) return;
      const d = dragging.current;
      d.active = true;
      d.startX = e.clientX;
      d.startY = e.clientY;
      d.lastX = e.clientX;
      d.velocity = 0;
      d.moved = 0;
      d.axis = 0;
    };

    const onUp = () => {
      const d = dragging.current;
      if (!d.active) return;
      d.active = false;
      if (d.axis === 1) {
        experience.carouselTarget += d.velocity * 8;
        carousel.snap();
        setTimeout(() => {
          d.moved = 0;
          experience.dragMoved = 0;
        }, 60);
      }
      experience.dragging = false;
      document.documentElement.classList.remove('is-dragging');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  /* ---------------------------- frame loop -------------------------- */
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;

    if (experience.loaderDone) intro.current = damp(intro.current, 0, 1.35, dt);
    const introValue = experience.reducedMotion ? 0 : intro.current;

    const page = clamp(experience.page, 0, 11);
    const stateValues = sampleScene(page, sceneState);

    /* camera ------------------------------------------------------- */
    const aspect = size.width / size.height;
    const mobileBoost = aspect < 1 ? 1.32 + (1 - aspect) * 0.42 : 1;

    const px = experience.reducedMotion ? 0 : experience.pointerX;
    const py = experience.reducedMotion ? 0 : experience.pointerY;
    const par = stateValues.parallax;

    camGoal.set(
      stateValues.cam[0] + px * 0.55 * par + Math.sin(time * 0.21) * 0.045,
      stateValues.cam[1] + py * 0.35 * par + Math.cos(time * 0.17) * 0.035 + introValue * 1.4,
      stateValues.cam[2] * mobileBoost + introValue * 9,
    );

    cameraPosSmooth.current.lerp(camGoal, 1 - Math.exp(-5.2 * dt));
    camera.position.copy(cameraPosSmooth.current);

    const targetX = stateValues.target[0] + px * 0.14 * par;
    const targetY = stateValues.target[1] + py * 0.08 * par;
    const targetZ = stateValues.target[2];
    camTarget.set(targetX, targetY, targetZ);
    cameraTargetSmooth.current.lerp(camTarget, 1 - Math.exp(-6 * dt));
    camera.lookAt(cameraTargetSmooth.current);
    if (!experience.reducedMotion) {
      camera.rotation.z += Math.sin(time * 0.14) * 0.0035 + stateValues.tilt[2] * 0.16;
    }

    const fov = stateValues.fov + (aspect < 1 ? 2 : 0);
    lastFov.current = damp(lastFov.current, fov, 5, dt);
    if (Math.abs(camera.fov - lastFov.current) > 0.005) {
      camera.fov = lastFov.current;
      camera.updateProjectionMatrix();
    }

    /* carousel ----------------------------------------------------- */
    experience.carouselPosition = damp(
      experience.carouselPosition,
      experience.carouselTarget,
      experience.dragging ? 14 : 7.5,
      dt,
    );

    const cIndex = mod(Math.round(experience.carouselPosition / HERO_SPACING), fragrances.length);
    if (cIndex !== lastIndex.current) {
      lastIndex.current = cIndex;
      ui.setHeroIndex(cIndex);
    }

    const carouselScale = 1 - introValue * 0.18;
    if (carouselGroup.current) {
      carouselGroup.current.position.z = stateValues.carouselZ;
      carouselGroup.current.position.y = 0;
      carouselGroup.current.scale.setScalar(carouselScale);
    }

    const carouselOpacity = stateValues.carousel * (1 - introValue * 0.45);
    for (let i = 0; i < TOTAL_CAROUSEL; i++) {
      const group = carouselRefs.current[i];
      if (!group) continue;
      const itemIndex = i;
      const variant = i % fragrances.length;
      const raw = wrap(itemIndex * HERO_SPACING - experience.carouselPosition);
      const x = raw * (1 + introValue * 0.24);
      const falloff = 1 - Math.min(Math.abs(x) * 0.011, 0.17);
      const waveY = Math.sin(raw * 0.56) * 0.15 + Math.sin(time * 0.55 + i * 1.4) * 0.025;
      const y = waveY * (1 - clamp(page, 0, 1) * 0.7);
      const z = -Math.abs(raw) * 0.065;

      group.position.set(x, y, z);
      group.rotation.set(
        -0.018 + Math.sin(time * 0.3 + i) * 0.008,
        -0.16 + raw * 0.052 + Math.sin(time * 0.27 + i * 1.2) * 0.035 + px * 0.035,
        raw * 0.007,
      );
      group.scale.setScalar(falloff * (0.94 + introValue * 0.1));

      setGroupOpacity(group, carouselOpacity, opacityCache.current);
    }

    /* display bottles ---------------------------------------------- */
    displayWeights(page, weights);
    const lineupT = stateValues.lineup;
    const activeVariant =
      Math.round(page) <= 1 ? experience.heroIndex : pageVariant(page);

    if (activeVariant !== lastVariant.current) {
      lastVariant.current = activeVariant;
      experience.pageVariant = activeVariant;
    }

    const pageCenter = Math.round(page);
    const scrollSpin = (page - pageCenter) * 0.42;

    for (let i = 0; i < fragrances.length; i++) {
      const group = displayRefs.current[i];
      if (!group) continue;
      const w = weights[i];
      const opacity = stateValues.display * w;
      const lp = lineupTransform(i, linePos);

      const floatY = experience.reducedMotion ? 0 : Math.sin(time * 0.55 + i * 1.7) * 0.025;
      const x = (i - 2) * 0.012 * (1 - lineupT) + lp.x * lineupT;
      const y = floatY + lp.y * lineupT;
      const z = (i - 2) * 0.006 * (1 - lineupT) + lp.z * lineupT;

      const profileRy =
        stateValues.spin +
        scrollSpin +
        (experience.reducedMotion ? 0 : Math.sin(time * 0.33 + i * 1.4) * 0.085) +
        px * 0.06;
      const lineupRy = lp.ry + (experience.reducedMotion ? 0 : Math.sin(time * 0.3 + i) * 0.025);
      const ry = profileRy * (1 - lineupT) + lineupRy * lineupT;
      const rz = stateValues.tilt[2] * (1 - lineupT) + lp.rz * lineupT;
      const rx = stateValues.tilt[0] * (1 - lineupT);

      group.position.set(x, y, z);
      group.rotation.set(rx, ry, rz);
      group.scale.setScalar(
        stateValues.displayScale * (0.965 + 0.035 * w) * (1 - introValue * 0.16) *
          (lineupT > 0 ? 1 - (1 - lp.scale) * lineupT : 1),
      );

      setGroupOpacity(group, opacity, opacityCache.current);
    }

    /* smooth pointer for shader / future use ----------------------- */
    experience.smoothPointerX = damp(experience.smoothPointerX, px, 6, dt);
    experience.smoothPointerY = damp(experience.smoothPointerY, py, 6, dt);
  });

  /* ------------------------------ click ---------------------------- */
  const handleBottleClick = (e, i, x) => {
    e.stopPropagation();
    if (experience.dragMoved > 7) return;
    if (experience.page > 0.75) return;
    if (Math.abs(x) < HERO_SPACING * 0.42) {
      window.dispatchEvent(
        new CustomEvent('noire:go', { detail: { page: 2 + (i % fragrances.length) } }),
      );
    } else {
      carousel.goToIndex(i % fragrances.length);
    }
  };

  const handleHover = (hover) => {
    ui.setHoverBottle(hover);
    document.documentElement.classList.toggle('is-hovering-bottle', hover);
  };

  if (!labels) {
    return (
      <>
        <Backdrop />
        <Lights />
      </>
    );
  }

  return (
    <>
      <Backdrop />
      <Lights />
      <StudioEnvironment />
      <Dust />

      <group ref={carouselGroup}>
        {Array.from({ length: TOTAL_CAROUSEL }).map((_, i) => {
          const variant = i % fragrances.length;
          const f = fragrances[variant];
          return (
            <group
              key={`carousel-${i}`}
              ref={(el) => {
                carouselRefs.current[i] = el;
              }}
              onClick={(e) => handleBottleClick(e, i, wrap(i * HERO_SPACING - experience.carouselPosition))}
              onPointerOver={(e) => {
                e.stopPropagation();
                handleHover(true);
              }}
              onPointerOut={() => handleHover(false)}
            >
              <Bottle
                fragrance={f}
                labelTexture={labels.get(f.id)}
                capBump={capBump}
                opacity={1}
              />
            </group>
          );
        })}
      </group>

      <group ref={displayGroup}>
        {fragrances.map((f, i) => (
          <group
            key={`display-${f.id}`}
            name={`display-bottle-${i}`}
            ref={(el) => {
              displayRefs.current[i] = el;
            }}
          >
            <Bottle
              fragrance={f}
              labelTexture={labels.get(f.id)}
              capBump={capBump}
              opacity={1}
            />
          </group>
        ))}
      </group>

      <Mist />

      <ContactShadows
        position={[0, -1.36, 0]}
        opacity={0.42}
        scale={14}
        blur={2.6}
        far={4.2}
        resolution={256}
        color="#000000"
        frames={Infinity}
      />

      <SceneEffects />
    </>
  );
}
