"use client";

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
  { nome: "Randon",        slug: "randon",        logo: "https://img.logo.dev/randon.com.br?token=pk_X-1ZO13GSgeOoUrIuJ6BeA" },
  { nome: "Agrale",        slug: "agrale",        logo: "https://img.logo.dev/agrale.com.br?token=pk_X-1ZO13GSgeOoUrIuJ6BeA" },
];

export function BrandsSection() {
  return (
    <div className="premium-brands">
      <div className="brands-header">
        <h2 className="brands-title">Marcas em destaque</h2>
        <Link href="/anuncios" className="brands-link">Ver todas →</Link>
      </div>

      <div className="brands-scroll">
        <div className="brands-grid">
          {MARCAS.map((m) => (
            <Link
              key={m.slug}
              href={`/caminhoes/marca/${m.slug}`}
              className="brand-card"
            >
              <div className="brand-logo-box">
                {m.logo ? (
                  <img src={m.logo} alt={m.nome} loading="lazy" />
                ) : (
                  <span className="brand-initial">{m.nome.slice(0, 2)}</span>
                )}
              </div>
              <span className="brand-name">{m.nome}</span>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .premium-brands {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .brands-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brands-title {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .brands-link {
          font-size: 13px;
          font-weight: 700;
          color: #2563eb;
          text-decoration: none;
        }

        .brands-scroll {
          overflow-x: auto;
          padding: 4px 0 16px;
          margin: 0 -20px;
          padding: 4px 20px 16px;
          scrollbar-width: none;
        }
        .brands-scroll::-webkit-scrollbar { display: none; }

        .brands-grid {
          display: flex;
          gap: 12px;
        }

        .brand-card {
          flex-shrink: 0;
          width: 120px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.04);
          border-radius: 20px;
          padding: 16px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .brand-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(15,23,42,0.08);
          border-color: rgba(37,99,235,0.2);
        }

        .brand-logo-box {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-logo-box img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s;
        }
        .brand-card:hover .brand-logo-box img { transform: scale(1.1); }

        .brand-name {
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          text-align: center;
          transition: color 0.2s;
        }
        .brand-card:hover .brand-name { color: #2563eb; }

        .brand-initial {
          font-size: 14px;
          font-weight: 900;
          color: #94a3b8;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
}
