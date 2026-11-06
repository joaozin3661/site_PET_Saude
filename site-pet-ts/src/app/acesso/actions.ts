"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESSAO, criarToken, verificarSenha } from "@/lib/auth";
import { db } from "@/lib/db";

export type EstadoLogin = { erro?: string };

export async function entrar(_estado: EstadoLogin, formData: FormData): Promise<EstadoLogin> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const senha = String(formData.get("senha") ?? "");

  const sql = db();
  const rows = await sql`select id, senha_hash from usuarios where email = ${email}`;
  const usuario = rows[0] as { id: number; senha_hash: string } | undefined;

  if (!usuario || !(await verificarSenha(senha, usuario.senha_hash))) {
    return { erro: "E-mail ou senha incorretos." };
  }

  (await cookies()).set(COOKIE_SESSAO, criarToken(usuario.id), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  redirect("/painel");
}

export async function sair() {
  (await cookies()).delete(COOKIE_SESSAO);
  redirect("/acesso");
}
