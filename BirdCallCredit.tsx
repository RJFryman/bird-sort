// Species recording, replay and full reuse credit live with the journal entry.
import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { BIRD_RECORDINGS } from './bird-recordings';
import { playBirdCall } from './bird-calls';

export function BirdCallCredit({ species, onNotice }: { species: number; onNotice: (notice: string) => void }) {
  const recording = BIRD_RECORDINGS[species];
  if (!recording) return null;
  const open = (url: string) => { void Linking.openURL(url).catch(() => onNotice('The credit link could not open. Try again later.')); };
  return <View style={styles.section}>
    <Pressable accessibilityRole="button" style={styles.action}
      onPress={() => { onNotice(''); playBirdCall(species, () => onNotice('The recording could not play. Tap to try again.')); }}>
      <Text style={styles.actionText}>{species === 0 ? '♪ Hear the cardinal call' : '♪ Hear the bird call'}</Text>
    </Pressable>
    <Text style={styles.label}>Real bird recording · {recording.recordedSpecies}</Text>
    {!!recording.note && <Text style={styles.credit}>{recording.note}</Text>}
    <Text style={styles.credit}>{recording.title} — {recording.recordist} · {recording.provider}. {recording.licenseName}. {recording.modifications}</Text>
    <Pressable accessibilityRole="link" style={styles.link} onPress={() => open(recording.sourceUrl)}>
      <Text style={styles.linkText}>Original recording & recordist ↗</Text>
    </Pressable>
    <Pressable accessibilityRole="link" style={styles.link} onPress={() => open(recording.licenseUrl)}>
      <Text style={styles.linkText}>Recording licence: {recording.licenseName} ↗</Text>
    </Pressable>
  </View>;
}
const styles = StyleSheet.create({
  section: { gap: 8 }, action: { minHeight: 48, backgroundColor: '#e3ecd9', borderRadius: 14, padding: 12, justifyContent: 'center' },
  actionText: { color: '#28543e', fontSize: 17, fontWeight: '800' },
  label: { color: '#28543e', fontSize: 15, fontWeight: '700' }, credit: { color: '#526959', fontSize: 13, lineHeight: 19 },
  link: { minHeight: 44, justifyContent: 'center' }, linkText: { color: '#286078', fontSize: 13, textDecorationLine: 'underline' },
});
