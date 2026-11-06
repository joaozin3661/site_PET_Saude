import type { Metadata } from "next";
import Link from "next/link";
import AtividadeCard from "@/components/AtividadeCard";
import { Cabecalho, Secao } from "@/components/Secao";
import { listarAprovadas } from "@/lib/store";

// Atividades são lidas a cada requisição; o build não deve congelar essa lista.
export const instant = false;

export const metadata: Metadata = { title: "Atividades" };

export default async function Atividades() {
  const atividades = await listarAprovadas("geral");

  return (
    <Secao className="py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Cabecalho eyebrow="Registros" titulo="O que estamos realizando" texto="Eventos, oficinas, visitas e registros publicados pelos grupos tutoriais." />
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {atividades.length > 0 ? (
          atividades.map((a) => <AtividadeCard key={a.id} atividade={a} />)
        ) : (
          <p className="text-texto-suave md:col-span-2 lg:col-span-3">Nenhuma atividade publicada ainda.</p>
        )}
      </div>
    </Secao>
  );
}
