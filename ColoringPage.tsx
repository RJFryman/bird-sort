// A quiet, locally saved coloring page made from the game's actual SVG artwork.
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Modal, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { G, Path, Circle, Ellipse, Rect, Polygon, Polyline, Line } from 'react-native-svg';
import { COLLECTIONS, CollectionId } from './roster';
import { ParrotArt } from './ParrotArt';
import { SongbirdArt } from './SongbirdArt';
import { WildBirdArt } from './WildBirdArt';
import { FishArt } from './FishArt';
import { BirdEye } from './BirdDetails';
import { Paint, PAPER, PALETTE, applyPaint, loadColoring, outlineArtwork, paintArtwork, saveColoring } from './coloring';

type Props = { species: number; collection: CollectionId; onClose: () => void };
const native = { groups: new Set<unknown>([G]), shapes: new Set<unknown>([Path, Circle, Ellipse, Rect, Polygon]),
  lines: new Set<unknown>([Polyline, Line]), eyes: new Set<unknown>([BirdEye]) };

export function ColoringPage(props: Props) {
  return <ColoringCanvas key={`${props.collection}:${props.species}`} {...props} />;
}

function ColoringCanvas({ species, collection, onClose }: Props) {
  const bird = COLLECTIONS[collection][species];
  const { width, height } = useWindowDimensions();
  const compact = height < 680;
  const side = Math.min(440, Math.max(180, width - 48), Math.max(180, height * (compact ? .32 : .42)));
  const nativeID = `coloring-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;
  const outline = useMemo(() => outlineArtwork(collection === 'fish' ? FishArt({ fish: bird })
    : ParrotArt({ bird }) ?? SongbirdArt({ bird }) ?? WildBirdArt({ bird }), native), [collection, bird]);
  const [fills, setFills] = useState<Paint>({});
  const [selected, setSelected] = useState<string>(PALETTE[0].color);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('Opening your coloring page…');
  const [exportError, setExportError] = useState('');
  const current = useRef<Paint>({}), history = useRef<Paint[]>([]), revision = useRef(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    loadColoring(collection, species, outline).then(saved => {
      if (!alive.current) return;
      current.current = saved;
      setFills(saved);
      setStatus(Object.keys(saved).length ? 'Your colors are saved on this device.' : 'Choose a color, then tap a part of the picture.');
      setReady(true);
    }).catch(() => {
      if (!alive.current) return;
      setStatus('Could not open saved colors. You can still color here.');
      setReady(true);
    });
    return () => { alive.current = false; };
  }, [collection, species, outline]);

  function commit(next: Paint, remember = true) {
    if (!ready || next === current.current) return;
    if (remember) history.current = [...history.current.slice(-49), current.current];
    current.current = next;
    setFills(next);
    setStatus('Saving colors…');
    const change = ++revision.current;
    saveColoring(collection, species, outline, next).then(() => {
      if (alive.current && revision.current === change) setStatus('Your colors are saved on this device.');
    }).catch(() => {
      if (alive.current && revision.current === change) setStatus('Could not save colors. Keep this page open to keep coloring.');
    });
  }
  function undo() {
    const previous = history.current.pop();
    if (previous) commit(previous, false);
  }

  function exportPicture(print: boolean) {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    try {
      const source = document.getElementById(nativeID)?.querySelector('svg');
      if (!source) throw new Error('Picture is still opening. Try again.');
      const svg = source.cloneNode(true) as SVGSVGElement;
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('width', '800'); svg.setAttribute('height', '800');
      svg.setAttribute('viewBox', '0 0 96 96');
      svg.style.cssText = 'display:block;background:white;width:100%;height:auto;max-height:85vh';
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${bird.name} coloring page`; svg.prepend(title);
      // White backing survives SVG viewers that otherwise display transparency.
      const paper = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      for (const [key, value] of Object.entries({ x: '0', y: '0', width: '96', height: '96', fill: '#ffffff' })) paper.setAttribute(key, value);
      svg.insertBefore(paper, title.nextSibling);
      if (print) {
        const popup = window.open('', '_blank');
        if (!popup) throw new Error('Allow the print window, then tap Print again.');
        popup.opener = null;
        popup.document.title = `${bird.name} coloring page`;
        popup.document.body.style.cssText = 'margin:24px;background:white;color:black;font-family:Georgia,serif';
        const heading = popup.document.createElement('h1');
        heading.textContent = bird.name;
        heading.style.cssText = 'font-size:24px;text-align:center;margin:0';
        popup.document.body.append(heading, popup.document.importNode(svg, true));
        popup.focus();
        popup.setTimeout(() => popup.print(), 150);
      } else {
        const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob), link = document.createElement('a');
        link.href = url;
        link.download = `${bird.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-coloring.svg`;
        document.body.appendChild(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      setExportError('');
    } catch (error) { setExportError(error instanceof Error ? error.message : 'Could not export the picture. Try again.'); }
  }

  return <Modal visible animationType="none" onRequestClose={onClose} presentationStyle="fullScreen">
    <SafeAreaView style={styles.screen} accessibilityViewIsModal>
      <View style={styles.header}>
        <View style={styles.heading}><Text style={styles.eyebrow}>COLORING PAGE</Text><Text style={styles.title}>{bird.name}</Text></View>
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close coloring page" style={styles.close}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={[styles.content, compact && styles.compactContent]}>
        <Text style={[styles.instruction, compact && styles.compactInstruction]}>Pick a color. Tap a shape. Make it yours.</Text>
        <View nativeID={nativeID} style={[styles.paper, { width: side, height: side }]}>
          <Svg width={side} height={side} viewBox="0 0 96 96" accessibilityLabel={`${bird.name} picture. Tap its shapes to color.`}>
            {paintArtwork(outline.tree, fills, id => { if (ready) commit(applyPaint(current.current, id, selected)); })}
          </Svg>
        </View>
        <Text style={[styles.paletteLabel, compact && styles.compactPaletteLabel]}>CHOOSE A COLOR</Text>
        <View style={styles.palette}>
          {PALETTE.map(({ name, color }) => <Pressable key={color} onPress={() => setSelected(color)}
            accessibilityRole="button" accessibilityLabel={name} accessibilityState={{ selected: selected === color }}
            style={[styles.swatch, { backgroundColor: color }, selected === color && styles.selected]}>
            {selected === color && <Text style={[styles.check, { color: name === 'Yellow' ? '#172B22' : '#FFFFFF' }]}>✓</Text>}
          </Pressable>)}
        </View>
        <View style={styles.actions}>
          <Pressable onPress={() => setSelected(PAPER)} accessibilityRole="button" accessibilityState={{ selected: selected === PAPER }}
            style={[styles.button, selected === PAPER && styles.activeButton]}><Text style={styles.buttonText}>Eraser</Text></Pressable>
          <Pressable onPress={undo} disabled={!ready || !history.current.length} accessibilityRole="button"
            accessibilityState={{ disabled: !ready || !history.current.length }} style={[styles.button, !history.current.length && styles.disabled]}>
            <Text style={styles.buttonText}>Undo</Text>
          </Pressable>
          <Pressable onPress={() => { if (Object.keys(current.current).length) commit({}); }} disabled={!ready || !Object.keys(fills).length}
            accessibilityRole="button" accessibilityLabel="Reset all colors. Undo can restore them."
            style={[styles.button, !Object.keys(fills).length && styles.disabled]}><Text style={styles.buttonText}>Reset</Text></Pressable>
        </View>
        <Text style={styles.status} accessibilityLiveRegion="polite">{status}</Text>
        {Platform.OS === 'web' && <View style={styles.actions}>
          <Pressable onPress={() => exportPicture(false)} accessibilityRole="button" style={styles.button}><Text style={styles.buttonText}>Download SVG</Text></Pressable>
          <Pressable onPress={() => exportPicture(true)} accessibilityRole="button" style={styles.button}><Text style={styles.buttonText}>Print</Text></Pressable>
        </View>}
        {!!exportError && <Text style={styles.error} accessibilityLiveRegion="polite">{exportError}</Text>}
        <Text style={styles.footer}>A little field guide, in your own colors.</Text>
      </ScrollView>
    </SafeAreaView>
  </Modal>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F3E8' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#DDDCCB' },
  heading: { flex: 1, paddingRight: 12 }, eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#68755C' },
  title: { fontSize: 26, fontWeight: '800', color: '#263B2D', marginTop: 3 },
  close: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E5E9DA', alignItems: 'center', justifyContent: 'center' },
  closeText: { color: '#334C36', fontSize: 22 }, content: { alignItems: 'center', padding: 20, paddingBottom: 40 }, compactContent: { paddingTop: 12 },
  compactInstruction: { marginBottom: 10, fontSize: 13, lineHeight: 20 },
  instruction: { color: '#526047', fontSize: 15, textAlign: 'center', marginBottom: 16, lineHeight: 22 },
  paper: { backgroundColor: PAPER, borderRadius: 20, borderWidth: 1, borderColor: '#D6DCCB', overflow: 'hidden' },
  paletteLabel: { marginTop: 22, marginBottom: 12, fontWeight: '800', fontSize: 11, letterSpacing: 1.5, color: '#526047' },
  compactPaletteLabel: { marginTop: 10, marginBottom: 8 },
  palette: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, maxWidth: 272 },
  swatch: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  selected: { borderWidth: 4, borderColor: '#263B2D' }, check: { fontSize: 25, fontWeight: '900' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 16 },
  button: { minHeight: 48, minWidth: 72, paddingHorizontal: 16, paddingVertical: 13, borderRadius: 14, backgroundColor: '#E5E9DA', alignItems: 'center', justifyContent: 'center' },
  activeButton: { borderWidth: 2, borderColor: '#334C36', backgroundColor: PAPER }, disabled: { opacity: 0.4 },
  buttonText: { color: '#334C36', fontWeight: '700', fontSize: 14 }, status: { color: '#526047', fontSize: 12, textAlign: 'center', marginTop: 14, lineHeight: 18, maxWidth: 360 },
  error: { color: '#924131', textAlign: 'center', marginTop: 12, maxWidth: 360 },
  footer: { color: '#7A836C', fontSize: 12, marginTop: 22, textAlign: 'center' },
});
