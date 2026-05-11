# Portal PET-Saúde Digital UFPI/FMS

Projeto em Flask para divulgação do PET-Saúde: Informação e Saúde Digital em Teresina.

## Como rodar localmente

```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows PowerShell
pip install -r requirements.txt
python app.py
```

Acesse: http://127.0.0.1:5000

## Acesso restrito do protótipo

Usuários padrão para teste:

- usuário: `coordenacao` / senha: `1`
- usuário: `admin_ubs` / senha: `fms_teresina`
- usuário: `monitor_pet` / senha: `ufpi_digital`

Para produção, troque as senhas por variáveis de ambiente:

```bash
export SECRET_KEY="uma-chave-segura"
export SENHA_COORDENACAO="nova-senha"
export SENHA_ADMIN_UBS="nova-senha"
export SENHA_MONITOR_PET="nova-senha"
```

## Estrutura de páginas

- Início
- Apresentação
- Equipe
- Eixos temáticos
- Notícias
- Banco de fotos
- Materiais
- Acesso restrito / Uploads

## Observações importantes

- Fotos enviadas pelo painel aparecem automaticamente no Banco de fotos.
- Todos os arquivos enviados aparecem na Biblioteca de materiais.
- Não publique PDFs com CPF, matrícula, endereço, prontuário, ficha de atendimento ou qualquer dado sensível.
- A aba sobre o **Meu SUS Digital** pode ser adicionada depois como uma página própria, aproveitando o mesmo padrão visual das páginas atuais.
