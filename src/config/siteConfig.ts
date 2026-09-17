export const SITE = {
  name: "NOCTIS",
  tagline: ["Perfume é uma memória", "que se veste."],
  description:
    "NOCTIS I — um eau de parfum âmbar. Bergamota, pimenta-rosa e açafrão se abrem para jasmim, cedro e íris.",
  footerLine: "Deixe algo para trás.",
  // Links sem destino real: a marca é fictícia. Substitua quando existirem.
  social: [
    { label: "Instagram", href: "#" },
    { label: "Diário", href: "#" },
    { label: "Lojas", href: "#" },
    { label: "Contato", href: "#" },
  ],
} as const;

export const PRODUCT = {
  id: "noctis-i",
  name: "NOCTIS I",
  type: "Eau de Parfum",
  size: "100 ML",
  family: ["Amadeirado", "Âmbar", "Floral"],
  price: 589,
  currency: "BRL",
  image: "/images/noctis/noctis-full.webp",
} as const;

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);

export const OPENING_NOTES = [
  { id: "bergamot", name: "Bergamota", origin: "Bergamota italiana", facets: ["Fresca", "Cítrica", "Luminosa"] },
  { id: "pink-pepper", name: "Pimenta-rosa", origin: "Pimenta-rosa", facets: ["Quente", "Vibrante", "Especiada"] },
  { id: "saffron", name: "Açafrão", origin: "Açafrão", facets: ["Seco", "Rico", "Viciante"] },
] as const;

export const HEART_NOTES = [
  { id: "jasmine", name: "Jasmim", line: "Pétalas que se abrem ao anoitecer." },
  { id: "cedarwood", name: "Cedro", line: "Seco, silencioso, estrutural." },
  { id: "iris", name: "Íris", line: "Empoada, fria, rente à pele." },
] as const;

export const PARTS = [
  { id: "cap", title: "Tampa", line: "Acabamento esculpido e tátil." },
  { id: "atomizer", title: "Atomizador", line: "Válvula de spray de precisão." },
  { id: "collar", title: "Gola", line: "Metal polido." },
  { id: "body", title: "Vidro", line: "Vidro espesso e arquitetônico." },
  { id: "liquid", title: "Essência", line: "Eau de Parfum âmbar." },
  { id: "label", title: "Placa", line: "Assinatura em metal escovado." },
] as const;

export const PERSONALITY = ["Misterioso", "Íntimo", "Atemporal", "Quente", "Ousado"] as const;

export const NAV_LINKS = [
  { label: "Fragrância", chapter: "opening" },
  { label: "Notas", chapter: "heart" },
  { label: "Criação", chapter: "exploded" },
  { label: "História", chapter: "personality" },
] as const;
