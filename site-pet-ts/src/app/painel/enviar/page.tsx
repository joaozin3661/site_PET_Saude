import type { Metadata } from "next";
import { Cabecalho } from "@/components/Secao";
import FormularioEnvio from "@/components/FormularioEnvio";
import { exigirUsuario } from "@/lib/auth";

export const metadata: Metadata = { title: "Painel · Enviar atividade" };
export const instant = false;

export default async function PainelEnviar() {
  const usuario = await exigirUsuario();

  return (
    <div className="mx-auto max-w-3xl">
      <Cabecalho
        eyebrow="Para os grupos"
        titulo="Enviar uma atividade"
        texto="Envie eventos, oficinas, visitas e registros. No seu grupo a atividade é publicada direto na página do grupo; no canal geral, passa pela aprovação de um administrador."
      />
      <FormularioEnvio perfil={{ papel: usuario.papel, grupo: usuario.grupo }} />
    </div>
  );
}
