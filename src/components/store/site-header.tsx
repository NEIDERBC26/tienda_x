"use client";

import Image from "next/image";
import Link from "next/link";
import { Bars3Icon, ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useCart } from "@/components/store/cart-provider";
import { cn } from "@/lib/utils";
import type { ThemeSettings } from "@/types/domain";

type Props = {
  settings: ThemeSettings;
};

export function SiteHeader({ settings }: Props) {
  const { count, openCart } = useCart();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Catálogo" },
    { href: "/#novedades", label: "Novedades" },
    { href: "/#contacto", label: "Contacto" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-black/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          {settings.logoUrl ? (
            <Image src={settings.logoUrl} alt={settings.storeName} width={42} height={42} className="rounded-full" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-sm font-bold">
              TX
            </div>
          )}
          <span className="text-lg font-semibold tracking-wide text-white">{settings.storeName}</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={openCart} className="relative rounded-full border border-white/20 p-2 text-white">
            <ShoppingBagIcon className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-300 px-1 text-xs font-bold text-black">
                {count}
              </span>
            )}
          </button>

          <button className="rounded-full border border-white/20 p-2 text-white md:hidden" onClick={() => setOpen(!open)}>
            {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={cn("border-t border-white/10 px-4 pb-4 md:hidden", open ? "block" : "hidden")}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block py-2 text-sm text-zinc-300" onClick={() => setOpen(false)}>
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
