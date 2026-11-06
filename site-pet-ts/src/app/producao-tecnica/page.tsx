import type { Metadata } from "next";
import { Cabecalho, Secao } from "@/components/Secao";
import { listarMateriais } from "@/lib/store";

export const metadata: Metadata = { title: "Produção técnica" };
export const instant = false;

export default async function ProducaoTecnica() {
  const materiais = await listarMateriais("geral");
  const tipos = [...new Set(materiais.map((m) => m.tipo))];

  return (
    <Secao className="py-16">
      <Cabecalho eyebrow="Materiais" titulo="Produção técnica" texto="Relatórios, apresentações, editais e manuais produzidos pelo projeto." />
      {materiais.length === 0 ? (
        <p className="mt-14 text-texto-suave">Nenhum material publicado ainda.</p>
      ) : (
        tipos.map((tipo) => (
          <div key={tipo} className="mt-14">
            <h2 className="text-xl font-bold text-azul">{tipo}</h2>
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {materiais.filter((m) => m.tipo === tipo).map((m) => (
                <li key={m.id}>
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="group flex h-full items-start gap-4 rounded-2xl border border-borda bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-azul text-sm font-bold text-white">
                      {m.nomeArquivo.split(".").pop()?.toUpperCase() ?? "ARQ"}
                    </span>
                    <span>
                      <span className="block font-semibold text-azul group-hover:text-azul-2">{m.titulo}</span>
                      {m.descricao && <span className="mt-1 block text-sm leading-relaxed text-texto-suave">{m.descricao}</span>}
                      <span className="mt-3 block text-sm font-semibold text-laranja">Abrir arquivo →</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </Secao>
  );
}
