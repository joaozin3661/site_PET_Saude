import type { Metadata } from "next";
import { Cabecalho } from "@/components/Secao";
import EditorNoticia from "@/components/EditorNoticia";
import { exigirUsuario } from "@/lib/auth";

export const metadata: Metadata = { title: "Painel · Nova notícia" };
export const instant = false;

export default async function NovaNoticia() {
  await exigirUsuario();
  return (
    <div className="mx-auto max-w-3xl">
      <Cabecalho eyebrow="Nova notícia" titulo="Escrever notícia" />
      <div className="mt-10">
        <EditorNoticia />
      </div>
    </div>
  );
}
