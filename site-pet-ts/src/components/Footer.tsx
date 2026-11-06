import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 bg-azul text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">PET-Saúde Informação e Saúde Digital</p>
          <p className="mt-3 text-sm leading-relaxed text-white/75">
            Universidade Federal do Piauí · Fundação Municipal de Saúde de Teresina
          </p>
        </div>
        <nav aria-label="Rodapé" className="flex flex-col gap-2 text-sm text-white/80">
          <Link href="/sobre" className="hover:text-white">Conheça o PET-Digital</Link>
          <Link href="/equipe" className="hover:text-white">Equipe</Link>
          <Link href="/eixos" className="hover:text-white">Eixos temáticos</Link>
          <Link href="/grupos" className="hover:text-white">Grupos tutoriais</Link>
          <Link href="/atividades" className="hover:text-white">Atividades</Link>
        </nav>
        <p className="text-sm leading-relaxed text-white/60">
          Site de divulgação das ações, materiais e registros do projeto. Para enviar uma atividade, entre na área restrita.
        </p>
      </div>
    </footer>
  );
}
