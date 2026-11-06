"use client";

import { useTransition } from "react";

export default function BotaoRemover({ acao, id, rotulo = "Remover" }: { acao: (id: string) => Promise<void>; id: string; rotulo?: string }) {
  const [pendente, iniciar] = useTransition();

  return (
    <button
      type="button"
      disabled={pendente}
      onClick={() => {
        if (window.confirm("Remover este item? Essa ação não pode ser desfeita.")) {
          iniciar(() => acao(id));
        }
      }}
      className="rounded-full border border-red-200 px-4 py-1.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
    >
      {pendente ? "Removendo..." : rotulo}
    </button>
  );
}
