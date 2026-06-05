export type ImplementoTipoId =
  | "carreta"
  | "semirreboque"
  | "cacamba"
  | "bicacamba"
  | "bitrem"
  | "rodotrem"
  | "prancha"
  | "plataforma"
  | "graneleiro"
  | "sider"
  | "bau-seco"
  | "bau-frigorifico"
  | "tanque"
  | "silo"
  | "carroceria-sobre-chassi"
  | "dolly"
  | "julieta-reboque"
  | "outro";

export type ImplementoOpcao = {
  id: string;
  nome: string;
};

export type ImplementoTipo = ImplementoOpcao & {
  exemplos: string[];
};

export type ImplementoCampoCadastro = {
  campo: string;
  rotulo: string;
  obrigatorio: boolean;
  observacao?: string;
};

export const IMPLEMENTO_TIPOS: ImplementoTipo[] = [
  {
    id: "carreta",
    nome: "Carreta",
    exemplos: ["Carreta carga seca", "Carreta LS", "Carreta grade baixa", "Carreta aberta"],
  },
  {
    id: "semirreboque",
    nome: "Semirreboque",
    exemplos: ["Semirreboque 3 eixos", "Semirreboque Vanderleia", "Semirreboque carga geral"],
  },
  {
    id: "cacamba",
    nome: "Caçamba",
    exemplos: ["Caçamba basculante", "Caçamba meia-cana", "Caçamba quadrada", "Caçamba agrícola"],
  },
  {
    id: "bicacamba",
    nome: "Bi-caçamba",
    exemplos: ["Bi-caçamba 4 eixos", "Bi-caçamba basculante", "Conjunto bi-caçamba"],
  },
  {
    id: "bitrem",
    nome: "Bitrem",
    exemplos: ["Bitrem graneleiro", "Bitrem basculante", "Bitrem 7 eixos", "Bitrem 9 eixos"],
  },
  {
    id: "rodotrem",
    nome: "Rodotrem",
    exemplos: ["Rodotrem basculante", "Rodotrem graneleiro", "Rodotrem canavieiro", "Rodotrem florestal"],
  },
  {
    id: "prancha",
    nome: "Prancha",
    exemplos: ["Prancha rebaixada", "Prancha extensiva", "Prancha carrega tudo", "Prancha agrícola"],
  },
  {
    id: "plataforma",
    nome: "Plataforma",
    exemplos: ["Plataforma guincho", "Plataforma para máquinas", "Plataforma reta"],
  },
  {
    id: "graneleiro",
    nome: "Graneleiro",
    exemplos: ["Graneleira LS", "Graneleiro Vanderleia", "Bitrem graneleiro"],
  },
  {
    id: "sider",
    nome: "Sider",
    exemplos: ["Sider 3 eixos", "Sider bebidas", "Sider carga geral"],
  },
  {
    id: "bau-seco",
    nome: "Baú seco",
    exemplos: ["Baú carga seca", "Furgão carga seca", "Baú bebidas"],
  },
  {
    id: "bau-frigorifico",
    nome: "Baú frigorífico",
    exemplos: ["Baú frigorífico", "Furgão frigorífico", "Baú refrigerado"],
  },
  {
    id: "tanque",
    nome: "Tanque",
    exemplos: ["Tanque combustível", "Tanque inox", "Tanque leite", "Tanque água", "Tanque químico"],
  },
  {
    id: "silo",
    nome: "Silo",
    exemplos: ["Silo graneleiro", "Silo cimento", "Silo carga seca"],
  },
  {
    id: "carroceria-sobre-chassi",
    nome: "Carroceria sobre chassi",
    exemplos: ["Carroceria aberta", "Caçamba sobre chassi", "Baú sobre chassi", "Tanque sobre chassi"],
  },
  {
    id: "dolly",
    nome: "Dolly",
    exemplos: ["Dolly para bitrem", "Dolly para rodotrem", "Dolly 2 eixos"],
  },
  {
    id: "julieta-reboque",
    nome: "Julieta / Reboque",
    exemplos: ["Julieta carga seca", "Reboque agrícola", "Reboque carga geral"],
  },
  {
    id: "outro",
    nome: "Outro",
    exemplos: ["Implemento especial", "Equipamento adaptado", "Outra configuração"],
  },
];

export const IMPLEMENTO_MARCAS: ImplementoOpcao[] = [
  { id: "randon", nome: "Randon" },
  { id: "facchini", nome: "Facchini" },
  { id: "librelato", nome: "Librelato" },
  { id: "guerra", nome: "Guerra" },
  { id: "noma", nome: "Noma" },
  { id: "rossetti", nome: "Rossetti" },
  { id: "pastre", nome: "Pastre" },
  { id: "rodofort", nome: "Rodofort" },
  { id: "truckvan", nome: "Truckvan" },
  { id: "4truck", nome: "4Truck" },
  { id: "outra", nome: "Outra" },
];

export const IMPLEMENTO_EIXOS: ImplementoOpcao[] = [
  { id: "1", nome: "1 eixo" },
  { id: "2", nome: "2 eixos" },
  { id: "3", nome: "3 eixos" },
  { id: "4", nome: "4 eixos" },
  { id: "5", nome: "5 eixos" },
  { id: "6", nome: "6 eixos" },
  { id: "7", nome: "7 eixos" },
  { id: "8", nome: "8 eixos" },
  { id: "9", nome: "9 eixos" },
  { id: "outro", nome: "Outro" },
];

export const IMPLEMENTO_COMPOSICOES: ImplementoOpcao[] = [
  { id: "semirreboque-simples", nome: "Semirreboque simples" },
  { id: "carreta-ls", nome: "Carreta LS" },
  { id: "vanderleia", nome: "Vanderleia" },
  { id: "bitrem", nome: "Bitrem" },
  { id: "bicacamba", nome: "Bi-caçamba" },
  { id: "rodotrem", nome: "Rodotrem" },
  { id: "dolly-semirreboque", nome: "Dolly + semirreboque" },
  { id: "julieta-reboque", nome: "Reboque / Julieta" },
  { id: "sobre-chassi", nome: "Sobre chassi" },
  { id: "outro", nome: "Outro" },
];

export const IMPLEMENTO_PNEUS: ImplementoOpcao[] = [
  { id: "com-pneus", nome: "Com pneus" },
  { id: "sem-pneus", nome: "Sem pneus" },
  { id: "pneus-bons", nome: "Pneus bons" },
  { id: "pneus-meia-vida", nome: "Pneus meia vida" },
  { id: "pneus-ruins", nome: "Pneus ruins" },
  { id: "pneus-reformados", nome: "Pneus reformados" },
  { id: "a-combinar", nome: "A combinar" },
];

export const IMPLEMENTO_SUSPENSOES: ImplementoOpcao[] = [
  { id: "mola", nome: "Mola" },
  { id: "pneumatica", nome: "Pneumática" },
  { id: "balancim", nome: "Balancim" },
  { id: "tandem", nome: "Tandem" },
  { id: "nao-informado", nome: "Não informado" },
];

export const IMPLEMENTO_CONSERVACOES: ImplementoOpcao[] = [
  { id: "pronto-para-trabalhar", nome: "Pronto para trabalhar" },
  { id: "revisado", nome: "Revisado" },
  { id: "bom-estado", nome: "Bom estado" },
  { id: "precisa-reparos", nome: "Precisa reparos" },
  { id: "repasse", nome: "Repasse" },
  { id: "sucata-aproveitamento", nome: "Sucata / aproveitamento" },
  { id: "a-revisar", nome: "A revisar" },
];

export const IMPLEMENTO_CAMPOS_CADASTRO: ImplementoCampoCadastro[] = [
  {
    campo: "tipo_implemento",
    rotulo: "Tipo de implemento",
    obrigatorio: true,
    observacao: "Exemplo: Caçamba, Bi-caçamba, Bitrem, Prancha, Tanque, Baú, Sider.",
  },
  {
    campo: "marca",
    rotulo: "Marca",
    obrigatorio: true,
    observacao: "Usar marcas pré-cadastradas e manter opção Outra.",
  },
  {
    campo: "modelo",
    rotulo: "Modelo / versão",
    obrigatorio: true,
    observacao: "Exemplo: Basculante meia-cana, Graneleira LS, Prancha extensiva.",
  },
  {
    campo: "ano_fabricacao",
    rotulo: "Ano de fabricação",
    obrigatorio: true,
  },
  {
    campo: "ano_modelo",
    rotulo: "Ano modelo",
    obrigatorio: false,
  },
  {
    campo: "numero_eixos",
    rotulo: "Número de eixos",
    obrigatorio: true,
  },
  {
    campo: "composicao",
    rotulo: "Composição",
    obrigatorio: false,
    observacao: "Exemplo: Semirreboque simples, Bitrem, Rodotrem, Bi-caçamba, Sobre chassi.",
  },
  {
    campo: "pneus",
    rotulo: "Pneus",
    obrigatorio: true,
    observacao: "Esse campo influencia muito o valor do implemento.",
  },
  {
    campo: "preco",
    rotulo: "Valor",
    obrigatorio: true,
    observacao: "Permitir valor em reais ou sob consulta em etapa futura.",
  },
  {
    campo: "conservacao",
    rotulo: "Estado / conservação",
    obrigatorio: true,
  },
  {
    campo: "suspensao",
    rotulo: "Suspensão",
    obrigatorio: false,
  },
  {
    campo: "capacidade_volume",
    rotulo: "Capacidade / volume / medidas",
    obrigatorio: false,
    observacao: "Exemplo: 30 m³, 50.000 litros, 28 paletes, 10,30 m x 3,00 m.",
  },
  {
    campo: "cidade_estado",
    rotulo: "Cidade e UF",
    obrigatorio: true,
  },
  {
    campo: "fotos",
    rotulo: "Fotos",
    obrigatorio: true,
    observacao: "Fotos laterais, traseira, pneus, chassi, assoalho/caixa e detalhes.",
  },
  {
    campo: "descricao",
    rotulo: "Descrição",
    obrigatorio: true,
  },
];

export const IMPLEMENTO_MODELO_DESCRICAO =
  "Implemento [marca] [modelo], ano [ano], [numero_eixos], [tipo_implemento], [pneus], estado [conservacao], documentação [documentacao], ideal para [uso]. Disponível em [cidade/UF]. Valor R$ [valor]. Mais informações pelo WhatsApp.";
