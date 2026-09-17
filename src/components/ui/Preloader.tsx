"use client";

import { useEffect, useRef, useState } from "react";
import { PERFUME_ASSETS } from "@/config/perfumeAssets.generated";

const CRITICAL = [
  PERFUME_ASSETS.body.src,
  PERFUME_ASSETS.liquid.src,
  PERFUME_ASSETS.label.src,
  PERFUME_ASSETS.collar.src,
  PERFUME_ASSETS.atomizer.src,
  PERFUME_ASSETS.cap.src,
  "/images/noctis/noctis-full.webp",
];

const MIN_VISIBLE_MS = 1100;

/**
 * Não deixa a experiência começar antes de as camadas do frasco estarem decodificadas.
 * A linha fina avança com os bytes reais; ao completar, a cortina se abre para o hero.
 */
export function Preloader({ onDone, canLeave }: { onDone: () => void; canLeave: boolean }) {
  const [progress, setProgress] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);

  useEffect(() => {
    let cancelled = false;
    const started = performance.now();
    let loaded = 0;
    const total = CRITICAL.length + 1;
    const tick = () => {
      loaded += 1;
      if (!cancelled) setProgress(loaded / total);
    };

    const images = CRITICAL.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.decoding = "async";
          img.src = src;
          const finish = () => {
            tick();
            resolve();
          };
          img.decode().then(finish, finish);
        }),
    );
    const fonts = (document.fonts?.ready ?? Promise.resolve()).then(tick, tick);

    Promise.all([...images, fonts]).then(() => {
      const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - started));
      window.setTimeout(() => {
        if (cancelled) return;
        // monta a história sob a cortina; ela só sobe quando a timeline estiver pronta
        setAssetsReady(true);
        done.current();
      }, wait);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!assetsReady || !canLeave) return;
    let t = 0;
    const raf = requestAnimationFrame(() => {
      setLeaving(true);
      t = window.setTimeout(() => setGone(true), 1100);
    });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [assetsReady, canLeave]);

  if (gone) return null;
  const pct = Math.round(progress * 100);

  return (
    <div className={`preloader ${leaving ? "is-leaving" : ""}`} role="status" aria-live="polite" aria-label={`Carregando NOCTIS, ${pct}%`}>
      <div className="preloader-inner">
        <p className="preloader-mark">NOCTIS</p>
        <div className="preloader-line" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <p className="preloader-pct" aria-hidden="true">
          {String(pct).padStart(3, "0")}
        </p>
      </div>
    </div>
  );
}
