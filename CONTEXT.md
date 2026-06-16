# 🚛 CONTEXT.md — plataforma-caminhoes

> Leia este arquivo ANTES de qualquer ação. Sempre atualize após cada melhoria.

---

## 🧠 O projeto
Marketplace de caminhões, carretas, implementos e máquinas. Foco em venda direta com WhatsApp, anúncios por usuário, painel admin e página pública de listagem.

- **Site:** https://plataforma-caminhoes.vercel.app
- **Stack:** Next.js 14 (App Router), TypeScript, Supabase (auth + db), Vercel (deploy)
- **Repo:** https://github.com/sandroxxee/plataforma-caminhoes
- **Dono:** Sandro Luiz Mayer — Ametista do Sul, RS, BR

---

## 📁 Estrutura
```
app/          → páginas (App Router)
components/   → componentes reutilizáveis
lib/          → utils, Supabase, helpers
public/       → assets estáticos
scripts/      → scripts de manutenção
```

---

## ⚙️ Regras obrigatórias
- `"use client"` em todo componente com hooks/estado
- CSS via `<style>` inline (padrão do projeto, não usar Tailwind)
- Não mexer em auth/Supabase sem avisar
- Não quebrar rotas existentes
- Push no `main` = deploy automático no Vercel
- Sempre atualizar este CONTEXT.md após cada mudança

---

## 🎨 Paleta de cores
| Uso | Cor |
|---|---|
| Primária (confiança) | `#1a3a52` azul escuro |
| CTA (ação) | `#ff6b35` laranja |
| Verificado/Sucesso | `#06a77d` verde |
| Destaque/Ribbon | `#ffc857` amarelo |
| Fundo claro | `#f8f9fa` |

---

## ✅ Já feito
| Componente | Data | Descrição |
|---|---|---|
| `TruckCard.tsx` | 2026-06-16 | Hover zoom, ❤️ favoritar, ⭐ avaliações, ✅ badge verificado, ribbon destaque, 👁️ visualizações, botões lado a lado |
| `CONTEXT.md` | 2026-06-16 | Arquivo de contexto para continuidade com IA |

---

## 🔄 PRs abertos (decidir)
| PR | Título | Decisão |
|---|---|---|
| [#22](https://github.com/sandroxxee/plataforma-caminhoes/pull/22) | Centraliza CSS páginas institucionais | ⏳ Pendente |
| [#21](https://github.com/sandroxxee/plataforma-caminhoes/pull/21) | Revamp /anunciar hero premium | ⏳ Pendente |
| [#5](https://github.com/sandroxxee/plataforma-caminhoes/pull/5) | Vercel Speed Insights | ⏳ Pendente |
| [#4](https://github.com/sandroxxee/plataforma-caminhoes/pull/4) | Vercel Web Analytics | ⏳ Pendente |
| [#2](https://github.com/sandroxxee/plataforma-caminhoes/pull/2) | Visual estilo revenda profissional | ⏳ Pendente |

---

## 🚀 ROADMAP

### 🔴 FASE 1 — Visual moderno (AGORA)
> Objetivo: site visualmente competitivo com OLX/Mercado Livre

| # | Componente | Status |
|---|---|---|
| 1 | `TruckCard.tsx` — avaliações, badge, favoritar | ✅ Feito |
| 2 | `PublicHeaderClient.tsx` — filtros sticky, autocomplete | ❌ Fazer |
| 3 | `HomePage` — Hero + Stats + Grid + CTA | ❌ Fazer |
| 4 | `FilterSidebar` — preço/ano/km/chassi sliders | ❌ Fazer |
| 5 | `SiteFooter.tsx` — links, redes sociais, selos | ❌ Fazer |

### 🟡 FASE 2 — Funcionalidades (PRÓXIMO)
> Objetivo: engajamento e conversão

| # | Feature | Status |
|---|---|---|
| 1 | Sistema de favoritos (salvar no Supabase) | ❌ Fazer |
| 2 | Alerta de preço (notificação por e-mail) | ❌ Fazer |
| 3 | Comparador de caminhões (2-3 lado a lado) | ❌ Fazer |
| 4 | Simulador de financiamento (12x/24x/36x) | ❌ Fazer |
| 5 | Sistema de avaliações (stars + comentários) | ❌ Fazer |
| 6 | Busca com autocomplete (marcas/modelos) | ❌ Fazer |

### 🟢 FASE 3 — Crescimento (FUTURO)
> Objetivo: SEO, performance e escala

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
