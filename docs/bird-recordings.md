# Real recordings for every bird entry

All52 saved bird entries have a bundled real recording (50 unique recordings;
Blue Macaw/Hyacinth share a species example, and both Eclectus entries share an
Eclectus recording whose sex is unspecified). Matchfour plays that entry's
recording, including the final match. The win fanfare follows the media ended
event; cancelled calls cannot trigger a later fanfare. The journal offers replay
and the original recording, creator, provider, licence and editing credit.

Broad game labels identify their recorded example species. The two make-believe
parrots explicitly borrow real Blue-fronted Amazon/Senegal Parrot recordings;
there is no claim that an imaginary species was recorded. Fish retain game SFX.

## Sources and reuse

The52entries use50real recordings:43iNaturalist,6Tierstimmenarchiv and1DOC.
Sound licences are checked separately from observation/photo licences. OnlyCC0,
CCBY4.0, CCBY-SA4.0 andCCBY-SA3.0 unported are bundled; noNC/ND assets. The
individual source, creator, licence and modifications appear in the journal.
Every excerpt retains its listed licence, including ShareAlike where listed.

Official licence definitions:
https://github.com/inaturalist/inaturalist/blob/main/app/models/shared/license_module.rb
https://help.inaturalist.org/en/support/solutions/articles/151000169918
https://www.doc.govt.nz/nature/native-animals/birds/bird-songs-and-calls/
https://www.doc.govt.nz/footer-links/copyright/

Cockatiel, African Grey, Budgie andBlue-throated Macaw are casual-grade captive
iNaturalist recordings, not community-verified research-grade IDs. The six
archive recordings also come from captive birds. Captivity is disclosed in the
journal. Neither captivity nor the archive curator establishes human auditory
acceptance of our specific excerpt.

## Preparation and verification

The accepted2.8s Cardinal reference is retained. All other clips are at most3.2s,
mono44.1kHz96kbps MP3. Two-pass loudness normalization targets-20LUFS, followed
by measured output calibration and a peak limiter. Owl/dove filters retain
their lower call frequencies. Pitch and speed are unchanged.

New Bluebird andDove sources replace the noise-floor excerpts. Eagle andOwl
now use curated Tierstimmenarchiv call recordings. These four replacement
windows were inspected as spectrograms for visible calls; no human listening
or expert auditory identification is claimed. Field ambience can remain.

bird-recordings.json retains original URLs, per-sound licence codes where
available, taxon, excerpt offsets, exact filter chain and original/excerptSHA256.
The new chain starts with atrim/asetpts so fades and normalization apply to the
selected window. Reproduce each non-Cardinal clip with:

```sh
ffmpeg -i ORIGINAL -af FILTERS -ac 1 -ar 44100 -b:a 96k -map_metadata -1 CLIP.mp3
```

ForCardinal, retain the original documented command in cardinal-audio.md.

Run `python3 scripts/check-bird-audio.py --write` (asset-authoring tool; requires
FFmpeg andNumPy) to decode and remeasure all clips. It enforces integrated levels
of-23..-17LUFS, loudest100ms>=-24dBFS, peaks<=-1dBFS, and requires tonal structure. A low-contrast
clip also requires an exact hash-bound reviewed vocal window; tonal concentration
alone cannot bypass the contrast check. bird-audio-measurements.json binds
each measurement to its MP3hash; Jest fails stale hashes or failed thresholds.
Spectral heuristics cannot certify species identity or replace listening.

## Per-entry credits

| Game entry | Recorded species | Recorder | Licence | Original |
|---|---|---|---|---|
| Cardinal | Northern Cardinal | Aleksandr Berdnikov · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/71577658) |
| Bluebird | Eastern Bluebird | CJ Campbell · iNaturalist | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Recording](https://www.inaturalist.org/observations/105394386) |
| Canary | Atlantic Canary | Jane Concannon · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/339608550) |
| Macaw | Great Green Macaw | Lütgens, Hans · Tierstimmenarchiv, Museum für Naturkunde Berlin | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/legalcode) | [Recording](https://suche.tierstimmenarchiv.de/search/showdetails.html?unique_identifier=TSA%3AAra_ambiguus_Lue_54_1_1&language=english) |
| Crow | American Crow | Kent P. McFarland · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/142523684) |
| Robin | American Robin | Kathlin Simpkins · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/355313120) |
| Flamingo | Greater Flamingo | Pieter Huybrechts · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/219143299) |
| Sparrow | House Sparrow | kristinpiston · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/223362275) |
| Dove | Mourning Dove | spacewhales · iNaturalist | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Recording](https://www.inaturalist.org/observations/194543121) |
| Kingfisher | Common Kingfisher | Norrland · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/187015100) |
| Oriole | Baltimore Oriole | peakaytea · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/361722567) |
| Parrot | Blue-fronted Amazon | Paula Romano · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/288721628) |
| Owl | Great Horned Owl | Lütgens, Hans · Tierstimmenarchiv, Museum für Naturkunde Berlin | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/legalcode) | [Recording](https://suche.tierstimmenarchiv.de/search/showdetails.html?unique_identifier=TSA%3ABubo_virginianus_Lue_57_7_1&language=english) |
| Toucan | Toco Toucan | preinzi · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/103837635) |
| Goldfinch | American Goldfinch | dregyn · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/401302736) |
| Peacock | Indian Peafowl | Damien Wallace · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/365289781) |
| Bluejay | Blue Jay | Chase Harris · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/349599336) |
| Hummingbird | Ruby-throated Hummingbird | David Hurtado · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/184530932) |
| Eagle | Bald Eagle | Tembrock, Günter · Tierstimmenarchiv, Museum für Naturkunde Berlin | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/legalcode) | [Recording](https://suche.tierstimmenarchiv.de/search/showdetails.html?unique_identifier=TSA%3AHaliaeetus_leucocephalus_V_2123_11_1&language=english) |
| Hawk | Red-tailed Hawk | Dan Horowitz · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/289189909) |
| Falcon | Peregrine Falcon | Kalvin Chan · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/133693122) |
| Pelican | Great White Pelican | Tembrock, Günter · Tierstimmenarchiv, Museum für Naturkunde Berlin | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/legalcode) | [Recording](https://suche.tierstimmenarchiv.de/search/showdetails.html?unique_identifier=TSA%3APelecanus_onocrotalus_V_2119_10_2&language=english) |
| Penguin | King Penguin | steve b · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/107786503) |
| Scarlet Macaw | Scarlet Macaw | Eric Knight · iNaturalist | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Recording](https://www.inaturalist.org/observations/259493557) |
| Blue Macaw | Hyacinth Macaw | Donald Davesne · iNaturalist | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Recording](https://www.inaturalist.org/observations/338709062) |
| Swan | Mute Swan | Рустам Сафаргалиев · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/205106599) |
| Duck | Mallard | Kristi Zoebelein · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/387192514) |
| Seagull | European Herring Gull | ahabo · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/302046931) |
| Woodpecker | Downy Woodpecker | Chase Harris · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/342141595) |
| Cockatiel | Cockatiel | Nonbinary-Naturalist · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/268793274) |
| Cockatoo | Sulphur-crested Cockatoo | insiderelic · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/262490208) |
| Galah | Galah | insiderelic · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/311556118) |
| African Grey | African Grey Parrot | Gannu03 · iNaturalist | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Recording](https://www.inaturalist.org/observations/194700402) |
| Kea | Kea | Bryn Robinson · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/258443315) |
| Kakapo | Kākāpō | Department of Conservation (NZ) · Department of Conservation (NZ) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Recording](https://www.doc.govt.nz/nature/native-animals/birds/bird-songs-and-calls/) |
| Rosella | Eastern Rosella | John Cull · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/272865377) |
| Amazon | Yellow-crowned Amazon | Kalvin Chan · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/201760923) |
| Parakeet | Rose-ringed Parakeet | ahabo · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/323787735) |
| Budgie | Budgerigar | Vincent Ayran · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/202014306) |
| Lovebird | Rosy-faced Lovebird | Tyler Bishop · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/176045055) |
| King Parrot | Australian King Parrot | John Cull · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/72512591) |
| Sun Conure | Sun Conure | Tembrock, Günter · Tierstimmenarchiv, Museum für Naturkunde Berlin | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/legalcode) | [Recording](https://suche.tierstimmenarchiv.de/search/showdetails.html?unique_identifier=TSA%3AAratinga_solstitialis_V_2121_5_1&language=english) |
| Blue-and-Gold Macaw | Blue-and-gold Macaw | André Ambrozio · iNaturalist | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Recording](https://www.inaturalist.org/observations/168297487) |
| Green-winged Macaw | Green-winged Macaw | Jennifer Rycenga · iNaturalist | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Recording](https://www.inaturalist.org/observations/129879087) |
| Military Macaw | Military Macaw | Jorge I. Merchán Mayorga · iNaturalist | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Recording](https://www.inaturalist.org/observations/86660355) |
| Hyacinth Macaw | Hyacinth Macaw | Donald Davesne · iNaturalist | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Recording](https://www.inaturalist.org/observations/338709062) |
| Blue-throated Macaw | Blue-throated Macaw | Karim Haddad · iNaturalist | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Recording](https://www.inaturalist.org/observations/321124789) |
| Hahn's Macaw | Hahn’s Macaw | Gabriel Cardoso Fialho · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/346194395) |
| Rainbow Lorikeet | Rainbow Lorikeet | Bethlea Bell · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/99688624) |
| Eclectus | Eclectus Parrot | Tembrock, Günter · Tierstimmenarchiv, Museum für Naturkunde Berlin | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/legalcode) | [Recording](https://suche.tierstimmenarchiv.de/search/showdetails.html?unique_identifier=TSA%3AEclectus_roratus_V_2099_20_2&language=english) |
| Eclectus Female | Eclectus Parrot | Tembrock, Günter · Tierstimmenarchiv, Museum für Naturkunde Berlin | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/legalcode) | [Recording](https://suche.tierstimmenarchiv.de/search/showdetails.html?unique_identifier=TSA%3AEclectus_roratus_V_2099_20_2&language=english) |
| Purple Parrot | Senegal Parrot | Ben Costamagna · iNaturalist | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Recording](https://www.inaturalist.org/observations/197550293) |

The first audio candidate failed review: quiet/non-vocal excerpts and a test
typecheck regression. Its nonzero-signal threshold was inadequate; it was never
published. The replacement candidate requires new full checks and peer review.
No human listening, physical device or native-playback acceptance is claimed.

Replacement candidate validation:142tests, explicit `tsc --noEmit` exit0,
production export andqualitychecker exit0. All50clips measure-21.7..-19.9LUFS.
The updated browser probe matched52birds and replayed52journal entries with a
0.05RMS signal threshold (500times the rejected0.0001 threshold), and verified
Cardinal/Bluebird fanfare-after-ended. No page errors. Fresh review pending.

## Vocal-window follow-up

The second candidate still failed on African Grey: its old6.5–9.7s window
contained noise. Its replacement uses0.6–1.75s of the same licensed source and
visibly contains the harmonic call; contrast is now26.3dB. Dove now starts5.2s
and includes two coos. Bluebird wording correctly says1.9seconds.

The five existing hiss-heavy but visibly vocal clips (Bluebird, Sparrow, Downy,
Hahn’s Macaw, Rainbow Lorikeet) remain unchanged. The independent24c99a2review
confirmed their vocal structures and classified the hiss as non-blocking. They
are explicit exceptions in bird-audio-reviewed-windows.json, bound to exact
MP3hashes with inspection notes. New or changed low-contrast clips fail without
a separate recorded inspection; a tonal metric alone no longer passes them.
These are spectral inspections, not listening or expert auditory identification.
The rejected African Grey window has no exception and cannot pass.

Vocal-window validation:143tests, typecheck andexport pass. Both changed birds
pass real browser match/journal playback and fanfare-after-ended checks, with
RMS>.05 andno pageerrors. The new checker rejects the actual rejected GreyMP3
(4.1dBcontrast,no exception); the replacement has26.3dBcontrast. All50clips still
pass loudness limits. The other48recordings and playback code are unchanged.
