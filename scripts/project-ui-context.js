#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outPath = path.join(root, 'project-ui-context.md');
const jsonPath = path.join(root, 'project-ui-context.json');

function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(root, filePath), 'utf8');
  } catch {
    return null;
  }
}

function exists(filePath) {
  return fs.existsSync(path.join(root, filePath));
}

function find(filePath, pattern) {
  const content = readFile(filePath);
  return content ? pattern.test(content) : false;
}

function formatList(list) {
  if (!list.length) return ['- (nenhum)'];
  return list.map((item) => `- ${item}`);
}

const files = {
  header: 'components/PublicHeaderClient.tsx',
  searchBar: 'components/SearchBar.tsx',
  truckCard: 'components/TruckCard.tsx',
  siteFooter: 'components/SiteFooter.tsx',
  hero: 'components/theme/HeroMarketplace.tsx',
  featuredAds: 'components/theme/FeaturedAds.tsx',
  anunciosPage: 'app/anuncios/page.tsx',
  homePage: 'app/page.tsx',
  globals: 'app/globals.css',
};

const fileStatus = Object.entries(files).map(([name, file]) => ({ name, file, exists: exists(file) }));

const features = [];

if (files.header && exists(files.header)) {
  const headerFile = files.header;
  if (find(headerFile, /placeholder="Buscar marca, modelo"/)) features.push('Header com campo de busca principal');
  if (find(headerFile, /ThemeTogglePublic/)) features.push('Toggle de tema claro/escuro no header');
  if (find(headerFile, /ph-nav-link/)) features.push('Menu principal com itens de navegação e estado ativo');
  if (find(headerFile, /public-cta/)) features.push('CTA destacado "Anunciar grátis" no header');
  if (find(headerFile, /ph-hamburger/)) features.push('Menu mobile hamburger para telas pequenas');
}

if (files.searchBar && exists(files.searchBar)) {
  const searchFile = files.searchBar;
  if (find(searchFile, /fetch\(\"\/api\/autocomplete\"/)) features.push('Busca com autocomplete via API');
  if (find(searchFile, /Buscas recentes/)) features.push('Dropdown de buscas recentes');
  if (find(searchFile, /Mais buscados/)) features.push('Sugestões de termos populares');
}

if (files.truckCard && exists(files.truckCard)) {
  const cardFile = files.truckCard;
  if (find(cardFile, /tc-price|formatMoney\(truck\.preco\)/)) features.push('Card exibe preço em destaque');
  if (find(cardFile, /tc-loc|MapPin/)) features.push('Card mostra localização do anúncio');
  if (find(cardFile, /waLink|wa\.me\/\${phone}/)) features.push('Botão de contato WhatsApp diretamente no card');
  if (find(cardFile, /tc-photo-badge|Camera/)) features.push('Badge de contagem de fotos no card');
  if (find(cardFile, /tc-overlay/)) features.push('Overlay de preço sobre imagem do anúncio');
}

if (files.siteFooter && exists(files.siteFooter)) {
  const footerFile = files.siteFooter;
  if (find(footerFile, /Categorias/)) features.push('Footer com seção de categorias');
  if (find(footerFile, /Marcas/)) features.push('Footer com links para marcas');
  if (find(footerFile, /Anunciar/)) features.push('Footer com link para anunciar');
  if (find(footerFile, /Atendimento/)) features.push('Footer com contatos e suporte');
}

if (files.hero && exists(files.hero)) {
  const heroFile = files.hero;
  if (find(heroFile, /heroBannerUrl|hero-img/)) features.push('Hero de homepage com imagem destacada');
  if (find(heroFile, /Ver caminhões/)) features.push('Hero com CTA primário para ver anúncios');
  if (find(heroFile, /Anunciar grátis/)) features.push('Hero com CTA secundário para anunciar');
}

if (files.anunciosPage && exists(files.anunciosPage)) {
  const pageFile = files.anunciosPage;
  if (find(pageFile, /AnunciosSidebar/)) features.push('Página de anúncios com sidebar de filtros');
  if (find(pageFile, /LoadMore/)) features.push('Paginação/Load More na página de anúncios');
  if (find(pageFile, /hasFilters/)) features.push('Detecção de filtros ativos para a listagem');
}

const themeNotes = [];
if (files.globals && exists(files.globals)) {
  const cssFile = readFile(files.globals);
  if (cssFile.match(/--blue/)) themeNotes.push('Paleta base com variável --blue para CTA e destaques');
  if (cssFile.match(/--surface/)) themeNotes.push('Uso consistente de --surface para fundos de cards e seções');
  if (cssFile.match(/--shadow/)) themeNotes.push('Sombreamento suave em elementos de destaque');
  if (cssFile.match(/border-radius: 18px|border-radius: 22px/)) themeNotes.push('Cards com cantos arredondados e visual mais moderno');
  if (cssFile.match(/box-shadow/)) themeNotes.push('Elementos com sombra leve para profundidade');
}

const missingFeatures = [
  'Ausência de sistema de avaliações/reviews para vendedores ou anúncios',
  'Não há marcação de vendedor verificado nos cards',
  'Não há botão de favoritos/salvar anúncio',
  'Não há comparação lado a lado de anúncios',
  'Não há visualização de mapa ou busca por distância',
  'Não há indicadores de tempo de resposta do anunciante',
  'Não há preview rápido de detalhes sem entrar na página do anúncio',
];

function toMarkdown() {
  const sections = [];
  sections.push('# Contexto visual do projeto');
  sections.push('');
  sections.push('Este relatório descreve o que já existe no frontend atual do projeto e o que falta para uma visão de marketplace mais moderna.');
  sections.push('');
  sections.push('## Arquivos-chave de UI');
  fileStatus.forEach(({ name, file, exists }) => {
    sections.push(`- **${name}**: \`${file}\` — ${exists ? 'presente' : 'ausente'}`);
  });
  sections.push('');
  sections.push('## Principais recursos de interface encontrados');
  sections.push(...formatList(features));
  sections.push('');
  sections.push('## Componentes principais e como são usados');
  sections.push('- `components/PublicHeaderClient.tsx`: header sticky com busca, menu principal, tema e CTA.');
  sections.push('- `components/SearchBar.tsx`: campo de busca com autocomplete, histórico e termos populares.');
  sections.push('- `components/TruckCard.tsx`: card de anúncio com imagem, preço, localização, badge de fotos e WhatsApp.');
  sections.push('- `components/SiteFooter.tsx`: footer com lista de categorias, marcas, anúncio e suporte.');
  sections.push('- `components/theme/HeroMarketplace.tsx`: hero da homepage com imagem e CTAs.');
  sections.push('- `app/anuncios/page.tsx`: página de anúncios com sidebar de filtros e carregamento incremental.');
  sections.push('- `app/page.tsx`: homepage atual com hero, anúncios em destaque e seção "Como funciona".');
  sections.push('');
  sections.push('## Tom visual atual e linha estética');
  sections.push(...formatList(themeNotes));
  sections.push('');
  sections.push('## O que não existe hoje e pode ser considerado para melhorar a visualização');
  sections.push(...formatList(missingFeatures));
  sections.push('');
  sections.push('## Sugestões de briefing para a IA');
  sections.push('- Focar em melhorias de visual que respeitem a estrutura atual do site.');
  sections.push('- Manter o mesmo fluxo de navegação: header, lista de anúncios, sidebar, footer.');
  sections.push('- Tornar cards mais limpos, com hierarquia visual clara no preço e nas informações principais.');
  sections.push('- Fazer header mais leve e CTA visível sem refazer a composição do menu.');
  sections.push('- Evitar adicionar novas páginas ou funcionalidades complexas sem primeiro atualizar o visual existente.');
  sections.push('');
  sections.push('## Uso');
  sections.push('- Execute `npm run ui-context` para gerar este arquivo.');
  sections.push('- Cole o resultado em uma conversa com a IA antes de pedir mudanças visuais.');
  sections.push('- Diga à IA: "Use este contexto para sugerir melhorias no visual sem mudar a estrutura atual."');

  return sections.join('\n');
}

function toJSON() {
  return JSON.stringify({
    generatedAt: new Date().toISOString(),
    root,
    files: fileStatus,
    features,
    themeNotes,
    missingFeatures,
  }, null, 2);
}

fs.writeFileSync(outPath, toMarkdown() + '\n', 'utf8');
fs.writeFileSync(jsonPath, toJSON() + '\n', 'utf8');
console.log('Contexto de UI gerado em:', outPath);
console.log('JSON de contexto gerado em:', jsonPath);
