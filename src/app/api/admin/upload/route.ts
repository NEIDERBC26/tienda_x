import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/avif": ".avif",
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "No se pudo leer la carga. Intenta con imágenes más pequeñas." }, { status: 400 });
  }

  const files = formData.getAll("files");
  const mode = String(formData.get("mode") || "product");
  const productId = Number(formData.get("productId") || 0);

  if (!files.length) {
    return NextResponse.json({ message: "No se enviaron archivos" }, { status: 400 });
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json({ message: `Máximo ${MAX_FILES} archivos por carga` }, { status: 400 });
  }

  if (files.some((file) => typeof file === "string")) {
    return NextResponse.json({ message: "La carga contiene un archivo inválido" }, { status: 400 });
  }

  const imageFiles = files as File[];
  for (const file of imageFiles) {
    if (!IMAGE_EXTENSIONS[file.type]) {
      return NextResponse.json({ message: "Formato no permitido. Usa JPG, PNG, WEBP, GIF o AVIF." }, { status: 400 });
    }
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ message: "Cada imagen debe pesar menos de 5 MB y no estar vacía." }, { status: 400 });
    }
  }

  const folder = mode === "logo" ? "logos" : "products";
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  const urls: string[] = [];

  try {
    await mkdir(uploadDir, { recursive: true });

    for (const file of imageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${randomUUID()}${IMAGE_EXTENSIONS[file.type]}`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      urls.push(`/uploads/${folder}/${filename}`);
    }

    if (mode !== "logo" && productId > 0) {
      const count = await prisma.productImage.count({ where: { productId } });
      await prisma.productImage.createMany({
        data: urls.map((url, index) => ({
          url,
          productId,
          order: count + index,
        })),
      });
    }
  } catch (error) {
    console.error("Error al guardar imágenes:", error);
    return NextResponse.json({ message: "No se pudieron guardar las imágenes. Verifica el almacenamiento e inténtalo de nuevo." }, { status: 500 });
  }

  return NextResponse.json({ urls });
}
