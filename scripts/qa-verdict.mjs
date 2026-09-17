// Capturas direcionadas para a verificação final. Uso: node scripts/qa-verdict.mjs <outDir> [url]
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const [outDir, url = "http://localhost:3221/"] = process.argv.slice(2);
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});

const scrollU = (page, u) =>
  page.evaluate((units) => {
    const story = document.getElementById("story");
    window.scrollTo(0, story.offsetTop + (units * window.innerHeight) / 100);
  }, u);

for (const [w, h] of [
  [1440, 900],
  [390, 844],
]) {
  const mobile = w < 700;
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: mobile, isMobile: mobile });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForSelector(".preloader", { state: "detached", timeout: 30000 });
  const shot = (name) => page.screenshot({ path: path.join(outDir, `${w}-${name}.png`) });

  await scrollU(page, 160);
  await page.waitForTimeout(1600);
  await shot("opening");
  if (mobile) await page.tap('[data-note-anchor="saffron"]');
  else await page.hover('[data-note-anchor="saffron"]');
  await page.waitForTimeout(900);
  await shot("opening-active-saffron");

  await scrollU(page, 1000);
  await page.waitForTimeout(1600);
  await shot("exploded");

  await scrollU(page, 1780);
  await page.waitForTimeout(1600);
  await shot("product");

  if (mobile) {
    await page.click(".nav-menu-button");
    await page.waitForTimeout(500);
    await shot("menu-open");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1200);
  await shot("footer");
  await page.close();
}
await browser.close();
console.log("done");
