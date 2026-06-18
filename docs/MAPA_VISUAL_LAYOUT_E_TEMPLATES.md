# Mapa visual, layout e templates — Caminhões à Venda

Este arquivo é o mapa oficial para futuras melhorias visuais do site **Caminhões à Venda**.

Objetivo: saber exatamente onde mexer quando quiser mudar visual, layout, template, cores, cards, fotos, páginas públicas, admin ou aparência geral, sem ficar perdido e sem quebrar sistema, Supabase, login, banco ou anúncios reais.

---

## Regra principal antes de editar

Antes de qualquer mudança visual, identificar qual bloco será alterado:

1. Header/menu público
2. Home/hero
3. Página de anúncios/listagem
4. Filtros/busca
5. Cards dos caminhões
6. Fotos/galeria
7. Detalhe do anúncio
8. Páginas institucionais
9. Login/cadastro/conta
10. Admin
11. Cores globais
12. Tipografia global
13. SEO/metadados

Nunca alterar tudo junto.

---

## 1. Cores, tema, espaçamentos e visual global

### Arquivo principal

- `app/globals.css`

### O que controla

- Fundo claro do site
- Branco/cinza dos cards
- Azul principal
- Verde do WhatsApp
- Bordas
- Sombras
- Header público
- Menu mobile
- Hero
- Categorias rápidas
- Grid de anúncios
- Cards
- Busca/filtros
- Página de detalhe
- Galeria
- Footer
- Responsividade mobile
- Classes `trust-*` das páginas institucionais

### Quando editar

Editar este arquivo quando quiser mudar:

- Cor principal do site
- Fundo geral
- Bordas dos cards
- Sombra
- Espaçamento geral
- Altura dos cards
- Aparência dos botões
- Layout mobile
- Aparência das páginas públicas

### Cuidado

Este arquivo afeta muitas páginas ao mesmo tempo. Mudança pequena pode alterar home, anúncios, detalhe, institucional e mobile.

---

## 2. Fontes e estilo dos textos

### Arquivo principal

- `app/typography.css`

### O que controla

- Fonte dos títulos
- Peso dos títulos
- Uppercase em `h1` e `h2`
- Fonte dos botões
- Fonte dos preços
- Texto dos cards
- Texto do hero

### Quando editar

Editar este arquivo quando quiser mudar:

- Estilo dos títulos
- Fonte mais forte ou mais simples
- Títulos em maiúsculo ou normal
- Aparência comercial dos preços
- Peso dos textos dos botões

### Cuidado

Não mexer nele junto com `globals.css` sem revisar, porque pode mudar a aparência de muitas páginas ao mesmo tempo.

---

## 3. Header, menu público e navegação

### Arquivo principal

- `components/PublicHeader.tsx`

### CSS relacionado

- `app/globals.css`
- `app/typography.css` apenas para fonte do menu e botão

### O que controla

- Logo
- Busca no topo
- Links do menu público
- Caminhões
- Implementos
- Sobre
- Entrar
- Botão Anunciar
- Botão mobile
- Menu mobile
- Página ativa no menu

### Quando editar

Editar quando quiser mudar:

- Logo
- Ordem dos links
- Texto dos links
- Botão Anunciar
- Botão Entrar
- Menu no celular
- Busca no topo

### Não mexer aqui para

- Alterar filtros da página de anúncios
- Alterar cards
- Alterar login real
- Alterar Supabase

---

## 4. Rodapé / footer

### Arquivo principal

- `components/SiteFooter.tsx`

### CSS relacionado

- `app/globals.css`

### O que controla

- Texto do rodapé
- Links do rodapé
- Caminhões
- Implementos
- Anunciar
- Sobre
- Frase final

### Quando editar

Editar quando quiser mudar:

- Frase institucional do rodapé
- Links do rodapé
- Aparência final da página
- Texto de confiança no fim do site

---

## 5. Home / primeira impressão

### Arquivo principal

- `app/page.tsx`

### Componentes usados na home

- `components/PublicHeader.tsx`
- `components/theme/HeroMarketplace.tsx`
- `components/theme/FeaturedAds.tsx`
- `components/theme/TruckCard.tsx`
- `components/SiteFooter.tsx`

### O que controla

- Estrutura da home
- Header
- Hero
- Categorias rápidas
- Destaques
- Rodapé
- Busca de até 12 anúncios aprovados e não vendidos

### Quando editar

Editar `app/page.tsx` quando quiser mudar:

- Ordem das seções da home
- Categorias rápidas
- Quantidade de anúncios em destaque
- Estrutura geral da home

### Cuidado

Este arquivo consulta Supabase. Não mexer na busca de anúncios se o objetivo for só visual.

---

## 6. Hero da home

### Arquivo principal

- `components/theme/HeroMarketplace.tsx`

### CSS relacionado

- CSS inline dentro do próprio componente
- `app/globals.css`
- `app/typography.css`

### O que controla

- Selo do hero
- Título principal
- Subtítulo
- Botão Ver caminhões
- Botão Anunciar caminhão
- Primeira impressão da home

### Quando editar

Editar quando quiser mudar:

- Frase principal da home
- Texto comercial da primeira dobra
- Botões do hero
- Altura visual do hero
- Aparência compacta do hero

### Cuidado

Se for só texto, editar apenas este arquivo. Não mexer em `app/page.tsx`.

---

## 7. Destaques da home

### Arquivo principal

- `components/theme/FeaturedAds.tsx`

### Componentes relacionados

- `components/theme/TruckCard.tsx`

### CSS relacionado

- `app/globals.css`

### O que controla

- Seção de anúncios recentes/destaques
- Título da seção
- Grid de cards na home
- Mensagem quando não há anúncios aprovados

### Quando editar

Editar quando quiser mudar:

- Nome da seção de destaque
- Texto de vitrine
- Botão para ver todos anúncios
- Mensagem de vazio

---

## 8. Página de anúncios / estoque / listagem

### Arquivo principal

- `app/anuncios/page.tsx`

### Componentes usados

- `components/PublicHeader.tsx`
- `components/theme/SearchMarketplace.tsx`
- `components/theme/TruckCard.tsx`
- `components/SiteFooter.tsx`

### CSS relacionado

- `app/globals.css`
- `app/typography.css`

### O que controla

- Título `Caminhões à venda`
- Contador de resultados
- Botão Anunciar caminhão
- Busca/filtros
- Lista de anúncios
- Mensagem quando não encontra anúncio
- Filtros por marca, perfil, tração, implemento e busca

### Quando editar

Editar quando quiser mudar:

- Título da página de anúncios
- Texto do contador
- Ordem dos blocos
- Regras visuais da listagem
- Termos dos filtros

### Cuidado

Este arquivo também controla lógica de filtro e consulta Supabase. Não mexer na lógica se for apenas melhoria visual.

---

## 9. Filtros e busca

### Arquivo principal

- `components/theme/SearchMarketplace.tsx`

### CSS relacionado

- `app/globals.css`

### O que controla

- Campo Buscar
- Select Marca
- Select Tipo
- Select Tração
- Select Implemento
- Botão Buscar
- Botão Limpar
- Modo compacto na home/hero se usado

### Quando editar

Editar quando quiser mudar:

- Ordem dos filtros
- Nomes dos campos
- Placeholder da busca
- Marcas exibidas
- Botões Buscar/Limpar
- Aparência visual dos filtros

### Cuidado

Adicionar filtro novo exige revisar `app/anuncios/page.tsx` também.

---

## 10. Card dos caminhões

### Arquivo principal

- `components/theme/TruckCard.tsx`

### CSS relacionado

- `app/globals.css`
- `app/typography.css`

### O que controla

- Foto do card
- Título do anúncio
- Preço
- Ano
- Carroceria/tração
- Cidade/estado
- Botão Ver detalhes
- Botão WhatsApp
- Link para `/anuncios/[id]`
- Link de WhatsApp

### Quando editar

Editar quando quiser mudar:

- Informação que aparece no card
- Texto do botão Ver detalhes
- Texto do botão WhatsApp
- Ordem de preço/título/ano/cidade
- Mensagem do WhatsApp do card
- Regra da imagem principal

### Cuidado

Este componente aparece na home e na página de anúncios. Alteração nele afeta os dois lugares.

---

## 11. Fotos do card

### Arquivos principais

- `components/theme/TruckCard.tsx`
- `app/globals.css`

### Classes importantes no CSS

- `.truck-card-photo`
- `.truck-card-photo img`

### O que controla

- Proporção da imagem do card
- Centralização da foto
- `object-fit`
- Fundo atrás da imagem
- Espaçamento/padding da foto

### Quando editar

Editar quando quiser mudar:

- Foto quadrada ou retangular
- Caminhão inteiro aparecendo
- Corte da imagem
- Espaço branco ao redor da foto

---

## 12. Página de detalhe do anúncio

### Arquivo principal

- `app/anuncios/[id]/page.tsx`

### Componentes usados

- `components/PublicHeader.tsx`
- `components/theme/AdGallery.tsx`
- `components/theme/TruckCard.tsx` para funções de formatação
- `components/ShareAdButton.tsx`
- `components/SiteFooter.tsx`

### CSS relacionado

- `app/globals.css`
- `app/typography.css`

### O que controla

- Página individual do caminhão
- Título
- Localização
- Galeria
- Descrição
- Preço
- Ficha técnica
- Botão WhatsApp
- Botão compartilhar
- Texto de contato e negociação
- SEO/metadata do anúncio

### Quando editar

Editar quando quiser mudar:

- Layout da página individual
- Ordem entre galeria e ficha técnica
- Texto do WhatsApp do detalhe
- Ficha técnica exibida
- Mensagem de confiança
- Metadata/SEO do anúncio

### Cuidado

Este arquivo usa rota dinâmica, consulta Supabase e só mostra anúncios aprovados. Não alterar a regra de status sem revisar segurança.

---

## 13. Galeria de fotos do anúncio

### Arquivo principal

- `components/theme/AdGallery.tsx`

### CSS relacionado

- `app/globals.css`

### O que controla

- Foto principal do detalhe
- Miniaturas
- Ordem das fotos
- Foto principal marcada como `principal`
- Clique nas miniaturas

### Quando editar

Editar quando quiser mudar:

- Tamanho da foto principal
- Quantidade/visual das miniaturas
- Navegação das fotos
- Aparência da galeria no celular

---

## 14. Páginas institucionais / confiança

### Arquivos principais

- `app/anunciar/page.tsx`
- `app/sobre/page.tsx`
- `app/como-funciona/page.tsx`

### CSS relacionado

- `app/globals.css`
- Classes `trust-*`

### O que controla

- Página Anunciar
- Página Sobre
- Página Como funciona
- Cards de confiança
- Botões institucionais
- Blocos explicativos
- CTA final

### Quando editar

Editar quando quiser mudar:

- Texto institucional
- Explicação de como anunciar
- Confiança do site
- Botões de chamada
- Layout das páginas de confiança

### Cuidado

O CSS `trust-*` está centralizado em `app/globals.css`. Não recriar CSS inline repetido nessas páginas.

---

## 15. Login, cadastro e conta

### Arquivos principais

- `app/login/page.tsx`
- `app/cadastro/page.tsx`
- `app/conta/page.tsx`

### O que controlar aqui

- Aparência da entrada do usuário
- Formulário de login
- Formulário de cadastro
- Redirecionamento da conta
- Mensagens da área do usuário

### Quando editar

Editar quando quiser mudar:

- Texto da tela de login
- Texto da tela de cadastro
- Aparência dos formulários
- Confiança para o anunciante entrar

### Cuidado

Essas páginas podem usar autenticação Supabase. Não alterar lógica de login/cadastro junto com visual.

---

## 16. Painel do anunciante

### Arquivos principais prováveis

- `app/painel/page.tsx`
- `app/painel/anuncios/page.tsx`
- `app/painel/anuncios/novo/page.tsx`
- `app/painel/anuncios/[id]/editar/page.tsx`

### O que controla

- Área do anunciante
- Meus anúncios
- Novo anúncio
- Edição de anúncio
- Fluxo de envio para aprovação

### Quando editar

Editar quando quiser mudar:

- Layout do painel do anunciante
- Formulário de novo anúncio
- Texto de orientação do vendedor
- Organização dos campos

### Cuidado

Painel tem autenticação, Supabase, upload e dados reais. Separar visual de lógica.

---

## 17. Admin

### Arquivos principais

- `components/AdminLayout.tsx`
- `components/AdminMenu.tsx`
- `app/admin/page.tsx`
- `app/admin/pendentes/page.tsx`
- `app/admin/anuncios/page.tsx`
- `app/admin/usuarios/page.tsx`
- `app/admin/aparencia/page.tsx`

### O que controla

- Layout escuro do admin
- Menu administrativo
- Pendentes
- Todos anúncios
- Usuários
- Aparência do site
- Ver site público
- Sair

### Quando editar

Editar quando quiser mudar:

- Organização do admin
- Nome dos itens do menu
- Aparência da área administrativa
- Clareza para aprovar/reprovar anúncios

### Cuidado

Não misturar visual do admin com segurança, RLS, permissões ou banco.

---

## 18. Aparência configurável pelo admin

### Arquivo provável

- `app/admin/aparencia/page.tsx`

### O que pode controlar

- Configurações visuais futuras
- Identidade do site
- Textos e aparência se forem editáveis

### Quando editar

Editar quando quiser criar controle visual pelo painel, por exemplo:

- Cor principal configurável
- Texto do hero configurável
- Logo configurável
- WhatsApp padrão configurável

### Cuidado

Antes de criar aparência dinâmica, definir se isso vai vir do banco ou arquivo fixo.

---

## 19. SEO, metadados e confiança no Google

### Arquivos principais prováveis

- `app/layout.tsx`
- `app/robots.ts` ou `public/robots.txt`
- `app/sitemap.ts` ou `public/sitemap.xml`
- `app/anuncios/[id]/page.tsx`

### O que controla

- Título global
- Descrição global
- Open Graph
- Favicon
- Canonical
- SEO dos anúncios
- Bloqueio de páginas privadas no Google

### Quando editar

Editar quando quiser mudar:

- Como o site aparece no Google
- Como aparece ao compartilhar link no WhatsApp/Facebook
- Indexação de páginas públicas
- Bloqueio de admin/painel/login

### Cuidado

Não misturar SEO com visual.

---

## 20. Imagens públicas, logo e assets

### Pasta principal

- `public/`

### Arquivos importantes conhecidos

- `public/logo-horizontal-web.png`
- `public/og-caminhoesavenda.png`

### O que controla

- Logo do site
- Imagem de compartilhamento
- Favicon, se existir
- Imagens estáticas públicas

### Quando editar

Editar quando quiser trocar:

- Logo
- Marca visual
- Imagem Open Graph
- Ícones
- Favicon

---

## Mapa rápido por objetivo

### Quero mudar a cor do site

Editar primeiro:

- `app/globals.css`

Observar:

- `app/typography.css`

---

### Quero mudar fonte/títulos

Editar:

- `app/typography.css`

Testar:

- `/`
- `/anuncios`
- `/anuncios/[id]`
- `/anunciar`
- `/sobre`

---

### Quero mudar menu público

Editar:

- `components/PublicHeader.tsx`
- `app/globals.css`

Testar:

- desktop
- celular
- menu aberto
- `/`
- `/anuncios`
- `/anunciar`
- `/sobre`
- `/login`

---

### Quero mudar a home

Editar:

- `components/theme/HeroMarketplace.tsx` para texto/hero
- `app/page.tsx` para estrutura/categorias
- `components/theme/FeaturedAds.tsx` para destaques

Não mexer:

- Supabase, se for só visual

---

### Quero mudar a listagem de anúncios

Editar:

- `app/anuncios/page.tsx`
- `components/theme/SearchMarketplace.tsx`
- `components/theme/TruckCard.tsx`
- `app/globals.css`

Cuidado:

- `app/anuncios/page.tsx` tem lógica de filtro e Supabase.

---

### Quero mudar os cards

Editar:

- `components/theme/TruckCard.tsx`
- `app/globals.css`
- `app/typography.css` se for fonte/preço

Testar:

- home
- `/anuncios`
- celular

---

### Quero mudar fotos/galeria

Editar:

- `components/theme/TruckCard.tsx`
- `components/theme/AdGallery.tsx`
- `app/globals.css`

Testar:

- card da home
- card da listagem
- detalhe do anúncio

---

### Quero mudar a página individual do anúncio

Editar:

- `app/anuncios/[id]/page.tsx`
- `components/theme/AdGallery.tsx`
- `app/globals.css`

Testar:

- clicar em Ver detalhes em anúncio real
- WhatsApp
- galeria
- ficha técnica
- mobile

---

### Quero mudar páginas de confiança

Editar:

- `app/anunciar/page.tsx`
- `app/sobre/page.tsx`
- `app/como-funciona/page.tsx`
- `app/globals.css` para classes `trust-*`

Não fazer:

- Não recriar CSS inline repetido.

---

### Quero mudar admin

Editar:

- `components/AdminLayout.tsx`
- `components/AdminMenu.tsx`
- páginas dentro de `app/admin/`

Cuidado:

- Admin é separado do visual público.

---

## Ordem segura para futuras melhorias visuais

1. Definir exatamente qual área vai mudar
2. Abrir este mapa
3. Editar apenas os arquivos daquela área
4. Não misturar visual com banco/login/Supabase
5. Testar página afetada
6. Testar celular
7. Testar desktop
8. Só depois avançar para outra área

---

## Checklist final depois de qualquer mudança visual

Testar:

- `/`
- `/anuncios`
- clicar em `Ver detalhes` em um anúncio real
- `/anunciar`
- `/sobre`
- `/como-funciona`
- `/login`
- `/cadastro`
- `/conta`
- `/painel`
- `/admin`

Confirmar:

- Menu abre no celular
- Botão Anunciar aparece
- Botão Entrar aparece
- Cards continuam alinhados
- Fotos continuam centralizadas
- WhatsApp aparece
- Página de detalhe abre
- Login abre
- Cadastro abre
- Conta/painel/admin continuam protegidos quando deslogado
- Não apareceu erro 404/500
- Não mexeu em Supabase sem querer

---

## Decisão atual do projeto

Visual aprovado em 03/06/2026.

Este mapa existe para melhorias futuras. Não significa que precisa mexer agora.

Prioridade daqui para frente:

1. Manter o visual aprovado
2. Melhorar só quando houver objetivo claro
3. Evitar retrabalho
4. Não quebrar o que já está funcionando
