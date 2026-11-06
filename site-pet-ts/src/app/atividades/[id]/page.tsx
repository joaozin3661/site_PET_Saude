import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Secao } from "@/components/Secao";
import { formatarData } from "@/lib/format";
import { buscarAtividade } from "@/lib/store";
import { getGrupo } from "@/lib/content";

// Atividades são lidas a cada requisição; o build não deve congelar essa lista.
export const instant = false;


type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const atividade = await buscarAtividade((await params).id);
  return { title: atividade?.titulo ?? "Atividade não encontrada" };
}

export default async function AtividadeDetalhe({ params }: Props) {
  const atividade = await buscarAtividade((await params).id);
  if (!atividade) notFound();

  const grupo = atividade.grupo ? getGrupo(atividade.grupo) : undefined;

  return (
    <Secao className="py-16">
      <Link href="/atividades" className="text-sm font-medium text-azul-2 hover:underline">← Todas as atividades</Link>
      <article className="mx-auto mt-8 max-w-3xl">
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider">
          <span className="rounded-full bg-azul-claro px-3 py-1 text-azul-2">{atividade.categoria}</span>
          {grupo && (
            <Link href={`/grupos/${grupo.numero}`} className="rounded-full bg-azul px-3 py-1 text-white">GT {grupo.numero}</Link>
          )}
        </div>
        <h1 className="mt-6 text-3xl font-bold leading-tight text-azul sm:text-4xl">{atividade.titulo}</h1>
        <p className="mt-4 text-sm text-texto-suave">
          {atividade.dataEvento ? `Data do evento: ${formatarData(atividade.dataEvento)}` : `Publicado em ${formatarData(atividade.criadoEm)}`}
        </p>
        <p className="mt-8 text-lg leading-relaxed text-texto">{atividade.resumo}</p>
        <div className="mt-6 whitespace-pre-line leading-relaxed text-texto-suave">{atividade.descricao}</div>
      </article>
    </Secao>
  );
}
