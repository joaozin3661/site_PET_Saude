import { neon } from "@neondatabase/serverless";

// Conexão com o Postgres do Neon (DATABASE_URL vem das variáveis do Vercel ou do .env.local).
export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não está definida. Veja a seção de configuração no README.");
  }
  return neon(url);
}
