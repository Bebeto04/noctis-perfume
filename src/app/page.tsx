import dynamic from "next/dynamic";
import { Experience } from "@/components/Experience";

// Ferramenta de calibração: só existe fora de produção
const PerfumeDebug =
  process.env.NODE_ENV !== "production" ? dynamic(() => import("@/components/noctis/PerfumeDebug")) : null;

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  // em produção a página não lê a URL e é pré-renderizada como estática
  if (!PerfumeDebug) return <Experience />;
  const params = await searchParams;
  if (params.debugPerfume === "true") return <PerfumeDebug />;
  return <Experience />;
}
