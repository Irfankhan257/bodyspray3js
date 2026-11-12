import * as THREE from 'three';

import { fragrances } from '../data/content';

const FONT_DISPLAY = '"Bodoni Moda", "Times New Roman", serif';
const FONT_SANS = '"Space Grotesk", "Helvetica Neue", Arial, sans-serif';

const roundedRect = (ctx, x, y, w, h, r) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
};

const grain = (ctx, w, h, amount = 0.05) => {
  const data = ctx.getImageData(0, 0, w, h);
  const d = data.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 255 * amount;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(data, 0, 0);
};

const drawFoilLine = (ctx, x, y, w, color, alpha = 0.6) => {
  const g = ctx.createLinearGradient(x, y, x + w, y);
  g.addColorStop(0, 'transparent');
  g.addColorStop(0.15, color);
  g.addColorStop(0.5, color);
  g.addColorStop(0.85, color);
  g.addColorStop(1, 'transparent');
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, 1.2);
  ctx.globalAlpha = 1;
};

const drawLabel = (fragrance) => {
  const W = 2048;
  const H = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Base label colour
  const base = ctx.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, fragrance.labelBg);
  base.addColorStop(0.5, fragrance.labelBg);
  base.addColorStop(1, shade(fragrance.labelBg, -0.16));
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // Soft cylinder shading — darker at the wrap edges
  const shadeGrad = ctx.createLinearGradient(0, 0, W, 0);
  shadeGrad.addColorStop(0, 'rgba(0,0,0,0.38)');
  shadeGrad.addColorStop(0.08, 'rgba(0,0,0,0.12)');
  shadeGrad.addColorStop(0.25, 'rgba(255,255,255,0.04)');
  shadeGrad.addColorStop(0.42, 'rgba(0,0,0,0.02)');
  shadeGrad.addColorStop(0.6, 'rgba(0,0,0,0.08)');
  shadeGrad.addColorStop(0.9, 'rgba(0,0,0,0.24)');
  shadeGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = shadeGrad;
  ctx.fillRect(0, 0, W, H);

  // Brushed micro-texture
  ctx.globalAlpha = 0.055;
  for (let i = 0; i < 900; i++) {
    ctx.strokeStyle = i % 2 ? '#ffffff' : '#000000';
    ctx.lineWidth = Math.random() * 1.1 + 0.2;
    const x = Math.random() * W;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 8, H);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  const ink = fragrance.labelInk;
  const accent = fragrance.accent;

  // ---- FRONT PANEL (centred at u = 0.25) ----
  const fx = W * 0.25;
  const panelW = 660;
  const left = fx - panelW / 2;

  ctx.textAlign = 'center';

  // top wordmark
  ctx.fillStyle = ink;
  ctx.font = `500 54px ${FONT_SANS}`;
  ctx.letterSpacing = '18px';
  ctx.fillText('N O I R É', fx + 9, 152);

  ctx.globalAlpha = 0.55;
  ctx.font = `400 20px ${FONT_SANS}`;
  ctx.letterSpacing = '7px';
  ctx.fillText('B O D Y   S P R A Y', fx + 3, 196);
  ctx.globalAlpha = 1;

  drawFoilLine(ctx, left, 238, panelW, accent, 0.8);

  // main name
  ctx.fillStyle = ink;
  ctx.font = `500 172px ${FONT_DISPLAY}`;
  ctx.letterSpacing = '8px';
  ctx.fillText(fragrance.name, fx + 4, 420);

  ctx.globalAlpha = 0.8;
  ctx.font = `400 25px ${FONT_SANS}`;
  ctx.letterSpacing = '12px';
  ctx.fillText(fragrance.family, fx + 6, 478);
  ctx.globalAlpha = 1;

  // tagline
  ctx.font = `italic 400 34px ${FONT_DISPLAY}`;
  ctx.globalAlpha = 0.72;
  ctx.fillText(fragrance.tagline, fx, 548);
  ctx.globalAlpha = 1;

  drawFoilLine(ctx, left + 90, 596, panelW - 180, accent, 0.45);

  // notes
  ctx.textAlign = 'left';
  ctx.font = `400 21px ${FONT_SANS}`;
  ctx.letterSpacing = '2.5px';
  fragrance.notes.forEach((note, i) => {
    const y = 656 + i * 52;
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = ink;
    ctx.fillText(note.label, left + 48, y);
    ctx.globalAlpha = 0.88;
    ctx.font = `300 24px ${FONT_SANS}`;
    ctx.fillText(note.value.toUpperCase(), left + 158, y);
    ctx.font = `400 21px ${FONT_SANS}`;
  });

  // bottom details
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.5;
  ctx.font = `400 19px ${FONT_SANS}`;
  ctx.letterSpacing = '5px';
  ctx.fillText('EXTRAIT DE PARFUM  ·  150 ML  ·  5.0 FL.OZ', fx + 3, 916);
  ctx.globalAlpha = 0.32;
  ctx.font = `400 16px ${FONT_SANS}`;
  ctx.fillText('PARIS — GRASSE  ·  MADE IN FRANCE', fx, 952);
  ctx.globalAlpha = 1;

  // ---- SIDE PANEL (back / barcode) ----
  const bx = W * 0.75;
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.65;
  ctx.fillStyle = ink;
  ctx.font = `500 34px ${FONT_SANS}`;
  ctx.letterSpacing = '12px';
  ctx.fillText('N O I R É', bx + 6, 300);
  ctx.globalAlpha = 0.4;
  ctx.font = `400 18px ${FONT_SANS}`;
  ctx.letterSpacing = '5px';
  ctx.fillText('OWN YOUR PRESENCE', bx + 3, 340);
  ctx.globalAlpha = 1;

  // barcode block
  ctx.fillStyle = ink;
  ctx.globalAlpha = 0.85;
  const bars = 42;
  const bw = 3;
  const bGap = 2.2;
  const startX = bx - (bars * (bw + bGap)) / 2;
  for (let i = 0; i < bars; i++) {
    const h = 52 + Math.random() * 16;
    ctx.fillRect(startX + i * (bw + bGap), 430, bw, h);
  }
  ctx.globalAlpha = 0.55;
  ctx.font = `400 17px ${FONT_SANS}`;
  ctx.letterSpacing = '6px';
  ctx.fillText('3 7600 2026 001', bx, 522);
  ctx.globalAlpha = 1;

  ctx.globalAlpha = 0.4;
  ctx.font = `300 15px ${FONT_SANS}`;
  ctx.letterSpacing = '1px';
  const lines = [
    'ALCOHOL DENAT. · AQUA · PARFUM',
    'LIMONENE · LINALOOL · COUMARIN',
    'DERMATOLOGICALLY TESTED · VEGAN',
    'DO NOT SPRAY TOWARD FLAME',
  ];
  lines.forEach((line, i) => ctx.fillText(line, bx, 626 + i * 28));
  ctx.globalAlpha = 1;

  // ---- subtle seam/registration marks ----
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = ink;
  ctx.fillRect(W * 0.25 - 345, 84, 2, H - 168);
  ctx.fillRect(W * 0.25 + 343, 84, 2, H - 168);
  ctx.globalAlpha = 1;

  // side vertical type near the seam
  ctx.save();
  ctx.translate(W * 0.5, H * 0.5);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = ink;
  ctx.font = `400 24px ${FONT_SANS}`;
  ctx.letterSpacing = '14px';
  ctx.fillText('N O I R É   —   B O D Y   S P R A Y', 0, 0);
  ctx.restore();
  ctx.globalAlpha = 1;

  grain(ctx, W, H, 0.028);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
};

const shade = (hex, amount) => {
  const c = new THREE.Color(hex);
  const hsl = {};
  c.getHSL(hsl);
  c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l + amount)));
  return `#${c.getHexString()}`;
};

let cache = null;

export const getLabelTextures = async () => {
  if (cache) return cache;
  try {
    await Promise.all([
      document.fonts.load('500 172px "Bodoni Moda"'),
      document.fonts.load('italic 400 34px "Bodoni Moda"'),
      document.fonts.load('400 24px "Space Grotesk"'),
      document.fonts.load('500 54px "Space Grotesk"'),
    ]);
  } catch (e) {
    // Fonts may not be available offline — the fallbacks are fine.
  }
  cache = new Map();
  fragrances.forEach((f) => cache.set(f.id, drawLabel(f)));
  return cache;
};

export const makeCapBump = () => {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);
  for (let x = 0; x < 256; x += 8) {
    const g = ctx.createLinearGradient(x, 0, x + 8, 0);
    g.addColorStop(0, '#9a9a9a');
    g.addColorStop(0.5, '#6a6a6a');
    g.addColorStop(1, '#9a9a9a');
    ctx.fillStyle = g;
    ctx.fillRect(x, 0, 8, 256);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  tex.needsUpdate = true;
  return tex;
};

export const makeDotTexture = () => {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.7)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};
