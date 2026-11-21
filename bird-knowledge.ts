// Owns sourced bird facts; broad roster names identify examples where needed.
export const BIRD_KNOWLEDGE: Record<string, {
  text: string;
  source?: string;
  sourceLabel?: string;
}> = {
  Cardinal: {
    text: 'Both male and female northern cardinals sing! A pair can share some of the same whistled songs.',
    source: 'https://www.allaboutbirds.org/guide/Northern_Cardinal',
    sourceLabel: 'Cornell Lab of Ornithology',
  },
  Bluebird: {
    text: 'Bluebirds raise their chicks inside holes in trees. They can also use nest boxes that people put up for them.',
    source: 'https://www.allaboutbirds.org/guide/Eastern_Bluebird/lifehistory',
    sourceLabel: 'Cornell Lab of Ornithology',
  },
  Canary: {
    text: 'Young canaries learn songs by listening to an adult and copying what they hear. Learning takes months of practice!',
    source: 'https://www.rockefeller.edu/news/3462-for-young-canaries-learning-their-song-freedom-in-youth-gives-way-to-rules-in-adulthood/',
    sourceLabel: 'The Rockefeller University',
  },
  Macaw: {
    text: 'Macaws use powerful, curved beaks to crack open nuts and seeds. Their toes can hold food like little hands.',
    source: 'https://animals.sandiegozoo.org/animals/macaw',
    sourceLabel: 'San Diego Zoo',
  },
  Crow: {
    text: 'American crow families work together to raise chicks. Older brothers and sisters sometimes help their parents care for the newest babies.',
    source: 'https://www.allaboutbirds.org/guide/American_Crow/lifehistory',
    sourceLabel: 'Cornell Lab of Ornithology',
  },
  Robin: {
    text: 'American robins eat worms, insects and fruit. In some places they eat more worms in the morning and more fruit later in the day!',
    source: 'https://nationalzoo.si.edu/animals/american-robin',
    sourceLabel: "Smithsonian's National Zoo",
  },
  Flamingo: {
    text: 'Flamingos eat with their bills upside down in the water! Tiny filters inside the bill trap their food.',
    source: 'https://animals.sandiegozoo.org/animals/flamingo',
    sourceLabel: 'San Diego Zoo',
  },
  Sparrow: {
    text: 'House sparrows take dust baths! They ruffle their feathers and flick loose dust over their bodies.',
    source: 'https://www.allaboutbirds.org/guide/House_Sparrow/lifehistory',
    sourceLabel: 'Cornell Lab of Ornithology',
  },
  Dove: {
    text: 'Dove moms and dads both make a special food called crop milk. They feed it to their newly hatched chicks.',
    source: 'https://qrius.si.edu/taxonomy/term/12132',
    sourceLabel: 'Smithsonian National Museum of Natural History',
  },
  Kingfisher: {
    text: 'Many kingfishers dig nest tunnels in dirt banks. The tunnel ends in a wider room where their eggs and chicks stay.',
    source: 'https://animals.sandiegozoo.org/animals/kingfisher',
    sourceLabel: 'San Diego Zoo',
  },
  Oriole: {
    text: 'A female Baltimore oriole weaves a nest that hangs from a tree branch. The dangling nest looks a little like a sock!',
    source: 'https://www.allaboutbirds.org/guide/Baltimore_Oriole/lifehistory',
    sourceLabel: 'Cornell Lab of Ornithology',
  },
  Parrot: {
    text: 'Our purple parrot is make-believe! Real parrots have two toes pointing forward and two backward on each foot.',
    source: 'https://animals.sandiegozoo.org/animal-glossary/zygodactyl',
    sourceLabel: 'San Diego Zoo',
  },
  Owl: {
    text: 'Owls cannot move their eyes around in their sockets. They turn their heads to look in a different direction.',
    source: 'https://animals.sandiegozoo.org/animals/owl',
    sourceLabel: 'San Diego Zoo',
  },
  Toucan: {
    text: "A toucan's enormous bill is surprisingly light. It helps the bird reach fruit on thin branches!",
    source: 'https://animals.sandiegozoo.org/animals/toucan',
    sourceLabel: 'San Diego Zoo',
  },
  Goldfinch: {
    text: 'American goldfinches line their nests with soft plant fluff. The female weaves the nest so tightly that it can even hold water!',
    source: 'https://www.allaboutbirds.org/guide/American_Goldfinch/lifehistory',
    sourceLabel: 'Cornell Lab of Ornithology',
  },
  Peacock: {
    text: 'A peacock is a male peafowl; a female is called a peahen. He spreads his long, colorful feathers into a fan to attract her attention.',
    source: 'https://animals.sandiegozoo.org/animals/peafowl',
    sourceLabel: 'San Diego Zoo',
  },
  Bluejay: {
    text: 'Blue jays hide acorns to eat later. One jay can store thousands of acorns in a single autumn!',
    source: 'https://www.allaboutbirds.org/guide/Blue_Jay/lifehistory',
    sourceLabel: 'Cornell Lab of Ornithology',
  },
  Hummingbird: {
    text: 'Hummingbirds can hover in one place while flying. They can also fly backward!',
    source: 'https://nationalzoo.si.edu/migratory-birds/hummingbirds',
    sourceLabel: "Smithsonian's National Zoo",
  },
  Eagle: {
    text: 'Bald eagles build huge stick nests, often five or six feet wide. Both parents help build the nest.',
    source: 'https://www.allaboutbirds.org/guide/Bald_Eagle/lifehistory',
    sourceLabel: 'Cornell Lab of Ornithology',
  },
  Hawk: {
    text: 'Red-tailed hawks ride rising warm air high into the sky. These air currents let them soar using very little energy.',
    source: 'https://www.allaboutbirds.org/news/bird-cams-faq-red-tailed-hawk-nest/',
    sourceLabel: 'Cornell Lab of Ornithology',
  },
  Falcon: {
    text: 'Peregrine falcons often lay eggs on high cliff ledges. They scrape a shallow dip for the eggs instead of building a nest from sticks.',
    source: 'https://www.allaboutbirds.org/guide/Peregrine_Falcon/lifehistory',
    sourceLabel: 'Cornell Lab of Ornithology',
  },
  Pelican: {
    text: 'A pelican scoops up fish and water in its stretchy bill pouch. It drains the water out before swallowing its food.',
    source: 'https://animals.sandiegozoo.org/animals/pelican',
    sourceLabel: 'San Diego Zoo',
  },
  Penguin: {
    text: 'Penguins have stiff, flat wings that work like flippers. They use them to swim through water instead of flying through air.',
    source: 'https://www.calacademy.org/explore-science/african-penguin',
    sourceLabel: 'California Academy of Sciences',
  },
  'Scarlet Macaw': {
    text: 'Scarlet macaws raise their chicks inside large natural holes high in tall trees.',
    source: 'https://parrots.org/encyclopedia/scarlet-macaw/',
    sourceLabel: 'World Parrot Trust',
  },
  'Blue Macaw': {
    text: 'Macaws slow down for landing by spreading their wings like brakes. They lower their feet to grab a branch.',
    source: 'https://animals.sandiegozoo.org/animals/macaw',
    sourceLabel: 'San Diego Zoo',
  },
  Swan: {
    text: 'Swans dip their long necks underwater to reach plants. Sometimes they tip their bottoms into the air to reach farther down!',
    source: 'https://www.allaboutbirds.org/guide/Mute_Swan/id',
    sourceLabel: 'Cornell Lab of Ornithology',
  },
  Duck: {
    text: 'Mallard ducklings hatch covered in soft down. They are ready to leave their nest less than a day after hatching!',
    source: 'https://www.allaboutbirds.org/guide/Mallard/lifehistory',
    sourceLabel: 'Cornell Lab of Ornithology',
  },
  Seagull: {
    text: 'Gulls have special glands that remove extra salt from their bodies. This helps them drink seawater.',
    source: 'https://www.allaboutbirds.org/news/why-can-some-birds-drink-salty-seawater/',
    sourceLabel: 'Cornell Lab of Ornithology',
  },
  Woodpecker: {
    text: 'Woodpeckers brace their stiff tail feathers against tree trunks. The tail works like a prop while their claws hold the bark.',
    source: 'https://wvdnr.gov/woodpecker-adaptations/',
    sourceLabel: 'West Virginia Division of Natural Resources',
  },
  Cockatiel: {
    text: 'Wild cockatiels travel to places where rain has helped grasses grow seeds. They eat those seeds from the ground.',
    source: 'https://collections.museumsvictoria.com.au/species/12555',
    sourceLabel: 'Museums Victoria',
  },
  Cockatoo: {
    text: 'When sulphur-crested cockatoos feed together, one or more birds watch from a nearby perch. They keep a lookout while the others eat.',
    source: 'https://australian.museum/learn/animals/birds/sulphur-crested-cockatoo/',
    sourceLabel: 'Australian Museum',
  },
  Galah: {
    text: 'Galahs line a tree hollow with leaves for their eggs. Both parents take turns keeping the eggs warm and caring for the chicks.',
    source: 'https://australian.museum/learn/animals/birds/galah/',
    sourceLabel: 'Australian Museum',
  },
  'African Grey': {
    text: 'African grey parrots feed high in the treetops. At night, flocks sleep in palms over water or on river islands.',
    source: 'https://parrots.org/encyclopedia/grey-parrot/',
    sourceLabel: 'World Parrot Trust',
  },
  Kea: {
    text: "Kea live on New Zealand's South Island, from mountain areas and forests down to the coast. Their calls can sound like their name: kee-aaa!",
    source: 'https://www.doc.govt.nz/nature/native-animals/birds/birds-a-z/kea/',
    sourceLabel: 'New Zealand Department of Conservation',
  },
  Kakapo: {
    text: 'Kākāpō cannot fly, but their strong claws help them climb tall trees. These parrots are most active at night!',
    source: 'https://www.doc.govt.nz/nature/native-animals/birds/birds-a-z/kakapo/behaviour/',
    sourceLabel: 'New Zealand Department of Conservation',
  },
  Rosella: {
    text: 'Eastern rosellas can hold food in one foot while they eat. They do this on the ground as well as on tree branches!',
    source: 'https://australian.museum/learn/animals/birds/eastern-rosella/',
    sourceLabel: 'Australian Museum',
  },
  Amazon: {
    text: 'Yellow-crowned Amazons eat flowers as well as seeds and fruit. They find food in trees and gather in flocks to sleep.',
    source: 'https://parrots.org/encyclopedia/yellow-crowned-amazon/',
    sourceLabel: 'World Parrot Trust',
  },
  Parakeet: {
    text: 'Rose-ringed parakeets call to each other while flying. At night, they may share sleeping trees with crows, mynas or other parrots.',
    source: 'https://parrots.org/encyclopedia/rose-ringed-parakeet/',
    sourceLabel: 'World Parrot Trust',
  },
  Budgie: {
    text: 'Wild budgies can gather in enormous flocks after good rains bring plenty of food. They often start nesting in response to rain, too!',
    source: 'https://australian.museum/learn/animals/birds/budgerigar/',
    sourceLabel: 'Australian Museum',
  },
  Lovebird: {
    text: 'A female rosy-faced lovebird carries strips of bark tucked into her rump feathers. She flies them to her nest like a tiny delivery bird!',
    source: 'https://parrots.org/encyclopedia/rosy-faced-lovebird/',
    sourceLabel: 'World Parrot Trust',
  },
  'King Parrot': {
    text: 'Australian king parrots lay eggs at the bottom of deep tree hollows. The entrance can be high up even when the eggs are near the ground!',
    source: 'https://australian.museum/learn/animals/birds/australian-king-parrot/',
    sourceLabel: 'Australian Museum',
  },
  'Sun Conure': {
    text: 'Sun conures can be noisy when flying in a flock, then become much harder to notice when they stop to feed.',
    source: 'https://parrots.org/encyclopedia/sun-conure/',
    sourceLabel: 'World Parrot Trust',
  },
  'Blue-and-Gold Macaw': {
    text: 'Blue-and-gold macaws sometimes gather with other parrots at riverbanks to eat clay!',
    source: 'https://parrots.org/encyclopedia/blue-and-yellow-macaw/',
    sourceLabel: 'World Parrot Trust',
  },
  'Green-winged Macaw': {
    text: 'Green-winged macaws call loudly to one another as they fly. Their voices help them communicate across the forest.',
    source: 'https://nationalzoo.si.edu/animals/green-winged-macaw',
    sourceLabel: "Smithsonian's National Zoo",
  },
  'Military Macaw': {
    text: 'Military macaws gather to sleep on cliff faces or in large trees. Their sleeping groups can be bigger than their daytime feeding flocks.',
    source: 'https://parrots.org/encyclopedia/military-macaw/',
    sourceLabel: 'World Parrot Trust',
  },
  'Hyacinth Macaw': {
    text: 'Hyacinth macaws eat mostly palm seeds. Their powerful beaks can break open the hard nuts around this food.',
    source: 'https://www.institutoararaazul.org.br/en/species/hyacinth-macaw/',
    sourceLabel: 'Instituto Arara Azul',
  },
  'Blue-throated Macaw': {
    text: 'Blue-throated macaws rub their beaks on tree branches to clean them. Their cleaning can leave worn spots on the branch tips!',
    source: 'https://parrots.org/encyclopedia/blue-throated-macaw/',
    sourceLabel: 'World Parrot Trust',
  },
  "Hahn's Macaw": {
    text: "Hahn's macaws belong to the smallest kind of macaw. They are only about a foot long, including their tails!",
    source: 'https://parrots.org/encyclopedia/red-shouldered-macaw/',
    sourceLabel: 'World Parrot Trust',
  },
  'Rainbow Lorikeet': {
    text: 'A rainbow lorikeet has a brush-like tip on its tongue. It helps the bird collect nectar and pollen from flowers.',
    source: 'https://www.environment.nsw.gov.au/topics/animals-and-plants/native-animals/native-animal-facts/parrots/the-danger-of-feeding-lorikeets',
    sourceLabel: 'NSW Environment and Heritage',
  },
  Eclectus: {
    text: 'Male eclectus parrots are mostly bright green, while females are mostly red. They leave their sleeping trees early to find fruit and other food.',
    source: 'https://australian.museum/learn/animals/birds/eclectus-parrot-eclectus-roratus/',
    sourceLabel: 'Australian Museum',
  },
  'Eclectus Female': {
    text: 'A female eclectus parrot keeps her eggs warm inside a deep tree hollow. The eggs rest on a bed of wood chips and soft, crumbly wood.',
    source: 'https://australian.museum/learn/animals/birds/eclectus-parrot-eclectus-roratus/',
    sourceLabel: 'Australian Museum',
  },
  'Purple Parrot': {
    text: 'This all-purple parrot is make-believe! Real parrots often favor one foot for handling things, just as people can be right-handed or left-handed.',
    source: 'https://animals.sandiegozoo.org/animals/parrot',
    sourceLabel: 'San Diego Zoo',
  },
};
