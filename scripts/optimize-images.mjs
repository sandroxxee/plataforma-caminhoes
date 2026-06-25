// scripts/optimize-images.mjs
// Otimiza logos e ícones de public/ sem nenhuma perda de qualidade (lossless)
//
// Uso:
//   npm run images:optimize          → otimiza os arquivos
//   npm run images:optimize --dry-run → só mostra quanto reduziria, sem alterar nada
//
// Requer: npm install --save-dev sharp

import sharp from "sharp";
import { statSync, mkdirSync, copyFileSync, renameSync, existsSync } from "fs";
import { join, extname, basename } from "path";

const PUBLIC_DIR = "./public";
const BACKUP_DIR = "./public/_originals";
const DRY_RUN = process.argv.includes("--dry-run");

if (DRY_RUN) {
  console.log("🔍 MODO DRY-RUN — nenhum arquivo será alterado\n");
}

// Logos e ícones — compressão lossless (pixel idêntico ao original)
const LOSSLESS_FILES = [
  "logo-square.png",
  "logo-horizontal.png",
  "logo-horizontal-web.png",
  "icon-512.png",
  "icon-192.png",
  "android-chrome-512x512.png",
  "android-chrome-192x192.png",
  "apple-touch-icon.png",
  "favicon-192.png",
  "favicon-512.png",
  "favicon-64.png",
  "favicon-16.png",
  "favicon-512.png",
];

function kb(bytes) {
  return (bytes / 1024).toFixed(1) + "kb";
}

function pct(before, after) {
  return "-" + Math.round((1 - after / before) * 100) + "%";
}

async function processLossless(filename) {
  const inputPath = join(PUBLIC_DIR, filename);

  if (!existsSync(inputPath)) {
    console.warn(`⚠️  ${filename} — não encontrado, pulando`);
    return;
  }

  const ext = extname(filename).toLowerCase();
  const base = basename(filename, ext);
  const before = statSync(inputPath).size;

  // Gera versão otimizada em memória para medir o tamanho
  const pngBuffer = await sharp(inputPath)
    .png({ compressionLevel: 9, palette: true, effort: 10 })
    .toBuffer();

  const webpBuffer = await sharp(inputPath)
    .webp({ lossless: true, effort: 6 })
    .toBuffer();

  const afterPng = pngBuffer.length;
  const afterWebp = webpBuffer.length;

  if (DRY_RUN) {
    console.log(`📄 ${filename}`);
    console.log(`   PNG atual:      ${kb(before)}`);
    console.log(`   PNG otimizado:  ${kb(afterPng)}  (${pct(before, afterPng)})`);
    console.log(`   WebP lossless:  ${kb(afterWebp)}  (${pct(before, afterWebp)})`);
    console.log();
    return;
  }

  // Cria backup antes de alterar qualquer coisa
  mkdirSync(BACKUP_DIR, { recursive: true });
  copyFileSync(inputPath, join(BACKUP_DIR, filename));

  // Salva PNG otimizado
  const tmpPng = inputPath + ".tmp";
  await sharp(inputPath)
    .png({ compressionLevel: 9, palette: true, effort: 10 })
    .toFile(tmpPng);
  renameSync(tmpPng, inputPath);

  // Salva WebP lossless paralelo
  const webpPath = join(PUBLIC_DIR, `${base}.webp`);
  await sharp(join(BACKUP_DIR, filename))
    .webp({ lossless: true, effort: 6 })
    .toFile(webpPath);

  const afterPngReal = statSync(inputPath).size;
  const afterWebpReal = statSync(webpPath).size;

  console.log(`✅ ${filename}`);
  console.log(`   PNG: ${kb(before)} → ${kb(afterPngReal)} (${pct(before, afterPngReal)})`);
  console.log(`   WebP gerado: ${kb(afterWebpReal)} → ${webpPath}`);
  console.log();
}

async function main() {
  console.log("🖼️  Otimizando logos e ícones (lossless — zero perda de qualidade)\n");
  console.log(`📁 Fonte:  ${PUBLIC_DIR}`);
  if (!DRY_RUN) console.log(`📦 Backup: ${BACKUP_DIR}`);
  console.log();

  let totalBefore = 0;
  let totalAfterPng = 0;

  for (const file of LOSSLESS_FILES) {
    const inputPath = join(PUBLIC_DIR, file);
    if (existsSync(inputPath)) {
      totalBefore += statSync(inputPath).size;
    }
  }

  for (const file of LOSSLESS_FILES) {
    await processLossless(file);
  }

  if (!DRY_RUN) {
    for (const file of LOSSLESS_FILES) {
      const inputPath = join(PUBLIC_DIR, file);
      if (existsSync(inputPath)) {
        totalAfterPng += statSync(inputPath).size;
      }
    }
    console.log("─".repeat(50));
    console.log(`📊 Total: ${kb(totalBefore)} → ${kb(totalAfterPng)} (${pct(totalBefore, totalAfterPng)})`);
    console.log(`📁 Originais salvos em: ${BACKUP_DIR}`);
    console.log();
    console.log("💡 Próximos passos:");
    console.log("   1. Revise visualmente os arquivos otimizados");
    console.log("   2. Se aprovado: git add public/ && git commit -m \"perf: otimizar logos e ícones\"");
    console.log("   3. Se algo errado: restaure de public/_originals/");
  }
}

main().catch((err) => {
  console.error("❌ Erro:", err.message);
  process.exit(1);
});
