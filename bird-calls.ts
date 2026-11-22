// One real recording at a time. Web playback stays inside the child's tap gesture.
import { Platform } from 'react-native';
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { initAudio, resolveAudioSource } from './audio';
import { BIRD_RECORDINGS } from './bird-recordings';
import { BIRD_CALL_ASSETS } from './bird-call-assets';

let webPlayer: HTMLAudioElement | null = null;
let nativePlayer: AudioPlayer | null = null;
let request = 0;

export function stopBirdCall(): void {
  request++;
  webPlayer?.pause();
  webPlayer = null;
  nativePlayer?.remove();
  nativePlayer = null;
}

/** Returns excerpt duration in ms; completion follows the actual media ended event. */
export function playBirdCall(species: number, onError?: () => void, onEnded?: () => void): number {
  stopBirdCall();
  const recording = BIRD_RECORDINGS[species];
  if (!recording) { onError?.(); return 0; }
  initAudio();
  const current = request;
  let finished = false;
  const finish = () => { if (!finished && current === request) { finished = true; onEnded?.(); } };
  const fail = () => { if (current === request) { onError?.(); finish(); } };
  try {
    const source = resolveAudioSource(BIRD_CALL_ASSETS[recording.asset]);
    if (Platform.OS === 'web') {
      // expo-audio's web play() discards the browser promise. Keep it here so a
      // blocked/failed replay can show an honest journal notice, without an
      // unhandled rejection. A new element also avoids asynchronous seek races.
      webPlayer = new Audio(source as string);
      webPlayer.onended = finish;
      webPlayer.onerror = fail;
      void webPlayer.play().catch(fail);
    } else {
      nativePlayer = createAudioPlayer(source);
      nativePlayer.addListener('playbackStatusUpdate', status => { if (status.didJustFinish) finish(); });
      nativePlayer.play();
    }
  } catch {
    fail();
  }
  return recording.duration * 1000;
}
