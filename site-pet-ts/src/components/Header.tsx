"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/eixos", label: "Eixos" },
  { href: "/atividades", label: "Atividades" },
  { href: "/noticias", label: "Notícias" },
  { href: "/galeria", label: "Galeria" },
  { href: "/producao-tecnica", label: "Produção técnica" },
];

const APRESENTACAO = [
  { href: "/sobre", label: "Conheça o PET-Digital" },
  { href: "/grupos", label: "Grupos" },
  { href: "/equipe", label: "Equipe" },
];

function ativo(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const [apresentacaoAberta, setApresentacaoAberta] = useState(false);
  const apresentacaoAtiva = APRESENTACAO.some((item) => ativo(pathname, item.href));

  return (
    <header className="sticky top-0 z-40 border-b border-borda bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Página inicial">
          <Image src="/logo-pet-semfundo.png" alt="PET-Saúde Informação e Saúde Digital" width={56} height={56} priority className="h-14 w-auto" />
        </Link>

        <nav aria-label="Menu principal" className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                ativo(pathname, link.href) ? "bg-azul text-white" : "text-texto-suave hover:bg-azul-claro hover:text-azul"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="relative">
            <button
              type="button"
              aria-expanded={apresentacaoAberta}
              aria-controls="menu-apresentacao"
              onClick={() => setApresentacaoAberta((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
                apresentacaoAtiva ? "bg-azul text-white" : "text-texto-suave hover:bg-azul-claro hover:text-azul"
              }`}
            >
              Apresentação
              <span aria-hidden="true" className={`text-xs transition ${apresentacaoAberta ? "rotate-180" : ""}`}>▾</span>
            </button>
            {apresentacaoAberta && (
              <ul id="menu-apresentacao" className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-borda bg-white p-2 shadow-xl">
                {APRESENTACAO.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setApresentacaoAberta(false)}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                        ativo(pathname, item.href) ? "bg-azul-claro text-azul" : "text-texto hover:bg-azul-claro hover:text-azul"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link href="/acesso" className="rounded-full border border-azul px-4 py-2 text-sm font-semibold text-azul transition hover:bg-azul hover:text-white">
            Acesso restrito
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-azul md:hidden"
          aria-expanded={menuAberto}
          aria-controls="menu-mobile"
          onClick={() => setMenuAberto((v) => !v)}
        >
          <span className="sr-only">{menuAberto ? "Fechar menu" : "Abrir menu"}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {menuAberto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {menuAberto && (
        <nav id="menu-mobile" aria-label="Menu principal mobile" className="border-t border-borda bg-white px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setMenuAberto(false)} className="block rounded-lg px-3 py-3 font-medium text-azul hover:bg-azul-claro">
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="px-3 pt-3 text-xs font-semibold uppercase tracking-wider text-texto-suave">Apresentação</li>
            {APRESENTACAO.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setMenuAberto(false)} className="block rounded-lg px-3 py-3 pl-6 font-medium text-azul hover:bg-azul-claro">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/acesso" onClick={() => setMenuAberto(false)} className="block rounded-lg px-3 py-3 font-medium text-azul hover:bg-azul-claro">
                Acesso restrito
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
