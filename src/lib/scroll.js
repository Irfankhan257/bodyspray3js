import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { CINEMATIC_PAGES } from '../data/content';
import { clamp, experience, smoothstep, ui } from './experience';

gsap.registerPlugin(ScrollTrigger);

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

let lenis = null;
let initialized = false;
let wheelLocked = false;
let wheelTimer = null;
let touchTimer = null;
let cleanupFns = [];

const overlayRegistry = new Map();

const applyOverlay = (el, index, page) => {
  if (!el) return;
  const d = Math.abs(page - index);
  let opacity = 1 - smoothstep((d - 0.04) / 0.52);
  if (index === CINEMATIC_PAGES - 1) {
    opacity = Math.min(opacity, 1 - clamp((page - (CINEMATIC_PAGES - 1)) / 0.55, 0, 1));
  }
  const y = (page - index) * -6.5;
  el.style.opacity = opacity.toFixed(3);
  el.style.transform = `translate3d(0, ${y.toFixed(2)}vh, 0)`;
  el.style.visibility = opacity > 0.008 ? 'visible' : 'hidden';
  el.style.zIndex = String(20 + Math.round((1 - Math.min(d, 1)) * 10));
  el.setAttribute('aria-hidden', opacity > 0.5 ? 'false' : 'true');
};

export const registerOverlay = (index, el) => {
  overlayRegistry.set(index, el);
  applyOverlay(el, index, experience.page);
  return () => overlayRegistry.delete(index);
};

const updateOverlays = (page) => {
  overlayRegistry.forEach((el, index) => applyOverlay(el, index, page));
};

const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
  document.documentElement.style.setProperty('--scroll-progress', p.toFixed(4));
  document.documentElement.style.setProperty('--page-progress', clamp(experience.page / (CINEMATIC_PAGES - 1), 0, 1).toFixed(4));
};

const onLenisScroll = ({ scroll }) => {
  const vh = window.innerHeight;
  const page = clamp(scroll / vh, 0, CINEMATIC_PAGES);
  experience.page = page;
  experience.targetPage = page;
  ui.setPage(page);
  updateOverlays(page);
  updateProgress();
  document.documentElement.classList.toggle('is-scrolled', scroll > 40);
  document.documentElement.classList.toggle('in-content', scroll > (CINEMATIC_PAGES - 0.45) * vh);
};

const getVh = () => window.innerHeight;

const goToPage = (index, options = {}) => {
  if (!lenis) return;
  const page = clamp(Math.round(index), 0, CINEMATIC_PAGES - 1);
  lenis.scrollTo(page * getVh(), {
    duration: options.immediate ? 0 : options.duration ?? 1.35,
    immediate: !!options.immediate,
    lock: options.immediate ? false : true,
    easing: easeInOutCubic,
  });
};

const stepPage = (dir) => {
  if (!lenis) return;
  const current = Math.round(window.scrollY / getVh());
  const next = clamp(current + dir, 0, CINEMATIC_PAGES - 1);
  if (next === current) return;
  goToPage(next);
};

const goToSection = (selector, offset = -70) => {
  if (!lenis) return;
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) return;
  lenis.scrollTo(el, {
    offset,
    duration: 1.5,
    easing: easeInOutCubic,
    lock: true,
  });
};

const onWheel = (e) => {
  if (!initialized || !experience.loaderDone) return;
  if (document.documentElement.classList.contains('menu-open')) return;
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
  if (Math.abs(e.deltaY) < 5) return;

  const vh = getVh();
  const scroll = window.scrollY;
  // Past the last chapter, hand control back to free scrolling.
  if (scroll > (CINEMATIC_PAGES - 0.72) * vh) return;

  const dir = e.deltaY > 0 ? 1 : -1;
  const current = Math.round(scroll / vh);

  if (current >= CINEMATIC_PAGES - 1 && dir > 0) return;
  if (current <= 0 && dir < 0) return;

  e.preventDefault();
  if (wheelLocked) return;

  const target = clamp(current + dir, 0, CINEMATIC_PAGES - 1);
  if (target === current) return;

  wheelLocked = true;
  goToPage(target, { duration: dir > 0 ? 1.35 : 1.2 });
  clearTimeout(wheelTimer);
  wheelTimer = setTimeout(() => {
    wheelLocked = false;
  }, 1400);
};

const onKeyDown = (e) => {
  if (!experience.loaderDone) return;
  if (document.documentElement.classList.contains('menu-open')) return;
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

  const vh = getVh();
  const scroll = window.scrollY;
  const inCinematic = scroll < (CINEMATIC_PAGES - 0.45) * vh;

  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    if (!inCinematic) return;
    e.preventDefault();
    stepPage(1);
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    if (!inCinematic) return;
    e.preventDefault();
    stepPage(-1);
  } else if (e.key === ' ' && !e.shiftKey) {
    if (!inCinematic) return;
    e.preventDefault();
    stepPage(1);
  } else if (e.key === 'Home') {
    e.preventDefault();
    goToPage(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    const el = document.querySelector('#collection');
    if (el) goToSection(el);
  }
};

const onTouchStart = () => {
  clearTimeout(touchTimer);
};

const onTouchEnd = () => {
  if (!initialized || !experience.loaderDone) return;
  if (document.documentElement.classList.contains('menu-open')) return;
  const vh = getVh();
  const scroll = window.scrollY;
  // Let the reader flow naturally into the editorial content.
  if (scroll > (CINEMATIC_PAGES - 0.82) * vh) return;
  clearTimeout(touchTimer);
  touchTimer = setTimeout(() => {
    if (window.scrollY > (CINEMATIC_PAGES - 0.82) * vh) return;
    const current = Math.round(window.scrollY / vh);
    const target = clamp(current, 0, CINEMATIC_PAGES - 1);
    lenis.scrollTo(target * vh, {
      duration: 1.0,
      easing: easeInOutCubic,
      lock: true,
    });
  }, 180);
};

const onGoEvent = (e) => {
  const page = e.detail?.page;
  if (typeof page === 'number') goToPage(page);
};

const onSectionEvent = (e) => {
  const selector = e.detail?.selector;
  if (selector) goToSection(selector);
};

export const initScroll = () => {
  if (initialized) return { lenis, goToPage, goToSection, stepPage };
  initialized = true;

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: true,
    touchMultiplier: 1.1,
    wheelMultiplier: 1,
    autoRaf: false,
    infinite: false,
  });

  window.__lenis = lenis;
  window.__goToPage = goToPage;
  window.__goToSection = goToSection;

  lenis.on('scroll', onLenisScroll);
  lenis.on('scroll', ScrollTrigger.update);

  const ticker = (time) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(ticker);
  gsap.ticker.lagSmoothing(0);

  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('noire:go', onGoEvent);
  window.addEventListener('noire:section', onSectionEvent);

  cleanupFns.push(() => window.removeEventListener('wheel', onWheel));
  cleanupFns.push(() => window.removeEventListener('keydown', onKeyDown));
  cleanupFns.push(() => window.removeEventListener('touchstart', onTouchStart));
  cleanupFns.push(() => window.removeEventListener('touchend', onTouchEnd));
  cleanupFns.push(() => window.removeEventListener('noire:go', onGoEvent));
  cleanupFns.push(() => window.removeEventListener('noire:section', onSectionEvent));
  cleanupFns.push(() => gsap.ticker.remove(ticker));
  cleanupFns.push(() => lenis.destroy());

  // Hold the page until the intro loader has finished.
  lenis.stop();
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  onLenisScroll({ scroll: 0 });

  return { lenis, goToPage, goToSection, stepPage };
};

export const startExperience = () => {
  experience.loaderDone = true;
  ui.setLoaderDone(true);
  document.documentElement.classList.add('is-ready');
  if (lenis) lenis.start();
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  setTimeout(() => ScrollTrigger.refresh(), 100);
};

export const lockScroll = (locked) => {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
};

export const destroyScroll = () => {
  cleanupFns.forEach((fn) => fn());
  cleanupFns = [];
  initialized = false;
  lenis = null;
};

export const getLenis = () => lenis;
