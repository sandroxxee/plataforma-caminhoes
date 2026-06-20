export type TruckImage = {
  image_url: string | null;
  principal: boolean | null;
  ordem: number | null;
};

export type Anuncio = {
  id: string;
  user_id?: string | null;
  titulo: string | null;
  marca: string | null;
  modelo: string | null;
  ano_modelo: number | null;
  ano_fabricacao: number | null;
  preco: number | null;
  cidade: string | null;
  estado: string | null;
  carroceria: string | null;
  tracao: string | null;
  motor?: string | null;
  cambio?: string | null;
  km?: number | null;
  descricao?: string | null;
  whatsapp: string | null;
  destaque?: boolean | null;
  views?: number | null;
  status?: string | null;
  vendido?: boolean | null;
  perfil?: string | null;
  created_at?: string | null;
  truck_images?: TruckImage[];
};

export type AnuncioFiltros = {
  marca?: string;
  estado?: string;
  faixa?: number;
  q?: string;
  categoria?: string;
};

export type Categoria = {
  slug: string;
  label: string;
  emoji: string;
  descricao: string;
};

export const CATEGORIAS: Categoria[] = [
  { slug: 'caminhoes', label: 'Caminhões', emoji: '🚛', descricao: 'Cavalos mecânicos, trucks e caminhões' },
  { slug: 'carretas', label: 'Carretas', emoji: '🚚', descricao: 'Semi-reboques e carretas' },
  { slug: 'implementos', label: 'Implementos', emoji: '🔧', descricao: 'Implementos rodoviários' },
  { slug: 'maquinas', label: 'Máquinas', emoji: '🏗️', descricao: 'Máquinas pesadas e equipamentos' },
  { slug: 'pecas', label: 'Peças', emoji: '⚙️', descricao: 'Peças e acessórios' },
];

export const MARCAS = [
  'Mercedes-Benz',
  'Scania',
  'Volvo',
  'Volkswagen',
  'Ford',
  'Iveco',
  'DAF',
  'MAN',
  'Agrale',
];

export const ESTADOS = [
  'SC', 'PR', 'RS', 'SP', 'MG', 'MS',
  'MT', 'GO', 'BA', 'RJ', 'ES', 'PE',
  'CE', 'PA', 'AM',
];

export const FAIXAS_PRECO = [
  { label: 'Todos os preços', min: 0, max: Infinity },
  { label: 'Até R$ 100 mil', min: 0, max: 100000 },
  { label: 'R$ 100k – R$ 200k', min: 100000, max: 200000 },
  { label: 'R$ 200k – R$ 400k', min: 200000, max: 400000 },
  { label: 'Acima de R$ 400k', min: 400000, max: Infinity },
];
