import type { Metadata } from "next";
import { Cabecalho } from "@/components/Secao";
import FormularioEnvio from "@/components/FormularioEnvio";
import { exigirUsuario } from "@/lib/auth";

export const metadata: Metadata = { title: "Painel · Enviar atividade" };
export const instant = false;

export default async function PainelEnviar() {
  await exigirUsuario();

  return (
    <div className="mx-auto max-w-3xl">
      <Cabecalho
        eyebrow="Para os grupos"
        titulo="Enviar uma atividade"
        texto="Envie eventos, oficinas, visitas e registros do seu grupo. A equipe de comunicação revisa antes de publicar."
      />
      <FormularioEnvio />
    </div>
  );
}
