import type { Metadata } from "next";
import Link from "next/link";
import { Cabecalho, Secao } from "@/components/Secao";

export const metadata: Metadata = { title: "Conheça o PET-Digital" };

const PONTOS = [
  {
    icone: "👥",
    titulo: "Público envolvido",
    texto: "Estudantes, docentes, trabalhadores da saúde, gestores, preceptores, orientadores de serviço e usuários do SUS.",
  },
  {
    icone: "🏥",
    titulo: "Cenários de prática",
    texto: "Unidades selecionadas da rede municipal, incluindo UBS e CAPS vinculados à Fundação Municipal de Saúde.",
  },
  {
    icone: "🔐",
    titulo: "Ética e dados",
    texto: "As atividades respeitam a proteção de dados pessoais e sensíveis, a confidencialidade e a segurança da informação.",
  },
];

const CURSOS = [
  "Ciências da Computação",
  "Comunicação Social/Jornalismo",
  "Direito",
  "Educação Física",
  "Enfermagem",
  "Serviço Social",
  "Engenharia Cartográfica e de Agrimensura",
  "Engenharia de Produção",
  "Engenharia Elétrica",
  "Farmácia",
  "Medicina",
  "Nutrição",
  "Odontologia",
];

export default function Sobre() {
  return (
    <>
      <section className="bg-white py-20">
        <Secao>
          <Cabecalho
            eyebrow="Apresentação"
            titulo="PET-Saúde: Informação e Saúde Digital"
            texto="Projeto da Universidade Federal do Piauí em parceria com a Fundação Municipal de Saúde de Teresina para promover formação, inovação e integração no SUS."
          />
        </Secao>
      </section>

      <Secao className="py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-azul">O que é o PET-Saúde?</h2>
            <p className="mt-4 text-lg leading-relaxed text-texto-suave">
              O Programa de Educação pelo Trabalho para a Saúde fortalece a integração entre ensino, serviço e comunidade. Na temática de Informação e Saúde Digital, a proposta estimula a formação crítica e interdisciplinar, o uso ético das tecnologias e a produção de soluções para desafios do SUS.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-azul">Objetivo do projeto em Teresina</h2>
            <p className="mt-4 text-lg leading-relaxed text-texto-suave">
              Desenvolver ações de saúde digital na Atenção Primária à Saúde do SUS Teresina, a partir de estratégias de formação, educação permanente e transformação digital, fortalecendo a integração ensino-serviço-comunidade, o trabalho interprofissional e a inovação tecnológica.
            </p>
          </div>
        </div>
      </Secao>

      <Secao className="pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {PONTOS.map((ponto) => (
            <article key={ponto.titulo} className="rounded-2xl border border-borda bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-azul-claro text-2xl" aria-hidden="true">
                {ponto.icone}
              </span>
              <h3 className="mt-6 text-xl font-semibold text-azul">{ponto.titulo}</h3>
              <p className="mt-3 leading-relaxed text-texto-suave">{ponto.texto}</p>
            </article>
          ))}
        </div>
      </Secao>

      <Secao className="pb-20">
        <div className="rounded-3xl bg-azul p-10 text-white md:p-14">
          <h2 className="text-2xl font-bold">Cursos envolvidos</h2>
          <p className="mt-3 max-w-2xl text-white/80">
            A proposta reúne cursos das áreas de saúde, exatas e humanas, favorecendo a atuação interprofissional.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {CURSOS.map((curso) => (
              <li key={curso} className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium">
                {curso}
              </li>
            ))}
          </ul>
        </div>
      </Secao>

      <Secao className="pb-24 text-center">
        <p className="text-lg text-texto-suave">Quer conhecer o que cada grupo está fazendo?</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link href="/eixos" className="rounded-full bg-azul px-6 py-3 font-semibold text-white hover:bg-azul-2">Eixos temáticos</Link>
          <Link href="/grupos" className="rounded-full border border-azul px-6 py-3 font-semibold text-azul hover:bg-azul-claro">Grupos tutoriais</Link>
        </div>
      </Secao>
    </>
  );
}
