import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { getStoreSettings } from "@/lib/store-settings";
import { storeSettingsSchema } from "@/lib/validations";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const settings = await getStoreSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const payload = await request.json();
  const parsed = storeSettingsSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const normalized = {
    ...parsed.data,
    instagramUrl: parsed.data.instagramUrl || null,
    facebookUrl: parsed.data.facebookUrl || null,
    tiktokUrl: parsed.data.tiktokUrl || null,
    whatsappNumber: parsed.data.whatsappNumber || null,
  };

  const settings = await prisma.storeSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...normalized },
    update: normalized,
  });

  return NextResponse.json(settings);
}
