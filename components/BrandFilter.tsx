"use client";
import Link from "next/link";

type Brand = { name: string; slug: string; logo: React.ReactNode };

const brands: Brand[] = [
  {
    name: "Todas",
    slug: "",
    logo: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="url(#gAll)" strokeWidth="2.5" fill="none"/>
        <path d="M14 24h20M24 14v20" stroke="url(#gAll)" strokeWidth="2.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="gAll" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "Mercedes",
    slug: "Mercedes-Benz",
    logo: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="url(#gMB)" strokeWidth="2" fill="none"/>
        <circle cx="24" cy="24" r="20" fill="url(#gMBfill)" fillOpacity="0.08"/>
        <path d="M24 6 L24 24 L38.7 33" stroke="url(#gMB)" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M24 24 L9.3 33" stroke="url(#gMB)" strokeWidth="2.2" strokeLinecap="round"/>
        <defs>
          <linearGradient id="gMB" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e2e8f0"/><stop offset="1" stopColor="#94a3b8"/>
          </linearGradient>
          <linearGradient id="gMBfill" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e2e8f0"/><stop offset="1" stopColor="#64748b"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "Scania",
    slug: "Scania",
    logo: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="24" rx="18" ry="18" stroke="url(#gSc)" strokeWidth="2" fill="none"/>
        <path d="M16 20c0-4.4 3.6-8 8-8s8 3.6 8 8c0 2.4-1.1 4.6-2.8 6.1L24 36l-5.2-9.9A7.97 7.97 0 0 1 16 20z" fill="url(#gScF)" fillOpacity="0.9"/>
        <circle cx="24" cy="20" r="3" fill="#fff" fillOpacity="0.9"/>
        <defs>
          <linearGradient id="gSc" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fca5a5"/><stop offset="1" stopColor="#dc2626"/>
          </linearGradient>
          <linearGradient id="gScF" x1="16" y1="12" x2="32" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fca5a5"/><stop offset="1" stopColor="#b91c1c"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "Volvo",
    slug: "Volvo",
    logo: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="18" stroke="url(#gVo)" strokeWidth="2.2" fill="none"/>
        <circle cx="24" cy="24" r="18" fill="url(#gVoF)" fillOpacity="0.1"/>
        <path d="M32 16l3 3-11 11-11-11 3-3 8 8z" fill="url(#gVo)"/>
        <defs>
          <linearGradient id="gVo" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#93c5fd"/><stop offset="1" stopColor="#1d4ed8"/>
          </linearGradient>
          <linearGradient id="gVoF" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#93c5fd"/><stop offset="1" stopColor="#1e40af"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "VW",
    slug: "Volkswagen",
    logo: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="19" stroke="url(#gVW)" strokeWidth="2" fill="none"/>
        <path d="M24 9l-6 14h-4l10 16 10-16h-4L24 9z" fill="url(#gVWF)" fillOpacity=".85"/>
        <defs>
          <linearGradient id="gVW" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6ee7b7"/><stop offset="1" stopColor="#059669"/>
          </linearGradient>
          <linearGradient id="gVWF" x1="14" y1="9" x2="34" y2="39" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6ee7b7"/><stop offset="1" stopColor="#065f46"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "Ford",
    slug: "Ford",
    logo: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="24" cy="24" rx="20" ry="13" stroke="url(#gFo)" strokeWidth="2" fill="none"/>
        <text x="24" y="29" textAnchor="middle" fontFamily="Georgia,serif" fontSize="13" fontWeight="bold" fontStyle="italic" fill="url(#gFoF)">Ford</text>
        <defs>
          <linearGradient id="gFo" x1="4" y1="11" x2="44" y2="37" gradientUnits="userSpaceOnUse">
            <stop stopColor="#93c5fd"/><stop offset="1" stopColor="#1e40af"/>
          </linearGradient>
          <linearGradient id="gFoF" x1="10" y1="18" x2="38" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#bfdbfe"/><stop offset="1" stopColor="#3b82f6"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "Iveco",
    slug: "Iveco",
    logo: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="16" width="32" height="16" rx="4" stroke="url(#gIv)" strokeWidth="2" fill="none"/>
        <text x="24" y="28" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="900" fill="url(#gIvF)" letterSpacing="1">IVECO</text>
        <defs>
          <linearGradient id="gIv" x1="8" y1="16" x2="40" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fcd34d"/><stop offset="1" stopColor="#d97706"/>
          </linearGradient>
          <linearGradient id="gIvF" x1="8" y1="20" x2="40" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef3c7"/><stop offset="1" stopColor="#f59e0b"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "DAF",
    slug: "DAF",
    logo: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 34V14l10-4h8l10 4v20H10z" stroke="url(#gDaf)" strokeWidth="2" fill="none" strokeLinejoin="round"/>
        <text x="24" y="29" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="900" fill="url(#gDafF)" letterSpacing="1">DAF</text>
        <defs>
          <linearGradient id="gDaf" x1="10" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f9a8d4"/><stop offset="1" stopColor="#be185d"/>
          </linearGradient>
          <linearGradient id="gDafF" x1="10" y1="20" x2="38" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fce7f3"/><stop offset="1" stopColor="#ec4899"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  },
];

type Props = {
  marcaAtiva: string;
  buildHref: (marca: string | undefined) => string;
};

export function BrandFilter({ marcaAtiva, buildHref }: Props) {
  return (
    <>
      <div className="bf-row">
        {brands.map((b) => {
          const active = b.slug === "" ? !marcaAtiva : marcaAtiva === b.slug;
          const href = b.slug === "" ? buildHref(undefined) : buildHref(b.slug);
          return (
            <Link key={b.slug || "todas"} href={href} className={`bf-item${active ? " active" : ""}`}>
              <div className="bf-logo">{b.logo}</div>
              <span className="bf-name">{b.name}</span>
            </Link>
          );
        })}
      </div>
      <style>{`
        .bf-row {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding-bottom: 4px;
        }
        .bf-row::-webkit-scrollbar { display: none; }
        .bf-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          flex-shrink: 0;
          transition: transform .18s;
        }
        .bf-item:hover { transform: translateY(-3px); }
        .bf-logo {
          width: 58px; height: 58px;
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,.04);
          border: 1.5px solid rgba(255,255,255,.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow:
            0 2px 8px rgba(0,0,0,.25),
            0 1px 0 rgba(255,255,255,.08) inset,
            0 8px 24px rgba(0,0,0,.15);
          transition: border-color .18s, box-shadow .18s, background .18s;
          position: relative;
          overflow: hidden;
        }
        .bf-logo::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(180deg, rgba(255,255,255,.12) 0%, transparent 100%);
          border-radius: 18px 18px 0 0;
          pointer-events: none;
        }
        .bf-logo svg { width: 34px; height: 34px; }
        .bf-item.active .bf-logo {
          background: rgba(255,255,255,.1);
          border-color: rgba(255,255,255,.3);
          box-shadow:
            0 4px 16px rgba(0,0,0,.3),
            0 1px 0 rgba(255,255,255,.2) inset,
            0 0 0 2px rgba(96,165,250,.4);
        }
        .bf-item:hover .bf-logo {
          border-color: rgba(255,255,255,.2);
          box-shadow:
            0 8px 24px rgba(0,0,0,.3),
            0 1px 0 rgba(255,255,255,.15) inset;
        }
        .bf-name {
          font-size: 10px;
          font-weight: 800;
          color: var(--muted);
          letter-spacing: .03em;
          text-align: center;
          transition: color .18s;
        }
        .bf-item.active .bf-name { color: #93c5fd; }

        @media (max-width: 560px) {
          .bf-logo { width: 52px; height: 52px; border-radius: 16px; }
          .bf-logo svg { width: 30px; height: 30px; }
          .bf-name { font-size: 9px; }
        }
      `}</style>
    </>
  );
}
