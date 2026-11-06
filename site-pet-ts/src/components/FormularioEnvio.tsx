"use client";

import { useState, type FormEvent } from "react";
import { CATEGORIAS, GRUPOS } from "@/lib/content";

const campo =
  "mt-2 w-full rounded-xl border border-borda bg-white px-4 py-3 text-texto outline-none transition focus:border-azul-2 focus:ring-4 focus:ring-azul-2/15";
const rotulo = "text-sm font-semibold text-azul";

export default function FormularioEnvio() {
  const [status, setStatus] = useState<"ocioso" | "enviando" | "ok" | "erro">("ocioso");
  const [mensagem, setMensagem] = useState("");

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const form = evento.currentTarget;
    const dados = Object.fromEntries(new FormData(form).entries());

    setStatus("enviando");
    setMensagem("");
    try {
      const resposta = await fetch("/api/atividades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const json = await resposta.json();
      if (!resposta.ok) {
        setStatus("erro");
        setMensagem(json.erro ?? "Não foi possível enviar.");
        return;
      }
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("erro");
      setMensagem("Sem conexão com o servidor. Tente novamente.");
    }
  }

  if (status === "ok") {
    return (
      <div className="mt-12 rounded-2xl bg-verde p-8 text-center">
        <h2 className="text-xl font-semibold text-azul">Recebemos sua atividade</h2>
        <p className="mt-3 text-texto-suave">Ela será publicada depois da revisão da equipe de comunicação.</p>
        <button type="button" onClick={() => setStatus("ocioso")} className="mt-6 font-semibold text-azul-2 hover:underline">
          Enviar outra atividade
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="mt-12 space-y-7 rounded-3xl border border-borda bg-white p-8 shadow-sm md:p-10">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className={rotulo}>Grupo</span>
          <select name="grupo" defaultValue="" className={campo}>
            <option value="">Comunicação / geral do PET (aparece no site todo)</option>
            {GRUPOS.map((g) => (
              <option key={g.numero} value={g.numero}>GT {g.numero}: {g.unidade} (só na página do grupo)</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={rotulo}>Tipo de atividade</span>
          <select name="categoria" required defaultValue="" className={campo}>
            <option value="" disabled>Escolha uma opção</option>
            {CATEGORIAS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className={rotulo}>Título</span>
        <input name="titulo" required maxLength={140} className={campo} placeholder="Ex.: Oficina de letramento digital na UBS" />
      </label>

      <label className="block">
        <span className={rotulo}>Data do evento</span>
        <input name="dataEvento" type="date" className={campo} />
        <span className="mt-1 block text-xs text-texto-suave">Deixe em branco se for um registro sem data específica.</span>
      </label>

      <label className="block">
        <span className={rotulo}>Resumo</span>
        <textarea name="resumo" required rows={2} maxLength={300} className={campo} placeholder="Uma ou duas frases para o cartão da atividade." />
      </label>

      <label className="block">
        <span className={rotulo}>Descrição completa</span>
        <textarea name="descricao" rows={6} maxLength={4000} className={campo} placeholder="O que foi feito, quem participou, onde aconteceu, resultados." />
      </label>

      <label className="block">
        <span className={rotulo}>Contato para dúvidas (opcional)</span>
        <input name="contato" maxLength={120} className={campo} placeholder="E-mail ou telefone da pessoa responsável" />
        <span className="mt-1 block text-xs text-texto-suave">Não será exibido no site.</span>
      </label>

      {status === "erro" && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{mensagem}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-borda pt-7">
        <p className="max-w-sm text-xs leading-relaxed text-texto-suave">
          Não envie dados pessoais sensíveis, como CPF, prontuário ou endereço de usuários.
        </p>
        <button
          type="submit"
          disabled={status === "enviando"}
          className="rounded-full bg-laranja px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-laranja-escuro disabled:opacity-60"
        >
          {status === "enviando" ? "Enviando..." : "Enviar para revisão"}
        </button>
      </div>
    </form>
  );
}
