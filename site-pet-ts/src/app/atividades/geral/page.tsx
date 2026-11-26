import type { Metadata } from "next";
import Link from "next/link";
import AtividadeCard from "@/components/AtividadeCard";
import { Cabecalho, Secao } from "@/components/Secao";
import { listarAprovadas } from "@/lib/store";

// Atividades são lidas a cada requisição; o build não deve congelar essa lista.
export const instant = false;

export const metadata: Metadata = { title: "Atividades do canal geral" };

export default async function AtividadesGerais() {
  const atividades = await listarAprovadas("geral");

  return (
    <Secao className="py-16">
      <Link href="/atividades" className="text-sm font-medium text-azul-2 hover:underline">← Todas as atividades</Link>
      <div className="mt-6">
        <Cabecalho eyebrow="Canal geral" titulo="Atividades do canal geral" texto="Tudo o que foi publicado para o site todo, da mais recente para a mais antiga." />
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {atividades.length > 0 ? (
          atividades.map((a) => <AtividadeCard key={a.id} atividade={a} />)
        ) : (
          <p className="text-texto-suave md:col-span-2 lg:col-span-3">Nenhuma atividade publicada no canal geral ainda.</p>
        )}
      </div>
    </Secao>
  );
}
