// Coloring uses the same geometry as the game and persists independently per species.
import React from 'react';
import { G, Path, Circle, Ellipse, Rect, Polygon, Polyline, Line } from 'react-native-svg';
import { COLLECTIONS } from './roster';
import { BirdEye } from './BirdDetails';
import { ParrotArt } from './ParrotArt';
import { SongbirdArt } from './SongbirdArt';
import { WildBirdArt } from './WildBirdArt';
import { FishArt } from './FishArt';
import { PALETTE, PAPER, Paint, applyPaint, coloringKey, deserializeColoring, loadColoring,
  outlineArtwork, paintArtwork, saveColoring } from './coloring';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => {
  let stored: Record<string, string> = {};
  return { __esModule: true, default: {
    getItem: jest.fn((key: string) => Promise.resolve(stored[key] ?? null)),
    setItem: jest.fn((key: string, value: string) => { stored[key] = value; return Promise.resolve(); }),
    __reset: () => { stored = {}; },
  } };
});

const native = { groups: new Set<unknown>([G]), shapes: new Set<unknown>([Path, Circle, Ellipse, Rect, Polygon]),
  lines: new Set<unknown>([Polyline, Line]), eyes: new Set<unknown>([BirdEye]) };
const red = PALETTE[0].color;
const storage = AsyncStorage as typeof AsyncStorage & { __reset: () => void };
const path = (props: object) => React.createElement(Path, props);
const simple = () => outlineArtwork(path({ d: 'M0 0L10 0L10 10Z', fill: 'red' }), native);
function elements(node: React.ReactNode): React.ReactElement<any>[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!React.isValidElement<any>(node)) return [];
  return [node, ...elements((node.props as any).children)];
}

beforeEach(() => { storage.__reset(); jest.clearAllMocks(); });

test('all actual bird and fish art becomes white regions with black outlines and fixed eyes', () => {
  for (const collection of ['birds', 'fish'] as const) for (const bird of COLLECTIONS[collection]) {
    const art = collection === 'fish' ? FishArt({ fish: bird })
      : ParrotArt({ bird }) ?? SongbirdArt({ bird }) ?? WildBirdArt({ bird });
    const outline = outlineArtwork(art, native), nodes = elements(outline.tree);
    expect(outline.regions.length).toBeGreaterThan(0);
    expect(new Set(outline.regions).size).toBe(outline.regions.length);
    const regions = nodes.filter(node => node.props.id?.startsWith('color-'));
    expect(regions).toHaveLength(outline.regions.length);
    for (const node of regions) {
      expect(node.props.fill).toBe(PAPER);
      expect(node.props.stroke).toBe('#000000');
      expect(node.props.strokeWidth).toBeGreaterThan(0);
    }
    expect(nodes.some(node => node.props.fill === '#000000' && node.props.stroke === 'none')).toBe(true);
  }
});

test('pure helpers flatten, transforms survive, unfilled lines remain unfilled, and eyes keep contrast', () => {
  // Identity protection works even if a bundler changes this function's name.
  const helper = () => React.createElement(G, { transform: 'rotate(5 20 20)' },
    path({ d: 'M0 0L10 10Z', fill: '#abc', strokeWidth: 0 }),
    path({ d: 'M1 2L5 8', fill: 'none' }),
    React.createElement(BirdEye, { x: 5, y: 5 }));
  const outline = outlineArtwork(React.createElement(helper), native);
  const nodes = elements(outline.tree);
  expect(nodes[0].props.transform).toBe('rotate(5 20 20)');
  expect(outline.regions).toHaveLength(1);
  expect(nodes.find(node => node.props.d === 'M1 2L5 8')?.props.fill).toBe('none');
  expect(nodes.filter(node => node.type === Circle).map(node => node.props.fill)).toEqual([PAPER, '#000000', PAPER]);
  expect(nodes.filter(node => node.type === Circle).every(node => !node.props.id)).toBe(true);
  expect(nodes.some(node => node.type === helper || node.type === BirdEye)).toBe(false);
});

test('tap handlers paint only their region, eraser removes paint, and a no-op preserves identity', () => {
  const outline = simple(), paint = jest.fn();
  const id = outline.regions[0];
  const next = applyPaint({}, id, red);
  const rendered = elements(paintArtwork(outline.tree, next, paint))[0];
  expect(rendered.props.fill).toBe(red);
  rendered.props.onPress(); expect(paint).toHaveBeenCalledWith(id);
  expect(applyPaint(next, id, red)).toBe(next);
  expect(applyPaint(next, id, PAPER)).toEqual({});
  expect(applyPaint(next, 'not-a-shape', red)).toBe(next);
  expect(applyPaint(next, id, 'url(https://invalid)')).toBe(next);
  expect(elements(outline.tree)[0].props.fill).toBe(PAPER);
});

test('art path or inherited transform revisions invalidate an old region mapping', () => {
  const first = simple();
  const revised = outlineArtwork(path({ d: 'M0 0L20 0L10 10Z', fill: 'red' }), native);
  expect(first.signature).not.toBe(revised.signature);
  const transformed = outlineArtwork(React.createElement(G, { transform: 'translate(1 2)' },
    path({ d: 'M0 0L10 0L10 10Z', fill: 'red' })), native);
  expect(first.signature).not.toBe(transformed.signature);
});

test('saved colors restore by collection/species and never touch game progress', async () => {
  const outline = simple(), fills = { [outline.regions[0]]: red };
  await saveColoring('birds', 0, outline, fills);
  expect(await loadColoring('birds', 0, outline)).toEqual(fills);
  expect(await loadColoring('birds', 1, outline)).toEqual({});
  expect(await loadColoring('fish', 0, outline)).toEqual({});
  expect((AsyncStorage.setItem as jest.Mock).mock.calls[0][0]).toBe('bird-sort-coloring-v1:birds:0');
  const changed = { ...outline, signature: 'new-art' };
  expect(await loadColoring('birds', 0, changed)).toEqual({});
  expect(() => coloringKey('fish', -1)).toThrow();
  expect(() => coloringKey('birds', 10000)).toThrow();
});

test.each(['{partial', '{}', '{"v":2}', '[]', 'null'])('malformed or unsupported saves stay blank: %s', raw => {
  expect(deserializeColoring(raw, 'birds', 0, simple())).toEqual({});
});

test('wrong species, unknown regions, invalid colors and non-object fills cannot restore', () => {
  const outline = simple();
  const data = { v: 1, species: 0, collection: 'birds', signature: outline.signature, fills: { [outline.regions[0]]: red } };
  for (const patch of [{ species: 1 }, { collection: 'fish' }, { signature: 'old' },
    { fills: ['red'] }, { fills: { s9999: red } }, { fills: { [outline.regions[0]]: 'javascript:bad' } }]) {
    expect(deserializeColoring(JSON.stringify({ ...data, ...patch }), 'birds', 0, outline)).toEqual({});
  }
});

test('queued saves snapshot input and a reopened page waits for the newest write', async () => {
  const outline = simple(), id = outline.regions[0];
  let release!: () => void;
  let began!: () => void;
  const started = new Promise<void>(resolve => { began = resolve; });
  const original = (AsyncStorage.setItem as jest.Mock).getMockImplementation()!;
  (AsyncStorage.setItem as jest.Mock).mockImplementationOnce((key, value) => new Promise<void>(resolve => {
    release = () => { original(key, value); resolve(); };
    began();
  }));
  const first = saveColoring('birds', 0, outline, { [id]: red });
  await started;
  const latest: Paint = { [id]: PALETTE[1].color };
  const second = saveColoring('birds', 0, outline, latest);
  latest[id] = red;
  const reopened = loadColoring('birds', 0, outline);
  release(); await first; await second;
  expect(await reopened).toEqual({ [id]: PALETTE[1].color });
});

test('storage failures propagate for honest status and later writes recover', async () => {
  const outline = simple();
  (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(new Error('full'));
  await expect(saveColoring('birds', 0, outline, {})).rejects.toThrow('full');
  await expect(saveColoring('birds', 0, outline, {})).resolves.toBeUndefined();
  (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('blocked'));
  await expect(loadColoring('birds', 0, outline)).rejects.toThrow('blocked');
});


test('redesigned outlines retain earlier paint data before the first new save',async()=>{
  const first=simple(), id=first.regions[0];
  await saveColoring('birds',0,first,{[id]:red});
  const raw=await AsyncStorage.getItem(coloringKey('birds',0));
  const next={...first,signature:'new-outline'};
  await saveColoring('birds',0,next,{[id]:PALETTE[1].color});
  expect(await AsyncStorage.getItem(coloringKey('birds',0)+':previous')).toBe(raw);
  expect(await loadColoring('birds',0,next)).toEqual({[id]:PALETTE[1].color});
});

test('every fish coloring page offers at least six independently paintable regions', () => {
  for (const fish of COLLECTIONS.fish) {
    const outline = outlineArtwork(FishArt({ fish }), native);
    expect(outline.regions.length).toBeGreaterThanOrEqual(6);
  }
});
