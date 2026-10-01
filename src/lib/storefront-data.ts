import { prisma } from "@/lib/prisma";

export async function getStorefrontCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export async function getStorefrontProducts({
  search,
  category,
}: {
  search?: string;
  category?: string;
}) {
  return prisma.product.findMany({
    where: {
      isPublished: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(category ? { category: { slug: category } } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });
}

export async function getPublishedProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isPublished: true },
    include: {
      category: true,
      images: { orderBy: { order: "asc" } },
    },
  });
}
