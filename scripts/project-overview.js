#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outPath = path.join(root, 'project-overview.md');

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function exists(name) {
  return fs.existsSync(path.join(root, name));
}

function getFiles(dir, exts) {
  const results = [];
  const baseDir = path.join(root, dir);
  if (!fs.existsSync(baseDir)) return results;

  function walk(current) {
    for (const name of fs.readdirSync(current)) {
      const fullPath = path.join(current, name);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (!exts || exts.some(ext => fullPath.endsWith(ext))) {
        results.push(path.relative(root, fullPath).replace(/\\/g, '/'));
      }
    }
  }
  walk(baseDir);
  return results.sort();
}

function getRoutes() {
  const files = getFiles('app', ['.ts', '.tsx']);
  const routeFiles = files.filter(file => file.startsWith('app/'));
  const routes = routeFiles
    .filter(file => /app\\(?:api|.*)\/.*\.(ts|tsx)$/.test(file) || file.endsWith('page.tsx') || file.endsWith('route.ts'))
    .map(file => file.replace(/^app\//, ''));
  return routes;
}

function formatList(list, max = 50) {
  if (!list.length) return ['- (nenhum)'];
  return list.slice(0, max).map(item => `- ${item}`);
}

function toMarkdown(data) {
  const lines = [];
  lines.push('# Visão Geral do Projeto');
  lines.push('');
  lines.push('Este arquivo foi gerado automaticamente para ajudar a iniciar uma conversa com a IA sobre o projeto.');
  lines.push('Ele contém a estrutura principal, scripts, dependências e rotas encontradas.');
  lines.push('');
  lines.push('## Informações gerais');
  lines.push('- Diretório: `' + data.root + '`');
  lines.push('- Nome do pacote: `' + data.package.name + '`');
  lines.push('- Versão: `' + data.package.version + '`');
  lines.push('- Node: `' + data.node + '`');
  lines.push('');
  lines.push('## Scripts disponíveis');
  lines.push(...formatList(data.scripts));
  lines.push('');
  lines.push('## Dependências principais');
  lines.push(...formatList(data.dependencies));
  lines.push('');
  lines.push('## Dev dependências');
  lines.push(...formatList(data.devDependencies));
  lines.push('');
  lines.push('## Pastas importantes');
  for (const [name, present] of Object.entries(data.paths)) {
    lines.push(`- ${name}: ${present ? 'presente' : 'ausente'}`);
  }
  lines.push('');
  lines.push('## Rotas e APIs');
  lines.push(...formatList(data.routes, 200));
  lines.push('');
  lines.push('## Componentes e libs');
  lines.push(`- Arquivos de componente: ${data.counts.components}`);
  lines.push(`- Arquivos de lib: ${data.counts.lib}`);
  lines.push('');
  lines.push('## Arquivos-chave extras');
  lines.push(...formatList(data.keyFiles, 100));
  lines.push('');
  lines.push('## Como usar');
  lines.push('- Execute `npm run overview` para gerar este arquivo atualizando o estado do projeto.');
  lines.push('- Copie e cole o conteúdo deste arquivo em uma nova conversa com a IA.');
  lines.push('- Peça para a IA considerar este contexto antes de sugerir mudanças.');
  lines.push('');
  lines.push('> Observação: a IA não lê este arquivo automaticamente. É preciso fornecer o texto ou os pontos principais na conversa.');
  return lines.join('\n');
}

function main() {
  const pkg = readJSON(path.join(root, 'package.json')) || {};
  const scripts = Object.keys(pkg.scripts || {}).sort();
  const dependencies = Object.keys(pkg.dependencies || {}).sort();
  const devDependencies = Object.keys(pkg.devDependencies || {}).sort();

  const data = {
    root,
    package: {
      name: pkg.name || '(não definido)',
      version: pkg.version || '(não definido)',
    },
    node: process.version,
    scripts,
    dependencies,
    devDependencies,
    paths: {
      'package.json': exists('package.json'),
      'tsconfig.json': exists('tsconfig.json'),
      'next.config.ts': exists('next.config.ts'),
      'vercel.json': exists('vercel.json'),
      '.gitignore': exists('.gitignore'),
      '.vscode': exists('.vscode'),
      'app/': exists('app'),
      'components/': exists('components'),
      'lib/': exists('lib'),
      'public/': exists('public'),
      'scripts/': exists('scripts'),
    },
    routes: getRoutes(),
    counts: {
      components: getFiles('components', ['.ts', '.tsx']).length,
      lib: getFiles('lib', ['.ts', '.tsx']).length,
    },
    keyFiles: [
      'package.json',
      'tsconfig.json',
      'next.config.ts',
      'vercel.json',
      'README.md',
      'scripts/verify-project.js',
      'scripts/project-status.js',
      'scripts/project-overview.js',
      'app/layout.tsx',
      'app/page.tsx',
      'lib/api-auth.ts',
    ].filter(file => exists(file)),
  };

  fs.writeFileSync(outPath, toMarkdown(data) + '\n', 'utf8');
  console.log('Visão geral gerada em:', outPath);
}

main();
