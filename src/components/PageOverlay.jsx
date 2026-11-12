import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

import { craft, fragrances } from '../data/content';
import { carousel, experience, mistBurst } from '../lib/experience';
import { registerOverlay } from '../lib/scroll';
import { useUISelect } from '../lib/useUI';
import { playClick, playSpray } from '../lib/sound';

const goToPage = (page) => {
  window.dispatchEvent(new CustomEvent('noire:go', { detail: { page } }));
};

const goToSection = (selector) => {
  window.dispatchEvent(new CustomEvent('noire:section', { detail: { selector } }));
};

/* ------------------------------------------------------------------ */
/* Reveal choreography                                                 */
/* ------------------------------------------------------------------ */

function useReveal(ref, active) {
  const played = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (experience.reducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    if (!active) {
      if (!played.current) gsap.set(targets, { opacity: 0, y: 22 });
      return;
    }

    played.current = true;
    const tween = gsap.fromTo(
      targets,
      { opacity: 0, y: 26 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.07,
        delay: 0.08,
        overwrite: true,
      },
    );
    return () => tween.kill();
  }, [active, ref]);
}

/* ------------------------------------------------------------------ */
/* Pages                                                               */
/* ------------------------------------------------------------------ */

function HeroPage() {
  const heroIndex = useUISelect((s) => s.heroIndex);
  const f = fragrances[heroIndex];

  return (
    <>
      <div className="hero__top">
        <span data-reveal>BODY SPRAY — EXTRAIT CONCENTRATION</span>
        <span data-reveal>EST. 2026 · PARIS — GRASSE</span>
      </div>

      <h1 className="hero__word" data-reveal>
        NOIR<span className="hero__accent">É</span>
      </h1>

      <div className="hero__meta">
        <span className="hero__kicker" data-reveal>
          {String(heroIndex + 1).padStart(2, '0')} — {f.family}
        </span>
        <p className="hero__tagline" data-reveal>
          {f.tagline}
        </p>
        <span className="hero__family" data-reveal>
          {f.mood}
        </span>
      </div>

      <div className="hero__controls">
        <button
          type="button"
          className="hero__arrow"
          aria-label="Previous fragrance"
          onClick={() => {
            carousel.previous();
            playClick();
          }}
          data-reveal
        >
          <span aria-hidden="true">←</span>
        </button>
        <div className="hero__dots" data-reveal>
          {fragrances.map((fr, i) => (
            <button
              key={fr.id}
              type="button"
              className={`hero__dot${i === heroIndex ? ' is-active' : ''}`}
              aria-label={`Show ${fr.name}`}
              aria-pressed={i === heroIndex}
              onClick={() => {
                carousel.goToIndex(i);
                playClick();
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className="hero__arrow"
          aria-label="Next fragrance"
          onClick={() => {
            carousel.next();
            playClick();
          }}
          data-reveal
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="hero__foot">
        <button
          type="button"
          className="hero__enter"
          onClick={() => {
            playClick();
            goToPage(1);
          }}
          data-reveal
        >
          <span className="hero__enter-label">BEGIN THE EXPERIENCE</span>
          <span className="hero__enter-arrow" aria-hidden="true">
            ↓
          </span>
        </button>
        <span className="hero__drag" data-reveal>
          DRAG THE COLLECTION
        </span>
      </div>
    </>
  );
}

function ManifestoPage() {
  return (
    <div className="manifesto">
      <span className="eyebrow" data-reveal>
        MANIFESTO — 01
      </span>
      <h2 className="manifesto__text">
        <span data-reveal>We do not make scent</span>
        <span data-reveal>for people who want</span>
        <span data-reveal>
          <em>to be noticed.</em>
        </span>
        <span data-reveal>We make it for people</span>
        <span data-reveal>who are already known.</span>
      </h2>
      <div className="manifesto__foot">
        <span data-reveal>NOIRÉ — HOUSE OF PRESENCE</span>
        <span data-reveal>FIVE SCENTS · ONE SIGNATURE</span>
      </div>
    </div>
  );
}

function FragrancePage({ variant }) {
  const f = fragrances[variant];
  const [added, setAdded] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const addToBag = () => {
    playClick();
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 2200);
  };

  const spray = () => {
    mistBurst();
    playSpray();
  };

  return (
    <div className="fragrance">
      <div className="fragrance__index" aria-hidden="true" data-reveal>
        {String(variant + 2).padStart(2, '0')}
      </div>

      <div className="fragrance__panel">
        <span className="eyebrow" data-reveal>
          {f.family}
        </span>
        <h2 className="fragrance__name" data-reveal>
          {f.name}
        </h2>
        <p className="fragrance__tagline" data-reveal>
          {f.tagline}
        </p>
        <p className="fragrance__desc" data-reveal>
          {f.description}
        </p>

        <ul className="fragrance__notes">
          {f.notes.map((note) => (
            <li key={note.label} data-reveal>
              <span className="fragrance__note-label">{note.label}</span>
              <span className="fragrance__note-value">{note.value}</span>
            </li>
          ))}
        </ul>

        <div className="fragrance__actions" data-reveal>
          <button type="button" className="btn btn--solid" onClick={addToBag}>
            {added ? 'ADDED TO BAG' : 'ADD — €68'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={spray}>
            SPRAY
          </button>
        </div>

        <div className="fragrance__stat" data-reveal>
          <strong>{f.stat}</strong>
          <span>LONGEVITY · SKIN TRAIL</span>
        </div>
      </div>

      <div className="fragrance__vertical" aria-hidden="true" data-reveal>
        {f.mood}
      </div>
    </div>
  );
}

function CraftPage({ variant }) {
  const c = craft[variant];

  return (
    <div className="craft">
      <div className="craft__panel">
        <span className="eyebrow" data-reveal>
          THE CRAFT — {c.index}
        </span>
        <div className="craft__stat" data-reveal>
          {c.stat}
        </div>
        <h2 className="craft__title" data-reveal>
          {c.title}
        </h2>
        <p className="craft__body" data-reveal>
          {c.body}
        </p>
        <span className="craft__foot" data-reveal>
          {c.footnote}
        </span>
      </div>
      <div className="craft__vertical" aria-hidden="true" data-reveal>
        {c.footnote}
      </div>
    </div>
  );
}

function LineupPage() {
  return (
    <div className="lineup">
      <div className="lineup__head">
        <span className="eyebrow" data-reveal>
          THE COLLECTION — 12
        </span>
        <h2 className="lineup__title" data-reveal>
          THE FIVE
        </h2>
        <p className="lineup__sub" data-reveal>
          One collection. Five ways to be remembered.
        </p>
      </div>

      <div className="lineup__foot">
        <div className="lineup__names" data-reveal>
          {fragrances.map((f) => (
            <button
              key={f.id}
              type="button"
              className="lineup__name"
              onClick={() => {
                playClick();
                goToPage(2 + f.index);
              }}
            >
              <i style={{ background: f.accent }} aria-hidden="true" />
              {f.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="lineup__next"
          data-reveal
          onClick={() => {
            playClick();
            goToSection('#collection');
          }}
        >
          EXPLORE THE COLLECTION <span aria-hidden="true">↓</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overlay shell                                                       */
/* ------------------------------------------------------------------ */

export default function PageOverlay({ index, meta }) {
  const ref = useRef(null);
  const page = useUISelect((s) => s.page);
  const loaderDone = useUISelect((s) => s.loaderDone);
  const active = loaderDone && Math.abs(page - index) < 0.55;

  useEffect(() => {
    if (!ref.current) return undefined;
    return registerOverlay(index, ref.current);
  }, [index]);

  useReveal(ref, active);

  let side = '';
  if (meta.type === 'fragrance') side = meta.index % 2 === 0 ? ' page--side-right' : ' page--side-left';
  if (meta.type === 'craft') side = meta.index % 2 === 0 ? ' page--side-right' : ' page--side-left';

  return (
    <section
      ref={ref}
      className={`page page--${meta.type}${side}`}
      aria-label={meta.label}
    >
      {meta.type === 'hero' && <HeroPage />}
      {meta.type === 'manifesto' && <ManifestoPage />}
      {meta.type === 'fragrance' && <FragrancePage variant={meta.index} />}
      {meta.type === 'craft' && <CraftPage variant={meta.index} />}
      {meta.type === 'lineup' && <LineupPage />}
    </section>
  );
}
