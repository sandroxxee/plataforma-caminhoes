# Contexto visual do projeto

Este relatório descreve o que já existe no frontend atual do projeto e o que falta para uma visão de marketplace mais moderna.

## Arquivos-chave de UI
- **header**: `components/PublicHeaderClient.tsx` — presente
- **searchBar**: `components/SearchBar.tsx` — presente
- **truckCard**: `components/TruckCard.tsx` — presente
- **siteFooter**: `components/SiteFooter.tsx` — presente
- **hero**: `components/theme/HeroMarketplace.tsx` — presente
- **featuredAds**: `components/theme/FeaturedAds.tsx` — presente
- **anunciosPage**: `app/anuncios/page.tsx` — presente
- **homePage**: `app/page.tsx` — presente
- **globals**: `app/globals.css` — presente

## Principais recursos de interface encontrados
- Toggle de tema claro/escuro no header
- Menu principal com itens de navegação e estado ativo
- CTA destacado "Anunciar grátis" no header
- Menu mobile hamburger para telas pequenas
- Dropdown de buscas recentes
- Sugestões de termos populares
- Card exibe preço em destaque
- Card mostra localização do anúncio
- Botão de contato WhatsApp diretamente no card
- Badge de contagem de fotos no card
- Overlay de preço sobre imagem do anúncio
- Footer com seção de categorias
- Footer com links para marcas
- Footer com link para anunciar
- Footer com contatos e suporte
- Hero de homepage com imagem destacada
- Hero com CTA primário para ver anúncios
- Hero com CTA secundário para anunciar
- Página de anúncios com sidebar de filtros
- Paginação/Load More na página de anúncios
- Detecção de filtros ativos para a listagem

## Componentes principais e como são usados
- `components/PublicHeaderClient.tsx`: header sticky com busca, menu principal, tema e CTA.
- `components/SearchBar.tsx`: campo de busca com autocomplete, histórico e termos populares.
- `components/TruckCard.tsx`: card de anúncio com imagem, preço, localização, badge de fotos e WhatsApp.
- `components/SiteFooter.tsx`: footer com lista de categorias, marcas, anúncio e suporte.
- `components/theme/HeroMarketplace.tsx`: hero da homepage com imagem e CTAs.
- `app/anuncios/page.tsx`: página de anúncios com sidebar de filtros e carregamento incremental.
- `app/page.tsx`: homepage atual com hero, anúncios em destaque e seção "Como funciona".

## Tom visual atual e linha estética
- Paleta base com variável --blue para CTA e destaques
- Uso consistente de --surface para fundos de cards e seções
- Sombreamento suave em elementos de destaque
- Cards com cantos arredondados e visual mais moderno
- Elementos com sombra leve para profundidade

## O que não existe hoje e pode ser considerado para melhorar a visualização
- Ausência de sistema de avaliações/reviews para vendedores ou anúncios
- Não há marcação de vendedor verificado nos cards
- Não há botão de favoritos/salvar anúncio
- Não há comparação lado a lado de anúncios
- Não há visualização de mapa ou busca por distância
- Não há indicadores de tempo de resposta do anunciante
- Não há preview rápido de detalhes sem entrar na página do anúncio

## Sugestões de briefing para a IA
- Focar em melhorias de visual que respeitem a estrutura atual do site.
- Manter o mesmo fluxo de navegação: header, lista de anúncios, sidebar, footer.
- Tornar cards mais limpos, com hierarquia visual clara no preço e nas informações principais.
- Fazer header mais leve e CTA visível sem refazer a composição do menu.
- Evitar adicionar novas páginas ou funcionalidades complexas sem primeiro atualizar o visual existente.

## Uso
- Execute `npm run ui-context` para gerar este arquivo.
- Cole o resultado em uma conversa com a IA antes de pedir mudanças visuais.
- Diga à IA: "Use este contexto para sugerir melhorias no visual sem mudar a estrutura atual."
