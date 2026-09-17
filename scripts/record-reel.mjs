// Grava um vídeo vertical (formato celular/WhatsApp) percorrendo a narrativa inteira.
// Uso: node scripts/record-reel.mjs [url] [segundos]
import { chromium } from "playwright-core";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";

const run = promisify(execFile);
const url = process.argv[2] ?? "http://localhost:3221/";
const seconds = Number(process.argv[3] ?? 32);
const out = path.resolve(import.meta.dirname, "../docs");
const tmp = path.resolve(import.meta.dirname, "../.reel-tmp");
await mkdir(out, { recursive: true });
await rm(tmp, { recursive: true, force: true });
await mkdir(tmp, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  recordVideo: { dir: tmp, size: { width: 780, height: 1688 } },
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForSelector(".preloader", { state: "detached", timeout: 30000 });
await page.waitForTimeout(1400);

// desce a história inteira em velocidade constante, com uma pausa no produto
await page.evaluate(async (ms) => {
  const story = document.getElementById("story");
  const start = story.offsetTop;
  const end = start + (1780 * window.innerHeight) / 100;
  await new Promise((resolve) => {
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / ms);
      window.scrollTo(0, start + (end - start) * p);
      if (p < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}, seconds * 1000);
await page.waitForTimeout(2200);

await context.close();
await browser.close();

const [webm] = (await readdir(tmp)).filter((f) => f.endsWith(".webm"));
const src = path.join(tmp, webm);
const mp4 = path.join(out, "noctis-reel.mp4");
await run(ffmpegInstaller.path, [
  "-y",
  "-i", src,
  "-vf", "scale=1080:2338:flags=lanczos,fps=30",
  "-c:v", "libx264",
  "-profile:v", "high",
  "-pix_fmt", "yuv420p",
  "-crf", "23",
  "-movflags", "+faststart",
  "-an",
  mp4,
]);
await rm(tmp, { recursive: true, force: true });
console.log("vídeo:", mp4);
