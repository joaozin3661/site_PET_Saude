import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cabecalho, Secao } from "@/components/Secao";
import { listarFotos } from "@/lib/store";

export const metadata: Metadata = { title: "Galeria" };
export const instant = false;

export default async function Galeria() {
  const fotos = await listarFotos("geral");

  return (
    <Secao className="py-16">
      <Cabecalho eyebrow="Banco de fotos" titulo="Registros das ações" texto="Encontros, oficinas, visitas técnicas e atividades dos grupos tutoriais." />
      {fotos.length === 0 ? (
        <p className="mt-14 text-texto-suave">Nenhuma foto publicada ainda.</p>
      ) : (
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fotos.map((f) => (
            <li key={f.id}>
              <Link href={`/galeria/${f.id}`} className="group block h-full overflow-hidden rounded-2xl border border-borda bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <Image src={f.url} alt={f.titulo} width={800} height={600} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="p-5">
                  {f.grupo && <p className="text-xs font-semibold uppercase tracking-wider text-laranja">GT {f.grupo}</p>}
                  <h2 className="mt-1 font-semibold text-azul group-hover:text-azul-2">{f.titulo}</h2>
                  {f.descricao && <p className="mt-2 text-sm leading-relaxed text-texto-suave">{f.descricao}</p>}
                  <span className="mt-3 block text-sm font-semibold text-laranja">Abrir foto →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Secao>
  );
}
