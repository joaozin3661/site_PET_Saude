import Link from "next/link";
import { sair } from "@/app/acesso/actions";
import { Secao } from "@/components/Secao";
import { exigirUsuario } from "@/lib/auth";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const usuario = await exigirUsuario();

  return (
    <Secao>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-borda py-6">
        <div>
          <p className="text-sm text-texto-suave">Olá, {usuario.nome} · {usuario.papel === "admin" ? "administrador" : "editor"}</p>
          <nav aria-label="Painel" className="mt-2 flex flex-wrap gap-2">
            <Link href="/painel" className="rounded-full px-4 py-2 text-sm font-semibold text-azul hover:bg-azul-claro">Atividades</Link>
            <Link href="/painel/fotos" className="rounded-full px-4 py-2 text-sm font-semibold text-azul hover:bg-azul-claro">Galeria</Link>
            <Link href="/painel/enviar" className="rounded-full px-4 py-2 text-sm font-semibold text-azul hover:bg-azul-claro">Enviar atividade</Link>
            <Link href="/painel/noticias" className="rounded-full px-4 py-2 text-sm font-semibold text-azul hover:bg-azul-claro">Notícias</Link>
            <Link href="/painel/materiais" className="rounded-full px-4 py-2 text-sm font-semibold text-azul hover:bg-azul-claro">Produção técnica</Link>
            {usuario.papel === "admin" && (
              <Link href="/painel/grupos" className="rounded-full px-4 py-2 text-sm font-semibold text-azul hover:bg-azul-claro">Grupos</Link>
            )}
          </nav>
        </div>
        <form action={sair}>
          <button type="submit" className="rounded-full border border-azul px-4 py-2 text-sm font-semibold text-azul hover:bg-azul-claro">Sair</button>
        </form>
      </div>
      <div className="py-10">{children}</div>
    </Secao>
  );
}
