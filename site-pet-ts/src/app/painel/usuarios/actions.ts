"use server";

import { revalidatePath } from "next/cache";
import { exigirAdmin, hashSenha } from "@/lib/auth";
import { getGrupo } from "@/lib/content";
import { atualizarUsuario, criarUsuario } from "@/lib/store";

function texto(valor: FormDataEntryValue | null, limite: number) {
  return typeof valor === "string" ? valor.trim().slice(0, limite) : "";
}

function lerPapel(valor: FormDataEntryValue | null) {
  if (valor !== "admin" && valor !== "editor") throw new Error("Papel inválido.");
  return valor;
}

// Vazio = sem grupo. Administradores não precisam de grupo.
function lerGrupo(valor: FormDataEntryValue | null) {
  const bruto = texto(valor, 4);
  if (!bruto) return null;
  const numero = Number(bruto);
  if (!getGrupo(numero)) throw new Error("Grupo inválido.");
  return numero;
}

export async function salvarUsuario(formData: FormData) {
  const admin = await exigirAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Usuário inválido.");
  const papel = lerPapel(formData.get("papel"));
  if (id === admin.id && papel !== "admin") {
    throw new Error("Você não pode tirar o seu próprio acesso de administrador.");
  }
  await atualizarUsuario(id, papel, lerGrupo(formData.get("grupo")));
  revalidatePath("/painel", "layout");
}

export async function cadastrarUsuario(formData: FormData) {
  await exigirAdmin();
  const email = texto(formData.get("email"), 200).toLowerCase();
  const nome = texto(formData.get("nome"), 120);
  const senha = typeof formData.get("senha") === "string" ? (formData.get("senha") as string) : "";
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Informe um e-mail válido.");
  if (!nome) throw new Error("Informe o nome.");
  if (senha.length < 8) throw new Error("A senha precisa ter pelo menos 8 caracteres.");

  const criado = await criarUsuario({
    email,
    nome,
    senhaHash: await hashSenha(senha),
    papel: lerPapel(formData.get("papel")),
    grupo: lerGrupo(formData.get("grupo")),
  });
  if (!criado) throw new Error("Já existe um usuário com esse e-mail.");
  revalidatePath("/painel/usuarios");
}
