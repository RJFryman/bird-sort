// Calls must really request playback for non-cardinals and handle web rejection.
import { Platform } from 'react-native';
import { createAudioPlayer } from 'expo-audio';
import { playBirdCall, stopBirdCall } from './bird-calls';
import { BIRD_RECORDINGS } from './bird-recordings';

jest.mock('./audio', () => ({ initAudio: jest.fn(), resolveAudioSource: (source: number) => String(source) }));
jest.mock('expo-audio', () => ({ createAudioPlayer: jest.fn() }));
const audios: { play: jest.Mock; pause: jest.Mock }[] = [];
const OriginalAudio = globalThis.Audio;
beforeEach(() => {
  stopBirdCall(); audios.length = 0;
  (Platform as any).OS = 'web';
  globalThis.Audio = jest.fn().mockImplementation(() => {
    const player = { play: jest.fn().mockResolvedValue(undefined), pause: jest.fn() };
    audios.push(player); return player;
  }) as any;
});
afterAll(() => { stopBirdCall(); globalThis.Audio = OriginalAudio; });

test('every roster entry starts real audio, including non-cardinals; a new call stops the previous one', () => {
  for (let species = 0; species < BIRD_RECORDINGS.length; species++) {
    expect(playBirdCall(species)).toBe(BIRD_RECORDINGS[species].duration * 1000);
    expect(audios[species].play).toHaveBeenCalledTimes(1);
    if (species) expect(audios[species - 1].pause).toHaveBeenCalledTimes(1);
  }
});
test('a blocked browser play reports failure without an unhandled rejection', async () => {
  const error = jest.fn();
  (globalThis.Audio as any).mockImplementationOnce(() => ({ play: () => Promise.reject(new Error('NotAllowedError')), pause: jest.fn() }));
  playBirdCall(1,error);
  await Promise.resolve();
  expect(error).toHaveBeenCalledTimes(1);
});
test('a cancelled older request cannot report failure over a newer call', async () => {
  const error = jest.fn();
  (globalThis.Audio as any).mockImplementationOnce(() => ({ play: () => Promise.reject(new Error('AbortError')), pause: jest.fn() }));
  playBirdCall(1,error); playBirdCall(2);
  await Promise.resolve();
  expect(error).not.toHaveBeenCalled();
});
test('native calls use their bundled asset and release the previous player', () => {
  (Platform as any).OS = 'ios';
  const player = { play: jest.fn(), remove: jest.fn(), addListener: jest.fn() };
  (createAudioPlayer as jest.Mock).mockReturnValue(player);
  playBirdCall(2);expect(player.play).toHaveBeenCalledTimes(1);
  stopBirdCall();expect(player.remove).toHaveBeenCalledTimes(1);
});

test('completion follows the media ended event, and cancelled calls cannot finish a later win', () => {
  const finish = jest.fn();
  playBirdCall(2,undefined,finish);
  expect(finish).not.toHaveBeenCalled();
  (audios[0] as any).onended();
  expect(finish).toHaveBeenCalledTimes(1);
  playBirdCall(3,undefined,finish);stopBirdCall();
  (audios[1] as any).onended();
  expect(finish).toHaveBeenCalledTimes(1);
});
