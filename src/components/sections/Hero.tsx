import { SITE } from "@/config/siteConfig";
import type { ChapterId } from "@/config/storyConfig";

/**
 * Primeira viewport. O nome é um masthead atrás do frasco (camada 10);
 * slogan, especificação e CTA ficam na frente (camada 30).
 */
export function Hero({ onNavigate }: { onNavigate: (c: ChapterId) => void }) {
  return (
    <>
      <p className="hero-masthead" data-hero-masthead aria-hidden="true">
        NOCTIS
      </p>
      <div className="hero-copy" data-hero-copy>
        <h1 className="hero-title">
          <span className="sr-only">NOCTIS — </span>
          {SITE.tagline[0]}
          <br />
          {SITE.tagline[1]}
        </h1>
        <a
          href="#opening"
          className="btn-line"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("opening");
          }}
        >
          Descubra a fragrância
        </a>
      </div>
      <p className="hero-spec" data-hero-copy>
        Eau de Parfum
        <br />
        100 ML
      </p>
      <div className="scroll-cue" data-scroll-cue aria-hidden="true">
        <span>Role para entrar</span>
        <i />
      </div>
    </>
  );
}
