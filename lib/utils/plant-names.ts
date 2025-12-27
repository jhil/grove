/**
 * Plant name generator for fun, creative plant naming.
 */

// Adjectives for plant names
const ADJECTIVES = [
  "Mighty",
  "Little",
  "Sir",
  "Lady",
  "Prince",
  "Princess",
  "Professor",
  "Captain",
  "Duke",
  "Baron",
  "Fluffy",
  "Sunny",
  "Leafy",
  "Dewy",
  "Misty",
  "Mossy",
  "Wiggly",
  "Twisty",
  "Curly",
  "Sprouty",
  "Zen",
  "Wild",
  "Peaceful",
  "Gentle",
  "Tiny",
  "Grand",
  "Royal",
  "Ancient",
  "Baby",
  "Old",
];

// Names that work well for plants
const NAMES = [
  // Classic names
  "Fernie",
  "Vera",
  "Phil",
  "Lily",
  "Ivy",
  "Rose",
  "Fern",
  "Jade",
  "Olive",
  "Sage",
  "Basil",
  "Rosemary",
  // Fun names
  "Groot",
  "Planty",
  "Leafy McLeafface",
  "Chlorophyll Bill",
  "Photosynthia",
  "Germaine",
  "Sprout",
  "Bud",
  "Twig",
  "Branch",
  // Sophisticated names
  "Montgomery",
  "Reginald",
  "Beatrice",
  "Penelope",
  "Winston",
  "Theodore",
  "Archibald",
  "Gertrude",
  "Humphrey",
  "Bartholomew",
  // Pop culture
  "Plantonio",
  "Ferndinand",
  "Aloe-ha",
  "Cactus Jack",
  "Snake Plant Plissken",
  "Spiderplant-Man",
  "The Greenfather",
];

// Type-specific names
const TYPE_NAMES: Record<string, string[]> = {
  succulent: [
    "Chonk",
    "Thicc",
    "Plump",
    "Succulent Steve",
    "Desert Rose",
    "Sandy",
    "Chumby",
  ],
  tropical: [
    "Tropicana",
    "Paradise",
    "Jungle Jim",
    "Island",
    "Tiki",
    "Monstera Mia",
    "Palm Pete",
  ],
  fern: [
    "Fernie Sanders",
    "Ferndinand",
    "Sir Fronds-a-Lot",
    "Fern Gully",
    "Fernandez",
  ],
  cactus: [
    "Spike",
    "Needles",
    "Prickles",
    "Pokey",
    "Cactus Jack",
    "Stabby",
    "Señor Pointy",
  ],
  herb: [
    "Basil Fawlty",
    "Rosemary",
    "Thyme Lord",
    "Cilantro",
    "Parsley",
    "Mint Julep",
  ],
  flowering: [
    "Blossom",
    "Petal",
    "Bloom",
    "Flora",
    "Daisy",
    "Petunia",
    "Buttercup",
  ],
  tree: [
    "Treebeard",
    "Groot",
    "Oakley",
    "Willow",
    "Birch",
    "Cedar",
    "The Lorax",
  ],
  vine: [
    "Rapunzel",
    "Crawler",
    "Climber",
    "Tangled",
    "Draper",
    "Pothos Pete",
    "Ivy League",
  ],
};

/**
 * Generate a random plant name.
 */
export function generatePlantName(type?: string): string {
  const useTypeSpecific = type && TYPE_NAMES[type] && Math.random() > 0.5;

  if (useTypeSpecific && type) {
    const typeNames = TYPE_NAMES[type];
    return typeNames[Math.floor(Math.random() * typeNames.length)];
  }

  // Random between adjective+name or just name
  if (Math.random() > 0.6) {
    const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    return `${adjective} ${name}`;
  }

  return NAMES[Math.floor(Math.random() * NAMES.length)];
}

/**
 * Generate multiple name suggestions.
 */
export function generateNameSuggestions(type?: string, count: number = 5): string[] {
  const names = new Set<string>();

  while (names.size < count) {
    names.add(generatePlantName(type));
  }

  return Array.from(names);
}
