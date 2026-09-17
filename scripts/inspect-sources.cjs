// Mede cada imagem-fonte: dimensões, canal alfa, cor de fundo e caixa do conteúdo.
const sharp = require('sharp');
const dir = process.env.USERPROFILE + '/Downloads/ChatGPT Image 16 de set. de 2026, ';
const files = ['19_34_49 (1)','19_34_50 (2)','19_34_50 (3)','19_34_50 (4)','19_34_51 (5)','19_34_51 (6)','19_47_00'];
(async () => {
  for (const f of files) {
    const img = sharp(dir + f + '.png');
    const m = await img.metadata();
    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const W = info.width, H = info.height;
    let transparent = 0, minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
    const corner = [...data.slice(0, 4)];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      if (data[i+3] < 10) { transparent++; continue; }
      const r = data[i], g = data[i+1], b = data[i+2];
      if (r > 235 && g > 235 && b > 235) continue;
      if (x < minX) minX = x; if (y < minY) minY = y; if (x > maxX) maxX = x; if (y > maxY) maxY = y;
    }
    console.log(f.padEnd(14), `${W}x${H}`, 'alpha', m.hasAlpha, 'transp%', (100*transparent/(W*H)).toFixed(1), 'corner', corner.join(','), 'bbox', minX, minY, maxX, maxY, 'size', maxX-minX+1, maxY-minY+1, 'cx', ((minX+maxX)/2).toFixed(0));
  }
})();
