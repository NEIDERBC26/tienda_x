import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { ProductGallery } from "@/components/store/product-gallery";
import { formatPrice } from "@/lib/utils";
import { getPublishedProductBySlug } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <ProductGallery
        images={product.images.map((image) => ({ id: image.id, url: image.url, alt: image.alt }))}
        name={product.name}
      />
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{product.category.name}</p>
        <h1 className="mt-2 text-4xl font-bold text-white">{product.name}</h1>
        <p className="mt-3 text-2xl font-semibold text-lime-300">{formatPrice(Number(product.price))}</p>

        <p className="mt-6 text-zinc-300">{product.description}</p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
          <h2 className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-400">Características</h2>
          <ul className="space-y-2 text-sm text-zinc-200">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-lime-300" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 max-w-sm">
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: Number(product.price),
              imageUrl: product.images[0]?.url,
            }}
          />
        </div>
      </div>
    </div>
  );
}
