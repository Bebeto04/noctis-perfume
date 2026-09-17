"use client";

import { PARTS } from "@/config/siteConfig";

type PartId = (typeof PARTS)[number]["id"];

interface Props {
  activePart: PartId | null;
  onPart: (id: PartId | null, source: "pointer" | "focus" | "tap") => void;
}

/**
 * CRAFTED TO LAST + vista explodida.
 * Posições das anotações, linhas e áreas de toque são calculadas pela timeline (dependem da pose
 * do frasco na viewport); aqui fica só a estrutura acessível.
 */
export function CraftSection({ activePart, onPart }: Props) {
  const current = PARTS.find((p) => p.id === activePart);
  return (
    <>
      <div className="craft-copy" data-craft-title>
        <h2 className="craft-title">
          Feito
          <br />
          para durar.
        </h2>
        <p className="craft-line">
          Estrutura refinada.
          <br />
          Design atemporal.
        </p>
      </div>

      <section className="annotations" data-annotations aria-label="Vista explodida: as peças do NOCTIS I">
        <svg className="annotation-lines" data-annotation-svg aria-hidden="true">
          {PARTS.map((p) => (
            <g key={p.id} data-annotation-mark={p.id} className="annotation-mark">
              <path data-annotation-line={p.id} pathLength={1} />
              <circle data-annotation-dot={p.id} r={2.5} />
              <path data-annotation-cross={p.id} className="annotation-cross" />
            </g>
          ))}
        </svg>
        {PARTS.map((p, i) => (
          <div
            key={p.id}
            className="annotation"
            data-annotation={p.id}
            data-active={activePart === p.id || undefined}
          >
            <h3 className="annotation-title">{p.title}</h3>
            <p className="annotation-line">{p.line}</p>
            <span className="annotation-plate" aria-hidden="true">
              Pr. {String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}

        <div className="hotspots" data-hotspots>
          {PARTS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="hotspot"
              data-hotspot={p.id}
              aria-label={`${p.title}: ${p.line}`}
              aria-pressed={activePart === p.id}
              onPointerEnter={(e) => e.pointerType === "mouse" && onPart(p.id, "pointer")}
              onPointerLeave={(e) => e.pointerType === "mouse" && onPart(null, "pointer")}
              onFocus={() => onPart(p.id, "focus")}
              onBlur={() => onPart(null, "focus")}
              onClick={(e) => {
                if ((e.nativeEvent as PointerEvent).pointerType !== "mouse") onPart(p.id, "tap");
              }}
            />
          ))}
        </div>

        <p className="part-caption" data-part-caption aria-live="polite">
          {current ? (
            <>
              <strong>{current.title}</strong> {current.line}
            </>
          ) : null}
        </p>
      </section>
    </>
  );
}
