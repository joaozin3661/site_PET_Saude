# PET-Saúde Digital · Portal (versão TypeScript)

Next.js (App Router) + TypeScript + Tailwind. Hospedagem no Vercel (plano gratuito),
banco de dados no Neon (Postgres gratuito) e arquivos no Vercel Blob.
O protótipo Flask continua na raiz do repositório e não foi alterado.

## Configuração (uma vez)

1. **Neon:** crie um projeto (ou use a integração Neon dentro do Vercel). Copie a
   string de conexão `DATABASE_URL`. No SQL Editor do Neon, cole e rode o conteúdo de
   `scripts/schema.sql`.
2. **Vercel Blob:** no projeto do Vercel, crie um Blob store **público** e copie o
   `BLOB_READ_WRITE_TOKEN`.
3. **Chave de sessão:** gere uma string aleatória com pelo menos 32 caracteres e use em
   `SESSION_SECRET`.
4. Cadastre as variáveis no Vercel (Settings → Environment Variables) e, para rodar
   localmente, num arquivo `.env.local` (modelo em `.env.example`).
5. Crie os usuários da equipe (máximo previsto: 50):

```bash
node --env-file=.env.local scripts/criar-usuario.mjs email@exemplo.com "Nome" senha-com-8-ou-mais
```

Rodar de novo com o mesmo e-mail troca a senha.

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:3000
```

## O que existe

- **Público:** início, Conheça o PET-Digital, Eixos, Grupos, Equipe (tutores e coordenação),
  Atividades, Galeria, Produção técnica e formulário de envio (`/enviar`).
- **Acesso restrito (`/acesso`):** login por e-mail e senha. Depois de entrar, o painel
  (`/painel`) permite:
  - aprovar ou recusar atividades enviadas pelos grupos;
  - publicar e remover fotos da galeria;
  - publicar e remover materiais da produção técnica.
- Senhas são guardadas com scrypt. A sessão é um cookie assinado, válido por 7 dias.

## Observações

- Uploads vão direto para o Vercel Blob, sem passar pela função do Vercel. Limite: 50 MB.
- Tipos aceitos: JPG, PNG e WebP (fotos); PDF, DOCX e PPTX (materiais).
- Não publique documentos com CPF, matrícula ou dados de usuários.
- Não há limite de tentativas no login. Com até 50 usuários, vale adicionar isso depois.
- `cacheComponents` está ativo em `next.config.ts`. Por isso as páginas com dados usam
  `export const instant = false`.
- Um grupo inexistente (ex.: `/grupos/99`) mostra a página de 404, mas com status 200.
