// Caixa da janela transparente do corpo (onde o líquido aparece) e caixa sólida do líquido, em px recortados
import sharp from "sharp";
const load = async (f) => sharp(`assets/source/trimmed/${f}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const b = await load("noctis-body.png");
const W = b.info.width, H = b.info.height, a = (x, y) => b.data[(y * W + x) * 4 + 3];
// linha a linha: run transparente (<30) contendo x=380
let rows = [];
for (let y = 150; y < H - 50; y += 10) {
  if (a(380, y) >= 30) continue;
  let l = 380, r = 380;
  while (l > 0 && a(l - 1, y) < 30) l--;
  while (r < W - 1 && a(r + 1, y) < 30) r++;
  rows.push([y, l, r]);
}
console.log("window rows first/last", rows[0], rows[rows.length - 1], "mid", rows[Math.floor(rows.length / 2)]);
// coluna x=380: run transparente
let t = 400; while (a(380, t - 1) < 30) t--; let bt = 400; while (a(380, bt + 1) < 30) bt++;
console.log("window col x=380 top", t, "bottom", bt);
// janela "visual" mais ampla: alfa < 160 (vidro âmbar interno é semi)
for (const thr of [120, 200]) {
  let y = 700, l = 380, r = 380; while (l > 0 && a(l - 1, y) < thr) l--; while (r < W - 1 && a(r + 1, y) < thr) r++;
  let t2 = 700; while (t2 > 0 && a(380, t2 - 1) < thr) t2--; let b2 = 700; while (b2 < H - 1 && a(380, b2 + 1) < thr) b2++;
  console.log("thr", thr, "row700", l, r, "col380", t2, b2);
}
const L = await load("noctis-liquid.png");
const LW = L.info.width, la = (x, y) => L.data[(y * LW + x) * 4 + 3];
let ll = 0; while (la(ll, 500) < 200) ll++; let lr = LW - 1; while (la(lr, 500) < 200) lr--;
let lt = 0; while (la(360, lt) < 200) lt++; let lb = L.info.height - 1; while (la(360, lb) < 200) lb--;
console.log("liquid solid", ll, lr, lt, lb, "size", LW, L.info.height);
// ombro frontal do corpo: primeira linha com largura total >= 780
