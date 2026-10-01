"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { formatPrice } from "@/lib/utils";

type Props = {
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    category: { name: string };
    images: { url: string }[];
  };
};

export function ProductCard({ product }: Props) {
  const firstImage = product.images[0]?.url ?? "/uploads/demo/placeholder.svg";

  return (
    <motion.article whileHover={{ y: -5 }} className="group rounded-3xl border border-white/10 bg-zinc-900/70 p-3">
      <Link href={`/producto/${product.slug}`} className="relative mb-3 block aspect-[4/5] overflow-hidden rounded-2xl">
        <Image src={firstImage} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">{product.category.name}</p>
      <h3 className="mt-1 text-lg font-semibold text-white">{product.name}</h3>
      <p className="mb-3 mt-1 text-sm text-zinc-300">{formatPrice(product.price)}</p>
      <AddToCartButton
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          imageUrl: firstImage,
        }}
      />
    </motion.article>
  );
}
