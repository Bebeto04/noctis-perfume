"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CartProvider, useCart } from "./cart/CartProvider";
import { CartDrawer } from "./cart/CartDrawer";
import { Navbar } from "./ui/Navbar";
import { Preloader } from "./ui/Preloader";
import { NoctisStory, type NoctisStoryHandle } from "./motion/NoctisStory";
import { ReducedStory } from "./ReducedStory";
import { Footer } from "./sections/Footer";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ChapterId } from "@/config/storyConfig";
import { PRODUCT } from "@/config/siteConfig";

export function Experience() {
  return (
    <CartProvider>
      <ExperienceInner />
    </CartProvider>
  );
}

function ExperienceInner() {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [built, setBuilt] = useState(false);
  const [chapter, setChapter] = useState<ChapterId | null>(null);
  const [flying, setFlying] = useState(false);
  const story = useRef<NoctisStoryHandle>(null);
  const cart = useCart();

  // a experiência sempre começa no hero
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("is-loading", !ready);
  }, [ready]);

  const navigate = useCallback(
    (c: ChapterId) => {
      if (reduced) {
        document.getElementById(c === "top" ? "top" : c)?.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
      story.current?.scrollToChapter(c);
    },
    [reduced],
  );

  const onChapter = useCallback((c: string) => {
    const map: Record<string, ChapterId | null> = {
      hero: null,
      opening: "opening",
      heart: "heart",
      craft: "exploded",
      exploded: "exploded",
      personality: "personality",
      reveal: "reveal",
      product: "product",
    };
    setChapter(map[c] ?? null);
  }, []);

  /** Adicionar à sacola: um clone visual voa em curva até o ícone; o frasco principal fica onde está. */
  const addToBag = useCallback(() => {
    if (flying) return;
    const target = cart.bagIconRef.current;
    const rig = story.current?.rig();
    if (reduced || !target || !rig) {
      cart.add();
      cart.pulseBag();
      return;
    }
    const from = rig.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const clone = document.createElement("img");
    clone.src = PRODUCT.image;
    clone.alt = "";
    clone.className = "bag-flight";
    Object.assign(clone.style, {
      left: `${from.left}px`,
      top: `${from.top}px`,
      width: `${from.width}px`,
      height: `${from.height}px`,
    });
    document.body.appendChild(clone);
    setFlying(true);

    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const endScale = Math.max(0.03, (to.height * 1.4) / from.height);
    const tl = gsap.timeline({
      onComplete: () => {
        clone.remove();
        setFlying(false);
      },
    });
    // x e y com curvas distintas desenham um arco: sobe e encolhe primeiro, depois cruza até a sacola
    tl.to(clone, { x: dx, duration: 0.9, ease: "power2.in" }, 0)
      .to(clone, { y: dy, duration: 0.9, ease: "power3.out" }, 0)
      .to(clone, { scale: endScale, duration: 0.9, ease: "power2.out" }, 0)
      .to(clone, { rotation: 12, duration: 0.9, ease: "sine.in" }, 0)
      .call(() => {
        cart.add();
        cart.pulseBag();
      }, [], 0.84)
      .to(clone, { autoAlpha: 0, duration: 0.12 }, 0.8);
  }, [cart, flying, reduced]);

  if (reduced === null) {
    return <div className="boot" aria-hidden="true" />;
  }

  return (
    <>
      {!reduced && <Preloader onDone={() => setReady(true)} canLeave={built} />}
      <a
        className="skip-link"
        href="#product"
        onClick={(e) => {
          e.preventDefault();
          // ação de teclado: salta sem animar e leva o foco ao produto
          if (reduced) navigate("product");
          else story.current?.scrollToChapter("product", true);
          window.setTimeout(() => {
            document.getElementById(reduced ? "r-product" : "product-title")?.focus({ preventScroll: true });
          }, 60);
        }}
      >
        Ir para o NOCTIS I
      </a>
      <Navbar onNavigate={navigate} activeChapter={chapter} />
      <main id="top">
        {reduced ? (
          <ReducedStory onAdd={addToBag} onNavigate={navigate} />
        ) : (
          ready && (
            <NoctisStory
              ref={story}
              onChapter={onChapter}
              onAdd={addToBag}
              addBusy={flying}
              onNavigate={navigate}
              onBuilt={() => setBuilt(true)}
            />
          )
        )}
      </main>
      <Footer />
      <CartDrawer />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
