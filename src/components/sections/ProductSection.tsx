"use client";

import { PRODUCT, formatPrice } from "@/config/siteConfig";

export function ProductSurface() {
  return (
    <div className="surface" data-product-surface aria-hidden="true">
      <div className="surface-floor" />
      <div className="surface-pool" />
    </div>
  );
}

export function ProductSection({ onAdd, busy }: { onAdd: () => void; busy: boolean }) {
  return (
    <section className="product" data-product aria-labelledby="product-title" id="product">
      <h2 id="product-title" className="product-name" data-product-info tabIndex={-1}>
        {PRODUCT.name}
      </h2>
      <p className="product-family" data-product-info>
        {PRODUCT.family.join(" · ")}
      </p>
      <p className="product-kind" data-product-info>
        {PRODUCT.type} · {PRODUCT.size}
      </p>
      <div className="product-buy" data-product-info>
        <p className="product-price">{formatPrice(PRODUCT.price)}</p>
        <button type="button" className="btn-solid btn-add" onClick={onAdd} aria-disabled={busy || undefined}>
          Adicionar à sacola
        </button>
      </div>
    </section>
  );
}
