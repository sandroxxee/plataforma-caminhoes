/**
 * download-logos.mjs
 * Uso: node scripts/download-logos.mjs
 *
 * - Baixa logos SVG de marcas de caminhoes e implementos
 * - Salva em /public/logos/<slug>.svg
 * - Gera /public/marcas.json
 *
 * Fontes tentadas em ordem:
 *   1. URL direta configurada por marca (Wikimedia Commons / SVGRepo)
 *   2. Simple Icons CDN  (https://cdn.simpleicons.org/<slug>)
 *   3. Marca sem logo → logo = null no JSON
 */

import fs   from "node:fs";
import path from "node:path";
import https from "node:https";
import http  from "node:http";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, "..");
const LOGOS_DIR = path.join(ROOT, "public", "logos");
const JSON_OUT  = path.join(ROOT, "public", "marcas.json");

// ---------------------------------------------------------------------------
// LISTA DE MARCAS
// ---------------------------------------------------------------------------
const MARCAS = [
  // ── CAMINHÕES ────────────────────────────────────────────────────────────
  {
    nome: "Mercedes-Benz",
    slug: "mercedes-benz",
    categoria: "caminhoes",
    svgUrl: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Benz_logo_2011.svg",
  },
  {
    nome: "Scania",
    slug: "scania",
    categoria: "caminhoes",
    svgUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Scania_CV_AB_wordmark.svg",
  },
  {
    nome: "Volvo",
    slug: "volvo",
    categoria: "caminhoes",
    svgUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Volvo_Trucks_logo.svg",
  },
  {
    nome: "Volkswagen",
    slug: "volkswagen",
    categoria: "caminhoes",
    svgUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg",
  },
  {
    nome: "Ford",
    slug: "ford",
    categoria: "caminhoes",
    svgUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg",
  },
  {
    nome: "Iveco",
    slug: "iveco",
    categoria: "caminhoes",
    svgUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Iveco_logo.svg",
  },
  {
    nome: "DAF",
    slug: "daf",
    categoria: "caminhoes",
    svgUrl: "https://upload.wikimedia.org/wikipedia/commons/6/62/DAF_Trucks_logo.svg",
  },
  {
    nome: "MAN",
    slug: "man",
    categoria: "caminhoes",
    svgUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9c/MAN_truck_logo.svg",
  },
  {
    nome: "Agrale",
    slug: "agrale",
    categoria: "caminhoes",
    svgUrl: null, // sem SVG publico confiavel — usa fallback
  },

  // ── IMPLEMENTOS / FABRICANTES ────────────────────────────────────────────
  {
    nome: "Randon",
    slug: "randon",
    categoria: "implementos",
    svgUrl: null,
  },
  {
    nome: "Guerra",
    slug: "guerra",
    categoria: "implementos",
    svgUrl: null,
  },
  {
    nome: "Noma",
    slug: "noma",
    categoria: "implementos",
    svgUrl: null,
  },
  {
    nome: "Librelato",
    slug: "librelato",
    categoria: "implementos",
    svgUrl: null,
  },
  {
    nome: "Facchini",
    slug: "facchini",
    categoria: "implementos",
    svgUrl: null,
  },
  {
    nome: "Rodovale",
    slug: "rodovale",
    categoria: "implementos",
    svgUrl: null,
  },
  {
    nome: "Fruehauf",
    slug: "fruehauf",
    categoria: "implementos",
    svgUrl: null,
  },

  // ── MÁQUINAS ─────────────────────────────────────────────────────────────
  {
    nome: "Caterpillar",
    slug: "caterpillar",
    categoria: "maquinas",
    svgUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Caterpillar_logo.svg",
  },
  {
    nome: "Komatsu",
    slug: "komatsu",
    categoria: "maquinas",
    svgUrl: "https://upload.wikimedia.org/wikipedia/commons/9/97/Komatsu_logo.svg",
  },
  {
    nome: "John Deere",
    slug: "john-deere",
    categoria: "maquinas",
    svgUrl: "https://upload.wikimedia.org/wikipedia/commons/3/37/John_Deere_logo.svg",
  },
  {
    nome: "Liebherr",
    slug: "liebherr",
    categoria: "maquinas",
    svgUrl: null,
  },
  {
    nome: "Hitachi",
    slug: "hitachi",
    categoria: "maquinas",
    svgUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Hitachi_logo.svg",
  },
];

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const req = mod.get(url, { headers: { "User-Agent": "Mozilla/5.0 logo-downloader/1.0" } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchUrl(res.headers.location));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} para ${url}`));
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end",  () => resolve(Buffer.concat(chunks).toString("utf-8")));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(12000, () => { req.destroy(); reject(new Error("Timeout")); });
  });
}

function isSvg(content) {
  return typeof content === "string" && content.trimStart().startsWith("<");
}

// Gera um SVG placeholder com a inicial da marca
function placeholderSvg(nome) {
  const inicial = nome.charAt(0).toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#e5e7eb"/>
  <text x="32" y="44" text-anchor="middle" font-size="32" font-family="system-ui,sans-serif" font-weight="700" fill="#6b7280">${inicial}</text>
</svg>`;
}

// Simple Icons CDN slug (lowercase, sem espacos e hifens)
function simpleIconsSlug(slug) {
  return slug.replace(/-/g, "").toLowerCase();
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
async function main() {
  fs.mkdirSync(LOGOS_DIR, { recursive: true });

  const resultado = [];

  for (const marca of MARCAS) {
    const filePath = path.join(LOGOS_DIR, `${marca.slug}.svg`);
    const logoPath = `/logos/${marca.slug}.svg`;
    let baixado   = false;

    // 1) URL direta configurada
    if (marca.svgUrl && !baixado) {
      try {
        const content = await fetchUrl(marca.svgUrl);
        if (isSvg(content)) {
          fs.writeFileSync(filePath, content, "utf-8");
          console.log(`✅  ${marca.nome} — fonte direta`);
          baixado = true;
        }
      } catch (e) {
        console.warn(`⚠️   ${marca.nome} fonte direta falhou: ${e.message}`);
      }
    }

    // 2) Simple Icons CDN
    if (!baixado) {
      try {
        const siSlug = simpleIconsSlug(marca.slug);
        const url    = `https://cdn.simpleicons.org/${siSlug}`;
        const content = await fetchUrl(url);
        if (isSvg(content)) {
          fs.writeFileSync(filePath, content, "utf-8");
          console.log(`✅  ${marca.nome} — Simple Icons`);
          baixado = true;
        }
      } catch (e) {
        console.warn(`⚠️   ${marca.nome} Simple Icons falhou: ${e.message}`);
      }
    }

    // 3) Placeholder
    if (!baixado) {
      fs.writeFileSync(filePath, placeholderSvg(marca.nome), "utf-8");
      console.log(`⬜  ${marca.nome} — placeholder gerado`);
    }

    resultado.push({
      nome:      marca.nome,
      slug:      marca.slug,
      categoria: marca.categoria,
      logo:      logoPath,
    });
  }

  fs.writeFileSync(JSON_OUT, JSON.stringify(resultado, null, 2), "utf-8");
  console.log(`\n📄 marcas.json gerado com ${resultado.length} marcas → ${JSON_OUT}`);
  console.log(`🖼️  Logos salvos em → ${LOGOS_DIR}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
