import Link from "next/link";
import type { ThemeSettings } from "@/types/domain";

type Props = {
  settings: ThemeSettings;
};

export function SiteFooter({ settings }: Props) {
  const socials = [
    { href: settings.instagramUrl, label: "Instagram" },
    { href: settings.facebookUrl, label: "Facebook" },
    { href: settings.tiktokUrl, label: "TikTok" },
  ].filter((x) => Boolean(x.href));

  return (
    <footer id="contacto" className="mt-16 border-t border-white/10 bg-black/80">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-2 md:px-8">
        <div>
          <p className="text-xl font-semibold text-white">{settings.storeName}</p>
          <p className="mt-2 max-w-md text-sm text-zinc-400">
            Tienda especializada en tenis con curaduría premium y atención personalizada por WhatsApp.
          </p>
        </div>
        <div className="md:text-right">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Redes sociales</p>
          <div className="mt-3 flex flex-wrap gap-3 md:justify-end">
            {socials.length === 0 ? (
              <p className="text-sm text-zinc-500">Configura tus redes desde el panel de administración.</p>
            ) : (
              socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href!}
                  target="_blank"
                  className="rounded-full border border-white/20 px-4 py-2 text-sm text-zinc-300 hover:text-white"
                >
                  {social.label}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
