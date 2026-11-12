import React from 'react';

/**
 * Editorial SVG bottle used in the content grid.
 * The cinematic bottles are real WebGL geometry; this is a crisp,
 * resolution-independent stand-in for the shop cards.
 */
export default function BottleGlyph({ fragrance, className = '' }) {
  const id = fragrance.id;
  const sheen = `sheen-${id}`;
  const shade = `shade-${id}`;

  return (
    <svg
      className={className}
      viewBox="0 0 220 400"
      role="img"
      aria-label={`${fragrance.name} body spray bottle`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="0.14" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="0.3" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="0.52" stopColor="#000000" stopOpacity="0.18" />
          <stop offset="0.76" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="0.9" stopColor="#000000" stopOpacity="0.34" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.62" />
        </linearGradient>
        <linearGradient id={shade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="0.35" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.28" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="384" rx="52" ry="8" fill="#000000" opacity="0.55" />

      {/* can body */}
      <rect x="62" y="72" width="96" height="304" rx="18" fill={fragrance.metal} />
      <rect x="62" y="72" width="96" height="304" rx="18" fill={`url(#${sheen})`} />
      <rect x="62" y="72" width="96" height="304" rx="18" fill={`url(#${shade})`} />

      {/* shoulder + cap */}
      <rect x="80" y="58" width="60" height="22" rx="10" fill={fragrance.metal} />
      <rect x="80" y="58" width="60" height="22" rx="10" fill={`url(#${shade})`} />
      <rect x="86" y="34" width="48" height="34" rx="7" fill="#101010" />
      <rect x="86" y="34" width="48" height="34" rx="7" fill={`url(#${shade})`} />
      <rect x="90" y="66" width="40" height="6" rx="3" fill={fragrance.accent} />
      <rect x="100" y="20" width="20" height="16" rx="3" fill="#191919" />
      <rect x="106" y="14" width="8" height="7" rx="2" fill="#2a2a2a" />

      {/* printed label */}
      <rect x="64" y="148" width="92" height="164" fill={fragrance.labelBg} />
      <rect x="64" y="148" width="92" height="164" fill={`url(#${shade})`} />
      <rect x="64" y="148" width="92" height="1.6" fill={fragrance.accent} opacity="0.85" />
      <rect x="64" y="310" width="92" height="1.6" fill={fragrance.accent} opacity="0.85" />

      <text
        x="110"
        y="176"
        textAnchor="middle"
        fill={fragrance.labelInk}
        fontFamily="'Space Grotesk', sans-serif"
        fontSize="7.5"
        letterSpacing="3.4"
      >
        NOIRÉ
      </text>
      <text
        x="110"
        y="234"
        textAnchor="middle"
        fill={fragrance.labelInk}
        fontFamily="'Bodoni Moda', serif"
        fontSize="30"
        letterSpacing="1"
      >
        {fragrance.name}
      </text>
      <text
        x="110"
        y="252"
        textAnchor="middle"
        fill={fragrance.labelInk}
        opacity="0.72"
        fontFamily="'Space Grotesk', sans-serif"
        fontSize="5.4"
        letterSpacing="2.2"
      >
        {fragrance.family}
      </text>

      <line x1="78" y1="266" x2="142" y2="266" stroke={fragrance.accent} strokeWidth="0.6" opacity="0.6" />

      <text
        x="110"
        y="284"
        textAnchor="middle"
        fill={fragrance.labelInk}
        opacity="0.6"
        fontFamily="'Space Grotesk', sans-serif"
        fontSize="5.2"
        letterSpacing="1.8"
      >
        BODY SPRAY · 150 ML
      </text>

      {/* base + shoulder rings */}
      <rect x="64" y="348" width="92" height="3" fill={fragrance.accent} opacity="0.8" />
      <rect x="64" y="76" width="92" height="3" fill={fragrance.accent} opacity="0.55" />
    </svg>
  );
}
