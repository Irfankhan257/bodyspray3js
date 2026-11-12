import React from 'react';

import { CINEMATIC_PAGES, pages } from '../data/content';
import { useUISelect } from '../lib/useUI';
import { playClick } from '../lib/sound';

const goToPage = (page) => {
  window.dispatchEvent(new CustomEvent('noire:go', { detail: { page } }));
};

export default function ChapterRail() {
  const page = useUISelect((s) => s.page);

  return (
    <nav className="rail" aria-label="Chapters">
      {pages.map((item, i) => (
        <button
          key={`${item.type}-${i}`}
          type="button"
          className={`rail__item${page === i ? ' is-active' : ''}`}
          onClick={() => {
            playClick();
            goToPage(i);
          }}
          aria-label={`Chapter ${i + 1}: ${item.label}`}
          aria-current={page === i ? 'true' : undefined}
        >
          <span className="rail__label" aria-hidden="true">
            {item.label}
          </span>
          <span className="rail__num">{String(i + 1).padStart(2, '0')}</span>
          <span className="rail__line" aria-hidden="true" />
        </button>
      ))}
      <span className="rail__count" aria-hidden="true">
        {String(Math.min(page + 1, CINEMATIC_PAGES)).padStart(2, '0')}
      </span>
    </nav>
  );
}
