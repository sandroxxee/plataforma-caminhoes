# 🚛 CONTEXT.md — plataforma-caminhoes

> Leia este arquivo antes de qualquer ação no projeto.

---

## 🧠 O que é este projeto
Marketplace de caminhões, carretas, implementos e máquinas.
- **Site:** https://plataforma-caminhoes.vercel.app (confirmar URL)
- **Stack:** Next.js 14 (App Router), TypeScript, TailwindCSS, Supabase, Vercel
- **Repo:** https://github.com/sandroxxee/plataforma-caminhoes

---

## 📁 Estrutura principal
```
app/          → páginas (App Router Next.js)
components/   → componentes reutilizáveis
lib/          → utilitários, Supabase, helpers
public/       → assets estáticos
scripts/      → scripts de manutenção
```

---

## ⚙️ Regras do projeto
- Sempre usar `"use client"` em componentes com hooks
- CSS via `<style>` inline nos componentes (padrão existente)
- Não mexer em autenticação/Supabase sem avisar
- Não quebrar rotas existentes
- Deploy automático via Vercel ao fazer push no `main`

---

## ✅ Componentes já melhorados
| Componente | Data | O que foi feito |
|---|---|---|
| `TruckCard.tsx` | 2026-06-16 | Hover zoom, favoritar, avaliações, badge verificado, ribbon destaque, visualizações |

---

## 🔄 PRs abertos (pendentes de decisão)
| PR | Título | Ação sugerida |
|---|---|---|
| #22 | Centraliza CSS páginas institucionais | Revisar e mergear |
| #21 | Revamp /anunciar hero premium | Revisar e mergear |
| #5 | Vercel Speed Insights | Mergear |
| #4 | Vercel Web Analytics | Mergear |
| #2 | Visual estilo revenda profissional | Revisar |

---

## 🚀 Próximos componentes a melhorar (prioridade)
1. `PublicHeaderClient.tsx` — filtros sticky + autocomplete
2. Homepage — Hero + Stats + Grid moderno
3. `FilterSidebar` — filtros avançados lateral
4. `SiteFooter.tsx` — rodapé estilo Mercado Livre

---

## 🎨 Paleta de cores
- Primária: `#1a3a52` (azul escuro)
- CTA: `#ff6b35` (laranja)
- Sucesso/Verificado: `#06a77d` (verde)
- Destaque: `#ffc857` (amarelo)
- Fundo: `#f8f9fa`

---

## 📝 Como usar este arquivo com a IA
No início de cada chat novo, diga:
> "Leia o CONTEXT.md do repo sandroxxee/plataforma-caminhoes e continue de onde paramos."
