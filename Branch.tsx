import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { Bird } from './Bird';
import { TOUCH_MIN } from './layout';
import { CollectionId } from './roster';

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
  done,
  hint,
  wiggleNonce,
  onPress,
  slotW,
  slotH,
  stickW,
  birdScale,
  margin,
  handH,
}: {
  birds: number[];
  collection: CollectionId;
  capacity: number;
  selected: boolean;
  done: boolean;
  hint: boolean;
  wiggleNonce: number;
  onPress: () => void;
  slotW: number;
  slotH: number;
  stickW: number;
  birdScale: number;
  /** Gutter + hint-row height come from fitGrid, so the cell matches what it measured. */
  margin: number;
  handH: number;
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
    if (!wiggleNonce) return;
    wig.setValue(0);
    Animated.sequence([
      Animated.timing(wig, { toValue: 1, duration: 55, useNativeDriver: true }),
      Animated.timing(wig, { toValue: -1, duration: 90, useNativeDriver: true }),
      Animated.timing(wig, { toValue: 0.6, duration: 80, useNativeDriver: true }),
      Animated.timing(wig, { toValue: 0, duration: 70, useNativeDriver: true }),
    ]).start();
  }, [wiggleNonce, wig]);

  // lock celebration: pop + sparkle fly-out + expanding ring when a branch solves
  const wasDone = useRef(done);
  useEffect(() => {
    if (done && !wasDone.current) {
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
  }, [done, pop, spark, ring]);

  // held-idle float: while a branch is selected, bob gently so the lifted birds
  // feel picked-up-and-alive rather than stuck mid-air
  useEffect(() => {
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
  }, [selected, bob, lift]);

  // hint: gentle continuous pulse + hand bounce; stop when hint clears
  useEffect(() => {
    if (!hint) {
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
  }, [hint, pulse, hand]);

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

  // whole branch is one big forgiving target — TOUCH_MIN keeps it toddler-sized
  const touchW = Math.max(TOUCH_MIN, stickW + 24);
  const burst = slotW * 1.3; // how far sparkles fly

  return (
    <Pressable
      onPress={onPress}
      onPressIn={squash}
      onPressOut={unsquash}
      style={{ width: touchW, alignItems: 'center', marginHorizontal: margin, paddingVertical: 10 }}
      hitSlop={12}
    >
      {/* Bouncing hand hint (visual twin of the demo/idle re-invite). Drawn as an
          overlay rather than a reserved row: a row cost height on every branch
          whether or not a hint was showing, and absolute means branches still
          don't jump when it appears. */}
      <Animated.Text
        pointerEvents="none"
        style={{
          position: 'absolute',
          // Sit just above the topmost bird, not above the cell — the stack is
          // bottom-aligned, so anchoring to the cell left the hand floating in
          // the empty slots with nothing under it to point at.
          bottom: 24 + birds.length * slotH,
          fontSize: handH * 0.85,
          opacity: hint ? 1 : 0,
          transform: [{ translateY: handY }],
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
            top: slotH,
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
        <View style={{ flexDirection: 'column-reverse', alignItems: 'center' }}>
          {Array.from({ length: capacity }).map((_, i) => (
            <View key={i} style={{ width: slotW, height: slotH, alignItems: 'center', justifyContent: 'center' }}>
              {i < birds.length && <Bird species={birds[i]} collection={collection} dancing={done} delay={i * 100} scale={birdScale} />}
            </View>
          ))}
        </View>
        <View
          style={{
            width: stickW,
            height: 10,
            borderRadius: 5,
            backgroundColor: done ? '#4a9d6f' : '#7a4a26',
            marginTop: 4,
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
