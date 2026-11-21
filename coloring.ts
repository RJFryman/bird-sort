// Converts the live illustration tree into coloring regions and owns their saves.
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLLECTIONS, CollectionId } from './roster';

export const PALETTE = [
  { name: 'Red', color: '#D94C49' }, { name: 'Orange', color: '#ED9141' },
  { name: 'Yellow', color: '#F4CE53' }, { name: 'Green', color: '#63A46A' },
  { name: 'Teal', color: '#389B9E' }, { name: 'Blue', color: '#528BC9' },
  { name: 'Purple', color: '#976AB7' }, { name: 'Pink', color: '#E98FAB' },
  { name: 'Brown', color: '#A77954' }, { name: 'Black', color: '#202A29' },
] as const;
export const PAPER = '#FFFFFF';
export type Paint = Record<string, string>;
type Props = Record<string, any>;
export type Outline = { tree: React.ReactNode; regions: string[]; signature: string };
type Primitives = { groups: Set<unknown>; shapes: Set<unknown>; lines: Set<unknown>; eyes?: Set<unknown> };
const allowedColors = new Set<string>([PAPER, ...PALETTE.map(p => p.color)]);
const validId = (id: string) => /^s\d{1,4}$/.test(id);

/** Resolve only pure illustration helpers; native SVG components remain intact. */
export function outlineArtwork(art: React.ReactNode, native: Primitives): Outline {
  const regions: string[] = [], geometry: string[] = [];
  let index = 0;
  function visit(node: React.ReactNode, inheritedFill = 'black', eye = false): React.ReactNode {
    if (Array.isArray(node)) return node.map(child => visit(child, inheritedFill, eye));
    if (!React.isValidElement<Props>(node)) return null;
    const { type, props } = node;
    if (type === React.Fragment) return visit(props.children, inheritedFill, eye);
    const group = native.groups.has(type), shape = native.shapes.has(type), line = native.lines.has(type);
    if (!group && !shape && !line) {
      if (typeof type !== 'function') throw new Error('Unsupported illustration helper');
      return visit((type as (props: Props) => React.ReactNode)(props), inheritedFill,
        eye || Boolean(native.eyes?.has(type)));
    }
    const fill = props.fill ?? inheritedFill;
    if (group) {
      geometry.push(JSON.stringify(['group', props.transform, fill]));
      return React.cloneElement(node, { key: `g${index++}` }, visit(props.children, fill, eye));
    }
    const id = `s${index++}`;
    const canPaint = !eye && !line && fill !== 'none' && fill !== 'transparent';
    geometry.push(JSON.stringify([id, props.d, props.cx, props.cy, props.r, props.rx, props.ry,
      props.x, props.y, props.width, props.height, props.points, props.transform, fill]));
    if (canPaint) regions.push(id);
    // The eye's pupil stays black and its highlight white, so the face stays legible.
    const eyeFill = /^#(?:fff|fff8e8|ffffff)$/i.test(String(fill)) ? PAPER : '#000000';
    return React.cloneElement(node, {
      key: id, ...(canPaint ? { id: `color-${id}` } : {}),
      fill: eye ? eyeFill : canPaint ? PAPER : 'none',
      stroke: eye ? 'none' : '#000000',
      strokeWidth: eye ? 0 : Math.min(2.2, Math.max(0.8, Number(props.strokeWidth) || 1.2)),
      strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 1,
      ...(canPaint ? {} : { pointerEvents: 'none' }),
    });
  }
  const tree = visit(art);
  // FNV-1a detects art revisions without putting full illustration paths on disk.
  let hash = 2166136261;
  for (const char of geometry.join('|')) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return { tree, regions, signature: `outline-1-${(hash >>> 0).toString(16)}` };
}

export function paintArtwork(tree: React.ReactNode, fills: Paint, onPaint: (id: string) => void): React.ReactNode {
  if (Array.isArray(tree)) return tree.map(child => paintArtwork(child, fills, onPaint));
  if (!React.isValidElement<Props>(tree)) return tree;
  const id = typeof tree.props.id === 'string' && tree.props.id.startsWith('color-')
    ? tree.props.id.slice(6) : null;
  return React.cloneElement(tree, id ? { fill: fills[id] ?? PAPER, onPress: () => onPaint(id) }
    : {}, tree.props.children ? paintArtwork(tree.props.children, fills, onPaint) : undefined);
}

export function applyPaint(fills: Paint, id: string, color: string): Paint {
  if (!validId(id) || !allowedColors.has(color) || (fills[id] ?? PAPER) === color) return fills;
  const next = { ...fills };
  if (color === PAPER) delete next[id]; else next[id] = color;
  return next;
}

function validSpecies(collection: CollectionId, species: number): boolean {
  return Boolean(COLLECTIONS[collection]) && Number.isSafeInteger(species) &&
    species >= 0 && species < COLLECTIONS[collection].length;
}
export function coloringKey(collection: CollectionId, species: number): string {
  if (!validSpecies(collection, species)) throw new Error('Unknown coloring species');
  return `bird-sort-coloring-v1:${collection}:${species}`;
}

export function deserializeColoring(raw: string | null, collection: CollectionId, species: number,
  outline: Pick<Outline, 'signature' | 'regions'>): Paint {
  try {
    const data = raw ? JSON.parse(raw) : null;
    if (!validSpecies(collection, species) || !data || data.v !== 1 || data.collection !== collection ||
      data.species !== species || data.signature !== outline.signature || !data.fills ||
      typeof data.fills !== 'object' || Array.isArray(data.fills)) return {};
    const entries = Object.entries(data.fills);
    const regions = new Set(outline.regions);
    if (entries.length > 1000 || entries.some(([id, color]) => !validId(id) || !regions.has(id) ||
      typeof color !== 'string' || !allowedColors.has(color))) return {};
    return Object.fromEntries(entries.filter(([, color]) => color !== PAPER)) as Paint;
  } catch { return {}; }
}

const pending = new Map<string, Promise<void>>();
export async function loadColoring(collection: CollectionId, species: number, outline: Outline): Promise<Paint> {
  const key = coloringKey(collection, species);
  await pending.get(key)?.catch(() => {});
  return deserializeColoring(await AsyncStorage.getItem(key), collection, species, outline);
}

/** Snapshot and queue per species; failures propagate so the UI never claims a failed save. */
export async function saveColoring(collection: CollectionId, species: number, outline: Outline, fills: Paint): Promise<void> {
  const key = coloringKey(collection, species);
  const snapshot = JSON.stringify({ v: 1, collection, species, signature: outline.signature, fills });
  const write = (pending.get(key) ?? Promise.resolve()).catch(() => {}).then(async () => {
    const previous = await AsyncStorage.getItem(key);
    let data: any;
    try { data = previous ? JSON.parse(previous) : null; } catch { data = null; }
    // An art revision must not silently destroy the child's earlier paint data.
    if (data?.v === 1 && data.collection === collection && data.species === species &&
      typeof data.signature === 'string' && data.signature !== outline.signature && previous) {
      await AsyncStorage.setItem(`${key}:previous`, previous);
    }
    await AsyncStorage.setItem(key, snapshot);
  });
  pending.set(key, write);
  try { await write; } finally { if (pending.get(key) === write) pending.delete(key); }
}
