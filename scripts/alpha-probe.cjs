const sharp = require('sharp');
const dir = process.env.USERPROFILE + '/Downloads/ChatGPT Image 16 de set. de 2026, ';
(async () => {
  for (const [f, pts] of [
    ['19_34_50 (4)', [[540,700],[540,500],[540,1100],[300,700],[800,700],[540,1250],[540,220]]],
    ['19_34_51 (5)', [[540,700],[300,700],[250,1100]]],
    ['19_34_51 (6)', [[540,760],[210,510]]],
    ['19_34_49 (1)', [[540,740],[540,500]]],
  ]) {
    const { data, info } = await sharp(dir + f + '.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    console.log(f, pts.map(([x,y]) => { const i=(y*info.width+x)*4; return `(${x},${y})=${data[i]},${data[i+1]},${data[i+2]},a${data[i+3]}`; }).join('  '));
  }
})();
