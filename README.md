# Portal PET-Saúde Digital UFPI/FMS

Site de divulgação do PET-Saúde: Informação e Saúde Digital, em Teresina.

## Estrutura do repositório

| Pasta | O que é |
|---|---|
| [`site-pet-ts/`](site-pet-ts) | **Site atual** (Next.js + TypeScript), publicado na Vercel. Banco no Neon e arquivos no Vercel Blob. Instruções de uso e de deploy em [`site-pet-ts/README.md`](site-pet-ts/README.md). |
| [`flask-antigo/`](flask-antigo) | Protótipo anterior em Flask, mantido só como arquivo. |

## Publicação (Vercel)

Ao importar este repositório na Vercel, defina **Root Directory** como `site-pet-ts`.

## Protótipo antigo (Flask)

```bash
cd flask-antigo
python -m venv .venv
.venv\Scripts\activate   # Windows PowerShell
pip install -r requirements.txt
python app.py
```

Acesse: http://127.0.0.1:5000

Atenção: não publique PDFs com CPF, matrícula, endereço, prontuário, ficha de atendimento
ou qualquer dado sensível.
