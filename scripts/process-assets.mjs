// Processa as imagens-fonte do NOCTIS:
//  1. identifica cada peça pelo arquivo-fonte (classificado visualmente, duplicatas por hash descartadas);
//  2. recorta pela caixa real do canal alfa (+ margem), removendo canvas transparente diferente entre peças;
//  3. grava PNG recortado (fonte, fora de /public) e WebP com alfa (servido);
//  4. gera src/config/perfumeAssets.generated.ts com as dimensões naturais — a calibração usa esses números.
//
// Uso: node scripts/process-assets.mjs  (lê de assets/source/raw)
import sharp from "sharp";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const rawDir = path.join(root, "assets/source/raw");
const trimmedDir = path.join(root, "assets/source/trimmed");
const publicDir = path.join(root, "public/images/noctis");

// Classificação visual dos anexos (ver README): nome final <- arquivo original
const PARTS = {
  cap: "noctis-cap.png",
  atomizer: "noctis-atomizer.png",
  collar: "noctis-collar.png",
  body: "noctis-body.png",
  liquid: "noctis-liquid.png",
  label: "noctis-label.png",
  reference: "noctis-exploded-reference.png",
};

const PAD = 4;
const ALPHA_MIN = 3;

async function alphaBox(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let minX = Infinity, minY = Infinity, maxX = -1, maxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > ALPHA_MIN) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, minY, maxX, maxY, width: info.width, height: info.height };
}

await mkdir(trimmedDir, { recursive: true });
await mkdir(publicDir, { recursive: true });
const available = new Set(await readdir(rawDir));
const manifest = {};

for (const [id, file] of Object.entries(PARTS)) {
  if (!available.has(file)) throw new Error(`Fonte ausente: ${file}`);
  const src = path.join(rawDir, file);
  const b = await alphaBox(src);
  const left = Math.max(0, b.minX - PAD);
  const top = Math.max(0, b.minY - PAD);
  const width = Math.min(b.width, b.maxX + PAD + 1) - left;
  const height = Math.min(b.height, b.maxY + PAD + 1) - top;
  const base = sharp(src).extract({ left, top, width, height });
  const trimmedPng = path.join(trimmedDir, file);
  await base.clone().png({ compressionLevel: 9 }).toFile(trimmedPng);
  const webpName = file.replace(/\.png$/, ".webp");
  const out = await base
    .clone()
    .webp({ quality: 90, alphaQuality: 100, effort: 6, smartSubsample: true })
    .toFile(path.join(publicDir, webpName));
  manifest[id] = { src: `/images/noctis/${webpName}`, width, height, bytes: out.size };
  console.log(id.padEnd(10), `${width}x${height}`, `${(out.size / 1024).toFixed(0)} KB`, `crop@${left},${top}`);
}

const ts = `// GERADO por scripts/process-assets.mjs — não editar à mão.
// Dimensões naturais (px) de cada peça após o recorte pelo canal alfa.
export const PERFUME_ASSETS = ${JSON.stringify(manifest, null, 2)} as const;

export type PerfumeAssetId = keyof typeof PERFUME_ASSETS;
`;
await writeFile(path.join(root, "src/config/perfumeAssets.generated.ts"), ts);
console.log("manifest ok");
