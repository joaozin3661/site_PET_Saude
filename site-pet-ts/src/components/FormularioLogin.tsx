"use client";

import { useActionState } from "react";
import { entrar, type EstadoLogin } from "@/app/acesso/actions";

const campo = "mt-2 w-full rounded-xl border border-borda bg-white px-4 py-3 outline-none focus:border-azul-2 focus:ring-4 focus:ring-azul-2/15";

export default function FormularioLogin() {
  const [estado, acao, pendente] = useActionState<EstadoLogin, FormData>(entrar, {});

  return (
    <form action={acao} className="grid gap-5 rounded-3xl border border-borda bg-white p-8 shadow-sm">
      <label className="block">
        <span className="text-sm font-semibold text-azul">E-mail</span>
        <input name="email" type="email" required autoComplete="username" className={campo} />
      </label>
      <label className="block">
        <span className="text-sm font-semibold text-azul">Senha</span>
        <input name="senha" type="password" required autoComplete="current-password" className={campo} />
      </label>
      {estado.erro && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{estado.erro}</p>}
      <button type="submit" disabled={pendente} className="rounded-full bg-azul px-6 py-3 font-semibold text-white hover:bg-azul-2 disabled:opacity-60">
        {pendente ? "Entrando..." : "Entrar"}
      </button>
      <p className="text-xs text-texto-suave">Não tem acesso? Peça à equipe de comunicação.</p>
    </form>
  );
}
