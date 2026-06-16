#!/usr/bin/env node
const { execSync } = require('child_process');
const { existsSync, readdirSync, readFileSync, writeFileSync, statSync } = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outJsonPath = path.join(root, 'project-status.json');
const outMdPath = path.join(root, 'project-status.md');

function exists(name) {
  return existsSync(path.join(root, name));
}

function readPackageJson() {
  const pkgPath = path.join(root, 'package.json');
  if (!existsSync(pkgPath)) return null;
  return JSON.parse(readFileSync(pkgPath, 'utf8'));
}

function isGitRepo() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { cwd: root, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function gitInfo() {
  if (!isGitRepo()) return null;
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: root, encoding: 'utf8' }).trim();
    const status = execSync('git status --short', { cwd: root, encoding: 'utf8' }).trim();
    const commit = execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
    return {
      branch,
      commit,
      clean: status === '',
      status: status || 'clean',
    };
  } catch (error) {
    return { error: String(error) };
  }
}

function countFiles(dir, extensions) {
  const rootDir = path.join(root, dir);
  if (!existsSync(rootDir)) return 0;

  let count = 0;
  function walk(current) {
    for (const name of readdirSync(current)) {
      const fullPath = path.join(current, name);
      const stats = statSync(fullPath);
      if (stats.isDirectory()) {
        walk(fullPath);
      } else if (!extensions || extensions.some(ext => fullPath.endsWith(ext))) {
        count += 1;
      }
    }
  }
  walk(rootDir);
  return count;
}

function summarize() {
  const pkg = readPackageJson();
  const scripts = pkg?.scripts ? Object.keys(pkg.scripts).sort() : [];
  const dependencies = pkg?.dependencies ? Object.keys(pkg.dependencies).sort() : [];
  const devDependencies = pkg?.devDependencies ? Object.keys(pkg.devDependencies).sort() : [];

  const checks = {
    files: {
      'package.json': exists('package.json'),
      'tsconfig.json': exists('tsconfig.json'),
      'next.config.ts': exists('next.config.ts'),
      'vercel.json': exists('vercel.json'),
      '.gitignore': exists('.gitignore'),
      'package-lock.json': exists('package-lock.json') || exists('yarn.lock') || exists('pnpm-lock.yaml'),
      '.vscode': exists('.vscode'),
      'app/': exists('app'),
      'components/': exists('components'),
      'lib/': exists('lib'),
      'public/': exists('public'),
      'scripts/': exists('scripts'),
    },
    counts: {
      appRoutes: countFiles('app', ['.ts', '.tsx']),
      componentFiles: countFiles('components', ['.ts', '.tsx']),
      libFiles: countFiles('lib', ['.ts', '.tsx']),
      publicFiles: countFiles('public', undefined),
    },
    package: {
      name: pkg?.name || null,
      version: pkg?.version || null,
      node: process.version,
      scriptCount: scripts.length,
      dependencyCount: dependencies.length,
      devDependencyCount: devDependencies.length,
    },
    git: gitInfo(),
    audit: {
      hasVerifyScript: scripts.includes('verify') || scripts.includes('check'),
      hasStatusScript: scripts.includes('status'),
    },
  };

  return {
    generatedAt: new Date().toISOString(),
    root,
    summary: {
      package: checks.package,
      scripts: scripts,
      dependencies: dependencies,
      devDependencies: devDependencies,
      checks: checks.files,
      counts: checks.counts,
      git: checks.git,
      audit: checks.audit,
    },
  };
}

function toMarkdown(data) {
  const lines = [];
  lines.push('# Status do Projeto');
  lines.push('');
  lines.push(`- Gerado em: ${data.generatedAt}`);
  lines.push(`- Diretório: ${data.root}`);
  lines.push('');
  lines.push('## Pacote');
  lines.push(`- Nome: ${data.summary.package.name || 'não definido'}`);
  lines.push(`- Versão: ${data.summary.package.version || 'não definido'}`);
  lines.push(`- Node: ${data.summary.package.node}`);
  lines.push(`- Scripts: ${data.summary.package.scriptCount}`);
  lines.push(`- Dependências: ${data.summary.package.dependencyCount}`);
  lines.push(`- Dev dependências: ${data.summary.package.devDependencyCount}`);
  lines.push('');
  lines.push('## Scripts disponíveis');
  if (data.summary.scripts.length) {
    for (const script of data.summary.scripts) {
      lines.push(`- ${script}`);
    }
  } else {
    lines.push('- Nenhum script encontrado');
  }
  lines.push('');
  lines.push('## Arquivos e pastas principais');
  for (const [name, exists] of Object.entries(data.summary.checks)) {
    lines.push(`- ${name}: ${exists ? 'presente' : 'ausente'}`);
  }
  lines.push('');
  lines.push('## Contagens');
  for (const [name, count] of Object.entries(data.summary.counts)) {
    lines.push(`- ${name}: ${count}`);
  }
  lines.push('');
  if (data.summary.git) {
    lines.push('## Git');
    lines.push(`- Branch: ${data.summary.git.branch}`);
    lines.push(`- Commit: ${data.summary.git.commit}`);
    lines.push(`- Clean: ${data.summary.git.clean ? 'sim' : 'não'}`);
    lines.push(`- Status:

\\`${data.summary.git.status.replace(/\n/g, '\n\n') || 'clean'}\\``);
    lines.push('');
  }
  lines.push('## Auditoria');
  lines.push(`- Script verify ou check: ${data.summary.audit.hasVerifyScript ? 'sim' : 'não'}`);
  lines.push(`- Script status: ${data.summary.audit.hasStatusScript ? 'sim' : 'não'}`);
  lines.push('');
  return lines.join('\n');
}

function main() {
  const data = summarize();
  const args = process.argv.slice(2);
  const outputJson = args.includes('--json');
  const outputOnly = args.includes('--stdout');

  if (outputJson) {
    process.stdout.write(JSON.stringify(data, null, 2));
    return;
  }

  const markdown = toMarkdown(data);
  writeFileSync(outJsonPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  writeFileSync(outMdPath, markdown + '\n', 'utf8');

  console.log('Resumo do projeto gerado:');
  console.log(`- ${outJsonPath}`);
  console.log(`- ${outMdPath}`);
  console.log('');
  console.log(markdown);
}

main();
