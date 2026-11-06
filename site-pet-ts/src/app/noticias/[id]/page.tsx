import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import { Secao } from "@/components/Secao";
import { formatarData } from "@/lib/format";
import { buscarNoticia } from "@/lib/store";

export const instant = false;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const noticia = await buscarNoticia((await params).id);
  return { title: noticia?.titulo ?? "Notícia não encontrada" };
}

export default async function NoticiaDetalhe({ params }: Props) {
  const noticia = await buscarNoticia((await params).id);
  if (!noticia) notFound();

  return (
    <article className="pb-24">
      {noticia.capaUrl && (
        <div className="relative h-[22rem] w-full overflow-hidden bg-azul sm:h-[28rem]">
          <Image src={noticia.capaUrl} alt="" fill priority sizes="100vw" className="object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
        </div>
      )}
      <Secao className={noticia.capaUrl ? "-mt-24 relative" : "pt-16"}>
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl md:p-12">
          <Link href="/noticias" className="text-sm font-medium text-azul-2 hover:underline">← Todas as notícias</Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-texto-suave">
            {formatarData(noticia.criadoEm)} · {noticia.autorNome}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-azul sm:text-4xl">{noticia.titulo}</h1>
          {noticia.resumo && <p className="mt-5 text-xl leading-relaxed text-texto-suave">{noticia.resumo}</p>}
          <div className="mt-8 border-t border-borda pt-4">
            <Markdown texto={noticia.corpo} />
          </div>
        </div>
      </Secao>
    </article>
  );
}
