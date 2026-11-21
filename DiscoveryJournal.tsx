// Owns the always-open bird/fish gallery, earned stickers, and optional name speech.
import React, { useEffect, useRef, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bird } from './Bird';
import { COLLECTIONS, CollectionId } from './roster';
import { getDiscoveryClue } from './journal';
import { CARDINAL_RECORDING } from './cardinal-recording';
import { playSfx } from './audio';
import { ColoringPage } from './ColoringPage';

type Props = { collection: CollectionId; earned: number[]; onClose: () => void; reducedMotion: boolean };
const speechAvailable = () => Platform.OS === 'web' && typeof window !== 'undefined'
  && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';

export function DiscoveryJournal({ collection, earned, onClose, reducedMotion }: Props) {
  const roster = COLLECTIONS[collection];
  const [selected, setSelected] = useState<number | null>(null);
  const [notice, setNotice] = useState('');
  const [coloring, setColoring] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const stickers = new Set(earned.filter(id => Number.isInteger(id) && id >= 0 && id < roster.length));
  const friend = selected === null ? null : roster[selected];
  const clue = selected === null ? null : getDiscoveryClue(collection, selected);

  useEffect(() => () => {
    if (speechAvailable()) window.speechSynthesis.cancel();
  }, []);

  const choose = (index: number) => {
    if (speechAvailable()) window.speechSynthesis.cancel();
    setSelected(index);
    setNotice('');
    scroll.current?.scrollTo({ y: 0, animated: !reducedMotion });
  };
  const pronounce = () => {
    if (!friend) return;
    if (!speechAvailable()) {
      setNotice(`Say it together: ${friend.name}. Name audio is unavailable on this device.`);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(friend.name);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.onerror = () => setNotice(`Say it together: ${friend.name}. Name audio is unavailable right now.`);
      window.speechSynthesis.speak(utterance);
      setNotice(`Saying ${friend.name} with your device’s voice.`);
    } catch {
      setNotice(`Say it together: ${friend.name}. Name audio is unavailable right now.`);
    }
  };

  if (coloring && selected !== null) return <ColoringPage species={selected} collection={collection} onClose={() => setColoring(false)} />;

  return <View style={styles.overlay} accessibilityViewIsModal>
    <View style={styles.sheet}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text accessibilityRole="header" style={styles.title}>Discovery journal</Text>
          <Text style={styles.subtitle}>{stickers.size} / {roster.length} stickers earned</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Close discovery journal"
          onPress={onClose} style={styles.close}><Text style={styles.closeText}>✕ Close</Text></Pressable>
      </View>
      <ScrollView ref={scroll} contentContainerStyle={styles.content}>
        <Text style={styles.intro}>Every friend is here to explore. Finish a puzzle to earn its stickers!</Text>
        {friend && clue && <View style={styles.detail}>
          <View style={styles.detailTop}>
            <Bird species={selected!} collection={collection} scale={2} />
            <View style={styles.detailName}>
              <Text accessibilityRole="header" style={styles.name}>{friend.name}</Text>
              <Text style={styles.status}>{stickers.has(selected!) ? '★ Sticker earned' : 'Ready to discover'}</Text>
            </View>
          </View>
          <Text style={styles.clue}>{clue.text}</Text>
          <Pressable accessibilityRole="button" accessibilityLabel={`Hear the name ${friend.name}`}
            onPress={pronounce} style={styles.action}><Text style={styles.actionText}>♪ Hear the name</Text></Pressable>
          {collection === 'birds' && selected === 0 && <View style={{ gap: 8 }}>
            <Pressable accessibilityRole="button" style={styles.action} onPress={() => playSfx('cardinal')}><Text style={styles.actionText}>♪ Hear the cardinal call</Text></Pressable>
            <Text style={styles.clue}>Bird call recording</Text>
            <Text style={styles.small}>{CARDINAL_RECORDING.title} — {CARDINAL_RECORDING.recordist}. {CARDINAL_RECORDING.licenseName}. Edited excerpt.</Text>
            <Pressable accessibilityRole="link" style={styles.source} onPress={() => { void Linking.openURL(CARDINAL_RECORDING.sourceUrl); }}><Text style={styles.sourceText}>Original recording & recordist ↗</Text></Pressable>
            <Pressable accessibilityRole="link" style={styles.source} onPress={() => { void Linking.openURL(CARDINAL_RECORDING.licenseUrl); }}><Text style={styles.sourceText}>Recording licence: {CARDINAL_RECORDING.licenseName} ↗</Text></Pressable>
          </View>}
          <Pressable accessibilityRole="button" style={styles.action} onPress={() => setColoring(true)}><Text style={styles.actionText}>🎨 Color this {collection === 'birds' ? 'bird' : 'fish'}</Text></Pressable>
          <Text style={styles.small}>Device voice · spoken name, not a bird call</Text>
          {!!notice && <Text accessibilityLiveRegion="polite" style={styles.notice}>{notice}</Text>}
          {clue.source && <Pressable accessibilityRole="link"
            accessibilityLabel={`Read the nature fact source: ${clue.sourceLabel}`}
            onPress={() => { void Linking.openURL(clue.source!).catch(() => setNotice('The source could not open. Try again later.')); }}
            style={styles.source}><Text style={styles.sourceText}>Nature source: {clue.sourceLabel} ↗</Text></Pressable>}
        </View>}
        <View style={styles.grid}>
          {roster.map((bird, index) => <Pressable key={index} accessibilityRole="button"
            accessibilityLabel={`${bird.name}. ${stickers.has(index) ? 'Sticker earned' : 'Sticker not earned yet'}. Explore.`}
            accessibilityState={{ selected: selected === index }} onPress={() => choose(index)}
            style={[styles.card, selected === index && styles.selected]}>
            <Bird species={index} collection={collection} scale={1.45} />
            <Text style={styles.cardName}>{bird.name}</Text>
            <Text style={[styles.badge, stickers.has(index) && styles.earned]}>{stickers.has(index) ? '★ Earned' : 'Explore'}</Text>
          </Pressable>)}
        </View>
      </ScrollView>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(35,53,43,.4)', zIndex: 60, padding: 12, alignItems: 'center', justifyContent: 'center' },
  sheet: { width: '100%', maxWidth: 740, maxHeight: '100%', flexShrink: 1, backgroundColor: '#fbf8ee', borderRadius: 24, overflow: 'hidden', borderWidth: 2, borderColor: '#d7deca' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 8, borderBottomWidth: 1, borderBottomColor: '#d7deca' },
  heading: { flex: 1 },
  title: { fontSize: 23, fontWeight: '800', color: '#2f4b3a' },
  subtitle: { color: '#52664e', marginTop: 4, fontSize: 15 },
  close: { minWidth: 76, minHeight: 48, paddingHorizontal: 12, justifyContent: 'center', backgroundColor: '#e5ead8', borderRadius: 16 },
  closeText: { color: '#304c3d', fontSize: 16, fontWeight: '700' },
  content: { padding: 16, gap: 16 },
  intro: { color: '#53634d', fontSize: 16, lineHeight: 23 },
  detail: { borderRadius: 20, padding: 16, backgroundColor: '#edf0de', gap: 10, borderWidth: 1, borderColor: '#c9d5b5' },
  detailTop: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  detailName: { flex: 1 },
  name: { fontSize: 26, fontWeight: '800', color: '#2f4b3a' },
  status: { fontSize: 15, color: '#536b45', marginTop: 6 },
  clue: { fontSize: 19, lineHeight: 27, color: '#344b38' },
  action: { minHeight: 48, alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 15, backgroundColor: '#557752' },
  actionText: { color: '#fffdf4', fontSize: 17, fontWeight: '700' },
  small: { fontSize: 12, color: '#52664e', textAlign: 'center' },
  notice: { fontSize: 15, color: '#344b38', lineHeight: 21 },
  source: { minHeight: 48, justifyContent: 'center', paddingVertical: 8 },
  sourceText: { fontSize: 14, color: '#375e4d', textDecorationLine: 'underline' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  card: { width: 128, flexGrow: 1, maxWidth: 166, minHeight: 154, backgroundColor: '#fffdf5', borderWidth: 2, borderColor: '#e2dfce', borderRadius: 18, alignItems: 'center', justifyContent: 'center', padding: 8, gap: 5 },
  selected: { borderColor: '#557752', backgroundColor: '#edf0de' },
  cardName: { fontSize: 14, fontWeight: '700', color: '#344b38', textAlign: 'center' },
  badge: { fontSize: 12, fontWeight: '700', color: '#67725e', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: '#f0eedf' },
  earned: { color: '#5f4712', backgroundColor: '#f9e5a8' },
});
