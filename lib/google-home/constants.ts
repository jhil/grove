/**
 * Google Home integration constants.
 */

// OAuth configuration from environment variables
export const GOOGLE_HOME_CLIENT_ID = process.env.GOOGLE_HOME_CLIENT_ID || "";
export const GOOGLE_HOME_CLIENT_SECRET =
  process.env.GOOGLE_HOME_CLIENT_SECRET || "";
export const GOOGLE_HOME_JWT_SECRET =
  process.env.GOOGLE_HOME_JWT_SECRET || "plangrove-google-home-secret";

// Token expiry durations
export const AUTH_CODE_EXPIRY_MINUTES = 10;
export const ACCESS_TOKEN_EXPIRY_HOURS = 1;
export const REFRESH_TOKEN_EXPIRY_DAYS = 365;

// Google OAuth redirect URI pattern
export const GOOGLE_OAUTH_REDIRECT_PATTERN =
  /^https:\/\/oauth-redirect\.googleusercontent\.com\/r\/.+$/;

// Device manufacturer info
export const DEVICE_MANUFACTURER = "Plangrove";
export const DEVICE_MODEL = "Virtual Plant";
export const DEVICE_SW_VERSION = "1.0.0";

// Google Smart Home action types
export const GOOGLE_DEVICE_TYPE = "action.devices.types.SPRINKLER";
export const GOOGLE_TRAITS = ["action.devices.traits.StartStop"] as const;

// Intent types
export const INTENTS = {
  SYNC: "action.devices.SYNC",
  QUERY: "action.devices.QUERY",
  EXECUTE: "action.devices.EXECUTE",
  DISCONNECT: "action.devices.DISCONNECT",
} as const;

// Execute commands
export const COMMANDS = {
  START_STOP: "action.devices.commands.StartStop",
} as const;
