"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "No fue posible iniciar sesión");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-900 p-8">
        <h1 className="text-2xl font-semibold text-white">Panel de administración</h1>
        <p className="mt-2 text-sm text-zinc-400">Ingresa con tus credenciales definidas en .env</p>

        <label className="mt-6 block text-sm text-zinc-300">Usuario</label>
        <input
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-lime-300"
          required
        />

        <label className="mt-4 block text-sm text-zinc-300">Contraseña</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-lime-300"
          required
        />

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

        <button
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-lime-300 px-4 py-3 font-semibold text-black transition hover:bg-lime-200 disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}
