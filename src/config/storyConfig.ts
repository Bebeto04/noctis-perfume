/**
 * NOCTIS — roteiro da narrativa.
 *
 * A história inteira é UMA timeline GSAP com scrub. A unidade de tempo é "vh de scroll":
 * um tween em [100, 180] acontece enquanto o visitante rola de 100vh a 180vh dentro da história.
 * Alterar um número aqui move o momento no scroll; os componentes nunca carregam números mágicos.
 */

export type Range = readonly [number, number];

export const STORY = {
  /** comprimento total da timeline (vh de scroll) */
  length: 1780,
  scrub: 0.6,

  hero: { textOut: [5, 50] as Range, scrollCue: [0, 30] as Range },

  opening: {
    bottleIn: [10, 120] as Range,
    title: [62, 118] as Range,
    notes: [80, 150] as Range,
    copy: [110, 160] as Range,
    interactive: [120, 190] as Range,
    out: [185, 222] as Range,
  },

  dive: {
    center: [200, 255] as Range,
    zoom: [255, 345] as Range,
    iris: [305, 352] as Range,
    blur: [320, 350] as Range,
  },

  inside: {
    title: [345, 405] as Range,
    jasmine: [390, 475] as Range,
    cedarwood: [455, 540] as Range,
    iris: [520, 600] as Range,
    leaks: [345, 640] as Range,
    darken: [600, 650] as Range,
  },

  craft: {
    bottleBack: [630, 710] as Range,
    title: [680, 740] as Range,
    out: [760, 790] as Range,
  },

  explode: {
    frame: [760, 820] as Range,
    cap: [790, 840] as Range,
    atomizer: [825, 865] as Range,
    collar: [852, 885] as Range,
    label: [875, 915] as Range,
    liquid: [900, 945] as Range,
    lines: [930, 990] as Range,
    hold: [945, 1080] as Range,
  },

  reassemble: {
    linesOut: [1070, 1100] as Range,
    liquid: [1090, 1130] as Range,
    label: [1115, 1150] as Range,
    collar: [1140, 1170] as Range,
    atomizer: [1160, 1190] as Range,
    cap: [1180, 1215] as Range,
    click: [1213, 1250] as Range,
  },

  personality: {
    bottle: [1240, 1300] as Range,
    title: [1246, 1280] as Range,
    words: [1325, 1455] as Range,
    out: [1296, 1322] as Range,
  },

  reveal: {
    bottleOut: [1455, 1505] as Range,
    in: [1500, 1545] as Range,
    wander: [1545, 1630] as Range,
    out: [1630, 1660] as Range,
  },

  product: {
    surface: [1630, 1690] as Range,
    descend: [1650, 1740] as Range,
    info: [1705, 1760] as Range,
  },
} as const;

/** Onde a navegação leva (vh de scroll dentro da história). */
export const CHAPTER_ANCHORS = {
  top: 0,
  opening: 150,
  heart: 470,
  exploded: 1000,
  personality: 1330,
  reveal: 1580,
  product: STORY.length,
} as const;

export type ChapterId = keyof typeof CHAPTER_ANCHORS;

export interface Pose {
  /** deslocamento horizontal do centro do frasco, fração da largura da viewport */
  x: number;
  /** deslocamento vertical, fração da altura da viewport */
  y: number;
  /** escala relativa ao tamanho base do palco */
  scale: number;
  rotation: number;
}

export type Layout = "desktop" | "tablet" | "mobile";

/** Altura base do palco do frasco (fração da altura da viewport). */
export const RIG_BASE_HEIGHT = 0.8;

export const POSES: Record<Layout, Record<string, Pose>> = {
  desktop: {
    hero: { x: 0, y: 0.005, scale: 0.9, rotation: 0 },
    opening: { x: 0.2, y: 0.05, scale: 0.8, rotation: 2 },
    diveStart: { x: 0, y: 0.02, scale: 0.92, rotation: 0 },
    crafted: { x: 0.2, y: 0.02, scale: 0.8, rotation: 0 },
    exploded: { x: 0.07, y: 0.035, scale: 0.5, rotation: 0 },
    personality: { x: -0.22, y: 0.04, scale: 0.82, rotation: -2 },
    personalityEnd: { x: -0.2, y: 0.02, scale: 0.8, rotation: 1 },
    revealOut: { x: -0.08, y: -1.05, scale: 0.7, rotation: 0 },
    product: { x: -0.18, y: 0.035, scale: 0.72, rotation: 0 },
  },
  tablet: {
    hero: { x: 0, y: 0.02, scale: 0.78, rotation: 0 },
    opening: { x: 0.2, y: -0.08, scale: 0.56, rotation: 2 },
    diveStart: { x: 0, y: 0, scale: 0.76, rotation: 0 },
    crafted: { x: 0, y: -0.14, scale: 0.56, rotation: 0 },
    exploded: { x: 0.04, y: 0.02, scale: 0.5, rotation: 0 },
    personality: { x: 0, y: -0.12, scale: 0.58, rotation: -2 },
    personalityEnd: { x: 0.02, y: -0.14, scale: 0.56, rotation: 1 },
    revealOut: { x: 0, y: -1.05, scale: 0.5, rotation: 0 },
    product: { x: 0, y: -0.15, scale: 0.52, rotation: 0 },
  },
  mobile: {
    hero: { x: 0, y: -0.02, scale: 0.66, rotation: 0 },
    opening: { x: 0.2, y: -0.2, scale: 0.4, rotation: 3 },
    diveStart: { x: 0, y: 0, scale: 0.62, rotation: 0 },
    crafted: { x: 0, y: -0.16, scale: 0.46, rotation: 0 },
    exploded: { x: 0.06, y: -0.005, scale: 0.41, rotation: 0 },
    personality: { x: 0, y: -0.16, scale: 0.46, rotation: -2 },
    personalityEnd: { x: 0.02, y: -0.18, scale: 0.44, rotation: 1 },
    revealOut: { x: 0, y: -1.05, scale: 0.4, rotation: 0 },
    product: { x: 0, y: -0.19, scale: 0.46, rotation: 0 },
  },
};

/** Ponto do palco (unidades) para onde a "câmera" mergulha: dentro da janela de líquido, abaixo da placa. */
export const DIVE_FOCUS = { x: 481, y: 1130, scale: 4.6 } as const;

export const layoutFor = (width: number): Layout => (width >= 1024 ? "desktop" : width >= 700 ? "tablet" : "mobile");
