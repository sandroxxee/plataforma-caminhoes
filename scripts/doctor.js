#!/usr/bin/env node
const { execSync } = require('child_process');
const { existsSync, readFileSync } = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const packagePath = path.join(root, 'package.json');

function run(command) {
  return execSync(command, { cwd: root, encoding: 'utf8' }).trim();
}

function exists(name) {
  const target = path.isAbsolute(name) ? name : path.join(root, name);
  return existsSync(target);
}

function main() {
  console.log('=== Doctor do Projeto ===');

  console.log(`Node: ${process.version}`);
  try {
    console.log(`NPM: ${run('npm --version')}`);
  } catch (error) {
    console.error('Não foi possível obter a versão do npm');
  }

  if (!exists(packagePath)) {
    console.error('Erro: package.json não encontrado.');
    process.exit(1);
  }

  const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
  console.log(`Projeto: ${pkg.name || '(sem nome)'}@${pkg.version || '(sem versão)'}`);

  const recommendedNode = 18;
  const currentNode = parseInt(process.version.replace(/^v/, ''), 10);
  if (Number.isNaN(currentNode) || currentNode < recommendedNode) {
    console.warn(`⚠️  Recomenda-se usar Node.js >= ${recommendedNode}. Atual: ${process.version}`);
  }

  const requiredFiles = ['package.json', 'tsconfig.json', 'next.config.ts', 'vercel.json'];
  requiredFiles.forEach((file) => {
    console.log(`- ${file}: ${exists(file) ? 'presente' : 'ausente'}`);
  });

  console.log('Scripts principais:');
  if (pkg.scripts) {
    Object.keys(pkg.scripts).sort().forEach((script) => {
      console.log(`- ${script}`);
    });
  } else {
    console.log('- nenhum script definido');
  }

  if (!exists('node_modules')) {
    console.warn('⚠️  node_modules não encontrado. Rode npm install antes de usar os scripts.');
  }

  console.log('\nUse `npm run verify` para validar lint/build e `npm run status` para obter o estado do projeto.');
}

main();
