import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!product) {
    return NextResponse.json({ message: "Producto no encontrado" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const payload = await request.json();
  const parsed = productSchema.safeParse({
    ...payload,
    slug: slugify(payload.slug || payload.name || ""),
    price: Number(payload.price),
    categoryId: Number(payload.categoryId),
  });

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  const { imageUrls = [], ...productData } = parsed.data;

  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      ...productData,
      images: {
        deleteMany: {},
        create: imageUrls.map((url, index) => ({ url, order: index })),
      },
    },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  await prisma.product.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
