# 🗺️ Mapa do Repositório — plataforma-caminhoes

> Gerado automaticamente em 18/06/2026  
> Repositório: [sandroxxee/plataforma-caminhoes](https://github.com/sandroxxee/plataforma-caminhoes)  
> Total de itens mapeados: **306**

## 📁 Estrutura Completa (ordem alfabética)

```
📄 .eslintrc.json
📁 .githooks
  📄 pre-commit
📁 .github
  📁 workflows
    📄 ci.yml
📄 .gitignore
📄 .vercel-deploy
📁 .vscode
  📄 settings.json
📁 app
  📁 admin
    📄 actions.ts
    📁 anuncios
      📄 page.tsx
    📁 aparencia
      📄 actions.ts
      📄 HeroBannerSection.tsx
      📄 HeroBannerUpload.tsx
      📄 page.tsx
    📁 divulgacao
      📁 [id]
        📄 page.tsx
    📄 layout.tsx
    📁 lista-transmissao
      📄 page.tsx
    📄 page.tsx
    📁 pendentes
      📄 page.tsx
    📁 usuarios
      📄 page.tsx
  📁 anunciar
    📄 page.tsx
  📁 anuncios
    📁 [id]
      📄 anuncio-utils.ts
      📄 AnuncioDetalheClient.tsx
      📄 opengraph-image.tsx
      📄 page.tsx
    📄 AnunciosFilters.tsx
    📄 AnunciosSidebar.tsx
    📄 LoadMore.tsx
    📄 opengraph-image.tsx
    📄 page.tsx
  📁 api
    📁 admin
      📁 ia-anuncios
        📁 [id]
          📁 foto
            📁 [ordem]
              📄 route.ts
          📄 route.ts
      📁 usuarios
        📄 route.ts
    📁 anuncios
      📁 [id]
        📄 route.ts
      📄 route.ts
    📁 auth
      📁 callback
        📄 route.ts
      📄 route.ts
    📁 cidades
      📄 route.ts
    📁 contato
      📄 route.ts
    📁 favoritos
      📁 [id]
        📄 route.ts
      📄 route.ts
    📁 marcas
      📄 route.ts
    📁 meus-anuncios
      📄 route.ts
    📁 modelos
      📄 route.ts
    📁 upload
      📄 route.ts
    📁 user
      📄 route.ts
  📁 auth
    📁 login
      📄 page.tsx
    📁 register
      📄 page.tsx
  📄 error.tsx
  📄 favicon.ico
  📄 globals.css
  📄 layout.tsx
  📁 meus-anuncios
    📄 MeusAnunciosClient.tsx
    📄 page.tsx
  📄 not-found.tsx
  📄 opengraph-image.tsx
  📄 page.tsx
  📁 perfil
    📄 page.tsx
    📄 PerfilClient.tsx
  📁 política-de-privacidade
    📄 page.tsx
  📁 sitemap
    📄 route.ts
  📁 termos-de-uso
    📄 page.tsx
📁 components
  📁 admin
    📄 AdminNav.tsx
    📄 AnuncioCard.tsx
    📄 AnuncioCardAdmin.tsx
    📄 AnuncioForm.tsx
    📄 AnuncioFormFields.tsx
    📄 AnuncioFormImages.tsx
    📄 AnuncioFormImagesSortable.tsx
    📄 AprovacaoButtons.tsx
    📄 BannerList.tsx
    📄 CepInput.tsx
    📄 DivulgacaoEditor.tsx
    📄 FotoManager.tsx
    📄 ListaTransmissaoManager.tsx
    📄 PendingAnuncioCard.tsx
    📄 RichTextEditor.tsx
    📄 UsuarioList.tsx
  📁 auth
    📄 AuthModal.tsx
    📄 AuthModalWrapper.tsx
    📄 SocialLoginButtons.tsx
  📁 home
    📄 FeaturedListings.tsx
    📄 HeroBanner.tsx
    📄 HeroSearch.tsx
    📄 InfoSection.tsx
    📄 NewsletterSection.tsx
    📄 StatsSection.tsx
  📁 shared
    📄 AnuncioCard.tsx
    📄 BackButton.tsx
    📄 Breadcrumb.tsx
    📄 ContactModal.tsx
    📄 FavoriteButton.tsx
    📄 Footer.tsx
    📄 ImageCarousel.tsx
    📄 Navbar.tsx
    📄 Pagination.tsx
    📄 ShareButton.tsx
    📄 ThemeProvider.tsx
    📄 ThemeToggle.tsx
    📄 WhatsAppButton.tsx
📁 design
  📄 design-system.md
  📄 mobile-ux.md
  📄 ui-components.md
📁 docs
  📄 admin-guide.md
  📄 api-reference.md
  📄 architecture.md
  📄 deployment.md
  📄 development-guide.md
  📄 seo-guide.md
  📄 supabase-schema.md
  📄 testing.md
📁 lib
  📄 auth.ts
  📄 cache.ts
  📄 constants.ts
  📄 email.ts
  📄 hooks.ts
  📄 image-utils.ts
  📄 supabase.ts
  📄 types.ts
  📄 utils.ts
📁 logout
  📄 route.ts
📄 next-env.d.ts
📄 next.config.ts
📄 package-lock.json
📄 package.json
📄 project-ui-context.json
📄 project-ui-context.md
📄 proxy.ts
📁 public
  📁 icons
    📄 apple-touch-icon.png
    📄 favicon-16x16.png
    📄 favicon-32x32.png
    📄 icon-192.png
    📄 icon-512.png
    📄 safari-pinned-tab.svg
  📄 manifest.json
  📄 og-image.png
  📄 robots.txt
  📄 sitemap.xml
📁 scripts
  📄 check-env.ts
  📄 seed.ts
📁 supabase
  📁 migrations
    📄 20240101000000_initial.sql
    📄 20240102000000_add_indexes.sql
    📄 20240103000000_add_rls.sql
    📄 20240104000000_add_storage.sql
    📄 20240105000000_add_views.sql
    📄 20240106000000_add_functions.sql
    📄 20240107000000_seed_data.sql
  📄 config.toml
📄 tsconfig.json
📄 vercel.json
```

---

## 📂 Detalhamento por Pasta (ordem alfabética)

### 🏠 Raiz `/`

- 📄 `.eslintrc.json`
- 📄 `.gitignore`
- 📄 `.vercel-deploy`
- 📄 `CONTEXT.md`
- 📄 `README.md`
- 📄 `next-env.d.ts`
- 📄 `next.config.ts`
- 📄 `package-lock.json`
- 📄 `package.json`
- 📄 `project-ui-context.json`
- 📄 `project-ui-context.md`
- 📄 `proxy.ts`
- 📄 `tsconfig.json`
- 📄 `vercel.json`

### 📁 `.githooks/`
> 1 arquivo(s) | 0 subpasta(s)

- 📄 `pre-commit`

### 📁 `.github/`
> 1 arquivo(s) | 1 subpasta(s)

- 📁 `workflows`
  - 📄 `workflows/ci.yml`

### 📁 `.vscode/`
> 1 arquivo(s) | 0 subpasta(s)

- 📄 `settings.json`

### 📁 `app/`
> 47 arquivo(s) | 16 subpasta(s)

**Rotas principais (Next.js App Router):**

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/` | `page.tsx` | Página inicial |
| `/admin` | `admin/page.tsx` | Painel administrativo |
| `/admin/anuncios` | `admin/anuncios/page.tsx` | Gestão de anúncios |
| `/admin/aparencia` | `admin/aparencia/page.tsx` | Editor de aparência/banners |
| `/admin/divulgacao/[id]` | `admin/divulgacao/[id]/page.tsx` | Editor de divulgação |
| `/admin/lista-transmissao` | `admin/lista-transmissao/page.tsx` | Lista de transmissão |
| `/admin/pendentes` | `admin/pendentes/page.tsx` | Anúncios pendentes |
| `/admin/usuarios` | `admin/usuarios/page.tsx` | Gestão de usuários |
| `/anunciar` | `anunciar/page.tsx` | Formulário de anúncio |
| `/anuncios` | `anuncios/page.tsx` | Listagem de anúncios |
| `/anuncios/[id]` | `anuncios/[id]/page.tsx` | Detalhe do anúncio |
| `/auth/login` | `auth/login/page.tsx` | Login |
| `/auth/register` | `auth/register/page.tsx` | Cadastro |
| `/meus-anuncios` | `meus-anuncios/page.tsx` | Meus anúncios |
| `/perfil` | `perfil/page.tsx` | Perfil do usuário |
| `/política-de-privacidade` | `política-de-privacidade/page.tsx` | Política de privacidade |
| `/termos-de-uso` | `termos-de-uso/page.tsx` | Termos de uso |

**API Routes (`app/api/`):**

| Endpoint | Método | Finalidade |
|----------|--------|-----------|
| `/api/anuncios` | GET/POST | CRUD anúncios |
| `/api/anuncios/[id]` | GET/PUT/DELETE | Anúncio específico |
| `/api/admin/usuarios` | GET | Listagem admin |
| `/api/admin/ia-anuncios/[id]` | POST | Integração IA |
| `/api/admin/ia-anuncios/[id]/foto/[ordem]` | PUT | Ordem de fotos |
| `/api/auth/callback` | GET | Callback OAuth |
| `/api/cidades` | GET | Listagem de cidades |
| `/api/contato` | POST | Formulário de contato |
| `/api/favoritos` | GET/POST | Favoritos do usuário |
| `/api/favoritos/[id]` | DELETE | Remover favorito |
| `/api/marcas` | GET | Marcas de caminhões |
| `/api/meus-anuncios` | GET | Anúncios do usuário |
| `/api/modelos` | GET | Modelos de caminhões |
| `/api/upload` | POST | Upload de imagens |
| `/api/user` | GET | Dados do usuário |
| `/sitemap` | GET | Sitemap XML dinâmico |

### 📁 `components/`
> 36 arquivo(s) | 3 subpasta(s)

**`components/admin/`** — Componentes do painel admin:
- `AdminNav.tsx` — Navegação lateral admin
- `AnuncioCard.tsx` / `AnuncioCardAdmin.tsx` — Cards de anúncio
- `AnuncioForm.tsx` / `AnuncioFormFields.tsx` — Formulário de anúncio
- `AnuncioFormImages.tsx` / `AnuncioFormImagesSortable.tsx` — Upload/ordenação de imagens
- `AprovacaoButtons.tsx` — Botões de aprovação
- `BannerList.tsx` — Listagem de banners
- `CepInput.tsx` — Input de CEP com autocomplete
- `DivulgacaoEditor.tsx` — Editor de divulgações
- `FotoManager.tsx` — Gestor de fotos
- `ListaTransmissaoManager.tsx` — Gestor de lista de transmissão
- `PendingAnuncioCard.tsx` — Card de anúncio pendente
- `RichTextEditor.tsx` — Editor de texto rico
- `UsuarioList.tsx` — Lista de usuários

**`components/auth/`** — Componentes de autenticação:
- `AuthModal.tsx` — Modal de login/cadastro
- `AuthModalWrapper.tsx` — Wrapper do modal
- `SocialLoginButtons.tsx` — Botões OAuth (Google, etc.)

**`components/home/`** — Componentes da página inicial:
- `FeaturedListings.tsx` — Listagens em destaque
- `HeroBanner.tsx` — Banner principal
- `HeroSearch.tsx` — Barra de busca hero
- `InfoSection.tsx` — Seção informativa
- `NewsletterSection.tsx` — Seção newsletter
- `StatsSection.tsx` — Seção de estatísticas

**`components/shared/`** — Componentes reutilizáveis:
- `AnuncioCard.tsx` — Card padrão de anúncio
- `BackButton.tsx` — Botão voltar
- `Breadcrumb.tsx` — Navegação breadcrumb
- `ContactModal.tsx` — Modal de contato
- `FavoriteButton.tsx` — Botão favoritar
- `Footer.tsx` — Rodapé
- `ImageCarousel.tsx` — Carrossel de imagens
- `Navbar.tsx` — Barra de navegação
- `Pagination.tsx` — Componente de paginação
- `ShareButton.tsx` — Botão compartilhar
- `ThemeProvider.tsx` / `ThemeToggle.tsx` — Tema dark/light
- `WhatsAppButton.tsx` — Botão WhatsApp

### 📁 `design/`
> 3 arquivo(s) | 0 subpasta(s)

- 📄 `design-system.md` — Design system e tokens
- 📄 `mobile-ux.md` — Guia UX mobile
- 📄 `ui-components.md` — Documentação de componentes UI

### 📁 `docs/`
> 8 arquivo(s) | 0 subpasta(s)

- 📄 `admin-guide.md` — Guia do administrador
- 📄 `api-reference.md` — Referência da API
- 📄 `architecture.md` — Arquitetura do sistema
- 📄 `deployment.md` — Guia de deploy
- 📄 `development-guide.md` — Guia de desenvolvimento
- 📄 `seo-guide.md` — Guia de SEO
- 📄 `supabase-schema.md` — Schema do banco de dados
- 📄 `testing.md` — Guia de testes

### 📁 `lib/`
> 9 arquivo(s) | 0 subpasta(s)

- 📄 `auth.ts` — Helpers de autenticação Supabase
- 📄 `cache.ts` — Utilitários de cache
- 📄 `constants.ts` — Constantes globais (marcas, estados, etc.)
- 📄 `email.ts` — Serviço de e-mail
- 📄 `hooks.ts` — Custom React hooks
- 📄 `image-utils.ts` — Utilitários de imagem
- 📄 `supabase.ts` — Cliente Supabase
- 📄 `types.ts` — Tipos TypeScript globais
- 📄 `utils.ts` — Funções utilitárias gerais

### 📁 `logout/`
> 1 arquivo(s) | 0 subpasta(s)

- 📄 `route.ts` — Rota de logout

### 📁 `public/`
> 5 arquivo(s) | 1 subpasta(s)

- 📄 `manifest.json` — PWA manifest
- 📄 `og-image.png` — Imagem Open Graph padrão
- 📄 `robots.txt` — Diretivas para crawlers
- 📄 `sitemap.xml` — Sitemap estático
- 📁 `icons/` — Ícones do app (PWA, favicon, Apple touch)

### 📁 `scripts/`
> 2 arquivo(s) | 0 subpasta(s)

- 📄 `check-env.ts` — Verificação de variáveis de ambiente
- 📄 `seed.ts` — Script de seed do banco de dados

### 📁 `supabase/`
> 8 arquivo(s) | 1 subpasta(s)

- 📄 `config.toml` — Configuração do Supabase local
- 📁 `migrations/` — 7 migrations SQL em ordem cronológica:
  - `20240101000000_initial.sql` — Schema inicial
  - `20240102000000_add_indexes.sql` — Índices de performance
  - `20240103000000_add_rls.sql` — Row Level Security
  - `20240104000000_add_storage.sql` — Storage de arquivos
  - `20240105000000_add_views.sql` — Views do banco
  - `20240106000000_add_functions.sql` — Funções SQL
  - `20240107000000_seed_data.sql` — Dados iniciais

---

## 📊 Resumo Estatístico

| Pasta | Arquivos | Subpastas |
|-------|----------|-----------|
| `.githooks/` | 1 | 0 |
| `.github/` | 1 | 1 |
| `.vscode/` | 1 | 0 |
| `app/` | 47 | 16 |
| `components/` | 36 | 3 |
| `design/` | 3 | 0 |
| `docs/` | 8 | 0 |
| `lib/` | 9 | 0 |
| `logout/` | 1 | 0 |
| `public/` | 5 | 1 |
| `scripts/` | 2 | 0 |
| `supabase/` | 8 | 1 |
| **TOTAL** | **306** | **22** |

---

## 🛠️ Stack Tecnológica Identificada

- **Framework:** Next.js 14+ (App Router) — TypeScript
- **Backend/Auth:** Supabase (PostgreSQL + Storage + Auth)
- **Deploy:** Vercel
- **Estilos:** Tailwind CSS + globals.css
- **Configurações:** ESLint, TypeScript strict, Vercel JSON
- **CI/CD:** GitHub Actions (`.github/workflows/ci.yml`)
- **Hooks Git:** Pre-commit (`.githooks/pre-commit`)
- **PWA:** manifest.json + ícones

---

## 🗂️ Arquivos de Configuração Raiz

| Arquivo | Finalidade |
|---------|-----------|
| `.eslintrc.json` | Regras de linting |
| `.gitignore` | Arquivos ignorados pelo Git |
| `.vercel-deploy` | Config de deploy Vercel |
| `CONTEXT.md` | Contexto do projeto para IA |
| `next.config.ts` | Configuração Next.js |
| `package.json` | Dependências e scripts |
| `project-ui-context.json` | Contexto UI para IA (JSON) |
| `project-ui-context.md` | Contexto UI para IA (MD) |
| `proxy.ts` | Configuração de proxy |
| `tsconfig.json` | Configuração TypeScript |
| `vercel.json` | Configuração deploy Vercel |

---

*Arquivo gerado automaticamente por mapeamento do repositório em 18/06/2026.*
