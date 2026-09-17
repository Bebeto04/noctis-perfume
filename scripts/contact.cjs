const sharp = require('sharp');
const dir = process.env.USERPROFILE + '/Downloads/ChatGPT Image 16 de set. de 2026, ';
const out = process.argv[2];
const files = ['19_34_49 (1)','19_34_50 (2)','19_34_50 (3)','19_34_50 (4)','19_34_51 (5)','19_34_51 (6)','19_47_00'];
(async () => {
  const tiles = [];
  for (let k = 0; k < files.length; k++) {
    const buf = await sharp(dir + files[k] + '.png').resize({ height: 560 }).png().toBuffer();
    tiles.push({ input: buf, left: 20 + k * 450, top: 20 });
  }
  await sharp({ create: { width: 20 + files.length * 450, height: 600, channels: 4, background: '#080706' } })
    .composite(tiles).png().toFile(out);
})();
