// Owns the bundled Northern Cardinal field recording and its public provenance.
export const CARDINAL_RECORDING = {
  title: 'Northern Cardinal song',
  recordist: 'Aleksandr Berdnikov',
  sourceUrl: 'https://www.inaturalist.org/observations/71577658',
  licenseName: 'CC0 1.0 Universal',
  licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  modifications: 'Excerpt 3.35–6.15 s; 700 Hz high-pass and 8 kHz low-pass; +10 dB; short edge fades; mono MP3.',
} as const;

export type CardinalRecording = typeof CARDINAL_RECORDING;

export const CARDINAL_SOURCE = require('./assets/sfx/cardinal-call.mp3');
