# Status permanente — Plataforma Caminhões à Venda

Este arquivo é a referência viva do projeto. Atualize-o ao concluir cada lote de trabalho, correção ou decisão importante.

## Repositório e produção

- Repositório: `sandroxxee/plataforma-caminhoes`.
- Branch principal: `main`.
- Site: https://www.caminhoesavenda.com
- Banco ativo identificado: Supabase `tvkqoeyhsynvehrpvtmx`.
- Stack: Next.js, React, TypeScript e Supabase.
- O deploy é acionado quando alterações entram na `main`; não considerar uma alteração concluída sem validação no site.

## Objetivo do projeto

Modernizar o marketplace completo, preservando as funções existentes:

- Home, busca, listagens e detalhe dos anúncios.
- Painel do anunciante e criação/edição de anúncios.
- Área administrativa e gestão da plataforma.
- Lojas, revendas, planos e assinaturas.
- Stories, vídeos curtos e espaços para patrocinadores/publicidade.
- Gestão desses recursos no painel e no admin.

## Regras visuais definidas

- Mobile-first.
- Sem hero ou grandes blocos promocionais.
- Sem categorias repetidas na mesma tela.
- Usar apenas títulos de seção: “Oportunidades”, “Em destaque”, “Vídeos”, “Lojas”.
- Sem subtítulos decorativos, frases de efeito ou tutoriais espalhados.
- Mais anúncios e conteúdo útil por tela.
- Mesmo padrão visual em todas as páginas.
- Não substituir o sistema por HTML demonstrativo: trabalhar no código real do repositório.

## Estado atual

### Correções concluídas

- Commit `7fcd3b7`: correção da listagem `/admin/anuncios`.
  - Removida a referência à coluna inexistente `verificado`.
  - Mantidos os selos `destaque` e `abaixo_fipe`.
  - Mantidas as ações de aprovar, reprovar, editar, excluir, vincular à loja, divulgar, Central IA e laudo.
  - A página agora lança erro explícito se a consulta falhar.

### Pendências críticas

- `/admin/anuncios` ainda não abre para o administrador no site publicado.
- É necessário confirmar se o deploy do commit `7fcd3b7` foi concluído.
- É necessário verificar se `SUPABASE_SERVICE_ROLE_KEY` está configurada no ambiente de produção.
- É necessário identificar a mensagem de erro exibida ao acessar `/admin/anuncios`.
- A coluna `verificado` não existe na tabela `trucks`; não voltar a consultá-la sem criar e aplicar uma migração.

### Pendências da reformulação visual

- Base visual: `app/styles/tokens.css`, `base.css`, `layout.css` e `responsive.css`.
- Header e navegação mobile: `components/PublicHeaderClient.tsx`, `app/styles/header.css` e `components/MobileBottomNav.tsx`.
- Home: `app/page.tsx`; remover hero e organizar seções sem duplicar categorias.
- Cards: `components/theme/TruckCard.tsx` e `app/styles/cards.css`.
- Footer: `components/SiteFooter.tsx`.
- Stories, vídeos e patrocinadores: ainda exigem levantamento de dados, APIs e migrações antes da implementação.

## Arquivos prioritários

### Admin

```text
app/admin/anuncios/page.tsx
app/admin/anuncios/AdminAnunciosClient.tsx
app/admin/actions.ts
lib/supabase/service.ts
components/AdminMenu.tsx
```

### Base visual e Home

```text
app/globals.css
app/styles/tokens.css
app/styles/base.css
app/styles/layout.css
app/styles/responsive.css
components/PublicHeaderClient.tsx
components/MobileBottomNav.tsx
app/page.tsx
components/theme/TruckCard.tsx
app/styles/cards.css
components/SiteFooter.tsx
```

## Funções do admin que não podem ser removidas

- Aprovar e reprovar anúncios.
- Editar e excluir anúncios.
- Vincular anúncios em lote ao estoque de lojas parceiras.
- Alternar destaque e abaixo da FIPE.
- Divulgar anúncios aprovados.
- Acessar Central IA e laudo.
- Gerenciar usuários, revendas, planos, assinaturas, métricas, notificações, atendimento, aparência e ferramentas de desenvolvimento.

## Próxima ação

1. Confirmar se o deploy do commit `7fcd3b7` foi concluído.
2. Corrigir a causa do bloqueio de `/admin/anuncios`.
3. Validar se todos os anúncios aparecem para o administrador.
4. Corrigir links quebrados na listagem administrativa.
5. Só depois retomar a reformulação visual, começando por base, header, cards e Home.

## Como registrar novas mudanças

Ao concluir um trabalho, acrescente nesta ordem:

```md
### [data] — [área]

- O que foi alterado.
- Commit ou PR.
- O que foi validado.
- Pendências restantes.
```

Não registre como concluído algo que apenas foi commitado sem validação no site.
