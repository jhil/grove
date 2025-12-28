/**
 * Config manager for storing user credentials locally
 */
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
const CONFIG_DIR = path.join(os.homedir(), ".plangrove");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
/**
 * Ensure the config directory exists with proper permissions
 */
function ensureConfigDir() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { mode: 0o700 });
    }
}
/**
 * Load stored config from disk
 */
export function loadConfig() {
    try {
        if (!fs.existsSync(CONFIG_FILE)) {
            return null;
        }
        const data = fs.readFileSync(CONFIG_FILE, "utf-8");
        return JSON.parse(data);
    }
    catch {
        return null;
    }
}
/**
 * Save config to disk with secure permissions
 */
export function saveConfig(config) {
    ensureConfigDir();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), {
        mode: 0o600,
    });
}
/**
 * Clear stored config (logout)
 */
export function clearConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            fs.unlinkSync(CONFIG_FILE);
        }
    }
    catch {
        // Ignore errors
    }
}
/**
 * Check if user is logged in
 */
export function isLoggedIn() {
    return loadConfig() !== null;
}
