import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cabecalho, Secao } from "@/components/Secao";
import { formatarData } from "@/lib/format";
import { listarNoticias } from "@/lib/store";

export const metadata: Metadata = { title: "Notícias" };
export const instant = false;

export default async function Noticias() {
  const noticias = await listarNoticias();

  return (
    <Secao className="py-16">
      <Cabecalho eyebrow="Notícias" titulo="Novidades do projeto" texto="Textos e fotos escritos pela equipe do PET-Saúde." />
      {noticias.length === 0 ? (
        <p className="mt-14 text-texto-suave">Nenhuma notícia publicada ainda.</p>
      ) : (
        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {noticias.map((n) => (
            <li key={n.id}>
              <Link href={`/noticias/${n.id}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-borda bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                {n.capaUrl ? (
                  <Image src={n.capaUrl} alt="" width={800} height={450} className="aspect-video w-full object-cover" />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-azul-claro text-4xl" aria-hidden="true">📰</div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-texto-suave">{formatarData(n.criadoEm)} · {n.autorNome}</p>
                  <h2 className="mt-2 text-xl font-semibold leading-snug text-azul group-hover:text-azul-2">{n.titulo}</h2>
                  {n.resumo && <p className="mt-3 flex-1 leading-relaxed text-texto-suave">{n.resumo}</p>}
                  <span className="mt-5 text-sm font-semibold text-laranja transition group-hover:translate-x-1">Ler notícia →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Secao>
  );
}
