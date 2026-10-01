import { NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { createAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const env = getEnv();
  const body = await request.json();
  const user = String(body.user ?? "");
  const password = String(body.password ?? "");

  if (user !== env.ADMIN_USER || password !== env.ADMIN_PASSWORD) {
    return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
