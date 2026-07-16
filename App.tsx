import React, { useReducer } from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Branch } from './Branch';
import { generateLevel, canMove, applyMove, isWon, isCleared, Board } from './game';

const CAP = 4;
const EXTRA = 2;
const speciesForLevel = (l: number) => Math.min(3 + Math.floor((l - 1) / 2), 10);

type State = {
  level: number;
  board: Board;
  history: Board[];
  selected: number | null;
  won: boolean;
};

function init(level: number): State {
  return {
    level,
    board: generateLevel(speciesForLevel(level), CAP, EXTRA),
    history: [],
    selected: null,
    won: false,
  };
}

type Action = { type: 'TAP'; i: number } | { type: 'UNDO' } | { type: 'RESTART' } | { type: 'NEXT' };

function reducer(s: State, a: Action): State {
  switch (a.type) {
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
      return init(s.level + 1);
  }
}

export default function App() {
  const [s, dispatch] = useReducer(reducer, 1, init);
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <Text style={styles.title}>🐦 Bird Sort</Text>
      <View style={styles.hud}>
        <Text style={styles.hudText}>Level {s.level}</Text>
        <Text style={styles.hudText}>Moves {s.history.length}</Text>
        <Pressable style={styles.btn} onPress={() => dispatch({ type: 'UNDO' })}>
          <Text style={styles.btnText}>Undo</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={() => dispatch({ type: 'RESTART' })}>
          <Text style={styles.btnText}>Restart</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#cdeffd', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginTop: 16, color: '#223344' },
  hud: { flexDirection: 'row', gap: 12, alignItems: 'center', marginVertical: 10 },
  hudText: { fontSize: 15, color: '#223344', fontWeight: '600' },
  btn: { backgroundColor: '#6a9bd8', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10 },
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
});
