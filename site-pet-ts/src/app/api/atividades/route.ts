import { randomUUID } from "crypto";
import { CATEGORIAS, GRUPOS } from "@/lib/content";
import { usuarioAtual } from "@/lib/auth";
import { podePublicarEm } from "@/lib/permissoes";
import { type Atividade, salvarArquivosAtividade, salvarAtividade } from "@/lib/store";

const LIMITES = { titulo: 140, resumo: 300, descricao: 4000, contato: 120 };

// Só aceitamos arquivos que o próprio site enviou ao Vercel Blob.
const URL_BLOB = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//;
const MAX_ARQUIVOS = 10;

type ArquivoEnviado = { url: string; pathname: string; nomeArquivo: string };

// Devolve null se algum item for inválido.
function lerArquivos(valor: unknown): ArquivoEnviado[] | null {
  if (valor === undefined || valor === null) return [];
  if (!Array.isArray(valor) || valor.length > MAX_ARQUIVOS) return null;
  const lista: ArquivoEnviado[] = [];
  for (const item of valor) {
    if (typeof item !== "object" || item === null) return null;
    const { url, pathname, nomeArquivo } = item as Record<string, unknown>;
    if (typeof url !== "string" || !URL_BLOB.test(url) || url.length > 500) return null;
    if (typeof pathname !== "string" || !pathname || pathname.length > 300) return null;
    const nome = typeof nomeArquivo === "string" ? nomeArquivo.trim().slice(0, 200) : "";
    lista.push({ url, pathname, nomeArquivo: nome || pathname });
  }
  return lista;
}

function texto(valor: unknown, campo: keyof typeof LIMITES) {
  return typeof valor === "string" ? valor.trim().slice(0, LIMITES[campo]) : "";
}

export async function POST(request: Request) {
  const usuario = await usuarioAtual();
  if (!usuario) {
    return Response.json({ erro: "Faça login para enviar uma atividade." }, { status: 401 });
  }

  let corpo: Record<string, unknown>;
  try {
    corpo = await request.json();
  } catch {
    return Response.json({ erro: "Envio inválido." }, { status: 400 });
  }

  const grupo = corpo.grupo === "" || corpo.grupo == null ? null : Number(corpo.grupo);
  const categoria = typeof corpo.categoria === "string" ? corpo.categoria : "";
  const dataEvento = typeof corpo.dataEvento === "string" && corpo.dataEvento ? corpo.dataEvento : null;

  const atividade: Atividade = {
    id: randomUUID(),
    status: "pendente",
    grupo,
    titulo: texto(corpo.titulo, "titulo"),
    categoria,
    dataEvento,
    resumo: texto(corpo.resumo, "resumo"),
    descricao: texto(corpo.descricao, "descricao"),
    contato: texto(corpo.contato, "contato") || undefined,
    criadoEm: new Date().toISOString(),
  };

  const arquivos = lerArquivos(corpo.arquivos);

  const erros: string[] = [];
  if (arquivos === null) erros.push("Arquivos inválidos (máximo de 10).");
  if (!atividade.titulo) erros.push("Informe o título.");
  if (!atividade.resumo) erros.push("Escreva um resumo curto.");
  if (!CATEGORIAS.includes(categoria)) erros.push("Escolha uma categoria válida.");
  if (grupo !== null && !GRUPOS.some((g) => g.numero === grupo)) erros.push("Grupo inválido.");
  if (dataEvento && Number.isNaN(Date.parse(dataEvento))) erros.push("Data inválida.");

  if (erros.length > 0) {
    return Response.json({ erro: erros.join(" ") }, { status: 400 });
  }

  if (!podePublicarEm(usuario, grupo)) {
    return Response.json({ erro: "Você só pode enviar para o seu grupo ou para o canal geral." }, { status: 403 });
  }

  // Administradores e envios para o próprio grupo publicam direto; o canal geral passa por aprovação.
  atividade.status = usuario.papel === "admin" || grupo !== null ? "aprovado" : "pendente";

  await salvarAtividade(atividade);
  if (arquivos && arquivos.length > 0) await salvarArquivosAtividade(atividade.id, arquivos);
  return Response.json({ ok: true, status: atividade.status }, { status: 201 });
}
