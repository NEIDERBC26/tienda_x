"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

type Props = {
  images: { id: number; url: string; alt: string | null }[];
  name: string;
};

export function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(images[0]?.url || "/uploads/demo/placeholder.svg");

  return (
    <div>
      <motion.div
        key={active}
        initial={{ opacity: 0.5, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-4 aspect-square overflow-hidden rounded-3xl border border-white/10 bg-zinc-900"
      >
        <Image src={active} alt={name} fill className="object-cover" />
      </motion.div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setActive(image.url)}
            className={`relative aspect-square overflow-hidden rounded-xl border ${
              active === image.url ? "border-lime-300" : "border-white/10"
            }`}
          >
            <Image src={image.url} alt={image.alt ?? name} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
