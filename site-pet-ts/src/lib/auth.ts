import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { promisify } from "util";
import { db } from "./db";

const scrypt = promisify(scryptCb);
export const COOKIE_SESSAO = "pet_sessao";
const DURACAO_MS = 7 * 24 * 60 * 60 * 1000;

export async function hashSenha(senha: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scrypt(senha, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

export async function verificarSenha(senha: string, armazenado: string) {
  const [salt, hex] = armazenado.split(":");
  if (!salt || !hex) return false;
  const esperado = Buffer.from(hex, "hex");
  const atual = (await scrypt(senha, salt, esperado.length)) as Buffer;
  return timingSafeEqual(atual, esperado);
}

function assinar(payload: string) {
  const segredo = process.env.SESSION_SECRET;
  if (!segredo || segredo.length < 32) {
    throw new Error("SESSION_SECRET precisa ter pelo menos 32 caracteres.");
  }
  return createHmac("sha256", segredo).update(payload).digest("base64url");
}

export function criarToken(usuarioId: number) {
  const payload = `${usuarioId}.${Date.now() + DURACAO_MS}`;
  return `${payload}.${assinar(payload)}`;
}

export function lerToken(token: string): number | null {
  const partes = token.split(".");
  if (partes.length !== 3) return null;
  const [id, exp, assinatura] = partes;
  const payload = `${id}.${exp}`;
  const esperada = assinar(payload);
  if (assinatura.length !== esperada.length) return null;
  if (!timingSafeEqual(Buffer.from(assinatura), Buffer.from(esperada))) return null;
  if (Number(exp) < Date.now()) return null;
  return Number(id);
}

export type Papel = "admin" | "editor";
export type Usuario = { id: number; nome: string; email: string; papel: Papel };

export async function usuarioAtual() {
  const token = (await cookies()).get(COOKIE_SESSAO)?.value;
  if (!token) return null;
  const id = lerToken(token);
  if (id === null) return null;
  const sql = db();
  const rows = await sql`select id, nome, email, papel from usuarios where id = ${id}`;
  return (rows[0] as Usuario | undefined) ?? null;
}

export async function exigirUsuario() {
  const usuario = await usuarioAtual();
  if (!usuario) redirect("/acesso");
  return usuario;
}

// Aprovar, recusar e excluir são só para administradores.
export async function exigirAdmin() {
  const usuario = await exigirUsuario();
  if (usuario.papel !== "admin") throw new Error("Apenas administradores podem fazer isso.");
  return usuario;
}
