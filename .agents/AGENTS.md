# 🚛 DIRETRIZES DO PROJETO - CAMINHÕES À VENDA (AI STARTUP GUIDE)

Este arquivo é lido automaticamente no início de cada conversa para garantir respostas precisas e contextualizadas.

---

## 🛠️ STACK TECNOLÓGICA OFICIAL
- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript
- **Interface & Estilização:** React 19 + Tailwind CSS + CSS Variables (`var(--blue)`, `var(--surface)`, etc.)
- **Banco de Dados & Autenticação:** Supabase (PostgreSQL na nuvem com Row Level Security)
- **Ambiente de Execução:** Node.js `>= 22.x` (NÃO usa PHP, Apache ou MySQL)
- **Deploy:** Vercel (push na branch `main` = deploy automático)

---

## 🎨 SISTEMA DE TEMAS & RESPONSIVIDADE
- **Temas:** Light Mode (Claro) e Dark Mode (Escuro) dinâmicos em `lib/themes.ts`.
- **Navegação Mobile:** `PublicHeaderClient.tsx` oculta menus extensos em telas `<= 900px` e aciona gaveta deslizante + barra inferior fixa (`components/MobileBottomNav.tsx`).
- **Cards de Caminhões (`TruckCard.tsx`):** 3-4 colunas no Desktop, 2 colunas compactas no Mobile (`<= 640px`).
- **Filtros (`AnunciosSidebar.tsx` / `MobileFilterDrawer.tsx`):** Sidebar fixa no Desktop, Drawer deslizante no Mobile.

---

## ⚙️ REGRAS OBRIGATÓRIAS DE DESENVOLVIMENTO
1. **Padrão Client Components:** Incluir `"use client"` em todos os componentes React com estado ou hooks.
2. **Estilização Consistente:** Priorizar variáveis CSS globais definidas em `app/globals.css`.
3. **Dados Reais:** Nunca inventar números, estatísticas ou mocks fictícios — consumir diretamente do Supabase.
4. **Preservar Autenticação:** Não alterar regras do Supabase/SSR sem validação prévia.
5. **Atualização do Estado:** Sempre manter o `docs/CONTEXT.md` atualizado ao concluir novas etapas do roadmap.

---

## 📂 DOCUMENTAÇÃO DE REFERÊNCIA
- `docs/CONTEXT.md` — Histórico detalhado de fases concluídas e roadmap futuro.
- `docs/MAPA_VISUAL_LAYOUT_E_TEMPLATES.md` — Guia visual de onde alterar cada componente.
- `docs/AUDITORIA.md` — Relatório de saúde técnica e infraestrutura.
