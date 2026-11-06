import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AtividadeCard from "@/components/AtividadeCard";
import { Secao } from "@/components/Secao";
import { GRUPOS, consultaMapa, getGrupo } from "@/lib/content";
import { buscarGrupoInfo, listarAprovadas, listarFotos, listarIntegrantes, listarMateriais } from "@/lib/store";

// Tudo é lido a cada requisição; o build não deve congelar essas listas.
export const instant = false;

type Props = { params: Promise<{ numero: string }> };

export function generateStaticParams() {
  return GRUPOS.map((g) => ({ numero: String(g.numero) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const grupo = getGrupo(Number((await params).numero));
  return { title: grupo ? `GT ${grupo.numero}` : "Grupo não encontrado" };
}

function Pessoa({ nome, lattes }: { nome: string; lattes?: string | null }) {
  if (!lattes) return <>{nome}</>;
  return (
    <a href={lattes} target="_blank" rel="noopener noreferrer" className="font-medium text-azul-2 underline underline-offset-4 hover:text-azul" title="Abrir currículo Lattes">
      {nome} <span aria-hidden="true">↗</span>
      <span className="sr-only"> (currículo Lattes, abre em nova aba)</span>
    </a>
  );
}

export default async function GrupoDetalhe({ params }: Props) {
  const grupo = getGrupo(Number((await params).numero));
  if (!grupo) notFound();

  const [info, integrantes, atividades, fotos, materiais] = await Promise.all([
    buscarGrupoInfo(grupo.numero),
    listarIntegrantes(grupo.numero),
    listarAprovadas(grupo.numero),
    listarFotos(grupo.numero),
    listarMateriais(grupo.numero),
  ]);

  const consulta = consultaMapa(grupo.unidade, info?.endereco);
  const mapaEmbed = `https://www.google.com/maps?q=${encodeURIComponent(consulta)}&output=embed`;
  const mapaLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;

  return (
    <>
      <section className="bg-azul py-16 text-white">
        <Secao>
          <Link href="/grupos" className="text-sm font-medium text-white/70 hover:text-white">← Todos os grupos</Link>
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-laranja">Grupo tutorial {grupo.numero}</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">{grupo.titulo}</h1>
        </Secao>
      </section>

      <Secao className="py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-azul">Sobre o grupo</h2>
            <p className="mt-4 text-lg leading-relaxed text-texto-suave">{grupo.descricao}</p>

            <h2 className="mt-12 text-2xl font-bold text-azul">Integrantes</h2>
            {integrantes.length > 0 ? (
              <ul className="mt-4 grid gap-x-8 gap-y-2 text-texto sm:grid-cols-2">
                {integrantes.map((i) => (
                  <li key={i.id} className="border-b border-borda py-2"><Pessoa nome={i.nome} lattes={i.lattes} /></li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-texto-suave">A lista de integrantes será publicada em breve.</p>
            )}
          </div>

          <dl className="grid gap-4 self-start rounded-2xl border border-borda bg-white p-8 shadow-sm">
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-azul-2">Tutores</dt>
              <dd className="mt-1 text-texto"><Pessoa nome={grupo.tutor} lattes={info?.tutorLattes} /></dd>
              <dd className="mt-1 text-texto"><Pessoa nome={grupo.tutor2} lattes={info?.tutor2Lattes} /></dd>
            </div>
            <div>
              <dt className="text-sm font-semibold uppercase tracking-wider text-azul-2">Unidade</dt>
              <dd className="mt-1 text-texto">{grupo.unidade}</dd>
              {info?.endereco && <dd className="mt-1 text-sm text-texto-suave">{info.endereco}</dd>}
            </div>
          </dl>
        </div>
      </Secao>

      <Secao className="pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-azul">Onde fica</h2>
          <a href={mapaLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-azul-2 underline underline-offset-4">
            Abrir no Google Maps ↗
          </a>
        </div>
        <div className="mt-6 overflow-hidden rounded-2xl border border-borda shadow-sm">
          <iframe
            title={`Mapa: ${grupo.unidade}`}
            src={mapaEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full md:h-96"
          />
        </div>
      </Secao>

      <Secao className="pb-16">
        <h2 className="text-2xl font-bold text-azul">Atividades do grupo</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {atividades.length > 0 ? (
            atividades.map((a) => <AtividadeCard key={a.id} atividade={a} />)
          ) : (
            <p className="text-texto-suave">Nenhuma atividade publicada por este grupo ainda.</p>
          )}
        </div>
      </Secao>

      <Secao className="pb-16">
        <h2 className="text-2xl font-bold text-azul">Galeria do grupo</h2>
        {fotos.length > 0 ? (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fotos.map((f) => (
              <li key={f.id}>
                <Link href={`/galeria/${f.id}`} className="group block h-full overflow-hidden rounded-2xl border border-borda bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <Image src={f.url} alt={f.titulo} width={800} height={600} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="p-5">
                    <h3 className="font-semibold text-azul group-hover:text-azul-2">{f.titulo}</h3>
                    {f.descricao && <p className="mt-2 text-sm leading-relaxed text-texto-suave">{f.descricao}</p>}
                    <span className="mt-3 block text-sm font-semibold text-laranja">Abrir foto →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-texto-suave">Nenhuma foto publicada por este grupo ainda.</p>
        )}
      </Secao>

      <Secao className="pb-24">
        <h2 className="text-2xl font-bold text-azul">Produção técnica do grupo</h2>
        {materiais.length > 0 ? (
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {materiais.map((m) => (
              <li key={m.id}>
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="group block h-full rounded-2xl border border-borda bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <span className="text-xs font-semibold uppercase tracking-wider text-laranja">{m.tipo}</span>
                  <span className="mt-1 block font-semibold text-azul group-hover:text-azul-2">{m.titulo}</span>
                  {m.descricao && <span className="mt-1 block text-sm leading-relaxed text-texto-suave">{m.descricao}</span>}
                  <span className="mt-3 block text-sm font-semibold text-laranja">Abrir arquivo →</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 text-texto-suave">Nenhum material publicado por este grupo ainda.</p>
        )}
      </Secao>
    </>
  );
}
