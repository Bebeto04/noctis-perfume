import { PERFUME_ASSETS } from "@/config/perfumeAssets.generated";
import { ASSEMBLY, layerBox, type LayerId } from "@/config/perfumeAssemblyConfig";

const ALT: Record<LayerId, string> = {
  cap: "",
  atomizer: "",
  collar: "",
  body: "Frasco do eau de parfum NOCTIS I",
  liquid: "",
  label: "",
};

interface Props {
  id: LayerId;
  /** transform estático opcional (modo reduzido / debug); a narrativa usa GSAP */
  staticTransform?: string;
  priority?: boolean;
}

/**
 * Uma peça do frasco. Três níveis, cada um com um único dono de transform:
 *   .layer        → timeline GSAP (desmontagem/remontagem)
 *   .layer-depth  → paralaxe do mouse (quickTo)
 *   img           → estado de destaque (CSS)
 */
export function PerfumeLayer({ id, staticTransform, priority }: Props) {
  const asset = PERFUME_ASSETS[id];
  const cal = ASSEMBLY[id];
  const box = layerBox(id);
  return (
    <div
      className="layer"
      data-layer={id}
      style={{
        left: `${box.pct.left}%`,
        top: `${box.pct.top}%`,
        width: `${box.pct.width}%`,
        height: `${box.pct.height}%`,
        zIndex: cal.zIndex,
        transformOrigin: cal.transformOrigin,
        opacity: cal.opacity,
        transform: staticTransform ?? (cal.rotation ? `rotate(${cal.rotation}deg)` : undefined),
      }}
    >
      <div className="layer-depth" data-depth={id}>
        {/* eslint-disable-next-line @next/next/no-img-element -- WebP com alfa já otimizado; o preloader controla o carregamento */}
        <img
          src={asset.src}
          width={asset.width}
          height={asset.height}
          alt={ALT[id]}
          aria-hidden={ALT[id] ? undefined : true}
          draggable={false}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>
    </div>
  );
}
