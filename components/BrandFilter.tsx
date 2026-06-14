import Image from "next/image";
import Link from "next/link";

type Brand = { name: string; slug: string; logo: string };

const brands: Brand[] = [
  { name: "Todas",    slug: "",             logo: "" },
  { name: "Mercedes", slug: "Mercedes-Benz", logo: "https://img.logo.dev/mercedes-benz.com?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=64&format=png" },
  { name: "Scania",   slug: "Scania",        logo: "https://img.logo.dev/scania.com?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=64&format=png" },
  { name: "Volvo",    slug: "Volvo",         logo: "https://img.logo.dev/volvotrucks.com?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=64&format=png" },
  { name: "VW",       slug: "Volkswagen",    logo: "https://img.logo.dev/vw.com?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=64&format=png" },
  { name: "Ford",     slug: "Ford",          logo: "https://img.logo.dev/ford.com?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=64&format=png" },
  { name: "Iveco",    slug: "Iveco",         logo: "https://img.logo.dev/iveco.com?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=64&format=png" },
  { name: "DAF",      slug: "DAF",           logo: "https://img.logo.dev/daf.com?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=64&format=png" },
  { name: "MAN",      slug: "MAN",           logo: "https://img.logo.dev/man.eu?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=64&format=png" },
  { name: "Agrale",   slug: "Agrale",        logo: "https://img.logo.dev/agrale.com.br?token=pk_YPBKkuBFQVGGSPXDdBEMrg&size=64&format=png" },
];

const ALL_ICON = (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="34" height="34">
    <circle cx="24" cy="24" r="20" stroke="url(#gAll)" strokeWidth="2.5" fill="none"/>
    <path d="M14 24h20M24 14v20" stroke="url(#gAll)" strokeWidth="2.5" strokeLinecap="round"/>
    <defs>
      <linearGradient id="gAll" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/>
      </linearGradient>
    </defs>
  </svg>
);

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
              <div className="bf-logo">
                {b.logo ? (
                  <Image
                    src={b.logo}
                    alt={b.name}
                    width={38}
                    height={38}
                    style={{ objectFit: "contain", borderRadius: 8 }}
                    unoptimized
                  />
                ) : ALL_ICON}
              </div>
              <span className="bf-name">{b.name}</span>
            </Link>
          );
        })}
      </div>
      <style>{`
        .bf-row { display:flex; gap:10px; overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; padding-bottom:4px; }
        .bf-row::-webkit-scrollbar { display:none; }
        .bf-item { display:flex; flex-direction:column; align-items:center; gap:6px; text-decoration:none; flex-shrink:0; transition:transform .18s; }
        .bf-item:hover { transform:translateY(-3px); }
        .bf-logo {
          width:58px; height:58px; border-radius:18px;
          display:flex; align-items:center; justify-content:center;
          background:rgba(255,255,255,.06); border:1.5px solid rgba(255,255,255,.08);
          backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
          box-shadow:0 2px 8px rgba(0,0,0,.25),0 1px 0 rgba(255,255,255,.08) inset,0 8px 24px rgba(0,0,0,.15);
          transition:border-color .18s,box-shadow .18s,background .18s;
          position:relative; overflow:hidden;
        }
        .bf-logo::before {
          content:""; position:absolute; top:0; left:0; right:0; height:50%;
          background:linear-gradient(180deg,rgba(255,255,255,.12) 0%,transparent 100%);
          border-radius:18px 18px 0 0; pointer-events:none;
        }
        .bf-item.active .bf-logo {
          background:rgba(255,255,255,.12); border-color:rgba(255,255,255,.3);
          box-shadow:0 4px 16px rgba(0,0,0,.3),0 1px 0 rgba(255,255,255,.2) inset,0 0 0 2px rgba(96,165,250,.4);
        }
        .bf-item:hover .bf-logo { border-color:rgba(255,255,255,.2); box-shadow:0 8px 24px rgba(0,0,0,.3),0 1px 0 rgba(255,255,255,.15) inset; }
        .bf-name { font-size:10px; font-weight:800; color:var(--muted); letter-spacing:.03em; text-align:center; transition:color .18s; }
        .bf-item.active .bf-name { color:#93c5fd; }
        @media(max-width:560px) {
          .bf-logo { width:52px; height:52px; border-radius:16px; }
          .bf-name { font-size:9px; }
        }
      `}</style>
    </>
  );
}
