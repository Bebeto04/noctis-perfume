"use client";

import { useState } from "react";
import { OPENING_NOTES } from "@/config/siteConfig";
import { NoteGlyph } from "./NoteGlyphs";

/**
 * THE OPENING — notas de saída. Sem cards: cada nota é uma palavra grande.
 * Hover (ponteiro fino), foco ou toque ativam a nota; as outras recuam.
 * Os glifos vivem numa camada atrás do frasco e "saem" dele pela timeline.
 */
export function OpeningNotes() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      {/* abstração em escala de frasco, atrás do vidro: a nota ativa se acende */}
      <div className="opening-aura" data-opening-aura data-has-active={active ? "" : undefined} aria-hidden="true">
        {OPENING_NOTES.map((n) => (
          <span key={n.id} className="aura-glyph" data-active={active === n.id || undefined}>
            <NoteGlyph id={n.id} />
          </span>
        ))}
      </div>

      <div className="opening-glyphs" aria-hidden="true">
        {OPENING_NOTES.map((n) => (
          <span key={n.id} className="note-glyph" data-note-glyph={n.id} data-active={active === n.id || undefined}>
            <NoteGlyph id={n.id} />
          </span>
        ))}
      </div>

      <section className="opening" aria-labelledby="opening-title" data-opening data-has-active={active ? "" : undefined}>
        <h2 id="opening-title" className="opening-title" data-opening-title>
          A Abertura
        </h2>
        <ul className="opening-notes" onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}>
          {OPENING_NOTES.map((n) => {
            const isActive = active === n.id;
            return (
              <li key={n.id} data-opening-note={n.id} data-active={isActive || undefined}>
                <button
                  type="button"
                  className="note-button"
                  aria-expanded={isActive}
                  aria-controls={`note-${n.id}`}
                  data-note-anchor={n.id}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setActive(n.id)}
                  onFocus={() => setActive(n.id)}
                  onBlur={() => setActive((a) => (a === n.id ? null : a))}
                  onClick={(e) => {
                    // ponteiro fino já ativa no hover; no toque o foco chega antes do clique,
                    // então o clique confirma (alternar aqui desfaria a ativação do foco)
                    if ((e.nativeEvent as PointerEvent).pointerType !== "mouse") setActive(n.id);
                  }}
                >
                  <span className="note-name">{n.name}</span>
                </button>
                <p id={`note-${n.id}`} className="note-detail">
                  <span className="note-origin">{n.origin}</span>
                  <span className="note-facets">{n.facets.join(" · ")}</span>
                </p>
              </li>
            );
          })}
        </ul>
        <p className="opening-copy" data-opening-copy>
          A primeira impressão.
          <br />
          <em>Luminosa. Quente. Inesperada.</em>
        </p>
      </section>
    </>
  );
}
