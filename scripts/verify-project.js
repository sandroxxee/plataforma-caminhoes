#!/usr/bin/env node
const { execSync } = require('child_process');
const { existsSync } = require('fs');

function run(command) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: 'inherit', env: process.env });
}

function isGitRepo() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function checkGitClean() {
  try {
    const status = execSync('git status --short', { encoding: 'utf8' }).trim();
    if (status) {
      console.warn('\n⚠️  Atenção: existem alterações locais não commitadas.');
      console.warn('   Revise antes de subir para o GitHub ou implantar no Vercel.');
    } else {
      console.log('\n✅ Git limpo: sem alterações locais pendentes.');
    }
  } catch (error) {
    console.warn('\n⚠️  Não foi possível verificar o estado do Git.');
  }
}

function main() {
  console.log('=== Verificando o projeto ===');

  if (isGitRepo()) {
    checkGitClean();
  }

  if (!existsSync('package.json')) {
    console.error('Erro: package.json não encontrado.');
    process.exit(1);
  }

  run('npm run lint');
  run('npm run build');

  console.log('\n✅ Verificação concluída com sucesso. O projeto está pronto para GitHub / Vercel.');
}

try {
  main();
} catch (error) {
  console.error('\n❌ Falha na validação do projeto.');
  process.exit(1);
}
