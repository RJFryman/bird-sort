// Saved bird indices, attribution and the actual bundled audio must agree.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import records from './bird-recordings.json';
import { ROSTER } from './roster';

test('every saved bird entry has a species-labeled licensed recording in the same order', () => {
  expect(records.map(record => record.gameBird)).toEqual(ROSTER.map(bird => bird.name));
  for (const record of records) {
    expect(record.recordedSpecies.length).toBeGreaterThan(2);
    expect(record.scientificName).toMatch(/^[A-Z][a-z]+ [a-z]+/);
    expect(record.sourceUrl).toMatch(/^https:\/\//);
    expect(record.licenseUrl).toMatch(/^https:\/\/creativecommons.org\//);
    expect(record.recordist.length).toBeGreaterThan(1);
    expect(record.modifications).toContain('excerpt');
    expect(record.duration).toBeGreaterThanOrEqual(1);
    expect(record.duration).toBeLessThanOrEqual(3.2);
    const file = record.asset === 'cardinal' ? 'assets/sfx/cardinal-call.mp3' : `assets/sfx/birds/${record.asset}.mp3`;
    const audio = fs.readFileSync(path.join(__dirname, file));
    expect(audio.length).toBeGreaterThan(1000);
    expect(crypto.createHash('sha256').update(audio).digest('hex')).toBe(record.excerptSha256);
  }
});
test('imaginary parrots and the shared Eclectus call disclose the actual recorded bird', () => {
  for (const name of ['Parrot','Purple Parrot']) expect(records.find(record => record.gameBird === name)?.note).toContain('make-believe');
  expect(records.find(record => record.gameBird === 'Eclectus Female')?.note).toContain('sex is not specified');
});
