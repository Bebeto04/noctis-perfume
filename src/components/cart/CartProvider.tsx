"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { PRODUCT } from "@/config/siteConfig";

export interface CartLine {
  id: string;
  name: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
}

type Action =
  | { type: "add"; quantity?: number }
  | { type: "set"; id: string; quantity: number }
  | { type: "remove"; id: string }
  | { type: "hydrate"; lines: CartLine[] };

const MAX_QTY = 9;
const STORAGE_KEY = "noctis-bag-v1";

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case "hydrate":
      return action.lines;
    case "add": {
      const existing = state.find((l) => l.id === PRODUCT.id);
      const qty = action.quantity ?? 1;
      if (existing) {
        return state.map((l) => (l.id === PRODUCT.id ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + qty) } : l));
      }
      return [
        ...state,
        { id: PRODUCT.id, name: PRODUCT.name, size: PRODUCT.size, price: PRODUCT.price, image: PRODUCT.image, quantity: qty },
      ];
    }
    case "set":
      if (action.quantity <= 0) return state.filter((l) => l.id !== action.id);
      return state.map((l) => (l.id === action.id ? { ...l, quantity: Math.min(MAX_QTY, action.quantity) } : l));
    case "remove":
      return state.filter((l) => l.id !== action.id);
  }
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: () => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  maxQuantity: number;
  /** elemento do ícone da sacola (destino da animação de adicionar) */
  bagIconRef: React.RefObject<HTMLSpanElement | null>;
  /** incrementa a cada chegada na sacola — o ícone reage */
  bump: number;
  pulseBag: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [isOpen, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const hydrated = useRef(false);
  const bagIconRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) {
          const valid = parsed
            .filter((l) => l && l.id === PRODUCT.id && Number.isInteger(l.quantity) && l.quantity > 0)
            .map((l) => ({ ...l, price: PRODUCT.price, quantity: Math.min(MAX_QTY, l.quantity) }));
          dispatch({ type: "hydrate", lines: valid });
        }
      }
    } catch {
      /* armazenamento indisponível: a sacola continua funcionando em memória */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignorado */
    }
  }, [lines]);

  const add = useCallback(() => dispatch({ type: "add" }), []);
  const setQuantity = useCallback((id: string, quantity: number) => dispatch({ type: "set", id, quantity }), []);
  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const pulseBag = useCallback(() => setBump((b) => b + 1), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((n, l) => n + l.quantity * l.price, 0);
    return {
      lines,
      count,
      subtotal,
      isOpen,
      open,
      close,
      add,
      setQuantity,
      remove,
      maxQuantity: MAX_QTY,
      bagIconRef,
      bump,
      pulseBag,
    };
  }, [lines, isOpen, open, close, add, setQuantity, remove, bump, pulseBag]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa de <CartProvider>");
  return ctx;
}
