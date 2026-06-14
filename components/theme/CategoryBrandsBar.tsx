import Link from "next/link";
import Image from "next/image";
import marcasData from "@/public/marcas.json";

type MarcaJson = { nome: string; slug: string; categoria: string; logo: string };

const TODAS = marcasData as MarcaJson[];

// mapa categoria do JSON -> categoria da page
const CATEGORIA_MAP: Record<string, string> = {
  caminhoes:   "caminhoes",
  implementos: "carretas",
  maquinas:    "maquinas",
};

// href do chip por categoria
function chipHref(categoria: string, nome: string, slug: string): string {
  switch (categoria) {
    case "caminhoes":   return `/anuncios?marca=${encodeURIComponent(nome)}`;
    case "carretas":    return `/carretas?marca=${encodeURIComponent(nome)}`;
    case "implementos": return `/implementos?tipo=${encodeURIComponent(nome)}`;
    case "maquinas":    return `/maquinas?marca=${encodeURIComponent(nome)}`;
    case "pecas":       return `/pecas?marca=${encodeURIComponent(nome)}`;
    default:            return `/anuncios?marca=${encodeURIComponent(nome)}`;
  }
}

export function CategoryBrandsBar({
  categoria,
  labelSingular,
}: {
  categoria: string;
  labelSingular: string;
}) {
  // filtra marcas do JSON pela categoria correspondente
  const catJson = CATEGORIA_MAP[categoria] ?? categoria;
  const marcas = TODAS.filter((m) => m.categoria === catJson);

  // fallback: se nao ha marcas no JSON para a categoria, usa lista hardcoded
  const lista = marcas.length > 0 ? marcas : [
    { nome: "Mercedes-Benz", slug: "mercedes-benz", categoria, logo: "/logos/mercedes-benz.svg" },
    { nome: "Scania",        slug: "scania",        categoria, logo: "/logos/scania.svg" },
    { nome: "Volvo",         slug: "volvo",         categoria, logo: "/logos/volvo.svg" },
    { nome: "Volkswagen",    slug: "volkswagen",    categoria, logo: "/logos/volkswagen.svg" },
    { nome: "Ford",          slug: "ford",          categoria, logo: "/logos/ford.svg" },
    { nome: "Iveco",         slug: "iveco",         categoria, logo: "/logos/iveco.svg" },
    { nome: "DAF",           slug: "daf",           categoria, logo: "/logos/daf.svg" },
    { nome: "MAN",           slug: "man",           categoria, logo: "/logos/man.svg" },
    { nome: "Agrale",        slug: "agrale",        categoria, logo: "/logos/agrale.svg" },
  ];

  if (!lista.length) return null;

  return (
    <div className="cbb-wrap">
      <div className="cbb-grid">
        {lista.map((marca) => (
          <Link
            key={marca.slug}
            href={chipHref(categoria, marca.nome, marca.slug)}
            className="cbb-chip"
            title={`${labelSingular} ${marca.nome}`}
          >
            <Image
              src={marca.logo}
              alt={marca.nome}
              width={48}
              height={28}
              className="cbb-logo"
            />
            <span className="cbb-name">{marca.nome}</span>
          </Link>
        ))}
      </div>

      <style>{`
        .cbb-wrap { margin-bottom: 20px; }
        .cbb-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .cbb-chip {
          display: inline-flex; align-items: center; gap: 8px;
          height: 40px; padding: 0 14px 0 10px;
          background: var(--surface); border: 1.5px solid var(--line);
          border-radius: 999px; text-decoration: none;
          transition: border-color .14s, box-shadow .14s, transform .14s;
          box-shadow: var(--shadow);
        }
        .cbb-chip:hover {
          border-color: var(--blue); box-shadow: var(--shadow2);
          transform: translateY(-1px);
        }
        .cbb-logo {
          width: 36px !important; height: 22px !important;
          object-fit: contain; object-position: center;
          border-radius: 4px;
          transition: opacity .14s; flex-shrink: 0;
        }
        .cbb-name {
          font-size: 12px; font-weight: 800; color: var(--text); white-space: nowrap;
        }
        .cbb-chip:hover .cbb-name { color: var(--blue); }
        @media (max-width: 480px) {
          .cbb-chip { height: 36px; padding: 0 10px 0 8px; }
          .cbb-logo { width: 28px !important; height: 18px !important; }
          .cbb-name { font-size: 11px; }
        }
      `}</style>
    </div>
  );
}
