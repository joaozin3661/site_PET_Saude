import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Cabecalho, Secao } from "@/components/Secao";
import FormularioLogin from "@/components/FormularioLogin";
import { usuarioAtual } from "@/lib/auth";

export const instant = false;

export const metadata: Metadata = { title: "Acesso restrito" };

export default async function Acesso() {
  if (await usuarioAtual()) redirect("/painel");

  return (
    <Secao className="py-20">
      <div className="mx-auto max-w-md">
        <Cabecalho eyebrow="Área restrita" titulo="Entrar" texto="Acesso para a equipe do PET-Saúde que publica no site." />
        <div className="mt-10">
          <FormularioLogin />
        </div>
      </div>
    </Secao>
  );
}
