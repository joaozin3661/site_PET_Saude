import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cabecalho } from "@/components/Secao";
import EditorNoticia from "@/components/EditorNoticia";
import { exigirUsuario } from "@/lib/auth";
import { buscarNoticia } from "@/lib/store";

export const metadata: Metadata = { title: "Painel · Editar notícia" };
export const instant = false;

type Props = { params: Promise<{ id: string }> };

export default async function EditarNoticia({ params }: Props) {
  const usuario = await exigirUsuario();
  const noticia = await buscarNoticia((await params).id);
  if (!noticia) notFound();
  if (noticia.autorId !== usuario.id) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Cabecalho eyebrow="Editar notícia" titulo={noticia.titulo} />
      <div className="mt-10">
        <EditorNoticia noticia={noticia} />
      </div>
    </div>
  );
}
