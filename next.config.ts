import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O projeto vive dentro de uma pasta que tem outro package-lock.json acima.
  // Sem fixar a raiz, o Turbopack sobe demais ao procurar o workspace.
  turbopack: { root: __dirname },
};

export default nextConfig;
