import React, { useEffect, useState } from 'react';

import { fragrances, faqs } from '../data/content';
import BottleGlyph from './BottleGlyph';
import { playClick } from '../lib/sound';

const goToPage = (page) => {
  window.dispatchEvent(new CustomEvent('noire:go', { detail: { page } }));
};

const goToSection = (selector) => {
  window.dispatchEvent(new CustomEvent('noire:section', { detail: { selector } }));
};

const STATS = [
  { value: '12H', label: 'SKIN LONGEVITY' },
  { value: '0%', label: 'PARABENS · PHTHALATES' },
  { value: '100%', label: 'RECYCLABLE ALUMINIUM' },
  { value: 'FR', label: 'COMPOSED IN GRASSE' },
];

const STEPS = [
  {
    num: '01',
    title: 'PRESS',
    body: 'Two presses at the base of the throat. Let it land on skin, not on fabric. The extrait needs warmth to open.',
  },
  {
    num: '02',
    title: 'LAYER',
    body: 'One at the collar. One at the wrist. Wear it alone or build a signature by pairing two scents from the collection.',
  },
  {
    num: '03',
    title: 'WALK AWAY',
    body: 'Do not wait for the compliment. Presence is not a performance — it is what remains in the room after you leave.',
  },
];

const MARQUEE = ['OWN YOUR PRESENCE', 'NOIRÉ', 'FIVE SCENTS', 'ONE SIGNATURE'];

export default function Content() {
  const [openFaq, setOpenFaq] = useState(0);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-scroll-reveal]'));
    if (!els.length) return undefined;

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const subscribe = (e) => {
    e.preventDefault();
    playClick();
    setSubscribed(true);
  };

  return (
    <div className="content">
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((copy) => (
            <div className="marquee__group" key={copy}>
              {MARQUEE.map((word, i) => (
                <span key={`${copy}-${word}-${i}`}>
                  {word}
                  <i className="marquee__dot">✦</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* COLLECTION                                                 */}
      {/* ---------------------------------------------------------- */}
      <section id="collection" className="section collection-section">
        <div className="section__head reveal" data-scroll-reveal>
          <div>
            <span className="eyebrow">THE COLLECTION — 05</span>
            <h2 className="section__title">
              Five signatures.
              <br />
              <em>One presence.</em>
            </h2>
          </div>
          <p className="section__intro">
            Five extrait-concentration body sprays, composed in Grasse and built for skin. Each one is a
            complete thought — wear it alone, or layer two to make a signature that belongs to no one else.
          </p>
        </div>

        <div className="collection">
          {fragrances.map((f, i) => (
            <article
              className="card reveal"
              data-scroll-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
              key={f.id}
            >
              <span className="card__index">{String(i + 1).padStart(2, '0')}</span>
              <div className="card__visual">
                <BottleGlyph fragrance={f} />
              </div>
              <div className="card__body">
                <h3 className="card__name">{f.name}</h3>
                <p className="card__family">{f.family}</p>
                <p className="card__notes">{f.notes.map((n) => n.value).join(' · ')}</p>
                <div className="card__foot">
                  <span className="card__price">€68 · 150 ML</span>
                  <button
                    type="button"
                    className="card__view"
                    onClick={() => {
                      playClick();
                      goToPage(2 + i);
                    }}
                  >
                    DISCOVER <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="stats reveal" data-scroll-reveal>
          {STATS.map((stat) => (
            <div className="stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* RITUAL                                                     */}
      {/* ---------------------------------------------------------- */}
      <section id="ritual" className="section ritual-section">
        <div className="ritual">
          <div className="ritual__head reveal" data-scroll-reveal>
            <span className="eyebrow">THE RITUAL — 02</span>
            <h2 className="section__title">
              Three seconds
              <br />
              <em>to change a room.</em>
            </h2>
            <p className="section__intro">
              A body spray is not a finishing touch. It is the first thing people notice and the last thing
              they remember. Three presses, applied with intent.
            </p>
            <button
              type="button"
              className="btn btn--ghost ritual__cta"
              onClick={() => {
                playClick();
                goToPage(2);
              }}
            >
              FIND YOUR SIGNATURE
            </button>
          </div>

          <div className="ritual__steps">
            {STEPS.map((step) => (
              <div className="step reveal" data-scroll-reveal key={step.num}>
                <span className="step__num">{step.num}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* FAQ                                                        */}
      {/* ---------------------------------------------------------- */}
      <section id="faq" className="section faq-section">
        <div className="faq">
          <div className="faq__head reveal" data-scroll-reveal>
            <span className="eyebrow">QUESTIONS — 03</span>
            <h2 className="section__title">
              Everything
              <br />
              <em>you wanted to ask.</em>
            </h2>
            <p className="section__intro">
              Still unsure which scent is yours? Write to us at{' '}
              <a href="mailto:hello@noire.studio">hello@noire.studio</a> and we will help you find it.
            </p>
          </div>

          <div className="faq__list reveal" data-scroll-reveal>
            {faqs.map((item, i) => {
              const open = openFaq === i;
              return (
                <div className={`faq__item${open ? ' is-open' : ''}`} key={item.q}>
                  <button
                    type="button"
                    className="faq__q"
                    aria-expanded={open}
                    onClick={() => {
                      playClick();
                      setOpenFaq(open ? -1 : i);
                    }}
                  >
                    <span>{item.q}</span>
                    <span className="faq__icon" aria-hidden="true" />
                  </button>
                  <div className="faq__a">
                    <div>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* NEWSLETTER                                                 */}
      {/* ---------------------------------------------------------- */}
      <section id="newsletter" className="newsletter">
        <span className="newsletter__ghost" aria-hidden="true">
          NOIRÉ
        </span>
        <div className="newsletter__inner reveal" data-scroll-reveal>
          <span className="eyebrow">THE INNER CIRCLE</span>
          <h2 className="newsletter__title">
            Be first to know
            <br />
            <em>what comes next.</em>
          </h2>
          <p className="newsletter__copy">
            Private releases, layering notes and the occasional letter from Grasse. No noise. Unsubscribe
            whenever you like.
          </p>

          {subscribed ? (
            <p className="newsletter__thanks" role="status">
              YOU ARE IN. WATCH YOUR INBOX.
            </p>
          ) : (
            <form className="newsletter__form" onSubmit={subscribe}>
              <label className="sr-only" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="YOUR EMAIL ADDRESS"
                className="newsletter__input"
                autoComplete="email"
              />
              <button type="submit" className="newsletter__submit">
                SUBSCRIBE <span aria-hidden="true">→</span>
              </button>
            </form>
          )}

          <p className="newsletter__note">BY SUBSCRIBING YOU AGREE TO OUR PRIVACY POLICY.</p>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* FOOTER                                                     */}
      {/* ---------------------------------------------------------- */}
      <footer className="footer">
        <div className="footer__top">
          <div className="footer__brandcol">
            <p className="footer__brand">
              NOIR<span>É</span>
            </p>
            <p className="footer__tagline">Own your presence.</p>
            <p className="footer__addr">
              PARIS — GRASSE
              <br />
              EST. 2026
            </p>
          </div>

          <div className="footer__col">
            <h4>SHOP</h4>
            {fragrances.map((f) => (
              <button type="button" key={f.id} onClick={() => goToPage(2 + f.index)}>
                {f.name}
              </button>
            ))}
            <button type="button" onClick={() => goToSection('#collection')}>
              THE COLLECTION
            </button>
          </div>

          <div className="footer__col">
            <h4>HOUSE</h4>
            <button type="button" onClick={() => goToPage(1)}>
              MANIFESTO
            </button>
            <button type="button" onClick={() => goToPage(7)}>
              THE CRAFT
            </button>
            <button type="button" onClick={() => goToSection('#ritual')}>
              THE RITUAL
            </button>
            <button type="button" onClick={() => goToSection('#faq')}>
              QUESTIONS
            </button>
          </div>

          <div className="footer__col">
            <h4>FOLLOW</h4>
            <a href="#instagram">INSTAGRAM</a>
            <a href="#tiktok">TIKTOK</a>
            <a href="#pinterest">PINTEREST</a>
            <button type="button" onClick={() => goToSection('#newsletter')}>
              NEWSLETTER
            </button>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 NOIRÉ. ALL RIGHTS RESERVED.</span>
          <span className="footer__legal">
            <a href="#privacy">PRIVACY</a>
            <a href="#terms">TERMS</a>
            <a href="#cookies">COOKIES</a>
          </span>
          <span>MADE IN FRANCE</span>
        </div>
      </footer>

      <button
        type="button"
        className="back-to-top"
        onClick={() => {
          playClick();
          goToPage(0);
        }}
        aria-label="Back to the intro"
      >
        <span aria-hidden="true">↑</span> TOP
      </button>
    </div>
  );
}
