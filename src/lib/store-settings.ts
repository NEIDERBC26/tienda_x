import { prisma } from "@/lib/prisma";
import { getEnv } from "@/lib/env";

export async function getStoreSettings() {
  const env = getEnv();
  const settings = await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "Tienda X",
      primaryColor: "#A3E635",
      secondaryColor: "#38BDF8",
      accentColor: "#F97316",
      whatsappNumber: env.DEFAULT_WHATSAPP_NUMBER,
      heroTitle: "Tenis con identidad propia",
      heroSubtitle:
        "Catálogo premium con selección curada para running, lifestyle y cancha.",
    },
  });

  return settings;
}

export function resolveWhatsappNumber(settingsNumber?: string | null) {
  const env = getEnv();
  const raw = settingsNumber || env.DEFAULT_WHATSAPP_NUMBER;
  return raw.replace(/\D/g, "");
}
