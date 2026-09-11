/** Shared helpers for the README capture scripts (Playwright video -> GIF). */
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { chromium, type Browser, type Page } from "playwright";

export function getFlag(
  args: string[],
  name: string,
  fallback: string,
): string {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}

export async function runFfmpeg(fArgs: string[]): Promise<void> {
  const proc = Bun.spawn(["ffmpeg", "-y", ...fArgs], {
    stdout: "inherit",
    stderr: "inherit",
  });
  const code = await proc.exited;
  if (code !== 0) {
    throw new Error(`ffmpeg exited ${code}`);
  }
}

export function newestWebm(videoDir: string): string {
  const hit = readdirSync(videoDir)
    .filter((f) => f.endsWith(".webm"))
    .map((f) => ({ f, t: statSync(join(videoDir, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t)[0];
  if (!hit) throw new Error(`no .webm recorded in ${videoDir}`);
  return join(videoDir, hit.f);
}

/** Two-pass palette conversion tuned for small README GIFs. */
export async function webmToGif(
  webmPath: string,
  out: string,
  skipS: number,
  lengthS: number,
  width = 960,
  crop?: string,
): Promise<void> {
  const outDir = out.split("/").slice(0, -1).join("/");
  if (outDir && !existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const palette = join(
    webmPath.split("/").slice(0, -1).join("/"),
    `palette-${Date.now()}.png`,
  );
  const pre = crop ? `crop=${crop},` : "";
  const vf = `${pre}fps=12,scale=${width}:-1:flags=lanczos`;
  console.log(`converting -> ${out} (skip ${skipS}s, ${lengthS}s @ 12fps, ${width}w)`);
  await runFfmpeg([
    "-ss", String(skipS),
    "-t", String(lengthS),
    "-i", webmPath,
    "-vf", `${vf},palettegen=stats_mode=diff`,
    palette,
  ]);
  await runFfmpeg([
    "-ss", String(skipS),
    "-t", String(lengthS),
    "-i", webmPath,
    "-i", palette,
    "-lavfi", `${vf} [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=5`,
    out,
  ]);
  console.log(`done: ${out} (${(statSync(out).size / 1024 / 1024).toFixed(2)} MB)`);
}

export async function launchCapturingPage(
  browser: Browser,
  videoDir: string,
): Promise<{ context: import("playwright").BrowserContext; page: Page }> {
  mkdirSync(videoDir, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme: "light",
    reducedMotion: "no-preference",
    recordVideo: { dir: videoDir, size: { width: 1280, height: 800 } },
  });
  return { context, page: await context.newPage() };
}

export { chromium };
