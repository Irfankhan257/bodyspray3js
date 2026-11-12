import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { experience } from '../lib/experience';
import { startExperience } from '../lib/scroll';

export default function Loader() {
  const [hidden, setHidden] = useState(false);
  const root = useRef();
  const word = useRef();
  const tagline = useRef();
  const percent = useRef();
  const bar = useRef();
  const line = useRef();
  const done = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    experience.reducedMotion = reduce;

    const progress = { value: 0 };
    const renderProgress = () => {
      if (percent.current) percent.current.textContent = `${String(Math.round(progress.value)).padStart(3, '0')}`;
      if (bar.current) bar.current.style.transform = `scaleX(${progress.value / 100})`;
    };
    renderProgress();

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .fromTo(
        word.current,
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, ease: 'power4.out' },
      )
      .fromTo(line.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }, 0.15)
      .fromTo(tagline.current, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.45);

    const tween = gsap.to(progress, {
      value: 92,
      duration: reduce ? 1.2 : 3.2,
      ease: 'power2.out',
      onUpdate: renderProgress,
    });

    let ready = experience.ready;
    const onReady = () => {
      ready = true;
    };
    window.addEventListener('noire:ready', onReady);

    const startedAt = performance.now();
    const minDuration = reduce ? 900 : 2300;

    const finish = () => {
      if (done.current) return;
      if (!ready && performance.now() - startedAt < 6500) return;
      done.current = true;
      tween.kill();
      gsap.killTweensOf(progress);

      gsap.to(progress, {
        value: 100,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: renderProgress,
        onComplete: () => {
          startExperience();
          const out = gsap.timeline({
            defaults: { ease: 'power3.inOut' },
            onComplete: () => setHidden(true),
          });
          out
            .to(root.current, { yPercent: -100, duration: reduce ? 0.5 : 1.05, ease: 'power4.inOut' }, 0.15)
            .to(root.current, { opacity: 0, duration: 0.4 }, 0.7);
        },
      });
    };

    const interval = window.setInterval(() => {
      if (performance.now() - startedAt > minDuration) finish();
    }, 80);

    const fallback = window.setTimeout(finish, 7500);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(fallback);
      window.removeEventListener('noire:ready', onReady);
      tween.kill();
      intro.kill();
    };
  }, []);

  if (hidden) return null;

  return (
    <div className="loader" ref={root} aria-label="Loading NOIRÉ">
      <div className="loader__grain" />
      <div className="loader__top">
        <span>NOIRÉ</span>
        <span>PARIS — GRASSE</span>
      </div>
      <div className="loader__center">
        <div className="loader__mask">
          <h1 className="loader__word" ref={word}>
            NOIRÉ
          </h1>
        </div>
        <div className="loader__line" ref={line} />
        <p className="loader__tagline" ref={tagline}>
          OWN YOUR PRESENCE
        </p>
      </div>
      <div className="loader__bottom">
        <div className="loader__meta">
          <span>COMPOSING THE COLLECTION</span>
          <span className="loader__percent" ref={percent}>
            000
          </span>
        </div>
        <div className="loader__track">
          <div className="loader__bar" ref={bar} />
        </div>
      </div>
    </div>
  );
}
