// Offline SFX for Bird Sort. All sounds are bundled .wav (assets/sfx), synthesized
// locally (see assets/sfx/gen-sfx.mjs) — CC0, zero network at runtime.
// Every sound here has a VISUAL twin in the UI (spec §3): audio may be off on a
// silent tablet, so nothing depends on sound to convey state.
import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

export type Sfx = 'tap' | 'lift' | 'drop' | 'chirp' | 'win' | 'nope';

const SOURCES: Record<Sfx, number> = {
  tap: require('./assets/sfx/tap.wav'),
  lift: require('./assets/sfx/lift.wav'),
  drop: require('./assets/sfx/drop.wav'),
  chirp: require('./assets/sfx/chirp.wav'),
  win: require('./assets/sfx/win.wav'),
  nope: require('./assets/sfx/nope.wav'),
};

// Native handles require() ids directly. On web, expo-audio resolves assets to a
// root-absolute path ("/assets/...") and does NOT apply app.json's `baseUrl`
// (e.g. "/bird-sort"), so the fetch 404s. Resolve against document.baseURI so it
// works under any base path (GH Pages sub-path or root) — see msg to Cadence.
function resolveSource(mod: number): number | string {
  if (Platform.OS !== 'web') return mod;
  const uri = Asset.fromModule(mod).uri;
  try {
    const base = new URL(document.baseURI);
    if (/^https?:/.test(uri) || uri.startsWith(base.pathname)) return uri; // already correct
    return new URL(uri.replace(/^\//, ''), document.baseURI).href;
  } catch {
    return uri;
  }
}

const players: Partial<Record<Sfx, AudioPlayer>> = {};
let ready = false;

// Call once, ideally after the first user tap (web autoplay needs a gesture).
// Safe to call repeatedly.
export function initAudio() {
  if (ready) return;
  ready = true;
  // play sounds even if the device is on silent (spec: sound is core feedback)
  setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  for (const name of Object.keys(SOURCES) as Sfx[]) {
    try {
      players[name] = createAudioPlayer(resolveSource(SOURCES[name]));
    } catch {
      /* audio unavailable — game stays fully playable via visual twins */
    }
  }
}

// Fire-and-forget one-shot. Retriggers from the start so rapid taps all sound.
export function playSfx(name: Sfx) {
  if (!ready) initAudio();
  const p = players[name];
  if (!p) return;
  try {
    p.seekTo(0);
    p.play();
  } catch {
    /* never let a missing sound break gameplay */
  }
}
