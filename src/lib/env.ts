import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ADMIN_USER: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  ADMIN_SECRET: z.string().min(16),
  NEXT_PUBLIC_BASE_URL: z.string().optional(),
  DEFAULT_WHATSAPP_NUMBER: z.string().default("573001112233"),
});

let parsedEnv: z.infer<typeof envSchema> | null = null;

export function getEnv() {
  if (!parsedEnv) {
    parsedEnv = envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      ADMIN_USER: process.env.ADMIN_USER ?? "admin",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "admin123",
      ADMIN_SECRET: process.env.ADMIN_SECRET ?? "cambia-este-secreto-en-produccion",
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      DEFAULT_WHATSAPP_NUMBER: process.env.DEFAULT_WHATSAPP_NUMBER,
    });
  }

  return parsedEnv;
}
