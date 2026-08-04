import React, { useReducer, useState, useEffect } from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Branch } from './Branch';
import { Bird } from './Bird';
import { ROSTER } from './roster';
import { isCleared } from './game';
import { reducer, init, CAP } from './state';
import { loadGame, saveGame } from './storage';

export default function App() {
  const [s, dispatch] = useReducer(reducer, 1, init);
  const [gallery, setGallery] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // load saved game once on startup (storage.ts rebuilds resumable state and
  // recomputes `won`, so a saved win resumes to the overlay, not a dead board)
  useEffect(() => {
    let live = true;
    loadGame()
      .then((resumed) => {
        if (live && resumed) dispatch({ type: 'RESTORE', state: resumed });
      })
      .finally(() => live && setLoaded(true));
    return () => {
      live = false;
    };
  }, []);

  // save after every change. skip until initial load done so we don't clobber it.
  // only the resumable facts are persisted (see storage.ts).
  useEffect(() => {
    if (!loaded) return;
    void saveGame(s);
  }, [s, loaded]);

  // size everything off the actual screen so it fits any device (phone..iPad)
  const { width, height } = useWindowDimensions();
  const n = s.board.length;
  const boardW = Math.min(width - 16, 1000);
  const branchW = boardW / n;
  // slot width fits a branch; clamp so it stays tappable but never overflows
  const slotW = Math.max(30, Math.min(72, branchW - 6));
  // also cap by height: title+hud+hint ~ 220px, CAP slots tall
  const slotByH = Math.max(30, (height - 240) / CAP);
  const slot = Math.min(slotW, slotByH);
  const slotH = slot * 0.96;
  const stickW = slot * 1.7;
  const birdScale = slot / 48;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <Text style={styles.title}>🐦 Bird Sort</Text>
      <View style={styles.hud}>
        <Pressable style={styles.step} onPress={() => dispatch({ type: 'GOTO', level: s.level - 1 })}>
          <Text style={styles.stepText}>−</Text>
        </Pressable>
        <Text style={styles.hudText}>Level {s.level}</Text>
        <Pressable style={styles.step} onPress={() => dispatch({ type: 'GOTO', level: s.level + 1 })}>
          <Text style={styles.stepText}>+</Text>
        </Pressable>
        <Text style={styles.hudText}>Moves {s.history.length}</Text>
        <Pressable style={styles.btn} onPress={() => dispatch({ type: 'UNDO' })}>
          <Text style={styles.btnText}>Undo</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => dispatch({ type: 'RESTART' })}>
          <Text style={styles.btnText}>Restart</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => setGallery(true)}>
          <Text style={styles.btnText}>Birds</Text>
        </Pressable>
      </View>
      <View style={styles.board}>
        {s.board.map((b, i) => (
          <Branch
            key={i}
            birds={b}
            capacity={CAP}
            selected={s.selected === i}
            done={isCleared(b, CAP)}
            onPress={() => dispatch({ type: 'TAP', i })}
            slotW={slot}
            slotH={slotH}
            stickW={stickW}
            birdScale={birdScale}
          />
        ))}
      </View>
      <Text style={styles.hint}>
        Tap a branch to lift its top matching birds, tap another to drop them. Fill a branch with
        one species and they happy-dance!
      </Text>
      {s.won && (
        <View style={styles.overlay}>
          <Text style={styles.winText}>Level Complete! 🎉</Text>
          <Pressable style={styles.btnBig} onPress={() => dispatch({ type: 'NEXT' })}>
            <Text style={styles.btnText}>Next level</Text>
          </Pressable>
        </View>
      )}
      {gallery && (
        <View style={[styles.overlay, styles.galleryOverlay]}>
          <Text style={styles.galleryTitle}>Bird Gallery</Text>
          <Text style={styles.gallerySub}>All {ROSTER.length} birds</Text>
          <ScrollView contentContainerStyle={styles.gallery}>
            {ROSTER.map((d, i) => (
              <View key={i} style={styles.card}>
                <Bird species={i} dancing delay={i * 60} />
                <Text style={styles.cardName}>{d.name}</Text>
              </View>
            ))}
          </ScrollView>
          <Pressable style={styles.btnBig} onPress={() => setGallery(false)}>
            <Text style={styles.btnText}>Close</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#cdeffd', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginTop: 16, color: '#223344' },
  hud: { flexDirection: 'row', gap: 12, alignItems: 'center', marginVertical: 10 },
  hudText: { fontSize: 15, color: '#223344', fontWeight: '600' },
  btn: { backgroundColor: '#6a9bd8', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
  step: { backgroundColor: '#6a9bd8', width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  stepText: { color: '#fff', fontSize: 20, fontWeight: '800', lineHeight: 22 },
  btnBig: {
    backgroundColor: '#44aa77',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  btnText: { color: '#fff', fontWeight: '700' },
  board: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 16, gap: 8 },
  hint: {
    fontSize: 12,
    color: '#456',
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: 30,
    maxWidth: 460,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.5)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  winText: { color: '#fff', fontSize: 30, fontWeight: '800' },
  galleryOverlay: { backgroundColor: '#274653', paddingTop: 30, paddingBottom: 20 },
  galleryTitle: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 2 },
  gallerySub: { color: '#bcd', fontSize: 13, marginBottom: 10 },
  lockBird: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockMark: { color: '#7f97a5', fontSize: 24, fontWeight: '800' },
  cardLocked: { color: '#7f97a5', fontSize: 13, fontWeight: '600', marginTop: 4 },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
    maxWidth: 520,
  },
  card: {
    width: 92,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,.12)',
    borderRadius: 12,
    paddingVertical: 10,
  },
  cardName: { color: '#fff', fontSize: 13, fontWeight: '600', marginTop: 4 },
});
