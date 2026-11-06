import type { Metadata } from "next";
import Link from "next/link";
import { Cabecalho, Secao } from "@/components/Secao";
import { EIXOS } from "@/lib/content";

export const metadata: Metadata = { title: "Eixos temáticos" };

export default function Eixos() {
  return (
    <Secao className="py-16">
      <Cabecalho eyebrow="Eixos temáticos" titulo="Como o trabalho está organizado" texto="Cada eixo reúne grupos tutoriais com objetivos próximos." />
      <div className="mt-14 space-y-8">
        {EIXOS.map((eixo) => (
          <article key={eixo.numero} className="grid gap-8 rounded-3xl border border-borda bg-white p-8 shadow-sm md:grid-cols-[1fr_1.2fr] md:p-10">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-laranja text-lg font-bold text-white">{eixo.numero}</span>
              <h2 className="mt-6 text-2xl font-bold leading-snug text-azul">{eixo.titulo}</h2>
              <p className="mt-4 leading-relaxed text-texto-suave">{eixo.resumo}</p>
            </div>
            <div className="flex flex-col justify-between gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-azul-2">Ações</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {eixo.acoes.map((acao) => (
                    <li key={acao} className="flex gap-3 rounded-xl bg-azul-claro/60 p-4 text-sm font-medium text-azul">
                      <span aria-hidden="true" className="text-laranja">●</span>
                      {acao}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-azul-2">Grupos</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {eixo.grupos.map((n) => (
                    <Link key={n} href={`/grupos/${n}`} className="rounded-full border border-azul/20 px-4 py-1.5 text-sm font-semibold text-azul transition hover:bg-azul hover:text-white">
                      GT {n}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Secao>
  );
}
