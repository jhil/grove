/**
 * Tests for Google Home logging utilities.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  logOAuth,
  logFulfillment,
  logDevice,
  logIntent,
  logRequestStart,
  logRequestComplete,
  logWateringAction,
} from "./logging";

describe("Google Home Logging", () => {
  const originalConsole = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  beforeEach(() => {
    console.debug = vi.fn();
    console.info = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T12:00:00.000Z"));
  });

  afterEach(() => {
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    vi.useRealTimers();
  });

  describe("logOAuth", () => {
    it("should log OAuth events at different levels", () => {
      logOAuth("debug", "Debug message");
      expect(console.debug).toHaveBeenCalledWith(
        expect.stringContaining("[GoogleHome:OAuth] Debug message")
      );

      logOAuth("info", "Info message");
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining("[GoogleHome:OAuth] Info message")
      );

      logOAuth("warn", "Warn message");
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("[GoogleHome:OAuth] Warn message")
      );

      logOAuth("error", "Error message");
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("[GoogleHome:OAuth] Error message")
      );
    });

    it("should include context in log message", () => {
      logOAuth("info", "Test message", { userId: "user-123" });
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('userId="user-123"')
      );
    });

    it("should include timestamp", () => {
      logOAuth("info", "Test message");
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining("[2025-01-01T12:00:00.000Z]")
      );
    });
  });

  describe("logFulfillment", () => {
    it("should log fulfillment events", () => {
      logFulfillment("info", "Fulfillment message", { requestId: "req-123" });
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining("[GoogleHome:Fulfillment] Fulfillment message")
      );
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('requestId="req-123"')
      );
    });
  });

  describe("logDevice", () => {
    it("should log device events", () => {
      logDevice("info", "Device message", { deviceId: "plant-123" });
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining("[GoogleHome:Device] Device message")
      );
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('deviceId="plant-123"')
      );
    });
  });

  describe("logIntent", () => {
    it("should log intent events with intent name", () => {
      logIntent("SYNC", "info", "Intent message");
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining("[GoogleHome:Intent:SYNC] Intent message")
      );
    });
  });

  describe("logRequestStart", () => {
    it("should log request start", () => {
      logRequestStart("req-123", "SYNC", { agentUserId: "agent-456" });
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining("Request started: SYNC")
      );
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('requestId="req-123"')
      );
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('intent="SYNC"')
      );
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('agentUserId="agent-456"')
      );
    });
  });

  describe("logRequestComplete", () => {
    it("should log successful request completion", () => {
      logRequestComplete("req-123", "SYNC", true);
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining("Request completed successfully: SYNC")
      );
    });

    it("should log failed request completion as error", () => {
      logRequestComplete("req-123", "SYNC", false);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Request failed: SYNC")
      );
    });
  });

  describe("logWateringAction", () => {
    it("should log successful watering", () => {
      logWateringAction("plant-123", "Fern Fred", true);
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining("Plant watered: Fern Fred")
      );
      expect(console.info).toHaveBeenCalledWith(
        expect.stringContaining('plantId="plant-123"')
      );
    });

    it("should log failed watering as error", () => {
      logWateringAction("plant-123", "Fern Fred", false);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining("Plant failed to water: Fern Fred")
      );
    });
  });

  describe("Context filtering", () => {
    it("should filter out undefined context values", () => {
      logOAuth("info", "Test", {
        userId: "user-123",
        groveId: undefined,
        plantId: undefined,
      });
      const logCall = (console.info as ReturnType<typeof vi.fn>).mock
        .calls[0][0];
      expect(logCall).toContain('userId="user-123"');
      expect(logCall).not.toContain("groveId");
      expect(logCall).not.toContain("plantId");
    });
  });
});
