import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Cabecalho } from "@/components/Secao";
import { exigirUsuario } from "@/lib/auth";
import { GRUPOS } from "@/lib/content";

export const instant = false;

export const metadata: Metadata = { title: "Painel · Grupos" };

export default async function PainelGrupos() {
  const usuario = await exigirUsuario();
  if (usuario.papel !== "admin") redirect("/painel");

  return (
    <>
      <Cabecalho eyebrow="Administração" titulo="Grupos tutoriais" texto="Cadastre o endereço da unidade, o Lattes dos professores e os integrantes de cada grupo." />
      <ul className="mt-10 grid gap-3 md:grid-cols-2">
        {GRUPOS.map((g) => (
          <li key={g.numero}>
            <Link href={`/painel/grupos/${g.numero}`} className="flex h-full items-center gap-4 rounded-2xl border border-borda bg-white p-5 shadow-sm hover:bg-azul-claro">
              <span className="rounded-lg bg-azul px-3 py-1 text-sm font-bold text-white">GT {g.numero}</span>
              <span className="min-w-0">
                <span className="block truncate font-semibold text-azul">{g.unidade}</span>
                <span className="block truncate text-sm text-texto-suave">{g.titulo}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
