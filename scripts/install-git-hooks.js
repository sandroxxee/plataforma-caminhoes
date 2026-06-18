#!/usr/bin/env node
const { execSync } = require('child_process');
const { existsSync } = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const hooksPath = path.join(root, '.githooks');

function run(command) {
  execSync(command, { cwd: root, stdio: 'inherit' });
}

function main() {
  if (!existsSync(hooksPath)) {
    console.error('Pasta .githooks não encontrada. Crie o diretório e adicione os hooks.');
    process.exit(1);
  }

  try {
    run('git config core.hooksPath .githooks');
    console.log('Git hooks configurados para .githooks');
  } catch (error) {
    console.error('Não foi possível configurar git hooks.');
    console.error(error.message || error);
    process.exit(1);
  }
}

main();
