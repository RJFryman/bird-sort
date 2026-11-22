// Saved roster order joins each game bird to a genuine, credited field recording.
import records from './bird-recordings.json';
export type BirdRecording = {
  gameBird: string; asset: string; recordedSpecies: string; scientificName: string;
  title: string; recordist: string; sourceUrl: string; licenseName: string;
  provider: string; licenseUrl: string; duration: number; modifications: string; note: string;
};
export const BIRD_RECORDINGS: readonly BirdRecording[] = records;
