import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";

export async function requireAdmin() {
  const ok = await verifyAdminSession();
  if (!ok) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }
  return null;
}
