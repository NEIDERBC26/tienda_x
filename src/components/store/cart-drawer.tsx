"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/components/store/cart-provider";
import { formatPrice } from "@/lib/utils";

type Props = {
  whatsappNumber: string;
};

export function CartDrawer({ whatsappNumber }: Props) {
  const { items, isOpen, closeCart, addItem, decrementItem, removeItem, total, clearCart } = useCart();

  const message = encodeURIComponent(
    [
      "Hola, quiero comprar estos tenis:",
      ...items.map(
        (item, i) => `${i + 1}. ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
      ),
      `Total: ${formatPrice(total)}`,
    ].join("\n")
  );

  const checkoutUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            className="fixed inset-0 z-40 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-zinc-950 p-5"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Tu carrito</h3>
              <button onClick={closeCart} className="rounded-full border border-white/10 p-2 text-white">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-auto">
              {items.length === 0 ? (
                <p className="text-sm text-zinc-400">Aún no agregas productos.</p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 p-3">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-zinc-400">{formatPrice(item.price)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => decrementItem(item.id)}
                        className="rounded-full border border-white/20 px-3 py-1 text-xs text-white"
                      >
                        -
                      </button>
                      <span className="text-sm text-white">{item.quantity}</span>
                      <button
                        onClick={() => addItem(item)}
                        className="rounded-full border border-white/20 px-3 py-1 text-xs text-white"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-300"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 p-4">
              <div className="mb-4 flex items-center justify-between text-white">
                <span>Total</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <Link
                href={items.length ? checkoutUrl : "#"}
                target="_blank"
                className={`mb-2 block rounded-full px-4 py-3 text-center text-sm font-semibold transition ${
                  items.length ? "bg-lime-300 text-zinc-900 hover:bg-lime-200" : "bg-zinc-700 text-zinc-400"
                }`}
              >
                Comprar por WhatsApp
              </Link>
              <button
                onClick={clearCart}
                disabled={!items.length}
                className="w-full rounded-full border border-white/20 px-4 py-2 text-sm text-white disabled:opacity-30"
              >
                Vaciar carrito
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
