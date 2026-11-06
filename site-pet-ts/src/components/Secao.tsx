import type { ReactNode } from "react";

export function Secao({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>{children}</section>;
}

export function Cabecalho({ eyebrow, titulo, texto }: { eyebrow: string; titulo: string; texto?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-laranja">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-azul sm:text-4xl">{titulo}</h2>
      {texto && <p className="mt-4 text-lg leading-relaxed text-texto-suave">{texto}</p>}
    </div>
  );
}
