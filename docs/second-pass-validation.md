# Second pass: play, discovery, fish and coloring

Changes address the first Fable review: compatible visual families in new deals;
original deal and difficulty retained across reload; serialized saves with a
last-good backup; safe legacy migration; same-difficulty taps preserve the board.

Wins earn persistent discovery stickers for the actual creatures sorted. The full
gallery remains available. A journal offers optional device-spoken names, sourced
nature clues, and interactive coloring derived from the real SVG geometry.
Coloring has ten colors, eraser, undo/reset, independent local saves, and web SVG
export/printing. Shape changes invalidate obsolete coloring geometry safely.

The ordinary menu no longer has a grown-up check. Optional coaching supplies a
winning-path source and destination without moving the child's pieces. Dense
Hard boards can scroll instead of shrinking creatures below readable size.
Reduced-motion preference disables continuous play/celebration animation.

Fish now have eleven distinct silhouettes and an underwater habitat with reef
ledges. Independent fish art reviews scored 92 and 91. Bird refinement reviews
scored 94 and 94 before the final Blue-throated Macaw wing-pose change; the second
reviewer disclosed incidental exposure to a prior report. These subjective art
scores do not establish a 95+ grade or a whole-game grade.

Four cardinals together play an authentic Northern Cardinal excerpt. Its journal
entry contains recording credit, original source and CC0 link. Exact provenance
and audio edits: [cardinal-audio.md](cardinal-audio.md).

Validation before final independent whole-game review:

- 113 tests pass, including 10,000 seeded compatible-deal checks, backup/reload
  and race cases, journal persistence, and all 63 actual SVG coloring trees.
- TypeScript and production web export pass.
- Actual-browser checks pass for win/stickers, restart after reload, saved Hard
  mode, same-difficulty stability, cardinal playback, coloring restoration and
  downloadable colored SVG, and fish coloring. No page errors in these checks.
- Phone/tablet/landscape checks cover 320×568, 390×844, 820×1180 and 844×390.

No child playtesting, physical-device audio/printing or offline acceptance testing
is claimed. A fresh Fable whole-game review follows these implementation checks.
