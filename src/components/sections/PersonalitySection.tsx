import { PERSONALITY } from "@/config/siteConfig";

/**
 * WHO IS NOCTIS? — tipografia como matéria.
 * Cada palavra gigante existe em até duas cópias idênticas: uma atrás do frasco (camada 10)
 * e outra na frente (camada 30), recortada no eixo do frasco. Ao atravessar, a palavra
 * some atrás do vidro de um lado e passa por cima dele do outro.
 */
export const WORD_LAYERS: Record<(typeof PERSONALITY)[number], "split" | "back" | "front"> = {
  Misterioso: "split",
  Íntimo: "back",
  Atemporal: "split",
  Quente: "front",
  Ousado: "split",
};

export function PersonalityBack() {
  return (
    <div className="words words-back" data-words-back aria-hidden="true">
      {PERSONALITY.map((w, i) =>
        WORD_LAYERS[w] !== "front" ? (
          <span key={w} className={`word word-${i}`} data-word={w}>
            {w}
          </span>
        ) : null,
      )}
    </div>
  );
}

export function PersonalityFront() {
  return (
    <>
      <div className="words words-front" data-words-front aria-hidden="true">
        {PERSONALITY.map((w, i) =>
          WORD_LAYERS[w] !== "back" ? (
            <span key={w} className={`word word-${i}`} data-word={w}>
              {w}
            </span>
          ) : null,
        )}
      </div>
      <section className="personality" data-personality aria-labelledby="personality-title">
        <h2 id="personality-title" className="personality-title">
          Quem é
          <br />
          <span>NOCTIS?</span>
        </h2>
        <ul className="sr-only">
          {PERSONALITY.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
