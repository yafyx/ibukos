#!/usr/bin/env bun
/**
 * Capture the promo folder city tabs as a GIF.
 *
 *   bun scripts/capture-promo-folder.ts [--url https://ibukos.yfyx.dev] [--out docs/screenshots/promo-folder.gif]
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
const OUT = getFlag(args, "--out", "docs/screenshots/promo-folder.gif");

const videoDir = join(tmpdir(), "ibukos-capture-promo");
const browser = await chromium.launch();
const { context, page } = await launchCapturingPage(browser, videoDir);

try {
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page
    .locator("button", { hasText: "Coba Tebet" })
    .first()
    .waitFor({ state: "visible", timeout: 20_000 });
  await page.waitForTimeout(1200);

  const head = page.getByRole("heading", { name: /lagi promo/ });
  await head.scrollIntoViewIfNeeded();
  // Pin the folder so heading + tabs + cards fill the frame for the crop.
  await page.evaluate(() => {
    const el = document.getElementById("promo-by-city-heading");
    const top = el
      ? el.getBoundingClientRect().top + window.scrollY
      : window.scrollY;
    window.scrollTo(0, Math.max(0, top - 140));
  });
  await page.waitForTimeout(800); // folder settled on Yogyakarta

  // Step through cities: notch FLIP + cards fade each time.
  for (const city of ["Jakarta", "Bandung", "Surabaya"]) {
    await page.getByRole("tab", { name: new RegExp(city) }).first().click();
    await page.waitForTimeout(1500);
  }
  // Back home for a clean loop point.
  await page.getByRole("tab", { name: /Yogyakarta/ }).first().click();
  await page.waitForTimeout(1300);
} finally {
  await page.close();
  await context.close();
  await browser.close();
}

await webmToGif(newestWebm(videoDir), OUT, 4.0, 7.5, 800, "1280:460:0:100");
