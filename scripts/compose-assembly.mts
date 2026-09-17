// Renderiza o frasco montado a partir de src/config/perfumeAssemblyConfig.ts (mesma fonte que o site usa).
// Saídas:
//   --out <png>      composição limpa sobre fundo escuro (para inspeção)
//   --debug          adiciona caixas e eixo central
//   --exploded       aplica os deslocamentos EXPLODED
//   --full           grava public/images/noctis/noctis-full.webp (frasco montado, fundo transparente)
import sharp from "sharp";
import path from "node:path";
import { ASSEMBLY, LAYER_ORDER, STAGE, EXPLODED, layerBox } from "../src/config/perfumeAssemblyConfig.ts";

const args = process.argv.slice(2);
const flag = (n: string) => args.includes(n);
const outArg = args[args.indexOf("--out") + 1];
const root = path.resolve(import.meta.dirname, "..");
const exploded = flag("--exploded");
const full = flag("--full");
const K = 1; // px por unidade

const extraTop = exploded ? 700 : 0;
const extraBottom = exploded ? 800 : 0;
const extraX = exploded ? 560 : 0;
const W = Math.round(STAGE.width * K + extraX);
const H = Math.round((STAGE.height + extraTop + extraBottom) * K);

const composites: sharp.OverlayOptions[] = [];
for (const id of LAYER_ORDER) {
  const cal = ASSEMBLY[id];
  const box = layerBox(id);
  const off = exploded ? EXPLODED[id] : { x: 0, y: 0, rotation: 0 };
  const w = Math.round(box.width * K);
  const h = Math.round(box.height * K);
  let img = sharp(path.join(root, "assets/source/trimmed", `noctis-${id}.png`)).resize(w, h);
  const rot = cal.rotation + off.rotation;
  let rw = w, rh = h;
  if (rot) {
    const buf = await img.rotate(rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer({ resolveWithObject: true });
    img = sharp(buf.data);
    rw = buf.info.width; rh = buf.info.height;
  }
  const cx = (cal.x + off.x) * K + extraX;
  const cy = (cal.y + off.y + extraTop) * K;
  composites.push({ input: await img.png().toBuffer(), left: Math.round(cx - rw / 2), top: Math.round(cy - rh / 2) });
  if (flag("--debug")) {
    const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="${w - 2}" height="${h - 2}" fill="none" stroke="#39f" stroke-width="2"/><text x="6" y="22" fill="#39f" font-size="20" font-family="sans-serif">${id}</text></svg>`;
    composites.push({ input: Buffer.from(svg), left: Math.round(cx - w / 2), top: Math.round(cy - h / 2) });
  }
}
if (flag("--debug")) {
  const axis = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><line x1="${500 * K + extraX}" y1="0" x2="${500 * K + extraX}" y2="${H}" stroke="#f33" stroke-width="1"/></svg>`;
  composites.push({ input: Buffer.from(axis), left: 0, top: 0 });
}

const background = full ? { r: 0, g: 0, b: 0, alpha: 0 } : { r: 8, g: 7, b: 6, alpha: 1 };
const canvas = sharp({ create: { width: W, height: H, channels: 4, background } }).composite(composites);

if (full) {
  const out = path.join(root, "public/images/noctis/noctis-full.webp");
  // recorta para a caixa do frasco
  const buf = await canvas.png().toBuffer();
  const info = await sharp(buf).webp({ quality: 88, alphaQuality: 100, effort: 5 }).toFile(out);
  console.log("full", info.width, info.height, info.size);
} else {
  await canvas.png().toFile(outArg);
  console.log("wrote", outArg, W, H);
}
