import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Secao } from "@/components/Secao";
import { getGrupo } from "@/lib/content";
import { formatarData } from "@/lib/format";
import { buscarFoto } from "@/lib/store";

// Fotos são lidas a cada requisição; o build não deve congelar essa lista.
export const instant = false;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const foto = await buscarFoto((await params).id);
  return { title: foto?.titulo ?? "Foto não encontrada" };
}

export default async function FotoDetalhe({ params }: Props) {
  const foto = await buscarFoto((await params).id);
  if (!foto) notFound();

  const grupo = foto.grupo ? getGrupo(foto.grupo) : undefined;
  const voltar = grupo ? { href: `/grupos/${grupo.numero}`, rotulo: `← Voltar ao GT ${grupo.numero}` } : { href: "/galeria", rotulo: "← Toda a galeria" };

  return (
    <Secao className="py-16">
      <Link href={voltar.href} className="text-sm font-medium text-azul-2 hover:underline">{voltar.rotulo}</Link>
      <article className="mx-auto mt-8 max-w-4xl">
        {grupo && (
          <Link href={`/grupos/${grupo.numero}`} className="inline-block rounded-full bg-azul px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            GT {grupo.numero}
          </Link>
        )}
        <h1 className="mt-4 text-3xl font-bold leading-tight text-azul sm:text-4xl">{foto.titulo}</h1>
        <p className="mt-3 text-sm text-texto-suave">Publicada em {formatarData(foto.criadoEm)}</p>
        <Image
          src={foto.url}
          alt={foto.titulo}
          width={1600}
          height={1200}
          sizes="(min-width: 896px) 896px, 100vw"
          priority
          className="mt-8 h-auto w-full rounded-2xl border border-borda bg-white shadow-lg"
        />
        {foto.descricao && <p className="mt-6 text-lg leading-relaxed text-texto">{foto.descricao}</p>}
        <a href={foto.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block font-semibold text-azul-2 underline underline-offset-4">
          Abrir imagem original ↗
        </a>
      </article>
    </Secao>
  );
}
