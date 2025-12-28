/**
 * Tests for Google Home OAuth utilities.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isValidRedirectUri, isValidClientId } from "./oauth";

// Mock the supabase client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Mock constants with test values
vi.mock("./constants", () => ({
  GOOGLE_HOME_CLIENT_ID: "test-client-id",
  GOOGLE_HOME_CLIENT_SECRET: "test-client-secret",
  GOOGLE_HOME_JWT_SECRET: "test-jwt-secret",
  AUTH_CODE_EXPIRY_MINUTES: 10,
  ACCESS_TOKEN_EXPIRY_HOURS: 1,
  GOOGLE_OAUTH_REDIRECT_PATTERN:
    /^https:\/\/oauth-redirect\.googleusercontent\.com\/r\/.+$/,
  DEVICE_MANUFACTURER: "Plangrove",
  DEVICE_MODEL: "Virtual Plant",
  DEVICE_SW_VERSION: "1.0.0",
  GOOGLE_DEVICE_TYPE: "action.devices.types.SPRINKLER",
  GOOGLE_TRAITS: ["action.devices.traits.StartStop"],
}));

describe("isValidRedirectUri", () => {
  it("should accept valid Google OAuth redirect URIs", () => {
    expect(
      isValidRedirectUri(
        "https://oauth-redirect.googleusercontent.com/r/plangrove"
      )
    ).toBe(true);
    expect(
      isValidRedirectUri(
        "https://oauth-redirect.googleusercontent.com/r/some-project-id"
      )
    ).toBe(true);
    expect(
      isValidRedirectUri(
        "https://oauth-redirect.googleusercontent.com/r/test123"
      )
    ).toBe(true);
  });

  it("should reject invalid redirect URIs", () => {
    // Missing HTTPS
    expect(
      isValidRedirectUri(
        "http://oauth-redirect.googleusercontent.com/r/plangrove"
      )
    ).toBe(false);

    // Wrong domain
    expect(isValidRedirectUri("https://evil.com/r/plangrove")).toBe(false);

    // Missing project path
    expect(
      isValidRedirectUri("https://oauth-redirect.googleusercontent.com/r/")
    ).toBe(false);

    // Wrong path structure
    expect(
      isValidRedirectUri("https://oauth-redirect.googleusercontent.com/plangrove")
    ).toBe(false);

    // Empty string
    expect(isValidRedirectUri("")).toBe(false);

    // Random URL
    expect(isValidRedirectUri("https://example.com")).toBe(false);
  });
});

describe("isValidClientId", () => {
  it("should accept the configured client ID", () => {
    expect(isValidClientId("test-client-id")).toBe(true);
  });

  it("should reject other client IDs", () => {
    expect(isValidClientId("wrong-client-id")).toBe(false);
    expect(isValidClientId("")).toBe(false);
    expect(isValidClientId("TEST-CLIENT-ID")).toBe(false); // Case sensitive
  });
});

describe("Token Generation and Validation", () => {
  // These tests require the actual crypto API
  // We'll test the token format and structure

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be tested with integration tests", () => {
    // Token generation/validation requires the actual crypto.subtle API
    // and database operations. These are better tested as integration tests.
    expect(true).toBe(true);
  });
});

describe("Token Format", () => {
  it("should produce tokens in the expected format", async () => {
    // Import the actual functions to test format
    const { generateAccessToken, generateRefreshToken } = await import(
      "./oauth"
    );

    // Generate tokens with mock user data
    const accessToken = await generateAccessToken("user-123", "agent-user-123");
    const refreshToken = await generateRefreshToken(
      "user-123",
      "agent-user-123"
    );

    // Tokens should be in format: base64payload.signature
    expect(accessToken).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    expect(refreshToken).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);

    // Access and refresh tokens should be different
    expect(accessToken).not.toBe(refreshToken);
  });

  it("should produce consistent tokens for the same input", async () => {
    const { generateAccessToken } = await import("./oauth");

    // Same inputs should produce different tokens due to expiry timestamps
    // But within the same millisecond, they should be the same
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));

    const token1 = await generateAccessToken("user-123", "agent-user-123");
    const token2 = await generateAccessToken("user-123", "agent-user-123");

    expect(token1).toBe(token2);

    vi.useRealTimers();
  });
});

describe("Token Validation", () => {
  it("should validate tokens correctly", async () => {
    const { generateAccessToken, validateToken } = await import("./oauth");

    const token = await generateAccessToken("user-123", "agent-user-123");
    const payload = await validateToken(token, "access");

    expect(payload).not.toBeNull();
    expect(payload?.userId).toBe("user-123");
    expect(payload?.agentUserId).toBe("agent-user-123");
    expect(payload?.type).toBe("access");
  });

  it("should reject tokens with wrong type", async () => {
    const { generateAccessToken, validateToken } = await import("./oauth");

    const accessToken = await generateAccessToken("user-123", "agent-user-123");
    const payload = await validateToken(accessToken, "refresh");

    expect(payload).toBeNull();
  });

  it("should reject malformed tokens", async () => {
    const { validateToken } = await import("./oauth");

    expect(await validateToken("invalid", "access")).toBeNull();
    expect(await validateToken("no.signature.here.extra", "access")).toBeNull();
    expect(await validateToken("", "access")).toBeNull();
  });

  it("should reject tokens with invalid signature", async () => {
    const { generateAccessToken, validateToken } = await import("./oauth");

    const token = await generateAccessToken("user-123", "agent-user-123");
    const [payload] = token.split(".");
    const tamperedToken = `${payload}.invalid_signature`;

    const result = await validateToken(tamperedToken, "access");
    expect(result).toBeNull();
  });

  it("should reject expired tokens", async () => {
    vi.useFakeTimers();

    const { generateAccessToken, validateToken } = await import("./oauth");

    // Generate token at current time
    vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
    const token = await generateAccessToken("user-123", "agent-user-123");

    // Advance time past expiry (1 hour + 1 second)
    vi.setSystemTime(new Date("2025-01-01T01:00:01.000Z"));
    const payload = await validateToken(token, "access");

    expect(payload).toBeNull();

    vi.useRealTimers();
  });
});
