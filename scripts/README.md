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
