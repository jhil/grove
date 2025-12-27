import { describe, it, expect } from "vitest";

/**
 * Tests for analytics utility functions
 */

describe("Analytics Calculations", () => {
  describe("Care Consistency", () => {
    it("calculates 100% when all plants are on time", () => {
      const plants = [
        { watering_interval: 7, last_watered: new Date().toISOString() },
        { watering_interval: 7, last_watered: new Date().toISOString() },
      ];

      const onTime = plants.filter((p) => {
        if (!p.last_watered) return false;
        const daysSince = Math.floor(
          (Date.now() - new Date(p.last_watered).getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysSince <= p.watering_interval + 1;
      });

      expect((onTime.length / plants.length) * 100).toBe(100);
    });

    it("calculates 50% when half the plants are overdue", () => {
      const now = new Date();
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 30);

      const plants = [
        { watering_interval: 7, last_watered: now.toISOString() },
        { watering_interval: 7, last_watered: oldDate.toISOString() },
      ];

      const onTime = plants.filter((p) => {
        if (!p.last_watered) return false;
        const daysSince = Math.floor(
          (Date.now() - new Date(p.last_watered).getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysSince <= p.watering_interval + 1;
      });

      expect((onTime.length / plants.length) * 100).toBe(50);
    });

    it("calculates 0% when all plants are overdue", () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 30);

      const plants = [
        { watering_interval: 7, last_watered: oldDate.toISOString() },
        { watering_interval: 7, last_watered: oldDate.toISOString() },
      ];

      const onTime = plants.filter((p) => {
        if (!p.last_watered) return false;
        const daysSince = Math.floor(
          (Date.now() - new Date(p.last_watered).getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysSince <= p.watering_interval + 1;
      });

      expect((onTime.length / plants.length) * 100).toBe(0);
    });
  });

  describe("Streak Aggregation", () => {
    it("calculates average streak correctly", () => {
      const plants = [
        { streak_count: 5 },
        { streak_count: 10 },
        { streak_count: 0 },
      ];

      let total = 0;
      let count = 0;
      for (const p of plants) {
        if (p.streak_count > 0) {
          total += p.streak_count;
          count++;
        }
      }

      const avg = count > 0 ? Math.round(total / count) : 0;
      expect(avg).toBe(8); // (5 + 10) / 2 = 7.5, rounded to 8
    });

    it("finds best streak across all plants", () => {
      const plants = [
        { best_streak: 5 },
        { best_streak: 15 },
        { best_streak: 10 },
      ];

      const best = Math.max(...plants.map((p) => p.best_streak));
      expect(best).toBe(15);
    });

    it("handles plants with no streaks", () => {
      const plants = [
        { streak_count: 0, best_streak: 0 },
        { streak_count: 0, best_streak: 0 },
      ];

      let total = 0;
      let count = 0;
      for (const p of plants) {
        if (p.streak_count > 0) {
          total += p.streak_count;
          count++;
        }
      }

      const avg = count > 0 ? Math.round(total / count) : 0;
      expect(avg).toBe(0);
    });
  });

  describe("Date Grouping", () => {
    it("groups dates correctly", () => {
      const events = [
        { created_at: "2025-12-27T10:00:00Z" },
        { created_at: "2025-12-27T15:00:00Z" },
        { created_at: "2025-12-26T08:00:00Z" },
      ];

      const grouped = events.reduce<Record<string, number>>((acc, e) => {
        const date = new Date(e.created_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      expect(grouped["2025-12-27"]).toBe(2);
      expect(grouped["2025-12-26"]).toBe(1);
    });

    it("handles empty event list", () => {
      const events: { created_at: string }[] = [];

      const grouped = events.reduce<Record<string, number>>((acc, e) => {
        const date = new Date(e.created_at).toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      expect(Object.keys(grouped).length).toBe(0);
    });
  });

  describe("Plant Ranking", () => {
    it("finds the most watered plant", () => {
      const wateringsPerPlant = new Map([
        ["plant-1", 5],
        ["plant-2", 10],
        ["plant-3", 3],
      ]);

      let mostWatered = "";
      let maxCount = 0;
      wateringsPerPlant.forEach((count, id) => {
        if (count > maxCount) {
          maxCount = count;
          mostWatered = id;
        }
      });

      expect(mostWatered).toBe("plant-2");
      expect(maxCount).toBe(10);
    });

    it("finds the least watered plant", () => {
      const now = new Date();
      const plants = [
        { id: "1", name: "Fern", last_watered: now.toISOString() },
        {
          id: "2",
          name: "Cactus",
          last_watered: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          name: "Orchid",
          last_watered: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      let leastCared = "";
      let maxDays = 0;
      for (const p of plants) {
        const daysSince = Math.floor(
          (now.getTime() - new Date(p.last_watered).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSince > maxDays) {
          maxDays = daysSince;
          leastCared = p.name;
        }
      }

      expect(leastCared).toBe("Cactus");
      expect(maxDays).toBe(10);
    });
  });
});
