"use server";

import { randomUUID } from "crypto";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { exigirAdmin, exigirUsuario } from "@/lib/auth";
import { escopoDeGestao, podePublicarEm } from "@/lib/permissoes";
import {
  definirStatusAtividade,
  excluirAtividade,
  excluirFoto,
  excluirMaterial,
  salvarFoto,
  salvarMaterial,
} from "@/lib/store";

function atualizarSite() {
  revalidatePath("/", "layout");
}

export async function aprovarAtividade(id: string) {
  await exigirAdmin();
  await definirStatusAtividade(id, "aprovado");
  atualizarSite();
}

export async function recusarAtividade(id: string) {
  await exigirAdmin();
  await definirStatusAtividade(id, "recusado");
  atualizarSite();
}

export async function removerAtividade(id: string) {
  const usuario = await exigirUsuario();
  const { ok, urls } = await excluirAtividade(id, escopoDeGestao(usuario));
  if (!ok) throw new Error("Você só pode excluir o que é do seu grupo.");
  if (urls.length > 0) await del(urls);
  atualizarSite();
}

function texto(valor: FormDataEntryValue | null, limite: number) {
  return typeof valor === "string" ? valor.trim().slice(0, limite) : "";
}

// Vazio = canal geral (null); 1 a 10 = grupo.
function lerGrupo(valor: FormDataEntryValue | null) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero >= 1 && numero <= 10 ? numero : null;
}

export async function cadastrarFoto(formData: FormData) {
  const usuario = await exigirUsuario();
  const url = texto(formData.get("url"), 500);
  const pathname = texto(formData.get("pathname"), 300);
  const titulo = texto(formData.get("titulo"), 140);
  if (!url || !pathname || !titulo) throw new Error("Informe o título e envie a foto.");

  const grupo = lerGrupo(formData.get("grupo"));
  if (!podePublicarEm(usuario, grupo)) throw new Error("Você só pode publicar no seu grupo ou no canal geral.");
  await salvarFoto({
    id: randomUUID(),
    titulo,
    descricao: texto(formData.get("descricao"), 600),
    grupo,
    url,
    pathname,
  });
  atualizarSite();
}

export async function removerFoto(id: string) {
  const usuario = await exigirUsuario();
  const url = await excluirFoto(id, escopoDeGestao(usuario));
  if (url === undefined) throw new Error("Você só pode excluir o que é do seu grupo.");
  await del(url);
  atualizarSite();
}

const TIPOS_MATERIAL = ["Relatório", "Apresentação", "Edital", "Manual", "Publicação", "Outro"];

export async function cadastrarMaterial(formData: FormData) {
  const usuario = await exigirUsuario();
  const url = texto(formData.get("url"), 500);
  const pathname = texto(formData.get("pathname"), 300);
  const nomeArquivo = texto(formData.get("nomeArquivo"), 200);
  const titulo = texto(formData.get("titulo"), 140);
  const tipo = texto(formData.get("tipo"), 40);
  if (!url || !pathname || !titulo) throw new Error("Informe o título e envie o arquivo.");
  if (!TIPOS_MATERIAL.includes(tipo)) throw new Error("Escolha um tipo válido.");

  const grupo = lerGrupo(formData.get("grupo"));
  if (!podePublicarEm(usuario, grupo)) throw new Error("Você só pode publicar no seu grupo ou no canal geral.");
  await salvarMaterial({
    id: randomUUID(),
    grupo,
    titulo,
    descricao: texto(formData.get("descricao"), 600),
    tipo,
    url,
    pathname,
    nomeArquivo: nomeArquivo || pathname,
  });
  atualizarSite();
}

export async function removerMaterial(id: string) {
  const usuario = await exigirUsuario();
  const url = await excluirMaterial(id, escopoDeGestao(usuario));
  if (url === undefined) throw new Error("Você só pode excluir o que é do seu grupo.");
  await del(url);
  atualizarSite();
}
