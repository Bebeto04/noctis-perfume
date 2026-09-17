// Texturas sintéticas do NOCTIS (autorais, geradas por código — não são fotografias):
//  grain.png            ruído monocromático 256×256 para o grão do filme
//  noctis-silk.webp     "seda âmbar à meia-noite": turbulência SVG em tons de âmbar, usada no mouse reveal
import sharp from "sharp";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const out = (f) => path.join(root, "public/images/noctis", f);

// --- grão ---
{
  const S = 200;
  const buf = Buffer.alloc(S * S);
  let seed = 1337;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < S * S; i++) {
    const v = Math.round(rnd() * 255);
    buf[i] = v;
  }
  await sharp(buf, { raw: { width: S, height: S, channels: 1 } }).png({ compressionLevel: 9 }).toFile(out("grain.png"));
}

// --- seda âmbar ---
{
  const W = 1920, H = 1200;
  // cetim: ruído alongado → tabela de transferência em "cristas" → brilho dourado fino sobre âmbar escuro
  const sheen = (id, freq, seed, table, color, blur) => `
    <filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${seed}" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="a"/>
      <feComponentTransfer in="a" result="r"><feFuncA type="table" tableValues="${table}"/></feComponentTransfer>
      <feFlood flood-color="${color}"/>
      <feComposite in2="r" operator="in"/>
      <feGaussianBlur stdDeviation="${blur}"/>
    </filter>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${sheen("s1", "0.0016 0.0075", 7, "0 0 0 0 0 0 0.25 1 0.25 0 0 0 0 0", "#ffcf8a", 0.9)}
    ${sheen("s2", "0.001 0.0048", 21, "0 0 0 0 0.15 0.9 0.15 0 0 0 0", "#fff3dc", 1.8)}
    ${sheen("s3", "0.0024 0.011", 3, "0 0 0 0 0 0 0 0.5 0 0 0 0 0 0", "#d88a30", 0.6)}
    <radialGradient id="light" cx="60%" cy="40%" r="75%">
      <stop offset="0" stop-color="#6e370c"/>
      <stop offset="0.5" stop-color="#2a1305"/>
      <stop offset="1" stop-color="#080504"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#light)"/>
  <g transform="rotate(-22 960 600) translate(-300 -260) scale(1.3)">
    <rect width="${W}" height="${H}" filter="url(#s3)" opacity="0.55"/>
    <rect width="${W}" height="${H}" filter="url(#s1)" opacity="0.85"/>
    <rect width="${W}" height="${H}" filter="url(#s2)" opacity="0.5"/>
  </g>
</svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 84, effort: 6 }).toFile(out("noctis-silk.webp"));
}
console.log("textures ok");
