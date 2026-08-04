import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';
import { Bird } from './Bird';

// Toddler touch target: whole branch is the hitbox, min 96px wide, generous
// vertical bounds (spec §1). Visual twins for every sound live here:
//  - lift: branch rises when selected
//  - nope: branch wiggles (wiggleNonce bump)
//  - chirp/lock: branch pops + sparkles when it locks
//  - hint/idle re-invite: gentle pulse + a bouncing 👆 hand (spec §2/§5)
export function Branch({
  birds,
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
}: {
  birds: number[];
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
}) {
  const wig = useRef(new Animated.Value(0)).current; // -1..1 shake
  const pop = useRef(new Animated.Value(0)).current; // 0..1 lock burst
  const pulse = useRef(new Animated.Value(0)).current; // 0..1 hint breathe
  const hand = useRef(new Animated.Value(0)).current; // 0..1 hand bounce
  const spark = useRef(new Animated.Value(0)).current; // 0..1 sparkle fade

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

  // lock celebration: pop + sparkle when a branch becomes solved
  const wasDone = useRef(done);
  useEffect(() => {
    if (done && !wasDone.current) {
      pop.setValue(0);
      spark.setValue(0);
      Animated.spring(pop, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true }).start();
      Animated.sequence([
        Animated.timing(spark, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(spark, { toValue: 0, duration: 700, delay: 200, useNativeDriver: true }),
      ]).start();
    }
    wasDone.current = done;
  }, [done, pop, spark]);

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
  const popScale = pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.22] });
  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const handY = hand.interpolate({ inputRange: [0, 1], outputRange: [4, -8] });

  // whole branch is one big forgiving target
  const touchW = Math.max(96, stickW + 24);

  return (
    <Pressable
      onPress={onPress}
      style={{ width: touchW, alignItems: 'center', marginHorizontal: 20, paddingVertical: 10 }}
      hitSlop={12}
    >
      {/* bouncing hand hint above the branch (visual twin of the demo/idle re-invite) */}
      <Animated.Text
        style={{
          fontSize: 34,
          height: 40,
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
            { translateY: selected ? -12 : 0 },
            { scale: Animated.multiply(popScale, pulseScale) },
          ],
        }}
      >
        {/* sparkle burst on lock */}
        <Animated.Text
          style={{
            position: 'absolute',
            top: -6,
            fontSize: 26,
            opacity: spark,
            transform: [{ scale: spark.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.4] }) }],
          }}
        >
          ✨
        </Animated.Text>
        <View style={{ flexDirection: 'column-reverse', alignItems: 'center' }}>
          {Array.from({ length: capacity }).map((_, i) => (
            <View key={i} style={{ width: slotW, height: slotH, alignItems: 'center', justifyContent: 'center' }}>
              {i < birds.length && <Bird species={birds[i]} dancing={done} delay={i * 100} scale={birdScale} />}
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
