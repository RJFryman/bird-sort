import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { Bird } from './Bird';
import { CollectionId } from './roster';
import { ReefPerch } from './ReefPerch';

// Length of the dark knob capping each end of a perch. Fixed, not scaled with
// slot: it only has to read as "the branch stops here", and at small slots a
// proportional cap would vanish exactly when it's needed most.
const TIP_W = 11;

// sparkle burst layout: emoji + direction each shoots on lock
const SPARKS = [
  { e: '✨', dx: -1, dy: -0.9 },
  { e: '⭐', dx: 1, dy: -1 },
  { e: '✨', dx: -1.2, dy: 0.2 },
  { e: '🌟', dx: 1.2, dy: 0.1 },
  { e: '✨', dx: 0, dy: -1.3 },
];

// Toddler touch target: whole branch is the hitbox, min 96px wide, generous
// vertical bounds (spec §1). Visual twins for every sound live here:
//  - lift: branch rises + gently bobs while held (feels alive, not frozen)
//  - tap: quick squash-stretch on press-in (tactile)
//  - nope: branch wiggles (wiggleNonce bump)
//  - chirp/lock: branch pops + sparkle burst + expanding ring when it locks
//  - hint/idle re-invite: gentle pulse + a bouncing 👆 hand (spec §2/§5)
export function Branch({
  birds,
  collection,
  capacity,
  selected,
  destination,
  branchNumber,
  done,
  hint,
  wiggleNonce,
  onPress,
  slotW,
  slotH,
  perchW,
  birdScale,
  margin,
  handH,
  touchMin,
  rowGap,
  reducedMotion = false,
  coachedTarget = false,
}: {
  birds: number[];
  collection: CollectionId;
  capacity: number;
  selected: boolean;
  destination: boolean;
  branchNumber: number;
  done: boolean;
  hint: boolean;
  wiggleNonce: number;
  onPress: () => void;
  slotW: number;
  slotH: number;
  /** The perch runs the full width of the row of birds. */
  perchW: number;
  birdScale: number;
  /** Gutter + hint-row height come from fitGrid, so the cell matches what it measured. */
  margin: number;
  handH: number;
  /** Hitbox floor fitGrid solved at — must match or the cells won't wrap right. */
  touchMin: number;
  /** Leftover height fitGrid hands out between rows. */
  rowGap: number;
  reducedMotion?: boolean;
  coachedTarget?: boolean;
}) {
  const wig = useRef(new Animated.Value(0)).current; // -1..1 shake
  const pop = useRef(new Animated.Value(0)).current; // 0..1 lock burst
  const ring = useRef(new Animated.Value(1)).current; // 0..1 lock ring (rest=1 => invisible)
  const pulse = useRef(new Animated.Value(0)).current; // 0..1 hint breathe
  const hand = useRef(new Animated.Value(0)).current; // 0..1 hand bounce
  const spark = useRef(new Animated.Value(0)).current; // 0..1 sparkle fly-out
  const bob = useRef(new Animated.Value(0)).current; // -1..1 held-idle float
  const lift = useRef(new Animated.Value(0)).current; // 0 -> -12 when selected
  const press = useRef(new Animated.Value(0)).current; // 0..1 press squash

  // nope wiggle
  useEffect(() => {
    if (reducedMotion || !wiggleNonce) { wig.setValue(0); return; }
    wig.setValue(0);
    Animated.sequence([
      Animated.timing(wig, { toValue: 1, duration: 55, useNativeDriver: true }),
      Animated.timing(wig, { toValue: -1, duration: 90, useNativeDriver: true }),
      Animated.timing(wig, { toValue: 0.6, duration: 80, useNativeDriver: true }),
      Animated.timing(wig, { toValue: 0, duration: 70, useNativeDriver: true }),
    ]).start();
  }, [wiggleNonce, wig, reducedMotion]);

  // lock celebration: pop + sparkle fly-out + expanding ring when a branch solves
  const wasDone = useRef(done);
  useEffect(() => {
    if (reducedMotion) { pop.setValue(0); spark.setValue(0); ring.setValue(1); }
    if (!reducedMotion && done && !wasDone.current) {
      pop.setValue(0);
      spark.setValue(0);
      ring.setValue(0);
      Animated.spring(pop, { toValue: 1, friction: 3.5, tension: 130, useNativeDriver: true }).start();
      Animated.timing(ring, { toValue: 1, duration: 620, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
      Animated.sequence([
        Animated.timing(spark, { toValue: 1, duration: 620, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(spark, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]).start();
    }
    wasDone.current = done;
  }, [done, pop, spark, ring, reducedMotion]);

  // held-idle float: while a branch is selected, bob gently so the lifted birds
  // feel picked-up-and-alive rather than stuck mid-air
  useEffect(() => {
    if (reducedMotion) { lift.setValue(selected ? -8 : 0); bob.setValue(0); return; }
    Animated.spring(lift, { toValue: selected ? -12 : 0, friction: 6, tension: 140, useNativeDriver: true }).start();
    if (!selected) {
      bob.stopAnimation(() => bob.setValue(0));
      return;
    }
    const b = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 620, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: -1, duration: 620, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    b.start();
    return () => b.stop();
  }, [selected, bob, lift, reducedMotion]);

  // hint: gentle continuous pulse + hand bounce; stop when hint clears
  useEffect(() => {
    if (!hint || reducedMotion) {
      pulse.stopAnimation(() => pulse.setValue(0));
      hand.stopAnimation(() => hand.setValue(0));
      return;
    }
    const p = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    const h = Animated.loop(
      Animated.sequence([
        Animated.timing(hand, { toValue: 1, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(hand, { toValue: 0, duration: 420, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
    );
    p.start();
    h.start();
    return () => { p.stop(); h.stop(); };
  }, [hint, pulse, hand, reducedMotion]);

  const translateX = wig.interpolate({ inputRange: [-1, 1], outputRange: [-10, 10] });
  const bobY = bob.interpolate({ inputRange: [-1, 1], outputRange: [-3.5, 3.5] });
  const liftY = Animated.add(lift, bobY);
  const popScale = pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.24] });
  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const pressScale = press.interpolate({ inputRange: [0, 1], outputRange: [1, 0.93] });
  const handY = hand.interpolate({ inputRange: [0, 1], outputRange: [4, -8] });

  const squash = () =>
    Animated.timing(press, { toValue: 1, duration: 70, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  const unsquash = () =>
    Animated.spring(press, { toValue: 0, friction: 4, tension: 200, useNativeDriver: true }).start();

  // whole branch is one big forgiving target — touchMin keeps it toddler-sized
  // (96), dropping to the 44 HIG minimum only when that's what makes the board
  // fit on screen. hitSlop below still buys back some slop either way.
  const touchW = Math.max(touchMin, perchW + 12);
  const [bark, tip, lit] = done ? ['#4a9d6f', '#23543a', '#6fc292'] : ['#7a4a26', '#43260f', '#9a6338'];
  const burst = slotW * 1.3; // how far sparkles fly
  // The movable bird is the one at the open end of the perch — the right end,
  // since birds fill left to right. That's what the hint should point at.
  const endBirdX = (Math.max(birds.length, 1) - 0.5) * slotW - (capacity * slotW) / 2;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Branch ${branchNumber}, ${birds.length} of ${capacity}${selected ? ', selected' : destination ? ', move here' : done ? ', complete' : ''}`}
      accessibilityState={{ selected }}
      onPress={onPress}
      onPressIn={reducedMotion ? undefined : squash}
      onPressOut={reducedMotion ? undefined : unsquash}
      style={{ width: touchW, alignItems: 'center', marginHorizontal: margin, paddingVertical: 8 + rowGap / 2, borderRadius: 18, backgroundColor: selected ? '#f8df92' : coachedTarget ? '#b5dfda' : destination ? '#d6eaca' : 'transparent', borderWidth: 2, borderColor: selected ? '#a76c15' : coachedTarget ? '#246c72' : destination ? '#64905a' : 'transparent' }}
      hitSlop={12}
    >
      {(selected || destination || done) && <Text pointerEvents="none" style={{ position: 'absolute', right: 6, top: 0, color: '#31523b', fontSize: 14, fontWeight: '900' }}>{done ? '✓' : destination ? '↓' : '↑'}</Text>}
      {/* Bouncing hand hint (visual twin of the demo/idle re-invite). Drawn as an
          overlay rather than a reserved row: a row cost height on every branch
          whether or not a hint was showing, and absolute means branches still
          don't jump when it appears. */}
      <Animated.Text
        pointerEvents="none"
        style={{
          position: 'absolute',
          // Sit just above the bird at the open end of the perch, not above the
          // middle of the cell — pointing at the row's centre would point at a
          // bird the kid can't actually move.
          bottom: slotH + 18,
          fontSize: handH * 0.85,
          opacity: hint ? 1 : 0,
          transform: [{ translateX: endBirdX }, { translateY: handY }],
        }}
      >
        👆
      </Animated.Text>
      <Animated.View
        style={{
          alignItems: 'center',
          transform: [
            { translateX },
            { translateY: liftY },
            { scale: Animated.multiply(Animated.multiply(popScale, pulseScale), pressScale) },
          ],
        }}
      >
        {/* expanding celebration ring on lock */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: slotH * 0.15,
            width: slotW * 1.4,
            height: slotW * 1.4,
            borderRadius: slotW * 0.7,
            borderWidth: 3,
            borderColor: '#ffd75e',
            opacity: ring.interpolate({ inputRange: [0, 1], outputRange: [0.85, 0] }),
            transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1.8] }) }],
          }}
        />
        {/* sparkle burst flying outward on lock */}
        {SPARKS.map((sp, i) => (
          <Animated.Text
            key={i}
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: slotH * 0.9,
              fontSize: 22,
              opacity: spark.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 1, 0] }),
              transform: [
                { translateX: spark.interpolate({ inputRange: [0, 1], outputRange: [0, sp.dx * burst] }) },
                { translateY: spark.interpolate({ inputRange: [0, 1], outputRange: [0, sp.dy * burst] }) },
                { scale: spark.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.3] }) },
              ],
            }}
          >
            {sp.e}
          </Animated.Text>
        ))}
        {/* Birds perch side by side, filling left to right. birds[0] is the far
            end; the last one sits at the open right end and is the movable one,
            which keeps the array order the game logic already uses. */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          {Array.from({ length: capacity }).map((_, i) => (
            <View key={i} style={{ width: slotW, height: slotH, alignItems: 'center', justifyContent: 'flex-end' }}>
              {i >= birds.length && <View style={{ position: 'absolute', bottom: 3, width: 8, height: 4, borderRadius: 4, backgroundColor: destination ? '#64905a' : '#c6cbb6' }} />}
              {i < birds.length && <View style={{ transform: [{ translateY: collection === 'birds' ? 4 + slotW * 0.134 : 0 }] }}><Bird species={birds[i]} collection={collection} dancing={done && !reducedMotion} delay={i * 100} scale={birdScale} /></View>}
            </View>
          ))}
        </View>
        {/* Dark knob at each end of the perch, lit edge along the top. A flat
            one-colour bar merged with its neighbour: the gutter between cells is
            only 12 + 2*margin px (46px at a 1000px viewport) against a perch
            several hundred px long, and both sit on the same baseline in the
            same brown — so a row of perches read as one continuous branch.
            The knobs terminate each perch; the highlight makes it a round stick
            rather than a painted line.
            Total height stays 10 and total width stays perchW — layout.ts's
            CELL_CHROME and perchWidth() both assume that. */}
        {collection === 'fish' ? <View style={{ marginTop: 4 }}><ReefPerch width={perchW} done={done} /></View> : (
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 10, marginTop: 4 }}>
          <View pointerEvents="none" style={{ position: 'absolute', left: 4, bottom: 2, width: 21, height: 10, borderTopLeftRadius: 18, borderBottomRightRadius: 18, backgroundColor: done ? '#75a159' : '#75905c', transform: [{ rotate: '-32deg' }] }} />
          <View style={{ width: TIP_W, height: 10, borderRadius: 5, backgroundColor: tip }} />
          <View
            style={{
              width: perchW - TIP_W * 2,
              height: 10,
              borderRadius: 2,
              backgroundColor: bark,
              borderTopWidth: 2,
              borderTopColor: lit,
            }}
          />
          <View style={{ width: TIP_W, height: 10, borderRadius: 5, backgroundColor: tip }} />
        </View>
        )}
      </Animated.View>
    </Pressable>
  );
}
