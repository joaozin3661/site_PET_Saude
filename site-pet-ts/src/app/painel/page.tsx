import type { Metadata } from "next";
import { Cabecalho } from "@/components/Secao";
import { formatarData } from "@/lib/format";
import BotaoRemover from "@/components/BotaoRemover";
import { exigirUsuario } from "@/lib/auth";
import { listarAtividadesPorStatus } from "@/lib/store";
import { aprovarAtividade, recusarAtividade, removerAtividade } from "./actions";

export const instant = false;

export const metadata: Metadata = { title: "Painel · Atividades" };

export default async function PainelAtividades() {
  const usuario = await exigirUsuario();
  const admin = usuario.papel === "admin";
  const pendentes = await listarAtividadesPorStatus("pendente");
  const publicadas = admin ? await listarAtividadesPorStatus("aprovado") : [];

  return (
    <>
      <Cabecalho eyebrow="Revisão" titulo="Atividades enviadas" texto={admin ? "Aprove para publicar no site, ou recuse. Atividades recusadas não aparecem em lugar nenhum." : "Estas atividades aguardam a revisão de um administrador. Só administradores aprovam, recusam ou excluem."} />
      <ul className="mt-10 grid gap-5">
        {pendentes.length === 0 && <li className="text-texto-suave">Nenhuma atividade aguardando revisão.</li>}
        {pendentes.map((a) => (
          <li key={a.id} className="rounded-2xl border border-borda bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider">
              <span className="rounded-full bg-azul-claro px-3 py-1 text-azul-2">{a.categoria}</span>
              <span className="text-texto-suave">{a.grupo ? `GT ${a.grupo}` : "Geral do PET"}</span>
              <span className="text-texto-suave">Enviado em {formatarData(a.criadoEm)}</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-azul">{a.titulo}</h2>
            {a.dataEvento && <p className="mt-1 text-sm text-texto-suave">Evento em {formatarData(a.dataEvento)}</p>}
            <p className="mt-4 leading-relaxed text-texto">{a.resumo}</p>
            {a.descricao && <p className="mt-3 whitespace-pre-line leading-relaxed text-texto-suave">{a.descricao}</p>}
            {a.contato && <p className="mt-3 text-sm text-texto-suave">Contato (não publicado): {a.contato}</p>}
            {admin && (
              <div className="mt-6 flex gap-3">
                <form action={aprovarAtividade.bind(null, a.id)}>
                  <button type="submit" className="rounded-full bg-azul px-5 py-2 text-sm font-semibold text-white hover:bg-azul-2">Aprovar</button>
                </form>
                <form action={recusarAtividade.bind(null, a.id)}>
                  <button type="submit" className="rounded-full border border-borda px-5 py-2 text-sm font-semibold text-texto-suave hover:bg-red-50 hover:text-red-700">Recusar</button>
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>

      {admin && publicadas.length > 0 && (
        <div className="mt-14">
          <h2 className="text-lg font-bold text-azul">Atividades publicadas</h2>
          <ul className="mt-4 grid gap-3">
            {publicadas.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-borda bg-white p-5">
                <div className="min-w-0">
                  <p className="text-xs text-texto-suave">{a.grupo ? `GT ${a.grupo}` : "Geral do PET"} · {formatarData(a.criadoEm)}</p>
                  <p className="truncate font-semibold text-azul">{a.titulo}</p>
                </div>
                <BotaoRemover acao={removerAtividade} id={a.id} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
