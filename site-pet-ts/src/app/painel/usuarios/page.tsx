import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Cabecalho } from "@/components/Secao";
import { exigirUsuario } from "@/lib/auth";
import { GRUPOS } from "@/lib/content";
import { listarUsuarios } from "@/lib/store";
import { cadastrarUsuario, salvarUsuario } from "./actions";

export const instant = false;

export const metadata: Metadata = { title: "Painel · Usuários" };

const campo = "mt-2 w-full rounded-xl border border-borda bg-white px-4 py-3 outline-none focus:border-azul-2 focus:ring-4 focus:ring-azul-2/15";
const campoPequeno = "rounded-lg border border-borda bg-white px-3 py-2 text-sm outline-none focus:border-azul-2";
const rotulo = "text-sm font-semibold text-azul";

function OpcoesGrupo() {
  return (
    <>
      <option value="">Sem grupo</option>
      {GRUPOS.map((g) => (
        <option key={g.numero} value={g.numero}>GT {g.numero} · {g.unidade}</option>
      ))}
    </>
  );
}

export default async function PainelUsuarios() {
  const atual = await exigirUsuario();
  if (atual.papel !== "admin") redirect("/painel");
  const usuarios = await listarUsuarios();

  return (
    <>
      <Cabecalho
        eyebrow="Administração"
        titulo="Usuários"
        texto="Administradores mexem em tudo. Editores veem tudo, mas só publicam, editam e excluem no grupo ao qual estão vinculados."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <ul className="grid gap-3 self-start">
          {usuarios.map((u) => (
            <li key={u.id} className="rounded-2xl border border-borda bg-white p-5 shadow-sm">
              <p className="font-semibold text-azul">{u.nome}{u.id === atual.id && <span className="ml-2 text-xs font-normal text-texto-suave">(você)</span>}</p>
              <p className="text-sm text-texto-suave">{u.email}</p>
              <form action={salvarUsuario} className="mt-4 flex flex-wrap items-center gap-2">
                <input type="hidden" name="id" value={u.id} />
                <select name="papel" defaultValue={u.papel} aria-label={`Papel de ${u.nome}`} className={campoPequeno}>
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </select>
                <select name="grupo" defaultValue={u.grupo ?? ""} aria-label={`Grupo de ${u.nome}`} className={`${campoPequeno} min-w-0 flex-1`}>
                  <OpcoesGrupo />
                </select>
                <button type="submit" className="rounded-full border border-azul px-4 py-2 text-sm font-semibold text-azul hover:bg-azul-claro">Salvar</button>
              </form>
            </li>
          ))}
        </ul>

        <form action={cadastrarUsuario} className="grid gap-4 self-start rounded-2xl border border-borda bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-azul">Novo usuário</h2>
          <label className="block">
            <span className={rotulo}>Nome</span>
            <input name="nome" required maxLength={120} className={campo} />
          </label>
          <label className="block">
            <span className={rotulo}>E-mail</span>
            <input name="email" type="email" required maxLength={200} className={campo} />
          </label>
          <label className="block">
            <span className={rotulo}>Senha (mínimo 8 caracteres)</span>
            <input name="senha" type="text" required minLength={8} autoComplete="off" className={campo} />
          </label>
          <label className="block">
            <span className={rotulo}>Papel</span>
            <select name="papel" defaultValue="editor" className={campo}>
              <option value="editor">Editor</option>
              <option value="admin">Administrador</option>
            </select>
          </label>
          <label className="block">
            <span className={rotulo}>Grupo (para editores)</span>
            <select name="grupo" defaultValue="" className={campo}>
              <OpcoesGrupo />
            </select>
          </label>
          <button type="submit" className="w-fit rounded-full bg-laranja px-6 py-3 font-semibold text-white hover:bg-laranja-escuro">Criar usuário</button>
        </form>
      </div>
    </>
  );
}
