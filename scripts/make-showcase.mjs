// Gera as imagens e o GIF usados no README (pasta docs/).
// Uso: node scripts/make-showcase.mjs [url]
import { chromium } from "playwright-core";
import gifenc from "gifenc";
const { GIFEncoder, quantize, applyPalette } = gifenc;
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const url = process.argv[2] ?? "http://localhost:3221/";
const out = path.resolve(import.meta.dirname, "../docs");
await mkdir(out, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});

const scrollU = (page, u) =>
  page.evaluate((units) => {
    const story = document.getElementById("story");
    window.scrollTo(0, story.offsetTop + (units * window.innerHeight) / 100);
  }, u);

const open = async (w, h) => {
  const page = await browser.newPage({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
    isMobile: w < 700,
    hasTouch: w < 700,
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(".preloader", { state: "detached", timeout: 30000 });
  await page.waitForTimeout(700);
  return page;
};

// ---------------------------------------------------------------- imagens
const desktopShots = [
  ["hero", 0],
  ["abertura", 155],
  ["coracao", 445],
  ["explodido", 1005],
  ["palavras", 1385],
  ["reveal", 1585],
  ["produto", 1780],
];

{
  const page = await open(1440, 900);
  for (const [name, u] of desktopShots) {
    await scrollU(page, u);
    await page.waitForTimeout(1600);
    const buf = await page.screenshot();
    await sharp(buf).resize(1440).webp({ quality: 82 }).toFile(path.join(out, `${name}.webp`));
    process.stdout.write(`${name} `);
  }
  await page.close();
}

{
  const page = await open(390, 844);
  for (const [name, u] of [["mobile-hero", 0], ["mobile-explodido", 1005], ["mobile-produto", 1780]]) {
    await scrollU(page, u);
    await page.waitForTimeout(1600);
    const buf = await page.screenshot();
    await sharp(buf).resize(390 * 2).webp({ quality: 82 }).toFile(path.join(out, `${name}.webp`));
    process.stdout.write(`${name} `);
  }
  await page.close();
}

// ---------------------------------------------------------------- GIF do scroll
{
  const W = 720;
  const H = 450;
  const FRAMES = 44;
  const page = await open(1440, 900);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const enc = GIFEncoder();
  for (let i = 0; i < FRAMES; i++) {
    const u = (i / (FRAMES - 1)) * 1780;
    await scrollU(page, u);
    // sem espera longa: o scrub precisa alcançar, mas o GIF quer continuidade
    await page.waitForTimeout(700);
    const shot = await page.screenshot({ scale: "css" });
    const { data } = await sharp(shot).resize(W, H, { fit: "fill" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const palette = quantize(data, 200, { format: "rgba4444" });
    const index = applyPalette(data, palette, "rgba4444");
    enc.writeFrame(index, W, H, { palette, delay: 110 });
    process.stdout.write(".");
  }
  enc.finish();
  await writeFile(path.join(out, "noctis-scroll.gif"), Buffer.from(enc.bytes()));
  await page.close();
}

await browser.close();
console.log("\ndocs/ pronto");
