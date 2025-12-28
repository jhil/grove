/**
 * Config manager for storing user credentials locally
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import type { StoredConfig } from "../types.js";

const CONFIG_DIR = path.join(os.homedir(), ".plangrove");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");

/**
 * Ensure the config directory exists with proper permissions
 */
function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { mode: 0o700 });
  }
}

/**
 * Load stored config from disk
 */
export function loadConfig(): StoredConfig | null {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return null;
    }
    const data = fs.readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(data) as StoredConfig;
  } catch {
    return null;
  }
}

/**
 * Save config to disk with secure permissions
 */
export function saveConfig(config: StoredConfig): void {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), {
    mode: 0o600,
  });
}

/**
 * Clear stored config (logout)
 */
export function clearConfig(): void {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      fs.unlinkSync(CONFIG_FILE);
    }
  } catch {
    // Ignore errors
  }
}

/**
 * Check if user is logged in
 */
export function isLoggedIn(): boolean {
  return loadConfig() !== null;
}
