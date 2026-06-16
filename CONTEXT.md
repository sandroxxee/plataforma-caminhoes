# 🚛 CONTEXT.md — plataforma-caminhoes

> Leia este arquivo ANTES de qualquer ação. Sempre atualize após cada melhoria.

---

## 🧠 O projeto
Marketplace de caminhões, carretas, implementos e máquinas. Foco em venda direta com WhatsApp, anúncios por usuário, painel admin e página pública de listagem.

- **Site:** https://www.caminhoesavenda.com
- **Stack:** Next.js 16 (App Router), TypeScript, Supabase (auth + db), Vercel (deploy)
- **Repo:** https://github.com/sandroxxee/plataforma-caminhoes
- **Dono:** Sandro Luiz Mayer — Ametista do Sul, RS, BR

---

## 📁 Estrutura
```
app/              → páginas (App Router)
components/       → componentes reutilizáveis
components/theme/ → componentes visuais do marketplace público
lib/              → utils, Supabase, helpers
public/           → assets estáticos
scripts/          → scripts de manutenção
supabase/         → migrations SQL
```

---

## ⚙️ Regras obrigatórias
- `"use client"` em todo componente com hooks/estado
- CSS via `<style>` inline (padrão do projeto, não usar Tailwind)
- Não mexer em auth/Supabase sem avisar
- Não quebrar rotas existentes
- Push no `main` = deploy automático no Vercel
- Sempre atualizar este CONTEXT.md após cada mudança
- Nunca inventar números/estatísticas — usar dados reais do Supabase

---

## 🎨 Paleta de cores (CSS vars)
| Variável | Uso |
|---|---|
| `var(--blue)` | Primária, CTAs, links ativos |
| `var(--blueSoft)` | Fundo de itens ativos/hover |
| `var(--text)` | Texto principal |
| `var(--muted)` | Texto secundário |
| `var(--surface)` | Fundo de cards |
| `var(--soft)` | Fundo suave (inputs, ícones) |
| `var(--line)` | Bordas |
| `var(--shadow)` / `var(--shadow2)` | Sombras |

---

## ✅ Já feito

### FASE 1 — Visual moderno ✅ COMPLETA
| Componente | Descrição |
|---|---|
| `components/theme/TruckCard.tsx` | Card completo: hover zoom, ❤️ favoritar, badge verificado, ribbon destaque, visualizações |
| `components/PublicHeaderClient.tsx` | Header sticky, busca, nav desktop/mobile, dark mode, CTA anunciar |
| `app/page.tsx` | HomePage: Hero + StatsSection (dados reais) + BrandsSection + FeaturedAds + HowItWorks |
| `components/theme/StatsSection.tsx` | Contagens reais do Supabase (sem números falsos) |
| `components/theme/BrandsSection.tsx` | Grid de marcas com logos SVG |
| `app/anuncios/AnunciosSidebar.tsx` | FilterSidebar completo: categoria, marca, estado, faixa de preço, salvar busca |
| `components/SiteFooter.tsx` | Footer com links e redes sociais |
| `@vercel/analytics` + `@vercel/speed-insights` | Integrados no layout.tsx |

### FASE 2 — Funcionalidades (em progresso)
| Componente | Descrição |
|---|---|
| `components/FavoritoButton.tsx` | Botão ❤️ toggle favorito com auth redirect |
| `app/api/favoritos/route.ts` | API GET (lista) + POST (toggle) com RLS |
| `app/painel/favoritos/page.tsx` | Página de favoritos no painel do usuário |
| `supabase/migrations/20260616_favoritos.sql` | Migration SQL com tabela + RLS + índices |

---

## 🚀 ROADMAP

### 🔴 FASE 1 — Visual moderno ✅ COMPLETA

### 🟡 FASE 2 — Funcionalidades (EM PROGRESSO)
| # | Feature | Status |
|---|---|---|
| 1 | Sistema de favoritos (salvar no Supabase) | ✅ Feito |
| 2 | Alerta de preço (notificação por e-mail) | ❌ Fazer |
| 3 | Comparador de caminhões (2-3 lado a lado) | ❌ Fazer |
| 4 | Simulador de financiamento (12x/24x/36x) | ❌ Fazer |
| 5 | Sistema de avaliações (stars + comentários) | ❌ Fazer |
| 6 | Busca com autocomplete (marcas/modelos) | ❌ Fazer |

### 🟢 FASE 3 — Crescimento (FUTURO)
| # | Feature | Status |
|---|---|---|
| 1 | SEO avançado (sitemap, schema.org, meta dinâmico) | ❌ Fazer |
| 2 | PWA (instalar no celular) | ❌ Fazer |
| 3 | Painel de analytics (visualizações, cliques WhatsApp) | ❌ Fazer |
| 4 | Plano de destaque pago (integração pagamento) | ❌ Fazer |
| 5 | App mobile (React Native ou PWA avançado) | ❌ Fazer |

---

## 💬 Como usar com qualquer IA
No início de cada chat novo:
> **"Leia o CONTEXT.md do repo sandroxxee/plataforma-caminhoes e continue o roadmap de onde paramos."**
