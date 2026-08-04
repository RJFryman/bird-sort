// Offline SFX generator for Bird Sort. Self-authored synth => CC0, no network.
// Run: node assets/sfx/gen-sfx.mjs  (regenerates the .wav files next to it)
// Design rules (asher-game-ux-spec §3): warm, soft, low volume, NO harsh/buzzer
// tones, nothing sudden. Every sound fades in/out so there are zero clicks.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RATE = 44100;
const dir = dirname(fileURLToPath(import.meta.url));

// mono 16-bit PCM WAV from a Float32 sample array in [-1,1]
function wav(samples) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22); buf.writeUInt32LE(RATE, 24); buf.writeUInt32LE(RATE * 2, 28);
  buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); // BlockAlign, BitsPerSample
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE((v * 32767) | 0, 44 + i * 2);
  }
  return buf;
}

const S = (ms) => Math.floor((ms / 1000) * RATE);
// soft attack + exponential-ish decay envelope, click-free
function env(i, len, attackMs = 6, releaseFrac = 0.6) {
  const a = S(attackMs);
  if (i < a) return i / a;
  const rel = len * releaseFrac;
  const relStart = len - rel;
  if (i < relStart) return 1;
  const t = (i - relStart) / rel;
  return Math.pow(1 - t, 2.2);
}

// build a tone: freq can be a function of normalized time (0..1) for sweeps
function tone(ms, freq, { amp = 0.32, wave = 'sine', vibrato = 0, attackMs = 6, releaseFrac = 0.6 } = {}) {
  const len = S(ms);
  const out = new Float32Array(len);
  let ph = 0;
  for (let i = 0; i < len; i++) {
    const tn = i / len;
    let f = typeof freq === 'function' ? freq(tn) : freq;
    if (vibrato) f *= 1 + vibrato * Math.sin(2 * Math.PI * 11 * tn);
    ph += (2 * Math.PI * f) / RATE;
    let s;
    if (wave === 'triangle') s = (2 / Math.PI) * Math.asin(Math.sin(ph));
    else if (wave === 'soft') s = Math.sin(ph) * 0.8 + Math.sin(2 * ph) * 0.12; // gentle harmonic
    else s = Math.sin(ph);
    out[i] = s * amp * env(i, len, attackMs, releaseFrac);
  }
  return out;
}

function concat(...parts) {
  const len = parts.reduce((a, p) => a + p.length, 0);
  const out = new Float32Array(len);
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}
function mix(...parts) {
  const len = Math.max(...parts.map((p) => p.length));
  const out = new Float32Array(len);
  for (const p of parts) for (let i = 0; i < p.length; i++) out[i] += p[i];
  return out;
}
const silence = (ms) => new Float32Array(S(ms));

const sounds = {
  // soft rounded "boop" on any tap / select
  tap: tone(90, 620, { amp: 0.28, wave: 'soft', releaseFrac: 0.8 }),
  // lift = gentle rise (picking birds up)
  lift: tone(130, (t) => 480 + t * 300, { amp: 0.26, wave: 'soft', releaseFrac: 0.7 }),
  // drop = gentle settle (birds land)
  drop: tone(140, (t) => 760 - t * 300, { amp: 0.26, wave: 'soft', releaseFrac: 0.75 }),
  // happy little bird chirp when a branch locks
  chirp: mix(
    tone(200, (t) => 900 + 700 * Math.sin(Math.PI * t), { amp: 0.3, vibrato: 0.05, releaseFrac: 0.6 }),
    concat(silence(70), tone(130, (t) => 1500 + t * 300, { amp: 0.16, releaseFrac: 0.7 })),
  ),
  // warm major arpeggio fanfare on win (C5 E5 G5 C6), short (~0.7s)
  win: concat(
    tone(150, 523.25, { amp: 0.3, wave: 'triangle', releaseFrac: 0.5 }),
    tone(150, 659.25, { amp: 0.3, wave: 'triangle', releaseFrac: 0.5 }),
    tone(150, 783.99, { amp: 0.3, wave: 'triangle', releaseFrac: 0.5 }),
    mix(
      tone(280, 1046.5, { amp: 0.32, wave: 'triangle', releaseFrac: 0.7 }),
      tone(280, 1567.98, { amp: 0.12, wave: 'sine', releaseFrac: 0.8 }), // sparkle
    ),
  ),
  // gentle, non-punishing "nope" — two soft descending notes, no buzz
  nope: concat(
    tone(120, 392, { amp: 0.24, wave: 'soft', releaseFrac: 0.6 }),
    tone(160, 330, { amp: 0.22, wave: 'soft', releaseFrac: 0.75 }),
  ),
};

for (const [name, samples] of Object.entries(sounds)) {
  const path = join(dir, `${name}.wav`);
  writeFileSync(path, wav(samples));
  console.log(`wrote ${name}.wav  ${(samples.length / RATE * 1000) | 0}ms`);
}
