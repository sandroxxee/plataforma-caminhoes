import Link from "next/link";

type Marca = { nome: string; slug: string; svg: string | null };

const SVG: Record<string, string> = {
  scania:        "https://upload.wikimedia.org/wikipedia/commons/2/24/Scania_logo.svg",
  volvo:         "https://upload.wikimedia.org/wikipedia/commons/5/58/Volvo-PB.svg",
  "mercedes-benz": "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
  daf:           "https://upload.wikimedia.org/wikipedia/commons/2/21/DAF_Logo.svg",
  man:           "https://upload.wikimedia.org/wikipedia/commons/8/89/MAN_Logo.svg",
  iveco:         "https://upload.wikimedia.org/wikipedia/commons/4/45/Iveco_Logo.svg",
  ford:          "https://upload.wikimedia.org/wikipedia/commons/a/a0/Ford_Motor_Company_Logo.svg",
  volkswagen:    "https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg",
};

function m(nome: string, slug: string): Marca {
  return { nome, slug, svg: SVG[slug] ?? null };
}

export const MARCAS_POR_CATEGORIA: Record<string, Marca[]> = {
  caminhoes: [
    m("Scania", "scania"), m("Volvo", "volvo"), m("Mercedes-Benz", "mercedes-benz"),
    m("DAF", "daf"), m("MAN", "man"), m("Iveco", "iveco"),
    m("Ford", "ford"), m("Volkswagen", "volkswagen"),
    m("Randon", "randon"), m("Agrale", "agrale"),
  ],
  carretas: [
    m("Randon", "randon"), m("Noma", "noma"), m("Guerra", "guerra"),
    m("Rodotec", "rodotec"), m("Librelato", "librelato"), m("Facchini", "facchini"),
    m("Paquetá", "paqueta"), m("Schwarzmüller", "schwarzmuller"),
  ],
  implementos: [
    m("Randon", "randon"), m("Guerra", "guerra"), m("Librelato", "librelato"),
    m("Facchini", "facchini"), m("Rodotec", "rodotec"), m("Noma", "noma"),
    m("Paquetá", "paqueta"), m("Liebherr", "liebherr"),
  ],
  pecas: [
    m("Scania", "scania"), m("Volvo", "volvo"), m("Mercedes-Benz", "mercedes-benz"),
    m("MAN", "man"), m("DAF", "daf"), m("Iveco", "iveco"),
    m("Volkswagen", "volkswagen"), m("Ford", "ford"),
  ],
  maquinas: [
    m("Caterpillar", "caterpillar"), m("Volvo", "volvo"), m("Komatsu", "komatsu"),
    m("Case", "case"), m("John Deere", "john-deere"), m("Liebherr", "liebherr"),
    m("Terex", "terex"), m("Bobcat", "bobcat"),
  ],
};

export function CategoryBrandsBar({
  categoria,
  labelSingular,
}: {
  categoria: keyof typeof MARCAS_POR_CATEGORIA;
  labelSingular: string;
}) {
  const marcas = MARCAS_POR_CATEGORIA[categoria] ?? [];
  if (!marcas.length) return null;

  return (
    <div className="cbb-wrap">
      <p className="cbb-label">Filtrar por marca</p>
      <div className="cbb-grid">
        {marcas.map((m) => (
          <Link
            key={m.slug}
            href={`/caminhoes/marca/${m.slug}`}
            className="cbb-chip"
            title={`${labelSingular} ${m.nome}`}
          >
            {m.svg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.svg} alt={m.nome} width={48} height={28} loading="lazy" className="cbb-logo" />
            ) : (
              <span className="cbb-initial">{m.nome.slice(0, 2).toUpperCase()}</span>
            )}
            <span className="cbb-name">{m.nome}</span>
          </Link>
        ))}
      </div>
      <style>{`
        .cbb-wrap { margin-bottom: 22px; }
        .cbb-label {
          margin: 0 0 10px; font-size: 12px; font-weight: 800;
          color: var(--muted); letter-spacing: .04em; text-transform: uppercase;
        }
        .cbb-grid {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
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
          width: 36px; height: 22px;
          object-fit: contain; object-position: center;
          filter: grayscale(1) opacity(.6);
          transition: filter .14s;
          flex-shrink: 0;
        }
        .cbb-chip:hover .cbb-logo { filter: grayscale(0) opacity(1); }
        .cbb-initial {
          width: 28px; height: 22px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 900; color: var(--muted);
          background: var(--soft); border-radius: 6px;
          transition: color .14s;
        }
        .cbb-chip:hover .cbb-initial { color: var(--blue); }
        .cbb-name {
          font-size: 12px; font-weight: 800; color: var(--text);
          white-space: nowrap;
        }
        .cbb-chip:hover .cbb-name { color: var(--blue); }
        @media (max-width: 480px) {
          .cbb-chip { height: 36px; padding: 0 10px 0 8px; }
          .cbb-logo { width: 28px; height: 18px; }
          .cbb-name { font-size: 11px; }
        }
      `}</style>
    </div>
  );
}
