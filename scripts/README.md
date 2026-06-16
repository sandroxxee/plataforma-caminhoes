# Scripts utilitários

## download-logos.mjs

Baixa logos SVG das marcas de caminhões, implementos e máquinas de fontes públicas e gera `public/marcas.json`.

### Como usar

```bash
node scripts/download-logos.mjs
```

> Não precisa instalar nada — usa apenas módulos nativos do Node.js (`fs`, `https`, `path`).

### O que faz

1. Tenta baixar cada SVG da URL direta configurada (Wikimedia Commons)
2. Fallback: tenta o [Simple Icons CDN](https://simpleicons.org)
3. Se nenhum funcionar: gera um SVG placeholder com a inicial da marca
4. Salva todos os SVGs em `/public/logos/<slug>.svg`
5. Gera `/public/marcas.json` com:

```json
[
  {
    "nome": "Scania",
    "slug": "scania",
    "categoria": "caminhoes",
    "logo": "/logos/scania.svg"
  }
]
```

### Adicionar nova marca

Edite o array `MARCAS` em `download-logos.mjs` e rode o script novamente.

### Categorias disponíveis

| Categoria | Exemplos |
|---|---|
| `caminhoes` | Mercedes-Benz, Scania, Volvo |
| `implementos` | Randon, Guerra, Librelato |
| `maquinas` | Caterpillar, Komatsu, John Deere |

## project-overview.js

Gera um resumo completo do projeto para usar como contexto em uma conversa nova com uma IA.

### Como usar

```bash
npm run overview
```

O script cria o arquivo:

- `project-overview.md`

## project-status.js

Gera um resumo do estado atual do projeto, incluindo:

- arquivos e pastas principais presentes ou ausentes
- contagem de arquivos `app`, `components`, `lib` e `public`
- scripts disponíveis em `package.json`
- dependências e devDependencies
- informações do Git (branch, commit e estado da working tree)

### Como usar

```bash
npm run status
```

O script cria dois arquivos na raiz do projeto:

- `project-status.json`
- `project-status.md`

## verify-project.js

Roda validações do projeto antes de enviar alterações.

### O que faz

- executa `npm run lint`
- executa `npm run build`
- verifica se há alterações de Git não commitadas

### Como usar

```bash
npm run verify
```

## doctor.js

Verifica o ambiente local e os arquivos principais do projeto.

### Como usar

```bash
npm run doctor
```

## install-git-hooks.js

Configura os hooks Git locais para usar o hook pré-commit em `.githooks/pre-commit`.

### Como usar

```bash
npm run install-hooks
```
