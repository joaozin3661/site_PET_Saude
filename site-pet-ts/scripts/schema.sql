-- Rode este arquivo uma vez no SQL Editor do Neon (ou com psql).
create table if not exists usuarios (
  id serial primary key,
  email text unique not null,
  nome text not null,
  senha_hash text not null,
  papel text not null default 'editor' check (papel in ('admin', 'editor')),
  criado_em timestamptz not null default now()
);

-- Banco que ja existia: rode isto uma vez para criar a coluna "papel".
alter table usuarios add column if not exists papel text not null default 'editor'
  check (papel in ('admin', 'editor'));

create table if not exists atividades (
  id text primary key,
  status text not null check (status in ('pendente', 'aprovado', 'recusado')),
  grupo int,
  titulo text not null,
  categoria text not null,
  data_evento date,
  resumo text not null,
  descricao text not null default '',
  contato text,
  criado_em timestamptz not null default now()
);

create table if not exists fotos (
  id text primary key,
  titulo text not null,
  descricao text not null default '',
  grupo int,
  url text not null,
  pathname text not null,
  criado_em timestamptz not null default now()
);

create table if not exists materiais (
  id text primary key,
  titulo text not null,
  descricao text not null default '',
  tipo text not null,
  url text not null,
  pathname text not null,
  nome_arquivo text not null,
  grupo int,
  criado_em timestamptz not null default now()
);

create table if not exists noticias (
  id text primary key,
  autor_id int references usuarios(id) on delete set null,
  autor_nome text not null,
  titulo text not null,
  resumo text not null default '',
  corpo text not null default '',
  capa_url text,
  capa_pathname text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

-- Banco que ja existia: rode isto uma vez para os recursos de grupos.
alter table materiais add column if not exists grupo int;

create table if not exists grupos_info (
  grupo int primary key,
  endereco text,
  tutor_lattes text,
  coordenador_lattes text
);

create table if not exists integrantes (
  id serial primary key,
  grupo int not null,
  nome text not null,
  lattes text,
  criado_em timestamptz not null default now()
);
create index if not exists integrantes_grupo_idx on integrantes (grupo);

-- Banco que ja existia: Lattes opcional por integrante.
alter table integrantes add column if not exists lattes text;
