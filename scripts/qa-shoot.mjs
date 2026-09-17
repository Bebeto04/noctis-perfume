// QA visual: percorre a narrativa em Edge headless e fotografa momentos-chave.
// Uso: node scripts/qa-shoot.mjs <outDir> <WxH> [url] [pontos em vh separados por vírgula]
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const [outDir, size = "1440x900", url = "http://localhost:3220/", pointsArg] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
const points = (pointsArg ?? "0,60,150,240,300,330,380,440,510,580,700,860,1010,1150,1240,1300,1380,1440,1520,1580,1690,1780")
  .split(",")
  .map(Number);
const mobile = width < 700;

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
  hasTouch: mobile,
  isMobile: mobile,
});
const page = await context.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForSelector(".preloader", { state: "detached", timeout: 30000 });
await page.waitForTimeout(600);

for (const u of points) {
  const y = await page.evaluate((units) => {
    const story = document.getElementById("story");
    if (!story) return 0;
    const top = story.offsetTop + (units * window.innerHeight) / 100;
    window.scrollTo(0, top);
    return top;
  }, u);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, `u${String(u).padStart(4, "0")}.png`) });
  process.stdout.write(`${u}@${Math.round(y)} `);
}
// rodapé
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1200);
await page.screenshot({ path: path.join(outDir, "footer.png") });

console.log("\nerrors:", errors.length ? errors : "none");
await browser.close();
