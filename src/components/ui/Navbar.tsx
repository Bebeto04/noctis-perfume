"use client";

import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/config/siteConfig";
import type { ChapterId } from "@/config/storyConfig";
import { useCart } from "../cart/CartProvider";

interface Props {
  onNavigate: (chapter: ChapterId) => void;
  activeChapter: ChapterId | null;
}

export function Navbar({ onNavigate, activeChapter }: Props) {
  const { count, open, bagIconRef, bump } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const go = (e: React.MouseEvent, chapter: ChapterId) => {
    e.preventDefault();
    menuRef.current?.close();
    onNavigate(chapter);
  };

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${activeChapter === "heart" ? "is-over-amber" : ""}`}>
      <div className="nav-inner">
        <a href="#top" className="nav-logo" onClick={(e) => go(e, "top")} aria-label="NOCTIS — voltar ao início">
          NOCTIS
        </a>
        <nav className="nav-links" aria-label="Capítulos">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={`#${l.chapter}`}
              onClick={(e) => go(e, l.chapter)}
              aria-current={activeChapter === l.chapter ? "true" : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a href="#product" className="nav-cta" onClick={(e) => go(e, "product")}>
            Descubra NOCTIS
          </a>
          <button
            type="button"
            className="nav-menu-button"
            aria-haspopup="dialog"
            onClick={() => menuRef.current?.showModal()}
          >
            Menu
          </button>
          <button
            type="button"
            className={`nav-bag ${bump ? "is-bumping" : ""}`}
            onClick={open}
            aria-label={`Abrir sacola, ${count} ${count === 1 ? "item" : "itens"}`}
          >
            {/* a key remonta o ícone a cada chegada, reiniciando a animação CSS */}
            <span key={bump} ref={bagIconRef} className="nav-bag-icon" aria-hidden="true">
              <svg width="20" height="22" viewBox="0 0 20 22">
                <path d="M3.5 7.5h13l-1 12.5h-11z" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M7 7.5V5.5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>
            </span>
            <span className="nav-bag-count" aria-hidden="true">
              {count}
            </span>
          </button>
        </div>
      </div>

      {/* telas estreitas: sumário em página inteira, como o índice de uma revista */}
      <dialog
        ref={menuRef}
        className="menu-sheet"
        aria-label="Capítulos"
        onClick={(e) => e.target === e.currentTarget && menuRef.current?.close()}
      >
        <div className="menu-sheet-inner">
          <div className="menu-sheet-head">
            <span className="nav-logo">NOCTIS</span>
            <button type="button" className="drawer-close" onClick={() => menuRef.current?.close()} aria-label="Fechar menu">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
          </div>
          <nav aria-label="Capítulos">
            <ol className="menu-sheet-list">
              {NAV_LINKS.map((l, i) => (
                <li key={l.label}>
                  <a
                    href={`#${l.chapter}`}
                    onClick={(e) => go(e, l.chapter)}
                    aria-current={activeChapter === l.chapter ? "true" : undefined}
                  >
                    <span className="menu-sheet-folio" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <a href="#product" className="btn-solid menu-sheet-cta" onClick={(e) => go(e, "product")}>
            Descubra NOCTIS
          </a>
        </div>
      </dialog>
    </header>
  );
}
