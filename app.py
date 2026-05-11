from flask import Flask, render_template, request, redirect, url_for, session, flash, send_from_directory
import os
import json
from werkzeug.utils import secure_filename

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
METADATA_FILE = os.path.join(UPLOAD_FOLDER, 'metadata.json')

ALLOWED_EXTENSIONS = {'pdf', 'mp4', 'png', 'jpg', 'jpeg', 'webp'}
IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'troque_esta_chave_em_producao')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 64 * 1024 * 1024  # 64 MB


# Protótipo de autenticação.
# Para produção, mover usuários para banco de dados e usar hash de senha.
USUARIOS_AUTORIZADOS = {
    'coordenacao': os.environ.get('SENHA_COORDENACAO', '1'),
    'admin_ubs': os.environ.get('SENHA_ADMIN_UBS', 'fms_teresina'),
    'monitor_pet': os.environ.get('SENHA_MONITOR_PET', 'ufpi_digital'),
}


CURSOS = [
    'Ciências da Computação', 'Comunicação Social/Jornalismo', 'Direito',
    'Educação Física', 'Enfermagem', 'Serviço Social',
    'Engenharia Cartográfica e de Agrimensura', 'Engenharia de Produção',
    'Engenharia Elétrica', 'Farmácia', 'Medicina', 'Nutrição', 'Odontologia'
]


EIXOS = [
    {
        'numero': 1,
        'titulo': 'Cultura de saúde digital, formação e educação permanente em saúde',
        'resumo': 'Promove o letramento digital, a educação permanente e o uso ético das tecnologias digitais por usuários, estudantes, trabalhadores e gestores do SUS.',
        'acoes': [
            'Letramento digital de usuários',
            'Formação de ACS, trabalhadores e gestores',
            'Proteção de dados pessoais e sensíveis',
            'Educação permanente em saúde digital'
        ],
        'grupos': ['GT 1', 'GT 2', 'GT 10']
    },
    {
        'numero': 2,
        'titulo': 'Soluções tecnológicas e serviços de saúde digital no âmbito do SUS',
        'resumo': 'Reúne ações voltadas à telessaúde, monitoramento remoto, acompanhamento de fluxos, gestão de equipes, insumos e encaminhamentos.',
        'acoes': [
            'Protocolos para telessaúde',
            'Monitoramento remoto pós-atendimento',
            'Gestão de equipes e ACS',
            'Gestão de insumos e regulação'
        ],
        'grupos': ['GT 3', 'GT 4', 'GT 5', 'GT 6', 'GT 7']
    },
    {
        'numero': 3,
        'titulo': 'Interoperabilidade, análise e disseminação de dados e informações de saúde',
        'resumo': 'Fortalece o uso de dados para a tomada de decisão, a construção de painéis de monitoramento e a comunicação qualificada com usuários e profissionais.',
        'acoes': [
            'Coleta e análise de dados',
            'Painéis interativos',
            'Comunicação social para engajamento',
            'Disseminação segura de informações'
        ],
        'grupos': ['GT 8', 'GT 9']
    }
]


GRUPOS_TUTORIAIS = [
    {
        'numero': 1,
        'titulo': 'Letramento para usuários dos serviços digitais do SUS',
        'descricao': 'Promove o acesso do cidadão à cultura digital, com formação para uso de serviços como agendamentos, exames, histórico médico e verificação de indicadores.',
        'tutor': 'Joana de Moraes Souza Machado',
        'coordenador': 'Léia Lima Soares',
        'ubs': 'CAPS AD Sul (S)'
    },
    {
        'numero': 2,
        'titulo': 'Formação digital para ACS, trabalhadores da Rede de Atenção à Saúde e gestores das UBS',
        'descricao': 'Forma ACS, trabalhadores e gestores no uso de ferramentas digitais, registro de atendimentos, relatórios, integração digital e proteção de dados.',
        'tutor': 'Christianne Matos Paiva',
        'coordenador': 'Mauriceia Ligia Neves da Costa Carneiro',
        'ubs': 'CAPS II (S)'
    },
    {
        'numero': 3,
        'titulo': 'Protocolos clínicos para qualidade e segurança na telessaúde',
        'descricao': 'Aperfeiçoa protocolos clínicos padronizados para atendimentos remotos, assegurando qualidade e segurança na telessaúde.',
        'tutor': 'Ivan Saraiva Silva',
        'coordenador': 'Patrícia Viana',
        'ubs': 'Nova Teresina'
    },
    {
        'numero': 4,
        'titulo': 'Monitoramento remoto pós-atendimento da equipe do SUS',
        'descricao': 'Implementa soluções tecnológicas digitais para acompanhar pacientes após consultas, procedimentos ou outras demandas da APS.',
        'tutor': 'José Medeiros',
        'coordenador': 'Adriana de Azevedo Paiva',
        'ubs': 'Morada do Sol (L)'
    },
    {
        'numero': 5,
        'titulo': 'Monitoramento da gestão dos profissionais da equipe e ACS',
        'descricao': 'Aprimora sistemas para gestão das equipes de saúde e ACS, distribuição de tarefas, produtividade e acompanhamento de linhas de cuidado.',
        'tutor': 'Francisco Rafael Campos de Macedo',
        'coordenador': 'Carla Solange de Melo Escócio Dourado',
        'ubs': 'Mafrense (N)'
    },
    {
        'numero': 6,
        'titulo': 'Acompanhamento e monitoramento da gestão de insumos',
        'descricao': 'Implementa tecnologia digital para rastrear uso e disponibilidade de insumos, racionalizando recursos e prevenindo desabastecimentos.',
        'tutor': 'Maria do Socorro Ferreira dos Santos',
        'coordenador': 'Jéssica Pereira Costa',
        'ubs': 'Buenos Aires (N)'
    },
    {
        'numero': 7,
        'titulo': 'Acompanhamento e monitoramento da regulação e do matriciamento',
        'descricao': 'Desenvolve soluções digitais para otimizar encaminhamentos entre pontos de atenção, garantindo continuidade do cuidado.',
        'tutor': 'José Rodrigues Torres Neto',
        'coordenador': 'Cacilda Castelo Branco Lima',
        'ubs': 'Vale do Gavião/Ceci Fortes (prótese)'
    },
    {
        'numero': 8,
        'titulo': 'Formação no SUS Digital para coleta e uso de dados na gestão',
        'descricao': 'Forma profissionais na coleta, análise e uso de dados, com foco em proteção de dados, painéis interativos e modelos preditivos.',
        'tutor': 'José Maria P. de Menezes Jr',
        'coordenador': 'Ivone Freire de Oliveira Costa Nunes',
        'ubs': 'Memorare (N)'
    },
    {
        'numero': 9,
        'titulo': 'Comunicação social para engajamento de usuários e profissionais',
        'descricao': 'Desenvolve estratégias de comunicação para incentivar o uso das plataformas digitais do SUS e aproximar usuários e profissionais.',
        'tutor': 'Nayra Veras de Araújo',
        'coordenador': 'Fábio Rodrigues Trindade',
        'ubs': 'Ininga (L)'
    },
    {
        'numero': 10,
        'titulo': 'Formação no SUS Digital para profissionais da equipe',
        'descricao': 'Aperfeiçoa equipes de saúde no uso das plataformas digitais, incluindo PEC, telemedicina e monitoramento remoto.',
        'tutor': 'Felipe Ferreira Monteiro',
        'coordenador': 'Vânia Silva Macedo Orsano',
        'ubs': 'Parque Universitário (L)'
    },
]


NOTICIAS = [
    {
        'data': 'Julho de 2025',
        'categoria': 'Projeto',
        'titulo': 'PET-Saúde Digital inicia atividades nos cenários de prática',
        'resumo': 'Grupos tutoriais organizam ações em unidades da rede SUS de Teresina, com foco em formação, inovação e integração ensino-serviço-comunidade.'
    },
    {
        'data': 'Agosto de 2025',
        'categoria': 'Grupos Tutoriais',
        'titulo': 'Grupos definem frentes de trabalho em saúde digital',
        'resumo': 'As equipes atuarão em letramento digital, telessaúde, monitoramento remoto, gestão de insumos, análise de dados e comunicação social.'
    },
    {
        'data': 'Em atualização',
        'categoria': 'Galeria',
        'titulo': 'Banco de fotos reunirá registros das ações nas UBS',
        'resumo': 'Fotos de encontros, oficinas, visitas técnicas e ações dos GTs poderão ser publicadas após autorização e curadoria da equipe.'
    },
]


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def list_uploads(only_images=False):
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        return []

    files = []

    for filename in sorted(os.listdir(app.config['UPLOAD_FOLDER']), key=str.lower):
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        if not os.path.isfile(path):
            continue

        ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''

        if only_images and ext not in IMAGE_EXTENSIONS:
            continue

        if not only_images and ext not in ALLOWED_EXTENSIONS:
            continue

        files.append(filename)

    return files


def load_metadata():
    if not os.path.exists(METADATA_FILE):
        return {}

    try:
        with open(METADATA_FILE, 'r', encoding='utf-8') as file:
            return json.load(file)
    except json.JSONDecodeError:
        return {}


def save_metadata(metadata):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    with open(METADATA_FILE, 'w', encoding='utf-8') as file:
        json.dump(metadata, file, ensure_ascii=False, indent=4)


@app.route('/')
def index():
    return render_template(
        'index.html',
        eixos=EIXOS,
        grupos=GRUPOS_TUTORIAIS,
        noticias=NOTICIAS[:2]
    )


@app.route('/apresentacao')
def apresentacao():
    return redirect(url_for('conheca_pet'))


@app.route('/apresentacao/conheca-pet')
def conheca_pet():
    return render_template('conheca_pet.html', cursos=CURSOS)


@app.route('/apresentacao/grupos')
def grupos():
    return render_template(
        'grupos.html',
        eixos=EIXOS,
        grupos=GRUPOS_TUTORIAIS
    )


@app.route('/apresentacao/equipe')
def equipe():
    return render_template('equipe.html')


@app.route('/sobre')
def sobre():
    return redirect(url_for('apresentacao'))


@app.route('/eixos')
def eixos():
    return render_template(
        'eixos.html',
        eixos=EIXOS,
        grupos=GRUPOS_TUTORIAIS
    )


@app.route('/acoes')
def acoes():
    return redirect(url_for('eixos'))


@app.route('/noticias')
def noticias():
    return render_template('noticias.html', noticias=NOTICIAS)


@app.route('/galeria')
def galeria():
    fotos = list_uploads(only_images=True)
    return render_template('galeria.html', fotos=fotos)


@app.route('/materiais')
def materiais():
    arquivos = list_uploads(only_images=False)
    metadata = load_metadata()

    materiais = []

    for arquivo in arquivos:
        info = metadata.get(arquivo, {})

        materiais.append({
            'arquivo': arquivo,
            'titulo': info.get('titulo') or arquivo,
            'descricao': info.get('descricao') or ''
        })

    return render_template('materiais.html', materiais=materiais)


@app.route('/uploads/<path:filename>')
def baixar_arquivo(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form.get('usuario', '').strip()
        senha = request.form.get('senha', '')

        if usuario in USUARIOS_AUTORIZADOS and USUARIOS_AUTORIZADOS[usuario] == senha:
            session['usuario_logado'] = usuario
            flash('Login realizado com sucesso.')
            return redirect(url_for('dashboard'))

        flash('Usuário ou senha incorretos.')

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('usuario_logado', None)
    flash('Você saiu da área restrita.')
    return redirect(url_for('index'))


@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard():
    if 'usuario_logado' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        if 'arquivo' not in request.files:
            flash('Nenhum arquivo selecionado.')
            return redirect(request.url)

        file = request.files['arquivo']

        if file.filename == '':
            flash('Nenhum arquivo selecionado.')
            return redirect(request.url)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)

            titulo = request.form.get('titulo', '').strip()
            descricao = request.form.get('descricao', '').strip()

            if not titulo:
                titulo = filename

            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            metadata = load_metadata()
            metadata[filename] = {
                'titulo': titulo,
                'descricao': descricao
            }
            save_metadata(metadata)

            flash(f'O arquivo "{titulo}" foi enviado com sucesso.')
            return redirect(url_for('materiais'))

        flash('Formato não permitido. Use PDF, MP4, PNG, JPG, JPEG ou WEBP.')

    return render_template('dashboard.html')


@app.route('/deletar/<path:filename>', methods=['POST'])
def deletar_arquivo(filename):
    if 'usuario_logado' not in session:
        flash('Acesso negado. Faça login para excluir arquivos.')
        return redirect(url_for('login'))

    filename = secure_filename(filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    if os.path.exists(filepath) and os.path.isfile(filepath):
        try:
            os.remove(filepath)

            metadata = load_metadata()

            if filename in metadata:
                metadata.pop(filename)
                save_metadata(metadata)

            flash(f'O arquivo "{filename}" foi excluído com sucesso.')

        except OSError as error:
            flash(f'Erro ao tentar excluir o arquivo: {error}')
    else:
        flash('Arquivo não encontrado.')

    return redirect(url_for('materiais'))


if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True)