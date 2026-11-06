import { randomUUID } from "crypto";
import { CATEGORIAS, GRUPOS } from "@/lib/content";
import { usuarioAtual } from "@/lib/auth";
import { type Atividade, salvarAtividade } from "@/lib/store";

const LIMITES = { titulo: 140, resumo: 300, descricao: 4000, contato: 120 };

function texto(valor: unknown, campo: keyof typeof LIMITES) {
  return typeof valor === "string" ? valor.trim().slice(0, LIMITES[campo]) : "";
}

export async function POST(request: Request) {
  if (!(await usuarioAtual())) {
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

  const erros: string[] = [];
  if (!atividade.titulo) erros.push("Informe o título.");
  if (!atividade.resumo) erros.push("Escreva um resumo curto.");
  if (!CATEGORIAS.includes(categoria)) erros.push("Escolha uma categoria válida.");
  if (grupo !== null && !GRUPOS.some((g) => g.numero === grupo)) erros.push("Grupo inválido.");
  if (dataEvento && Number.isNaN(Date.parse(dataEvento))) erros.push("Data inválida.");

  if (erros.length > 0) {
    return Response.json({ erro: erros.join(" ") }, { status: 400 });
  }

  await salvarAtividade(atividade);
  return Response.json({ ok: true }, { status: 201 });
}
