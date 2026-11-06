"use server";

import { randomUUID } from "crypto";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirUsuario } from "@/lib/auth";
import {
  atualizarNoticia,
  buscarNoticia,
  excluirNoticia,
  salvarNoticiaNova,
} from "@/lib/store";

const URL_BLOB = /https:\/\/[^\s)"']+\.public\.blob\.vercel-storage\.com\/[^\s)"']+/g;

function texto(valor: FormDataEntryValue | null, limite: number) {
  return typeof valor === "string" ? valor.trim().slice(0, limite) : "";
}

function campos(formData: FormData) {
  const titulo = texto(formData.get("titulo"), 160);
  if (!titulo) throw new Error("Escreva um título para a notícia.");
  const capaUrl = texto(formData.get("capaUrl"), 500) || null;
  return {
    titulo,
    resumo: texto(formData.get("resumo"), 300),
    corpo: texto(formData.get("corpo"), 30000),
    capaUrl,
    capaPathname: texto(formData.get("capaPathname"), 300) || null,
  };
}

export async function salvarNoticia(formData: FormData) {
  const usuario = await exigirUsuario();
  const dados = campos(formData);
  const id = texto(formData.get("id"), 64);

  if (!id) {
    await salvarNoticiaNova({ id: randomUUID(), autorId: usuario.id, autorNome: usuario.nome, ...dados });
  } else {
    const anterior = await buscarNoticia(id);
    if (!anterior || anterior.autorId !== usuario.id) throw new Error("Você só pode editar as suas notícias.");

    const ok = await atualizarNoticia(id, usuario.id, dados);
    if (!ok) throw new Error("Não foi possível salvar a notícia.");

    // Apaga a capa antiga quando ela foi trocada.
    if (anterior.capaUrl && anterior.capaUrl !== dados.capaUrl) await del(anterior.capaUrl);
  }

  revalidatePath("/noticias", "layout");
  redirect("/painel/noticias");
}

export async function removerNoticia(id: string) {
  const usuario = await exigirUsuario();
  const noticia = await buscarNoticia(id);
  const admin = usuario.papel === "admin";
  if (!noticia || (!admin && noticia.autorId !== usuario.id)) throw new Error("Você só pode apagar as suas notícias.");

  const capa = await excluirNoticia(id, admin ? null : usuario.id);
  // Apaga também as imagens usadas no texto, para não deixar arquivos órfãos.
  const imagens = noticia.corpo.match(URL_BLOB) ?? [];
  const arquivos = [capa, ...imagens].filter((u): u is string => Boolean(u));
  if (arquivos.length > 0) await del(arquivos);

  revalidatePath("/noticias", "layout");
}
