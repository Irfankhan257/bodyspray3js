/**
 * Tiny procedural sound engine — no audio assets.
 * A slow ambient pad plus a filtered-noise spray and a UI blip.
 * Everything is created lazily on the first user gesture so we never
 * fight the browser autoplay policy.
 */

let ctx = null;
let master = null;
let padGain = null;
let padNodes = [];
let soundOn = false;

const ensureCtx = () => {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

const buildPad = () => {
  if (!ctx || padNodes.length) return;
  padGain = ctx.createGain();
  padGain.gain.value = 0.5;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 520;
  filter.Q.value = 0.7;
  padGain.connect(filter);
  filter.connect(master);

  const freqs = [55, 82.41, 110, 164.81];
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = i % 2 ? 'triangle' : 'sine';
    osc.frequency.value = f;
    osc.detune.value = (i - 1.5) * 7;
    const g = ctx.createGain();
    g.gain.value = 0.16 / (i + 1);
    osc.connect(g);
    g.connect(padGain);
    osc.start();
    padNodes.push(osc);
  });

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.055;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 190;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();
  padNodes.push(lfo);
};

export const setSound = (on) => {
  soundOn = on;
  const c = ensureCtx();
  if (!c) return;
  buildPad();
  const now = c.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(on ? 0.085 : 0, now + (on ? 1.6 : 0.7));
};

export const isSoundOn = () => soundOn;

export const playSpray = () => {
  if (!soundOn) return;
  const c = ensureCtx();
  if (!c) return;

  const dur = 0.7;
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / data.length;
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.1);
  }

  const src = c.createBufferSource();
  src.buffer = buffer;

  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 0.85;
  bp.frequency.setValueAtTime(3400, c.currentTime);
  bp.frequency.exponentialRampToValueAtTime(700, c.currentTime + dur);

  const g = c.createGain();
  g.gain.value = 0.32;

  src.connect(bp);
  bp.connect(g);
  g.connect(master);
  src.start();
  src.stop(c.currentTime + dur);
};

export const playClick = () => {
  if (!soundOn) return;
  const c = ensureCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'sine';
  osc.frequency.value = 1180;
  g.gain.setValueAtTime(0.045, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.09);
  osc.connect(g);
  g.connect(master);
  osc.start();
  osc.stop(c.currentTime + 0.1);
};
