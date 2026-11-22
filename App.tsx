import React, { useReducer, useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet, ScrollView, Animated, Easing, useWindowDimensions, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Branch } from './Branch';
import { Bird } from './Bird';
import { COLLECTIONS, CollectionId } from './roster';
import { isCleared, canMove, applyMove, isWon, Board } from './game';
import { reducer, init, CAP, type Difficulty } from './state';
import { fitPlayGrid, verticalChrome, isBranchVisible, hintScrollTarget, marginFor, handFor, perchWidth } from './layout';
import { loadGame, saveGame, loadLastCollection, saveLastCollection } from './storage';
import { initAudio, playSfx } from './audio';
import { playBirdCall, stopBirdCall } from './bird-calls';
import { configureFeedback, flushFeedback } from '@harmony/feedback';
import { FeedbackButton } from '@harmony/feedback/FeedbackButton';
import UpdateBanner from './UpdateBanner';
import { Habitat } from './Habitat';
import { DiscoveryJournal } from './DiscoveryJournal';
import { loadDiscoveries, recordDiscoveries } from './journal';
import { WinCelebration } from './WinCelebration';
import { useReducedMotion } from './motion';
import { findCoachingMove, tutorialSeen, rememberTutorial, say, CoachingMove } from './coaching';

// Feedback remains in the menu, away from the puzzle surface.
configureFeedback({
  endpoint:
    process.env.EXPO_PUBLIC_FEEDBACK_URL ?? 'https://harmony-feedback.fly.dev/api/entries',
  app: 'bird-sort',
  appVersion: '1.0.0',
  platform: Platform.OS,
});

const IDLE_MS = 3500; // idle re-invite / level-start demo delay (spec §5)
const clearedCount = (board: Board) => board.filter((b) => isCleared(b, CAP)).length;

// first source branch that has any legal move — used to demo/hint the child
function findHint(board: Board): number | null {
  for (let from = 0; from < board.length; from++)
    for (let to = 0; to < board.length; to++)
      if (canMove(board, from, to, CAP)) return from;
  return null;
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
  const [menu, setMenu] = useState(false); // ordinary game menu
  const [loaded, setLoaded] = useState(false);
  const reducedMotion = useReducedMotion();
  const [earned, setEarned] = useState<number[]>([]);
  const [newCount, setNewCount] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [tutorial, setTutorial] = useState(false);
  const [coach, setCoach] = useState<CoachingMove | null>(null);
  const [coachNotice, setCoachNotice] = useState('');
  const [hintRequest, setHintRequest] = useState(0);
  const [home, setHome] = useState(true); // two-world picker (first run)
  const collection = s.collection; // active collection is the single source of truth
  const [wiggle, setWiggle] = useState({ i: -1, n: 0 }); // illegal-tap shake target
  const [hintFrom, setHintFrom] = useState<number | null>(null);
  const [activity, setActivity] = useState(0); // bumps on every interaction
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rid = useRef(0);
  const enterEpoch = useRef(0);
  const pendingBirdWin = useRef(false);
  const boardScroll = useRef<ScrollView>(null);
  const branchFrames = useRef<Record<number, { y: number; height: number }>>({});
  const [boardOffset, setBoardOffset] = useState(0);
  const [boardViewport, setBoardViewport] = useState(0);
  const [layoutRevision, setLayoutRevision] = useState(0);
  const winPop = useRef(new Animated.Value(0)).current;

  // Added to the home screen, iOS runs this standalone and paints the status-bar
  // strip from <meta name="theme-color">. There wasn't one, so it came out white
  // above a blue app. Set it at runtime rather than in a build template: Expo
  // owns index.html, and the colour has to follow the collection anyway.
  // ponytail: html/body background too, so the strip is right before React mounts
  // and stays right under an overscroll bounce.
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const tint = collection === 'fish' ? '#e4f3ee' : '#f5f3e7';
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', tint);
    document.documentElement.style.backgroundColor = tint;
    document.body.style.backgroundColor = tint;
  }, [collection]);

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
    const epoch = ++enterEpoch.current;
    initAudio();
    playSfx('lift');
    void saveLastCollection(c);
    const resumed = await loadGame(c);
    if (epoch !== enterEpoch.current) return;
    dispatch({ type: 'RESTORE', state: resumed ?? init(1, 1, c) });
    setHome(false);
  };

  // save after every change. skip until initial load done so we don't clobber it.
  useEffect(() => {
    if (!loaded) return;
    void saveGame(s);
  }, [s, loaded]);
  // --- end save wiring ---

  useEffect(() => {
    let live = true;
    setEarned([]);
    loadDiscoveries(collection).then(ids => live && setEarned(ids));
    return () => { live = false; };
  }, [collection]);

  useEffect(() => {
    if (home || !loaded) return;
    let live = true;
    tutorialSeen().then(seen => live && !seen && setTutorial(true));
    return () => { live = false; };
  }, [home, loaded]);

  useEffect(() => {
    setCoach(null);
    setCoachNotice('');
    if (!s.won || home || !loaded) { setCelebrate(false); return; }
    let live = true;
    const ids = [...new Set(s.board.flat())];
    loadDiscoveries(collection).then(async before => {
      const all = await recordDiscoveries(collection, ids);
      if (!live) return;
      setEarned(all);
      setNewCount(all.filter(id => !before.includes(id)).length);
      setCelebrate(true);
    });
    return () => { live = false; };
  }, [s.won, s.board, collection, loaded, home]);

  const showCoach = () => {
    setHintRequest(value => value + 1);
    const result = findCoachingMove(s.board);
    if (s.selected !== null) dispatch({ type: 'TAP', i: s.selected });
    const move = result.status === 'move' ? result.move : null;
    setCoach(move);
    if (move) {
      setCoachNotice('Follow 👆, then tap the glowing ↓.');
      setHintFrom(move.from);
    } else if (result.status === 'limited') setCoachNotice('No quick hint yet. You can keep playing!');
    else if (result.status === 'solved') setCoachNotice('Everyone is already together!');
    else setCoachNotice(s.history.length ? 'Try Undo to make some room.' : 'Try Restart for another way to play.');
  };

  // onboarding demo + idle re-invite: after quiet time, point at a legal move.
  // Re-arms on every interaction and whenever the board changes (level start).
  useEffect(() => {
    setHintFrom(null);
    if (s.won || home || menu || gallery || tutorial || coach) return;
    const t = setTimeout(() => setHintFrom(findHint(s.board)), IDLE_MS);
    return () => clearTimeout(t);
  }, [s.board, s.selected, activity, s.won, home, menu, gallery, tutorial, coach]);

  // juicy win pop-in
  useEffect(() => {
    if (s.won && !reducedMotion) {
      winPop.setValue(0);
      Animated.spring(winPop, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }).start();
    } else winPop.setValue(1);
  }, [s.won, winPop, reducedMotion]);

  useEffect(() => () => { stopBirdCall(); pendingBirdWin.current = false; }, [collection, home]);

  // Let the real bird phrase finish before the victory fanfare. Cancel it
  // if the child leaves the celebration, so sound never follows them into play.
  useEffect(() => {
    if (!s.won || !celebrate || home || !pendingBirdWin.current) return;
    // The call's ended event normally plays the fanfare. This only covers an
    // unavailable backend that never reports completion or failure.
    const timer = setTimeout(() => {
      if (pendingBirdWin.current) { pendingBirdWin.current = false; playSfx('win'); }
    }, 10000);
    return () => clearTimeout(timer);
  }, [s.won, celebrate, home, collection]);

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
      const birdLock = locked && collection === 'birds';
      pendingBirdWin.current = won && birdLock;
      if (birdLock) playBirdCall(next[i][0], undefined, () => {
        if (pendingBirdWin.current) { pendingBirdWin.current = false; playSfx('win'); }
      });
      if (won && !birdLock) playSfx('win');
      else if (locked && !birdLock) playSfx('chirp');
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
    if (reducedMotion) return;
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 500);
  };

  // Home-screen PWA has no browser reload. Force a fresh load that busts the
  // cache — a plain reload() re-serves the cached bundle on iOS standalone, so
  // bump a query param to make the browser refetch index.html (→ new hashed JS).
  const hardReload = () => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const u = new URL(window.location.href);
    u.searchParams.set('v', String(Date.now()));
    window.location.replace(u.toString());
  };

  // Close the ordinary menu before acting.
  const guard = (action: () => void) => {
    setMenu(false);
    action();
  };

  // size everything off the actual screen so it fits any device (phone..iPad)
  const { width, height } = useWindowDimensions();
  const n = s.board.length;
  // Pick the grid first, then size to it. Sizing off `boardW / n` assumed one
  // row of n branches, which stopped being true as soon as the board wrapped.
  const { slot, boardW, touchMin, rowGap, colGap, scroll } = fitPlayGrid(n, width, height, CAP, boardViewport || undefined, collection === 'fish' ? 40 : 36);
  const slotH = slot * 0.96;
  const perchW = perchWidth(slot, CAP);
  const birdScale = slot / 48;
  const branchMargin = marginFor(slot) + colGap;
  const handH = handFor(slot);

  const coachedBranch = coach ? (s.selected === coach.from ? coach.to : coach.from) : null;
  useEffect(() => {
    if (!scroll || coachedBranch === null) return;
    const y = hintScrollTarget(branchFrames.current[coachedBranch], boardOffset, boardViewport);
    if (y !== null) boardScroll.current?.scrollTo({ y, animated: !reducedMotion });
    // Offset changes only control hand visibility; they must not fight manual scrolling.
  }, [coachedBranch, coach, hintRequest, scroll, boardViewport, layoutRevision, width, height, reducedMotion]);

  useEffect(() => { boardScroll.current?.scrollTo({ y: 0, animated: false }); }, [s.level, s.difficulty, collection]);

  const isFish = collection === 'fish';

  return (
    <SafeAreaView style={[styles.root, isFish && styles.rootFish]}>
      <StatusBar style="dark" />
      <Habitat fish={isFish} />

      {/* empty-space taps still respond (no dead screen, spec §3) */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onEmptyTap} />
      {ripples.map((r) => (
        <Ripple key={r.id} x={r.x} y={r.y} />
      ))}

      {/* Short labels support emerging readers; branch cues also work without reading. */}
      <View style={[styles.heading, height < 500 && { paddingTop: 0 }]}>
        <Text style={styles.eyebrow}>{isFish ? 'THE LITTLE REEF' : 'THE LITTLE GROVE'}</Text>
        <Text style={[styles.title, height < 500 && { fontSize: 23 }]}>{isFish ? 'Fish' : 'Bird'} Sort</Text>
        <Text style={styles.progress}>Level {s.level} · {s.difficulty === 'hard' ? 'Hard' : s.difficulty === 'medium' ? 'Medium' : 'Easy'} · {clearedCount(s.board)}/{new Set(s.board.flat()).size} groups together</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Open discovery journal" onPress={() => setGallery(true)} style={{ minHeight: 44, justifyContent: 'center' }}>
        <Text style={{ color: '#617b47', fontWeight: '700' }}>★ {earned.length} discoveries · My journal</Text>
      </Pressable>
      <Text accessibilityLiveRegion="polite" style={[styles.instruction, height < 500 && { marginTop: 4 }]}>
        {coachNotice || (s.won ? 'Everyone is together. Hooray!' : s.selected === null
          ? `Tap a ${isFish ? 'fish' : 'bird'} at the right end.`
          : 'Now tap a glowing branch to move.')}
      </Text>

      {/* Boards fit whole when readable. Smaller screens keep larger creatures
          and scroll inside a bounded viewport with the controls still visible. */}
      {scroll && !coachNotice && <Text style={{ color: '#486254', fontSize: 12 }}>↕ Scroll to see all {n} groups · larger friends</Text>}
      <ScrollView ref={boardScroll} scrollEnabled={scroll} scrollEventThrottle={16}
        onScroll={event => setBoardOffset(event.nativeEvent.contentOffset.y)}
        onLayout={event => setBoardViewport(event.nativeEvent.layout.height)} style={{ flexGrow: 0, flexShrink: 1, height: Math.max(100, height - verticalChrome(height)) }}
        contentContainerStyle={{ alignItems: 'center' }} accessibilityLabel={scroll ? 'Scrollable puzzle board' : 'Puzzle board'}>
      <View style={[styles.board, { width: boardW + 32 }]} pointerEvents="box-none">
        {s.board.map((b, i) => (
          <Branch
            key={i}
            birds={b}
            collection={collection}
            capacity={CAP}
            selected={s.selected === i}
            destination={s.selected !== null && canMove(s.board, s.selected, i, CAP)}
            branchNumber={i + 1}
            done={isCleared(b, CAP)}
            hint={(coach?.from ?? hintFrom) === i && s.selected === null && (!scroll || isBranchVisible(branchFrames.current[i], boardOffset, boardViewport))}
            onLayout={event => {
              const { y, height: rowHeight } = event.nativeEvent.layout;
              const old = branchFrames.current[i];
              if (old?.y === y && old?.height === rowHeight) return;
              branchFrames.current[i] = { y, height: rowHeight };
              setLayoutRevision(value => value + 1);
            }}
            reducedMotion={reducedMotion}
            coachedTarget={coach?.to === i && s.selected === coach.from}
            wiggleNonce={wiggle.i === i ? wiggle.n : 0}
            onPress={() => onTap(i)}
            slotW={slot}
            slotH={slotH}
            perchW={perchW}
            birdScale={birdScale}
            margin={branchMargin}
            handH={handH}
            touchMin={touchMin}
            rowGap={rowGap}
          />
        ))}
      </View>
      </ScrollView>

      <View style={styles.toolbar}>
        {!s.won && <Pressable accessibilityRole="button" accessibilityLabel="Show a winning move hint" style={styles.tool} onPress={showCoach}><Text style={styles.toolText}>💡 Hint</Text></Pressable>}
        <Pressable accessibilityRole="button" accessibilityLabel="Undo last move" disabled={!s.history.length}
          style={[styles.tool, !s.history.length && styles.toolOff]}
          onPress={() => { initAudio(); setActivity(a => a + 1); playSfx('lift'); dispatch({ type: 'UNDO' }); }}>
          <Text style={styles.toolText}>↶ Undo</Text>
        </Pressable>
        {s.won ? <Pressable accessibilityRole="button" style={[styles.tool, styles.nextTool]}
          onPress={() => { initAudio(); playSfx('lift'); dispatch({ type: 'NEXT' }); }}>
          <Text style={styles.nextText}>Next level →</Text>
        </Pressable> : <Pressable accessibilityRole="button" style={styles.tool}
          onPress={() => void enter(isFish ? 'birds' : 'fish')}>
          <Text style={styles.toolText}>{isFish ? '🐦 Birds' : '🐠 Fish'}</Text>
        </Pressable>}
        <Pressable accessibilityRole="button" style={styles.tool}
          onPress={() => setMenu(true)}>
          <Text style={styles.toolText}>⚙ Menu</Text>
        </Pressable>
      </View>
      {s.won && <Animated.Text accessibilityLiveRegion="polite" style={[styles.celebration,
        { opacity: winPop }]}>★ Beautiful sorting! ★</Animated.Text>}

      {menu && (
        <ScrollView style={[StyleSheet.absoluteFill, { backgroundColor: '#274653' }]} contentContainerStyle={styles.menuOverlay}>
          <Text style={styles.menuTitle}>Menu</Text>
          <UpdateBanner />
          <View style={[styles.menuRow, { gap: 6, width: '100%', maxWidth: 360 }]}>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(difficulty => <Pressable key={difficulty}
              accessibilityRole="button" accessibilityState={{ selected: (s.difficulty ?? 'easy') === difficulty }}
              style={[styles.modeBtn, (s.difficulty ?? 'easy') === difficulty && { backgroundColor: '#467454', borderColor: '#c8d6a7' }]}
              onPress={() => guard(() => dispatch({ type: 'DIFFICULTY', difficulty }))}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#ffdc7a', fontSize: 16 }} accessibilityElementsHidden>{difficulty === 'easy' ? '★' : difficulty === 'medium' ? '★★' : '★★★'}</Text>
                <Text style={[styles.menuBtnText, { fontSize: 15 }]}>{difficulty[0].toUpperCase() + difficulty.slice(1)}{(s.difficulty ?? 'easy') === difficulty ? ' ✓' : ''}</Text>
              </View>
            </Pressable>)}
          </View>
          <Text style={[styles.menuSub, { textAlign: 'center' }]}>Easy stays gentle. Medium grows a little at a time. Hard is a bigger challenge.</Text>
          <Text style={styles.menuSub}>Changing difficulty starts a new board. Your choice is saved.</Text>
          <View style={styles.menuRow}>
            <Pressable disabled={s.level <= 1} style={[styles.menuBtn, s.level <= 1 && { opacity: .45 }]} onPress={() => guard(() => dispatch({ type: 'GOTO', level: s.level - 1 }))}>
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
            <Text style={styles.menuBtnText}>{isFish ? 'Fish gallery & journal' : 'Bird gallery & journal'}</Text>
          </Pressable>
          <FeedbackButton
            kinds={['idea', 'bug', 'praise']}
            context={{ level: s.level, collection, species: COLLECTIONS[collection].length }}
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
          <Pressable style={styles.menuBtnWide} onPress={hardReload}>
            <Text style={styles.menuBtnText}>🔄 Refresh / get update</Text>
          </Pressable>
          <Pressable style={styles.menuBtnWide} onPress={() => setMenu(false)}>
            <Text style={styles.menuBtnText}>Back to play</Text>
          </Pressable>
        </ScrollView>
      )}

      {gallery && <DiscoveryJournal collection={collection} earned={earned} reducedMotion={reducedMotion} onClose={() => setGallery(false)} />}
      {celebrate && !gallery && !home && <WinCelebration collection={collection} species={[...new Set(s.board.flat())]}
        newCount={newCount} total={earned.length} reducedMotion={reducedMotion}
        onNext={() => { pendingBirdWin.current = false; stopBirdCall(); setCelebrate(false); dispatch({ type: 'NEXT' }); }}
        onJournal={() => { pendingBirdWin.current = false; stopBirdCall(); setCelebrate(false); setGallery(true); }} onClose={() => { pendingBirdWin.current = false; stopBirdCall(); setCelebrate(false); }}
        onRest={() => { pendingBirdWin.current = false; stopBirdCall(); setCelebrate(false); setHome(true); }} />}
      {tutorial && !home && <View style={[styles.overlay, { backgroundColor: 'rgba(29,59,46,.8)', padding: 20 }]}>
        <ScrollView style={{ backgroundColor: '#fffdf3', borderRadius: 26, maxWidth: 400, width: '100%', maxHeight: '95%', flexGrow: 0 }} contentContainerStyle={{ padding: 24, gap: 16, alignItems: 'center' }}>
          <Text style={{ fontSize: 26, color: '#244b39', fontWeight: '900' }}>Let’s sort together</Text>
          <Text style={{ fontSize: 32 }}>👆 → ↓ → ★</Text>
          <Text style={{ fontSize: 18, color: '#304e40', textAlign: 'center' }}>Tap a friend at the right end. Then tap a matching group or an empty space.</Text>
          <Text style={{ fontSize: 16, color: '#304e40', textAlign: 'center' }}>Bring every group together. You can always undo or ask for a hint.</Text>
          <Pressable accessibilityRole="button" style={styles.tool} onPress={() => { say('Tap a friend at the right end. Then tap a matching group or an empty space. Bring every group together.'); }}><Text style={styles.toolText}>🔊 Hear how to play</Text></Pressable>
          <Pressable accessibilityRole="button" style={[styles.tool, styles.nextTool]} onPress={() => { void rememberTutorial(); setTutorial(false); showCoach(); }}><Text style={styles.nextText}>Show my first move →</Text></Pressable>
          <Pressable accessibilityRole="button" style={styles.tool} onPress={() => { void rememberTutorial(); setTutorial(false); }}><Text style={styles.toolText}>I’m ready to play</Text></Pressable>
        </ScrollView>
      </View>}

      {/* First-run world picker; each world keeps its own progress. */}
      {home && (
        <View style={styles.homeOverlay}>
          <View style={styles.homeSky} />
          <View style={styles.homeWater} />
          <View style={styles.homeIntro}><Text style={styles.homeTitle}>Little friends. Big adventures.</Text><Text style={styles.homeSub}>Pick your puzzle world</Text></View>
          <View style={styles.homeRow} pointerEvents="box-none">
            <Pressable style={styles.hero} onPress={() => void enter('birds')} hitSlop={24}>
              <Bird species={0} collection="birds" dancing={!reducedMotion} scale={2.6} /><Text style={styles.worldTitle}>Bird Sort →</Text>
            </Pressable>
            <Pressable style={styles.hero} onPress={() => void enter('fish')} hitSlop={24}>
              <Bird species={0} collection="fish" dancing={!reducedMotion} scale={2.6} /><Text style={styles.worldTitle}>Fish Sort →</Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Keep the puzzle between its readable header and reachable tool strip.
  root: { flex: 1, backgroundColor: '#f5f3e7', alignItems: 'center', justifyContent: 'center' },
  rootFish: { backgroundColor: '#e4f3ee' }, // deeper water tint for fish mode
  heading: { alignItems: 'center', paddingTop: 8 },
  eyebrow: { fontSize: 11, letterSpacing: 3, fontWeight: '800', color: '#547364' },
  title: { fontSize: 32, fontWeight: '900', color: '#243e33', letterSpacing: -1 },
  progress: { fontSize: 13, color: '#486254', fontWeight: '600', marginTop: 3 },
  instruction: { paddingHorizontal: 16, maxWidth: 560, fontSize: 15, color: '#304e40', textAlign: 'center', marginTop: 12, minHeight: 22, flexShrink: 0 },
  toolbar: { flexDirection: 'row', maxWidth: '100%', paddingHorizontal: 8, gap: 6, marginTop: 8, paddingBottom: 8 },
  tool: { minHeight: 52, paddingHorizontal: 8, flexShrink: 1, justifyContent: 'center', borderRadius: 18, borderWidth: 1, borderColor: '#b5c6ae', backgroundColor: '#fffdf3' },
  toolOff: { opacity: 0.45 },
  toolText: { color: '#304e40', fontSize: 14, fontWeight: '700' },
  nextTool: { backgroundColor: '#2d694e', borderColor: '#2d694e' },
  nextText: { color: '#fffdf3', fontSize: 16, fontWeight: '800' },
  celebration: { color: '#2d694e', fontSize: 18, fontWeight: '800', marginTop: 4 },
  homeIntro: { position: 'absolute', top: '15%', width: '100%', alignItems: 'center', paddingHorizontal: 20 },
  homeTitle: { color: '#243e33', fontSize: 28, fontWeight: '900', textAlign: 'center' },
  homeSub: { color: '#304e40', fontSize: 17, marginTop: 12 },
  worldTitle: { color: '#243e33', fontSize: 20, fontWeight: '800', marginTop: 24 },
  // Two-world home (grove = birds, reef = fish)
  homeOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row' },
  homeSky: { flex: 1, backgroundColor: '#ecedda' },
  homeWater: { flex: 1, backgroundColor: '#bce1d9' },
  homeRow: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  hero: { width: '46%', height: 240, alignItems: 'center', justifyContent: 'center' },
  board: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 16, marginTop: 8 },
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
  // huge primary "keep playing" target (spec §1: hero button 140+)
  btnBig: { backgroundColor: '#44aa77', width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center' },
  btnBigText: { color: '#fff', fontSize: 56, fontWeight: '800' },
  menuSub: { color: '#dfe', fontSize: 16 },
  // parent menu (adult, text allowed)
  menuOverlay: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 12, gap: 14, minHeight: '100%' },
  menuTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 6 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  menuLevel: { color: '#fff', fontSize: 18, fontWeight: '700', minWidth: 90, textAlign: 'center' },
  modeBtn: { flex: 1, minHeight: 56, borderRadius: 14, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#6a9bd8', backgroundColor: '#527fab' },
  menuBtn: { backgroundColor: '#6a9bd8', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 14, minHeight: 56, justifyContent: 'center' },
  menuBtnWide: { backgroundColor: '#6a9bd8', paddingVertical: 18, paddingHorizontal: 28, borderRadius: 14, minWidth: 260, alignItems: 'center' },
  menuBtnText: { color: '#fff', fontWeight: '700', fontSize: 17 },
});
