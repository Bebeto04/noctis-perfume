"use client";

import { HEART_NOTES, OPENING_NOTES, PARTS, PERSONALITY, PRODUCT, SITE, formatPrice } from "@/config/siteConfig";
import type { ChapterId } from "@/config/storyConfig";
import { PerfumeAssembly } from "./noctis/PerfumeAssembly";
import { NoteGlyph } from "./sections/NoteGlyphs";

/**
 * prefers-reduced-motion: a mesma história, em leitura linear e estática.
 * Nenhum movimento de posição ou escala; todo o conteúdo e as ações continuam disponíveis.
 */
export function ReducedStory({ onAdd, onNavigate }: { onAdd: () => void; onNavigate: (c: ChapterId) => void }) {
  return (
    <div className="reduced">
      <section className="r-hero" aria-labelledby="r-hero-title">
        <p className="r-masthead" aria-hidden="true">
          NOCTIS
        </p>
        <div className="r-bottle">
          <PerfumeAssembly staticState="assembled" />
        </div>
        <div className="r-hero-copy">
          <h1 id="r-hero-title" className="hero-title">
            <span className="sr-only">NOCTIS — </span>
            {SITE.tagline[0]}
            <br />
            {SITE.tagline[1]}
          </h1>
          <p className="hero-spec-inline">Eau de Parfum · 100 ML</p>
          <a href="#opening" className="btn-line" onClick={(e) => { e.preventDefault(); onNavigate("opening"); }}>
            Descubra a fragrância
          </a>
        </div>
      </section>

      <section id="opening" className="r-section" aria-labelledby="r-opening">
        <h2 id="r-opening" className="r-title">A Abertura</h2>
        <p className="r-lede">
          A primeira impressão. <em>Luminosa. Quente. Inesperada.</em>
        </p>
        <ul className="r-notes">
          {OPENING_NOTES.map((n) => (
            <li key={n.id}>
              <span className="note-glyph is-static" aria-hidden="true">
                <NoteGlyph id={n.id} />
              </span>
              <span className="note-name">{n.name}</span>
              <span className="note-facets">
                {n.origin} — {n.facets.join(" · ")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="heart" className="r-section r-inside" aria-labelledby="r-heart">
        <h2 id="r-heart" className="r-title">O Coração</h2>
        <ul className="r-heart">
          {HEART_NOTES.map((n) => (
            <li key={n.id}>
              <span className="heart-name">{n.name}</span>
              <span className="heart-line">{n.line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="exploded" className="r-section r-craft" aria-labelledby="r-craft">
        <div>
          <h2 id="r-craft" className="r-title">Feito para durar.</h2>
          <p className="r-lede">Estrutura refinada. Design atemporal.</p>
          <dl className="r-parts">
            {PARTS.map((p) => (
              <div key={p.id}>
                <dt>{p.title}</dt>
                <dd>{p.line}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="r-exploded" aria-hidden="true">
          <PerfumeAssembly staticState="exploded-compact" />
        </div>
      </section>

      <section id="personality" className="r-section" aria-labelledby="r-who">
        <h2 id="r-who" className="r-title">Quem é NOCTIS?</h2>
        <ul className="r-words">
          {PERSONALITY.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </section>

      <section id="reveal" className="r-section r-reveal" aria-labelledby="r-feel">
        <h2 id="r-feel" className="r-title">
          Como é NOCTIS na pele?
        </h2>
        <p className="r-lede">Pele quente. Fumaça sobre seda. Âmbar, 2 da manhã.</p>
      </section>

      <section id="product" className="r-section r-product" aria-labelledby="r-product">
        <div className="r-bottle r-bottle-small">
          <PerfumeAssembly staticState="assembled" />
        </div>
        <div>
          <h2 id="r-product" className="product-name" tabIndex={-1}>
            {PRODUCT.name}
          </h2>
          <p className="product-family">{PRODUCT.family.join(" · ")}</p>
          <p className="product-kind">
            {PRODUCT.type} · {PRODUCT.size}
          </p>
          <div className="product-buy">
            <p className="product-price">{formatPrice(PRODUCT.price)}</p>
            <button type="button" className="btn-solid btn-add" onClick={onAdd}>
              Adicionar à sacola
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
