import Link from "next/link";
import marcas from "@/public/marcas.json";

const SVG: Record<string, string> = {
  scania:          "https://upload.wikimedia.org/wikipedia/commons/2/24/Scania_logo.svg",
  volvo:           "https://upload.wikimedia.org/wikipedia/commons/5/58/Volvo-PB.svg",
  "mercedes-benz": "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
  daf:             "https://upload.wikimedia.org/wikipedia/commons/2/21/DAF_Logo.svg",
  man:             "https://upload.wikimedia.org/wikipedia/commons/8/89/MAN_Logo.svg",
  iveco:           "https://upload.wikimedia.org/wikipedia/commons/4/45/Iveco_Logo.svg",
  ford:            "https://upload.wikimedia.org/wikipedia/commons/a/a0/Ford_Motor_Company_Logo.svg",
  volkswagen:      "https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg",
};

export function CategoryBrandsBar({
  categoria,
  labelSingular,
}: {
  categoria: string;
  labelSingular: string;
}) {
  const lista = (marcas as { nome: string; slug: string; categoria: string }[])
    .filter((m) => m.categoria === categoria);

  if (!lista.length) return null;

  return (
    <div className="cbb-wrap">
      <div className="cbb-grid">
        {lista.map((marca) => {
          const svg = SVG[marca.slug] ?? null;
          return (
            <Link
              key={marca.slug}
              href={`/anuncios?marca=${encodeURIComponent(marca.nome)}`}
              className="cbb-chip"
              title={`${labelSingular} ${marca.nome}`}
            >
              {svg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={svg} alt={marca.nome} width={48} height={28} loading="lazy" className="cbb-logo" />
              ) : (
                <span className="cbb-initial">{marca.nome.slice(0, 2).toUpperCase()}</span>
              )}
              <span className="cbb-name">{marca.nome}</span>
            </Link>
          );
        })}
      </div>
      <style>{`
        .cbb-wrap { margin-bottom: 20px; }
        .cbb-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .cbb-chip {
          display: inline-flex; align-items: center; gap: 8px;
          height: 38px; padding: 0 14px 0 10px;
          background: var(--surface); border: 1.5px solid var(--line);
          border-radius: 999px; text-decoration: none;
          transition: border-color .14s, box-shadow .14s, transform .14s;
          box-shadow: var(--shadow);
        }
        .cbb-chip:hover { border-color: var(--blue); box-shadow: var(--shadow2); transform: translateY(-1px); }
        .cbb-logo { width: 34px; height: 20px; object-fit: contain; filter: grayscale(1) opacity(.6); transition: filter .14s; flex-shrink: 0; }
        .cbb-chip:hover .cbb-logo { filter: grayscale(0) opacity(1); }
        .cbb-initial { width: 26px; height: 20px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: var(--muted); background: var(--soft); border-radius: 5px; }
        .cbb-chip:hover .cbb-initial { color: var(--blue); }
        .cbb-name { font-size: 12px; font-weight: 800; color: var(--text); white-space: nowrap; }
        .cbb-chip:hover .cbb-name { color: var(--blue); }
        @media (max-width: 480px) {
          .cbb-chip { height: 34px; padding: 0 10px 0 8px; }
          .cbb-logo { width: 26px; height: 16px; }
          .cbb-name { font-size: 11px; }
        }
      `}</style>
    </div>
  );
}
