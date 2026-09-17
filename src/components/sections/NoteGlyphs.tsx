/**
 * Abstrações das notas de saída, desenhadas em traço dourado de 1px.
 * Estrutura pronta para trocar por PNG de ingrediente: basta renderizar <img> no lugar do <svg>.
 */
export function NoteGlyph({ id }: { id: string }) {
  switch (id) {
    case "bergamot":
      // corte transversal de cítrico: anel + gomos
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="26" />
          <circle cx="32" cy="32" r="21" opacity="0.55" />
          {Array.from({ length: 9 }, (_, i) => {
            const a = (i / 9) * Math.PI * 2;
            return (
              <line key={i} x1="32" y1="32" x2={32 + Math.cos(a) * 20} y2={32 + Math.sin(a) * 20} opacity="0.7" />
            );
          })}
          <circle cx="32" cy="32" r="2" className="fill" />
        </svg>
      );
    case "pink-pepper":
      // grãos soltos, um deles aceso
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="24" cy="26" r="9" />
          <circle cx="40" cy="22" r="6" opacity="0.7" />
          <circle cx="38" cy="40" r="10" className="fill-soft" />
          <circle cx="20" cy="44" r="4.5" opacity="0.6" />
          <circle cx="50" cy="36" r="2.5" className="fill" />
        </svg>
      );
    default:
      // estigmas de açafrão: três fios curvos que se encontram
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M32 56 C30 40 18 30 12 10" />
          <path d="M32 56 C33 38 34 24 30 6" opacity="0.8" />
          <path d="M32 56 C36 42 46 32 54 14" opacity="0.65" />
          <circle cx="12" cy="10" r="2.2" className="fill" />
          <circle cx="30" cy="6" r="2.2" className="fill" />
          <circle cx="54" cy="14" r="2.2" className="fill" />
        </svg>
      );
  }
}
