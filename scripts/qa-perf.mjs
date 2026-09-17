// Mede tempos de quadro durante scroll contínuo por trechos da história.
// Uso: node scripts/qa-perf.mjs [url] [WxH]
import { chromium } from "playwright-core";

const [url = "http://localhost:3221/", size = "1440x900"] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
  args: ["--enable-gpu-rasterization", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForSelector(".preloader", { state: "detached", timeout: 30000 });
await page.waitForTimeout(800);

const segments = [
  ["hero→opening", 0, 200],
  ["dive+iris", 200, 360],
  ["inside", 360, 640],
  ["explode", 740, 1000],
  ["reassemble+words", 1060, 1470],
  ["reveal→product", 1470, 1780],
];

for (const [name, a, b] of segments) {
  const r = await page.evaluate(
    async ({ a, b }) => {
      const story = document.getElementById("story");
      const vh = window.innerHeight;
      const start = story.offsetTop + (a * vh) / 100;
      const end = story.offsetTop + (b * vh) / 100;
      window.scrollTo(0, start);
      await new Promise((r) => setTimeout(r, 900));
      const frames = [];
      let longTasks = 0;
      const obs = new PerformanceObserver((l) => (longTasks += l.getEntries().length));
      try {
        obs.observe({ entryTypes: ["longtask"] });
      } catch {}
      const duration = 3000;
      const t0 = performance.now();
      let last = t0;
      await new Promise((resolve) => {
        const step = (now) => {
          frames.push(now - last);
          last = now;
          const p = Math.min(1, (now - t0) / duration);
          window.scrollTo(0, start + (end - start) * p);
          if (p < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
      obs.disconnect();
      frames.shift();
      frames.sort((x, y) => x - y);
      const pct = (q) => frames[Math.floor(frames.length * q)];
      return {
        frames: frames.length,
        median: +pct(0.5).toFixed(1),
        p95: +pct(0.95).toFixed(1),
        worst: +frames[frames.length - 1].toFixed(1),
        over33: frames.filter((f) => f > 33.4).length,
        longTasks,
      };
    },
    { a, b },
  );
  console.log(name.padEnd(18), JSON.stringify(r));
}
await browser.close();
