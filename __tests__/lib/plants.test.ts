import { describe, it, expect } from "vitest";
import {
  searchPlants,
  getPlantById,
  getPlantsByCategory,
  getAllCategories,
  PLANT_DATABASE,
  TOTAL_PLANTS,
} from "@/lib/data/plants";

describe("Plant Database", () => {
  describe("searchPlants", () => {
    it("returns plants matching common name", () => {
      const results = searchPlants("monstera");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].commonName.toLowerCase()).toContain("monstera");
    });

    it("returns plants matching scientific name", () => {
      const results = searchPlants("Epipremnum");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((p) => p.scientificName?.includes("Epipremnum"))).toBe(true);
    });

    it("handles fuzzy search with partial words", () => {
      const results = searchPlants("pot");
      expect(results.length).toBeGreaterThan(0);
      // Should match "Pothos"
      expect(results.some((p) => p.commonName.toLowerCase().includes("pothos"))).toBe(true);
    });

    it("returns default list when query is empty", () => {
      const results = searchPlants("");
      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(50);
    });

    it("respects limit parameter", () => {
      const results = searchPlants("plant", 5);
      expect(results.length).toBeLessThanOrEqual(5);
    });

    it("returns empty array for nonsense query", () => {
      const results = searchPlants("xyzabc123");
      expect(results).toHaveLength(0);
    });
  });

  describe("getPlantById", () => {
    it("returns correct plant by ID", () => {
      const plant = getPlantById("monstera-deliciosa");
      expect(plant).toBeDefined();
      expect(plant?.commonName).toBe("Monstera");
    });

    it("returns undefined for invalid ID", () => {
      const plant = getPlantById("not-a-real-plant");
      expect(plant).toBeUndefined();
    });
  });

  describe("getPlantsByCategory", () => {
    it("returns plants filtered by category", () => {
      const succulents = getPlantsByCategory("succulent");
      expect(succulents.length).toBeGreaterThan(0);
      expect(succulents.every((p) => p.category === "succulent")).toBe(true);
    });

    it("returns empty array for invalid category", () => {
      const results = getPlantsByCategory("invalid" as never);
      expect(results).toHaveLength(0);
    });
  });

  describe("getAllCategories", () => {
    it("returns all unique categories", () => {
      const categories = getAllCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain("succulent");
      expect(categories).toContain("tropical");
      expect(categories).toContain("fern");
    });
  });

  describe("Database integrity", () => {
    it("has the expected number of plants", () => {
      expect(TOTAL_PLANTS).toBeGreaterThan(150);
      expect(PLANT_DATABASE.length).toBe(TOTAL_PLANTS);
    });

    it("all plants have required fields", () => {
      PLANT_DATABASE.forEach((plant) => {
        expect(plant.id).toBeTruthy();
        expect(plant.commonName).toBeTruthy();
        expect(plant.category).toBeTruthy();
        expect(plant.wateringInterval).toBeDefined();
        expect(plant.wateringInterval.min).toBeLessThanOrEqual(plant.wateringInterval.ideal);
        expect(plant.wateringInterval.ideal).toBeLessThanOrEqual(plant.wateringInterval.max);
        expect(plant.sunlight).toMatch(/^(low|medium|high)$/);
        expect(plant.humidity).toMatch(/^(low|medium|high)$/);
        expect(plant.difficulty).toMatch(/^(easy|moderate|expert)$/);
        expect(plant.emoji).toBeTruthy();
      });
    });

    it("all plant IDs are unique", () => {
      const ids = PLANT_DATABASE.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
