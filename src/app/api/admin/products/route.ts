import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
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

  const { imageUrls = [], ...productData } = parsed.data;

  const product = await prisma.product.create({
    data: {
      ...productData,
      price: productData.price,
      images: {
        create: imageUrls.map((url, index) => ({ url, order: index })),
      },
    },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });

  return NextResponse.json(product, { status: 201 });
}
