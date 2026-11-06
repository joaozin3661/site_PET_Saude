import type { Metadata } from "next";
import Link from "next/link";
import { Cabecalho, Secao } from "@/components/Secao";
import { GRUPOS } from "@/lib/content";

export const metadata: Metadata = { title: "Grupos tutoriais" };

export default function Grupos() {
  return (
    <Secao className="py-16">
      <Cabecalho eyebrow="Unidades e equipes" titulo="Grupos tutoriais" texto="Dez grupos atuam em unidades da rede SUS de Teresina, cada um com um foco de trabalho." />
      <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GRUPOS.map((g) => (
          <li key={g.numero}>
            <Link href={`/grupos/${g.numero}`} className="group flex h-full flex-col rounded-2xl border border-borda bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <span className="inline-flex w-fit rounded-lg bg-azul px-3 py-1 text-sm font-bold text-white">GT {g.numero}</span>
              <h2 className="mt-4 text-lg font-semibold leading-snug text-azul group-hover:text-azul-2">{g.titulo}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-texto-suave">{g.unidade}</p>
              <span className="mt-5 text-sm font-semibold text-laranja transition group-hover:translate-x-1">Conhecer o grupo →</span>
            </Link>
          </li>
        ))}
      </ul>
    </Secao>
  );
}
