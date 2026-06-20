# 🚛 Caminhões à Venda — App Mobile

App mobile moderno para a plataforma de compra e venda de caminhões, desenvolvido com **Expo + React Native** e integrado ao **Supabase**. Design compatível com os padrões de apps bem avaliados de 2026.

## Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Expo | 56 | Framework mobile |
| React Native | 0.86 | UI nativa |
| Expo Router | 56 | Navegação file-based |
| Supabase JS | 2.x | Backend e autenticação |
| Expo Image | 56 | Imagens otimizadas |
| Expo Blur | 56 | Glassmorphism no iOS |
| Expo Haptics | 56 | Feedback tátil |
| React Native Reanimated | 4 | Animações fluidas |

## Estrutura de pastas

```
caminhoes-app/
├── app/
│   ├── _layout.tsx          # Layout raiz (GestureHandler + SafeArea)
│   ├── index.tsx            # Redirect para (tabs)
│   ├── login.tsx            # Tela de login/cadastro/recuperação
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Bottom Navigation Bar (iOS blur + Android)
│   │   ├── index.tsx        # Home: destaques, categorias, recentes
│   │   ├── buscar.tsx       # Busca com filtros (marca, estado, preço)
│   │   ├── favoritos.tsx    # Anúncios salvos (AsyncStorage)
│   │   ├── anuncios.tsx     # Publicar anúncio + planos
│   │   └── perfil.tsx       # Perfil, conta, suporte
│   ├── anuncio/
│   │   └── [id].tsx         # Detalhe do anúncio com galeria
│   └── categoria/
│       └── [slug].tsx       # Listagem por categoria
├── components/
│   ├── AdCard.tsx           # Card de anúncio (grid, list, featured)
│   ├── Header.tsx           # Header com logo e ações
│   ├── SearchBar.tsx        # Barra de busca
│   ├── EmptyState.tsx       # Estado vazio
│   └── BrandChip.tsx        # Chip de filtro de marca
├── lib/
│   ├── supabase.ts          # Cliente Supabase configurado
│   └── theme.ts             # Design system (cores, tipografia, espaçamento)
├── services/
│   └── anuncios.ts          # Queries Supabase (anúncios, favoritos)
├── types/
│   └── anuncio.ts           # Tipos TypeScript + constantes
└── assets/
    └── images/              # Ícones e imagens do app
```

## Instalação

### 1. Clone e instale dependências

```bash
git clone https://github.com/sandroxxee/plataforma-caminhoes caminhoes-app
cd caminhoes-app
pnpm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase (disponíveis em [supabase.com/dashboard](https://supabase.com/dashboard)):

```env
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

### 3. Execute o app

```bash
# Expo Go (desenvolvimento rápido)
pnpm start

# Android
pnpm android

# iOS
pnpm ios
```

## Design System

O app segue os padrões de design de 2026:

**Cores:** Paleta azul primária (`#2563EB`), superfícies neutras, suporte completo a dark mode.

**Tipografia:** Pesos variados (400–900), tamanhos de 11px a 32px, hierarquia clara.

**Bordas:** Arredondadas generosas (`border-radius` de 8px a 28px), estilo "soft edges" 2026.

**Sombras:** Sutis e em camadas, adaptadas para iOS (shadow) e Android (elevation).

**Bottom Navigation:** Barra inferior com blur glassmorphism no iOS e fundo sólido no Android, ícones com estado ativo destacado.

**Thumb-friendly:** Todas as ações principais na metade inferior da tela.

## Funcionalidades

| Tela | Funcionalidades |
|---|---|
| Home | Destaques em carrossel, categorias, marcas, recentes, stats, CTA |
| Busca | Texto livre, filtros por marca/estado/preço, toggle grid/lista |
| Favoritos | Salvar/remover anúncios (AsyncStorage local) |
| Anunciar | Planos (gratuito, destaque, revenda), como funciona, WhatsApp |
| Perfil | Login/cadastro, meus anúncios, alertas, suporte, logout |
| Detalhe | Galeria com dots, especificações, descrição, botão WhatsApp fixo |
| Categoria | Listagem filtrada por tipo de veículo |
| Login | Login, cadastro, recuperação de senha via Supabase Auth |

## Publicação

Para gerar o APK Android ou IPA iOS, use o [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Configurar
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

## Integração com o site Next.js

O app consome o mesmo banco de dados Supabase do site principal. A tabela `trucks` é compartilhada, garantindo que anúncios publicados no site apareçam automaticamente no app.
