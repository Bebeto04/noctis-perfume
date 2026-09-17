// Folha de contato das capturas de QA: node scripts/qa-sheet.mjs <dir> <out.png> [colunas] [larguraTile]
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const [dir, out, colsArg = "4", tileArg = "560"] = process.argv.slice(2);
const files = (await readdir(dir)).filter((f) => f.endsWith(".png")).sort();
const cols = Number(colsArg);
const tileW = Number(tileArg);
const first = await sharp(path.join(dir, files[0])).metadata();
const tileH = Math.round((first.height / first.width) * tileW);
const rows = Math.ceil(files.length / cols);
const pad = 8;
const label = 22;

const composites = [];
for (let i = 0; i < files.length; i++) {
  const x = pad + (i % cols) * (tileW + pad);
  const y = pad + Math.floor(i / cols) * (tileH + pad + label);
  composites.push({ input: await sharp(path.join(dir, files[i])).resize(tileW, tileH).png().toBuffer(), left: x, top: y + label });
  const svg = `<svg width="${tileW}" height="${label}" xmlns="http://www.w3.org/2000/svg"><text x="2" y="16" font-family="monospace" font-size="15" fill="#6cf">${files[i]}</text></svg>`;
  composites.push({ input: Buffer.from(svg), left: x, top: y });
}
await sharp({
  create: {
    width: pad + cols * (tileW + pad),
    height: pad + rows * (tileH + pad + label),
    channels: 3,
    background: "#222",
  },
})
  .composite(composites)
  .png()
  .toFile(out);
console.log("sheet", out);
