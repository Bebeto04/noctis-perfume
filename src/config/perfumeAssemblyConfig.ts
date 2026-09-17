/**
 * NOCTIS — calibração do frasco montado.
 *
 * Todas as peças vivem num "palco" de STAGE.width × STAGE.height unidades.
 * 1 unidade = 1 px nativo do corpo de vidro recortado (escala do corpo = 1), então
 * as medidas tiradas dos PNGs valem diretamente aqui.
 *
 *   x, y            centro da peça no palco (unidades)
 *   scale           unidades por px nativo da peça (largura final = asset.width × scale)
 *   rotation        graus
 *   zIndex          ordem de empilhamento dentro do frasco
 *   transformOrigin origem das transformações de animação
 *   opacity         opacidade de repouso
 *
 * Como as escalas foram derivadas (medidas em scripts/measure-reference.cjs):
 *   gargalo do corpo = 240u. Na vista explodida de referência:
 *   flange do atomizador ≈ 0,98× gargalo → 0,544 · gola ≈ 1,45× → 0,91 · tampa ≈ 2,3× → 0,75
 *   janela transparente do corpo: x 210–555, y 210–946 (px do corpo) → líquido cobre a janela.
 *
 * Para recalibrar: abra /?debugPerfume=true e rode `node scripts/compose-assembly.mts`.
 */
import { PERFUME_ASSETS, type PerfumeAssetId } from "./perfumeAssets.generated.ts";

export type LayerId = Exclude<PerfumeAssetId, "reference">;

export interface LayerCalibration {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
  transformOrigin: string;
  opacity: number;
}

export const STAGE = { width: 1000, height: 1540 } as const;

/** Ordem de pintura de trás para a frente. */
export const LAYER_ORDER: readonly LayerId[] = ["liquid", "atomizer", "body", "label", "collar", "cap"];

export const ASSEMBLY: Record<LayerId, LayerCalibration> = {
  liquid: { x: 481, y: 890, scale: 0.82, rotation: 0, zIndex: 1, transformOrigin: "50% 50%", opacity: 1 },
  atomizer: { x: 500.3, y: 237, scale: 0.544, rotation: 0, zIndex: 2, transformOrigin: "50% 70%", opacity: 1 },
  body: { x: 505.5, y: 915.5, scale: 1, rotation: 0, zIndex: 3, transformOrigin: "50% 50%", opacity: 1 },
  label: { x: 481, y: 830, scale: 0.38, rotation: 0, zIndex: 4, transformOrigin: "50% 50%", opacity: 1 },
  collar: { x: 500.5, y: 344, scale: 0.91, rotation: 0, zIndex: 5, transformOrigin: "50% 50%", opacity: 1 },
  cap: { x: 502.25, y: 267, scale: 0.75, rotation: 0, zIndex: 6, transformOrigin: "50% 100%", opacity: 1 },
};

/**
 * Deslocamentos da vista explodida (unidades do palco, somados à posição montada).
 * Desktop: coluna vertical como a referência, placa sai para a esquerda.
 */
export const EXPLODED: Record<LayerId, { x: number; y: number; rotation: number }> = {
  // extensões montadas (u): tampa 62–472 · atomizador 61–413 · gola 266–422 · gargalo 317 · corpo 310–1521 · líquido 482–1298
  cap: { x: 0, y: -790, rotation: -5 },
  atomizer: { x: 0, y: -360, rotation: 0 },
  collar: { x: 0, y: -165, rotation: 0 },
  label: { x: -600, y: 40, rotation: -4 },
  // desce até o topo do líquido passar da base de vidro (1521u)
  liquid: { x: 0, y: 1060, rotation: 0 },
  body: { x: 0, y: 0, rotation: 0 },
};

/** Variante vertical para telas estreitas: a placa cruza o canto inferior esquerdo do corpo. */
export const EXPLODED_COMPACT: Record<LayerId, { x: number; y: number; rotation: number }> = {
  cap: { x: 0, y: -790, rotation: -4 },
  atomizer: { x: 0, y: -360, rotation: 0 },
  collar: { x: 0, y: -165, rotation: 0 },
  // fora do vidro, à esquerda do corpo
  label: { x: -560, y: 230, rotation: -6 },
  liquid: { x: 0, y: 1060, rotation: 0 },
  body: { x: 0, y: 0, rotation: 0 },
};

/** Extensão vertical do conjunto explodido (u), usada para enquadrar a composição. */
export const EXPLODED_EXTENT = { top: -728, bottom: 2358 } as const;

/** Gabarito de desenvolvimento: onde a imagem de referência é desenhada atrás das peças no debug. */
export const REFERENCE_OVERLAY = { x: 500, y: 770, scale: 1.1, opacity: 0.25 } as const;

export const layerBox = (id: LayerId | "reference") => {
  const asset = PERFUME_ASSETS[id];
  const cal = id === "reference" ? REFERENCE_OVERLAY : ASSEMBLY[id];
  const width = asset.width * cal.scale;
  const height = asset.height * cal.scale;
  return {
    width,
    height,
    left: cal.x - width / 2,
    top: cal.y - height / 2,
    /** percentuais relativos ao palco, usados pelo CSS */
    pct: {
      left: ((cal.x - width / 2) / STAGE.width) * 100,
      top: ((cal.y - height / 2) / STAGE.height) * 100,
      width: (width / STAGE.width) * 100,
      height: (height / STAGE.height) * 100,
    },
  };
};
