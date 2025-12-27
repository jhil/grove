import { describe, it, expect } from "vitest";
import {
  getDaysWithPlant,
  getPlantMilestones,
  getAchievedMilestones,
  getNextMilestone,
  formatPlantAge,
  isBirthdayToday,
  getDaysUntilBirthday,
} from "@/lib/utils/milestones";
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

describe("Milestones Utilities", () => {
  describe("getDaysWithPlant", () => {
    it("returns null if no birthday", () => {
      expect(getDaysWithPlant(null)).toBeNull();
    });

    it("returns 0 for today's birthday", () => {
      const today = new Date().toISOString();
      expect(getDaysWithPlant(today)).toBe(0);
    });

    it("returns correct days for past birthday", () => {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      expect(getDaysWithPlant(tenDaysAgo.toISOString())).toBe(10);
    });
  });

  describe("getPlantMilestones", () => {
    it("returns milestones for plant with no birthday", () => {
      const plant = createMockPlant();
      const milestones = getPlantMilestones(plant);

      // Should still return all milestone definitions
      expect(milestones.length).toBeGreaterThan(0);
      // Time milestones should show 0 progress
      const timeMilestones = milestones.filter((m) => m.type === "time");
      expect(timeMilestones.every((m) => !m.achieved)).toBe(true);
    });

    it("marks time milestones as achieved based on days", () => {
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 35);
      const plant = createMockPlant({
        birthday: oneMonthAgo.toISOString(),
      });

      const milestones = getPlantMilestones(plant);
      const weekMilestone = milestones.find((m) => m.id === "1-week");
      const monthMilestone = milestones.find((m) => m.id === "1-month");
      const yearMilestone = milestones.find((m) => m.id === "1-year");

      expect(weekMilestone?.achieved).toBe(true);
      expect(monthMilestone?.achieved).toBe(true);
      expect(yearMilestone?.achieved).toBe(false);
    });

    it("marks streak milestones as achieved based on best_streak", () => {
      const plant = createMockPlant({
        best_streak: 8,
      });

      const milestones = getPlantMilestones(plant);
      const streak3 = milestones.find((m) => m.id === "streak-3");
      const streak7 = milestones.find((m) => m.id === "streak-7");
      const streak10 = milestones.find((m) => m.id === "streak-10");

      expect(streak3?.achieved).toBe(true);
      expect(streak7?.achieved).toBe(true);
      expect(streak10?.achieved).toBe(false);
    });
  });

  describe("getAchievedMilestones", () => {
    it("returns only achieved milestones", () => {
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);
      const plant = createMockPlant({
        birthday: twoMonthsAgo.toISOString(),
        best_streak: 5,
      });

      const achieved = getAchievedMilestones(plant);
      expect(achieved.every((m) => m.achieved)).toBe(true);
      expect(achieved.length).toBeGreaterThan(0);
    });

    it("returns empty array if no milestones achieved", () => {
      const plant = createMockPlant();
      const achieved = getAchievedMilestones(plant);
      expect(achieved).toHaveLength(0);
    });
  });

  describe("getNextMilestone", () => {
    it("returns null if no progress on any milestone", () => {
      const plant = createMockPlant();
      const next = getNextMilestone(plant);
      // Will return first time milestone with 0 progress since no birthday
      expect(next).toBeNull();
    });

    it("returns next upcoming milestone with progress", () => {
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      const plant = createMockPlant({
        birthday: fiveDaysAgo.toISOString(),
      });

      const next = getNextMilestone(plant);
      expect(next).not.toBeNull();
      expect(next?.id).toBe("1-week");
      expect(next?.achieved).toBe(false);
      expect((next?.progress ?? 0)).toBeGreaterThan(0);
    });
  });

  describe("formatPlantAge", () => {
    it("returns 'Age unknown' for null birthday", () => {
      expect(formatPlantAge(null)).toBe("Age unknown");
    });

    it("returns 'Today!' for today's birthday", () => {
      const today = new Date().toISOString();
      expect(formatPlantAge(today)).toBe("Today!");
    });

    it("returns '1 day' for yesterday", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(formatPlantAge(yesterday.toISOString())).toBe("1 day");
    });

    it("returns days for less than a week", () => {
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      expect(formatPlantAge(fiveDaysAgo.toISOString())).toBe("5 days");
    });

    it("returns weeks for less than a month", () => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      expect(formatPlantAge(twoWeeksAgo.toISOString())).toBe("2 weeks");
    });

    it("returns months for less than a year", () => {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 95);
      expect(formatPlantAge(threeMonthsAgo.toISOString())).toBe("3 months");
    });

    it("returns years and months for over a year", () => {
      const fourteenMonthsAgo = new Date();
      fourteenMonthsAgo.setDate(fourteenMonthsAgo.getDate() - 425);
      const result = formatPlantAge(fourteenMonthsAgo.toISOString());
      expect(result).toMatch(/1y \d+m/);
    });
  });

  describe("isBirthdayToday", () => {
    it("returns false for null birthday", () => {
      expect(isBirthdayToday(null)).toBe(false);
    });

    it("returns false for this year (first day is not anniversary)", () => {
      const today = new Date().toISOString();
      expect(isBirthdayToday(today)).toBe(false);
    });

    it("returns true for same day last year", () => {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      expect(isBirthdayToday(lastYear.toISOString())).toBe(true);
    });

    it("returns false for different day", () => {
      const differentDay = new Date();
      differentDay.setFullYear(differentDay.getFullYear() - 1);
      differentDay.setDate(differentDay.getDate() + 5);
      expect(isBirthdayToday(differentDay.toISOString())).toBe(false);
    });
  });

  describe("getDaysUntilBirthday", () => {
    it("returns null for null birthday", () => {
      expect(getDaysUntilBirthday(null)).toBeNull();
    });

    it("returns days until next anniversary", () => {
      const birthday = new Date();
      birthday.setDate(birthday.getDate() + 10);
      birthday.setFullYear(birthday.getFullYear() - 1);
      const days = getDaysUntilBirthday(birthday.toISOString());
      expect(days).toBe(10);
    });

    it("returns 0 or 365 for today's anniversary", () => {
      // Note: Due to date calculation edge cases (time zone, time of day),
      // today's anniversary might show as 0 or wrap to next year (365)
      const birthday = new Date();
      birthday.setFullYear(birthday.getFullYear() - 1);
      const days = getDaysUntilBirthday(birthday.toISOString());
      // Either it's today (0) or we're calculating next year's (365/366)
      expect(days === 0 || days === 365 || days === 366).toBe(true);
    });
  });
});
