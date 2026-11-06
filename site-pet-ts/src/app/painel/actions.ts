"use server";

import { randomUUID } from "crypto";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { exigirAdmin, exigirUsuario } from "@/lib/auth";
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
  await exigirAdmin();
  await excluirAtividade(id);
  atualizarSite();
}

function texto(valor: FormDataEntryValue | null, limite: number) {
  return typeof valor === "string" ? valor.trim().slice(0, limite) : "";
}

export async function cadastrarFoto(formData: FormData) {
  await exigirUsuario();
  const url = texto(formData.get("url"), 500);
  const pathname = texto(formData.get("pathname"), 300);
  const titulo = texto(formData.get("titulo"), 140);
  if (!url || !pathname || !titulo) throw new Error("Informe o título e envie a foto.");

  const grupo = Number(formData.get("grupo"));
  await salvarFoto({
    id: randomUUID(),
    titulo,
    descricao: texto(formData.get("descricao"), 600),
    grupo: Number.isInteger(grupo) && grupo >= 1 && grupo <= 10 ? grupo : null,
    url,
    pathname,
  });
  atualizarSite();
}

export async function removerFoto(id: string) {
  await exigirAdmin();
  const url = await excluirFoto(id);
  if (url) await del(url);
  atualizarSite();
}

const TIPOS_MATERIAL = ["Relatório", "Apresentação", "Edital", "Manual", "Publicação", "Outro"];

export async function cadastrarMaterial(formData: FormData) {
  await exigirUsuario();
  const url = texto(formData.get("url"), 500);
  const pathname = texto(formData.get("pathname"), 300);
  const nomeArquivo = texto(formData.get("nomeArquivo"), 200);
  const titulo = texto(formData.get("titulo"), 140);
  const tipo = texto(formData.get("tipo"), 40);
  if (!url || !pathname || !titulo) throw new Error("Informe o título e envie o arquivo.");
  if (!TIPOS_MATERIAL.includes(tipo)) throw new Error("Escolha um tipo válido.");

  const grupo = Number(formData.get("grupo"));
  await salvarMaterial({
    id: randomUUID(),
    grupo: Number.isInteger(grupo) && grupo >= 1 && grupo <= 10 ? grupo : null,
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
  await exigirAdmin();
  const url = await excluirMaterial(id);
  if (url) await del(url);
  atualizarSite();
}
