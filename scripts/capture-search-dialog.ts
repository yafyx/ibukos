#!/usr/bin/env bun
/**
 * Capture the search dialog interaction from the deployed site as a GIF.
 *
 * Usage:
 *   bun scripts/capture-search-dialog.ts [--url https://ibukos.yfyx.dev] [--out docs/screenshots/search-dialog.gif]
 *
 * Records with Playwright video (webm), then converts with system ffmpeg
 * using a two-pass palette for small README-friendly GIFs.
 */
import { mkdirSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

const args = process.argv.slice(2);
function flag(name: string, fallback: string): string {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}

const URL = flag("--url", "https://ibukos.yfyx.dev");
const OUT = flag("--out", "docs/screenshots/search-dialog.gif");
// Keep the GIF loop-friendly: skip page load, keep only the interaction.
const SKIP_S = Number(flag("--skip", "2.8"));
const LENGTH_S = Number(flag("--length", "8.0"));

async function runFfmpeg(fArgs: string[]) {
  const proc = Bun.spawn(["ffmpeg", "-y", ...fArgs], {
    stdout: "inherit",
    stderr: "inherit",
  });
  const code = await proc.exited;
  if (code !== 0) throw new Error(`ffmpeg exited ${code}: ffmpeg ${fArgs.join(" ")}`);
}

const videoDir = join(tmpdir(), "ibukos-capture");
mkdirSync(videoDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
  colorScheme: "light",
  reducedMotion: "no-preference",
  recordVideo: { dir: videoDir, size: { width: 1280, height: 800 } },
});
const page = await context.newPage();

try {
  await page.goto(URL, { waitUntil: "networkidle" });
  // Let hero + fonts settle so the recording doesn't start mid-shift.
  await page.waitForTimeout(1200);

  // 1. Open the dialog from the hero trigger.
  const trigger = page
    .locator("button", { hasText: "Coba Tebet" })
    .first();
  await trigger.waitFor({ state: "visible", timeout: 10_000 });
  await trigger.click();
  await page.waitForTimeout(1000); // browse panel: nearby + chips + tabs

  // 2. Show the tabs are real: Area -> back to Kampus.
  const areaTab = page.getByRole("tab", { name: /Area/ });
  if ((await areaTab.count()) > 0) {
    await areaTab.first().click();
    await page.waitForTimeout(700);
    await page.getByRole("tab", { name: /Kampus/ }).first().click();
    await page.waitForTimeout(700);
  }

  // 3. Type to filter, with human pacing so the GIF reads.
  const input = page.getByPlaceholder("Coba Tebet Jakarta Selatan");
  await input.waitFor({ state: "visible", timeout: 5000 });
  await input.pressSequentially("ugm", { delay: 160 });
  await page.waitForTimeout(1200); // filtered results hold

  // 4. Clear back to browse panel for a clean loop point.
  await input.fill("");
  await page.waitForTimeout(900);
} finally {
  await page.close();
  await context.close();
  await browser.close();
}

// Playwright saves one .webm per page in videoDir; take the newest.
const { readdirSync, statSync } = await import("node:fs");
const webm = readdirSync(videoDir)
  .filter((f) => f.endsWith(".webm"))
  .map((f) => ({ f, t: statSync(join(videoDir, f)).mtimeMs }))
  .sort((a, b) => b.t - a.t)[0]?.f;
if (!webm) throw new Error(`no .webm recorded in ${videoDir}`);
const webmPath = join(videoDir, webm);

const outDir = OUT.split("/").slice(0, -1).join("/");
if (outDir && !existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const palette = join(videoDir, "palette-search-dialog.png");

console.log(`converting ${webmPath} -> ${OUT} (skip ${SKIP_S}s, ${LENGTH_S}s @ 12fps, 960w)`);
await runFfmpeg([
  "-ss", String(SKIP_S),
  "-t", String(LENGTH_S),
  "-i", webmPath,
  "-vf", "fps=12,scale=960:-1:flags=lanczos,palettegen=stats_mode=diff",
  palette,
]);
await runFfmpeg([
  "-ss", String(SKIP_S),
  "-t", String(LENGTH_S),
  "-i", webmPath,
  "-i", palette,
  "-lavfi", "fps=12,scale=960:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=5",
  OUT,
]);

const sizeMb = (statSync(OUT).size / 1024 / 1024).toFixed(2);
console.log(`done: ${OUT} (${sizeMb} MB)`);
