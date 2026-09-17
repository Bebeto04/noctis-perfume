"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/config/siteConfig";

/**
 * Gaveta da sacola sobre <dialog> nativo: foco preso, Esc fecha, fundo inerte e
 * retorno do foco ao gatilho vêm do navegador. A entrada/saída é CSS (@starting-style + allow-discrete).
 */
export function CartDrawer() {
  const { lines, subtotal, isOpen, close, setQuantity, remove, maxQuantity, count } = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      setNotice(false);
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClose = () => close();
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [close]);

  return (
    <dialog
      ref={ref}
      className="drawer"
      aria-labelledby="bag-title"
      onClick={(e) => {
        // clique no backdrop (fora do painel) fecha
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="drawer-panel">
        <header className="drawer-head">
          <h2 id="bag-title">
            Sua sacola <span className="drawer-count">({count})</span>
          </h2>
          <button type="button" className="drawer-close" onClick={close} aria-label="Fechar sacola">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1" />
            </svg>
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="drawer-empty">
            <p className="drawer-empty-title">Nada por aqui ainda.</p>
            <p>O NOCTIS I espera por você no fim da história.</p>
            <button type="button" className="btn-line" onClick={close}>
              Continuar
            </button>
          </div>
        ) : (
          <>
            <ul className="drawer-lines">
              {lines.map((line) => (
                <li key={line.id} className="drawer-line">
                  <div className="drawer-thumb" aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={line.image} alt="" width={1000} height={1540} />
                  </div>
                  <div className="drawer-line-body">
                    <p className="drawer-line-name">{line.name}</p>
                    <p className="drawer-line-meta">Eau de Parfum · {line.size}</p>
                    <div className="qty" role="group" aria-label={`Quantidade de ${line.name}`}>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.id, line.quantity - 1)}
                        aria-label="Diminuir quantidade"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                          <path d="M2 6h8" stroke="currentColor" />
                        </svg>
                      </button>
                      <output aria-live="polite">{line.quantity}</output>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.id, line.quantity + 1)}
                        disabled={line.quantity >= maxQuantity}
                        aria-label="Aumentar quantidade"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                          <path d="M2 6h8M6 2v8" stroke="currentColor" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="drawer-line-side">
                    <p className="drawer-price">{formatPrice(line.price * line.quantity)}</p>
                    <button type="button" className="link-quiet" onClick={() => remove(line.id)}>
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="drawer-foot">
              <div className="drawer-subtotal">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="drawer-note">Frete e impostos calculados na finalização.</p>
              <button type="button" className="btn-solid" onClick={() => setNotice(true)}>
                Finalizar compra
              </button>
              <p className="drawer-demo" role="status">
                {notice ? "A finalização não está conectada nesta edição de portfólio. Sua sacola fica salva." : ""}
              </p>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
}
