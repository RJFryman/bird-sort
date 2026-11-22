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

Individual iNaturalist sound licences, not observation/photo licences, were
checked in the observation API. Only CC0, CC BY4.0 and CC BY-SA4.0 were selected.
The official licence module defines those versions:
https://github.com/inaturalist/inaturalist/blob/main/app/models/shared/license_module.rb
Media reuse guidance: https://help.inaturalist.org/en/support/solutions/articles/151000169918

Four archive recordings (Great Green Macaw, Great White Pelican, Sun Conure,
Eclectus) come from Tierstimmenarchiv, Museum für Naturkunde Berlin under the
CC BY-SA3.0 licence linked on their English record pages. Kakapo comes from
Department of Conservation (NZ), explicitly reusable with attribution:
https://www.doc.govt.nz/nature/native-animals/birds/bird-songs-and-calls/
https://www.doc.govt.nz/footer-links/copyright/

Every excerpt retains its source's listed licence, including ShareAlike where
listed. The individual source/creator/licence and modifications are shown in
the journal and in bird-recordings.json. No NC, ND or all-rights-reserved clips
are bundled. No source service is queried during play.

## Preparation and verification

The existing2.8s Cardinal excerpt is retained. New excerpts are at most3.2s,
mono44.1kHz96kbps MP3, with300Hz–7kHz bandpass, bounded gain, short edge fades
and limiting. Pitch and speed are unchanged. A high-energy window was selected
from each source; it is not a studio-isolated vocal. Field ambience may remain.
bird-recordings.json retains exact original URLs, source licence codes where
available, taxon, excerpt offsets, filter settings and original/excerpt SHA256.
Those per-record fields reproduce the conversion with:

```sh
ffmpeg -ss START -t DURATION -i ORIGINAL -af FILTERS -ac 1 -ar 44100 -b:a 96k -map_metadata -1 CLIP.mp3
```

Automated checks verify all saved names/order, attribution/asset coverage, hashes,
decodeability, nonzero signal, actual browser playing/time advance, match and
journal paths and final-call/fanfare ordering. They do not constitute a human
listening test, expert auditory identification or physical iOS-device acceptance.

## Per-entry credits

| Game entry | Recorded species | Recorder | Licence | Original |
|---|---|---|---|---|
| Cardinal | Northern Cardinal | Aleksandr Berdnikov · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/71577658) |
| Bluebird | Eastern Bluebird | Kristi Zoebelein · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/333425527) |
| Canary | Atlantic Canary | Jane Concannon · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/339608550) |
| Macaw | Great Green Macaw | Lütgens, Hans · Tierstimmenarchiv, Museum für Naturkunde Berlin | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/legalcode) | [Recording](https://suche.tierstimmenarchiv.de/search/showdetails.html?unique_identifier=TSA%3AAra_ambiguus_Lue_54_1_1&language=english) |
| Crow | American Crow | Kent P. McFarland · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/142523684) |
| Robin | American Robin | Kathlin Simpkins · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/355313120) |
| Flamingo | Greater Flamingo | Pieter Huybrechts · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/219143299) |
| Sparrow | House Sparrow | kristinpiston · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/223362275) |
| Dove | Mourning Dove | dugald · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/176705822) |
| Kingfisher | Common Kingfisher | Norrland · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/187015100) |
| Oriole | Baltimore Oriole | peakaytea · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/361722567) |
| Parrot | Blue-fronted Amazon | Paula Romano · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/288721628) |
| Owl | Great Horned Owl | Rudyard · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/99059484) |
| Toucan | Toco Toucan | preinzi · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/103837635) |
| Goldfinch | American Goldfinch | dregyn · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/401302736) |
| Peacock | Indian Peafowl | Damien Wallace · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/365289781) |
| Bluejay | Blue Jay | Chase Harris · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/349599336) |
| Hummingbird | Ruby-throated Hummingbird | David Hurtado · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/184530932) |
| Eagle | Bald Eagle | Ben · iNaturalist | [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) | [Recording](https://www.inaturalist.org/observations/415381305) |
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

Validation for the candidate:141tests andtypecheck/export pass. Actual Chrome
UI probe matched all52entries, verified resolved playback promises, advancing
media time and nonzero analyser signal; all52journal replays andcredits pass.
Cardinal andBluebird final-match fanfares followed actual ended events. All50
MP3s decode with expected durations, nonzero signal and valid peaks. No page
errors. No human listening or physical-device acceptance is claimed.
