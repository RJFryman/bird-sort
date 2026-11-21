# 🐦 Bird Sort

A React Native (Expo) sorting puzzle. Move the top run of same-species birds
between branches. Fill a branch with one species and the birds **lock and
happy-dance**. Clear every branch to win. Procedural, always-solvable levels.

## Run

```bash
npm install
npm start          # Expo — press w (web), i (iOS), a (Android)
npm run web        # web directly
```

## Test

```bash
npm test           # pure game logic (game.test.ts)
```

## Layout

| File | Responsibility |
|------|----------------|
| `game.ts` | Pure rules: `topGroup`, `canMove`, `applyMove`, `isCleared`, `isWon`, `generateLevel`. No React. Fully unit-tested. |
| `roster.ts` | Bird species data table (name + color). |
| `Bird.tsx` | One SVG bird, tinted by species, happy-dance animation. |
| `Branch.tsx` | One branch row, tap to select/move. |
| `App.tsx` | `useReducer` game state, history (undo), chrome, win overlay. |

## Architecture and artwork

See [ARCHITECTURE.md](ARCHITECTURE.md) for the code map. To inspect every current
bird at large and game size, run `node scripts/render-bird-gallery.cjs`; it writes
an offline contact sheet to `/tmp/bird-sort-art/gallery.html`.

## Add a bird

Append one row to `ROSTER` in `roster.ts`:

```ts
{ name: 'Puffin', color: '#222831' },
```

Append a matching illustration in the appropriate `*Art.tsx` family. Existing
roster positions are persisted save data: never reorder or remove them. Easy
progression stays small; Hard is an explicit choice in the game menu.
