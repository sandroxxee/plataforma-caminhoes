import Link from "next/link";

const MARCAS = [
  { nome: "Scania",        slug: "scania",        logo: "https://img.logo.dev/scania.com?token=pk_X-1ZO13GSgeOoUrIuJ6BeA" },
  { nome: "Volvo",         slug: "volvo",         logo: "https://img.logo.dev/volvo.com?token=pk_X-1ZO13GSgeOoUrIuJ6BeA" },
  { nome: "Mercedes-Benz", slug: "mercedes-benz", logo: "https://img.logo.dev/mercedes-benz.com?token=pk_X-1ZO13GSgeOoUrIuJ6BeA" },
  { nome: "DAF",           slug: "daf",           logo: "https://img.logo.dev/daf.com?token=pk_X-1ZO13GSgeOoUrIuJ6BeA" },
  { nome: "MAN",           slug: "man",           logo: "https://img.logo.dev/man.eu?token=pk_X-1ZO13GSgeOoUrIuJ6BeA" },
  { nome: "Iveco",         slug: "iveco",         logo: "https://img.logo.dev/iveco.com?token=pk_X-1ZO13GSgeOoUrIuJ6BeA" },
  { nome: "Ford",          slug: "ford",          logo: "https://img.logo.dev/ford.com?token=pk_X-1ZO13GSgeOoUrIuJ6BeA" },
  { nome: "Volkswagen",    slug: "volkswagen",    logo: "https://img.logo.dev/volkswagen.com?token=pk_X-1ZO13GSgeOoUrIuJ6BeA" },
  { nome: "Randon",        slug: "randon",        logo: null },
  { nome: "Agrale",        slug: "agrale",        logo: null },
];

export function BrandsSection() {
  return (
    <section className="market-container brands-section">
      <div className="brands-head">
        <h2 className="brands-title">Buscar por marca</h2>
        <Link href="/anuncios" className="brands-link">Ver todas &rarr;</Link>
      </div>
      <div className="brands-grid">
        {MARCAS.map((m) => (
          <Link
            key={m.slug}
            href={`/caminhoes/marca/${m.slug}`}
            className="brand-chip"
            title={`Caminhões ${m.nome} à venda`}
          >
            {m.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.logo}
                alt={m.nome}
                className="brand-chip-logo"
                width={56}
                height={32}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  const span = e.currentTarget.nextSibling as HTMLElement;
                  if (span) span.style.display = "flex";
                }}
              />
            ) : null}
            {(!m.logo) && (
              <span className="brand-chip-initial">{m.nome.slice(0, 2).toUpperCase()}</span>
            )}
            <span className="brand-chip-name">{m.nome}</span>
          </Link>
        ))}
      </div>
      <style>{`
        .brands-section { padding-top: 0; }
        .brands-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .brands-title {
          font-size: 18px; font-weight: 800; letter-spacing: -.025em;
          margin: 0; color: var(--text);
        }
        .brands-link {
          font-size: 13px; font-weight: 800; color: var(--blue);
          text-decoration: none; white-space: nowrap;
        }
        .brands-link:hover { text-decoration: underline; }
        .brands-grid {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 10px;
        }
        .brand-chip {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 8px;
          padding: 16px 8px;
          background: var(--surface); border: 1.5px solid var(--line);
          border-radius: 16px; text-decoration: none;
          transition: border-color .15s, box-shadow .15s, transform .15s;
          box-shadow: var(--shadow);
        }
        .brand-chip:hover {
          border-color: var(--blue); box-shadow: var(--shadow2);
          transform: translateY(-2px);
        }
        .brand-chip-logo {
          width: 56px; height: 32px;
          object-fit: contain; object-position: center;
          display: block; filter: grayscale(1) opacity(.65);
          transition: filter .15s;
        }
        .brand-chip:hover .brand-chip-logo { filter: grayscale(0) opacity(1); }
        .brand-chip-initial {
          width: 48px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          font-size: 15px; font-weight: 900; color: var(--muted);
          background: var(--soft); border-radius: 8px;
          transition: color .15s, background .15s;
        }
        .brand-chip:hover .brand-chip-initial { color: var(--blue); background: var(--blueSoft); }
        .brand-chip-name {
          font-size: 11px; font-weight: 800; color: var(--muted);
          letter-spacing: .01em; text-align: center; white-space: nowrap;
        }
        .brand-chip:hover .brand-chip-name { color: var(--blue); }
        @media (max-width: 1024px) {
          .brands-grid { grid-template-columns: repeat(5, 1fr); }
        }
        @media (max-width: 560px) {
          .brands-grid { grid-template-columns: repeat(5, 1fr); gap: 8px; }
          .brand-chip { padding: 10px 4px; border-radius: 12px; gap: 6px; }
          .brand-chip-logo { width: 36px; height: 22px; }
          .brand-chip-initial { width: 36px; height: 22px; font-size: 12px; }
          .brand-chip-name { font-size: 10px; }
        }
      `}</style>
    </section>
  );
}
