/**
 * Reflexo falso no vidro. O contêiner é mascarado pela silhueta alfa do frasco montado
 * (noctis-full.webp, renderizado a partir do mesmo config), então a luz nunca sai do objeto.
 *  - .sheen-idle   passa devagar, em loop CSS (fora da main thread)
 *  - .sheen-click  varredura rápida quando a tampa encaixa (controlada pela timeline)
 */
export function PerfumeHighlight() {
  return (
    <div className="glass-sheen" data-sheen aria-hidden="true">
      <span className="sheen-idle" />
      <span className="sheen-click" data-sheen-click />
    </div>
  );
}
