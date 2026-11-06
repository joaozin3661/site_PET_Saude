import { connection } from "next/server";
import { db } from "./db";

export type Status = "pendente" | "aprovado" | "recusado";

// "geral" = só itens sem grupo (canal geral do site); número = só daquele grupo.
export type Escopo = "todos" | "geral" | number;
const FILTRO_ESCOPO = `($1::text = 'todos' or ($1::text = 'geral' and grupo is null) or grupo::text = $1::text)`;

export type Atividade = {
  id: string;
  status: Status;
  grupo: number | null;
  titulo: string;
  categoria: string;
  dataEvento: string | null;
  resumo: string;
  descricao: string;
  contato?: string;
  criadoEm: string;
};

export type Foto = {
  id: string;
  titulo: string;
  descricao: string;
  grupo: number | null;
  url: string;
  pathname: string;
  criadoEm: string;
};

export type Material = {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  url: string;
  pathname: string;
  nomeArquivo: string;
  grupo: number | null;
  criadoEm: string;
};

export type GrupoInfo = {
  grupo: number;
  endereco: string | null;
  tutorLattes: string | null;
  tutor2Lattes: string | null;
};

export type Integrante = { id: number; grupo: number; nome: string; lattes: string | null };

export type Noticia = {
  id: string;
  autorId: number | null;
  autorNome: string;
  titulo: string;
  resumo: string;
  corpo: string;
  capaUrl: string | null;
  capaPathname: string | null;
  criadoEm: string;
  atualizadoEm: string;
};

// Datas saem do Postgres já formatadas como texto ISO, para não lidar com objetos Date.
const COLUNAS_ATIVIDADE = `
  id, status, grupo, titulo, categoria,
  to_char(data_evento, 'YYYY-MM-DD') as "dataEvento",
  resumo, descricao, contato,
  to_char(criado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as "criadoEm"`;

export async function listarAtividadesPorStatus(status: Status, escopo: Escopo = "todos"): Promise<Atividade[]> {
  await connection();
  const sql = db();
  const rows = await sql.query(
    `select ${COLUNAS_ATIVIDADE} from atividades where status = $2 and ${FILTRO_ESCOPO} order by criado_em desc`,
    [String(escopo), status],
  );
  return rows as Atividade[];
}

export async function listarAprovadas(escopo: Escopo = "todos"): Promise<Atividade[]> {
  return listarAtividadesPorStatus("aprovado", escopo);
}

export async function buscarAtividade(id: string): Promise<Atividade | undefined> {
  await connection();
  const sql = db();
  const rows = await sql.query(
    `select ${COLUNAS_ATIVIDADE} from atividades where id = $1 and status = 'aprovado'`,
    [id],
  );
  return rows[0] as Atividade | undefined;
}

export async function salvarAtividade(atividade: Atividade): Promise<void> {
  const sql = db();
  await sql`insert into atividades (id, status, grupo, titulo, categoria, data_evento, resumo, descricao, contato)
    values (${atividade.id}, ${atividade.status}, ${atividade.grupo}, ${atividade.titulo}, ${atividade.categoria},
      ${atividade.dataEvento}, ${atividade.resumo}, ${atividade.descricao}, ${atividade.contato ?? null})`;
}

export async function definirStatusAtividade(id: string, status: Exclude<Status, "pendente">) {
  const sql = db();
  await sql`update atividades set status = ${status} where id = ${id}`;
}

export async function excluirAtividade(id: string) {
  const sql = db();
  await sql`delete from atividades where id = ${id}`;
}

export async function buscarFoto(id: string): Promise<Foto | undefined> {
  await connection();
  const sql = db();
  const rows = await sql`select id, titulo, descricao, grupo, url, pathname,
    to_char(criado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as "criadoEm"
    from fotos where id = ${id}`;
  return rows[0] as Foto | undefined;
}

export async function listarFotos(escopo: Escopo = "todos"): Promise<Foto[]> {
  await connection();
  const sql = db();
  const rows = await sql.query(
    `select id, titulo, descricao, grupo, url, pathname,
      to_char(criado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as "criadoEm"
      from fotos where ${FILTRO_ESCOPO} order by criado_em desc`,
    [String(escopo)],
  );
  return rows as Foto[];
}

export async function salvarFoto(foto: Omit<Foto, "criadoEm">) {
  const sql = db();
  await sql`insert into fotos (id, titulo, descricao, grupo, url, pathname)
    values (${foto.id}, ${foto.titulo}, ${foto.descricao}, ${foto.grupo}, ${foto.url}, ${foto.pathname})`;
}

export async function excluirFoto(id: string): Promise<string | undefined> {
  const sql = db();
  const rows = await sql`delete from fotos where id = ${id} returning url`;
  return rows[0]?.url as string | undefined;
}

export async function listarMateriais(escopo: Escopo = "todos"): Promise<Material[]> {
  await connection();
  const sql = db();
  const rows = await sql.query(
    `select id, titulo, descricao, tipo, url, pathname, nome_arquivo as "nomeArquivo", grupo,
      to_char(criado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as "criadoEm"
      from materiais where ${FILTRO_ESCOPO} order by tipo, criado_em desc`,
    [String(escopo)],
  );
  return rows as Material[];
}

export async function salvarMaterial(material: Omit<Material, "criadoEm">) {
  const sql = db();
  await sql`insert into materiais (id, titulo, descricao, tipo, url, pathname, nome_arquivo, grupo)
    values (${material.id}, ${material.titulo}, ${material.descricao}, ${material.tipo},
      ${material.url}, ${material.pathname}, ${material.nomeArquivo}, ${material.grupo})`;
}

export async function excluirMaterial(id: string): Promise<string | undefined> {
  const sql = db();
  const rows = await sql`delete from materiais where id = ${id} returning url`;
  return rows[0]?.url as string | undefined;
}

export async function buscarGrupoInfo(grupo: number): Promise<GrupoInfo | undefined> {
  await connection();
  const sql = db();
  const rows = await sql`select grupo, endereco, tutor_lattes as "tutorLattes", coordenador_lattes as "tutor2Lattes"
    from grupos_info where grupo = ${grupo}`;
  return rows[0] as GrupoInfo | undefined;
}

export async function salvarGrupoInfo(info: GrupoInfo) {
  const sql = db();
  await sql`insert into grupos_info (grupo, endereco, tutor_lattes, coordenador_lattes)
    values (${info.grupo}, ${info.endereco}, ${info.tutorLattes}, ${info.tutor2Lattes})
    on conflict (grupo) do update set endereco = excluded.endereco,
      tutor_lattes = excluded.tutor_lattes, coordenador_lattes = excluded.coordenador_lattes`;
}

export async function listarIntegrantes(grupo: number): Promise<Integrante[]> {
  await connection();
  const sql = db();
  const rows = await sql`select id, grupo, nome, lattes from integrantes where grupo = ${grupo} order by nome`;
  return rows as Integrante[];
}

export async function adicionarIntegrantes(grupo: number, pessoas: { nome: string; lattes: string | null }[]) {
  const sql = db();
  for (const p of pessoas) {
    await sql`insert into integrantes (grupo, nome, lattes) values (${grupo}, ${p.nome}, ${p.lattes})`;
  }
}

export async function atualizarLattesIntegrante(id: number, lattes: string | null) {
  const sql = db();
  await sql`update integrantes set lattes = ${lattes} where id = ${id}`;
}

export async function excluirIntegrante(id: number) {
  const sql = db();
  await sql`delete from integrantes where id = ${id}`;
}

const COLUNAS_NOTICIA = `
  id, autor_id as "autorId", autor_nome as "autorNome", titulo, resumo, corpo,
  capa_url as "capaUrl", capa_pathname as "capaPathname",
  to_char(criado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as "criadoEm",
  to_char(atualizado_em at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as "atualizadoEm"`;

export async function listarNoticias(): Promise<Noticia[]> {
  await connection();
  const sql = db();
  const rows = await sql.query(`select ${COLUNAS_NOTICIA} from noticias order by criado_em desc`);
  return rows as Noticia[];
}

export async function buscarNoticia(id: string): Promise<Noticia | undefined> {
  await connection();
  const sql = db();
  const rows = await sql.query(`select ${COLUNAS_NOTICIA} from noticias where id = $1`, [id]);
  return rows[0] as Noticia | undefined;
}

export async function salvarNoticiaNova(noticia: Omit<Noticia, "criadoEm" | "atualizadoEm">) {
  const sql = db();
  await sql`insert into noticias (id, autor_id, autor_nome, titulo, resumo, corpo, capa_url, capa_pathname)
    values (${noticia.id}, ${noticia.autorId}, ${noticia.autorNome}, ${noticia.titulo}, ${noticia.resumo},
      ${noticia.corpo}, ${noticia.capaUrl}, ${noticia.capaPathname})`;
}

// Só o autor pode alterar a própria notícia.
export async function atualizarNoticia(
  id: string,
  autorId: number,
  campos: { titulo: string; resumo: string; corpo: string; capaUrl: string | null; capaPathname: string | null },
): Promise<boolean> {
  const sql = db();
  const rows = await sql`update noticias set titulo = ${campos.titulo}, resumo = ${campos.resumo}, corpo = ${campos.corpo},
    capa_url = ${campos.capaUrl}, capa_pathname = ${campos.capaPathname}, atualizado_em = now()
    where id = ${id} and autor_id = ${autorId} returning id`;
  return rows.length > 0;
}

// Devolve a URL da capa para apagar o arquivo no Blob. Só o autor pode excluir
// (autorId = null exclui sem checar o autor, para administradores).
export async function excluirNoticia(id: string, autorId: number | null): Promise<string | null | undefined> {
  const sql = db();
  const rows = await sql`delete from noticias where id = ${id} and (${autorId}::int is null or autor_id = ${autorId}) returning capa_url`;
  if (rows.length === 0) return undefined;
  return rows[0].capa_url as string | null;
}
