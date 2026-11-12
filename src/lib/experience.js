import { fragrances, CINEMATIC_PAGES } from '../data/content';

export const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (t) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
export const damp = (current, target, lambda, dt) =>
  lerp(current, target, 1 - Math.exp(-lambda * Math.min(dt, 0.05)));
export const mod = (n, m) => ((n % m) + m) % m;

export const HERO_REPEATS = 3;
export const HERO_SPACING = 3.05;

/**
 * A single mutable object drives the WebGL scene every frame.
 * React only subscribes to coarse values (page, active hero scent).
 */
export const experience = {
  page: 0,
  targetPage: 0,
  heroIndex: 0,
  carouselPosition: 0,
  carouselTarget: 0,
  carouselVelocity: 0,
  dragOffset: 0,
  pointerX: 0,
  pointerY: 0,
  smoothPointerX: 0,
  smoothPointerY: 0,
  pointerActive: false,
  hoverBottle: false,
  dragging: false,
  dragMoved: 0,
  mistBurst: 0,
  mistVariant: 0,
  ready: false,
  loaderDone: false,
  reducedMotion: false,
  pageVariant: 0,
};

// Map each cinematic page to the fragrance it should showcase.
export const pageVariant = (page) => {
  const p = Math.round(page);
  if (p <= 1) return 0;
  if (p >= 2 && p <= 6) return p - 2;
  if (p >= 7 && p <= 10) return [0, 1, 3, 4][p - 7];
  return 4;
};

/* ------------------------------------------------------------------ */
/* Tiny external store for UI                                          */
/* ------------------------------------------------------------------ */

let snapshot = {
  page: 0,
  heroIndex: 0,
  loaderDone: false,
  menuOpen: false,
  soundOn: false,
  hoverBottle: false,
};

const subscribers = new Set();

export const getSnapshot = () => snapshot;

export const subscribe = (fn) => {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
};

const commit = (patch) => {
  let changed = false;
  for (const key in patch) {
    if (snapshot[key] !== patch[key]) {
      changed = true;
      break;
    }
  }
  if (!changed) return;
  snapshot = { ...snapshot, ...patch };
  subscribers.forEach((fn) => fn());
};

export const ui = {
  setPage(page) {
    const p = clamp(Math.round(page), 0, CINEMATIC_PAGES - 1);
    if (snapshot.page !== p) {
      experience.pageVariant = pageVariant(p);
      commit({ page: p });
    }
  },
  setHeroIndex(index) {
    const i = mod(index, fragrances.length);
    if (snapshot.heroIndex !== i) {
      experience.heroIndex = i;
      commit({ heroIndex: i });
    }
  },
  setLoaderDone(done) {
    experience.loaderDone = done;
    commit({ loaderDone: done });
  },
  setMenuOpen(open) {
    commit({ menuOpen: open });
  },
  setSoundOn(on) {
    commit({ soundOn: on });
  },
  setHoverBottle(hover) {
    if (snapshot.hoverBottle !== hover) {
      experience.hoverBottle = hover;
      commit({ hoverBottle: hover });
    }
  },
};

/* ------------------------------------------------------------------ */
/* Carousel helpers                                                    */
/* ------------------------------------------------------------------ */

export const carousel = {
  goToIndex(index) {
    const current = experience.carouselTarget / HERO_SPACING;
    const delta = mod(index - current + fragrances.length / 2, fragrances.length) - fragrances.length / 2;
    experience.carouselTarget += delta * HERO_SPACING;
  },
  goToNearest(index, direction = 0) {
    const current = Math.round(experience.carouselTarget / HERO_SPACING);
    if (direction > 0) experience.carouselTarget = (current + 1) * HERO_SPACING;
    else if (direction < 0) experience.carouselTarget = (current - 1) * HERO_SPACING;
    else carousel.goToIndex(index);
  },
  next() {
    carousel.goToNearest(0, 1);
  },
  previous() {
    carousel.goToNearest(0, -1);
  },
  snap() {
    experience.carouselTarget = Math.round(experience.carouselTarget / HERO_SPACING) * HERO_SPACING;
  },
  getIndex() {
    return mod(Math.round(experience.carouselPosition / HERO_SPACING), fragrances.length);
  },
};

export const mistBurst = () => {
  experience.mistBurst += 1;
};
