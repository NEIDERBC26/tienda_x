"use client";

import { motion } from "framer-motion";
import { useCart } from "@/components/store/cart-provider";
import { formatPrice } from "@/lib/utils";

type Props = {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    imageUrl?: string;
  };
};

export function AddToCartButton({ product }: Props) {
  const { addItem } = useCart();

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      onClick={() => addItem(product)}
      className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-lime-300 hover:bg-lime-300/20"
    >
      Agregar · {formatPrice(product.price)}
    </motion.button>
  );
}
