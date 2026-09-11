#!/usr/bin/env bun
/**
 * Capture the save-chip feedback (save -> "Disimpan" -> remove) as a GIF.
 *
 *   bun scripts/capture-save-chip.ts [--url https://ibukos.yfyx.dev] [--out docs/screenshots/save-chip.gif]
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
const OUT = getFlag(args, "--out", "docs/screenshots/save-chip.gif");

const videoDir = join(tmpdir(), "ibukos-capture-save");
const browser = await chromium.launch();
const { context, page } = await launchCapturingPage(browser, videoDir);

try {
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // Fresh profile => nothing saved yet, so the first click always saves.
  const chip = page.locator(".save-chip").first();
  await chip.waitFor({ state: "visible", timeout: 10_000 });
  await chip.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);

  await chip.click();
  await page.waitForTimeout(2200); // "Disimpan" holds 1400ms + collapse

  await chip.click();
  await page.waitForTimeout(1400); // remove lift is 550ms
} finally {
  await page.close();
  await context.close();
  await browser.close();
}

await webmToGif(newestWebm(videoDir), OUT, 2.5, 8.0, 560, "560:360:11:220");
