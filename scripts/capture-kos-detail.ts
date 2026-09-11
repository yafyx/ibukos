#!/usr/bin/env bun
/**
 * Capture the listing-detail photo carousel as a GIF.
 *
 *   bun scripts/capture-kos-detail.ts [--url https://ibukos.yfyx.dev] [--out docs/screenshots/kos-detail.gif] [--slug kos-mawar-ugm]
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
const SLUG = getFlag(args, "--slug", "kos-mawar-ugm");
const OUT = getFlag(args, "--out", "docs/screenshots/kos-detail.gif");

const videoDir = join(tmpdir(), "ibukos-capture-detail");
const browser = await chromium.launch();
const { context, page } = await launchCapturingPage(browser, videoDir);

try {
  await page.goto(`${URL}/kos/${SLUG}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);

  const viewport = page.locator("[data-slot=carousel-viewport]").first();
  await viewport.waitFor({ state: "visible", timeout: 10_000 });
  await viewport.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);

  // Hover reveals the edge next arrow, then step one slide.
  await viewport.hover();
  await page.waitForTimeout(800);
  const next = page.getByRole("button", { name: "Slide berikutnya" }).first();
  await next.click();
  await page.waitForTimeout(1400);

  // Scroll the page: sticky action card rides along past facts + facilities.
  await page.evaluate(() => window.scrollTo({ top: 1300, behavior: "smooth" }));
  await page.waitForTimeout(2200);
  await page.waitForTimeout(1200);

  // Back to the carousel for a clean loop point.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  await page.waitForTimeout(2200);
} finally {
  await page.close();
  await context.close();
  await browser.close();
}

await webmToGif(newestWebm(videoDir), OUT, 2.5, 10.5, 800);
