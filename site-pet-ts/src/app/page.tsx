import Image from "next/image";
import Link from "next/link";
import AtividadeCard from "@/components/AtividadeCard";
import { Cabecalho, Secao } from "@/components/Secao";
import { EIXOS, GRUPOS } from "@/lib/content";
import { listarAprovadas } from "@/lib/store";

// Atividades são lidas a cada requisição; o build não deve congelar essa lista.
export const instant = false;


export default async function Home() {
  const atividades = (await listarAprovadas("geral")).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f3556] via-azul to-[#0c2b47] text-white">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-laranja/25 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-72 right-[-8rem] h-[36rem] w-[36rem] rounded-full border-[56px] border-white/5" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:py-32">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-200">
              UFPI · FMS Teresina · SUS Digital
            </p>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Saúde Digital na Atenção Primária à Saúde de Teresina
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
              Formação, inovação e integração no SUS para fortalecer a cultura digital, apoiar trabalhadores e aproximar os serviços de saúde da comunidade.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/sobre" className="rounded-full bg-laranja px-7 py-3.5 font-bold text-white shadow-lg shadow-laranja/30 transition hover:-translate-y-0.5 hover:bg-laranja-escuro">
                Conhecer o projeto
              </Link>
              <Link href="/eixos" className="rounded-full bg-white px-7 py-3.5 font-bold text-azul shadow-lg transition hover:-translate-y-0.5 hover:bg-azul-claro">
                Ver eixos temáticos
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <Image
              src="/robo-pet-lindo.jpeg"
              alt="Mascote do PET-Saúde Digital"
              width={640}
              height={640}
              priority
              className="relative rounded-3xl object-cover shadow-2xl ring-1 ring-white/20"
            />
          </div>
        </div>
      </section>

      <Secao className="py-20">
        <Cabecalho
          eyebrow="Eixos temáticos"
          titulo="Três frentes para organizar as ações"
          texto="Os eixos reúnem atividades de formação, desenvolvimento de soluções e uso qualificado de dados em saúde."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {EIXOS.map((eixo) => (
            <Link
              key={eixo.numero}
              href="/eixos"
              className="group rounded-2xl border border-borda bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-laranja text-lg font-bold text-white">
                {eixo.numero}
              </span>
              <h3 className="mt-6 text-lg font-semibold leading-snug text-azul">{eixo.titulo}</h3>
              <p className="mt-3 leading-relaxed text-texto-suave">{eixo.resumo}</p>
              <span className="mt-6 inline-block font-semibold text-azul-2 transition group-hover:translate-x-1">Ver eixo →</span>
            </Link>
          ))}
        </div>
      </Secao>

      <Secao className="pb-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Cabecalho eyebrow="Atualizações" titulo="Atividades recentes" />
          <Link href="/atividades" className="font-semibold text-azul-2 hover:underline">
            Todas as atividades →
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {atividades.length > 0 ? (
            atividades.map((a) => <AtividadeCard key={a.id} atividade={a} />)
          ) : (
            <p className="text-texto-suave md:col-span-3">Nenhuma atividade publicada ainda.</p>
          )}
        </div>
      </Secao>

      <Secao className="pb-24">
        <div className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-borda md:p-14">
          <Cabecalho eyebrow="Unidades e equipes" titulo="Grupos tutoriais na rede SUS" texto="Os GTs atuam em unidades selecionadas, com tutores, coordenação, preceptores e monitores." />
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {GRUPOS.slice(0, 6).map((g) => (
              <li key={g.numero}>
                <Link href={`/grupos/${g.numero}`} className="flex items-center gap-4 rounded-xl border border-borda p-4 transition hover:border-azul-2 hover:bg-azul-claro">
                  <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-azul text-sm font-bold text-white">GT {g.numero}</span>
                  <span className="text-sm font-medium text-azul">{g.unidade}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/grupos" className="mt-8 inline-block font-semibold text-azul-2 hover:underline">
            Ver todos os grupos →
          </Link>
        </div>
      </Secao>
    </>
  );
}
