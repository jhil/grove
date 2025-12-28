/**
 * Config manager for storing user credentials locally
 */
import type { StoredConfig } from "../types.js";
/**
 * Load stored config from disk
 */
export declare function loadConfig(): StoredConfig | null;
/**
 * Save config to disk with secure permissions
 */
export declare function saveConfig(config: StoredConfig): void;
/**
 * Clear stored config (logout)
 */
export declare function clearConfig(): void;
/**
 * Check if user is logged in
 */
export declare function isLoggedIn(): boolean;
