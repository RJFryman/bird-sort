import React from 'react';
import { Pressable, View } from 'react-native';
import { Bird } from './Bird';

export function Branch({
  birds,
  capacity,
  selected,
  done,
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
  onPress: () => void;
  slotW: number;
  slotH: number;
  stickW: number;
  birdScale: number;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[{ alignItems: 'center', marginHorizontal: 3 }, selected && { transform: [{ translateY: -8 }] }]}
    >
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
          height: 8,
          borderRadius: 4,
          backgroundColor: done ? '#4a9d6f' : '#7a4a26',
          marginTop: 4,
        }}
      />
    </Pressable>
  );
}
