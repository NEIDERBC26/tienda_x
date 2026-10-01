import { ProductCard } from "@/components/store/product-card";
import { getStoreSettings } from "@/lib/store-settings";
import { getStorefrontCategories, getStorefrontProducts } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() || "";
  const category = params.category?.trim() || "";

  const [settings, categories, products] = await Promise.all([
    getStoreSettings(),
    getStorefrontCategories(),
    getStorefrontProducts({ search: search || undefined, category: category || undefined }),
  ]);

  return (
    <div>
      <section className="mb-8 rounded-3xl border border-white/10 bg-zinc-900/50 p-6 md:p-10">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-zinc-400">Colección 2026</p>
        <h1 className="editorial-title text-4xl font-bold leading-tight text-white md:text-6xl">{settings.heroTitle}</h1>
        <p className="mt-3 max-w-2xl text-zinc-300">{settings.heroSubtitle}</p>
      </section>

      <section className="mb-8 rounded-3xl border border-white/10 bg-zinc-950 p-4 md:p-6">
        <form className="grid gap-3 md:grid-cols-[1fr_220px_120px]" action="/" method="GET">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Buscar por nombre o descripción"
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-lime-300"
          />
          <select
            name="category"
            defaultValue={category}
            className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-lime-300"
          >
            <option value="">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name} ({cat._count.products})
              </option>
            ))}
          </select>
          <button className="rounded-xl bg-lime-300 px-4 py-3 text-sm font-semibold text-black transition hover:bg-lime-200">
            Filtrar
          </button>
        </form>
      </section>

      <section id="novedades" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-white/10 p-6 text-zinc-400">
            No encontramos productos para tu búsqueda.
          </p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(product.price),
                category: { name: product.category.name },
                images: product.images.map((img) => ({ url: img.url })),
              }}
            />
          ))
        )}
      </section>
    </div>
  );
}
