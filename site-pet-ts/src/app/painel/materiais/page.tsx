import type { Metadata } from "next";
import { Cabecalho } from "@/components/Secao";
import BotaoRemover from "@/components/BotaoRemover";
import FormularioMaterial from "@/components/FormularioMaterial";
import { exigirUsuario } from "@/lib/auth";
import { listarMateriais } from "@/lib/store";
import { removerMaterial } from "../actions";

export const instant = false;

export const metadata: Metadata = { title: "Painel · Produção técnica" };

export default async function PainelMateriais() {
  const usuario = await exigirUsuario();
  const materiais = await listarMateriais();

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
      <FormularioMaterial />
      <div>
        <Cabecalho eyebrow="Produção técnica" titulo={`${materiais.length} material${materiais.length === 1 ? "" : "is"} publicado${materiais.length === 1 ? "" : "s"}`} texto="Não publique documentos com CPF, matrícula, endereço ou dados de usuários." />
        <ul className="mt-8 grid gap-3">
          {materiais.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-4 rounded-2xl border border-borda bg-white p-5 shadow-sm">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-laranja">{m.tipo} · {m.grupo ? `GT ${m.grupo}` : "Geral"}</p>
                <p className="truncate font-semibold text-azul">{m.titulo}</p>
              </div>
              {usuario.papel === "admin" && <BotaoRemover acao={removerMaterial} id={m.id} />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
