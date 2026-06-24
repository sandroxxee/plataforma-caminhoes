# ⚠️ ATENÇÃO — Este projeto deve ser movido

Esta pasta contém um app **React Native / Expo** completo que está incorretamente
armazenado dentro do repositório da plataforma web (Next.js).

## Por que isso é um problema?

- O TypeScript do projeto web tenta compilar arquivos React Native (tipos incompatíveis)
- Commits acidentais de artefatos do Expo podem poluir o repositório web
- Os dois projetos têm ciclos de vida, dependências e deploys completamente diferentes

## O que fazer

### Passo 1 — Criar o novo repositório
Acesse [github.com/new](https://github.com/new) e crie:
- Nome: `plataforma-caminhoes-mobile`
- Privado: sim
- Não inicializar com README

### Passo 2 — Mover o código (execute no terminal)
```bash
# Na pasta raiz do projeto web
cp -r mobile /tmp/plataforma-caminhoes-mobile
cd /tmp/plataforma-caminhoes-mobile
git init
git add .
git commit -m "feat: migrar app mobile para repositório dedicado"
git remote add origin https://github.com/sandroxxee/plataforma-caminhoes-mobile.git
git push -u origin main
```

### Passo 3 — Remover deste repositório
```bash
# De volta na pasta do projeto web
git rm -r mobile/
git commit -m "fix(#30): remover pasta mobile/ — migrada para repositório próprio"
git push
```

## Status atual
- `tsconfig.json` já exclui esta pasta (build não é contaminado)
- `.gitignore` já ignora artefatos de build do Expo gerados aqui
- A migração final (passo 2 e 3) precisa ser feita manualmente
