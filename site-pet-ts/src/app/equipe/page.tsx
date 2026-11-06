import type { Metadata } from "next";
import Link from "next/link";
import { Cabecalho, Secao } from "@/components/Secao";
import { GRUPOS } from "@/lib/content";

export const metadata: Metadata = { title: "Equipe" };

export default function Equipe() {
  return (
    <Secao className="py-16">
      <Cabecalho
        eyebrow="Equipe"
        titulo="Tutores dos grupos"
        texto="Os dois tutores que orientam cada grupo tutorial. Os integrantes de cada grupo aparecem na página do grupo."
      />
      <ul className="mt-14 grid gap-6 md:grid-cols-2">
        {GRUPOS.map((g) => (
          <li key={g.numero} className="rounded-2xl border border-borda bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-lg bg-azul px-3 py-1 text-sm font-bold text-white">GT {g.numero}</span>
              <Link href={`/grupos/${g.numero}`} className="text-sm font-semibold text-azul-2 hover:underline">
                Ver grupo →
              </Link>
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-laranja">Tutor(a) 1</dt>
                <dd className="mt-1 font-medium text-texto">{g.tutor}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-laranja">Tutor(a) 2</dt>
                <dd className="mt-1 font-medium text-texto">{g.tutor2}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </Secao>
  );
}
