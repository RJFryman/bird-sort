import React, { useReducer, useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, Pressable, TextInput, StyleSheet, ScrollView, Animated, Easing, useWindowDimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Branch } from './Branch';
import { Bird } from './Bird';
import { COLLECTIONS, CollectionId } from './roster';
import { isCleared, canMove, applyMove, isWon, Board } from './game';
import { reducer, init, CAP } from './state';
import { fitGrid, marginFor, handFor, perchWidth } from './layout';
import { loadGame, saveGame, loadGateOn, saveGateOn, loadLastCollection, saveLastCollection } from './storage';
import { initAudio, playSfx } from './audio';
import { configureFeedback, flushFeedback } from '@harmony/feedback';
import { FeedbackButton } from '@harmony/feedback/FeedbackButton';

// Feedback lives behind the grown-up gate, never on the play surface — a kid
// should not be able to post to Slack. Same reasoning as the parent settings.
configureFeedback({
  endpoint: process.env.EXPO_PUBLIC_FEEDBACK_URL ?? 'http://localhost:6300/feedback',
  app: 'bird-sort',
  appVersion: '1.0.0',
  platform: Platform.OS,
});

const IDLE_MS = 3500; // idle re-invite / level-start demo delay (spec §5)
// Word a grown-up types to pass the gate. Reading+typing beats a pre-reader 5yo
// (hold-to-continue did not — Robert's flag, msg 011).
// ponytail: fixed word, not configurable. Add a per-parent word only if asked.
const GATE_WORD = 'grown-up';

const clearedCount = (board: Board) => board.filter((b) => isCleared(b, CAP)).length;

// first source branch that has any legal move — used to demo/hint the child
function findHint(board: Board): number | null {
  for (let from = 0; from < board.length; from++)
    for (let to = 0; to < board.length; to++)
      if (canMove(board, from, to, CAP)) return from;
  return null;
}

// ---- Parent gate: type a word to pass (the one place text is allowed, §4).
// Name-gated, not hold-to-continue: a pre-reader 5yo can't read+type the word,
// but hold-to-continue they just... hold (Robert's flag, msg 011). ----
function NameGate({ onPass, onCancel }: { onPass: () => void; onCancel: () => void }) {
  const [val, setVal] = useState('');
  const ok = val.trim().toLowerCase() === GATE_WORD;
  return (
    <View style={styles.overlay}>
      <Text style={styles.gateTitle}>Ask a grown-up</Text>
      <Text style={styles.gateSub}>Type “{GATE_WORD}” to continue</Text>
      <TextInput
        style={styles.gateInput}
        value={val}
        onChangeText={setVal}
        onSubmitEditing={() => ok && onPass()}
        autoFocus
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={GATE_WORD}
        placeholderTextColor="#8fb3c8"
        returnKeyType="go"
      />
      <Pressable onPress={() => ok && onPass()} disabled={!ok} style={[styles.gateBtn, !ok && styles.gateBtnOff]}>
        <Text style={styles.gateBtnText}>Enter</Text>
      </Pressable>
      <Pressable onPress={onCancel} style={styles.gateCancel} hitSlop={16}>
        <Text style={styles.gateCancelText}>← back to play</Text>
      </Pressable>
    </View>
  );
}

// expanding ripple at an empty-tap point (visual twin of the soft tap sound)
function Ripple({ x, y }: { x: number; y: number }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, { toValue: 1, duration: 450, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [a]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x - 30,
        top: y - 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        borderColor: '#7fbfe0',
        opacity: a.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] }),
        transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1.6] }) }],
      }}
    />
  );
}

export default function App() {
  const [s, dispatch] = useReducer(reducer, 1, init);
  const [gallery, setGallery] = useState(false);
  const [menu, setMenu] = useState(false); // parent panel (after gate)
  const [gate, setGate] = useState(false); // parent gate overlay
  const [gateOn, setGateOn] = useState(false); // is the gate enabled? default OFF (Robert's ask)
  const [loaded, setLoaded] = useState(false);
  const [home, setHome] = useState(true); // wordless two-hero mode picker (first run)
  const collection = s.collection; // active collection is the single source of truth
  const [wiggle, setWiggle] = useState({ i: -1, n: 0 }); // illegal-tap shake target
  const [hintFrom, setHintFrom] = useState<number | null>(null);
  const [activity, setActivity] = useState(0); // bumps on every interaction
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rid = useRef(0);
  const winPop = useRef(new Animated.Value(0)).current;

  // --- save wiring (Cadence's reliability API; do not re-inline — see msg 009) ---
  // load saved game once on startup (storage.ts rebuilds resumable state and
  // recomputes `won`, so a saved win resumes to the overlay, not a dead board)
  useEffect(() => {
    let live = true;
    loadLastCollection()
      .then(async (last) => {
        if (!live || !last) return; // first run -> leave the two-hero home showing
        const resumed = await loadGame(last);
        if (!live) return;
        dispatch({ type: 'RESTORE', state: resumed ?? init(1, 1, last) });
        setHome(false);
      })
      .finally(() => live && setLoaded(true));
    return () => {
      live = false;
    };
  }, []);

  // Enter a collection: remember it, resume its own save (or start fresh), leave
  // the home picker. Used by the two heroes and the mid-play swap button.
  const enter = async (c: CollectionId) => {
    initAudio();
    playSfx('lift');
    void saveLastCollection(c);
    const resumed = await loadGame(c);
    dispatch({ type: 'RESTORE', state: resumed ?? init(1, 1, c) });
    setHome(false);
  };

  // save after every change. skip until initial load done so we don't clobber it.
  useEffect(() => {
    if (!loaded) return;
    void saveGame(s);
  }, [s, loaded]);
  // --- end save wiring ---

  // load the parent-gate setting once (default OFF if unset/unreadable)
  useEffect(() => {
    loadGateOn().then(setGateOn).catch(() => {});
  }, []);

  // onboarding demo + idle re-invite: after quiet time, point at a legal move.
  // Re-arms on every interaction and whenever the board changes (level start).
  useEffect(() => {
    setHintFrom(null);
    if (s.won || menu || gate || gallery) return;
    const t = setTimeout(() => setHintFrom(findHint(s.board)), IDLE_MS);
    return () => clearTimeout(t);
  }, [s.board, s.selected, activity, s.won, menu, gate, gallery]);

  // juicy win pop-in
  useEffect(() => {
    if (s.won) {
      winPop.setValue(0);
      Animated.spring(winPop, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }).start();
    }
  }, [s.won, winPop]);

  // Send anything captured while offline. Safe on every start — the collector
  // dedupes on ref, so a re-send costs nothing.
  useEffect(() => { void flushFeedback(); }, []);

  const onTap = (i: number) => {
    initAudio();
    setActivity((a) => a + 1);
    const sel = s.selected;
    const board = s.board;
    if (sel === null) {
      playSfx(board[i].length && !isCleared(board[i], CAP) ? 'lift' : 'tap');
      dispatch({ type: 'TAP', i });
      return;
    }
    if (sel === i) {
      playSfx('tap');
      dispatch({ type: 'TAP', i });
      return;
    }
    if (canMove(board, sel, i, CAP)) {
      const next = applyMove(board, sel, i, CAP);
      const won = isWon(next, CAP);
      const locked = clearedCount(next) > clearedCount(board);
      playSfx('drop');
      if (won) playSfx('win');
      else if (locked) playSfx('chirp');
      dispatch({ type: 'TAP', i });
      return;
    }
    // illegal drop: gentle nope + wiggle, keep the pick up (reducer TAP would
    // reselect; we intentionally skip dispatch so the child's pick stays lifted)
    playSfx('nope');
    setWiggle((w) => ({ i, n: w.n + 1 }));
  };

  const onEmptyTap = (e: any) => {
    initAudio();
    setActivity((a) => a + 1);
    playSfx('tap');
    const { locationX: x, locationY: y } = e.nativeEvent;
    const id = rid.current++;
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 500);
  };

  // run a parent-gated action, closing the gate/menu
  const guard = (action: () => void) => {
    setMenu(false);
    setGate(false);
    action();
  };

  // size everything off the actual screen so it fits any device (phone..iPad)
  const { width, height } = useWindowDimensions();
  const n = s.board.length;
  // Pick the grid first, then size to it. Sizing off `boardW / n` assumed one
  // row of n branches, which stopped being true as soon as the board wrapped.
  const { slot, boardW, touchMin } = fitGrid(n, width, height, CAP);
  const slotH = slot * 0.96;
  const perchW = perchWidth(slot, CAP);
  const birdScale = slot / 48;
  const branchMargin = marginFor(slot);
  const handH = handFor(slot);

  const isFish = collection === 'fish';

  return (
    <SafeAreaView style={[styles.root, isFish && styles.rootFish]}>
      <StatusBar style="dark" />

      {/* empty-space taps still respond (no dead screen, spec §3) */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onEmptyTap} />
      {ripples.map((r) => (
        <Ripple key={r.id} x={r.x} y={r.y} />
      ))}

      {/* wordless title so the play screen carries no instructions (spec §2) */}
      <Text style={styles.title}>{isFish ? '🐠' : '🐦'}</Text>

      {/* Width is pinned to exactly `cols` cells so flexWrap breaks where fitGrid
          decided. The whole board always fits — never scrolls, never clips. */}
      <View style={[styles.board, { width: boardW + 32 }]} pointerEvents="box-none">
        {s.board.map((b, i) => (
          <Branch
            key={i}
            birds={b}
            collection={collection}
            capacity={CAP}
            selected={s.selected === i}
            done={isCleared(b, CAP)}
            hint={hintFrom === i && s.selected === null}
            wiggleNonce={wiggle.i === i ? wiggle.n : 0}
            onPress={() => onTap(i)}
            slotW={slot}
            slotH={slotH}
            perchW={perchW}
            birdScale={birdScale}
            margin={branchMargin}
            handH={handH}
            touchMin={touchMin}
          />
        ))}
      </View>

      {/* kid-friendly, ungated undo (forgiving, never a fail state) */}
      {s.history.length > 0 && !s.won && (
        <Pressable
          style={styles.undo}
          onPress={() => { initAudio(); setActivity((a) => a + 1); playSfx('lift'); dispatch({ type: 'UNDO' }); }}
          hitSlop={16}
        >
          <Text style={styles.undoText}>↩</Text>
        </Pressable>
      )}

      {/* small grown-up entry, tucked in a corner, opens the parent gate */}
      <Pressable style={styles.grownup} onPress={() => (gateOn ? setGate(true) : setMenu(true))} hitSlop={16}>
        <Text style={styles.grownupText}>grown-ups</Text>
      </Pressable>

      {/* swap collections — one tap, mid-play, NO parent gate (it's play, not an
          exit; spec §2). Shows the OTHER collection's cutie so the child knows
          what they'll get. */}
      {!home && !s.won && (
        <Pressable style={styles.swap} onPress={() => void enter(isFish ? 'birds' : 'fish')} hitSlop={16}>
          <Text style={styles.swapText}>{isFish ? '🐦' : '🐠'}</Text>
        </Pressable>
      )}

      {s.won && (
        <View style={styles.overlay}>
          <Animated.Text
            style={[
              styles.winText,
              { transform: [{ scale: winPop.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) }] },
            ]}
          >
            🎉🎉🎉
          </Animated.Text>
          <Pressable
            style={styles.btnBig}
            onPress={() => { initAudio(); playSfx('lift'); dispatch({ type: 'NEXT' }); }}
          >
            <Text style={styles.btnBigText}>▶</Text>
          </Pressable>
        </View>
      )}

      {gate && (
        <NameGate onPass={() => { setGate(false); setMenu(true); }} onCancel={() => setGate(false)} />
      )}

      {menu && (
        <View style={[styles.overlay, styles.menuOverlay]}>
          <Text style={styles.menuTitle}>Grown-up menu</Text>
          <View style={styles.menuRow}>
            <Pressable style={styles.menuBtn} onPress={() => guard(() => dispatch({ type: 'GOTO', level: s.level - 1 }))}>
              <Text style={styles.menuBtnText}>◀ Level</Text>
            </Pressable>
            <Text style={styles.menuLevel}>Level {s.level}</Text>
            <Pressable style={styles.menuBtn} onPress={() => guard(() => dispatch({ type: 'GOTO', level: s.level + 1 }))}>
              <Text style={styles.menuBtnText}>Level ▶</Text>
            </Pressable>
          </View>
          <Pressable style={styles.menuBtnWide} onPress={() => guard(() => dispatch({ type: 'RESTART' }))}>
            <Text style={styles.menuBtnText}>Restart this level</Text>
          </Pressable>
          <Pressable style={styles.menuBtnWide} onPress={() => { setMenu(false); setGallery(true); }}>
            <Text style={styles.menuBtnText}>Bird gallery</Text>
          </Pressable>
          <Pressable
            style={styles.menuBtnWide}
            onPress={() => { const nv = !gateOn; setGateOn(nv); void saveGateOn(nv); }}
          >
            <Text style={styles.menuBtnText}>Ask a grown-up first: {gateOn ? 'ON' : 'OFF'}</Text>
          </Pressable>
          <FeedbackButton
            kinds={['idea', 'bug', 'praise']}
            context={{ level: s.level, collection, species: COLLECTIONS[collection].length, gateOn }}
            who="robert"
          >
            {/* onPress={open} only — no setMenu(false). The sheet is a Modal and
                renders above the menu; closing the menu would unmount this
                component mid-open. */}
            {(open) => (
              <Pressable style={styles.menuBtnWide} onPress={open}>
                <Text style={styles.menuBtnText}>Send feedback</Text>
              </Pressable>
            )}
          </FeedbackButton>
          <Pressable style={styles.menuBtnWide} onPress={() => setMenu(false)}>
            <Text style={styles.menuBtnText}>Back to play</Text>
          </Pressable>
        </View>
      )}

      {gallery && (
        <View style={[styles.overlay, styles.galleryOverlay]}>
          {/* wordless header — the collection's own cutie, not a title (spec §2) */}
          <Text style={styles.galleryTitle}>{isFish ? '🐠' : '🐦'}</Text>
          <ScrollView contentContainerStyle={styles.gallery}>
            {COLLECTIONS[collection].map((d, i) => (
              <View key={i} style={styles.card}>
                <Bird species={i} collection={collection} dancing delay={i * 60} />
                <Text style={styles.cardName}>{d.name}</Text>
              </View>
            ))}
          </ScrollView>
          <Pressable style={styles.btnBig} onPress={() => setGallery(false)}>
            <Text style={styles.btnBigText}>✕</Text>
          </Pressable>
        </View>
      )}

      {/* HOME: wordless two-hero mode picker. Sky (left) = birds, water (right) =
          fish. Tap a cutie to dive/fly into that collection (spec §2). Shown on
          first run and reachable via the swap button any time. */}
      {home && (
        <View style={styles.homeOverlay}>
          <View style={styles.homeSky} />
          <View style={styles.homeWater} />
          <View style={styles.homeRow} pointerEvents="box-none">
            <Pressable style={styles.hero} onPress={() => void enter('birds')} hitSlop={24}>
              <Bird species={0} collection="birds" dancing scale={2.6} />
            </Pressable>
            <Pressable style={styles.hero} onPress={() => void enter('fish')} hitSlop={24}>
              <Bird species={0} collection="fish" dancing scale={2.6} />
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // centred so leftover space splits above and below the board instead of all
  // pooling under it — the board used to sit high with a dead bottom third
  root: { flex: 1, backgroundColor: '#cdeffd', alignItems: 'center', justifyContent: 'center' },
  rootFish: { backgroundColor: '#a7dbef' }, // deeper water tint for fish mode
  title: { fontSize: 34, marginTop: 12 },
  // swap-collection button: big corner cutie, no words (spec §1 >=96px, >=60 edge)
  swap: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ffffffcc',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  swapText: { fontSize: 46 },
  // wordless two-hero home (sky = birds, water = fish)
  homeOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row' },
  homeSky: { flex: 1, backgroundColor: '#bfe4fb' },
  homeWater: { flex: 1, backgroundColor: '#5fb0dd' },
  homeRow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  hero: { width: 168, height: 200, alignItems: 'center', justifyContent: 'center' },
  board: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 16, marginTop: 8 },
  // big forgiving kid target for undo (spec §1: >=96px)
  undo: {
    position: 'absolute',
    left: 24,
    bottom: 24,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ffffffcc',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  undoText: { fontSize: 44, color: '#4a6b8a' },
  grownup: { position: 'absolute', right: 20, top: 20, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#ffffff66' },
  grownupText: { color: '#3a5568', fontSize: 12, fontWeight: '600' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.5)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  winText: { fontSize: 72 },
  // huge primary "keep playing" target (spec §1: hero button 140+)
  btnBig: { backgroundColor: '#44aa77', width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center' },
  btnBigText: { color: '#fff', fontSize: 56, fontWeight: '800' },
  // parent gate
  gateTitle: { color: '#fff', fontSize: 30, fontWeight: '800' },
  gateSub: { color: '#dfe', fontSize: 16 },
  gateBtn: { width: 220, height: 96, borderRadius: 20, backgroundColor: '#44aa77', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  gateBtnOff: { backgroundColor: '#33506a', opacity: 0.6 },
  gateBtnText: { color: '#fff', fontSize: 24, fontWeight: '800' },
  gateInput: { width: 260, height: 72, borderRadius: 16, backgroundColor: '#fff', color: '#123', fontSize: 26, fontWeight: '700', textAlign: 'center', paddingHorizontal: 16 },
  gateCancel: { padding: 12 },
  gateCancelText: { color: '#cde', fontSize: 15 },
  // parent menu (adult, text allowed)
  menuOverlay: { backgroundColor: '#274653ee', gap: 14 },
  menuTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 6 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  menuLevel: { color: '#fff', fontSize: 18, fontWeight: '700', minWidth: 90, textAlign: 'center' },
  menuBtn: { backgroundColor: '#6a9bd8', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14, minHeight: 56, justifyContent: 'center' },
  menuBtnWide: { backgroundColor: '#6a9bd8', paddingVertical: 18, paddingHorizontal: 28, borderRadius: 14, minWidth: 260, alignItems: 'center' },
  menuBtnText: { color: '#fff', fontWeight: '700', fontSize: 17 },
  galleryOverlay: { backgroundColor: '#274653', paddingTop: 30, paddingBottom: 20 },
  galleryTitle: { fontSize: 44, marginBottom: 8 },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, paddingHorizontal: 16, maxWidth: 520 },
  card: { width: 92, alignItems: 'center', backgroundColor: 'rgba(255,255,255,.12)', borderRadius: 12, paddingVertical: 10 },
  cardName: { color: '#fff', fontSize: 13, fontWeight: '600', marginTop: 4 },
});
