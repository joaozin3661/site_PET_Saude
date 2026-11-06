"use client";

import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import Markdown from "@/components/Markdown";
import { salvarNoticia } from "@/app/painel/noticias/actions";
import type { Noticia } from "@/lib/store";

const campo = "mt-2 w-full rounded-xl border border-borda bg-white px-4 py-3 outline-none focus:border-azul-2 focus:ring-4 focus:ring-azul-2/15";

type Props = { noticia?: Noticia };

export default function EditorNoticia({ noticia }: Props) {
  const corpo = useRef<HTMLTextAreaElement>(null);
  const inputImagem = useRef<HTMLInputElement>(null);
  const inputCapa = useRef<HTMLInputElement>(null);
  const [texto, setTexto] = useState(noticia?.corpo ?? "");
  const [capa, setCapa] = useState<{ url: string; pathname: string } | null>(
    noticia?.capaUrl && noticia.capaPathname ? { url: noticia.capaUrl, pathname: noticia.capaPathname } : null,
  );
  const [visualizar, setVisualizar] = useState(false);
  const [status, setStatus] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviarArquivo(file: File, pasta: string) {
    return upload(`${pasta}/${file.name}`, file, {
      access: "public",
      handleUploadUrl: "/api/blob/upload",
      contentType: file.type,
    });
  }

  // Aceita várias fotos de uma vez. Cada uma entra no ponto do cursor, uma abaixo da outra.
  async function inserirImagens(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(evento.target.files ?? []);
    evento.target.value = "";
    if (arquivos.length === 0) return;

    const area = corpo.current;
    const inicio = area?.selectionStart ?? texto.length;
    const fim = area?.selectionEnd ?? texto.length;
    const trechos: string[] = [];
    let falhas = 0;

    for (const [i, file] of arquivos.entries()) {
      setStatus(`Enviando imagem ${i + 1} de ${arquivos.length}...`);
      try {
        const enviado = await enviarArquivo(file, "noticias/imagens");
        trechos.push(`![](${enviado.url})`);
      } catch {
        falhas += 1;
      }
    }

    if (trechos.length > 0) {
      setTexto((atual) => atual.slice(0, inicio) + `\n\n${trechos.join("\n\n")}\n\n` + atual.slice(fim));
    }
    setStatus(
      falhas > 0
        ? `${trechos.length} imagem(ns) inserida(s); ${falhas} não foi possível enviar.`
        : `${trechos.length} imagem(ns) inserida(s). Para pôr legenda, escreva entre os colchetes [ ] e clique em Visualizar.`,
    );
  }

  async function enviarCapa(evento: React.ChangeEvent<HTMLInputElement>) {
    const file = evento.target.files?.[0];
    evento.target.value = "";
    if (!file) return;

    setStatus("Enviando capa...");
    try {
      const enviado = await enviarArquivo(file, "noticias/capas");
      setCapa({ url: enviado.url, pathname: enviado.pathname });
      setStatus("Capa enviada.");
    } catch (erro) {
      setStatus((erro as Error).message || "Não foi possível enviar a capa.");
    }
  }

  async function aoSalvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEnviando(true);
    try {
      const dados = new FormData(evento.currentTarget);
      dados.set("corpo", texto);
      dados.set("capaUrl", capa?.url ?? "");
      dados.set("capaPathname", capa?.pathname ?? "");
      await salvarNoticia(dados);
    } catch (erro) {
      setStatus((erro as Error).message);
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={aoSalvar} className="grid gap-6">
      {noticia && <input type="hidden" name="id" value={noticia.id} />}

      <label className="block">
        <span className="text-sm font-semibold text-azul">Título</span>
        <input name="titulo" required maxLength={160} defaultValue={noticia?.titulo ?? ""} className={campo} />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-azul">Resumo (aparece nos cartões)</span>
        <textarea name="resumo" rows={2} maxLength={300} defaultValue={noticia?.resumo ?? ""} className={campo} />
      </label>

      <div>
        <span className="text-sm font-semibold text-azul">Imagem de capa</span>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          {capa ? (
            <Image src={capa.url} alt="" width={240} height={135} className="h-24 w-40 rounded-xl object-cover" />
          ) : (
            <span className="text-sm text-texto-suave">Nenhuma capa escolhida.</span>
          )}
          <button type="button" onClick={() => inputCapa.current?.click()} className="rounded-full border border-azul px-4 py-2 text-sm font-semibold text-azul hover:bg-azul-claro">
            {capa ? "Trocar capa" : "Escolher capa"}
          </button>
          {capa && (
            <button type="button" onClick={() => setCapa(null)} className="text-sm font-semibold text-red-700 hover:underline">
              Remover capa
            </button>
          )}
          <input ref={inputCapa} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={enviarCapa} />
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-semibold text-azul">Texto da notícia</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => inputImagem.current?.click()} className="rounded-full bg-azul px-4 py-2 text-sm font-semibold text-white hover:bg-azul-2">
              Inserir fotos
            </button>
            <button type="button" onClick={() => setVisualizar((v) => !v)} className="rounded-full border border-borda px-4 py-2 text-sm font-semibold text-texto-suave hover:bg-white">
              {visualizar ? "Editar" : "Visualizar"}
            </button>
          </div>
          <input ref={inputImagem} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={inserirImagens} />
        </div>

        {visualizar ? (
          <div className="mt-3 min-h-64 rounded-2xl border border-borda bg-white p-6">
            {texto.trim() ? <Markdown texto={texto} /> : <p className="text-texto-suave">Nada escrito ainda.</p>}
          </div>
        ) : (
          <textarea
            ref={corpo}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={18}
            maxLength={30000}
            placeholder={"Escreva a notícia aqui.\n\nUse uma linha em branco para separar parágrafos.\n## Subtítulo\n**negrito**, *itálico*, - lista"}
            className={`${campo} font-mono text-sm leading-relaxed`}
          />
        )}
        <p className="mt-2 text-xs text-texto-suave">
          Fotos: clique em “Inserir fotos” (pode escolher várias) e elas entram no ponto onde está o cursor. A legenda vai entre os colchetes: ![sua legenda](...).
          Formatação: ## subtítulo, **negrito**, *itálico*, - lista, [texto do link](https://...).
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-borda pt-6">
        <p role="status" className="text-sm text-texto-suave">{status}</p>
        <button type="submit" disabled={enviando} className="rounded-full bg-laranja px-8 py-3 font-semibold text-white hover:bg-laranja-escuro disabled:opacity-60">
          {enviando ? "Publicando..." : noticia ? "Salvar alterações" : "Publicar notícia"}
        </button>
      </div>
    </form>
  );
}
