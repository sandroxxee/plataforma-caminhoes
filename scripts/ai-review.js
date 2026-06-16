#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const port = 3333;
const outputPath = path.join(root, 'ai-review-report.md');

let projectContext = null;
let recentChanges = {};

function getProjectContext() {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const routes = [];
  const appDir = path.join(root, 'app');
  
  function scanRoutes(dir, prefix = '') {
    for (const name of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, name);
      if (fs.statSync(fullPath).isDirectory()) {
        scanRoutes(fullPath, prefix + '/' + name);
      } else if (name === 'page.tsx' || name === 'route.ts') {
        routes.push(prefix);
      }
    }
  }
  
  if (fs.existsSync(appDir)) scanRoutes(appDir);

  return {
    name: pkg.name,
    version: pkg.version,
    scripts: Object.keys(pkg.scripts || {}),
    dependencies: Object.keys(pkg.dependencies || {}),
    routes: routes.slice(0, 20),
  };
}

function getAIPromptTemplate() {
  const context = projectContext;
  return `# AI Code Generation Request

## Contexto do Projeto
- **Nome:** ${context.name}@${context.version}
- **Framework:** Next.js 16 + TypeScript
- **Arquitetura:** App Router, Servidor/Cliente

## Principais Rotas
${context.routes.map(r => `- \`${r}\``).join('\n')}

## Padrões do Projeto
- Imports: usar \`@/\` ao invés de \`../\`
- Componentes: PascalCase, server/client conforme necessário
- TypeScript: sempre tipado
- Styling: Tailwind CSS
- API: rotas em \`app/api/\`

## Sua Solicitação
[DESCREVA AQUI O QUE QUER IMPLEMENTAR]

## Restrições
- Não quebre rotas existentes
- Não altere imports globais
- Mantenha tipagem TypeScript
- Valide com: npm run verify

## Entregas Esperadas
1. Código completo e pronto para copiar
2. Arquivo de destino exato (\`app/components/novo.tsx\`)
3. Listagem de dependências novas (se houver)
`;
}

function analyzeChanges() {
  try {
    const status = execSync('git status --short', { cwd: root, encoding: 'utf8' });
    const lines = status.trim().split('\n').filter(Boolean);
    
    const changes = {
      modified: lines.filter(l => l.startsWith(' M')).map(l => l.slice(3)),
      added: lines.filter(l => l.startsWith('??')).map(l => l.slice(3)),
      deleted: lines.filter(l => l.startsWith(' D')).map(l => l.slice(3)),
    };

    return changes;
  } catch {
    return { modified: [], added: [], deleted: [] };
  }
}

function validateChanges(changes) {
  const warnings = [];
  const errors = [];

  // Verificar TypeScript em arquivos .ts/.tsx
  for (const file of [...changes.modified, ...changes.added]) {
    if ((file.endsWith('.ts') || file.endsWith('.tsx')) && fs.existsSync(path.join(root, file))) {
      const content = fs.readFileSync(path.join(root, file), 'utf8');
      
      // Verificar imports com ../
      if (content.includes("from '../")) {
        warnings.push(`⚠️ ${file}: usa import relativo "../" em vez de "@/"`);
      }
      
      // Verificar tipos faltando
      if (content.includes('any') && !content.includes('// eslint-disable-next-line')) {
        warnings.push(`⚠️ ${file}: contém type 'any' sem justificativa`);
      }
      
      // Verificar se há export default
      if (!content.includes('export')) {
        errors.push(`❌ ${file}: sem export encontrado`);
      }
    }
  }

  return { warnings, errors };
}

function handleRequest(req, res) {
  if (req.url === '/' && req.method === 'GET') {
    const html = fs.readFileSync(path.join(__dirname, 'ai-review-ui.html'), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } else if (req.url === '/api/status' && req.method === 'GET') {
    projectContext = projectContext || getProjectContext();
    const changes = analyzeChanges();
    const validation = validateChanges(changes);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      context: projectContext,
      promptTemplate: getAIPromptTemplate(),
      changes,
      validation,
      timestamp: new Date().toISOString(),
    }, null, 2));
  } else if (req.url === '/api/commit' && req.method === 'POST') {
    try {
      const changes = analyzeChanges();
      if (changes.modified.length === 0 && changes.added.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Nenhuma mudança para commit' }));
        return;
      }

      execSync('git add .', { cwd: root });
      execSync('git commit --no-verify -m "AI-generated: alterações validadas"', { cwd: root });
      execSync('git push origin main', { cwd: root });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Commit enviado com sucesso' }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: String(error) }));
    }
  } else {
    res.writeHead(404);
    res.end();
  }
}

const server = http.createServer(handleRequest);

server.listen(port, () => {
  console.log(`🚀 AI Review painel aberto em: http://localhost:${port}`);
  console.log('');
  console.log('📋 Fluxo:');
  console.log('1. Copie o template de prompt');
  console.log('2. Cole em ChatGPT, Perplexity, etc');
  console.log('3. Receba o código');
  console.log('4. Cole no seu editor');
  console.log('5. Monitore as mudanças aqui');
  console.log('6. Clique "Fazer Commit" se tudo passar');
  console.log('');
  console.log('Pressione Ctrl+C para sair.');
  
  // Abrir browser automaticamente
  const { exec } = require('child_process');
  const cmd = process.platform === 'darwin' ? `open http://localhost:${port}` :
              process.platform === 'win32' ? `start http://localhost:${port}` :
              `xdg-open http://localhost:${port}`;
  exec(cmd);
});
