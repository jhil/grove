/**
 * Plant care products for the shop page.
 * Curated recommendations from Wirecutter, r/BuyItForLife, and expert reviews.
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: "watering" | "tools" | "planters" | "care" | "accessories";
  affiliateUrl: string;
  featured?: boolean;
}

export const SHOP_PRODUCTS: Product[] = [
  // Watering - Featured
  {
    id: "ikea-vattenkrasse",
    name: "IKEA VATTENKRASSE Watering Can",
    description: "Beautiful green and gold steel watering can. Long spout for precise watering. 68 oz capacity.",
    price: "$15",
    image: "https://www.ikea.com/us/en/images/products/vattenkrasse-watering-can-black-green-gold__1227734_pe915652_s5.jpg",
    category: "watering",
    affiliateUrl: "https://www.ikea.com/us/en/p/vattenkrasse-watering-can-black-green-gold-50561989/",
    featured: true,
  },
  {
    id: "oxo-indoor-watering-can",
    name: "OXO Good Grips Mini Pour & Store",
    description: "Wirecutter pick. Compact design with rotating spout and 1-quart capacity. Easy water flow control.",
    price: "$11",
    image: "https://www.toolboxsupply.com/cdn/shop/products/BloemEZPWCEasyPourWateringCanGallonjpg.jpg?v=1635484208",
    category: "watering",
    affiliateUrl: "https://www.amazon.com/OXO-Grips-Store-Watering-1-06-quart/dp/B000OXA288",
    featured: true,
  },
  {
    id: "bloem-easy-pour",
    name: "Bloem Easy Pour Watering Can",
    description: "Wirecutter top pick. Twin handles make filling and pouring easy. 2.6 gallon capacity.",
    price: "$17",
    image: "https://www.toolboxsupply.com/cdn/shop/products/BloemEZPWCEasyPourWateringCanGallonjpg.jpg?v=1635484208",
    category: "watering",
    affiliateUrl: "https://www.amazon.com/Bloem-Watering-Gallon-Black-20-47287CP/dp/B0029D6NZC",
  },
  {
    id: "haws-brass-mister",
    name: "Haws Brass Plant Mister",
    description: "Fine mist sprayer in solid brass. English-made quality. Ideal for tropicals and ferns.",
    price: "$45",
    image: "https://gardenheir.com/cdn/shop/files/Haws-Smethwick-Mister-Spritzer-Copper-1_5c614774-8088-4610-8c34-ec7a88773df4.jpg?v=1697480813",
    category: "watering",
    affiliateUrl: "https://www.amazon.com/Haws-10-Ounce-Plant-Mister-Brass/dp/B004PV1U72",
  },

  // Tools
  {
    id: "felco-f2",
    name: "Felco F-2 Classic Pruning Shears",
    description: "The gold standard. Swiss-made since 1948. Replaceable parts last decades. r/BuyItForLife favorite.",
    price: "$65",
    image: "https://america.felco.com/cdn/shop/files/FELCO_2_3e1e0802-1e12-4aee-9ca1-7f8415e30183.png?v=1765522955",
    category: "tools",
    affiliateUrl: "https://www.amazon.com/Felco-Pruning-Shears-Professional-Replaceable/dp/B00023RYS6",
    featured: true,
  },
  {
    id: "okatsune-103",
    name: "Okatsune 103 Bypass Pruners",
    description: "Japanese precision. Incredibly sharp carbon steel blades. Favorite of professional gardeners.",
    price: "$32",
    image: "https://hardwickandsons.com/cdn/shop/products/Okasuna_Pruner_Main_lg.jpg?v=1492015182",
    category: "tools",
    affiliateUrl: "https://www.amazon.com/Okatsune-Bypass-Pruners-General-Purpose/dp/B001Y54F88",
  },
  {
    id: "hori-hori",
    name: "Nisaku Hori Hori Garden Knife",
    description: "Japanese digging tool with depth markers. Stainless steel. The one tool you'll use for everything.",
    price: "$38",
    image: "https://www.gardentoolcompany.com/cdn/shop/files/hori-hori-garden-knife-x1_64b2b03d-a5d3-4cdc-9394-1f23bc27c685.jpg?v=1716316340",
    category: "tools",
    affiliateUrl: "https://www.amazon.com/Original-Namibagata-Japanese-Stainless-7-25-Inch/dp/B0007WFG2I",
  },
  {
    id: "xlux-moisture-meter",
    name: "XLUX Soil Moisture Meter",
    description: "No batteries needed. Instant readings on 10-point scale. Simple and accurate.",
    price: "$13",
    image: "https://www.bloomspace.co/cdn/shop/products/054_0526s_2400x_03ac35f2-3a65-47e6-a9c7-9f1ecf2a78e3.jpg?v=1752382179",
    category: "tools",
    affiliateUrl: "https://www.amazon.com/XLUX-Soil-Moisture-Sensor-Meter/dp/B014MJ8J2U",
  },
  {
    id: "sustee-aquameter",
    name: "Sustee Aquameter",
    description: "Leave-in moisture indicator. Blue when moist, white when dry. Replace core every 6-9 months.",
    price: "$12",
    image: "https://www.bloomspace.co/cdn/shop/products/054_0526s_2400x_03ac35f2-3a65-47e6-a9c7-9f1ecf2a78e3.jpg?v=1752382179",
    category: "tools",
    affiliateUrl: "https://www.amazon.com/Sustee-Aquameter-Plant-Moisture-Sensor/dp/B076CGZGJ8",
  },

  // Planters
  {
    id: "terracotta-set",
    name: "INGOFIN Terracotta Pots (Set of 3)",
    description: "Classic terracotta with saucers and drainage holes. 5\", 6\", and 7\" sizes.",
    price: "$28",
    image: "https://www.magicvalleygardens.com/cdn/shop/products/CLASSICOLS21silvermetallic_5917562b-1d68-429b-826b-b909184b221e.png?v=1665598070",
    category: "planters",
    affiliateUrl: "https://www.amazon.com/INGOFIN-Terracotta-Pots-Set-Saucer/dp/B0B8HDQYN7",
  },
  {
    id: "lechuza-classico",
    name: "Lechuza Classico Self-Watering Planter",
    description: "German-engineered sub-irrigation system. Perfect for beginners or frequent travelers.",
    price: "$45",
    image: "https://www.magicvalleygardens.com/cdn/shop/products/CLASSICOLS21silvermetallic_5917562b-1d68-429b-826b-b909184b221e.png?v=1665598070",
    category: "planters",
    affiliateUrl: "https://www.amazon.com/Lechuza-Classico-Color-Planter-White/dp/B00DNUSG8W",
    featured: true,
  },
  {
    id: "mkono-plant-stand",
    name: "Mkono Mid Century Plant Stand",
    description: "Wood construction. Adjustable width fits pots 8-12\". Elegant and sturdy.",
    price: "$25",
    image: "https://hardwickandsons.com/cdn/shop/products/Okasuna_Pruner_Main_lg.jpg?v=1492015182",
    category: "planters",
    affiliateUrl: "https://www.amazon.com/Mkono-Century-Display-Planter-Included/dp/B0793K2B7Q",
  },
  {
    id: "hanging-planter-macrame",
    name: "Mkono Macrame Plant Hangers (Set of 4)",
    description: "Hand-woven cotton rope. Different lengths for layered displays. Holds up to 7\" pots.",
    price: "$16",
    image: "https://gardenheir.com/cdn/shop/files/Haws-Smethwick-Mister-Spritzer-Copper-1_5c614774-8088-4610-8c34-ec7a88773df4.jpg?v=1697480813",
    category: "planters",
    affiliateUrl: "https://www.amazon.com/Mkono-Macrame-Hangers-Hanging-Planter/dp/B07FMHHZ8J",
  },

  // Plant Care
  {
    id: "dynagro-foliage-pro",
    name: "Dyna-Gro Foliage Pro",
    description: "Reddit's top pick. Complete nutrition with micro and trace elements. No odor. Dilute and use.",
    price: "$16",
    image: "https://thelandscaperstore.com/cdn/shop/files/IMG_0197_large.webp?v=1740785727",
    category: "care",
    affiliateUrl: "https://www.amazon.com/Dyna-Gro-DYFOL008-Foliage-Pro-White/dp/B003SUT6VS",
  },
  {
    id: "jacks-classic-fertilizer",
    name: "Jack's Classic 20-20-20 Fertilizer",
    description: "Best all-purpose pick from Bob Vila testing. Balanced formula works for all houseplants.",
    price: "$18",
    image: "https://thelandscaperstore.com/cdn/shop/files/IMG_0197_large.webp?v=1740785727",
    category: "care",
    affiliateUrl: "https://www.amazon.com/Peters-Classic-20-20-20-Purpose-Fertilizer/dp/B00BIO560G",
  },
  {
    id: "foxfarm-ocean-forest",
    name: "FoxFarm Ocean Forest Potting Soil",
    description: "The cult favorite. Aged forest products, earthworm castings, and bat guano. Ready to use.",
    price: "$22",
    image: "https://shop.fifthseasongardening.com/cdn/shop/products/0ce74e70ee37ada670b775012a9f0ac0_703e370e-0e1a-4fb5-9c24-8fbc29b6a166_1024x.png?v=1611778693",
    category: "care",
    affiliateUrl: "https://www.amazon.com/FoxFarm-Ocean-Forest-Potting-Soil/dp/B007C9QKCO",
  },
  {
    id: "neem-oil-organic",
    name: "Neem Bliss Pure Neem Oil",
    description: "Cold-pressed 100% pure neem oil. Natural pest control and leaf shine. Safe for all plants.",
    price: "$15",
    image: "https://shop.fifthseasongardening.com/cdn/shop/products/0ce74e70ee37ada670b775012a9f0ac0_703e370e-0e1a-4fb5-9c24-8fbc29b6a166_1024x.png?v=1611778693",
    category: "care",
    affiliateUrl: "https://www.amazon.com/Organic-Neem-Bliss-100-Pressed/dp/B0716JF8MB",
  },
  {
    id: "clonex-rooting-gel",
    name: "Clonex Rooting Gel",
    description: "Industry standard for propagation. Seals cut tissue and provides hormones for root growth.",
    price: "$18",
    image: "https://america.felco.com/cdn/shop/files/FELCO_2_3e1e0802-1e12-4aee-9ca1-7f8415e30183.png?v=1765522955",
    category: "care",
    affiliateUrl: "https://www.amazon.com/HydroDynamics-Clonex-Rooting-Gel-100/dp/B004Q3NN4W",
  },

  // Accessories
  {
    id: "bionic-gloves",
    name: "Bionic ReliefGrip Garden Gloves",
    description: "Orthopedic design reduces hand fatigue. Padded palm. Machine washable. Great for arthritis.",
    price: "$35",
    image: "https://america.felco.com/cdn/shop/files/FELCO_2_3e1e0802-1e12-4aee-9ca1-7f8415e30183.png?v=1765522955",
    category: "accessories",
    affiliateUrl: "https://www.amazon.com/Bionic-Womans-Relief-Gardening-Gloves/dp/B009KTJFLM",
  },
  {
    id: "worm-castings",
    name: "Wiggle Worm Pure Worm Castings",
    description: "Organic soil amendment. No smell. Scratch into topsoil once a year. 15 lb bag.",
    price: "$30",
    image: "https://shop.fifthseasongardening.com/cdn/shop/products/0ce74e70ee37ada670b775012a9f0ac0_703e370e-0e1a-4fb5-9c24-8fbc29b6a166_1024x.png?v=1611778693",
    category: "accessories",
    affiliateUrl: "https://www.amazon.com/Wiggle-Worm-100-Organic-Castings/dp/B00062KQ42",
  },
  {
    id: "copper-plant-labels",
    name: "KINGLAKE Copper Plant Labels (30 Pack)",
    description: "Weatherproof copper tags with ties. Perfect for indoor and outdoor use.",
    price: "$14",
    image: "https://www.gardentoolcompany.com/cdn/shop/files/hori-hori-garden-knife-x1_64b2b03d-a5d3-4cdc-9394-1f23bc27c685.jpg?v=1716316340",
    category: "accessories",
    affiliateUrl: "https://www.amazon.com/KINGLAKE-Copper-Labels-Re-Usable-Garden/dp/B01IHG2V2S",
  },
];

export const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "watering", label: "Watering" },
  { id: "tools", label: "Tools" },
  { id: "planters", label: "Planters" },
  { id: "care", label: "Plant Care" },
  { id: "accessories", label: "Accessories" },
] as const;
