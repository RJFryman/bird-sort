// Keep common names aligned with roster.ts. Facts describe real fish unless
// the entry explicitly identifies a make-believe drawing.
export const FISH_KNOWLEDGE: Record<string, {
  text: string;
  source?: string;
  sourceLabel?: string;
}> = {
  Clownfish: {
    text: 'Clownfish shelter among the waving arms of sea anemones. The fish help clean and feed the anemone that gives them a home.',
    source: 'https://www.georgiaaquarium.org/animal/clown-anemonefish/',
    sourceLabel: 'Georgia Aquarium',
  },
  'Blue Tang': {
    text: 'Young blue tangs tuck into branching coral or cracks in rocks for shelter.',
    source: 'https://www.waikikiaquarium.org/experience/animal-guide/fishes/surgeonfishes/blue-tang/',
    sourceLabel: 'Waikīkī Aquarium',
  },
  'Yellow Tang': {
    text: 'Yellow tangs change color at night! Their yellow darkens, and a white stripe appears along each side.',
    source: 'https://www.waikikiaquarium.org/experience/animal-guide/fishes/surgeonfishes/yellow-tang/',
    sourceLabel: 'Waikīkī Aquarium',
  },
  Pufferfish: {
    text: 'A pufferfish can pump water into its stretchy belly and puff up like a balloon.',
    source: 'https://ocean.si.edu/ocean-life/fish/pufferfishes-and-their-relatives',
    sourceLabel: 'Smithsonian Ocean',
  },
  Seahorse: {
    text: 'A seahorse dad carries the growing babies in a pouch. When they are ready, he gives birth!',
    source: 'https://oceanservice.noaa.gov/facts/seahorse.html',
    sourceLabel: 'NOAA',
  },
  Angelfish: {
    text: 'Freshwater angelfish lay eggs on plants and other surfaces. Both parents guard the eggs.',
    source: 'https://aqua.org/explore/animals/freshwater-angelfish',
    sourceLabel: 'National Aquarium',
  },
  Betta: {
    text: "A betta's mouth points upward, helping it scoop up food at the water's surface.",
    source: 'https://animaldiversity.org/accounts/Betta_splendens/',
    sourceLabel: 'University of Michigan · Animal Diversity Web',
  },
  Goldfish: {
    text: 'Goldfish have teeth in their throats! Those teeth help crush their food.',
    source: 'https://www.biokids.umich.edu/critters/Carassius_auratus/',
    sourceLabel: 'University of Michigan · BioKIDS',
  },
  Guppy: {
    text: 'Baby guppies are born swimming. Their eggs grow inside their mother until the babies are ready.',
    source: 'https://www.blueplanetaquarium.com/discover/animals/guppy/',
    sourceLabel: 'Blue Planet Aquarium',
  },
  Koi: {
    text: 'Koi lay sticky eggs that cling to water plants and other things under the water.',
    source: 'https://nationalzoo.si.edu/animals/japanese-koi',
    sourceLabel: "Smithsonian's National Zoo",
  },
  'Green Fish': {
    text: 'This green fish is make-believe! Its round green body is a drawing clue for our game.',
  },
  'Great White Shark': {
    text: 'A great white shark has a skeleton made of cartilage. That is the bendy material in your ears and the tip of your nose!',
    source: 'https://www.amnh.org/explore/ology/marine-biology/all-about-sharks',
    sourceLabel: 'American Museum of Natural History',
  },
  'Hammerhead Shark': {
    text: 'Hammerhead sharks can sense tiny electrical signals from other animals, even ones hiding under sand.',
    source: 'https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/great-hammerhead/',
    sourceLabel: 'Florida Museum',
  },
  'Whale Shark': {
    text: 'The biggest fish in the world eats tiny drifting animals! A whale shark strains food from the water.',
    source: 'https://www.georgiaaquarium.org/animal/whale-shark/',
    sourceLabel: 'Georgia Aquarium',
  },
  'Manta Ray': {
    text: 'Manta rays use the two flaps beside their mouths to guide water and food inside.',
    source: 'https://www.fisheries.noaa.gov/species/giant-manta-ray',
    sourceLabel: 'NOAA Fisheries',
  },
  'Spotted Eagle Ray': {
    text: 'Spotted eagle rays have flat teeth that fit together like plates. They use them to crunch shells around their food.',
    source: 'https://www.georgiaaquarium.org/animal/spotted-eagle-ray/',
    sourceLabel: 'Georgia Aquarium',
  },
  'Moray Eel': {
    text: 'Moray eels open and close their mouths to move water over their gills. That is how they breathe!',
    source: 'https://www.aquariumofthebay.org/wp-content/uploads/ba-aquarium-tour-chaperone.pdf',
    sourceLabel: 'Aquarium of the Bay',
  },
  Lionfish: {
    text: 'Lionfish spread their big, fan-shaped side fins to help corner the small animals they eat.',
    source: 'https://oceanservice.noaa.gov/facts/lionfish-facts.html',
    sourceLabel: 'NOAA',
  },
  'Moorish Idol': {
    text: 'Moorish idols nibble sea sponges! Their narrow jaws help them reach food in reef cracks.',
    source: 'https://www.waikikiaquarium.org/experience/animal-guide/fishes/moorish-idol/moorish-idol/',
    sourceLabel: 'Waikīkī Aquarium',
  },
  'Copperband Butterflyfish': {
    text: 'A copperband butterflyfish uses its long snout to pull tiny animals from tight spaces in the reef.',
    source: 'https://www.georgiaaquarium.org/animal/copperband-butterflyfish/',
    sourceLabel: 'Georgia Aquarium',
  },
  'Royal Blue Discus': {
    text: 'Baby discus nibble a special slime on their parents’ skin. Both parents make this food for their babies!',
    source: 'https://pearl.plymouth.ac.uk/bms-theses/242/',
    sourceLabel: 'University of Plymouth',
  },
  'Neon Tetra': {
    text: 'Neon tetras swim together in groups called schools. These little fish come from streams in South America.',
    source: 'https://zooszeged.hu/en/neon-tetra/',
    sourceLabel: 'Szeged Zoo',
  },
  Mandarinfish: {
    text: 'Mandarinfish search the sea bottom for tiny animals, including little shrimp relatives called copepods.',
    source: 'https://www.aquariumofpacific.org/onlinelearningcenter/species/mandarin_goby',
    sourceLabel: 'Aquarium of the Pacific',
  },
  'Picasso Triggerfish': {
    text: 'A Picasso triggerfish can swim backward or hover in one spot. It usually swims by waving its top and bottom fins.',
    source: 'https://www.seattleaquarium.org/animal/triggerfish/',
    sourceLabel: 'Seattle Aquarium',
  },
  'Yellow Longnose Butterflyfish': {
    text: 'A yellow longnose butterflyfish pokes its narrow snout between coral branches to find small animals to eat.',
    source: 'https://www.waikikiaquarium.org/experience/animal-guide/fishes/butterflyfishes/forceps-butterflyfish/',
    sourceLabel: 'Waikīkī Aquarium',
  },
  Sailfish: {
    text: 'A sailfish can change color! Its colors can look different when it gets excited.',
    source: 'https://www.floridamuseum.ufl.edu/discover-fish/species-profiles/sailfish/',
    sourceLabel: 'Florida Museum',
  },
  'Flying Fish': {
    text: 'Flying fish leap out of the water and spread their fins. Then they glide through the air!',
    source: 'https://www.noaa.gov/office-education/celc/podcast/episode4',
    sourceLabel: 'NOAA',
  },
  'Atlantic Bluefin Tuna': {
    text: 'Atlantic bluefin tuna can swim thousands of miles, crossing an entire ocean!',
    source: 'https://www.fisheries.noaa.gov/species/western-atlantic-bluefin-tuna',
    sourceLabel: 'NOAA Fisheries',
  },
  'Rainbow Trout': {
    text: 'Rainbow trout and steelhead are the same kind of fish. Steelhead travel to the sea, while rainbow trout stay in fresh water.',
    source: 'https://seagrant.oregonstate.edu/WRF/native-fishes/salmon-and-trout/rainbow-trout',
    sourceLabel: 'Oregon State University · Sea Grant',
  },
  'Sockeye Salmon': {
    text: 'Sockeye salmon turn bright red with green heads when they return to fresh water to lay eggs.',
    source: 'https://www.fisheries.noaa.gov/species/sockeye-salmon/seafood',
    sourceLabel: 'NOAA Fisheries',
  },
  Sturgeon: {
    text: 'Sturgeon wear rows of hard plates called scutes. These plates help protect them like armor.',
    source: 'https://www.fisheries.noaa.gov/new-england-mid-atlantic/endangered-species-conservation/scutes-student-resources',
    sourceLabel: 'NOAA Fisheries',
  },
  'Longhorn Cowfish': {
    text: 'Longhorn cowfish blow into the sand to uncover hidden food, such as little worms.',
    source: 'https://aqua.org/explore/animals/longhorn-cowfish',
    sourceLabel: 'National Aquarium',
  },
};
