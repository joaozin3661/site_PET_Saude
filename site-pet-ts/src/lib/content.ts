export type Eixo = {
  numero: number;
  titulo: string;
  resumo: string;
  acoes: string[];
  grupos: number[];
};

export type Grupo = {
  numero: number;
  titulo: string;
  descricao: string;
  tutor: string;
  tutor2: string; // cada grupo tem dois tutores
  unidade: string;
};

export const EIXOS: Eixo[] = [
  {
    numero: 1,
    titulo: "Cultura de saúde digital, formação e educação permanente",
    resumo:
      "Promove o letramento digital, a educação permanente e o uso ético das tecnologias digitais por usuários, estudantes, trabalhadores e gestores do SUS.",
    acoes: [
      "Letramento digital de usuários",
      "Formação de ACS, trabalhadores e gestores",
      "Proteção de dados pessoais e sensíveis",
      "Educação permanente em saúde digital",
    ],
    grupos: [1, 2, 10],
  },
  {
    numero: 2,
    titulo: "Soluções tecnológicas e serviços de saúde digital no SUS",
    resumo:
      "Reúne ações voltadas à telessaúde, monitoramento remoto, acompanhamento de fluxos, gestão de equipes, insumos e encaminhamentos.",
    acoes: [
      "Protocolos para telessaúde",
      "Monitoramento remoto pós-atendimento",
      "Gestão de equipes e ACS",
      "Gestão de insumos e regulação",
    ],
    grupos: [3, 4, 5, 6, 7],
  },
  {
    numero: 3,
    titulo: "Interoperabilidade, análise e disseminação de dados em saúde",
    resumo:
      "Fortalece o uso de dados para a tomada de decisão, a construção de painéis de monitoramento e a comunicação qualificada com usuários e profissionais.",
    acoes: [
      "Coleta e análise de dados",
      "Painéis interativos",
      "Comunicação social para engajamento",
      "Disseminação segura de informações",
    ],
    grupos: [8, 9],
  },
];

// Dados copiados do protótipo Flask (app.py). Conferir antes de publicar.
export const GRUPOS: Grupo[] = [
  {
    numero: 1,
    titulo: "Letramento para usuários dos serviços digitais do SUS",
    descricao:
      "Promove o acesso do cidadão à cultura digital, com formação para uso de serviços como agendamentos, exames, histórico médico e verificação de indicadores.",
    tutor: "Joana de Moraes Souza Machado",
    tutor2: "Léia Lima Soares",
    unidade: "CAPS AD Sul (S)",
  },
  {
    numero: 2,
    titulo: "Formação digital para ACS, trabalhadores da Rede de Atenção à Saúde e gestores das UBS",
    descricao:
      "Forma ACS, trabalhadores e gestores no uso de ferramentas digitais, registro de atendimentos, relatórios, integração digital e proteção de dados.",
    tutor: "Christianne Matos Paiva",
    tutor2: "Mauriceia Ligia Neves da Costa Carneiro",
    unidade: "CAPS II (S)",
  },
  {
    numero: 3,
    titulo: "Protocolos clínicos para qualidade e segurança na telessaúde",
    descricao:
      "Aperfeiçoa protocolos clínicos padronizados para atendimentos remotos, assegurando qualidade e segurança na telessaúde.",
    tutor: "Ivan Saraiva Silva",
    tutor2: "Patrícia Viana",
    unidade: "Nova Teresina",
  },
  {
    numero: 4,
    titulo: "Monitoramento remoto pós-atendimento da equipe do SUS",
    descricao:
      "Implementa soluções tecnológicas digitais para acompanhar pacientes após consultas, procedimentos ou outras demandas da APS.",
    tutor: "José Medeiros",
    tutor2: "Adriana de Azevedo Paiva",
    unidade: "Morada do Sol (L)",
  },
  {
    numero: 5,
    titulo: "Monitoramento da gestão dos profissionais da equipe e ACS",
    descricao:
      "Aprimora sistemas para gestão das equipes de saúde e ACS, distribuição de tarefas, produtividade e acompanhamento de linhas de cuidado.",
    tutor: "Francisco Rafael Campos de Macedo",
    tutor2: "Carla Solange de Melo Escórcio Dourado",
    unidade: "Mafrense (N)",
  },
  {
    numero: 6,
    titulo: "Acompanhamento e monitoramento da gestão de insumos",
    descricao:
      "Implementa tecnologia digital para rastrear uso e disponibilidade de insumos, racionalizando recursos e prevenindo desabastecimentos.",
    tutor: "Maria do Socorro Ferreira dos Santos",
    tutor2: "Jéssica Pereira Costa",
    unidade: "Buenos Aires (N)",
  },
  {
    numero: 7,
    titulo: "Acompanhamento e monitoramento da regulação e do matriciamento",
    descricao:
      "Desenvolve soluções digitais para otimizar encaminhamentos entre pontos de atenção, garantindo continuidade do cuidado.",
    tutor: "José Rodrigues Torres Neto",
    tutor2: "Cacilda Castelo Branco Lima",
    unidade: "Vale do Gavião/Ceci Fortes (prótese)",
  },
  {
    numero: 8,
    titulo: "Formação no SUS Digital para coleta e uso de dados na gestão",
    descricao:
      "Forma profissionais na coleta, análise e uso de dados, com foco em proteção de dados, painéis interativos e modelos preditivos.",
    tutor: "José Maria P. de Menezes Jr",
    tutor2: "Ivone Freire de Oliveira Costa Nunes",
    unidade: "Memorare (N)",
  },
  {
    numero: 9,
    titulo: "Comunicação social para engajamento de usuários e profissionais",
    descricao:
      "Desenvolve estratégias de comunicação para incentivar o uso das plataformas digitais do SUS e aproximar usuários e profissionais.",
    tutor: "Nayra Veras de Araújo",
    tutor2: "Fábio Rodrigues Trindade",
    unidade: "Ininga (L)",
  },
  {
    numero: 10,
    titulo: "Formação no SUS Digital para profissionais da equipe",
    descricao:
      "Aperfeiçoa equipes de saúde no uso das plataformas digitais, incluindo PEC, telemedicina e monitoramento remoto.",
    tutor: "Felipe Ferreira Monteiro",
    tutor2: "Vânia Silva Macedo Orsano",
    unidade: "Parque Universitário (L)",
  },
];

export const CATEGORIAS = [
  "Grupos Tutoriais",
  "Evento",
  "Oficina",
  "Visita técnica",
  "Galeria",
  "Outro",
];

// Texto de busca do Google Maps. O endereço digitado pelo admin tem prioridade;
// sem ele, busca pelo nome da unidade em Teresina (pode ser impreciso).
export function consultaMapa(unidade: string, endereco?: string | null) {
  if (endereco?.trim()) return endereco.trim();
  const nome = unidade.replace(/\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
  const prefixo = /^(CAPS|UBS)\b/i.test(nome) ? "" : "UBS ";
  return `${prefixo}${nome}, Teresina, Piauí`;
}

export function getGrupo(numero: number) {
  return GRUPOS.find((g) => g.numero === numero);
}
