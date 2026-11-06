"use server";

import { revalidatePath } from "next/cache";
import { exigirAdmin } from "@/lib/auth";
import { getGrupo } from "@/lib/content";
import { adicionarIntegrantes, atualizarLattesIntegrante, excluirIntegrante, salvarGrupoInfo } from "@/lib/store";

function texto(valor: FormDataEntryValue | null, limite: number) {
  return typeof valor === "string" ? valor.trim().slice(0, limite) : "";
}

function numeroGrupo(formData: FormData) {
  const numero = Number(formData.get("grupo"));
  if (!getGrupo(numero)) throw new Error("Grupo inválido.");
  return numero;
}

// Aceita o link do Lattes ou só o número de 16 dígitos. Retorna null se vazio.
function normalizarLattes(bruto: string) {
  if (!bruto) return null;
  if (/^\d{16}$/.test(bruto)) return `https://lattes.cnpq.br/${bruto}`;
  let url: URL;
  try {
    url = new URL(bruto);
  } catch {
    throw new Error("O link do Lattes é inválido. Cole o endereço completo ou só o número de 16 dígitos.");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("O link do Lattes é inválido.");
  if (!url.hostname.endsWith("cnpq.br")) throw new Error("Use um link do Lattes (lattes.cnpq.br).");
  return url.toString();
}

function lattes(valor: FormDataEntryValue | null) {
  return normalizarLattes(texto(valor, 200));
}

function atualizar(numero: number) {
  revalidatePath("/grupos", "layout");
  revalidatePath(`/painel/grupos/${numero}`);
}

export async function salvarInfoGrupo(formData: FormData) {
  await exigirAdmin();
  const grupo = numeroGrupo(formData);
  await salvarGrupoInfo({
    grupo,
    endereco: texto(formData.get("endereco"), 200) || null,
    tutorLattes: lattes(formData.get("tutorLattes")),
    tutor2Lattes: lattes(formData.get("tutor2Lattes")),
  });
  atualizar(grupo);
}

export async function adicionarIntegrantesGrupo(formData: FormData) {
  await exigirAdmin();
  const grupo = numeroGrupo(formData);
  // Um integrante por linha. Lattes opcional depois de "|": Nome | https://lattes.cnpq.br/...
  const pessoas = texto(formData.get("nomes"), 8000)
    .split(/\n+/)
    .map((linha) => {
      const [nome, link = ""] = linha.split("|");
      return { nome: nome.trim().slice(0, 120), lattes: normalizarLattes(link.trim().slice(0, 200)) };
    })
    .filter((p) => p.nome);
  if (pessoas.length === 0) throw new Error("Escreva pelo menos um nome.");
  await adicionarIntegrantes(grupo, pessoas);
  atualizar(grupo);
}

export async function salvarLattesIntegrante(formData: FormData) {
  await exigirAdmin();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) throw new Error("Integrante inválido.");
  await atualizarLattesIntegrante(id, lattes(formData.get("lattes")));
  revalidatePath("/grupos", "layout");
  revalidatePath("/painel/grupos", "layout");
}

export async function removerIntegrante(id: string) {
  await exigirAdmin();
  const numero = Number(id);
  if (!Number.isInteger(numero)) throw new Error("Integrante inválido.");
  await excluirIntegrante(numero);
  revalidatePath("/grupos", "layout");
  revalidatePath("/painel/grupos", "layout");
}
