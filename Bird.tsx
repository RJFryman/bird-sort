// Owns creature sizing, illustration dispatch and celebration animation.
import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg from 'react-native-svg';
import { COLLECTIONS, CollectionId } from './roster';
import { ParrotArt } from './ParrotArt';
import { SongbirdArt } from './SongbirdArt';
import { WildBirdArt } from './WildBirdArt';
import { FishArt } from './FishArt';

const ASvg = Animated.createAnimatedComponent(Svg);
export function Bird({ species, collection = 'birds', dancing, delay = 0, scale = 1 }: {
  species: number; collection?: CollectionId; dancing?: boolean; delay?: number; scale?: number;
}) {
  const creature = COLLECTIONS[collection][species];
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!dancing) { t.stopAnimation(); t.setValue(0); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(t, { toValue: 1, duration: 300, delay, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.timing(t, { toValue: 0, duration: 300, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [dancing, delay, t]);
  const artwork = collection === 'fish' ? FishArt({ fish: creature })
    : ParrotArt({ bird: creature }) ?? SongbirdArt({ bird: creature }) ?? WildBirdArt({ bird: creature });
  if (!artwork) throw new Error(`Missing illustration: ${creature.name}`);
  return <ASvg width={48 * scale} height={56 * scale} viewBox="0 0 96 96" style={{ transform: [
    { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) },
    { rotate: t.interpolate({ inputRange: [0, 1], outputRange: ['-7deg', '7deg'] }) },
  ] }}>{artwork}</ASvg>;
}
