# Plataforma de Anúncios de Caminhões — Base Next.js

Esta é a etapa 3 da rota oficial do projeto:

1. Protótipo visual navigável ✔️
2. Aprovar aparência e fluxo ✔️
3. Criar projeto Next.js ✔️
4. Criar Supabase ⏭️
5. Conectar login
6. Conectar anúncios
7. Criar painel anunciante
8. Criar admin
9. Testar segurança
10. Publicar

## O que este projeto contém

Base visual em Next.js com App Router, TypeScript e rotas principais:

- `/` Home
- `/anuncios` Lista de anúncios
- `/anuncios/[id]` Detalhes
- `/anunciar` Página para anunciar
- `/login` Login visual
- `/cadastro` Cadastro visual
- `/painel` Painel do anunciante
- `/painel/anuncios` Meus anúncios
- `/painel/anuncios/novo` Novo anúncio
- `/admin` Dashboard admin
- `/admin/pendentes` Aprovação
- `/admin/anuncios` Todos os anúncios
- `/admin/usuarios` Usuários

## Importante

Esta base ainda NÃO está conectada ao Supabase.
Ela é a primeira estrutura Next.js para levar o protótipo visual aprovado para dentro da tecnologia final.

## Como rodar no Windows

1. Instale o Node.js LTS.
2. Extraia o ZIP.
3. Abra o terminal dentro da pasta do projeto.
4. Rode:

```bash
npm install
npm run dev
```

5. Abra no navegador:

```text
http://localhost:3000
```

## Validação e fluxo de qualidade

Este projeto já tem validação automática e ferramentas de suporte para evitar erros:

- `npm run check` / `npm run verify`: roda `lint` e `build`.
- `npm run status`: gera um relatório do estado atual do projeto em `project-status.md` e `project-status.json`.
- `npm run overview`: gera um resumo geral do projeto em `project-overview.md` para usar como contexto em uma nova conversa com IA.
- `npm run doctor`: verifica o ambiente local (Node, npm, arquivos principais).
- `npm run install-hooks`: configura o hook de pré-commit local em `.githooks/pre-commit`.
- **`npm run ai-review`**: abre um painel web em tempo real (http://localhost:3333) que:
  - Gera template de prompt estruturado pronto para copiar
  - Monitora mudanças locais em tempo real
  - Valida código automaticamente (imports, tipos, rotas)
  - Cria checklist de validação
  - Permite fazer commit com um clique

### Fluxo com IA e Painel AI Review

1. Rode o painel:

```bash
npm run ai-review
```

2. Browser abre automaticamente em http://localhost:3333 com:
   - Template de prompt estruturado
   - Contexto completo do projeto
   - Validações em tempo real

3. Copie o template → Cole em ChatGPT, Perplexity, etc

4. Receba o código da IA → Cole no seu editor

5. Painel detecta mudanças automaticamente e alerta sobre erros

6. Complete o checklist e clique "🚀 Fazer Commit & Push"

## GitHub Actions

O workflow de CI está em `.github/workflows/ci.yml` e roda em `push` e `pull_request` para `main`:

- `npm ci`
- `npm run lint`
- `npm run build`
- `npm run status`

## Próxima etapa

Criar Supabase:

- projeto Supabase;
- tabelas `profiles`, `trucks`, `truck_images`, `categories`;
- autenticação;
- storage de fotos;
- regras RLS.

## Fixes aplicados

- `proxy.ts`: export renomeado de `middleware` para `proxy` (Next.js 16)
- `app/anuncios/page.tsx`: removido filtro de perfil que escondia anúncios
- `app/api/anuncios/route.ts`: removido mesmo filtro na API do LoadMore
