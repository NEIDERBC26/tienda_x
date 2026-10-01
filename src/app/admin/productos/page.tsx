"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  description: string;
  features: string[];
  isPublished: boolean;
  categoryId: number;
  category: { name: string };
  images: { id: number; url: string }[];
};

type ProductForm = {
  name: string;
  slug: string;
  price: string;
  description: string;
  featuresText: string;
  categoryId: string;
  isPublished: boolean;
  imageUrls: string[];
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  price: "",
  description: "",
  featuresText: "",
  categoryId: "",
  isPublished: true,
  imageUrls: [],
};

export default function AdminProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const features = useMemo(
    () =>
      form.featuresText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    [form.featuresText]
  );

  async function load() {
    setLoading(true);
    const [catRes, prodRes] = await Promise.all([fetch("/api/admin/categories"), fetch("/api/admin/products")]);
    const [catData, prodData] = await Promise.all([catRes.json(), prodRes.json()]);
    setCategories(catData);
    setProducts(
      prodData.map((item: Product) => ({
        ...item,
        price: Number(item.price),
      }))
    );
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    const payload = new FormData();
    payload.append("mode", "product");
    Array.from(files).forEach((file) => payload.append("files", file));

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: payload,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "No se pudieron subir las imágenes");
        return;
      }

      setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...data.urls] }));
    } catch {
      setError("No se pudo conectar para subir las imágenes. Inténtalo de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  function setFromProduct(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      price: String(product.price),
      description: product.description,
      featuresText: product.features.join("\n"),
      categoryId: String(product.categoryId),
      isPublished: product.isPublished,
      imageUrls: product.images.map((img) => img.url),
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      slug: form.slug,
      price: Number(form.price),
      description: form.description,
      features,
      categoryId: Number(form.categoryId),
      isPublished: form.isPublished,
      imageUrls: form.imageUrls,
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin/products/${editingId}` : "/api/admin/products";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message?.formErrors?.[0] || data.message || "No se pudo guardar el producto");
      setSaving(false);
      return;
    }

    setForm(emptyForm);
    setEditingId(null);
    setSaving(false);
    await load();
  }

  async function remove(id: number) {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("No se pudo eliminar");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Productos</h2>

      <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-white/10 bg-zinc-900/40 p-5 md:grid-cols-2">
        <input
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          placeholder="Nombre"
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-lime-300"
        />
        <input
          value={form.slug}
          onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
          placeholder="Slug (opcional)"
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-lime-300"
        />
        <input
          value={form.price}
          onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
          placeholder="Precio en COP"
          type="number"
          min={0}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-lime-300"
        />
        <select
          value={form.categoryId}
          onChange={(e) => setForm((s) => ({ ...s, categoryId: e.target.value }))}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-lime-300"
        >
          <option value="">Selecciona categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <textarea
          value={form.description}
          onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
          placeholder="Descripción detallada"
          rows={4}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-lime-300 md:col-span-2"
        />

        <textarea
          value={form.featuresText}
          onChange={(e) => setForm((s) => ({ ...s, featuresText: e.target.value }))}
          placeholder={"Características (una por línea)\nEjemplo: Espuma reactiva"}
          rows={4}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-lime-300 md:col-span-2"
        />

        <div className="rounded-xl border border-dashed border-white/20 p-4 md:col-span-2">
          <label className="mb-2 block text-sm text-zinc-300">Imágenes del producto</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            multiple
            disabled={uploading}
            onChange={(e) => {
              const files = e.target.files;
              e.currentTarget.value = "";
              void uploadFiles(files);
            }}
          />
          {uploading && <p className="mt-2 text-xs text-zinc-400">Subiendo imágenes...</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {form.imageUrls.map((url) => (
              <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-white/20">
                <Image src={url} alt="Imagen del producto" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-300 md:col-span-2">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm((s) => ({ ...s, isPublished: e.target.checked }))}
          />
          Publicado en el storefront
        </label>

        {error && <p className="text-sm text-red-300 md:col-span-2">{error}</p>}

        <div className="flex gap-2 md:col-span-2">
          <button
            disabled={saving || uploading}
            className="rounded-xl bg-lime-300 px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          >
            {saving ? "Guardando..." : editingId ? "Actualizar producto" : "Crear producto"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-zinc-900/90 text-zinc-400">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-zinc-500">
                  Cargando...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-zinc-500">
                  Aún no hay productos.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-zinc-500">{product.slug}</p>
                  </td>
                  <td className="px-4 py-3">{product.category.name}</td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    {product.isPublished ? (
                      <span className="rounded-full bg-lime-500/20 px-2 py-1 text-xs text-lime-300">Publicado</span>
                    ) : (
                      <span className="rounded-full bg-zinc-700 px-2 py-1 text-xs text-zinc-200">Oculto</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setFromProduct(product)} className="rounded-lg border border-white/20 px-3 py-1 text-xs">
                        Editar
                      </button>
                      <button
                        onClick={() => remove(product.id)}
                        className="rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
