import Link from "next/link";
import type { Atividade } from "@/lib/store";
import { formatarData } from "@/lib/format";

export default function AtividadeCard({ atividade }: { atividade: Atividade }) {
  return (
    <Link
      href={`/atividades/${atividade.id}`}
      className="group flex h-full flex-col rounded-2xl border border-borda bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-azul-2/30 hover:shadow-xl"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <span className="rounded-full bg-azul-claro px-3 py-1 text-azul-2">{atividade.categoria}</span>
        {atividade.grupo && <span className="text-texto-suave">GT {atividade.grupo}</span>}
      </div>
      <h3 className="mt-4 text-xl font-semibold leading-snug text-azul group-hover:text-azul-2">{atividade.titulo}</h3>
      <p className="mt-3 flex-1 leading-relaxed text-texto-suave">{atividade.resumo}</p>
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-texto-suave">{formatarData(atividade.dataEvento ?? atividade.criadoEm)}</span>
        <span className="font-semibold text-laranja transition group-hover:translate-x-1">Ler mais →</span>
      </div>
    </Link>
  );
}
