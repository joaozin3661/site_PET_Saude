import ReactMarkdown, { type Components } from "react-markdown";

// react-markdown não renderiza HTML cru, então o conteúdo digitado não injeta scripts.
const componentes: Components = {
  h2: ({ children }) => <h2 className="mb-4 mt-12 text-2xl font-bold text-azul">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-3 mt-8 text-xl font-semibold text-azul">{children}</h3>,
  p: ({ children }) => <p className="my-5 text-lg leading-relaxed text-texto">{children}</p>,
  ul: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-6 text-lg text-texto">{children}</ul>,
  ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-6 text-lg text-texto">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="my-8 rounded-r-2xl border-l-4 border-laranja bg-white px-6 py-4 italic text-texto-suave">{children}</blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-azul-2 underline underline-offset-4">
      {children}
    </a>
  ),
  // O texto entre [ ] vira legenda abaixo da foto; clicar abre a imagem inteira.
  img: ({ src, alt }) => {
    const legenda = alt?.trim();
    const imagem = typeof src === "string" ? src : undefined;
    return (
      <span className="my-8 block">
        <a href={imagem} target="_blank" rel="noopener noreferrer" className="block">
          <img src={imagem} alt={legenda ?? ""} loading="lazy" className="w-full rounded-2xl object-cover shadow-lg" />
        </a>
        {legenda && <span className="mt-3 block text-center text-sm italic text-texto-suave">{legenda}</span>}
      </span>
    );
  },
};

export default function Markdown({ texto }: { texto: string }) {
  return <ReactMarkdown components={componentes}>{texto}</ReactMarkdown>;
}
