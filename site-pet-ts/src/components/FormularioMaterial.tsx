"use client";

import { upload } from "@vercel/blob/client";
import { useRef, useState, type FormEvent } from "react";
import { cadastrarMaterial } from "@/app/painel/actions";
import { GRUPOS } from "@/lib/content";

const campo = "mt-2 w-full rounded-xl border border-borda bg-white px-4 py-3 outline-none focus:border-azul-2 focus:ring-4 focus:ring-azul-2/15";
const TIPOS = ["Relatório", "Apresentação", "Edital", "Manual", "Publicação", "Outro"];

export default function FormularioMaterial() {
  const arquivo = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"ocioso" | "enviando" | "erro" | "ok">("ocioso");
  const [mensagem, setMensagem] = useState("");

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const form = evento.currentTarget;
    const file = arquivo.current?.files?.[0];
    if (!file) {
      setStatus("erro");
      setMensagem("Escolha um arquivo.");
      return;
    }

    setStatus("enviando");
    setMensagem("Enviando o arquivo...");
    try {
      const enviado = await upload(`materiais/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/blob/upload",
        contentType: file.type,
      });

      const dados = new FormData(form);
      dados.set("url", enviado.url);
      dados.set("pathname", enviado.pathname);
      dados.set("nomeArquivo", file.name);
      dados.delete("arquivo");
      await cadastrarMaterial(dados);

      form.reset();
      setStatus("ok");
      setMensagem("Material publicado.");
    } catch (erro) {
      setStatus("erro");
      setMensagem((erro as Error).message || "Não foi possível enviar o arquivo.");
    }
  }

  return (
    <form onSubmit={enviar} className="grid gap-5 rounded-2xl border border-borda bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-azul">Novo material</h2>
      <label className="block">
        <span className="text-sm font-semibold text-azul">Arquivo (PDF, DOCX ou PPTX, até 50 MB)</span>
        <input
          ref={arquivo}
          name="arquivo"
          type="file"
          accept="application/pdf,.docx,.pptx"
          required
          className={campo}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-azul">Título</span>
        <input name="titulo" required maxLength={140} className={campo} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-azul">Tipo</span>
        <select name="tipo" required defaultValue="" className={campo}>
          <option value="" disabled>Escolha uma opção</option>
          {TIPOS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-azul">Descrição (opcional)</span>
        <textarea name="descricao" rows={2} maxLength={600} className={campo} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-azul">Onde publicar</span>
        <select name="grupo" defaultValue="" className={campo}>
          <option value="">Canal geral (aparece no site todo)</option>
          {GRUPOS.map((g) => (
            <option key={g.numero} value={g.numero}>Só na página do GT {g.numero}</option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p role="status" className={`text-sm ${status === "erro" ? "text-red-700" : "text-texto-suave"}`}>{mensagem}</p>
        <button type="submit" disabled={status === "enviando"} className="rounded-full bg-laranja px-6 py-3 font-semibold text-white disabled:opacity-60">
          Publicar material
        </button>
      </div>
    </form>
  );
}
