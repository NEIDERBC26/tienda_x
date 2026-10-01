"use client";

import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { products: number };
};

const emptyForm = { name: "", slug: "", description: "" };

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message?.formErrors?.[0] || data.message || "No se pudo guardar");
      return;
    }

    setForm(emptyForm);
    setEditingId(null);
    await load();
  }

  async function remove(id: number) {
    if (!confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(data.message || "No se pudo eliminar");
      return;
    }
    await load();
  }

  function edit(cat: Category) {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
    });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Categorías</h2>

      <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-white/10 bg-zinc-900/40 p-5 md:grid-cols-2">
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-lime-300"
        />
        <input
          placeholder="Slug (opcional)"
          value={form.slug}
          onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-lime-300"
        />
        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-lime-300 md:col-span-2"
          rows={3}
        />
        {error && <p className="text-sm text-red-300 md:col-span-2">{error}</p>}
        <div className="flex gap-2 md:col-span-2">
          <button className="rounded-xl bg-lime-300 px-4 py-2 text-sm font-semibold text-black">
            {editingId ? "Actualizar" : "Crear categoría"}
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

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900/90 text-zinc-400">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-4 text-zinc-500" colSpan={4}>
                  Cargando...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-zinc-500" colSpan={4}>
                  Aún no hay categorías
                </td>
              </tr>
            ) : (
              items.map((cat) => (
                <tr key={cat.id} className="border-t border-white/10">
                  <td className="px-4 py-3">{cat.name}</td>
                  <td className="px-4 py-3 text-zinc-400">{cat.slug}</td>
                  <td className="px-4 py-3">{cat._count?.products ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => edit(cat)} className="rounded-lg border border-white/20 px-3 py-1 text-xs">
                        Editar
                      </button>
                      <button
                        onClick={() => remove(cat.id)}
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
