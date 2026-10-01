"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/types/domain";

const STORAGE_KEY = "tienda_x_cart";

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  decrementItem: (id: number) => void;
  clearCart: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const addItem = (item: Omit<CartItem, "quantity">) => {
      setItems((prev) => {
        const found = prev.find((x) => x.id === item.id);
        if (found) {
          return prev.map((x) => (x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x));
        }
        return [...prev, { ...item, quantity: 1 }];
      });
      setIsOpen(true);
    };

    const removeItem = (id: number) => setItems((prev) => prev.filter((x) => x.id !== id));

    const decrementItem = (id: number) => {
      setItems((prev) =>
        prev
          .map((x) => (x.id === id ? { ...x, quantity: x.quantity - 1 } : x))
          .filter((x) => x.quantity > 0)
      );
    };

    const clearCart = () => setItems([]);

    return {
      items,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      decrementItem,
      clearCart,
      count: items.reduce((acc, item) => acc + item.quantity, 0),
      total: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
