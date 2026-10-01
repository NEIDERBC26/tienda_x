"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Settings = {
  storeName: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  whatsappNumber: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  heroTitle: string;
  heroSubtitle: string;
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>({
    storeName: "",
    logoUrl: null,
    primaryColor: "#A3E635",
    secondaryColor: "#38BDF8",
    accentColor: "#F97316",
    whatsappNumber: "",
    instagramUrl: "",
    facebookUrl: "",
    tiktokUrl: "",
    heroTitle: "",
    heroSubtitle: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setForm(data);
      setLoading(false);
    })();
  }, []);

  async function uploadLogo(file: File | null) {
    if (!file) return;
    setUploadingLogo(true);
    setError(null);
    const payload = new FormData();
    payload.append("mode", "logo");
    payload.append("files", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: payload,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "No se pudo subir el logo");
        return;
      }

      setForm((prev) => ({ ...prev, logoUrl: data.urls?.[0] || prev.logoUrl }));
    } catch {
      setError("No se pudo conectar para subir el logo. Inténtalo de nuevo.");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message?.formErrors?.[0] || data.message || "No se pudo guardar");
      setSaving(false);
      return;
    }

    setForm(data);
    setSaving(false);
  }

  if (loading) return <p className="text-zinc-400">Cargando configuración...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Personalización de tienda</h2>

      <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-white/10 bg-zinc-900/40 p-5 md:grid-cols-2">
        <label className="text-sm md:col-span-2">
          Nombre de la tienda
          <input
            value={form.storeName}
            onChange={(e) => setForm((s) => ({ ...s, storeName: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3"
          />
        </label>

        <label className="text-sm">
          Color primario
          <input
            type="color"
            value={form.primaryColor}
            onChange={(e) => setForm((s) => ({ ...s, primaryColor: e.target.value }))}
            className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/40 px-1"
          />
        </label>

        <label className="text-sm">
          Color secundario
          <input
            type="color"
            value={form.secondaryColor}
            onChange={(e) => setForm((s) => ({ ...s, secondaryColor: e.target.value }))}
            className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/40 px-1"
          />
        </label>

        <label className="text-sm md:col-span-2">
          Color acento
          <input
            type="color"
            value={form.accentColor}
            onChange={(e) => setForm((s) => ({ ...s, accentColor: e.target.value }))}
            className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-black/40 px-1"
          />
        </label>

        <label className="text-sm md:col-span-2">
          Logo de la tienda
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            disabled={uploadingLogo}
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              e.currentTarget.value = "";
              void uploadLogo(file);
            }}
            className="mt-2"
          />
          {uploadingLogo && <p className="mt-2 text-xs text-zinc-400">Subiendo logo...</p>}
          {form.logoUrl && (
            <div className="mt-3 flex items-center gap-3">
              <Image src={form.logoUrl} alt="Vista previa del logo" width={64} height={64} className="h-16 w-16 rounded-lg border border-white/10 object-contain" />
              <p className="text-xs text-zinc-400">Guarda la configuración para aplicar este logo en la tienda.</p>
            </div>
          )}
        </label>

        <label className="text-sm md:col-span-2">
          Número de WhatsApp (con indicativo)
          <input
            value={form.whatsappNumber ?? ""}
            onChange={(e) => setForm((s) => ({ ...s, whatsappNumber: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3"
            placeholder="573001112233"
          />
        </label>

        <label className="text-sm">
          Instagram URL
          <input
            value={form.instagramUrl ?? ""}
            onChange={(e) => setForm((s) => ({ ...s, instagramUrl: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3"
            placeholder="https://instagram.com/tu_tienda"
          />
        </label>

        <label className="text-sm">
          Facebook URL
          <input
            value={form.facebookUrl ?? ""}
            onChange={(e) => setForm((s) => ({ ...s, facebookUrl: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3"
            placeholder="https://facebook.com/tu_tienda"
          />
        </label>

        <label className="text-sm md:col-span-2">
          TikTok URL
          <input
            value={form.tiktokUrl ?? ""}
            onChange={(e) => setForm((s) => ({ ...s, tiktokUrl: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3"
            placeholder="https://www.tiktok.com/@tu_tienda"
          />
        </label>

        <label className="text-sm md:col-span-2">
          Título principal
          <input
            value={form.heroTitle}
            onChange={(e) => setForm((s) => ({ ...s, heroTitle: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3"
          />
        </label>

        <label className="text-sm md:col-span-2">
          Subtítulo principal
          <textarea
            value={form.heroSubtitle}
            onChange={(e) => setForm((s) => ({ ...s, heroSubtitle: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3"
            rows={3}
          />
        </label>

        {error && <p className="text-sm text-red-300 md:col-span-2">{error}</p>}

        <button className="rounded-xl bg-lime-300 px-4 py-3 text-sm font-semibold text-black md:col-span-2" disabled={saving}>
          {saving ? "Guardando..." : "Guardar configuración"}
        </button>
      </form>
    </div>
  );
}
