import Link from "next/link";

const MARCAS = [
  { nome: "Scania",   slug: "scania",    svg: "https://upload.wikimedia.org/wikipedia/commons/2/24/Scania_logo.svg" },
  { nome: "Volvo",    slug: "volvo",     svg: "https://upload.wikimedia.org/wikipedia/commons/5/58/Volvo-PB.svg" },
  { nome: "Mercedes", slug: "mercedes-benz", svg: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg" },
  { nome: "DAF",      slug: "daf",       svg: "https://upload.wikimedia.org/wikipedia/commons/2/21/DAF_Logo.svg" },
  { nome: "MAN",      slug: "man",       svg: "https://upload.wikimedia.org/wikipedia/commons/8/89/MAN_Logo.svg" },
  { nome: "Iveco",    slug: "iveco",     svg: "https://upload.wikimedia.org/wikipedia/commons/4/45/Iveco_Logo.svg" },
  { nome: "Ford",     slug: "ford",      svg: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Ford_Motor_Company_Logo.svg" },
  { nome: "Volkswagen", slug: "volkswagen", svg: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg" },
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
            href={`/caminhoes/${m.slug}`}
            className="brand-chip"
            title={`Caminhões ${m.nome}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.svg}
              alt={m.nome}
              className="brand-chip-logo"
              width={56}
              height={32}
              loading="lazy"
            />
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
          grid-template-columns: repeat(8, 1fr);
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
          display: block; filter: grayscale(1) opacity(.7);
          transition: filter .15s;
        }
        .brand-chip:hover .brand-chip-logo { filter: grayscale(0) opacity(1); }
        .brand-chip-name {
          font-size: 11px; font-weight: 800; color: var(--muted);
          letter-spacing: .01em; text-align: center; white-space: nowrap;
        }
        .brand-chip:hover .brand-chip-name { color: var(--blue); }
        @media (max-width: 900px) {
          .brands-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 480px) {
          .brands-grid { grid-template-columns: repeat(4, 1fr); gap: 8px; }
          .brand-chip { padding: 12px 6px; border-radius: 12px; }
          .brand-chip-logo { width: 40px; height: 24px; }
        }
      `}</style>
    </section>
  );
}
