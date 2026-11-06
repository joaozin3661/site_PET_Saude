// Uso: node --env-file=.env.local scripts/criar-usuario.mjs email@exemplo.com "Nome" senha [admin|editor]
import { neon } from "@neondatabase/serverless";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const [email, nome, senha, papel = "editor"] = process.argv.slice(2);
if (!email || !nome || !senha || senha.length < 8 || !["admin", "editor"].includes(papel)) {
  console.error('Uso: node --env-file=.env.local scripts/criar-usuario.mjs email "Nome" senha (mínimo 8 caracteres)');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL não encontrada. Crie o arquivo .env.local.");
  process.exit(1);
}

const scryptAsync = promisify(scrypt);
const salt = randomBytes(16).toString("hex");
const hash = await scryptAsync(senha, salt, 64);
const sql = neon(process.env.DATABASE_URL);

await sql`insert into usuarios (email, nome, senha_hash, papel) values (${email.trim().toLowerCase()}, ${nome}, ${`${salt}:${hash.toString("hex")}`}, ${papel})
  on conflict (email) do update set nome = excluded.nome, senha_hash = excluded.senha_hash, papel = excluded.papel`;
console.log(`Usuário salvo: ${email} (${papel})`);
