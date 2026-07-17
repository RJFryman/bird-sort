import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Bird } from './Bird';

export function Branch({
  birds,
  capacity,
  selected,
  done,
  onPress,
}: {
  birds: number[];
  capacity: number;
  selected: boolean;
  done: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.branch, selected && styles.lift]}>
      <View style={styles.slots}>
        {Array.from({ length: capacity }).map((_, i) => (
          <View key={i} style={styles.slot}>
            {i < birds.length && <Bird species={birds[i]} dancing={done} delay={i * 100} />}
          </View>
        ))}
      </View>
      <View style={[styles.stick, done && styles.stickDone]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  branch: { alignItems: 'center', margin: 8 },
  lift: { transform: [{ translateY: -8 }] },
  slots: { flexDirection: 'column-reverse', alignItems: 'center' },
  slot: { width: 46, height: 44, alignItems: 'center', justifyContent: 'center' },
  stick: { width: 84, height: 8, borderRadius: 4, backgroundColor: '#7a4a26', marginTop: 4 },
  stickDone: { backgroundColor: '#4a9d6f' },
});
