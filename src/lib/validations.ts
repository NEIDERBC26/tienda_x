import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug es obligatorio"),
  description: z.string().optional().nullable(),
});

export const productSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug es obligatorio"),
  price: z.number().positive("El precio debe ser mayor que 0"),
  description: z.string().min(10, "La descripción es muy corta"),
  features: z.array(z.string().min(2)).min(1, "Incluye al menos una característica"),
  categoryId: z.number().int().positive(),
  isPublished: z.boolean().default(true),
  imageUrls: z.array(z.string()).optional(),
});

export const storeSettingsSchema = z.object({
  storeName: z.string().min(2),
  logoUrl: z.string().nullable().optional(),
  primaryColor: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Color primario inválido"),
  secondaryColor: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Color secundario inválido"),
  accentColor: z.string().regex(/^#([0-9A-Fa-f]{6})$/, "Color acento inválido"),
  whatsappNumber: z.string().nullable().optional(),
  instagramUrl: z.string().url().nullable().optional().or(z.literal("")),
  facebookUrl: z.string().url().nullable().optional().or(z.literal("")),
  tiktokUrl: z.string().url().nullable().optional().or(z.literal("")),
  heroTitle: z.string().min(5),
  heroSubtitle: z.string().min(10),
});
