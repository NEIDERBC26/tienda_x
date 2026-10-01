import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const payload = await request.json();
  const parsed = categorySchema.safeParse({
    ...payload,
    slug: slugify(payload.slug || payload.name || ""),
  });

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: parsed.data,
  });

  return NextResponse.json(category, { status: 201 });
}
