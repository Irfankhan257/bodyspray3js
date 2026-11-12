import React from 'react';

import { CINEMATIC_PAGES, pages } from '../data/content';
import { useUISelect } from '../lib/useUI';

export default function ScrollProgress() {
  const page = useUISelect((s) => s.page);
  const clamped = Math.min(page, CINEMATIC_PAGES - 1);
  const meta = pages[clamped];

  return (
    <div className="scrollbar" aria-hidden="true">
      <div className="scrollbar__track">
        <div className="scrollbar__fill" />
      </div>
      <div className="scrollbar__meta">
        <span>{String(clamped + 1).padStart(2, '0')} / {CINEMATIC_PAGES}</span>
        <span className="scrollbar__label">{meta?.label}</span>
      </div>
    </div>
  );
}
