#!/usr/bin/env bun
/**
 * Capture the hero search box docking into the header as a GIF.
 *
 *   bun scripts/capture-search-dock.ts [--url https://ibukos.yfyx.dev] [--out docs/screenshots/home-search-dock.gif]
 */
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  chromium,
  getFlag,
  launchCapturingPage,
  newestWebm,
  webmToGif,
} from "./capture-lib.ts";

const args = process.argv.slice(2);
const URL = getFlag(args, "--url", "https://ibukos.yfyx.dev");
const OUT = getFlag(args, "--out", "docs/screenshots/home-search-dock.gif");

const videoDir = join(tmpdir(), "ibukos-capture-dock");
const browser = await chromium.launch();
const { context, page } = await launchCapturingPage(browser, videoDir);

try {
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  // Deterministic start: wait for the hero trigger, not networkidle
  // (image weight makes networkidle timing unpredictable).
  await page
    .locator("button", { hasText: "Coba Tebet" })
    .first()
    .waitFor({ state: "visible", timeout: 20_000 });
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  // Scroll past the hero: the box morphs into the header (ViewTransition).
  await page.evaluate(() => window.scrollTo({ top: 950, behavior: "smooth" }));
  await page.waitForTimeout(2200);
  await page.waitForTimeout(1200); // docked hold

  // Back up: it morphs home.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await page.waitForTimeout(2200);
  await page.waitForTimeout(800);
} finally {
  await page.close();
  await context.close();
  await browser.close();
}

await webmToGif(newestWebm(videoDir), OUT, 4.0, 9.0);
