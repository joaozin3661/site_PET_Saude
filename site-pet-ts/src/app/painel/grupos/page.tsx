import type { Metadata } from "next";
import Link from "next/link";
import { Cabecalho } from "@/components/Secao";
import { exigirUsuario } from "@/lib/auth";
import { GRUPOS } from "@/lib/content";
import { podeGerenciar } from "@/lib/permissoes";

export const instant = false;

export const metadata: Metadata = { title: "Painel · Grupos" };

export default async function PainelGrupos() {
  const usuario = await exigirUsuario();

  return (
    <>
      <Cabecalho eyebrow="Administração" titulo="Grupos tutoriais" texto="Endereço da unidade, Lattes dos tutores e integrantes. Você pode editar o seu grupo; os demais são só para consulta." />
      <ul className="mt-10 grid gap-3 md:grid-cols-2">
        {GRUPOS.map((g) => (
          <li key={g.numero}>
            <Link href={`/painel/grupos/${g.numero}`} className="flex h-full items-center gap-4 rounded-2xl border border-borda bg-white p-5 shadow-sm hover:bg-azul-claro">
              <span className="rounded-lg bg-azul px-3 py-1 text-sm font-bold text-white">GT {g.numero}</span>
              <span className="min-w-0">
                <span className="block truncate font-semibold text-azul">{g.unidade}</span>
                <span className="block truncate text-sm text-texto-suave">{g.titulo}</span>
              </span>
              {podeGerenciar(usuario, g.numero) && usuario.papel !== "admin" && (
                <span className="ml-auto shrink-0 rounded-full bg-laranja/15 px-3 py-1 text-xs font-semibold text-laranja">Seu grupo</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
