// Perfil de largura por linha (run contínuo em torno do centro) para cada peça
const sharp = require('sharp');
const dir = process.env.USERPROFILE + '/Downloads/ChatGPT Image 16 de set. de 2026, ';
const which = process.argv[2]; const f = { cap: '19_34_49 (1)', atomizer: '19_34_50 (2)', collar: '19_34_50 (3)', body: '19_34_50 (4)', liquid: '19_34_51 (5)', label: '19_34_51 (6)' }[which];
const step = +process.argv[3] || 8, cx0 = +process.argv[4] || 543;
(async () => {
  const { data, info } = await sharp(dir + f + '.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width; const op = (x,y) => data[(y*W+x)*4+3] > 40;
  for (let y = 0; y < info.height; y += step) {
    let l=-1,r=-1,count=0; for (let x=0;x<W;x++) if (op(x,y)) { if(l<0)l=x; r=x; count++; }
    if (l >= 0) console.log('y', y, 'extent', l, r, 'w', r-l+1, 'c', (l+r)/2, 'fill', count);
  }
})();
