import { describe, it, expect } from "vitest";
import {
  wasWateredOnTime,
  calculateStreakUpdate,
  getStreakStatus,
  getStreakEmoji,
  getStreakLabel,
  isStreakAtRisk,
  daysUntilStreakBreaks,
} from "@/lib/utils/streaks";
import type { Plant } from "@/types/supabase";

// Helper to create a mock plant
function createMockPlant(overrides: Partial<Plant> = {}): Plant {
  return {
    id: "test-plant",
    grove_id: "test-grove",
    name: "Test Plant",
    type: "tropical",
    watering_interval: 7,
    photo: null,
    notes: null,
    last_watered: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    streak_count: 0,
    best_streak: 0,
    streak_started_at: null,
    birthday: null,
    ...overrides,
  };
}

describe("Streak Utilities", () => {
  describe("wasWateredOnTime", () => {
    it("returns false if never watered", () => {
      expect(wasWateredOnTime(null, 7)).toBe(false);
    });

    it("returns true if watered within interval", () => {
      const lastWatered = new Date();
      lastWatered.setDate(lastWatered.getDate() - 5);
      expect(wasWateredOnTime(lastWatered.toISOString(), 7)).toBe(true);
    });

    it("returns true if watered within grace period", () => {
      const lastWatered = new Date();
      lastWatered.setDate(lastWatered.getDate() - 8); // 1 day over 7-day interval
      expect(wasWateredOnTime(lastWatered.toISOString(), 7)).toBe(true);
    });

    it("returns false if overdue beyond grace period", () => {
      const lastWatered = new Date();
      lastWatered.setDate(lastWatered.getDate() - 10); // 3 days over
      expect(wasWateredOnTime(lastWatered.toISOString(), 7)).toBe(false);
    });
  });

  describe("calculateStreakUpdate", () => {
    it("starts streak at 1 for first watering", () => {
      const plant = createMockPlant();
      const now = new Date();
      const result = calculateStreakUpdate(plant, now);

      expect(result.streak_count).toBe(1);
      expect(result.best_streak).toBe(1);
      expect(result.streak_started_at).toBe(now.toISOString());
    });

    it("increments streak for on-time watering", () => {
      const lastWatered = new Date();
      lastWatered.setDate(lastWatered.getDate() - 5);
      const plant = createMockPlant({
        last_watered: lastWatered.toISOString(),
        streak_count: 3,
        best_streak: 3,
        streak_started_at: new Date("2025-01-01").toISOString(),
      });

      const result = calculateStreakUpdate(plant, new Date());

      expect(result.streak_count).toBe(4);
      expect(result.best_streak).toBe(4);
      expect(result.streak_started_at).toBe(plant.streak_started_at);
    });

    it("resets streak for overdue watering", () => {
      const lastWatered = new Date();
      lastWatered.setDate(lastWatered.getDate() - 15); // Way overdue
      const plant = createMockPlant({
        last_watered: lastWatered.toISOString(),
        streak_count: 5,
        best_streak: 10,
        streak_started_at: new Date("2025-01-01").toISOString(),
      });

      const now = new Date();
      const result = calculateStreakUpdate(plant, now);

      expect(result.streak_count).toBe(1);
      expect(result.best_streak).toBe(10); // Preserves best
      expect(result.streak_started_at).toBe(now.toISOString());
    });

    it("updates best streak when current exceeds previous best", () => {
      const lastWatered = new Date();
      lastWatered.setDate(lastWatered.getDate() - 3);
      const plant = createMockPlant({
        last_watered: lastWatered.toISOString(),
        streak_count: 9,
        best_streak: 9,
      });

      const result = calculateStreakUpdate(plant, new Date());

      expect(result.streak_count).toBe(10);
      expect(result.best_streak).toBe(10);
    });
  });

  describe("getStreakStatus", () => {
    it("returns none for 0", () => {
      expect(getStreakStatus(0)).toBe("none");
    });

    it("returns starting for 1", () => {
      expect(getStreakStatus(1)).toBe("starting");
    });

    it("returns building for 2-4", () => {
      expect(getStreakStatus(2)).toBe("building");
      expect(getStreakStatus(4)).toBe("building");
    });

    it("returns strong for 5-9", () => {
      expect(getStreakStatus(5)).toBe("strong");
      expect(getStreakStatus(9)).toBe("strong");
    });

    it("returns legendary for 10+", () => {
      expect(getStreakStatus(10)).toBe("legendary");
      expect(getStreakStatus(50)).toBe("legendary");
    });
  });

  describe("getStreakEmoji", () => {
    it("returns empty string for no streak", () => {
      expect(getStreakEmoji(0)).toBe("");
    });

    it("returns seedling for starting", () => {
      expect(getStreakEmoji(1)).toBe("🌱");
    });

    it("returns herb for building", () => {
      expect(getStreakEmoji(3)).toBe("🌿");
    });

    it("returns fire for strong", () => {
      expect(getStreakEmoji(7)).toBe("🔥");
    });

    it("returns star for legendary", () => {
      expect(getStreakEmoji(15)).toBe("⭐");
    });
  });

  describe("getStreakLabel", () => {
    it("returns appropriate labels", () => {
      expect(getStreakLabel(0)).toBe("No streak");
      expect(getStreakLabel(1)).toBe("Streak started!");
      expect(getStreakLabel(3)).toBe("3 waterings streak");
      expect(getStreakLabel(7)).toBe("7 waterings - on fire!");
      expect(getStreakLabel(15)).toBe("15 waterings - legendary!");
    });
  });

  describe("isStreakAtRisk", () => {
    it("returns false if no streak", () => {
      const plant = createMockPlant({ streak_count: 0 });
      expect(isStreakAtRisk(plant)).toBe(false);
    });

    it("returns false if never watered", () => {
      const plant = createMockPlant({ streak_count: 1 });
      expect(isStreakAtRisk(plant)).toBe(false);
    });

    it("returns false if recently watered", () => {
      const lastWatered = new Date();
      lastWatered.setDate(lastWatered.getDate() - 2);
      const plant = createMockPlant({
        last_watered: lastWatered.toISOString(),
        streak_count: 3,
        watering_interval: 7,
      });
      expect(isStreakAtRisk(plant)).toBe(false);
    });

    it("returns true if close to interval", () => {
      const lastWatered = new Date();
      lastWatered.setDate(lastWatered.getDate() - 6); // 1 day before 7-day interval
      const plant = createMockPlant({
        last_watered: lastWatered.toISOString(),
        streak_count: 3,
        watering_interval: 7,
      });
      expect(isStreakAtRisk(plant)).toBe(true);
    });
  });

  describe("daysUntilStreakBreaks", () => {
    it("returns null if no streak", () => {
      const plant = createMockPlant({ streak_count: 0 });
      expect(daysUntilStreakBreaks(plant)).toBeNull();
    });

    it("returns null if never watered", () => {
      const plant = createMockPlant({ streak_count: 1 });
      expect(daysUntilStreakBreaks(plant)).toBeNull();
    });

    it("returns correct days until break", () => {
      const lastWatered = new Date();
      lastWatered.setDate(lastWatered.getDate() - 5);
      const plant = createMockPlant({
        last_watered: lastWatered.toISOString(),
        streak_count: 3,
        watering_interval: 7,
      });
      // 7 (interval) + 1 (grace) - 5 (days since watered) = 3
      expect(daysUntilStreakBreaks(plant)).toBe(3);
    });

    it("returns 0 if already past grace period", () => {
      const lastWatered = new Date();
      lastWatered.setDate(lastWatered.getDate() - 15);
      const plant = createMockPlant({
        last_watered: lastWatered.toISOString(),
        streak_count: 3,
        watering_interval: 7,
      });
      expect(daysUntilStreakBreaks(plant)).toBe(0);
    });
  });
});
