import React, { useEffect } from 'react';

import { ui } from '../lib/experience';
import { lockScroll } from '../lib/scroll';
import { useUISelect } from '../lib/useUI';
import { playClick, setSound } from '../lib/sound';

const goToPage = (page) => {
  window.dispatchEvent(new CustomEvent('noire:go', { detail: { page } }));
};

const goToSection = (selector) => {
  window.dispatchEvent(new CustomEvent('noire:section', { detail: { selector } }));
};

const CHAPTERS = [
  { label: 'INTRO', num: '01', action: () => goToPage(0) },
  { label: 'MANIFESTO', num: '02', action: () => goToPage(1) },
  { label: 'FRAGRANCES', num: '03', action: () => goToPage(2) },
  { label: 'THE CRAFT', num: '08', action: () => goToPage(7) },
  { label: 'THE FIVE', num: '12', action: () => goToPage(11) },
];

const EXPLORE = [
  { label: 'THE COLLECTION', action: () => goToSection('#collection') },
  { label: 'THE RITUAL', action: () => goToSection('#ritual') },
  { label: 'QUESTIONS', action: () => goToSection('#faq') },
  { label: 'INNER CIRCLE', action: () => goToSection('#newsletter') },
];

function SoundToggle() {
  const soundOn = useUISelect((s) => s.soundOn);

  const toggle = () => {
    const next = !soundOn;
    setSound(next);
    ui.setSoundOn(next);
    if (next) playClick();
  };

  return (
    <button
      type="button"
      className={`sound${soundOn ? ' is-on' : ''}`}
      onClick={toggle}
      aria-pressed={soundOn}
      aria-label={soundOn ? 'Turn ambient sound off' : 'Turn ambient sound on'}
    >
      <span className="sound__bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="sound__label">{soundOn ? 'SOUND ON' : 'SOUND OFF'}</span>
    </button>
  );
}

export default function Navbar() {
  const menuOpen = useUISelect((s) => s.menuOpen);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', menuOpen);
    lockScroll(menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && menuOpen) ui.setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const run = (action) => {
    playClick();
    ui.setMenuOpen(false);
    window.setTimeout(action, 430);
  };

  return (
    <>
      <header className={`nav${menuOpen ? ' is-menu-open' : ''}`}>
        <button
          type="button"
          className="nav__brand"
          onClick={() => {
            playClick();
            goToPage(0);
          }}
          aria-label="NOIRÉ — back to intro"
        >
          NOIR<span>É</span>
        </button>

        <nav className="nav__links" aria-label="Primary">
          <button type="button" onClick={() => goToSection('#collection')}>
            COLLECTION
          </button>
          <button type="button" onClick={() => goToPage(2)}>
            FRAGRANCES
          </button>
          <button type="button" onClick={() => goToPage(7)}>
            THE CRAFT
          </button>
          <button type="button" onClick={() => goToSection('#ritual')}>
            RITUAL
          </button>
        </nav>

        <div className="nav__right">
          <SoundToggle />
          <button
            type="button"
            className="menu-btn"
            onClick={() => {
              playClick();
              ui.setMenuOpen(!menuOpen);
            }}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
          >
            <span className="menu-btn__label">{menuOpen ? 'CLOSE' : 'MENU'}</span>
            <span className="menu-btn__icon" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div id="site-menu" className={`menu${menuOpen ? ' is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="menu__inner">
          <div className="menu__main">
            <span className="eyebrow">NAVIGATION</span>
            <nav className="menu__links" aria-label="Menu">
              {CHAPTERS.map((item, i) => (
                <button
                  key={item.label}
                  type="button"
                  className="menu__item"
                  style={{ '--i': i }}
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => run(item.action)}
                >
                  <span className="menu__item-label">{item.label}</span>
                  <span className="menu__item-num">{item.num}</span>
                </button>
              ))}
            </nav>
          </div>

          <aside className="menu__side">
            <div className="menu__block">
              <span className="menu__caption">EXPLORE</span>
              {EXPLORE.map((item, i) => (
                <button
                  key={item.label}
                  type="button"
                  className="menu__small"
                  style={{ '--i': i + CHAPTERS.length }}
                  tabIndex={menuOpen ? 0 : -1}
                  onClick={() => run(item.action)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="menu__block">
              <span className="menu__caption">CONTACT</span>
              <a href="mailto:hello@noire.studio" tabIndex={menuOpen ? 0 : -1}>
                HELLO@NOIRE.STUDIO
              </a>
              <span>PARIS — GRASSE</span>
            </div>

            <div className="menu__block">
              <span className="menu__caption">FOLLOW</span>
              <div className="menu__social">
                <a href="#instagram" tabIndex={menuOpen ? 0 : -1}>
                  INSTAGRAM
                </a>
                <a href="#tiktok" tabIndex={menuOpen ? 0 : -1}>
                  TIKTOK
                </a>
                <a href="#pinterest" tabIndex={menuOpen ? 0 : -1}>
                  PINTEREST
                </a>
              </div>
            </div>

            <SoundToggle />
          </aside>
        </div>

        <div className="menu__word" aria-hidden="true">
          NOIRÉ
        </div>
      </div>
    </>
  );
}
