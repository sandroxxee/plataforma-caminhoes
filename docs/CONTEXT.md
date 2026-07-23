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
app/loja/[slug]   → vitrine pública exclusiva da revenda/loja parceira
app/admin/        → painel administrativo (revendas, planos, assinaturas, métricas, push, IA Gemini, dev tools, divulgação em massa)
app/api/          → rotas de API (loja, gemini/preco, avaliacoes, revendas, planos, assinaturas, metricas, notificacoes)
components/       → componentes reutilizáveis
components/theme/ → componentes visuais do marketplace público (StorefrontHeader, IaPriceAdvisor, TruckCard)
lib/              → utils, Supabase, helpers (gerarSlugUltraLimpo em slug.ts)
public/           → assets estáticos
scripts/          → scripts de manutenção
supabase/         → migrations SQL
```

---

## ⚙️ Regras obrigatórias
- `"use client"` em todo componente com hooks/estado
- CSS via variáveis globais em `globals.css` e CSS modules/estilo unificado
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

### FASE 2 & 3 — Módulos & Otimizações ✅ CONCLUÍDAS
| Componente / Rota | Descrição |
|---|---|
| `lib/slug.ts` (`gerarSlugUltraLimpo`) | Gerador de link ultra limpo contendo **apenas marca + modelo** (ex: `caminhoesavenda.com/anuncios/volvofh540`), sem números de ano/cidade, sem hífens internos desnecessários e sem ID no final |
| `AdminDivulgacaoMassaClient.tsx` | Divulgação em massa com links ultra-curtos apenas com marca e modelo para máxima clareza no WhatsApp |
| `app/loja/[slug]` & `StorefrontHeader.tsx` | Vitrine pública exclusiva da loja parceira com banner, logo, dados e estoque próprio |
| `app/api/gemini/preco` & `IaPriceAdvisor.tsx` | Avaliação de preços de mercado com IA Gemini (mínimo, média e máximo) |
| `app/api/avaliacoes` & `20260722000002_avaliacoes_lojas.sql` | Sistema de avaliações de revenda com nota 1 a 5 estrelas e depoimentos |
| `components/FavoritoButton.tsx` | Botão ❤️ toggle favorito com auth redirect |
| `supabase/migrations/20260722000001_expansao_plataforma.sql` | Schema SQL completo do banco de dados |
| `app/api/revendas` & `app/admin/revendas` | Módulo de gestão de revendas e selo de verificação |
| `app/api/planos` & `app/admin/planos` | Módulo de gestão de planos de assinatura e limites |
| `app/api/assinaturas` & `app/admin/assinaturas` | Controle de assinaturas e comprovante PIX |
| `app/api/metricas` & `app/admin/metricas` | Relatórios de conversão, visualizações e cliques WhatsApp |
| `app/api/notificacoes` & `app/admin/notificacoes` | Disparo de Push Notifications via Expo Mobile |
| `app/api/gemini` & `app/admin/assistente` | Chat com Assistente IA Gemini no admin |
| `app/api/feature-flags` & `app/admin/desenvolvedor` | Painel Dev com Feature Flags e logs de auditoria |
| `app/caminhoes/[id]` & `AdGallery.tsx` | Novo layout moderno para detalhes do anúncio baseado no mockup com especificações em 2 colunas, botões pill arredondados e galeria otimizada |


---

## 💬 Como usar com qualquer IA
No início de cada chat novo:
> **"Leia o CONTEXT.md do repo sandroxxee/plataforma-caminhoes e continue o roadmap de onde paramos."**
