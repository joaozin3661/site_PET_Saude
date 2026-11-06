import type { Metadata } from "next";
import Image from "next/image";
import { Cabecalho } from "@/components/Secao";
import BotaoRemover from "@/components/BotaoRemover";
import FormularioFoto from "@/components/FormularioFoto";
import { exigirUsuario } from "@/lib/auth";
import { listarFotos } from "@/lib/store";
import { removerFoto } from "../actions";

export const instant = false;

export const metadata: Metadata = { title: "Painel · Galeria" };

export default async function PainelFotos() {
  const usuario = await exigirUsuario();
  const fotos = await listarFotos();

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
      <FormularioFoto />
      <div>
        <Cabecalho eyebrow="Galeria" titulo={`${fotos.length} foto${fotos.length === 1 ? "" : "s"} publicada${fotos.length === 1 ? "" : "s"}`} />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {fotos.map((f) => (
            <li key={f.id} className="overflow-hidden rounded-2xl border border-borda bg-white shadow-sm">
              <Image src={f.url} alt={f.titulo} width={600} height={450} className="aspect-[4/3] w-full object-cover" />
              <div className="flex items-center justify-between gap-3 p-4">
                <p className="truncate font-semibold text-azul">{f.titulo} <span className="text-xs font-normal text-texto-suave">· {f.grupo ? `GT ${f.grupo}` : "Geral"}</span></p>
                {usuario.papel === "admin" && <BotaoRemover acao={removerFoto} id={f.id} />}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
