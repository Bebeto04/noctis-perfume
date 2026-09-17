"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PerfumeAssembly } from "../noctis/PerfumeAssembly";
import { Hero } from "../sections/Hero";
import { OpeningNotes } from "../sections/OpeningNotes";
import { InsideNoctis } from "../sections/InsideNoctis";
import { CraftSection } from "../sections/CraftSection";
import { PersonalityBack, PersonalityFront } from "../sections/PersonalitySection";
import { FeelReveal } from "../sections/FeelReveal";
import { ProductSection, ProductSurface } from "../sections/ProductSection";
import { buildNoctisTimeline, type Chapter, type PartId } from "./buildTimeline";
import { CHAPTER_ANCHORS, layoutFor, type ChapterId } from "@/config/storyConfig";

export interface NoctisStoryHandle {
  /** instant: salta sem animar (ações de teclado) */
  scrollToChapter: (c: ChapterId, instant?: boolean) => void;
  /** elemento do frasco contínuo (origem visual do voo para a sacola) */
  rig: () => HTMLElement | null;
}

interface Props {
  onChapter: (c: Chapter) => void;
  onAdd: () => void;
  addBusy: boolean;
  onNavigate: (c: ChapterId) => void;
  /** chamado quando a timeline já foi montada e medida */
  onBuilt?: () => void;
}

const FOLIO: Record<Chapter, { title: string; page: string }> = {
  hero: { title: "Capa", page: "01" },
  opening: { title: "A Abertura", page: "02" },
  heart: { title: "O Coração", page: "03" },
  craft: { title: "Feito para Durar", page: "04" },
  exploded: { title: "Anatomia", page: "05" },
  personality: { title: "Quem é NOCTIS", page: "06" },
  reveal: { title: "Sensação", page: "07" },
  product: { title: "O Frasco", page: "08" },
};

const DEPTH: Record<string, number> = { cap: 1.6, atomizer: 1.2, collar: 1.1, label: 1.35, body: 0.4, liquid: 0 };

export const NoctisStory = forwardRef<NoctisStoryHandle, Props>(function NoctisStory({ onChapter, onAdd, addBusy, onNavigate, onBuilt }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLElement>(null);
  const [activePart, setActivePart] = useState<PartId | null>(null);
  const [folio, setFolio] = useState<Chapter>("hero");
  const exploded = useRef(false);
  const pinnedPart = useRef<"tap" | "focus" | "pointer" | null>(null);
  const onChapterRef = useRef(onChapter);
  const onBuiltRef = useRef(onBuilt);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => {
    onChapterRef.current = onChapter;
    onBuiltRef.current = onBuilt;
  }, [onChapter, onBuilt]);

  // controle do reveal (valores normalizados na viewport; o raio em fração do maior lado)
  const reveal = useRef({ x: 0.3, y: 0.6, r: 0, pointer: false, apply: () => {} });

  useImperativeHandle(ref, () => ({
    scrollToChapter(c, instant = false) {
      const container = containerRef.current;
      if (!container) return;
      const vh = window.innerHeight;
      const top = container.offsetTop + (CHAPTER_ANCHORS[c] * vh) / 100;
      // saltos longos não reprisam a história inteira: pula quase tudo e desliza só o último meio quadro
      if (instant || Math.abs(top - window.scrollY) > 1.2 * vh) {
        const land = instant ? top : top - Math.sign(top - window.scrollY) * 0.5 * vh;
        window.scrollTo({ top: land, behavior: "instant" });
        ScrollTrigger.update();
        tlRef.current?.scrollTrigger?.getTween()?.progress(1);
        if (instant) return;
      }
      window.scrollTo({ top, behavior: "smooth" });
    },
    rig: () => rigRef.current,
  }));

  // ------------------------------------------------------------ timeline (construída e reconstruída)
  useEffect(() => {
    const container = containerRef.current!;
    const scene = sceneRef.current!;
    const revealEl = revealRef.current!;
    const texture = revealEl.querySelector<HTMLElement>("[data-reveal-texture]")!;

    const proxy = reveal.current;
    // o raio sempre segue a timeline; a posição só quando o ponteiro não está conduzindo
    proxy.apply = () => {
      texture.style.setProperty("--rr", `${proxy.r * Math.max(window.innerWidth, window.innerHeight)}px`);
      if (proxy.pointer) return;
      texture.style.setProperty("--rx", `${proxy.x * window.innerWidth}px`);
      texture.style.setProperty("--ry", `${proxy.y * window.innerHeight}px`);
    };

    let ctx: gsap.Context | null = null;
    let size = { w: window.innerWidth, h: window.innerHeight };

    const build = () => {
      ctx?.revert();
      const layout = layoutFor(window.innerWidth);
      scene.dataset.layout = layout;
      ctx = gsap.context(() => {
        tlRef.current = buildNoctisTimeline({
          container,
          scene,
          layout,
          onChapter: (c) => {
            setFolio(c);
            onChapterRef.current(c);
          },
          onExploded: (active) => {
            exploded.current = active;
            if (!active) {
              pinnedPart.current = null;
              setActivePart(null);
            }
          },
          onScrollPart: (id) => {
            if (pinnedPart.current === "tap") return;
            setActivePart((cur) => (cur === id ? cur : id));
          },
          revealProxy: proxy,
        });
      }, scene);
      ScrollTrigger.refresh();
    };

    build();
    onBuiltRef.current?.();

    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        // barras do navegador móvel mudam a altura sem mudar a largura: ignora variações pequenas
        if (w === size.w && Math.abs(h - size.h) < 140) return;
        size = { w, h };
        build();
      }, 180);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(t);
      ctx?.revert();
    };
  }, []);

  // ------------------------------------------------------------ inclinação e paralaxe pelo mouse
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    const scene = sceneRef.current!;
    const tilt = scene.querySelector<HTMLElement>("[data-rig-tilt]")!;
    const halo = scene.querySelector<HTMLElement>("[data-halo-inner]")!;
    gsap.set(tilt, { transformPerspective: 1400 });
    const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.9, ease: "power3.out" });
    const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.9, ease: "power3.out" });
    const hx = gsap.quickTo(halo, "x", { duration: 1.4, ease: "power3.out" });
    const hy = gsap.quickTo(halo, "y", { duration: 1.4, ease: "power3.out" });
    const depths = Array.from(scene.querySelectorAll<HTMLElement>("[data-depth]")).map((el) => ({
      d: DEPTH[el.dataset.depth!] ?? 0,
      x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" }),
    }));

    let raf = 0;
    let nx = 0;
    let ny = 0;
    const apply = () => {
      raf = 0;
      // no máximo ±2,5° — um frasco pesado, não um cartão
      rx(-ny * 2);
      ry(nx * 2.5);
      hx(nx * -18);
      hy(ny * -12);
      for (const d of depths) {
        d.x(nx * 5 * d.d);
        d.y(ny * 3 * d.d);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      nx = (e.clientX / window.innerWidth) * 2 - 1;
      ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ------------------------------------------------------------ luz do reveal conduzida pelo ponteiro/toque
  useEffect(() => {
    const el = revealRef.current!;
    const texture = el.querySelector<HTMLElement>("[data-reveal-texture]")!;
    const proxy = reveal.current;
    // a luz desliza até o ponteiro a partir de onde está (sem teletransporte)
    const light = { x: 0, y: 0 };
    const paint = () => {
      texture.style.setProperty("--rx", `${light.x}px`);
      texture.style.setProperty("--ry", `${light.y}px`);
    };
    const qx = gsap.quickTo(light, "x", { duration: 0.5, ease: "power3.out", onUpdate: paint });
    const qy = gsap.quickTo(light, "y", { duration: 0.5, ease: "power3.out", onUpdate: paint });
    let idle = 0;
    let release: gsap.core.Tween | null = null;
    const onMove = (e: PointerEvent) => {
      if (!sceneRef.current?.classList.contains("reveal-live")) return;
      release?.kill();
      if (!proxy.pointer) {
        light.x = proxy.x * window.innerWidth;
        light.y = proxy.y * window.innerHeight;
        proxy.pointer = true;
      }
      qx(e.clientX);
      qy(e.clientY);
      window.clearTimeout(idle);
      // toque: ao soltar, a luz volta deslizando para o caminho da timeline
      if (e.pointerType !== "mouse") {
        idle = window.setTimeout(() => {
          qx(proxy.x * window.innerWidth);
          qy(proxy.y * window.innerHeight);
          release = gsap.delayedCall(0.5, () => {
            proxy.pointer = false;
            proxy.apply();
          });
        }, 1200);
      }
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onMove);
      window.clearTimeout(idle);
      release?.kill();
    };
  }, []);

  const onPart = useCallback((id: PartId | null, source: "pointer" | "focus" | "tap") => {
    if (!exploded.current && id !== null) return;
    if (source === "tap") {
      // o foco do toque já chegou; o clique fixa a peça (não alterna)
      pinnedPart.current = "tap";
      setActivePart(id);
      return;
    }
    // um blur logo antes do toque não deve apagar a peça fixada pelo toque
    if (id === null && pinnedPart.current === "tap") return;
    pinnedPart.current = id ? source : null;
    setActivePart(id);
  }, []);

  return (
    <div ref={containerRef} className="story" id="story">
      <div ref={sceneRef} className="scene" data-active-part={activePart ?? undefined}>
        {/* z 0 — fundo, halo, superfície do produto */}
        <div className="halo" data-halo aria-hidden="true">
          <div className="halo-inner" data-halo-inner />
        </div>
        <div className="gutter" aria-hidden="true" />
        <ProductSurface />

        {/* z 10 — tipografia atrás do frasco */}
        <PersonalityBack />

        {/* z 20 — o frasco contínuo */}
        <PerfumeAssembly ref={rigRef} />

        {/* z 30 — tipografia e interface na frente */}
        <Hero onNavigate={onNavigate} />
        <OpeningNotes />
        <CraftSection activePart={activePart} onPart={onPart} />
        <PersonalityFront />
        <ProductSection onAdd={onAdd} busy={addBusy} />

        {/* z 33 — fólio da revista: o capítulo atual é uma marca, não uma cor */}
        <p className="folio" data-chapter={folio} aria-hidden="true">
          <span>NOCTIS I — {FOLIO[folio].title}</span>
          <span className="folio-page">p. {FOLIO[folio].page}</span>
        </p>

        {/* z 40 — camadas que cobrem o frasco */}
        <InsideNoctis />
        <FeelReveal ref={revealRef} />
      </div>
    </div>
  );
});
