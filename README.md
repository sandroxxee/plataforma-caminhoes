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
