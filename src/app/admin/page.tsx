import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [products, categories, published] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.product.count({ where: { isPublished: true } }),
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Resumen general</h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
          <p className="text-sm text-zinc-400">Productos</p>
          <p className="mt-2 text-3xl font-bold">{products}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
          <p className="text-sm text-zinc-400">Categorías</p>
          <p className="mt-2 text-3xl font-bold">{categories}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4">
          <p className="text-sm text-zinc-400">Publicados</p>
          <p className="mt-2 text-3xl font-bold">{published}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5">
        <h3 className="text-lg font-semibold">Acciones rápidas</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/productos" className="rounded-full bg-lime-300 px-4 py-2 text-sm font-semibold text-black">
            Gestionar productos
          </Link>
          <Link href="/admin/categorias" className="rounded-full border border-white/20 px-4 py-2 text-sm">
            Gestionar categorías
          </Link>
          <Link href="/admin/configuracion" className="rounded-full border border-white/20 px-4 py-2 text-sm">
            Personalizar tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
