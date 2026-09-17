"use client";

import { forwardRef } from "react";

/**
 * WHAT DOES NOCTIS FEEL LIKE?
 * Escuro quase total; uma seda âmbar escondida aparece só dentro de uma máscara circular.
 * Ponteiro fino: a máscara segue o mouse. Toque: segue o dedo. Sem interação: a timeline passeia com ela.
 * A textura é sintética (gerada por scripts/make-textures.mjs).
 */
export const FeelReveal = forwardRef<HTMLElement>(function FeelReveal(_, ref) {
  return (
    <section ref={ref} className="reveal" data-reveal aria-labelledby="reveal-title">
      <div className="reveal-texture" data-reveal-texture aria-hidden="true">
        <span className="reveal-whisper w1">pele quente</span>
        <span className="reveal-whisper w2">fumaça sobre seda</span>
        <span className="reveal-whisper w3">âmbar, 2 da manhã</span>
      </div>
      <h2 id="reveal-title" className="reveal-title">
        <span>Como é</span>
        <span className="reveal-name">NOCTIS</span>
        <span>na pele?</span>
      </h2>
      <p className="reveal-hint" aria-hidden="true">
        <span className="hint-pointer">Mova a luz</span>
        <span className="hint-touch">Toque para revelar</span>
      </p>
      <p className="sr-only">Pele quente. Fumaça sobre seda. Âmbar, 2 da manhã.</p>
    </section>
  );
});
