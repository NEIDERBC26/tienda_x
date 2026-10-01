import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id: Number(id) } });
  if (!category) {
    return NextResponse.json({ message: "Categoría no encontrada" }, { status: 404 });
  }

  return NextResponse.json(category);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const { id } = await params;
  const category = await prisma.category.update({
    where: { id: Number(id) },
    data: parsed.data,
  });

  return NextResponse.json(category);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const products = await prisma.product.count({ where: { categoryId: Number(id) } });
  if (products > 0) {
    return NextResponse.json(
      { message: "No puedes eliminar una categoría que tiene productos" },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}
