/**
 * Comprehensive plant database for Plangrove.
 * Curated from public domain sources (USDA Plants Database, Wikipedia).
 *
 * Each plant includes watering recommendations based on typical indoor conditions.
 */

export interface PlantSpecies {
  id: string;
  commonName: string;
  scientificName?: string;
  category: PlantCategory;
  wateringInterval: {
    min: number;  // Minimum days between watering
    ideal: number; // Ideal days between watering
    max: number;  // Maximum days between watering
  };
  sunlight: "low" | "medium" | "high";
  humidity: "low" | "medium" | "high";
  difficulty: "easy" | "moderate" | "expert";
  emoji: string;
}

export type PlantCategory =
  | "succulent"
  | "tropical"
  | "fern"
  | "cactus"
  | "herb"
  | "flowering"
  | "tree"
  | "vine"
  | "palm"
  | "foliage"
  | "orchid"
  | "air-plant"
  | "aquatic"
  | "other";

export const CATEGORY_INFO: Record<PlantCategory, { label: string; emoji: string; defaultInterval: number }> = {
  succulent: { label: "Succulent", emoji: "🪴", defaultInterval: 14 },
  tropical: { label: "Tropical", emoji: "🌴", defaultInterval: 7 },
  fern: { label: "Fern", emoji: "🌿", defaultInterval: 3 },
  cactus: { label: "Cactus", emoji: "🌵", defaultInterval: 21 },
  herb: { label: "Herb", emoji: "🌱", defaultInterval: 2 },
  flowering: { label: "Flowering", emoji: "🌸", defaultInterval: 4 },
  tree: { label: "Tree / Large Plant", emoji: "🌳", defaultInterval: 7 },
  vine: { label: "Vine / Trailing", emoji: "🍃", defaultInterval: 5 },
  palm: { label: "Palm", emoji: "🌴", defaultInterval: 7 },
  foliage: { label: "Foliage", emoji: "🌿", defaultInterval: 7 },
  orchid: { label: "Orchid", emoji: "🌺", defaultInterval: 7 },
  "air-plant": { label: "Air Plant", emoji: "🌱", defaultInterval: 7 },
  aquatic: { label: "Aquatic", emoji: "💧", defaultInterval: 1 },
  other: { label: "Other", emoji: "🪴", defaultInterval: 7 },
};

/**
 * Comprehensive list of common houseplants.
 * Sorted by category for easier browsing.
 */
export const PLANT_DATABASE: PlantSpecies[] = [
  // ==================== SUCCULENTS ====================
  { id: "aloe-vera", commonName: "Aloe Vera", scientificName: "Aloe barbadensis", category: "succulent", wateringInterval: { min: 14, ideal: 21, max: 30 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🪴" },
  { id: "jade-plant", commonName: "Jade Plant", scientificName: "Crassula ovata", category: "succulent", wateringInterval: { min: 14, ideal: 21, max: 28 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🪴" },
  { id: "echeveria", commonName: "Echeveria", scientificName: "Echeveria spp.", category: "succulent", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🪴" },
  { id: "haworthia", commonName: "Haworthia", scientificName: "Haworthia spp.", category: "succulent", wateringInterval: { min: 14, ideal: 21, max: 28 }, sunlight: "medium", humidity: "low", difficulty: "easy", emoji: "🪴" },
  { id: "string-of-pearls", commonName: "String of Pearls", scientificName: "Senecio rowleyanus", category: "succulent", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🪴" },
  { id: "string-of-hearts", commonName: "String of Hearts", scientificName: "Ceropegia woodii", category: "succulent", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "medium", humidity: "low", difficulty: "easy", emoji: "🪴" },
  { id: "burros-tail", commonName: "Burro's Tail", scientificName: "Sedum morganianum", category: "succulent", wateringInterval: { min: 14, ideal: 21, max: 28 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🪴" },
  { id: "hens-and-chicks", commonName: "Hens and Chicks", scientificName: "Sempervivum tectorum", category: "succulent", wateringInterval: { min: 14, ideal: 21, max: 30 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🪴" },
  { id: "kalanchoe", commonName: "Kalanchoe", scientificName: "Kalanchoe blossfeldiana", category: "succulent", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🪴" },
  { id: "lithops", commonName: "Living Stones", scientificName: "Lithops spp.", category: "succulent", wateringInterval: { min: 21, ideal: 30, max: 45 }, sunlight: "high", humidity: "low", difficulty: "expert", emoji: "🪴" },
  { id: "aeonium", commonName: "Aeonium", scientificName: "Aeonium spp.", category: "succulent", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🪴" },
  { id: "sedum", commonName: "Sedum / Stonecrop", scientificName: "Sedum spp.", category: "succulent", wateringInterval: { min: 14, ideal: 21, max: 28 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🪴" },
  { id: "gasteria", commonName: "Gasteria", scientificName: "Gasteria spp.", category: "succulent", wateringInterval: { min: 14, ideal: 21, max: 28 }, sunlight: "medium", humidity: "low", difficulty: "easy", emoji: "🪴" },
  { id: "graptoveria", commonName: "Graptoveria", scientificName: "Graptoveria spp.", category: "succulent", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🪴" },
  { id: "pachyphytum", commonName: "Moonstones", scientificName: "Pachyphytum oviferum", category: "succulent", wateringInterval: { min: 14, ideal: 21, max: 28 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🪴" },
  { id: "string-of-bananas", commonName: "String of Bananas", scientificName: "Senecio radicans", category: "succulent", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🪴" },
  { id: "string-of-dolphins", commonName: "String of Dolphins", scientificName: "Senecio peregrinus", category: "succulent", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "medium", humidity: "low", difficulty: "moderate", emoji: "🪴" },
  { id: "panda-plant", commonName: "Panda Plant", scientificName: "Kalanchoe tomentosa", category: "succulent", wateringInterval: { min: 14, ideal: 21, max: 28 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🪴" },
  { id: "zebra-plant-succulent", commonName: "Zebra Plant (Succulent)", scientificName: "Haworthiopsis attenuata", category: "succulent", wateringInterval: { min: 14, ideal: 21, max: 28 }, sunlight: "medium", humidity: "low", difficulty: "easy", emoji: "🪴" },

  // ==================== CACTI ====================
  { id: "barrel-cactus", commonName: "Barrel Cactus", scientificName: "Ferocactus spp.", category: "cactus", wateringInterval: { min: 21, ideal: 30, max: 45 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌵" },
  { id: "christmas-cactus", commonName: "Christmas Cactus", scientificName: "Schlumbergera spp.", category: "cactus", wateringInterval: { min: 7, ideal: 14, max: 21 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌵" },
  { id: "easter-cactus", commonName: "Easter Cactus", scientificName: "Rhipsalidopsis gaertneri", category: "cactus", wateringInterval: { min: 7, ideal: 14, max: 21 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌵" },
  { id: "prickly-pear", commonName: "Prickly Pear", scientificName: "Opuntia spp.", category: "cactus", wateringInterval: { min: 14, ideal: 21, max: 30 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌵" },
  { id: "bunny-ears-cactus", commonName: "Bunny Ears Cactus", scientificName: "Opuntia microdasys", category: "cactus", wateringInterval: { min: 14, ideal: 21, max: 30 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌵" },
  { id: "moon-cactus", commonName: "Moon Cactus", scientificName: "Gymnocalycium mihanovichii", category: "cactus", wateringInterval: { min: 14, ideal: 21, max: 28 }, sunlight: "medium", humidity: "low", difficulty: "moderate", emoji: "🌵" },
  { id: "san-pedro", commonName: "San Pedro Cactus", scientificName: "Echinopsis pachanoi", category: "cactus", wateringInterval: { min: 14, ideal: 21, max: 30 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌵" },
  { id: "old-man-cactus", commonName: "Old Man Cactus", scientificName: "Cephalocereus senilis", category: "cactus", wateringInterval: { min: 21, ideal: 30, max: 45 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🌵" },
  { id: "star-cactus", commonName: "Star Cactus", scientificName: "Astrophytum asterias", category: "cactus", wateringInterval: { min: 21, ideal: 30, max: 45 }, sunlight: "high", humidity: "low", difficulty: "expert", emoji: "🌵" },
  { id: "bishops-cap", commonName: "Bishop's Cap", scientificName: "Astrophytum myriostigma", category: "cactus", wateringInterval: { min: 21, ideal: 30, max: 45 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🌵" },
  { id: "fairy-castle-cactus", commonName: "Fairy Castle Cactus", scientificName: "Acanthocereus tetragonus", category: "cactus", wateringInterval: { min: 14, ideal: 21, max: 30 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌵" },
  { id: "mammillaria", commonName: "Mammillaria", scientificName: "Mammillaria spp.", category: "cactus", wateringInterval: { min: 14, ideal: 21, max: 30 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌵" },
  { id: "organ-pipe-cactus", commonName: "Organ Pipe Cactus", scientificName: "Stenocereus thurberi", category: "cactus", wateringInterval: { min: 21, ideal: 30, max: 45 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🌵" },
  { id: "saguaro", commonName: "Saguaro", scientificName: "Carnegiea gigantea", category: "cactus", wateringInterval: { min: 21, ideal: 30, max: 45 }, sunlight: "high", humidity: "low", difficulty: "expert", emoji: "🌵" },

  // ==================== TROPICAL ====================
  { id: "monstera-deliciosa", commonName: "Monstera", scientificName: "Monstera deliciosa", category: "tropical", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌴" },
  { id: "fiddle-leaf-fig", commonName: "Fiddle Leaf Fig", scientificName: "Ficus lyrata", category: "tropical", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌴" },
  { id: "bird-of-paradise", commonName: "Bird of Paradise", scientificName: "Strelitzia reginae", category: "tropical", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌴" },
  { id: "rubber-plant", commonName: "Rubber Plant", scientificName: "Ficus elastica", category: "tropical", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌴" },
  { id: "peace-lily", commonName: "Peace Lily", scientificName: "Spathiphyllum spp.", category: "tropical", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "low", humidity: "high", difficulty: "easy", emoji: "🌴" },
  { id: "philodendron-brasil", commonName: "Philodendron Brasil", scientificName: "Philodendron hederaceum 'Brasil'", category: "tropical", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌴" },
  { id: "philodendron-heartleaf", commonName: "Heartleaf Philodendron", scientificName: "Philodendron hederaceum", category: "tropical", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌴" },
  { id: "calathea-ornata", commonName: "Calathea Ornata", scientificName: "Goeppertia ornata", category: "tropical", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "expert", emoji: "🌴" },
  { id: "calathea-medallion", commonName: "Calathea Medallion", scientificName: "Goeppertia roseopicta", category: "tropical", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "expert", emoji: "🌴" },
  { id: "calathea-rattlesnake", commonName: "Rattlesnake Plant", scientificName: "Goeppertia insignis", category: "tropical", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌴" },
  { id: "calathea-zebrina", commonName: "Zebra Plant (Calathea)", scientificName: "Goeppertia zebrina", category: "tropical", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌴" },
  { id: "prayer-plant", commonName: "Prayer Plant", scientificName: "Maranta leuconeura", category: "tropical", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌴" },
  { id: "croton", commonName: "Croton", scientificName: "Codiaeum variegatum", category: "tropical", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "🌴" },
  { id: "alocasia-polly", commonName: "Alocasia Polly", scientificName: "Alocasia x amazonica", category: "tropical", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌴" },
  { id: "alocasia-zebrina", commonName: "Alocasia Zebrina", scientificName: "Alocasia zebrina", category: "tropical", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌴" },
  { id: "anthurium", commonName: "Anthurium", scientificName: "Anthurium andraeanum", category: "tropical", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌴" },
  { id: "caladium", commonName: "Caladium", scientificName: "Caladium spp.", category: "tropical", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌴" },
  { id: "banana-plant", commonName: "Banana Plant", scientificName: "Musa spp.", category: "tropical", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "🌴" },
  { id: "elephant-ear", commonName: "Elephant Ear", scientificName: "Colocasia spp.", category: "tropical", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌴" },
  { id: "dieffenbachia", commonName: "Dumb Cane", scientificName: "Dieffenbachia spp.", category: "tropical", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌴" },
  { id: "dracaena-marginata", commonName: "Dragon Tree", scientificName: "Dracaena marginata", category: "tropical", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "medium", humidity: "low", difficulty: "easy", emoji: "🌴" },
  { id: "dracaena-fragrans", commonName: "Corn Plant", scientificName: "Dracaena fragrans", category: "tropical", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌴" },
  { id: "schefflera", commonName: "Umbrella Plant", scientificName: "Schefflera arboricola", category: "tropical", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌴" },
  { id: "ti-plant", commonName: "Ti Plant", scientificName: "Cordyline fruticosa", category: "tropical", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌴" },
  { id: "monstera-adansonii", commonName: "Swiss Cheese Plant", scientificName: "Monstera adansonii", category: "tropical", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "high", difficulty: "easy", emoji: "🌴" },
  { id: "split-leaf-philodendron", commonName: "Split Leaf Philodendron", scientificName: "Thaumatophyllum bipinnatifidum", category: "tropical", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌴" },
  { id: "chinese-evergreen", commonName: "Chinese Evergreen", scientificName: "Aglaonema spp.", category: "tropical", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "low", humidity: "medium", difficulty: "easy", emoji: "🌴" },

  // ==================== FERNS ====================
  { id: "boston-fern", commonName: "Boston Fern", scientificName: "Nephrolepis exaltata", category: "fern", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌿" },
  { id: "maidenhair-fern", commonName: "Maidenhair Fern", scientificName: "Adiantum spp.", category: "fern", wateringInterval: { min: 2, ideal: 3, max: 4 }, sunlight: "medium", humidity: "high", difficulty: "expert", emoji: "🌿" },
  { id: "birds-nest-fern", commonName: "Bird's Nest Fern", scientificName: "Asplenium nidus", category: "fern", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌿" },
  { id: "staghorn-fern", commonName: "Staghorn Fern", scientificName: "Platycerium spp.", category: "fern", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌿" },
  { id: "rabbit-foot-fern", commonName: "Rabbit Foot Fern", scientificName: "Davallia fejeensis", category: "fern", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌿" },
  { id: "asparagus-fern", commonName: "Asparagus Fern", scientificName: "Asparagus setaceus", category: "fern", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "kimberly-queen-fern", commonName: "Kimberly Queen Fern", scientificName: "Nephrolepis obliterata", category: "fern", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "high", difficulty: "easy", emoji: "🌿" },
  { id: "lemon-button-fern", commonName: "Lemon Button Fern", scientificName: "Nephrolepis cordifolia", category: "fern", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "crocodile-fern", commonName: "Crocodile Fern", scientificName: "Microsorum musifolium", category: "fern", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌿" },
  { id: "blue-star-fern", commonName: "Blue Star Fern", scientificName: "Phlebodium aureum", category: "fern", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "kangaroo-fern", commonName: "Kangaroo Fern", scientificName: "Microsorum pustulatum", category: "fern", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "holly-fern", commonName: "Holly Fern", scientificName: "Cyrtomium falcatum", category: "fern", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "low", humidity: "medium", difficulty: "easy", emoji: "🌿" },

  // ==================== HERBS ====================
  { id: "basil", commonName: "Basil", scientificName: "Ocimum basilicum", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "mint", commonName: "Mint", scientificName: "Mentha spp.", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "medium", humidity: "high", difficulty: "easy", emoji: "🌱" },
  { id: "rosemary", commonName: "Rosemary", scientificName: "Salvia rosmarinus", category: "herb", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🌱" },
  { id: "thyme", commonName: "Thyme", scientificName: "Thymus vulgaris", category: "herb", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌱" },
  { id: "parsley", commonName: "Parsley", scientificName: "Petroselinum crispum", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "cilantro", commonName: "Cilantro", scientificName: "Coriandrum sativum", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌱" },
  { id: "chives", commonName: "Chives", scientificName: "Allium schoenoprasum", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "oregano", commonName: "Oregano", scientificName: "Origanum vulgare", category: "herb", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌱" },
  { id: "sage", commonName: "Sage", scientificName: "Salvia officinalis", category: "herb", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌱" },
  { id: "lavender", commonName: "Lavender", scientificName: "Lavandula spp.", category: "herb", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🌱" },
  { id: "dill", commonName: "Dill", scientificName: "Anethum graveolens", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "lemongrass", commonName: "Lemongrass", scientificName: "Cymbopogon citratus", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "high", difficulty: "easy", emoji: "🌱" },
  { id: "bay-laurel", commonName: "Bay Laurel", scientificName: "Laurus nobilis", category: "herb", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌱" },
  { id: "stevia", commonName: "Stevia", scientificName: "Stevia rebaudiana", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌱" },
  { id: "tarragon", commonName: "Tarragon", scientificName: "Artemisia dracunculus", category: "herb", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🌱" },
  { id: "marjoram", commonName: "Marjoram", scientificName: "Origanum majorana", category: "herb", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌱" },

  // ==================== FLOWERING ====================
  { id: "african-violet", commonName: "African Violet", scientificName: "Streptocarpus sect. Saintpaulia", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "begonia", commonName: "Begonia", scientificName: "Begonia spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌸" },
  { id: "geranium", commonName: "Geranium", scientificName: "Pelargonium spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "hibiscus", commonName: "Hibiscus", scientificName: "Hibiscus rosa-sinensis", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "gardenia", commonName: "Gardenia", scientificName: "Gardenia jasminoides", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "high", difficulty: "expert", emoji: "🌸" },
  { id: "jasmine", commonName: "Jasmine", scientificName: "Jasminum spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "bromeliad", commonName: "Bromeliad", scientificName: "Bromeliaceae family", category: "flowering", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "high", difficulty: "easy", emoji: "🌸" },
  { id: "cyclamen", commonName: "Cyclamen", scientificName: "Cyclamen persicum", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "amaryllis", commonName: "Amaryllis", scientificName: "Hippeastrum spp.", category: "flowering", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "lipstick-plant", commonName: "Lipstick Plant", scientificName: "Aeschynanthus radicans", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌸" },
  { id: "hoya-carnosa", commonName: "Wax Plant", scientificName: "Hoya carnosa", category: "flowering", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "crown-of-thorns", commonName: "Crown of Thorns", scientificName: "Euphorbia milii", category: "flowering", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "mandevilla", commonName: "Mandevilla", scientificName: "Mandevilla spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "peace-lily-flower", commonName: "Spathiphyllum", scientificName: "Spathiphyllum wallisii", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "low", humidity: "high", difficulty: "easy", emoji: "🌸" },
  { id: "clivia", commonName: "Clivia", scientificName: "Clivia miniata", category: "flowering", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "streptocarpus", commonName: "Cape Primrose", scientificName: "Streptocarpus spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "gloxinia", commonName: "Gloxinia", scientificName: "Sinningia speciosa", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌸" },

  // ==================== VINES / TRAILING ====================
  { id: "pothos-golden", commonName: "Golden Pothos", scientificName: "Epipremnum aureum", category: "vine", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "low", humidity: "medium", difficulty: "easy", emoji: "🍃" },
  { id: "pothos-marble-queen", commonName: "Marble Queen Pothos", scientificName: "Epipremnum aureum 'Marble Queen'", category: "vine", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🍃" },
  { id: "pothos-neon", commonName: "Neon Pothos", scientificName: "Epipremnum aureum 'Neon'", category: "vine", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🍃" },
  { id: "pothos-satin", commonName: "Satin Pothos", scientificName: "Scindapsus pictus", category: "vine", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🍃" },
  { id: "english-ivy", commonName: "English Ivy", scientificName: "Hedera helix", category: "vine", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🍃" },
  { id: "wandering-jew", commonName: "Wandering Dude", scientificName: "Tradescantia zebrina", category: "vine", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🍃" },
  { id: "spider-plant", commonName: "Spider Plant", scientificName: "Chlorophytum comosum", category: "vine", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🍃" },
  { id: "creeping-fig", commonName: "Creeping Fig", scientificName: "Ficus pumila", category: "vine", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🍃" },
  { id: "inch-plant", commonName: "Inch Plant", scientificName: "Tradescantia fluminensis", category: "vine", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🍃" },
  { id: "grape-ivy", commonName: "Grape Ivy", scientificName: "Cissus rhombifolia", category: "vine", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🍃" },
  { id: "swedish-ivy", commonName: "Swedish Ivy", scientificName: "Plectranthus verticillatus", category: "vine", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🍃" },
  { id: "peperomia-trailing", commonName: "Trailing Peperomia", scientificName: "Peperomia prostrata", category: "vine", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🍃" },
  { id: "string-of-turtles", commonName: "String of Turtles", scientificName: "Peperomia prostrata", category: "vine", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🍃" },
  { id: "hoya-kerrii", commonName: "Sweetheart Hoya", scientificName: "Hoya kerrii", category: "vine", wateringInterval: { min: 14, ideal: 21, max: 28 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🍃" },
  { id: "dischidia", commonName: "Dischidia", scientificName: "Dischidia spp.", category: "vine", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🍃" },

  // ==================== PALMS ====================
  { id: "areca-palm", commonName: "Areca Palm", scientificName: "Dypsis lutescens", category: "palm", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌴" },
  { id: "parlor-palm", commonName: "Parlor Palm", scientificName: "Chamaedorea elegans", category: "palm", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "low", humidity: "medium", difficulty: "easy", emoji: "🌴" },
  { id: "kentia-palm", commonName: "Kentia Palm", scientificName: "Howea forsteriana", category: "palm", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "low", humidity: "medium", difficulty: "easy", emoji: "🌴" },
  { id: "majesty-palm", commonName: "Majesty Palm", scientificName: "Ravenea rivularis", category: "palm", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌴" },
  { id: "bamboo-palm", commonName: "Bamboo Palm", scientificName: "Chamaedorea seifrizii", category: "palm", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "low", humidity: "medium", difficulty: "easy", emoji: "🌴" },
  { id: "cat-palm", commonName: "Cat Palm", scientificName: "Chamaedorea cataractarum", category: "palm", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌴" },
  { id: "lady-palm", commonName: "Lady Palm", scientificName: "Rhapis excelsa", category: "palm", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "low", humidity: "medium", difficulty: "easy", emoji: "🌴" },
  { id: "ponytail-palm", commonName: "Ponytail Palm", scientificName: "Beaucarnea recurvata", category: "palm", wateringInterval: { min: 14, ideal: 21, max: 28 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌴" },
  { id: "fan-palm", commonName: "Fan Palm", scientificName: "Livistona chinensis", category: "palm", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌴" },
  { id: "sago-palm", commonName: "Sago Palm", scientificName: "Cycas revoluta", category: "palm", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌴" },
  { id: "yucca-palm", commonName: "Yucca", scientificName: "Yucca elephantipes", category: "palm", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌴" },
  { id: "fishtail-palm", commonName: "Fishtail Palm", scientificName: "Caryota mitis", category: "palm", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌴" },

  // ==================== FOLIAGE ====================
  { id: "snake-plant", commonName: "Snake Plant", scientificName: "Dracaena trifasciata", category: "foliage", wateringInterval: { min: 14, ideal: 21, max: 30 }, sunlight: "low", humidity: "low", difficulty: "easy", emoji: "🌿" },
  { id: "zz-plant", commonName: "ZZ Plant", scientificName: "Zamioculcas zamiifolia", category: "foliage", wateringInterval: { min: 14, ideal: 21, max: 28 }, sunlight: "low", humidity: "low", difficulty: "easy", emoji: "🌿" },
  { id: "cast-iron-plant", commonName: "Cast Iron Plant", scientificName: "Aspidistra elatior", category: "foliage", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "low", humidity: "low", difficulty: "easy", emoji: "🌿" },
  { id: "peperomia-watermelon", commonName: "Watermelon Peperomia", scientificName: "Peperomia argyreia", category: "foliage", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "peperomia-obtusifolia", commonName: "Baby Rubber Plant", scientificName: "Peperomia obtusifolia", category: "foliage", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "pilea-peperomioides", commonName: "Chinese Money Plant", scientificName: "Pilea peperomioides", category: "foliage", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "nerve-plant", commonName: "Nerve Plant", scientificName: "Fittonia albivenis", category: "foliage", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "low", humidity: "high", difficulty: "moderate", emoji: "🌿" },
  { id: "polka-dot-plant", commonName: "Polka Dot Plant", scientificName: "Hypoestes phyllostachya", category: "foliage", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "rex-begonia", commonName: "Rex Begonia", scientificName: "Begonia rex", category: "foliage", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌿" },
  { id: "coleus", commonName: "Coleus", scientificName: "Coleus scutellarioides", category: "foliage", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "lucky-bamboo", commonName: "Lucky Bamboo", scientificName: "Dracaena sanderiana", category: "foliage", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "low", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "aluminum-plant", commonName: "Aluminum Plant", scientificName: "Pilea cadierei", category: "foliage", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "wandering-jew-purple", commonName: "Purple Heart", scientificName: "Tradescantia pallida", category: "foliage", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "stromanthe", commonName: "Stromanthe Triostar", scientificName: "Stromanthe sanguinea", category: "foliage", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌿" },
  { id: "ctenanthe", commonName: "Never Never Plant", scientificName: "Ctenanthe spp.", category: "foliage", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌿" },

  // ==================== ORCHIDS ====================
  { id: "phalaenopsis", commonName: "Moth Orchid", scientificName: "Phalaenopsis spp.", category: "orchid", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌺" },
  { id: "dendrobium", commonName: "Dendrobium Orchid", scientificName: "Dendrobium spp.", category: "orchid", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "🌺" },
  { id: "cattleya", commonName: "Cattleya Orchid", scientificName: "Cattleya spp.", category: "orchid", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "🌺" },
  { id: "oncidium", commonName: "Dancing Lady Orchid", scientificName: "Oncidium spp.", category: "orchid", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "🌺" },
  { id: "vanda", commonName: "Vanda Orchid", scientificName: "Vanda spp.", category: "orchid", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "high", difficulty: "expert", emoji: "🌺" },
  { id: "paphiopedilum", commonName: "Lady Slipper Orchid", scientificName: "Paphiopedilum spp.", category: "orchid", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌺" },
  { id: "miltoniopsis", commonName: "Pansy Orchid", scientificName: "Miltoniopsis spp.", category: "orchid", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "expert", emoji: "🌺" },
  { id: "cymbidium", commonName: "Cymbidium Orchid", scientificName: "Cymbidium spp.", category: "orchid", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌺" },
  { id: "ludisia", commonName: "Jewel Orchid", scientificName: "Ludisia discolor", category: "orchid", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "low", humidity: "high", difficulty: "easy", emoji: "🌺" },

  // ==================== AIR PLANTS ====================
  { id: "tillandsia-ionantha", commonName: "Sky Plant", scientificName: "Tillandsia ionantha", category: "air-plant", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "tillandsia-xerographica", commonName: "King of Air Plants", scientificName: "Tillandsia xerographica", category: "air-plant", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🌱" },
  { id: "spanish-moss", commonName: "Spanish Moss", scientificName: "Tillandsia usneoides", category: "air-plant", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌱" },
  { id: "tillandsia-caput-medusae", commonName: "Medusa's Head", scientificName: "Tillandsia caput-medusae", category: "air-plant", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "tillandsia-bulbosa", commonName: "Bulbous Air Plant", scientificName: "Tillandsia bulbosa", category: "air-plant", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "easy", emoji: "🌱" },
  { id: "tillandsia-tectorum", commonName: "Fuzzy Air Plant", scientificName: "Tillandsia tectorum", category: "air-plant", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌱" },
  { id: "tillandsia-stricta", commonName: "Stricta Air Plant", scientificName: "Tillandsia stricta", category: "air-plant", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "tillandsia-capitata", commonName: "Capitata Air Plant", scientificName: "Tillandsia capitata", category: "air-plant", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌱" },

  // ==================== TREES / LARGE PLANTS ====================
  { id: "ficus-benjamina", commonName: "Weeping Fig", scientificName: "Ficus benjamina", category: "tree", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌳" },
  { id: "ficus-audrey", commonName: "Ficus Audrey", scientificName: "Ficus benghalensis", category: "tree", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌳" },
  { id: "ficus-tineke", commonName: "Tineke Rubber Plant", scientificName: "Ficus elastica 'Tineke'", category: "tree", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌳" },
  { id: "norfolk-island-pine", commonName: "Norfolk Island Pine", scientificName: "Araucaria heterophylla", category: "tree", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌳" },
  { id: "money-tree", commonName: "Money Tree", scientificName: "Pachira aquatica", category: "tree", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌳" },
  { id: "ming-aralia", commonName: "Ming Aralia", scientificName: "Polyscias fruticosa", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌳" },
  { id: "false-aralia", commonName: "False Aralia", scientificName: "Dizygotheca elegantissima", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "expert", emoji: "🌳" },
  { id: "olive-tree", commonName: "Olive Tree", scientificName: "Olea europaea", category: "tree", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🌳" },
  { id: "citrus-tree", commonName: "Citrus Tree (Indoor)", scientificName: "Citrus spp.", category: "tree", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌳" },
  { id: "avocado", commonName: "Avocado Tree", scientificName: "Persea americana", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌳" },
  { id: "coffee-plant", commonName: "Coffee Plant", scientificName: "Coffea arabica", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌳" },

  // ==================== AQUATIC ====================
  { id: "water-lily", commonName: "Water Lily (Indoor)", scientificName: "Nymphaea spp.", category: "aquatic", wateringInterval: { min: 1, ideal: 1, max: 1 }, sunlight: "high", humidity: "high", difficulty: "expert", emoji: "💧" },
  { id: "water-hyacinth", commonName: "Water Hyacinth", scientificName: "Eichhornia crassipes", category: "aquatic", wateringInterval: { min: 1, ideal: 1, max: 1 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "💧" },
  { id: "water-lettuce", commonName: "Water Lettuce", scientificName: "Pistia stratiotes", category: "aquatic", wateringInterval: { min: 1, ideal: 1, max: 1 }, sunlight: "high", humidity: "high", difficulty: "easy", emoji: "💧" },
  { id: "duckweed", commonName: "Duckweed", scientificName: "Lemna minor", category: "aquatic", wateringInterval: { min: 1, ideal: 1, max: 1 }, sunlight: "high", humidity: "high", difficulty: "easy", emoji: "💧" },
  { id: "papyrus", commonName: "Papyrus", scientificName: "Cyperus papyrus", category: "aquatic", wateringInterval: { min: 1, ideal: 1, max: 2 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "💧" },

  // ==================== ADDITIONAL TREES / INDOOR TREES ====================
  { id: "cinnamon-tree", commonName: "Cinnamon Tree", scientificName: "Cinnamomum verum", category: "tree", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌳" },
  { id: "bay-tree", commonName: "Bay Tree", scientificName: "Laurus nobilis", category: "tree", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌳" },
  { id: "fig-tree", commonName: "Fig Tree (Edible)", scientificName: "Ficus carica", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌳" },
  { id: "lemon-tree", commonName: "Lemon Tree", scientificName: "Citrus limon", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍋" },
  { id: "lime-tree", commonName: "Lime Tree", scientificName: "Citrus aurantiifolia", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌳" },
  { id: "orange-tree", commonName: "Orange Tree (Dwarf)", scientificName: "Citrus sinensis", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍊" },
  { id: "kumquat", commonName: "Kumquat Tree", scientificName: "Citrus japonica", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌳" },
  { id: "pomegranate", commonName: "Pomegranate (Dwarf)", scientificName: "Punica granatum", category: "tree", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🌳" },
  { id: "mango-tree", commonName: "Mango Tree (Indoor)", scientificName: "Mangifera indica", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "🥭" },
  { id: "guava-tree", commonName: "Guava Tree", scientificName: "Psidium guajava", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌳" },
  { id: "papaya-tree", commonName: "Papaya Tree", scientificName: "Carica papaya", category: "tree", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "🌳" },
  { id: "tea-plant", commonName: "Tea Plant", scientificName: "Camellia sinensis", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌳" },
  { id: "japanese-maple", commonName: "Japanese Maple (Bonsai)", scientificName: "Acer palmatum", category: "tree", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🍁" },
  { id: "bonsai-juniper", commonName: "Juniper Bonsai", scientificName: "Juniperus spp.", category: "tree", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌲" },
  { id: "bonsai-ficus", commonName: "Ficus Bonsai", scientificName: "Ficus retusa", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌳" },
  { id: "camellia", commonName: "Camellia", scientificName: "Camellia japonica", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌸" },
  { id: "magnolia", commonName: "Magnolia (Dwarf)", scientificName: "Magnolia spp.", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "eucalyptus", commonName: "Eucalyptus", scientificName: "Eucalyptus spp.", category: "tree", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🌿" },
  { id: "moringa", commonName: "Moringa Tree", scientificName: "Moringa oleifera", category: "tree", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌳" },
  { id: "curry-leaf", commonName: "Curry Leaf Tree", scientificName: "Murraya koenigii", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌿" },

  // ==================== VEGETABLES / EDIBLES ====================
  { id: "tomato", commonName: "Tomato Plant", scientificName: "Solanum lycopersicum", category: "other", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🍅" },
  { id: "pepper-bell", commonName: "Bell Pepper", scientificName: "Capsicum annuum", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🫑" },
  { id: "pepper-chili", commonName: "Chili Pepper", scientificName: "Capsicum spp.", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌶️" },
  { id: "pepper-jalapeno", commonName: "Jalapeño Pepper", scientificName: "Capsicum annuum 'Jalapeño'", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌶️" },
  { id: "cucumber", commonName: "Cucumber", scientificName: "Cucumis sativus", category: "other", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🥒" },
  { id: "zucchini", commonName: "Zucchini", scientificName: "Cucurbita pepo", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🥒" },
  { id: "squash", commonName: "Squash", scientificName: "Cucurbita spp.", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🎃" },
  { id: "pumpkin", commonName: "Pumpkin", scientificName: "Cucurbita maxima", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🎃" },
  { id: "eggplant", commonName: "Eggplant", scientificName: "Solanum melongena", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍆" },
  { id: "lettuce", commonName: "Lettuce", scientificName: "Lactuca sativa", category: "other", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🥬" },
  { id: "spinach", commonName: "Spinach", scientificName: "Spinacia oleracea", category: "other", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🥬" },
  { id: "kale", commonName: "Kale", scientificName: "Brassica oleracea var. sabellica", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🥬" },
  { id: "arugula", commonName: "Arugula", scientificName: "Eruca vesicaria", category: "other", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🥬" },
  { id: "swiss-chard", commonName: "Swiss Chard", scientificName: "Beta vulgaris", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🥬" },
  { id: "broccoli", commonName: "Broccoli", scientificName: "Brassica oleracea var. italica", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🥦" },
  { id: "cauliflower", commonName: "Cauliflower", scientificName: "Brassica oleracea var. botrytis", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🥦" },
  { id: "cabbage", commonName: "Cabbage", scientificName: "Brassica oleracea var. capitata", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🥬" },
  { id: "brussels-sprouts", commonName: "Brussels Sprouts", scientificName: "Brassica oleracea var. gemmifera", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🥬" },
  { id: "carrot", commonName: "Carrot", scientificName: "Daucus carota", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🥕" },
  { id: "radish", commonName: "Radish", scientificName: "Raphanus sativus", category: "other", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🥕" },
  { id: "beet", commonName: "Beet", scientificName: "Beta vulgaris", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🥕" },
  { id: "onion", commonName: "Onion", scientificName: "Allium cepa", category: "other", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🧅" },
  { id: "garlic", commonName: "Garlic", scientificName: "Allium sativum", category: "other", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🧄" },
  { id: "leek", commonName: "Leek", scientificName: "Allium ampeloprasum", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🧅" },
  { id: "green-onion", commonName: "Green Onion / Scallion", scientificName: "Allium fistulosum", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🧅" },
  { id: "potato", commonName: "Potato", scientificName: "Solanum tuberosum", category: "other", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🥔" },
  { id: "sweet-potato", commonName: "Sweet Potato", scientificName: "Ipomoea batatas", category: "other", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🍠" },
  { id: "pea", commonName: "Pea Plant", scientificName: "Pisum sativum", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🥒" },
  { id: "green-bean", commonName: "Green Bean", scientificName: "Phaseolus vulgaris", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🥒" },
  { id: "corn", commonName: "Corn", scientificName: "Zea mays", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌽" },
  { id: "asparagus", commonName: "Asparagus", scientificName: "Asparagus officinalis", category: "other", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🥬" },
  { id: "artichoke", commonName: "Artichoke", scientificName: "Cynara cardunculus", category: "other", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🥬" },
  { id: "celery", commonName: "Celery", scientificName: "Apium graveolens", category: "other", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🥬" },

  // ==================== BERRIES / FRUIT PLANTS ====================
  { id: "strawberry", commonName: "Strawberry", scientificName: "Fragaria × ananassa", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🍓" },
  { id: "blueberry", commonName: "Blueberry", scientificName: "Vaccinium corymbosum", category: "other", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🫐" },
  { id: "raspberry", commonName: "Raspberry", scientificName: "Rubus idaeus", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍇" },
  { id: "blackberry", commonName: "Blackberry", scientificName: "Rubus fruticosus", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍇" },
  { id: "grape-vine", commonName: "Grape Vine", scientificName: "Vitis vinifera", category: "vine", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🍇" },
  { id: "kiwi", commonName: "Kiwi Vine", scientificName: "Actinidia deliciosa", category: "vine", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🥝" },
  { id: "passion-fruit", commonName: "Passion Fruit Vine", scientificName: "Passiflora edulis", category: "vine", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "🍈" },
  { id: "melon", commonName: "Melon", scientificName: "Cucumis melo", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍈" },
  { id: "watermelon", commonName: "Watermelon", scientificName: "Citrullus lanatus", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍉" },
  { id: "pineapple", commonName: "Pineapple", scientificName: "Ananas comosus", category: "tropical", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍍" },

  // ==================== GARDEN FLOWERS / OUTDOOR ====================
  { id: "rose", commonName: "Rose", scientificName: "Rosa spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌹" },
  { id: "sunflower", commonName: "Sunflower", scientificName: "Helianthus annuus", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌻" },
  { id: "tulip", commonName: "Tulip", scientificName: "Tulipa spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌷" },
  { id: "daffodil", commonName: "Daffodil", scientificName: "Narcissus spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌼" },
  { id: "hyacinth", commonName: "Hyacinth", scientificName: "Hyacinthus orientalis", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "crocus", commonName: "Crocus", scientificName: "Crocus spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "iris", commonName: "Iris", scientificName: "Iris spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "lily", commonName: "Lily", scientificName: "Lilium spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "dahlia", commonName: "Dahlia", scientificName: "Dahlia spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "peony", commonName: "Peony", scientificName: "Paeonia spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "petunia", commonName: "Petunia", scientificName: "Petunia spp.", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "marigold", commonName: "Marigold", scientificName: "Tagetes spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌼" },
  { id: "zinnia", commonName: "Zinnia", scientificName: "Zinnia elegans", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "cosmos", commonName: "Cosmos", scientificName: "Cosmos bipinnatus", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "impatiens", commonName: "Impatiens", scientificName: "Impatiens walleriana", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "low", humidity: "high", difficulty: "easy", emoji: "🌸" },
  { id: "pansy", commonName: "Pansy", scientificName: "Viola × wittrockiana", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "viola", commonName: "Viola", scientificName: "Viola spp.", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "snapdragon", commonName: "Snapdragon", scientificName: "Antirrhinum majus", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "chrysanthemum", commonName: "Chrysanthemum", scientificName: "Chrysanthemum spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌼" },
  { id: "hydrangea", commonName: "Hydrangea", scientificName: "Hydrangea macrophylla", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌸" },
  { id: "azalea", commonName: "Azalea", scientificName: "Rhododendron spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌸" },
  { id: "rhododendron", commonName: "Rhododendron", scientificName: "Rhododendron spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌸" },
  { id: "bird-of-paradise-flower", commonName: "Bird of Paradise (Outdoor)", scientificName: "Strelitzia reginae", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "calla-lily", commonName: "Calla Lily", scientificName: "Zantedeschia aethiopica", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌸" },
  { id: "carnation", commonName: "Carnation", scientificName: "Dianthus caryophyllus", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "aster", commonName: "Aster", scientificName: "Aster spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "black-eyed-susan", commonName: "Black-Eyed Susan", scientificName: "Rudbeckia hirta", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌻" },
  { id: "coneflower", commonName: "Coneflower / Echinacea", scientificName: "Echinacea purpurea", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "daisy", commonName: "Daisy", scientificName: "Bellis perennis", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌼" },
  { id: "lantana", commonName: "Lantana", scientificName: "Lantana camara", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "salvia", commonName: "Salvia / Ornamental Sage", scientificName: "Salvia splendens", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "verbena", commonName: "Verbena", scientificName: "Verbena spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "morning-glory", commonName: "Morning Glory", scientificName: "Ipomoea purpurea", category: "vine", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "clematis", commonName: "Clematis", scientificName: "Clematis spp.", category: "vine", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "wisteria", commonName: "Wisteria", scientificName: "Wisteria sinensis", category: "vine", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "bougainvillea", commonName: "Bougainvillea", scientificName: "Bougainvillea spp.", category: "vine", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🌸" },
  { id: "honeysuckle", commonName: "Honeysuckle", scientificName: "Lonicera spp.", category: "vine", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },

  // ==================== GRASSES / ORNAMENTALS ====================
  { id: "bamboo", commonName: "Bamboo", scientificName: "Bambusoideae", category: "foliage", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🎋" },
  { id: "ornamental-grass", commonName: "Ornamental Grass", scientificName: "Various", category: "foliage", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌾" },
  { id: "pampas-grass", commonName: "Pampas Grass", scientificName: "Cortaderia selloana", category: "foliage", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌾" },
  { id: "fountain-grass", commonName: "Fountain Grass", scientificName: "Pennisetum setaceum", category: "foliage", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌾" },
  { id: "liriope", commonName: "Liriope / Monkey Grass", scientificName: "Liriope muscari", category: "foliage", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "mondo-grass", commonName: "Mondo Grass", scientificName: "Ophiopogon japonicus", category: "foliage", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "low", humidity: "medium", difficulty: "easy", emoji: "🌿" },

  // ==================== MORE HERBS ====================
  { id: "fennel", commonName: "Fennel", scientificName: "Foeniculum vulgare", category: "herb", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "chamomile", commonName: "Chamomile", scientificName: "Matricaria chamomilla", category: "herb", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌼" },
  { id: "lemon-balm", commonName: "Lemon Balm", scientificName: "Melissa officinalis", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "catnip", commonName: "Catnip", scientificName: "Nepeta cataria", category: "herb", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌱" },
  { id: "borage", commonName: "Borage", scientificName: "Borago officinalis", category: "herb", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "sorrel", commonName: "Sorrel", scientificName: "Rumex acetosa", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "lovage", commonName: "Lovage", scientificName: "Levisticum officinale", category: "herb", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "hyssop", commonName: "Hyssop", scientificName: "Hyssopus officinalis", category: "herb", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌱" },
  { id: "savory", commonName: "Savory", scientificName: "Satureja hortensis", category: "herb", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌱" },
  { id: "anise", commonName: "Anise", scientificName: "Pimpinella anisum", category: "herb", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌱" },
  { id: "coriander", commonName: "Coriander (Seeds)", scientificName: "Coriandrum sativum", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "cumin", commonName: "Cumin", scientificName: "Cuminum cyminum", category: "herb", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🌱" },
  { id: "ginger", commonName: "Ginger", scientificName: "Zingiber officinale", category: "herb", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌱" },
  { id: "turmeric", commonName: "Turmeric", scientificName: "Curcuma longa", category: "herb", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌱" },
  { id: "cardamom", commonName: "Cardamom", scientificName: "Elettaria cardamomum", category: "herb", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌱" },

  // ==================== OTHER / MISCELLANEOUS ====================
  { id: "venus-flytrap", commonName: "Venus Flytrap", scientificName: "Dionaea muscipula", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "high", difficulty: "expert", emoji: "🪴" },
  { id: "sundew", commonName: "Sundew", scientificName: "Drosera spp.", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "high", difficulty: "expert", emoji: "🪴" },
  { id: "pitcher-plant", commonName: "Pitcher Plant", scientificName: "Sarracenia spp.", category: "other", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "high", difficulty: "expert", emoji: "🪴" },
  { id: "sensitive-plant", commonName: "Sensitive Plant", scientificName: "Mimosa pudica", category: "other", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🪴" },
  { id: "hoya-pubicalyx", commonName: "Hoya Pubicalyx", scientificName: "Hoya pubicalyx", category: "other", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🪴" },
  { id: "hoya-australis", commonName: "Hoya Australis", scientificName: "Hoya australis", category: "other", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🪴" },
  { id: "oxalis-triangularis", commonName: "Purple Shamrock", scientificName: "Oxalis triangularis", category: "other", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🪴" },
  { id: "string-of-nickels", commonName: "String of Nickels", scientificName: "Dischidia nummularia", category: "other", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🪴" },
  { id: "croton-petra", commonName: "Croton Petra", scientificName: "Codiaeum variegatum 'Petra'", category: "other", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "🪴" },
  { id: "hoya-linearis", commonName: "Hoya Linearis", scientificName: "Hoya linearis", category: "other", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🪴" },
  { id: "hoya-obovata", commonName: "Hoya Obovata", scientificName: "Hoya obovata", category: "other", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🪴" },
  { id: "hoya-compacta", commonName: "Hindu Rope Hoya", scientificName: "Hoya carnosa 'Compacta'", category: "other", wateringInterval: { min: 10, ideal: 14, max: 21 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🪴" },

  // ==================== VEGETABLES ====================
  { id: "tomato", commonName: "Tomato", scientificName: "Solanum lycopersicum", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍅" },
  { id: "pepper-bell", commonName: "Bell Pepper", scientificName: "Capsicum annuum", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🫑" },
  { id: "pepper-hot", commonName: "Hot Pepper", scientificName: "Capsicum spp.", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌶️" },
  { id: "cucumber", commonName: "Cucumber", scientificName: "Cucumis sativus", category: "vine", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🥒" },
  { id: "zucchini", commonName: "Zucchini", scientificName: "Cucurbita pepo", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🥒" },
  { id: "squash-butternut", commonName: "Butternut Squash", scientificName: "Cucurbita moschata", category: "vine", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🎃" },
  { id: "pumpkin", commonName: "Pumpkin", scientificName: "Cucurbita maxima", category: "vine", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🎃" },
  { id: "lettuce", commonName: "Lettuce", scientificName: "Lactuca sativa", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🥬" },
  { id: "spinach", commonName: "Spinach", scientificName: "Spinacia oleracea", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🥬" },
  { id: "kale", commonName: "Kale", scientificName: "Brassica oleracea var. sabellica", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🥬" },
  { id: "arugula", commonName: "Arugula", scientificName: "Eruca vesicaria", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🥬" },
  { id: "chard", commonName: "Swiss Chard", scientificName: "Beta vulgaris", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🥬" },
  { id: "broccoli", commonName: "Broccoli", scientificName: "Brassica oleracea var. italica", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🥦" },
  { id: "cauliflower", commonName: "Cauliflower", scientificName: "Brassica oleracea var. botrytis", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🥦" },
  { id: "cabbage", commonName: "Cabbage", scientificName: "Brassica oleracea var. capitata", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🥬" },
  { id: "brussels-sprouts", commonName: "Brussels Sprouts", scientificName: "Brassica oleracea var. gemmifera", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🥬" },
  { id: "carrot", commonName: "Carrot", scientificName: "Daucus carota", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 4 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🥕" },
  { id: "radish", commonName: "Radish", scientificName: "Raphanus sativus", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🥕" },
  { id: "beet", commonName: "Beet", scientificName: "Beta vulgaris", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 4 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🥕" },
  { id: "onion", commonName: "Onion", scientificName: "Allium cepa", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🧅" },
  { id: "garlic", commonName: "Garlic", scientificName: "Allium sativum", category: "herb", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🧄" },
  { id: "leek", commonName: "Leek", scientificName: "Allium ampeloprasum", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 4 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🧅" },
  { id: "celery", commonName: "Celery", scientificName: "Apium graveolens", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🥬" },
  { id: "asparagus", commonName: "Asparagus", scientificName: "Asparagus officinalis", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌱" },
  { id: "eggplant", commonName: "Eggplant", scientificName: "Solanum melongena", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍆" },
  { id: "corn", commonName: "Sweet Corn", scientificName: "Zea mays", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌽" },
  { id: "peas", commonName: "Peas", scientificName: "Pisum sativum", category: "vine", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "green-beans", commonName: "Green Beans", scientificName: "Phaseolus vulgaris", category: "vine", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌱" },

  // ==================== FRUITS ====================
  { id: "strawberry", commonName: "Strawberry", scientificName: "Fragaria × ananassa", category: "herb", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍓" },
  { id: "blueberry", commonName: "Blueberry", scientificName: "Vaccinium corymbosum", category: "tree", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🫐" },
  { id: "raspberry", commonName: "Raspberry", scientificName: "Rubus idaeus", category: "tree", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🫐" },
  { id: "blackberry", commonName: "Blackberry", scientificName: "Rubus fruticosus", category: "vine", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🫐" },
  { id: "grape", commonName: "Grape Vine", scientificName: "Vitis vinifera", category: "vine", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍇" },
  { id: "watermelon", commonName: "Watermelon", scientificName: "Citrullus lanatus", category: "vine", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍉" },
  { id: "cantaloupe", commonName: "Cantaloupe", scientificName: "Cucumis melo", category: "vine", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍈" },
  { id: "fig", commonName: "Fig Tree", scientificName: "Ficus carica", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌳" },
  { id: "apple", commonName: "Apple Tree", scientificName: "Malus domestica", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍎" },
  { id: "pear", commonName: "Pear Tree", scientificName: "Pyrus communis", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍐" },
  { id: "peach", commonName: "Peach Tree", scientificName: "Prunus persica", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍑" },
  { id: "cherry", commonName: "Cherry Tree", scientificName: "Prunus avium", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍒" },
  { id: "plum", commonName: "Plum Tree", scientificName: "Prunus domestica", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍑" },
  { id: "apricot", commonName: "Apricot Tree", scientificName: "Prunus armeniaca", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍑" },
  { id: "avocado", commonName: "Avocado Tree", scientificName: "Persea americana", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🥑" },
  { id: "mango", commonName: "Mango Tree", scientificName: "Mangifera indica", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "🥭" },
  { id: "papaya", commonName: "Papaya Tree", scientificName: "Carica papaya", category: "tree", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "🌳" },
  { id: "banana", commonName: "Banana Plant", scientificName: "Musa spp.", category: "tropical", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "🍌" },
  { id: "pineapple", commonName: "Pineapple", scientificName: "Ananas comosus", category: "tropical", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍍" },
  { id: "coconut", commonName: "Coconut Palm", scientificName: "Cocos nucifera", category: "palm", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "high", difficulty: "expert", emoji: "🥥" },
  { id: "passion-fruit", commonName: "Passion Fruit", scientificName: "Passiflora edulis", category: "vine", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "🌸" },
  { id: "kiwi", commonName: "Kiwi Vine", scientificName: "Actinidia deliciosa", category: "vine", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🥝" },
  { id: "pomegranate", commonName: "Pomegranate", scientificName: "Punica granatum", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 14 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌳" },

  // ==================== CITRUS ====================
  { id: "lemon", commonName: "Lemon Tree", scientificName: "Citrus limon", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍋" },
  { id: "lime", commonName: "Lime Tree", scientificName: "Citrus aurantiifolia", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍋" },
  { id: "orange", commonName: "Orange Tree", scientificName: "Citrus sinensis", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍊" },
  { id: "grapefruit", commonName: "Grapefruit Tree", scientificName: "Citrus × paradisi", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍊" },
  { id: "tangerine", commonName: "Tangerine Tree", scientificName: "Citrus reticulata", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍊" },
  { id: "kumquat", commonName: "Kumquat", scientificName: "Citrus japonica", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🍊" },
  { id: "calamondin", commonName: "Calamondin Orange", scientificName: "Citrus × microcarpa", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🍊" },

  // ==================== MORE HERBS & SPICES ====================
  { id: "turmeric", commonName: "Turmeric", scientificName: "Curcuma longa", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌱" },
  { id: "ginger", commonName: "Ginger", scientificName: "Zingiber officinale", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌱" },
  { id: "cardamom", commonName: "Cardamom", scientificName: "Elettaria cardamomum", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "high", difficulty: "expert", emoji: "🌱" },
  { id: "lemongrass", commonName: "Lemongrass", scientificName: "Cymbopogon citratus", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌱" },
  { id: "bay-laurel", commonName: "Bay Laurel", scientificName: "Laurus nobilis", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "stevia", commonName: "Stevia", scientificName: "Stevia rebaudiana", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌱" },
  { id: "fennel", commonName: "Fennel", scientificName: "Foeniculum vulgare", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "tarragon", commonName: "Tarragon", scientificName: "Artemisia dracunculus", category: "herb", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "low", difficulty: "moderate", emoji: "🌿" },
  { id: "sorrel", commonName: "Sorrel", scientificName: "Rumex acetosa", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌿" },
  { id: "lovage", commonName: "Lovage", scientificName: "Levisticum officinale", category: "herb", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌿" },

  // ==================== GARDEN FLOWERS ====================
  { id: "rose", commonName: "Rose", scientificName: "Rosa spp.", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌹" },
  { id: "tulip", commonName: "Tulip", scientificName: "Tulipa spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌷" },
  { id: "sunflower", commonName: "Sunflower", scientificName: "Helianthus annuus", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌻" },
  { id: "daisy", commonName: "Daisy", scientificName: "Bellis perennis", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌼" },
  { id: "marigold", commonName: "Marigold", scientificName: "Tagetes spp.", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌼" },
  { id: "petunia", commonName: "Petunia", scientificName: "Petunia × atkinsiana", category: "flowering", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "geranium", commonName: "Geranium", scientificName: "Pelargonium spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌺" },
  { id: "impatiens", commonName: "Impatiens", scientificName: "Impatiens walleriana", category: "flowering", wateringInterval: { min: 1, ideal: 2, max: 3 }, sunlight: "low", humidity: "high", difficulty: "easy", emoji: "🌸" },
  { id: "pansy", commonName: "Pansy", scientificName: "Viola × wittrockiana", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "zinnia", commonName: "Zinnia", scientificName: "Zinnia elegans", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "cosmos", commonName: "Cosmos", scientificName: "Cosmos bipinnatus", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "dahlia", commonName: "Dahlia", scientificName: "Dahlia spp.", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "chrysanthemum", commonName: "Chrysanthemum", scientificName: "Chrysanthemum spp.", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "carnation", commonName: "Carnation", scientificName: "Dianthus caryophyllus", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "lily", commonName: "Lily", scientificName: "Lilium spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "hydrangea", commonName: "Hydrangea", scientificName: "Hydrangea macrophylla", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌸" },
  { id: "peony", commonName: "Peony", scientificName: "Paeonia spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "iris", commonName: "Iris", scientificName: "Iris spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "daffodil", commonName: "Daffodil", scientificName: "Narcissus spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌼" },
  { id: "hyacinth", commonName: "Hyacinth", scientificName: "Hyacinthus orientalis", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "crocus", commonName: "Crocus", scientificName: "Crocus spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "ranunculus", commonName: "Ranunculus", scientificName: "Ranunculus asiaticus", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "anemone", commonName: "Anemone", scientificName: "Anemone spp.", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "foxglove", commonName: "Foxglove", scientificName: "Digitalis purpurea", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "delphinium", commonName: "Delphinium", scientificName: "Delphinium spp.", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "snapdragon", commonName: "Snapdragon", scientificName: "Antirrhinum majus", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "lavender", commonName: "Lavender", scientificName: "Lavandula angustifolia", category: "flowering", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "💜" },
  { id: "salvia", commonName: "Salvia", scientificName: "Salvia spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "verbena", commonName: "Verbena", scientificName: "Verbena spp.", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "lantana", commonName: "Lantana", scientificName: "Lantana camara", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "hibiscus", commonName: "Hibiscus", scientificName: "Hibiscus rosa-sinensis", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "high", difficulty: "moderate", emoji: "🌺" },
  { id: "bougainvillea", commonName: "Bougainvillea", scientificName: "Bougainvillea spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 14 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌺" },
  { id: "plumeria", commonName: "Plumeria", scientificName: "Plumeria spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "jasmine", commonName: "Jasmine", scientificName: "Jasminum spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "gardenia", commonName: "Gardenia", scientificName: "Gardenia jasminoides", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "high", difficulty: "expert", emoji: "🌸" },
  { id: "camellia", commonName: "Camellia", scientificName: "Camellia japonica", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌸" },
  { id: "azalea", commonName: "Azalea", scientificName: "Rhododendron spp.", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌸" },
  { id: "rhododendron", commonName: "Rhododendron", scientificName: "Rhododendron spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "high", difficulty: "moderate", emoji: "🌸" },
  { id: "magnolia", commonName: "Magnolia", scientificName: "Magnolia spp.", category: "tree", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "lilac", commonName: "Lilac", scientificName: "Syringa vulgaris", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "💜" },
  { id: "wisteria", commonName: "Wisteria", scientificName: "Wisteria sinensis", category: "vine", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "💜" },
  { id: "clematis", commonName: "Clematis", scientificName: "Clematis spp.", category: "vine", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "morning-glory", commonName: "Morning Glory", scientificName: "Ipomoea purpurea", category: "vine", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "sweet-pea", commonName: "Sweet Pea", scientificName: "Lathyrus odoratus", category: "vine", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "black-eyed-susan", commonName: "Black-Eyed Susan", scientificName: "Rudbeckia hirta", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌻" },
  { id: "coneflower", commonName: "Coneflower", scientificName: "Echinacea purpurea", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "blanket-flower", commonName: "Blanket Flower", scientificName: "Gaillardia spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌼" },
  { id: "coreopsis", commonName: "Coreopsis", scientificName: "Coreopsis spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌼" },
  { id: "aster", commonName: "Aster", scientificName: "Aster spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "sedum-flowering", commonName: "Stonecrop (Flowering)", scientificName: "Sedum spectabile", category: "flowering", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "yarrow", commonName: "Yarrow", scientificName: "Achillea millefolium", category: "flowering", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "catmint", commonName: "Catmint", scientificName: "Nepeta spp.", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "💜" },
  { id: "russian-sage", commonName: "Russian Sage", scientificName: "Perovskia atriplicifolia", category: "flowering", wateringInterval: { min: 7, ideal: 10, max: 14 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "💜" },
  { id: "bee-balm", commonName: "Bee Balm", scientificName: "Monarda didyma", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "phlox", commonName: "Phlox", scientificName: "Phlox paniculata", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "hollyhock", commonName: "Hollyhock", scientificName: "Alcea rosea", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌸" },
  { id: "liatris", commonName: "Blazing Star", scientificName: "Liatris spicata", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "💜" },
  { id: "helenium", commonName: "Sneezeweed", scientificName: "Helenium autumnale", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌼" },
  { id: "agapanthus", commonName: "African Lily", scientificName: "Agapanthus africanus", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "💜" },
  { id: "bird-of-paradise", commonName: "Bird of Paradise", scientificName: "Strelitzia reginae", category: "flowering", wateringInterval: { min: 5, ideal: 7, max: 10 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌺" },
  { id: "canna", commonName: "Canna Lily", scientificName: "Canna indica", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "high", humidity: "high", difficulty: "easy", emoji: "🌺" },
  { id: "gladiolus", commonName: "Gladiolus", scientificName: "Gladiolus spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "crocosmia", commonName: "Crocosmia", scientificName: "Crocosmia spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "medium", difficulty: "easy", emoji: "🌺" },
  { id: "dianthus", commonName: "Dianthus", scientificName: "Dianthus spp.", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "high", humidity: "low", difficulty: "easy", emoji: "🌸" },
  { id: "primrose", commonName: "Primrose", scientificName: "Primula vulgaris", category: "flowering", wateringInterval: { min: 2, ideal: 3, max: 5 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
  { id: "cyclamen", commonName: "Cyclamen", scientificName: "Cyclamen persicum", category: "flowering", wateringInterval: { min: 3, ideal: 5, max: 7 }, sunlight: "medium", humidity: "medium", difficulty: "moderate", emoji: "🌸" },
];

/**
 * Search plants by name (common name, scientific name).
 * Uses fuzzy matching for better UX.
 */
export function searchPlants(query: string, limit = 50): PlantSpecies[] {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return PLANT_DATABASE.slice(0, limit);
  }

  // Split query into words for multi-word matching
  const queryWords = normalizedQuery.split(/\s+/);

  // Score each plant based on how well it matches
  const scored = PLANT_DATABASE.map(plant => {
    const commonName = plant.commonName.toLowerCase();
    const scientificName = (plant.scientificName || "").toLowerCase();
    const category = plant.category.toLowerCase();

    let score = 0;

    // Exact match gets highest score
    if (commonName === normalizedQuery || scientificName === normalizedQuery) {
      score = 1000;
    }
    // Starts with query gets high score
    else if (commonName.startsWith(normalizedQuery) || scientificName.startsWith(normalizedQuery)) {
      score = 500;
    }
    // Contains query gets medium score
    else if (commonName.includes(normalizedQuery) || scientificName.includes(normalizedQuery)) {
      score = 200;
    }
    // All query words match (for multi-word queries like "snake plant")
    else if (queryWords.every(word => commonName.includes(word) || scientificName.includes(word))) {
      score = 150;
    }
    // Any query word matches
    else if (queryWords.some(word => commonName.includes(word) || scientificName.includes(word) || category.includes(word))) {
      score = 50;
    }

    // Bonus for word boundary matches (e.g., "pot" matches "pothos" at word start)
    if (queryWords.some(word => {
      const wordRegex = new RegExp(`\\b${escapeRegExp(word)}`, 'i');
      return wordRegex.test(commonName) || wordRegex.test(scientificName);
    })) {
      score += 25;
    }

    return { plant, score };
  });

  // Filter to only matches and sort by score
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ plant }) => plant);
}

/**
 * Get a plant by its ID.
 */
export function getPlantById(id: string): PlantSpecies | undefined {
  return PLANT_DATABASE.find(plant => plant.id === id);
}

/**
 * Get plants by category.
 */
export function getPlantsByCategory(category: PlantCategory): PlantSpecies[] {
  return PLANT_DATABASE.filter(plant => plant.category === category);
}

/**
 * Get all unique categories from the database.
 */
export function getAllCategories(): PlantCategory[] {
  const categories = new Set(PLANT_DATABASE.map(plant => plant.category));
  return Array.from(categories);
}

/**
 * Escape special regex characters.
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Total count of plants in database.
 */
export const TOTAL_PLANTS = PLANT_DATABASE.length;
