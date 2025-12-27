/**
 * Mobile Screenshot Capture Script
 *
 * Run with: npx tsx scripts/mobile-screenshots.ts
 *
 * Take new screenshots with every major release:
 * - Huge refactors
 * - Style changes
 * - 10+ major new features
 */

import { chromium, devices } from "@playwright/test";
import { mkdir } from "fs/promises";
import path from "path";

const BASE_URL = process.env.BASE_URL || "https://plangrove.app";

// Modern iPhone viewports
const DEVICES = [
  { name: "iPhone-15-Pro", ...devices["iPhone 15 Pro"] },
  { name: "iPhone-14", ...devices["iPhone 14"] },
  { name: "iPhone-SE", ...devices["iPhone SE"] },
];

// Key screens to capture
const PAGES = [
  { name: "home", path: "/" },
  { name: "create-grove", path: "/create-grove" },
  { name: "shop", path: "/shop" },
  { name: "profile", path: "/profile" },
];

async function captureScreenshots() {
  // Store in .screenshots folder (gitignored)
  const outputDir = path.join(process.cwd(), ".screenshots");
  await mkdir(outputDir, { recursive: true });

  const timestamp = new Date().toISOString().split("T")[0];
  console.log(`\n📸 Capturing screenshots (${timestamp})`);
  console.log(`   Base URL: ${BASE_URL}\n`);

  const browser = await chromium.launch();

  for (const device of DEVICES) {
    console.log(`📱 ${device.name}`);

    const context = await browser.newContext({
      ...device,
      colorScheme: "light",
    });
    const page = await context.newPage();

    for (const pageConfig of PAGES) {
      const url = `${BASE_URL}${pageConfig.path}`;

      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
        await page.waitForTimeout(1000); // Wait for animations

        const filename = `${device.name}-${pageConfig.name}.png`;
        await page.screenshot({
          path: path.join(outputDir, filename),
          fullPage: true,
        });
        console.log(`   ✓ ${pageConfig.name}`);
      } catch (error) {
        console.log(`   ✗ ${pageConfig.name}: ${error}`);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log(`\n✅ Screenshots saved to ${outputDir}\n`);
}

captureScreenshots().catch(console.error);
