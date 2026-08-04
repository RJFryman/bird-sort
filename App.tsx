import React, { useReducer, useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Branch } from './Branch';
import { Bird } from './Bird';
import { ROSTER } from './roster';
import { generateLevel, canMove, applyMove, isWon, isCleared, Board } from './game';

const CAP = 4;
const EXTRA = 2;
const SAVE_KEY = 'bird-sort-save-v1';
const speciesForLevel = (l: number) => Math.min(5 + Math.floor((l - 1) / 2), ROSTER.length);

// pick `count` distinct random bird indices from the full roster (so every level
// shows a different mix, not always Cardinal..Crow)
function pickBirds(count: number, rng: () => number = Math.random): number[] {
  const idx = ROSTER.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, count);
}

type State = {
  level: number;
  maxLevel: number; // highest level ever reached -> unlocks
  board: Board;
  history: Board[];
  selected: number | null;
  won: boolean;
};

function init(level: number, maxLevel = level): State {
  const count = speciesForLevel(level);
  const pick = pickBirds(count);
  // generate with sequential ids 0..count-1, then remap to random roster indices
  const board = generateLevel(count, CAP, EXTRA).map((br) => br.map((id) => pick[id]));
  return {
    level,
    maxLevel: Math.max(maxLevel, level),
    board,
    history: [],
    selected: null,
    won: false,
  };
}

type Action =
  | { type: 'TAP'; i: number }
  | { type: 'UNDO' }
  | { type: 'RESTART' }
  | { type: 'NEXT' }
  | { type: 'GOTO'; level: number }
  | { type: 'RESTORE'; state: State };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'RESTORE':
      return a.state;
    case 'TAP': {
      const { i } = a;
      if (s.selected === null) {
        return s.board[i].length && !isCleared(s.board[i], CAP) ? { ...s, selected: i } : s;
      }
      if (s.selected === i) return { ...s, selected: null };
      if (canMove(s.board, s.selected, i, CAP)) {
        const board = applyMove(s.board, s.selected, i, CAP);
        return {
          ...s,
          board,
          history: [...s.history, s.board],
          selected: null,
          won: isWon(board, CAP),
        };
      }
      return { ...s, selected: s.board[i].length && !isCleared(s.board[i], CAP) ? i : null };
    }
    case 'UNDO':
      if (!s.history.length) return s;
      return {
        ...s,
        board: s.history[s.history.length - 1],
        history: s.history.slice(0, -1),
        selected: null,
        won: false,
      };
    case 'RESTART':
      return { ...s, board: s.history[0] ?? s.board, history: [], selected: null, won: false };
    case 'NEXT':
      return init(s.level + 1, s.maxLevel);
    case 'GOTO':
      return init(Math.max(1, a.level), s.maxLevel);
  }
}

export default function App() {
  const [s, dispatch] = useReducer(reducer, 1, init);
  const [gallery, setGallery] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // load saved game once on startup
  useEffect(() => {
    AsyncStorage.getItem(SAVE_KEY)
      .then((raw) => {
        console.log('[save] load raw =', raw ? raw.slice(0, 80) + '...' : raw);
        if (raw) {
          const saved = JSON.parse(raw) as State;
          if (saved && typeof saved.level === 'number' && Array.isArray(saved.board)) {
            console.log('[save] RESTORE level', saved.level, 'maxLevel', saved.maxLevel);
            dispatch({ type: 'RESTORE', state: { ...saved, won: false, selected: null } });
            return;
          }
        }
        console.log('[save] nothing valid saved -> keeping fresh level 1');
      })
      .catch((e) => console.warn('[save] LOAD FAILED:', e?.message ?? e))
      .finally(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // save after every change (and once right after load, so a fresh board persists
  // before the first move). skip until initial load done so we don't clobber it.
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(SAVE_KEY, JSON.stringify(s))
      .then(() => console.log('[save] wrote level', s.level, 'maxLevel', s.maxLevel))
      .catch((e) => console.warn('[save] WRITE FAILED:', e?.message ?? e));
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
