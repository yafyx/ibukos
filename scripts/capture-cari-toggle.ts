#!/usr/bin/env bun
/**
 * Capture the /cari Daftar / Gabungan / Peta toggle as a GIF.
 *
 *   bun scripts/capture-cari-toggle.ts [--url https://ibukos.yfyx.dev] [--out docs/screenshots/cari-views.gif]
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
const OUT = getFlag(args, "--out", "docs/screenshots/cari-views.gif");

const videoDir = join(tmpdir(), "ibukos-capture-cari");
const browser = await chromium.launch();
const { context, page } = await launchCapturingPage(browser, videoDir);

try {
  await page.goto(`${URL}/cari`, { waitUntil: "networkidle" });
  // Leaflet + tiles need a beat after networkidle.
  await page.waitForTimeout(3000);

  const tab = (name: string) => page.getByRole("tab", { name }).first();

  await tab("Peta").click();
  await page.waitForTimeout(2000); // layout resize over --duration-move

  await tab("Daftar").click();
  await page.waitForTimeout(2000);

  await tab("Gabungan").click();
  await page.waitForTimeout(2000);
} finally {
  await page.close();
  await context.close();
  await browser.close();
}

await webmToGif(newestWebm(videoDir), OUT, 3.0, 9.5);
