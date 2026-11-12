import { clamp, lerp, smoothstep } from '../lib/experience';

/**
 * One keyframe per cinematic page. Values are interpolated as the user
 * scrolls between pages, giving the camera / product a continuous path.
 */
export const SCENE_KEYS = [
  // 00 — HERO
  {
    cam: [0, 0.15, 30],
    target: [0, 0.1, 0],
    fov: 22,
    carousel: 1,
    carouselZ: 0,
    display: 0,
    displayScale: 1,
    lineup: 0,
    parallax: 1,
    keyLight: 1.15,
    rim: 0.65,
    glow: 1.0,
    spin: 0,
    tilt: [0, 0, 0],
    spot: 0.0,
  },
  // 01 — MANIFESTO
  {
    cam: [0, 1.1, 21],
    target: [0, 0.35, 0],
    fov: 26,
    carousel: 0.16,
    carouselZ: -7,
    display: 0,
    displayScale: 0.9,
    lineup: 0,
    parallax: 0.55,
    keyLight: 0.55,
    rim: 0.25,
    glow: 0.65,
    spin: 0,
    tilt: [0, 0, 0],
    spot: 0.0,
  },
  // 02 — NOIR
  {
    cam: [2.45, 0.35, 9.6],
    target: [0, 0.02, 0],
    fov: 31,
    carousel: 0,
    carouselZ: 0,
    display: 1,
    displayScale: 1.0,
    lineup: 0,
    parallax: 0.45,
    keyLight: 1.05,
    rim: 1.5,
    glow: 0.95,
    spin: -0.28,
    tilt: [-0.03, 0, -0.055],
    spot: 0.55,
  },
  // 03 — AURA
  {
    cam: [-2.35, 0.72, 9.15],
    target: [0, 0.03, 0],
    fov: 31,
    carousel: 0,
    carouselZ: 0,
    display: 1,
    displayScale: 1.0,
    lineup: 0,
    parallax: 0.45,
    keyLight: 1.15,
    rim: 1.6,
    glow: 1.05,
    spin: 0.34,
    tilt: [0.02, 0, 0.06],
    spot: 0.5,
  },
  // 04 — ROUGE
  {
    cam: [2.7, -0.32, 8.95],
    target: [0, 0.04, 0],
    fov: 32,
    carousel: 0,
    carouselZ: 0,
    display: 1,
    displayScale: 1.0,
    lineup: 0,
    parallax: 0.45,
    keyLight: 1.0,
    rim: 1.65,
    glow: 1.1,
    spin: -0.46,
    tilt: [-0.04, 0, -0.075],
    spot: 0.55,
  },
  // 05 — VERT
  {
    cam: [-2.2, -0.15, 9.4],
    target: [0, 0.02, 0],
    fov: 31,
    carousel: 0,
    carouselZ: 0,
    display: 1,
    displayScale: 1.0,
    lineup: 0,
    parallax: 0.45,
    keyLight: 1.1,
    rim: 1.5,
    glow: 0.95,
    spin: 0.26,
    tilt: [0.03, 0, 0.045],
    spot: 0.5,
  },
  // 06 — ÉCLAT
  {
    cam: [0, 0.9, 8.65],
    target: [0, 0.06, 0],
    fov: 30,
    carousel: 0,
    carouselZ: 0,
    display: 1,
    displayScale: 1.02,
    lineup: 0,
    parallax: 0.4,
    keyLight: 1.2,
    rim: 1.35,
    glow: 0.9,
    spin: 0.02,
    tilt: [0, 0, 0.0],
    spot: 0.45,
  },
  // 07 — CRAFT 01
  {
    cam: [2.1, 0.18, 10.6],
    target: [0, 0.05, 0],
    fov: 29,
    carousel: 0,
    carouselZ: 0,
    display: 1,
    displayScale: 0.94,
    lineup: 0,
    parallax: 0.35,
    keyLight: 0.9,
    rim: 1.35,
    glow: 0.8,
    spin: -0.38,
    tilt: [-0.05, 0, -0.05],
    spot: 0.95,
  },
  // 08 — CRAFT 02
  {
    cam: [-2.3, 0.55, 10.2],
    target: [0, 0.05, 0],
    fov: 29,
    carousel: 0,
    carouselZ: 0,
    display: 1,
    displayScale: 0.96,
    lineup: 0,
    parallax: 0.35,
    keyLight: 1.0,
    rim: 1.3,
    glow: 0.85,
    spin: 0.32,
    tilt: [0.03, 0, 0.06],
    spot: 0.9,
  },
  // 09 — CRAFT 03
  {
    cam: [1.9, -0.55, 10.9],
    target: [0, 0.02, 0],
    fov: 30,
    carousel: 0,
    carouselZ: 0,
    display: 1,
    displayScale: 0.92,
    lineup: 0,
    parallax: 0.35,
    keyLight: 0.85,
    rim: 1.4,
    glow: 0.8,
    spin: 0.55,
    tilt: [-0.04, 0, 0.07],
    spot: 0.95,
  },
  // 10 — CRAFT 04
  {
    cam: [-1.75, 0.7, 10.4],
    target: [0, 0.06, 0],
    fov: 29,
    carousel: 0,
    carouselZ: 0,
    display: 1,
    displayScale: 0.95,
    lineup: 0,
    parallax: 0.35,
    keyLight: 1.05,
    rim: 1.3,
    glow: 0.85,
    spin: -0.18,
    tilt: [0.02, 0, -0.03],
    spot: 0.9,
  },
  // 11 — LINEUP
  {
    cam: [0, 0.35, 17.8],
    target: [0, 0.15, 0],
    fov: 30,
    carousel: 0,
    carouselZ: 0,
    display: 1,
    displayScale: 0.95,
    lineup: 1,
    parallax: 0.25,
    keyLight: 1.2,
    rim: 0.9,
    glow: 0.8,
    spin: 0,
    tilt: [0, 0, 0],
    spot: 0.35,
  },
];

export const createSceneState = () => ({
  cam: [0, 0.15, 30],
  target: [0, 0.1, 0],
  fov: 22,
  carousel: 1,
  carouselZ: 0,
  display: 0,
  displayScale: 1,
  lineup: 0,
  parallax: 1,
  keyLight: 1.15,
  rim: 0.65,
  glow: 1.0,
  spin: 0,
  tilt: [0, 0, 0],
  spot: 0.0,
});

const mix = (a, b, t) => a + (b - a) * t;

export const sampleScene = (page, out = createSceneState()) => {
  const clamped = clamp(page, 0, SCENE_KEYS.length - 1);
  const i0 = Math.floor(clamped);
  const i1 = Math.min(i0 + 1, SCENE_KEYS.length - 1);
  const raw = clamped - i0;
  const t = smoothstep(raw);
  const a = SCENE_KEYS[i0];
  const b = SCENE_KEYS[i1];

  for (let i = 0; i < 3; i++) {
    out.cam[i] = mix(a.cam[i], b.cam[i], t);
    out.target[i] = mix(a.target[i], b.target[i], t);
    out.tilt[i] = mix(a.tilt[i], b.tilt[i], t);
  }

  out.fov = mix(a.fov, b.fov, t);
  out.carousel = mix(a.carousel, b.carousel, t);
  out.carouselZ = mix(a.carouselZ, b.carouselZ, t);
  out.display = mix(a.display, b.display, t);
  out.displayScale = mix(a.displayScale, b.displayScale, t);
  out.lineup = mix(a.lineup, b.lineup, t);
  out.parallax = mix(a.parallax, b.parallax, t);
  out.keyLight = mix(a.keyLight, b.keyLight, t);
  out.rim = mix(a.rim, b.rim, t);
  out.glow = mix(a.glow, b.glow, t);
  out.spin = mix(a.spin, b.spin, t);
  out.spot = mix(a.spot, b.spot, t);
  return out;
};

/**
 * Weight of each fragrance bottle at a given continuous page.
 * Triangular windows create a clean crossfade while scrolling.
 */
export const displayWeights = (page, out = [0, 0, 0, 0, 0]) => {
  for (let i = 0; i < 5; i++) out[i] = 0;

  const p = clamp(page, 0, 11);

  const addWindow = (center, variant, width = 0.9) => {
    const w = clamp(1 - Math.abs(p - center) / width, 0, 1);
    if (w > 0) out[variant] = Math.max(out[variant], smoothstep(w));
  };

  // Manifesto fades into NOIR
  addWindow(1.55, 0, 0.95);

  // Fragrance pages 2 → 6
  for (let i = 0; i < 5; i++) addWindow(2 + i, i, 1.0);

  // Craft pages 7 → 10 (NOIR, AURA, VERT, ÉCLAT)
  addWindow(7, 0, 0.95);
  addWindow(8, 1, 0.95);
  addWindow(9, 3, 0.95);
  addWindow(10, 4, 0.95);

  // Lineup: every bottle fades in
  const lineupIn = smoothstep(clamp((p - 10.35) / 0.65, 0, 1));
  if (lineupIn > 0) {
    for (let i = 0; i < 5; i++) out[i] = mix(out[i], 1, lineupIn);
  }

  return out;
};

export const lineupTransform = (i, out = { x: 0, y: 0, z: 0, ry: 0, rz: 0, scale: 1 }) => {
  const d = i - 2;
  out.x = d * 2.02;
  out.y = 0.03 - Math.abs(d) * 0.07;
  out.z = 0.45 - Math.abs(d) * 0.22;
  out.ry = d * 0.14;
  out.rz = -d * 0.018;
  out.scale = 1 - Math.abs(d) * 0.035;
  return out;
};
