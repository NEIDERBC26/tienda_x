import { CartDrawer } from "@/components/store/cart-drawer";
import { CartProvider } from "@/components/store/cart-provider";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { resolveWhatsappNumber, getStoreSettings } from "@/lib/store-settings";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await getStoreSettings();
  const themeSettings = {
    storeName: settings.storeName,
    logoUrl: settings.logoUrl,
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    accentColor: settings.accentColor,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    whatsappNumber: settings.whatsappNumber,
    instagramUrl: settings.instagramUrl,
    facebookUrl: settings.facebookUrl,
    tiktokUrl: settings.tiktokUrl,
  };
  const whatsappNumber = resolveWhatsappNumber(settings.whatsappNumber);

  return (
    <CartProvider>
      <div
        style={{
          ["--primary" as string]: settings.primaryColor,
          ["--secondary" as string]: settings.secondaryColor,
          ["--accent" as string]: settings.accentColor,
        }}
        className="min-h-screen"
      >
        <SiteHeader settings={themeSettings} />
        <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">{children}</main>
        <SiteFooter settings={themeSettings} />
        <CartDrawer whatsappNumber={whatsappNumber} />
      </div>
    </CartProvider>
  );
}
