// Uso: node --env-file=.env.local scripts/criar-usuario.mjs email@exemplo.com "Nome" senha [admin|editor] [grupo 1-10]
import { neon } from "@neondatabase/serverless";
import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const [email, nome, senha, papel = "editor", grupoArg] = process.argv.slice(2);
const grupo = grupoArg ? Number(grupoArg) : null;
if (
  !email ||
  !nome ||
  !senha ||
  senha.length < 8 ||
  !["admin", "editor"].includes(papel) ||
  (grupo !== null && !(Number.isInteger(grupo) && grupo >= 1 && grupo <= 10))
) {
  console.error('Uso: node --env-file=.env.local scripts/criar-usuario.mjs email "Nome" senha [admin|editor] [grupo 1-10] (senha com minimo 8 caracteres)');
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

// Sem o grupo na linha de comando, o grupo que a pessoa já tinha é mantido.
await sql`insert into usuarios (email, nome, senha_hash, papel, grupo) values (${email.trim().toLowerCase()}, ${nome}, ${`${salt}:${hash.toString("hex")}`}, ${papel}, ${grupo})
  on conflict (email) do update set nome = excluded.nome, senha_hash = excluded.senha_hash, papel = excluded.papel,
    grupo = coalesce(excluded.grupo, usuarios.grupo)`;
console.log(`Usuário salvo: ${email} (${papel}${grupo ? `, GT ${grupo}` : ""})`);
