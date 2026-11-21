# Northern Cardinal recording

`assets/sfx/cardinal-call.mp3` is a 2.8-second excerpt of a real Northern Cardinal
(*Cardinalis cardinalis*) song recorded by **Aleksandr Berdnikov** in Cambridge,
Massachusetts, on March 17, 2021. The song is the cardinal's repeated whistled
phrase; it is not a synthesized effect. Metadata for the journal is exported by
`cardinal-recording.ts`.

Primary source: [iNaturalist observation 71577658](https://www.inaturalist.org/observations/71577658).
The [observation API](https://api.inaturalist.org/v1/observations/71577658), checked
November 21, 2026, identifies the taxon as `Cardinalis cardinalis`, common name
`Northern Cardinal`, and quality grade `research`. Its three current
identifications agree on that species. The individual **sound 174312** has
`license_code: "cc0"` and `attribution: "no rights reserved"`; the species profile
photo's separate license is unrelated and no photo is bundled.

The original is [sound 174312.mp3](https://static.inaturalist.org/sounds/174312.mp3?1616193605).
[CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) permits
copying, modification, redistribution, and commercial use without permission.
Credit is retained voluntarily: **Northern Cardinal song — Aleksandr Berdnikov,
iNaturalist, CC0 1.0 Universal; edited excerpt.** No account, payment, or API key
was needed to obtain the recording.

Edits: source interval **3.35–6.15 seconds**; 700 Hz high-pass and 8 kHz low-pass
filters to reduce background rumble/hiss; +10 dB gain; 40 ms fade-in and 120 ms
fade-out; mono, 44.1 kHz, 96 kb/s MP3. Pitch and playback speed are unchanged.
The bundled file is 34,699 bytes; decoded duration is 2.800 seconds.
The selected interval contains one whistled phrase over outdoor ambience. No
speech or music was identified in its spectrogram; this is a field recording,
not a studio-isolated bird. No listening-based verification is claimed here.

SHA-256:

- Downloaded original: `ea722e87c11090e929b6d2ad290f8ee0ec31fe2e939553d6a9f181634040066c`
- Bundled excerpt: `56e1b13fb9c281d09fc475821895236470b29a683805f82a18c301f5cb687c21`

Reproduction from the original file:

```sh
ffmpeg -ss 3.35 -t 2.8 -i original.mp3 \
  -af 'highpass=f=700,lowpass=f=8000,volume=10dB,afade=t=in:st=0:d=0.04,afade=t=out:st=2.68:d=0.12' \
  -ac 1 -ar 44100 -b:a 96k -map_metadata -1 cardinal-call.mp3
```
