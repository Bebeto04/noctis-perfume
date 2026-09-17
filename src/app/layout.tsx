import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import { SITE } from "@/config/siteConfig";
import "./globals.css";
import "./scene.css";

// Didone de revista de moda (eixo óptico para títulos enormes e legendas finas)
const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  axes: ["opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

// Grotesca neutra e precisa para interface e legendas
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3221"),
  title: "NOCTIS — Perfume é uma memória que se veste",
  description: SITE.description,
  openGraph: {
    title: "NOCTIS I — Eau de Parfum",
    description: SITE.description,
    images: [{ url: "/images/noctis/noctis-full.webp", width: 1000, height: 1540 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#080706",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <head>
        {["body", "liquid", "cap", "label"].map((p) => (
          <link key={p} rel="preload" as="image" href={`/images/noctis/noctis-${p}.webp`} type="image/webp" />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
