/// <reference types="node" />
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

test('hash-bound measurements enforce audible levels and reject flat noise-like clips', () => {
  const measurements = require('./bird-audio-measurements.json') as {
    asset: string; sha256: string; integratedLufs: number; loudest100msDbfs: number;
    peakDbfs: number; windowContrastDb: number; tonalConcentration90: number;
  }[];
  expect(measurements.map(m => m.asset).sort()).toEqual([...new Set(records.map(r => r.asset))].sort());
  for (const measurement of measurements) {
    expect(measurement.sha256).toBe(records.find(r => r.asset === measurement.asset)?.excerptSha256);
    expect(measurement.integratedLufs).toBeGreaterThanOrEqual(-23);
    expect(measurement.integratedLufs).toBeLessThanOrEqual(-17);
    expect(measurement.loudest100msDbfs).toBeGreaterThanOrEqual(-24);
    expect(measurement.peakDbfs).toBeLessThanOrEqual(-1);
    expect(measurement.tonalConcentration90).toBeGreaterThanOrEqual(.1);
    if (measurement.windowContrastDb < 8) {
      const reviewed = require('./bird-audio-reviewed-windows.json') as Record<string, {sha256: string; finding: string}>;
      expect(reviewed[measurement.asset]?.sha256).toBe(measurement.sha256);
      expect(reviewed[measurement.asset]?.finding.length).toBeGreaterThan(20);
    }
  }
  const levels = measurements.map(m => m.integratedLufs);
  expect(Math.max(...levels) - Math.min(...levels)).toBeLessThanOrEqual(4);
});

test('the rejected African Grey noise window cannot use a tonal-only exception', () => {
  const reviewed = require('./bird-audio-reviewed-windows.json');
  expect(reviewed['psittacus-erithacus']).toBeUndefined();
  const measurement = require('./bird-audio-measurements.json').find((m: {asset: string}) => m.asset === 'psittacus-erithacus');
  expect(measurement.windowContrastDb).toBeGreaterThanOrEqual(8);
  expect(measurement.sha256).not.toBe('1b64f8ed0baef9fa84515ff9c5d9188ea8861a4c72bd1926d16bb0e78f2d0a1e');
});
