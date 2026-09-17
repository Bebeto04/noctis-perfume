// Mede (1) a caixa alfa de cada peça e (2) a largura contínua de cada linha da vista explodida
const sharp = require('sharp');
const dir = process.env.USERPROFILE + '/Downloads/ChatGPT Image 16 de set. de 2026, ';
const parts = { cap: '19_34_49 (1)', atomizer: '19_34_50 (2)', collar: '19_34_50 (3)', body: '19_34_50 (4)', liquid: '19_34_51 (5)', label: '19_34_51 (6)' };
(async () => {
  for (const [name, f] of Object.entries(parts)) {
    const { data, info } = await sharp(dir + f + '.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let minX=1e9,minY=1e9,maxX=-1,maxY=-1;
    for (let y=0;y<info.height;y++) for (let x=0;x<info.width;x++) if (data[(y*info.width+x)*4+3] > 24) { if(x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y; }
    console.log(name.padEnd(9), 'alphaBBox', minX, minY, maxX, maxY, 'w', maxX-minX+1, 'h', maxY-minY+1, 'cx', (minX+maxX)/2, 'cy', (minY+maxY)/2);
  }
  const { data, info } = await sharp(dir + '19_47_00.png').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width;
  const op = (x,y) => data[(y*W+x)*4+3] > 60;
  let prev = '';
  for (let y = 0; y < info.height; y += 2) {
    // run contendo a coluna central 540 (ou a mais próxima opaca entre 500..580)
    let c = -1; for (let d = 0; d < 60; d++) { if (op(540+d,y)) { c = 540+d; break; } if (op(540-d,y)) { c = 540-d; break; } }
    let s = '';
    if (c >= 0) { let l=c; while (l>0 && (op(l-1,y)||op(l-2,y))) l--; let r=c; while (r<W-1 && (op(r+1,y)||op(r+2,y))) r++; s = `${l}-${r} w${r-l+1} c${(l+r)/2}`; }
    // label run (x<400)
    let lab=''; { let l=-1,r=-1; for (let x=150;x<400;x++) if (op(x,y)) { if(l<0)l=x; r=x; } if (l>=0) lab = ` | L ${l}-${r}`; }
    const line = s + lab;
    if (line !== prev) console.log('y', y, line);
    prev = line;
  }
})();
