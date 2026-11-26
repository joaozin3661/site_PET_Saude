import type { Metadata } from "next";
import Link from "next/link";
import AtividadeCard from "@/components/AtividadeCard";
import { Cabecalho, Secao } from "@/components/Secao";
import { GRUPOS } from "@/lib/content";
import { listarAprovadas } from "@/lib/store";

// Atividades são lidas a cada requisição; o build não deve congelar essa lista.
export const instant = false;

export const metadata: Metadata = { title: "Atividades" };

const POR_BLOCO = 3;

export default async function Atividades() {
  // Já vêm da mais nova para a mais antiga.
  const todas = await listarAprovadas("todos");

  const geral = todas.filter((a) => a.grupo === null);
  const porGrupo = GRUPOS.map((g) => ({ grupo: g, atividades: todas.filter((a) => a.grupo === g.numero) }));
  const comAtividades = porGrupo.filter((b) => b.atividades.length > 0);

  return (
    <Secao className="py-16">
      <Cabecalho eyebrow="Registros" titulo="O que estamos realizando" texto="As três atividades mais recentes do canal geral e de cada grupo tutorial." />

      <section className="mt-14" aria-labelledby="canal-geral">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="canal-geral" className="text-2xl font-bold text-azul">Canal geral</h2>
          {geral.length > POR_BLOCO && (
            <Link href="/atividades/geral" className="font-semibold text-azul-2 underline underline-offset-4">
              Ver todas ({geral.length}) →
            </Link>
          )}
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {geral.length > 0 ? (
            geral.slice(0, POR_BLOCO).map((a) => <AtividadeCard key={a.id} atividade={a} />)
          ) : (
            <p className="text-texto-suave md:col-span-2 lg:col-span-3">Nenhuma atividade publicada no canal geral ainda.</p>
          )}
        </div>
      </section>

      {comAtividades.map(({ grupo, atividades }) => (
        <section key={grupo.numero} className="mt-16" aria-labelledby={`gt-${grupo.numero}`}>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id={`gt-${grupo.numero}`} className="text-2xl font-bold text-azul">
              GT {grupo.numero} <span className="text-lg font-medium text-texto-suave">· {grupo.unidade}</span>
            </h2>
            <Link href={`/grupos/${grupo.numero}`} className="font-semibold text-azul-2 underline underline-offset-4">
              {atividades.length > POR_BLOCO ? `Ver todas (${atividades.length}) e o grupo →` : "Ver o grupo →"}
            </Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {atividades.slice(0, POR_BLOCO).map((a) => (
              <AtividadeCard key={a.id} atividade={a} />
            ))}
          </div>
        </section>
      ))}

    </Secao>
  );
}
