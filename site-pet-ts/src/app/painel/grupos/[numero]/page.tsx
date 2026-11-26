import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import BotaoRemover from "@/components/BotaoRemover";
import { exigirUsuario } from "@/lib/auth";
import { podeGerenciar } from "@/lib/permissoes";
import { consultaMapa, getGrupo } from "@/lib/content";
import { buscarGrupoInfo, listarIntegrantes, type Funcao, type Integrante } from "@/lib/store";
import { adicionarIntegrantesGrupo, removerIntegrante, salvarInfoGrupo, salvarLattesIntegrante } from "../actions";

export const instant = false;

type Props = { params: Promise<{ numero: string }> };

export const metadata: Metadata = { title: "Painel · Grupo" };

const campo = "mt-2 w-full rounded-xl border border-borda bg-white px-4 py-3 outline-none focus:border-azul-2 focus:ring-4 focus:ring-azul-2/15";
const rotulo = "text-sm font-semibold text-azul";

function ListaPessoas({ grupo, funcao, titulo, pessoas }: { grupo: number; funcao: Funcao; titulo: string; pessoas: Integrante[] }) {
  return (
    <div className="grid gap-4 rounded-2xl border border-borda bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-azul">{titulo} ({pessoas.length})</h2>
      <form action={adicionarIntegrantesGrupo} className="grid gap-3">
        <input type="hidden" name="grupo" value={grupo} />
        <input type="hidden" name="funcao" value={funcao} />
        <label className="block">
          <span className={rotulo}>Adicionar: um nome por linha (Lattes é opcional)</span>
          <textarea name="nomes" rows={3} required maxLength={8000} className={campo} placeholder={"Nome Sobrenome\nOutro Nome | https://lattes.cnpq.br/0000000000000000"} />
          <span className="mt-2 block text-sm text-texto-suave">Para incluir o Lattes na hora, escreva o nome, uma barra vertical (|) e o link ou o número de 16 dígitos.</span>
        </label>
        <button type="submit" className="w-fit rounded-full bg-azul px-6 py-2.5 font-semibold text-white hover:bg-azul-2">Adicionar</button>
      </form>
      <ul className="grid gap-2">
        {pessoas.length === 0 && <li className="text-texto-suave">Nenhum cadastro ainda.</li>}
        {pessoas.map((i) => (
          <li key={i.id} className="grid gap-2 rounded-xl border border-borda px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate font-medium text-texto">{i.nome}</span>
              <BotaoRemover acao={removerIntegrante} id={String(i.id)} />
            </div>
            <form action={salvarLattesIntegrante} className="flex gap-2">
              <input type="hidden" name="id" value={i.id} />
              <input name="lattes" defaultValue={i.lattes ?? ""} maxLength={200} aria-label={`Lattes de ${i.nome}`} placeholder="Lattes (link ou número)" className="min-w-0 flex-1 rounded-lg border border-borda px-3 py-1.5 text-sm outline-none focus:border-azul-2" />
              <button type="submit" className="rounded-full border border-azul px-4 py-1.5 text-sm font-semibold text-azul hover:bg-azul-claro">Salvar</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function PainelGrupo({ params }: Props) {
  const usuario = await exigirUsuario();
  const grupo = getGrupo(Number((await params).numero));
  if (!grupo) notFound();
  // Editores só alteram o próprio grupo; os outros eles consultam na página pública.
  if (!podeGerenciar(usuario, grupo.numero)) redirect(`/grupos/${grupo.numero}`);

  const [info, integrantes] = await Promise.all([buscarGrupoInfo(grupo.numero), listarIntegrantes(grupo.numero)]);

  return (
    <>
      <Link href="/painel/grupos" className="text-sm font-medium text-texto-suave hover:text-azul">← Todos os grupos</Link>
      <h1 className="mt-4 text-3xl font-bold text-azul">GT {grupo.numero} · {grupo.unidade}</h1>
      <p className="mt-2 text-texto-suave">{grupo.titulo}</p>
      <p className="mt-1 text-sm">
        <Link href={`/grupos/${grupo.numero}`} className="font-semibold text-azul-2 underline underline-offset-4">Ver página pública</Link>
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <form action={salvarInfoGrupo} className="grid gap-5 self-start rounded-2xl border border-borda bg-white p-6 shadow-sm">
          <input type="hidden" name="grupo" value={grupo.numero} />
          <h2 className="text-lg font-semibold text-azul">Endereço e Lattes</h2>

          <label className="block">
            <span className={rotulo}>Endereço da unidade</span>
            <input name="endereco" defaultValue={info?.endereco ?? ""} maxLength={200} className={campo} placeholder="Rua, número, bairro, Teresina - PI" />
            <span className="mt-2 block text-sm text-texto-suave">
              Vazio: o mapa busca por “{consultaMapa(grupo.unidade)}”, o que pode errar o local. Com o endereço, fica exato.
            </span>
          </label>

          <label className="block">
            <span className={rotulo}>Lattes de {grupo.tutor} (tutor/a 1)</span>
            <input name="tutorLattes" defaultValue={info?.tutorLattes ?? ""} maxLength={200} className={campo} placeholder="https://lattes.cnpq.br/0000000000000000 ou só o número" />
          </label>

          <label className="block">
            <span className={rotulo}>Lattes de {grupo.tutor2} (tutor/a 2)</span>
            <input name="tutor2Lattes" defaultValue={info?.tutor2Lattes ?? ""} maxLength={200} className={campo} placeholder="https://lattes.cnpq.br/0000000000000000 ou só o número" />
          </label>

          <button type="submit" className="w-fit rounded-full bg-laranja px-6 py-3 font-semibold text-white hover:bg-laranja-escuro">Salvar</button>
        </form>

        <div className="grid gap-6 self-start">
          <ListaPessoas grupo={grupo.numero} funcao="preceptor" titulo="Preceptores(as)" pessoas={integrantes.filter((i) => i.funcao === "preceptor")} />
          <ListaPessoas grupo={grupo.numero} funcao="aluno" titulo="Estudantes" pessoas={integrantes.filter((i) => i.funcao === "aluno")} />
        </div>
      </div>
    </>
  );
}
