export const BRAND = {
  name: 'NOIRÉ',
  tagline: 'OWN YOUR PRESENCE.',
  est: 'EST. 2026',
  city: 'PARIS — GRASSE',
};

export const fragrances = [
  {
    id: 'noir',
    index: 0,
    name: 'NOIR',
    family: 'WOODY AMBER',
    tagline: 'THE ROOM GOES QUIET.',
    description:
      'A low, magnetic hum. Smoked cedar and black pepper settle into warm amber — the scent of a room that goes quiet when you walk in.',
    notes: [
      { label: 'TOP', value: 'Black Pepper · Bergamot' },
      { label: 'HEART', value: 'Smoked Cedar · Vetiver' },
      { label: 'BASE', value: 'Amber · Tonka · Labdanum' },
    ],
    accent: '#c9a26a',
    accentSoft: '#e6c79a',
    deep: '#241a10',
    glowA: '#8a5f2c',
    glowB: '#120c07',
    labelBg: '#151311',
    labelInk: '#d9bb8a',
    metal: '#8d8a84',
    stat: '12H',
    mood: 'SMOKED / WARM / MAGNETIC',
  },
  {
    id: 'aura',
    index: 1,
    name: 'AURA',
    family: 'AQUATIC CITRUS',
    tagline: 'COLD AIR. OPEN WATER.',
    description:
      'Bergamot cuts through a salted marine accord, then dries down to a clean, weightless musk. Freshness with a pulse.',
    notes: [
      { label: 'TOP', value: 'Bergamot · Yuzu · Sea Salt' },
      { label: 'HEART', value: 'Marine Accord · Sage' },
      { label: 'BASE', value: 'White Musk · Driftwood' },
    ],
    accent: '#8fd9e6',
    accentSoft: '#c3f0f5',
    deep: '#0b2a33',
    glowA: '#2a7f92',
    glowB: '#061317',
    labelBg: '#dbeff1',
    labelInk: '#0d3b45',
    metal: '#aebfc2',
    stat: '08H',
    mood: 'SALTED / CLEAN / WEIGHTLESS',
  },
  {
    id: 'rouge',
    index: 2,
    name: 'ROUGE',
    family: 'SPICED AMBER',
    tagline: 'HEAT WITH A PULSE.',
    description:
      'Saffron and pink pepper flare over molten labdanum. Bold, warm and impossible to ignore — a scent that arrives before you do.',
    notes: [
      { label: 'TOP', value: 'Saffron · Pink Pepper' },
      { label: 'HEART', value: 'Rose Absolute · Cinnamon' },
      { label: 'BASE', value: 'Labdanum · Benzoin · Amber' },
    ],
    accent: '#e4584f',
    accentSoft: '#f6a49d',
    deep: '#3a0e12',
    glowA: '#9e2a2f',
    glowB: '#170507',
    labelBg: '#4a1115',
    labelInk: '#f1d4c4',
    metal: '#9b8b84',
    stat: '10H',
    mood: 'SPICED / BOLD / LUMINOUS',
  },
  {
    id: 'vert',
    index: 3,
    name: 'VERT',
    family: 'GREEN HERBAL',
    tagline: 'A SHARP INTAKE OF BREATH.',
    description:
      'Crushed mint and basil over cool vetiver. Green, vivid and alive — like stepping barefoot into a garden after rain.',
    notes: [
      { label: 'TOP', value: 'Wild Mint · Basil' },
      { label: 'HEART', value: 'Violet Leaf · Geranium' },
      { label: 'BASE', value: 'Vetiver · Moss · Cedar' },
    ],
    accent: '#9ccb7a',
    accentSoft: '#c9e6ad',
    deep: '#10291b',
    glowA: '#3e7a4a',
    glowB: '#07140d',
    labelBg: '#18301f',
    labelInk: '#c8dfb0',
    metal: '#8d9b8d',
    stat: '09H',
    mood: 'CRUSHED / COOL / ALIVE',
  },
  {
    id: 'eclat',
    index: 4,
    name: 'ÉCLAT',
    family: 'MUSK VANILLA',
    tagline: 'QUIET LUXURY.',
    description:
      'Iris and tonka melt into a second-skin musk. Smooth, intimate and unmistakably you — the scent people lean in for.',
    notes: [
      { label: 'TOP', value: 'Iris · Almond Milk' },
      { label: 'HEART', value: 'Tonka Bean · Heliotrope' },
      { label: 'BASE', value: 'Skin Musk · Vanilla · Sandalwood' },
    ],
    accent: '#e6cda8',
    accentSoft: '#f7e7cf',
    deep: '#33241a',
    glowA: '#a67d51',
    glowB: '#1a110b',
    labelBg: '#e8dcc7',
    labelInk: '#4a3526',
    metal: '#b8ab98',
    stat: '11H',
    mood: 'SMOOTH / INTIMATE / YOURS',
  },
];

export const heroSlides = fragrances.map((f) => ({
  name: f.name,
  family: f.family,
  tagline: f.tagline,
}));

export const craft = [
  {
    index: '01',
    title: '12 HOURS OF PRESENCE',
    stat: '12H',
    body: 'A high-concentration extrait base clings to skin and fabric long after the room has emptied. One press in the morning. Still there at midnight.',
    footnote: 'INDEPENDENT WEAR TEST · 32 SUBJECTS',
    variant: 0,
  },
  {
    index: '02',
    title: 'SKIN-FIRST FORMULA',
    stat: '0%',
    body: 'Dermatologically tested. Vegan. Free from parabens, phthalates and the things your skin does not need. What is left is what matters.',
    footnote: 'DERMATOLOGICALLY TESTED · VEGAN',
    variant: 1,
  },
  {
    index: '03',
    title: 'INFINITELY RECYCLABLE',
    stat: '100%',
    body: 'A single-piece aluminium body. No plastic shell, no hidden layers. Refill it, recycle it, repeat. Luxury should not cost the future.',
    footnote: 'MONO-MATERIAL ALUMINIUM',
    variant: 3,
  },
  {
    index: '04',
    title: 'COMPOSED IN GRASSE',
    stat: 'FR',
    body: 'Built with master perfumers in the fragrance capital of the world, then bottled in small batches. Nothing rushed. Nothing diluted.',
    footnote: 'GRASSE, FRANCE · SMALL BATCH',
    variant: 4,
  },
];

export const faqs = [
  {
    q: 'What is the difference between a body spray and an eau de parfum?',
    a: 'NOIRÉ body sprays are formulated at a higher fragrance concentration than a typical body mist, with an extrait base for longevity. They sit between a mist and an eau de parfum: easy to wear every day, but with the depth and trail of a fine fragrance.',
  },
  {
    q: 'How long does one bottle last?',
    a: 'Each 150 ml bottle delivers roughly 900 presses. Used as intended — three to four presses a day — a bottle lasts around seven to eight months.',
  },
  {
    q: 'Are the formulas vegan and cruelty-free?',
    a: 'Yes. Every NOIRÉ formula is 100% vegan, never tested on animals, and free from parabens, phthalates and synthetic dyes.',
  },
  {
    q: 'Can I layer two scents together?',
    a: 'Absolutely. The collection was designed to be layered. Try AURA as a bright base with NOIR over the top for contrast, or ÉCLAT with ROUGE for a warmer trail.',
  },
  {
    q: 'What is your returns policy?',
    a: 'If a scent is not yours, return it within 30 days — even if it has been opened. We will refund you in full and cover the return shipping.',
  },
];

export const pages = [
  { type: 'hero', label: 'INTRO' },
  { type: 'manifesto', label: 'MANIFESTO' },
  ...fragrances.map((f) => ({ type: 'fragrance', label: f.name, index: f.index })),
  ...craft.map((c) => ({ type: 'craft', label: `THE CRAFT ${c.index}`, index: Number(c.index) - 1 })),
  { type: 'lineup', label: 'THE FIVE' },
];

export const CINEMATIC_PAGES = pages.length;
