import { HEART_NOTES } from "@/config/siteConfig";

/**
 * Dentro do líquido. Camada 40 cobre o frasco: âmbar profundo, vazamentos de luz, poeira mínima.
 * A íris (clip-path circular) abre a partir do centro da janela de vidro.
 */
export function InsideNoctis() {
  return (
    <section className="inside" data-inside aria-labelledby="heart-title">
      <div className="inside-base" aria-hidden="true" />
      <div className="inside-leak leak-a" data-leak aria-hidden="true" />
      <div className="inside-leak leak-b" data-leak aria-hidden="true" />
      <div className="inside-leak leak-c" data-leak aria-hidden="true" />
      <div className="inside-motes" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <i key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>

      <h2 id="heart-title" className="inside-title" data-inside-title>
        <span>O</span> Coração
      </h2>

      <ul className="heart-notes">
        {HEART_NOTES.map((n) => (
          <li key={n.id} className={`heart-note heart-${n.id}`} data-heart={n.id}>
            <span className="heart-name">{n.name}</span>
            <span className="heart-line">{n.line}</span>
          </li>
        ))}
      </ul>

      <div className="inside-dark" data-inside-dark aria-hidden="true" />
    </section>
  );
}
