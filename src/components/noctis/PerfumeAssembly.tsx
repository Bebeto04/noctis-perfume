import { forwardRef } from "react";
import { ASSEMBLY, EXPLODED, EXPLODED_COMPACT, LAYER_ORDER, layerBox, type LayerId } from "@/config/perfumeAssemblyConfig";
import { PerfumeLayer } from "./PerfumeLayer";
import { PerfumeHighlight } from "./PerfumeHighlight";

export type AssemblyState = "assembled" | "exploded" | "exploded-compact";

/** Deslocamento explodido como transform percentual da própria peça (independe do tamanho em px). */
export function explodedTransform(id: LayerId, compact = false) {
  const off = (compact ? EXPLODED_COMPACT : EXPLODED)[id];
  const box = layerBox(id);
  const xp = (off.x / box.width) * 100;
  const yp = (off.y / box.height) * 100;
  return { xPercent: xp, yPercent: yp, rotation: ASSEMBLY[id].rotation + off.rotation };
}

interface Props {
  /** estado estático (sem GSAP) — usado no modo de movimento reduzido e no debug */
  staticState?: AssemblyState;
  className?: string;
  children?: React.ReactNode;
}

/**
 * O frasco NOCTIS: seis camadas independentes num palco de proporção fixa.
 * A narrativa move o `.rig` inteiro e cada `.layer` individualmente; nada aqui é uma imagem única.
 */
export const PerfumeAssembly = forwardRef<HTMLDivElement, Props>(function PerfumeAssembly(
  { staticState, className, children },
  ref,
) {
  const isStatic = staticState !== undefined;
  return (
    <div ref={ref} className={`rig ${className ?? ""}`} data-rig>
      {/* GSAP controla a sombra; a respiração CSS vive no filho para não disputar as mesmas propriedades */}
      <div className="rig-shadow" data-rig-shadow aria-hidden="true">
        <span className="rig-shadow-breath" />
      </div>
      <div className="rig-tilt" data-rig-tilt>
        <div className="rig-float" data-rig-float>
          <div className="stage" data-stage>
            {LAYER_ORDER.map((id) => {
              let staticTransform: string | undefined;
              if (isStatic && staticState !== "assembled") {
                const t = explodedTransform(id, staticState === "exploded-compact");
                staticTransform = `translate(${t.xPercent}%, ${t.yPercent}%) rotate(${t.rotation}deg)`;
              }
              return <PerfumeLayer key={id} id={id} staticTransform={staticTransform} priority />;
            })}
            <div
              className="cap-contact"
              data-cap-contact
              aria-hidden="true"
              style={{ opacity: staticState && staticState !== "assembled" ? 0 : undefined }}
            />
            {(!isStatic || staticState === "assembled") && <PerfumeHighlight />}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
});
