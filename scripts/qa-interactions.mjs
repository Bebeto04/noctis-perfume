// QA de interações e reversibilidade. Uso: node scripts/qa-interactions.mjs <outDir> [url]
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const [outDir, url = "http://localhost:3221/"] = process.argv.slice(2);
await mkdir(outDir, { recursive: true });
const shot = (page, name) => page.screenshot({ path: path.join(outDir, `${name}.png`) });
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

const browser = await chromium.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});

async function openStory(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...options });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && !m.text().includes("404") && errors.push(m.text()));
  await page.goto(url, { waitUntil: "networkidle" });
  return { context, page, errors };
}

const scrollU = (page, u) =>
  page.evaluate((units) => {
    const story = document.getElementById("story");
    window.scrollTo(0, story.offsetTop + (units * window.innerHeight) / 100);
  }, u);

const snapshot = (page) =>
  page.evaluate(() => {
    const r = document.querySelector("[data-rig]").getBoundingClientRect();
    const layers = {};
    document.querySelectorAll("[data-layer]").forEach((l) => {
      layers[l.dataset.layer] = getComputedStyle(l).transform;
    });
    return { rig: [r.x, r.y, r.width, r.height].map((n) => Math.round(n)), layers };
  });

// ------------------------------------------------------------------ narrativa
{
  const { context, page, errors } = await openStory();
  await page.waitForSelector(".preloader", { state: "detached", timeout: 30000 });
  await page.waitForTimeout(800);
  const initial = await snapshot(page);

  // notas de abertura
  await scrollU(page, 150);
  await page.waitForTimeout(1500);
  await page.hover('[data-note-anchor="bergamot"]');
  await page.waitForTimeout(500);
  const expanded = await page.getAttribute('[data-note-anchor="bergamot"]', "aria-expanded");
  check("hover em BERGAMOT expande a nota", expanded === "true");
  await shot(page, "i-opening-hover");

  // vista explodida
  await scrollU(page, 1010);
  await page.waitForTimeout(1600);
  const isExploded = await page.evaluate(() => document.querySelector(".scene").classList.contains("is-exploded"));
  check("estado explodido ativo no hold", isExploded);
  await page.hover('[data-hotspot="cap"]');
  await page.waitForTimeout(500);
  const active = await page.evaluate(() => document.querySelector(".scene").dataset.activePart);
  check("hover na tampa destaca a peça", active === "cap", `activePart=${active}`);
  await shot(page, "i-exploded-hover-cap");
  const capMoved = await page.evaluate(() => getComputedStyle(document.querySelector('[data-layer="cap"]')).transform);
  const bodyMoved = await page.evaluate(() => getComputedStyle(document.querySelector('[data-layer="body"]')).transform);
  check("tampa se move independente e o corpo fica parado", capMoved !== "none" && (bodyMoved === "none" || bodyMoved === "matrix(1, 0, 0, 1, 0, 0)"), `cap=${capMoved} body=${bodyMoved}`);
  await page.mouse.move(40, 450);

  // ida até o fim e volta rápida: nada pode ficar deslocado
  for (const u of [1300, 1780, 900, 300, 1100, 0]) {
    await scrollU(page, u);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(2200);
  const back = await snapshot(page);
  const layersOk = Object.entries(back.layers).every(([id, t]) => t === initial.layers[id]);
  const rigOk = back.rig.every((v, i) => Math.abs(v - initial.rig[i]) <= 2);
  check("scroll rápido de ida e volta sem drift nas camadas", layersOk, JSON.stringify(back.layers));
  check("frasco volta exatamente à pose do hero", rigOk, `inicial ${initial.rig} / final ${back.rig}`);

  // produto e sacola
  await scrollU(page, 1780);
  await page.waitForTimeout(1800);
  await page.click(".btn-add");
  await page.waitForTimeout(420);
  const flying = await page.locator(".bag-flight").count();
  check("clone voa até a sacola", flying === 1);
  await shot(page, "i-bag-flight");
  const rigDuring = await page.evaluate(() => getComputedStyle(document.querySelector("[data-rig]")).visibility);
  check("frasco principal permanece visível durante o voo", rigDuring === "visible");
  await page.waitForTimeout(1100);
  check("clone removido ao chegar", (await page.locator(".bag-flight").count()) === 0);
  const count = await page.textContent(".nav-bag-count");
  check("contador da sacola = 1", count?.trim() === "1", `count=${count}`);

  await page.click(".nav-bag");
  await page.waitForTimeout(600);
  check("gaveta abre como diálogo modal", await page.evaluate(() => document.querySelector("dialog.drawer").open));
  await shot(page, "i-drawer");
  await page.click('button[aria-label="Aumentar quantidade"]');
  await page.waitForTimeout(150);
  const sub = await page.textContent(".drawer-subtotal span:last-child");
  check("quantidade 2 → subtotal R$ 1.178", sub?.replace(/\s/g, " ").includes("1.178"), `subtotal=${sub}`);
  await page.click('button:has-text("Finalizar compra")');
  const demo = await page.textContent(".drawer-demo");
  check("checkout informa modo demonstração", !!demo && demo.length > 10);
  await page.click('button:has-text("Remover")');
  await page.waitForTimeout(150);
  check("remover esvazia a sacola", (await page.locator(".drawer-empty").count()) === 1);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  check("Esc fecha a gaveta", !(await page.evaluate(() => document.querySelector("dialog.drawer").open)));
  const focusBack = await page.evaluate(() => document.activeElement?.classList.contains("nav-bag"));
  check("foco volta ao botão da sacola", !!focusBack);

  // teclado: primeiro Tab vai ao skip link
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForSelector(".preloader", { state: "detached", timeout: 30000 });
  await page.keyboard.press("Tab");
  const firstTab = await page.evaluate(() => document.activeElement?.className);
  check("primeiro Tab = skip link", String(firstTab).includes("skip-link"), String(firstTab));

  check("sem erros de runtime", errors.length === 0, errors.join(" | "));
  await context.close();
}

// ------------------------------------------------------------------ movimento reduzido
{
  const { context, page, errors } = await openStory({ reducedMotion: "reduce" });
  await page.waitForTimeout(1500);
  check("reduced: sem preloader", (await page.locator(".preloader").count()) === 0);
  check("reduced: sem timeline pegajosa", (await page.locator(".scene").count()) === 0);
  check("reduced: todo o conteúdo presente", (await page.locator(".r-parts dt").count()) === 6);
  await shot(page, "r-top");
  await page.locator("#exploded").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await shot(page, "r-exploded");
  await page.click(".r-product .btn-add");
  await page.waitForTimeout(300);
  check("reduced: adicionar à sacola funciona", (await page.textContent(".nav-bag-count"))?.trim() === "1");
  check("reduced: sem erros", errors.length === 0, errors.join(" | "));
  await context.close();
}

// ------------------------------------------------------------------ toque (390px)
{
  const { context, page, errors } = await openStory({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
  });
  await page.waitForSelector(".preloader", { state: "detached", timeout: 30000 });
  await scrollU(page, 160);
  await page.waitForTimeout(1600);
  await page.tap('[data-note-anchor="saffron"]');
  await page.waitForTimeout(400);
  check("toque: SAFFRON expande a nota", (await page.getAttribute('[data-note-anchor="saffron"]', "aria-expanded")) === "true");
  await scrollU(page, 1000);
  await page.waitForTimeout(1600);
  await page.tap('[data-hotspot="cap"]');
  await page.waitForTimeout(400);
  const part = await page.evaluate(() => document.querySelector(".scene").dataset.activePart);
  check("toque: tampa fixada no explodido", part === "cap", `activePart=${part}`);
  await page.click(".nav-menu-button");
  await page.waitForTimeout(400);
  check("toque: menu abre como diálogo", await page.evaluate(() => document.querySelector("dialog.menu-sheet").open));
  await page.click('.menu-sheet-list a:has-text("Criação")');
  await page.waitForTimeout(1500);
  check("toque: menu fecha ao navegar", !(await page.evaluate(() => document.querySelector("dialog.menu-sheet").open)));
  check("toque: sem erros", errors.length === 0, errors.join(" | "));
  await context.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passaram`);
process.exit(failed.length ? 1 : 0);
