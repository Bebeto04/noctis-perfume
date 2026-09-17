import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { SlowMo } from "gsap/EasePack";
import { SplitText } from "gsap/SplitText";
import {
  ASSEMBLY,
  EXPLODED,
  EXPLODED_COMPACT,
  EXPLODED_EXTENT,
  LAYER_ORDER,
  STAGE,
  layerBox,
  type LayerId,
} from "@/config/perfumeAssemblyConfig";
import { DIVE_FOCUS, POSES, RIG_BASE_HEIGHT, STORY, type Layout, type Pose, type Range } from "@/config/storyConfig";
import { PARTS, PERSONALITY } from "@/config/siteConfig";
import { explodedTransform } from "../noctis/PerfumeAssembly";

gsap.registerPlugin(ScrollTrigger, CustomEase, SlowMo, SplitText);

// Curvas do sistema (mesmas do CSS): entrada forte e movimento em tela
CustomEase.create("noctis.out", "0.23,1,0.32,1");
CustomEase.create("noctis.inOut", "0.77,0,0.175,1");

export type PartId = (typeof PARTS)[number]["id"];
export type Chapter = "hero" | "opening" | "heart" | "craft" | "exploded" | "personality" | "reveal" | "product";

interface BuildOptions {
  container: HTMLElement;
  scene: HTMLElement;
  layout: Layout;
  onChapter: (c: Chapter) => void;
  /** estado da vista explodida: ativa/inativa e, no toque, a peça indicada pelo scroll */
  onExploded: (active: boolean) => void;
  onScrollPart: (id: PartId | null) => void;
  /** controle do reveal: a timeline passeia com a luz enquanto o usuário não a conduz */
  revealProxy: { x: number; y: number; r: number; apply: () => void };
}

const span = (r: Range) => r[1] - r[0];

export function buildNoctisTimeline(o: BuildOptions) {
  const { container, scene, layout } = o;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const compact = layout !== "desktop";
  const P = POSES[layout];
  const rigH = RIG_BASE_HEIGHT * vh;
  const unit = rigH / STAGE.height; // px por unidade do palco, escala 1

  document.documentElement.style.setProperty("--rig-h", `${rigH}px`);
  document.documentElement.style.setProperty("--scene-h", `${vh}px`);
  container.style.height = `${((STORY.length + 100) * vh) / 100}px`;

  const q = <T extends Element = HTMLElement>(sel: string) => Array.from(scene.querySelectorAll<T & HTMLElement>(sel));
  const one = <T extends Element = HTMLElement>(sel: string) => scene.querySelector<T & HTMLElement>(sel)!;

  const rig = one("[data-rig]");
  const layer = (id: LayerId) => one(`[data-layer="${id}"]`);
  const pose = (p: Pose) => ({ x: p.x * vw, y: p.y * vh, scale: p.scale, rotation: p.rotation });

  // Pose explodida: centraliza a extensão vertical do conjunto desmontado
  const extentCenter = (EXPLODED_EXTENT.top + EXPLODED_EXTENT.bottom) / 2;
  const explodedPose = {
    ...pose(P.exploded),
    y: P.exploded.y * vh + (STAGE.height / 2 - extentCenter) * unit * P.exploded.scale,
  };

  /** posição na viewport (px) de um ponto do palco sob uma pose */
  const toViewport = (u: number, v: number, ps: { x: number; y: number; scale: number }) => ({
    x: vw / 2 + ps.x + (u - STAGE.width / 2) * unit * ps.scale,
    y: vh / 2 + ps.y + (v - STAGE.height / 2) * unit * ps.scale,
  });

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: STORY.scrub,
    },
  });

  const to = (t: gsap.TweenTarget, r: Range, vars: gsap.TweenVars) => tl.to(t, { duration: span(r), ...vars }, r[0]);
  const fromTo = (t: gsap.TweenTarget, r: Range, from: gsap.TweenVars, vars: gsap.TweenVars) =>
    tl.fromTo(t, from, { duration: span(r), immediateRender: false, ...vars }, r[0]);

  /** gatilho auxiliar para um intervalo da história (estados, capítulos) */
  const rangeTrigger = (r: Range, vars: Omit<ScrollTrigger.Vars, "trigger" | "start" | "end">) =>
    ScrollTrigger.create({
      trigger: container,
      start: `top+=${(r[0] * vh) / 100} top`,
      end: `top+=${(r[1] * vh) / 100} top`,
      ...vars,
    });

  // ---------------------------------------------------------------- estados iniciais
  gsap.set(rig, { ...pose(P.hero), autoAlpha: 1, filter: "none", transformOrigin: "50% 50%" });
  for (const id of LAYER_ORDER) gsap.set(layer(id), { xPercent: 0, yPercent: 0, rotation: ASSEMBLY[id].rotation });

  const halo = one("[data-halo]");
  gsap.set(halo, { x: 0, y: P.hero.y * vh, scale: 1, autoAlpha: 1 });

  // ---------------------------------------------------------------- HERO → THE OPENING
  const heroMast = one("[data-hero-masthead]");
  const heroCopy = q("[data-hero-copy]");
  to(heroMast, STORY.hero.textOut, { y: -0.14 * vh, autoAlpha: 0, ease: "power1.in" });
  to(heroCopy, STORY.hero.textOut, { y: -0.06 * vh, autoAlpha: 0, ease: "power1.in" });
  to(one("[data-scroll-cue]"), STORY.hero.scrollCue, { autoAlpha: 0 });

  fromTo(rig, STORY.opening.bottleIn, pose(P.hero), { ...pose(P.opening), ease: "noctis.inOut" });
  to(halo, STORY.opening.bottleIn, { x: P.opening.x * vw, y: P.opening.y * vh, scale: 0.8, ease: "noctis.inOut" });

  const openingTitle = one("[data-opening-title]");
  const notes = q("[data-opening-note]");
  const openingCopy = one("[data-opening-copy]");
  const glyphs = q("[data-note-glyph]");

  // posiciona cada glifo ao lado de sua palavra (medido antes de qualquer deslocamento)
  const bottleCenter = toViewport(500, 820, pose(P.opening));
  const glyphSize = layout === "mobile" ? 34 : 56;
  const glyphFrom: { x: number; y: number }[] = [];
  glyphs.forEach((g, i) => {
    const anchor = scene.querySelector<HTMLElement>(`[data-note-anchor="${g.dataset.noteGlyph}"]`);
    const rect = anchor?.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();
    const left = rect ? rect.left - sceneRect.left - glyphSize - (layout === "mobile" ? 10 : 22) : 0;
    const top = rect ? rect.top - sceneRect.top + rect.height / 2 - glyphSize / 2 : 0;
    gsap.set(g, { left, top, width: glyphSize, height: glyphSize });
    glyphFrom[i] = { x: bottleCenter.x - (left + glyphSize / 2), y: bottleCenter.y - (top + glyphSize / 2) + i * 18 };
  });

  gsap.set([openingTitle, ...notes, openingCopy], { autoAlpha: 0, y: 36 });
  to(openingTitle, STORY.opening.title, { autoAlpha: 1, y: 0, ease: "noctis.out" });
  notes.forEach((n, i) => {
    const r: Range = [STORY.opening.notes[0] + i * 14, STORY.opening.notes[0] + i * 14 + 50];
    to(n, r, { autoAlpha: 1, y: 0, ease: "noctis.out" });
  });
  glyphs.forEach((g, i) => {
    // nascem grandes, atrás do vidro, e encolhem até virar índice da palavra
    gsap.set(g, { x: glyphFrom[i].x, y: glyphFrom[i].y, scale: 2.4, autoAlpha: 0, rotation: -40 });
    const start = STORY.opening.notes[0] - 8 + i * 14;
    // x e y com curvas diferentes → trajetória curva saindo de trás do frasco
    to(g, [start, start + 64], { x: 0, ease: "noctis.out" });
    to(g, [start, start + 64], { y: 0, ease: "sine.inOut" });
    to(g, [start, start + 40], { autoAlpha: 1, scale: 1, rotation: 0, ease: "noctis.out" });
  });
  to(openingCopy, STORY.opening.copy, { autoAlpha: 1, y: 0, ease: "noctis.out" });

  // aura: nasce de trás do frasco já na pose da abertura
  const aura = one("[data-opening-aura]");
  const auraSize = RIG_BASE_HEIGHT * vh * P.opening.scale * 1.05;
  const auraCenter = toViewport(500, 860, pose(P.opening));
  gsap.set(aura, {
    left: auraCenter.x - auraSize / 2,
    top: auraCenter.y - auraSize / 2,
    width: auraSize,
    height: auraSize,
    autoAlpha: 0,
    scale: 0.45,
    rotation: -24,
  });
  to(aura, [STORY.opening.notes[0] - 20, STORY.opening.notes[0] + 60], {
    autoAlpha: 1,
    scale: 1,
    rotation: 0,
    ease: "noctis.out",
  });
  to(aura, STORY.opening.out, { autoAlpha: 0, scale: 1.15, ease: "power1.in" });

  rangeTrigger(STORY.opening.interactive, {
    onToggle: (self) => scene.classList.toggle("notes-live", self.isActive),
  });

  to([openingTitle, ...notes, openingCopy], STORY.opening.out, { autoAlpha: 0, y: -30, ease: "power1.in" });
  to(glyphs, STORY.opening.out, { autoAlpha: 0, scale: 0.6, ease: "power1.in" });

  // ---------------------------------------------------------------- MERGULHO
  fromTo(rig, STORY.dive.center, pose(P.opening), { ...pose(P.diveStart), ease: "noctis.inOut" });
  to(halo, STORY.dive.center, { x: 0, y: 0, scale: 1.1, ease: "noctis.inOut" });

  const S = DIVE_FOCUS.scale;
  const fx = (DIVE_FOCUS.x - STAGE.width / 2) * unit;
  const fy = (DIVE_FOCUS.y - STAGE.height / 2) * unit;
  fromTo(rig, STORY.dive.zoom, pose(P.diveStart), {
    x: -fx * S,
    y: -fy * S,
    scale: S,
    rotation: 0,
    ease: "power2.in",
  });
  to(halo, [STORY.dive.zoom[0], STORY.dive.zoom[0] + 50], { autoAlpha: 0 });
  to(one("[data-rig-shadow]"), [STORY.dive.zoom[0], STORY.dive.zoom[0] + 30], { autoAlpha: 0 });

  const inside = one("[data-inside]");
  // íris de borda suave: a máscara radial cresce a partir do centro da janela de vidro
  const irisMask = "radial-gradient(circle at 50% 50%, #000 var(--iris), rgb(0 0 0 / 0) calc(var(--iris) + 22%))";
  gsap.set(inside, { autoAlpha: 0, "--iris": "0%", maskImage: irisMask, webkitMaskImage: irisMask });
  to(inside, [STORY.dive.iris[0], STORY.dive.iris[0] + 18], { autoAlpha: 1 });
  to(inside, STORY.dive.iris, { "--iris": "100%", ease: "power2.in" });
  // aberta: remove a máscara para não recompor a camada inteira a cada quadro
  tl.set(inside, { maskImage: "none", webkitMaskImage: "none" }, STORY.dive.iris[1] + 0.5);
  tl.set(rig, { filter: "blur(0px)" }, STORY.dive.blur[0] - 0.01);
  // o filtro vem antes da escala 4,6×: 6px aqui já lê como ~28px na tela
  to(rig, STORY.dive.blur, { filter: "blur(6px)", ease: "power1.in" });
  tl.set(rig, { autoAlpha: 0 }, STORY.dive.blur[1]);

  // ---------------------------------------------------------------- DENTRO DO NOCTIS
  const insideTitle = one("[data-inside-title]");
  // as letras se aproximam com transform (animar letter-spacing forçaria layout a cada quadro)
  const split = SplitText.create(insideTitle, { type: "chars" });
  const mid = (split.chars.length - 1) / 2;
  const em = parseFloat(getComputedStyle(insideTitle).fontSize);
  gsap.set(insideTitle, { autoAlpha: 0, scale: 1.12 });
  gsap.set(split.chars, { x: (i: number) => (i - mid) * 0.38 * em });
  const titleIn: Range = [STORY.inside.title[0], STORY.inside.title[0] + 40];
  to(insideTitle, titleIn, { autoAlpha: 1, scale: 1, ease: "noctis.out" });
  to(split.chars, titleIn, { x: 0, ease: "noctis.out" });
  to(insideTitle, [STORY.inside.title[1] + 10, STORY.inside.title[1] + 45], { autoAlpha: 0, y: -0.08 * vh });

  const jasmine = one('[data-heart="jasmine"]');
  const cedar = one('[data-heart="cedarwood"]');
  const iris = one('[data-heart="iris"]');
  // três movimentos diferentes: lateral, vertical, foco
  gsap.set(jasmine, { x: -vw, autoAlpha: 1 });
  to(jasmine, STORY.inside.jasmine, { x: vw, ease: "slow(0.62, 0.82, false)" });
  gsap.set(cedar, { y: vh, autoAlpha: 1 });
  to(cedar, STORY.inside.cedarwood, { y: -vh, ease: "slow(0.62, 0.82, false)" });
  gsap.set(iris, { autoAlpha: 0, filter: "blur(10px)", scale: 1.1 });
  to(iris, [STORY.inside.iris[0], STORY.inside.iris[0] + 50], {
    autoAlpha: 1,
    filter: "blur(0px)",
    scale: 1,
    ease: "noctis.out",
  });

  const leaks = q("[data-leak]");
  leaks.forEach((l, i) => {
    const dir = i % 2 ? 1 : -1;
    to(l, STORY.inside.leaks, { x: dir * vw * 0.18, y: -dir * vh * 0.12, rotation: dir * 25, scale: 1.25 });
  });

  const insideDark = one("[data-inside-dark]");
  gsap.set(insideDark, { autoAlpha: 0 });
  to(insideDark, STORY.inside.darken, { autoAlpha: 1, ease: "power1.inOut" });
  tl.set(inside, { autoAlpha: 0 }, STORY.inside.darken[1] + 0.5);

  // ---------------------------------------------------------------- CRAFTED TO LAST
  fromTo(
    rig,
    STORY.craft.bottleBack,
    { x: 0, y: 0, scale: 2.2, rotation: 0, autoAlpha: 0, filter: "blur(8px)" },
    { ...pose(P.crafted), autoAlpha: 1, filter: "blur(0px)", ease: "noctis.out" },
  );
  tl.set(rig, { filter: "none" }, STORY.craft.bottleBack[1] + 0.01);
  fromTo(
    halo,
    STORY.craft.bottleBack,
    { autoAlpha: 0 },
    { autoAlpha: 1, x: P.crafted.x * vw, y: P.crafted.y * vh, scale: 0.9, ease: "noctis.out" },
  );
  to(one("[data-rig-shadow]"), STORY.craft.bottleBack, { autoAlpha: 1 });

  const craftTitle = one("[data-craft-title]");
  gsap.set(craftTitle, { autoAlpha: 0, y: 40 });
  to(craftTitle, STORY.craft.title, { autoAlpha: 1, y: 0, ease: "noctis.out" });
  to(craftTitle, STORY.craft.out, { autoAlpha: 0, y: -30, ease: "power1.in" });

  // ---------------------------------------------------------------- VISTA EXPLODIDA
  fromTo(rig, STORY.explode.frame, pose(P.crafted), { ...explodedPose, ease: "noctis.inOut" });
  to(halo, STORY.explode.frame, { x: explodedPose.x, y: explodedPose.y, scale: 1.25, autoAlpha: 0.7, ease: "noctis.inOut" });
  to([one("[data-cap-contact]"), one("[data-rig-shadow]"), one("[data-sheen]")], [
    STORY.explode.cap[0],
    STORY.explode.cap[0] + 20,
  ], { autoAlpha: 0 });

  const order: [LayerId, Range][] = [
    ["cap", STORY.explode.cap],
    ["atomizer", STORY.explode.atomizer],
    ["collar", STORY.explode.collar],
    ["label", STORY.explode.label],
    ["liquid", STORY.explode.liquid],
  ];
  for (const [id, r] of order) {
    to(layer(id), r, { ...explodedTransform(id, compact), ease: "noctis.inOut" });
  }

  // anotações: posições calculadas a partir da pose explodida
  layoutAnnotations({ scene, layout, vw, vh, unit, explodedPose, compact });
  const annotationWrap = one("[data-annotations]");
  const lines = q<SVGPathElement>("[data-annotation-line]");
  const dots = q<SVGCircleElement>("[data-annotation-dot]");
  const crosses = q<SVGPathElement>("[data-annotation-cross]");
  const annTexts = q("[data-annotation]");
  gsap.set(annotationWrap, { autoAlpha: 0 });
  gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set([...dots, ...crosses], { autoAlpha: 0 });
  gsap.set(annTexts, { autoAlpha: 0, y: 14 });
  tl.set(annotationWrap, { autoAlpha: 1 }, STORY.explode.lines[0]);
  lines.forEach((l, i) => {
    const s = STORY.explode.lines[0] + i * 7;
    to(dots[i], [s, s + 8], { autoAlpha: 1 });
    to(l, [s, s + 26], { strokeDashoffset: 0, ease: "noctis.inOut" });
    to([annTexts[i], crosses[i]], [s + 16, s + 36], { autoAlpha: 1, y: 0, ease: "noctis.out" });
  });

  rangeTrigger(STORY.explode.hold, {
    onToggle: (self) => {
      scene.classList.toggle("is-exploded", self.isActive);
      o.onExploded(self.isActive);
    },
    onUpdate: (self) => {
      if (layout === "desktop") return;
      const idx = Math.min(PARTS.length - 1, Math.floor(self.progress * PARTS.length));
      o.onScrollPart(PARTS[idx].id);
    },
  });

  // ---------------------------------------------------------------- REMONTAGEM
  to([...annTexts, ...crosses, ...dots], STORY.reassemble.linesOut, { autoAlpha: 0 });
  to(lines, STORY.reassemble.linesOut, { strokeDashoffset: -1 });
  tl.set(annotationWrap, { autoAlpha: 0 }, STORY.reassemble.linesOut[1]);

  const back: [LayerId, Range][] = [
    ["liquid", STORY.reassemble.liquid],
    ["label", STORY.reassemble.label],
    ["collar", STORY.reassemble.collar],
    ["atomizer", STORY.reassemble.atomizer],
    ["cap", STORY.reassemble.cap],
  ];
  for (const [id, r] of back) {
    to(layer(id), r, { xPercent: 0, yPercent: 0, rotation: ASSEMBLY[id].rotation, ease: "noctis.inOut" });
  }
  // o encaixe da tampa: a sombra de contato volta e a luz atravessa o vidro uma vez
  to([one("[data-cap-contact]"), one("[data-sheen]")], [STORY.reassemble.cap[1] - 4, STORY.reassemble.cap[1] + 6], {
    autoAlpha: 1,
  });
  const click = one("[data-sheen-click]");
  gsap.set(click, { xPercent: -120, skewX: -16 });
  fromTo(click, STORY.reassemble.click, { xPercent: -120 }, { xPercent: 520, ease: "power2.inOut" });

  // ---------------------------------------------------------------- PERSONALIDADE
  fromTo(rig, STORY.personality.bottle, explodedPose, { ...pose(P.personality), ease: "noctis.inOut" });
  to(one("[data-rig-shadow]"), STORY.personality.bottle, { autoAlpha: 1 });
  to(halo, STORY.personality.bottle, {
    x: P.personality.x * vw,
    y: P.personality.y * vh,
    scale: 0.9,
    autoAlpha: 1,
    ease: "noctis.inOut",
  });
  fromTo(
    rig,
    [STORY.personality.bottle[1], STORY.reveal.bottleOut[0]],
    pose(P.personality),
    pose(P.personalityEnd),
  );

  const personality = one("[data-personality]");
  gsap.set(personality, { autoAlpha: 0, y: 40 });
  to(personality, STORY.personality.title, { autoAlpha: 1, y: 0, ease: "noctis.out" });
  to(personality, STORY.personality.out, { autoAlpha: 0, y: -30 });

  // eixo do frasco: a cópia da frente só existe à direita dele
  const axis = vw / 2 + P.personality.x * vw;
  const front = one("[data-words-front]");
  front.style.clipPath = `inset(0 0 0 ${Math.round(axis)}px)`;
  const wordsBack = q("[data-words-back] [data-word]");
  const wordsFront = q("[data-words-front] [data-word]");
  PERSONALITY.forEach((w, i) => {
    const copies = [...wordsBack, ...wordsFront].filter((el) => el.dataset.word === w);
    if (!copies.length) return;
    const width = copies[0].getBoundingClientRect().width;
    const dir = i % 2 ? -1 : 1; // alterna o sentido
    const fromX = dir > 0 ? vw + 40 : -width - 40;
    const toX = dir > 0 ? -width - 40 : vw + 40;
    gsap.set(copies, { x: fromX, autoAlpha: 1 });
    const len = span(STORY.personality.words);
    const s = STORY.personality.words[0] + (i * len) / (PERSONALITY.length + 1.2);
    to(copies, [s, s + len * 0.42], { x: toX });
  });

  // ---------------------------------------------------------------- REVEAL
  fromTo(rig, STORY.reveal.bottleOut, pose(P.personalityEnd), { ...pose(P.revealOut), ease: "power2.in" });
  to(halo, STORY.reveal.bottleOut, { autoAlpha: 0 });

  const reveal = one("[data-reveal]");
  gsap.set(reveal, { autoAlpha: 0 });
  to(reveal, STORY.reveal.in, { autoAlpha: 1 });
  const proxy = o.revealProxy;
  proxy.x = 0.3;
  proxy.y = 0.62;
  proxy.r = 0;
  proxy.apply();
  to(proxy, STORY.reveal.in, { r: layout === "mobile" ? 0.24 : 0.17, onUpdate: proxy.apply, ease: "noctis.out" });
  to(proxy, STORY.reveal.wander, { x: 0.72, onUpdate: proxy.apply, ease: "sine.inOut" });
  to(proxy, STORY.reveal.wander, { y: 0.34, onUpdate: proxy.apply, ease: "power1.inOut" });
  rangeTrigger([STORY.reveal.in[0], STORY.reveal.out[1]], {
    onToggle: (self) => scene.classList.toggle("reveal-live", self.isActive),
  });
  to(reveal, STORY.reveal.out, { autoAlpha: 0 });

  // ---------------------------------------------------------------- PRODUTO
  const surface = one("[data-product-surface]");
  gsap.set(surface, { autoAlpha: 0 });
  to(surface, STORY.product.surface, { autoAlpha: 1 });

  fromTo(
    rig,
    STORY.product.descend,
    { x: P.product.x * vw, y: -1.05 * vh, scale: P.product.scale, rotation: -4 },
    { ...pose(P.product), ease: "power3.out" },
  );
  const shadow = one("[data-rig-shadow]");
  tl.set(shadow, { autoAlpha: 0 }, STORY.product.descend[0]);
  fromTo(
    shadow,
    // a sombra cresce enquanto o frasco se aproxima do chão, não depois
    [STORY.product.descend[0] + 10, STORY.product.descend[0] + 60],
    { autoAlpha: 0, scaleX: 0.4 },
    { autoAlpha: 1, scaleX: 1, ease: "noctis.out" },
  );
  fromTo(
    halo,
    STORY.product.descend,
    { autoAlpha: 0, x: P.product.x * vw, y: P.product.y * vh },
    { autoAlpha: 0.8, scale: 0.85, ease: "power3.out" },
  );

  const info = q("[data-product-info]");
  gsap.set(info, { autoAlpha: 0, y: 30 });
  info.forEach((el, i) => {
    const s = STORY.product.info[0] + i * 9;
    to(el, [s, s + 30], { autoAlpha: 1, y: 0, ease: "noctis.out" });
  });

  // ---------------------------------------------------------------- CAPÍTULOS (navegação)
  const chapters: [Chapter, Range][] = [
    ["hero", [0, 60]],
    ["opening", [60, 245]],
    ["heart", [245, 640]],
    ["craft", [640, 790]],
    ["exploded", [790, 1240]],
    ["personality", [1240, 1480]],
    ["reveal", [1480, 1640]],
    ["product", [1640, STORY.length + 100]],
  ];
  for (const [c, r] of chapters) {
    rangeTrigger(r, { onToggle: (self) => self.isActive && o.onChapter(c) });
  }

  return tl;
}

// ---------------------------------------------------------------------------------------------
// anotações da vista explodida
// ---------------------------------------------------------------------------------------------

interface AnnotationLayout {
  scene: HTMLElement;
  layout: Layout;
  vw: number;
  vh: number;
  unit: number;
  explodedPose: { x: number; y: number; scale: number };
  compact: boolean;
}

function layoutAnnotations({ scene, layout, vw, vh, unit, explodedPose, compact }: AnnotationLayout) {
  const svg = scene.querySelector<SVGSVGElement>("[data-annotation-svg]")!;
  svg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);
  svg.setAttribute("width", String(vw));
  svg.setAttribute("height", String(vh));

  const offsets = compact ? EXPLODED_COMPACT : EXPLODED;
  const k = unit * explodedPose.scale;
  const cx = vw / 2 + explodedPose.x;
  const cy = vh / 2 + explodedPose.y;
  const partCenter = (id: LayerId) => ({
    x: cx + (ASSEMBLY[id].x + offsets[id].x - STAGE.width / 2) * k,
    y: cy + (ASSEMBLY[id].y + offsets[id].y - STAGE.height / 2) * k,
    w: layerBox(id).width * k,
    h: layerBox(id).height * k,
  });

  // pontos de ancoragem visuais por peça (fração da caixa, a partir do centro)
  const anchorOf: Record<LayerId, { dx: number; dy: number }> = {
    cap: { dx: 0.36, dy: 0.05 },
    atomizer: { dx: 0.2, dy: -0.18 },
    collar: { dx: 0.44, dy: 0 },
    body: { dx: 0.47, dy: -0.12 },
    liquid: { dx: 0.4, dy: 0.1 },
    label: { dx: -0.5, dy: 0.32 },
  };

  const bodyC = partCenter("body");
  const columnX = cx + (bodyC.w / 2) + (layout === "desktop" ? Math.min(90, vw * 0.06) : 24);
  const leftColumnX = partCenter("label").x - partCenter("label").w / 2 - 36;

  // coluna da direita: linhas de texto com distância mínima (os blocos têm ~80px de altura)
  const MIN_GAP = 96;
  const rowY: Partial<Record<LayerId, number>> = {};
  let previous = -Infinity;
  for (const id of ["cap", "atomizer", "collar", "body", "liquid"] as LayerId[]) {
    const c = partCenter(id);
    const a = anchorOf[id];
    const natural = id === "body" ? c.y - c.h * 0.12 : c.y + a.dy * c.h;
    const y = Math.max(natural, previous + MIN_GAP);
    rowY[id] = y;
    previous = y;
  }

  for (const p of PARTS) {
    const id = p.id as LayerId;
    const c = partCenter(id);
    const a = anchorOf[id];
    const ax = c.x + a.dx * c.w;
    const ay = c.y + a.dy * c.h;
    const text = scene.querySelector<HTMLElement>(`[data-annotation="${id}"]`)!;
    const line = scene.querySelector<SVGPathElement>(`[data-annotation-line="${id}"]`)!;
    const dot = scene.querySelector<SVGCircleElement>(`[data-annotation-dot="${id}"]`)!;
    const cross = scene.querySelector<SVGPathElement>(`[data-annotation-cross="${id}"]`)!;
    dot.setAttribute("cx", String(ax));
    dot.setAttribute("cy", String(ay));

    // hotspot sobre a peça
    const hot = scene.querySelector<HTMLElement>(`[data-hotspot="${id}"]`)!;
    const hw = id === "body" ? c.w * 0.8 : c.w * 0.92;
    const hh = id === "body" ? c.h * 0.86 : c.h * 0.92;
    Object.assign(hot.style, {
      left: `${c.x - hw / 2}px`,
      top: `${c.y - hh / 2}px`,
      width: `${hw}px`,
      height: `${hh}px`,
    });

    if (layout !== "desktop") {
      // telas estreitas: marcador curto + nome da peça ao lado; a descrição vai para a legenda inferior
      const left = id === "label";
      line.setAttribute("d", `M${ax} ${ay} h${left ? -14 : 14}`);
      cross.setAttribute("d", "");
      text.classList.add("is-compact");
      Object.assign(text.style, left
        ? { left: `${ax - 20 - 120}px`, top: `${ay - 9}px`, width: "120px", textAlign: "right" }
        : { left: `${ax + 20}px`, top: `${ay - 9}px`, width: "120px", textAlign: "left" });
      continue;
    }
    text.classList.remove("is-compact");

    if (id === "label") {
      const tx = leftColumnX;
      const ty = c.y + c.h / 2 + 46;
      line.setAttribute("d", `M${ax} ${ay} L${ax - 18} ${ay} L${ax - 18} ${ty - 10}`);
      cross.setAttribute("d", crossPath(ax - 18, ty - 10));
      Object.assign(text.style, { left: `${tx - 220}px`, top: `${ty}px`, width: "220px", textAlign: "right" });
    } else {
      const ty = rowY[id] ?? ay;
      const elbow = columnX - 16;
      line.setAttribute("d", `M${ax} ${ay} L${elbow - 22} ${ay} L${elbow} ${ty}`);
      cross.setAttribute("d", crossPath(elbow, ty));
      Object.assign(text.style, { left: `${columnX + 8}px`, top: `${ty - 12}px`, width: "240px", textAlign: "left" });
    }
  }
}

const crossPath = (x: number, y: number) => `M${x - 6} ${y} h12 M${x} ${y - 6} v12`;
