/**
 * Watering frequency recommendations based on plant types and conditions.
 * This is a simple knowledge base - no API keys needed.
 */

// Base recommendations by plant type (in days)
export const WATERING_RECOMMENDATIONS: Record<
  string,
  {
    min: number;
    max: number;
    ideal: number;
    tips: string[];
    factors: string[];
  }
> = {
  succulent: {
    min: 10,
    max: 21,
    ideal: 14,
    tips: [
      "Let soil dry completely between waterings",
      "Water less in winter months",
      "Overwatering is the #1 killer of succulents",
      "When in doubt, wait another few days",
    ],
    factors: [
      "Smaller pots dry faster",
      "Terracotta pots dry faster than plastic",
      "More light = more water needed",
    ],
  },
  tropical: {
    min: 5,
    max: 10,
    ideal: 7,
    tips: [
      "Keep soil consistently moist but not soggy",
      "Mist leaves regularly for humidity",
      "Yellow leaves often mean overwatering",
      "Brown leaf tips may indicate low humidity",
    ],
    factors: [
      "Higher humidity = less frequent watering",
      "Air conditioning dries plants faster",
      "Larger leaves lose more water",
    ],
  },
  fern: {
    min: 2,
    max: 5,
    ideal: 3,
    tips: [
      "Keep soil evenly moist at all times",
      "Mist frequently - ferns love humidity",
      "Never let soil dry out completely",
      "Brown, crispy fronds indicate underwatering",
    ],
    factors: [
      "Bathrooms are great for ferns (humidity!)",
      "Check soil moisture daily",
      "Smaller ferns may need daily watering",
    ],
  },
  cactus: {
    min: 14,
    max: 35,
    ideal: 21,
    tips: [
      "Water thoroughly, then let dry completely",
      "Almost stop watering in winter",
      "Better underwater than overwater",
      "Water around the base, not on the cactus",
    ],
    factors: [
      "Desert cacti need less water than jungle cacti",
      "Dormant in winter - reduce watering 75%",
      "Small pots dry faster",
    ],
  },
  herb: {
    min: 1,
    max: 3,
    ideal: 2,
    tips: [
      "Most herbs prefer consistently moist soil",
      "Don't let them wilt between waterings",
      "Morning watering is best",
      "Good drainage is essential",
    ],
    factors: [
      "Hot weather = daily watering",
      "Indoor herbs may need less frequent watering",
      "Harvest regularly to encourage growth",
    ],
  },
  flowering: {
    min: 3,
    max: 7,
    ideal: 4,
    tips: [
      "Keep soil moist during flowering",
      "Avoid getting water on flowers",
      "Wilting flowers may need more water",
      "Reduce watering after flowering ends",
    ],
    factors: [
      "Blooming plants need more water",
      "Temperature affects watering needs",
      "Check soil before watering",
    ],
  },
  tree: {
    min: 5,
    max: 14,
    ideal: 7,
    tips: [
      "Deep, infrequent watering encourages root growth",
      "Let top inch of soil dry between waterings",
      "Water slowly to ensure deep penetration",
      "Yellow leaves may indicate overwatering",
    ],
    factors: [
      "Pot size significantly affects frequency",
      "Larger trees need more water",
      "Growth rate affects water needs",
    ],
  },
  vine: {
    min: 4,
    max: 8,
    ideal: 5,
    tips: [
      "Check soil moisture regularly",
      "Trailing plants lose water through leaves",
      "Mist leaves weekly",
      "Don't let soil dry out completely",
    ],
    factors: [
      "More leaves = more water needed",
      "Length of vines affects watering",
      "Growing vines need more water",
    ],
  },
  other: {
    min: 5,
    max: 10,
    ideal: 7,
    tips: [
      "Start with weekly watering and adjust",
      "Check soil moisture before watering",
      "Most plants like to dry out slightly between waterings",
      "Observe your plant for signs of stress",
    ],
    factors: [
      "Light levels affect water needs",
      "Pot material affects drying time",
      "Season affects watering frequency",
    ],
  },
};

/**
 * Get watering recommendation for a plant type.
 */
export function getWateringRecommendation(type: string) {
  return WATERING_RECOMMENDATIONS[type] || WATERING_RECOMMENDATIONS.other;
}

/**
 * Get a random tip for a plant type.
 */
export function getRandomWateringTip(type: string): string {
  const recommendation = getWateringRecommendation(type);
  const allTips = [...recommendation.tips, ...recommendation.factors];
  return allTips[Math.floor(Math.random() * allTips.length)];
}

/**
 * Check if current watering interval is within recommended range.
 */
export function isIntervalRecommended(
  type: string,
  interval: number
): { isRecommended: boolean; suggestion: string | null } {
  const rec = getWateringRecommendation(type);

  if (interval >= rec.min && interval <= rec.max) {
    return { isRecommended: true, suggestion: null };
  }

  if (interval < rec.min) {
    return {
      isRecommended: false,
      suggestion: `This seems frequent for a ${type}. Consider watering every ${rec.ideal} days instead.`,
    };
  }

  return {
    isRecommended: false,
    suggestion: `This might be too infrequent for a ${type}. Consider watering every ${rec.ideal} days.`,
  };
}
