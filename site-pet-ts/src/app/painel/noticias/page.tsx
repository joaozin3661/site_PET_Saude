import type { Metadata } from "next";
import Link from "next/link";
import BotaoRemover from "@/components/BotaoRemover";
import { Cabecalho } from "@/components/Secao";
import { exigirUsuario } from "@/lib/auth";
import { formatarData } from "@/lib/format";
import { listarNoticias } from "@/lib/store";
import { removerNoticia } from "./actions";

export const metadata: Metadata = { title: "Painel · Notícias" };
export const instant = false;

export default async function PainelNoticias() {
  const usuario = await exigirUsuario();
  const todas = await listarNoticias();
  const minhas = todas.filter((n) => n.autorId === usuario.id);
  const outras = todas.filter((n) => n.autorId !== usuario.id);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Cabecalho eyebrow="Notícias" titulo="Suas notícias" texto="Notícias são publicadas assim que você salva. Você pode editar e apagar as suas." />
        <Link href="/painel/noticias/nova" className="rounded-full bg-laranja px-6 py-3 font-semibold text-white shadow-sm hover:bg-laranja-escuro">
          Nova notícia
        </Link>
      </div>

      <ul className="mt-10 grid gap-4">
        {minhas.length === 0 && <li className="text-texto-suave">Você ainda não escreveu nenhuma notícia.</li>}
        {minhas.map((n) => (
          <li key={n.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-borda bg-white p-5 shadow-sm">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-texto-suave">{formatarData(n.criadoEm)}</p>
              <p className="truncate font-semibold text-azul">{n.titulo}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/noticias/${n.id}`} className="rounded-full border border-borda px-4 py-1.5 text-sm font-semibold text-texto-suave hover:bg-azul-claro">Ver</Link>
              <Link href={`/painel/noticias/${n.id}`} className="rounded-full border border-azul px-4 py-1.5 text-sm font-semibold text-azul hover:bg-azul-claro">Editar</Link>
              <BotaoRemover acao={removerNoticia} id={n.id} />
            </div>
          </li>
        ))}
      </ul>

      {outras.length > 0 && (
        <div className="mt-14">
          <h2 className="text-lg font-bold text-azul">Notícias de outros autores</h2>
          <ul className="mt-4 grid gap-3">
            {outras.map((n) => (
              <li key={n.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-borda bg-white p-5">
                <div className="min-w-0">
                  <p className="text-xs text-texto-suave">{n.autorNome} · {formatarData(n.criadoEm)}</p>
                  <p className="truncate font-semibold text-azul">{n.titulo}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/noticias/${n.id}`} className="rounded-full border border-borda px-4 py-1.5 text-sm font-semibold text-texto-suave hover:bg-azul-claro">Ver</Link>
                  {usuario.papel === "admin" && <BotaoRemover acao={removerNoticia} id={n.id} />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
