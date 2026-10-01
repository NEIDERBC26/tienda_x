import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";

const links = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/configuracion", label: "Personalización" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/10 bg-black/80">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Tienda X</p>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-6 md:grid-cols-[240px_1fr] md:px-8">
        <aside className="h-fit rounded-2xl border border-white/10 bg-zinc-900/40 p-3">
          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
