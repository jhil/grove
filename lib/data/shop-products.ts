/**
 * Plant care products for the shop page.
 * Each product has an affiliate link placeholder.
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
  // Watering
  {
    id: "brass-watering-can",
    name: "Brass Watering Can",
    description: "Elegant brass watering can with long spout for precise watering. Perfect for indoor plants.",
    price: "$68",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    category: "watering",
    affiliateUrl: "#",
    featured: true,
  },
  {
    id: "copper-mister",
    name: "Copper Plant Mister",
    description: "Fine mist sprayer in brushed copper. Ideal for humidity-loving tropicals.",
    price: "$34",
    image: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&q=80",
    category: "watering",
    affiliateUrl: "#",
  },
  {
    id: "self-watering-globe",
    name: "Self-Watering Globes",
    description: "Set of 4 hand-blown glass globes for gradual watering while away.",
    price: "$28",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    category: "watering",
    affiliateUrl: "#",
  },
  {
    id: "terracotta-spout",
    name: "Terracotta Watering Spout",
    description: "Attach to any bottle for controlled watering. Handmade terracotta.",
    price: "$12",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
    category: "watering",
    affiliateUrl: "#",
  },

  // Tools
  {
    id: "pruning-shears",
    name: "Japanese Pruning Shears",
    description: "Precision carbon steel shears for clean cuts. Leather holster included.",
    price: "$45",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    category: "tools",
    affiliateUrl: "#",
    featured: true,
  },
  {
    id: "soil-knife",
    name: "Hori Hori Garden Knife",
    description: "Versatile Japanese digging tool with depth markers. Stainless steel.",
    price: "$38",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80",
    category: "tools",
    affiliateUrl: "#",
  },
  {
    id: "bamboo-stakes",
    name: "Bamboo Plant Stakes",
    description: "Set of 25 natural bamboo stakes in varying heights for support.",
    price: "$16",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    category: "tools",
    affiliateUrl: "#",
  },
  {
    id: "moisture-meter",
    name: "Analog Soil Moisture Meter",
    description: "No batteries needed. Know exactly when to water your plants.",
    price: "$14",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80",
    category: "tools",
    affiliateUrl: "#",
  },

  // Planters
  {
    id: "ceramic-planter",
    name: "Handmade Ceramic Planter",
    description: "Artisan-crafted planter with drainage hole. Speckled glaze finish.",
    price: "$52",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
    category: "planters",
    affiliateUrl: "#",
    featured: true,
  },
  {
    id: "terracotta-set",
    name: "Terracotta Pot Set",
    description: "Set of 3 classic terracotta pots with saucers. Timeless design.",
    price: "$36",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    category: "planters",
    affiliateUrl: "#",
  },
  {
    id: "concrete-planter",
    name: "Concrete Geometric Planter",
    description: "Modern concrete planter with clean lines. Indoor/outdoor use.",
    price: "$44",
    image: "https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&q=80",
    category: "planters",
    affiliateUrl: "#",
  },
  {
    id: "hanging-planter",
    name: "Macramé Hanging Planter",
    description: "Hand-woven cotton macramé with brass ring. 40\" length.",
    price: "$28",
    image: "https://images.unsplash.com/photo-1463320898484-cdee8141c787?w=800&q=80",
    category: "planters",
    affiliateUrl: "#",
  },

  // Plant Care
  {
    id: "plant-food",
    name: "Organic Plant Food",
    description: "Balanced NPK formula for all houseplants. Easy-pour bottle.",
    price: "$18",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80",
    category: "care",
    affiliateUrl: "#",
  },
  {
    id: "neem-oil",
    name: "Cold-Pressed Neem Oil",
    description: "Natural pest control and leaf shine. Safe for all plants.",
    price: "$15",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    category: "care",
    affiliateUrl: "#",
  },
  {
    id: "potting-mix",
    name: "Premium Potting Mix",
    description: "Well-draining blend with perlite and bark. 8 quart bag.",
    price: "$22",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80",
    category: "care",
    affiliateUrl: "#",
  },
  {
    id: "rooting-hormone",
    name: "Rooting Hormone Gel",
    description: "Promotes root growth for cuttings and propagation.",
    price: "$12",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    category: "care",
    affiliateUrl: "#",
  },

  // Accessories
  {
    id: "gardening-gloves",
    name: "Leather Garden Gloves",
    description: "Soft goatskin leather with canvas cuff. Excellent grip and protection.",
    price: "$32",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
    category: "accessories",
    affiliateUrl: "#",
    featured: true,
  },
  {
    id: "plant-labels",
    name: "Copper Plant Labels",
    description: "Set of 10 elegant copper labels with marker. Weather-resistant.",
    price: "$24",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
    category: "accessories",
    affiliateUrl: "#",
  },
  {
    id: "apron",
    name: "Canvas Garden Apron",
    description: "Durable waxed canvas with tool pockets. Adjustable straps.",
    price: "$48",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80",
    category: "accessories",
    affiliateUrl: "#",
  },
  {
    id: "plant-stand",
    name: "Walnut Plant Stand",
    description: "Mid-century modern stand in solid walnut. Fits pots up to 10\".",
    price: "$58",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
    category: "accessories",
    affiliateUrl: "#",
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
