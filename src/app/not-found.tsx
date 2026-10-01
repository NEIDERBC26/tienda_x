import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">404</p>
      <h1 className="mt-2 text-3xl font-bold text-white">No encontramos este producto</h1>
      <p className="mt-2 text-zinc-400">Puede que haya sido removido o que el enlace esté incorrecto.</p>
      <Link href="/" className="mt-6 rounded-full bg-lime-300 px-5 py-2 font-semibold text-black">
        Volver al catálogo
      </Link>
    </div>
  );
}
