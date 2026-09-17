// GERADO por scripts/process-assets.mjs — não editar à mão.
// Dimensões naturais (px) de cada peça após o recorte pelo canal alfa.
export const PERFUME_ASSETS = {
  "cap": {
    "src": "/images/noctis/noctis-cap.webp",
    "width": 756,
    "height": 547,
    "bytes": 125254
  },
  "atomizer": {
    "src": "/images/noctis/noctis-atomizer.webp",
    "width": 453,
    "height": 646,
    "bytes": 45452
  },
  "collar": {
    "src": "/images/noctis/noctis-collar.webp",
    "width": 396,
    "height": 172,
    "bytes": 17696
  },
  "body": {
    "src": "/images/noctis/noctis-body.webp",
    "width": 813,
    "height": 1211,
    "bytes": 204190
  },
  "liquid": {
    "src": "/images/noctis/noctis-liquid.webp",
    "width": 711,
    "height": 995,
    "bytes": 109398
  },
  "label": {
    "src": "/images/noctis/noctis-label.webp",
    "width": 713,
    "height": 535,
    "bytes": 65108
  },
  "reference": {
    "src": "/images/noctis/noctis-exploded-reference.webp",
    "width": 918,
    "height": 1333,
    "bytes": 171244
  }
} as const;

export type PerfumeAssetId = keyof typeof PERFUME_ASSETS;
