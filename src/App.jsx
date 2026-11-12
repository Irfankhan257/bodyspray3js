import React, { useEffect } from 'react';

import SceneCanvas from './three/SceneCanvas';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import PageOverlay from './components/PageOverlay';
import ChapterRail from './components/ChapterRail';
import ScrollProgress from './components/ScrollProgress';
import Cursor from './components/Cursor';
import Content from './components/Content';

import { CINEMATIC_PAGES, fragrances, pages } from './data/content';
import { initScroll, destroyScroll } from './lib/scroll';
import { pageVariant } from './lib/experience';
import { useUISelect } from './lib/useUI';

function ThemeSync() {
  const page = useUISelect((s) => s.page);
  const heroIndex = useUISelect((s) => s.heroIndex);

  useEffect(() => {
    const rounded = Math.round(page);
    const variant = rounded <= 1 ? heroIndex : pageVariant(rounded);
    const f = fragrances[variant] || fragrances[0];
    const root = document.documentElement.style;
    root.setProperty('--accent', f.accent);
    root.setProperty('--accent-soft', f.accentSoft);
    root.setProperty('--deep', f.deep);
    root.setProperty('--glow-a', f.glowA);
    root.setProperty('--page-number', String(rounded));
  }, [page, heroIndex]);

  return null;
}

export default function App() {
  useEffect(() => {
    initScroll();

    const setVh = () => {
      document.documentElement.style.setProperty('--app-vh', `${window.innerHeight}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
      destroyScroll();
    };
  }, []);

  return (
    <>
      <SceneCanvas />
      <ThemeSync />

      <div className="page-layer">
        {pages.map((meta, i) => (
          <PageOverlay key={`${meta.type}-${i}`} index={i} meta={meta} />
        ))}
      </div>

      <div
        className="scroll-space"
        style={{ height: `calc(var(--app-vh, 1vh) * ${CINEMATIC_PAGES})` }}
        aria-hidden="true"
      />

      <Content />

      <Navbar />
      <ChapterRail />
      <ScrollProgress />
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Loader />
    </>
  );
}
