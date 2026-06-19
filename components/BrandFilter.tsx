import Link from "next/link";
import Image from "next/image";

type Brand = { name: string; slug: string; img?: string; icon?: React.ReactNode };

const brands: Brand[] = [
  {
    name: "Todas",
    slug: "",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
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
  { name: "Scania",     slug: "Scania",        img: "/scania-removebg-preview.png" },
  { name: "Volvo",      slug: "Volvo",          img: "/volvo-removebg-preview.png" },
  { name: "Mercedes",   slug: "Mercedes-Benz",  img: "/Gemini_Generated_Image_sdthoysdthoysdth__2_-removebg-preview.png" },
  { name: "DAF",        slug: "DAF",            img: "/daf-removebg-preview.png" },
  { name: "Iveco",      slug: "Iveco",          img: "/iveco-removebg-preview.png" },
  { name: "Ford",       slug: "Ford",           img: "/ford-removebg-preview.png" },
  { name: "VW",         slug: "Volkswagen",     img: "/volkswagen-removebg-preview.png" },
  { name: "Agrale",     slug: "Agrale",         img: "/agrale-removebg-preview.png" },
  { name: "Foton",      slug: "Foton",          img: "/foton-removebg-preview.png" },
  {
    name: "MAN",
    slug: "MAN",
    icon: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <circle cx="50" cy="50" r="44" fill="#cc0000"/>
        <text x="50" y="58" textAnchor="middle" fill="white" fontSize="28" fontWeight="900" fontFamily="Arial">MAN</text>
      </svg>
    ),
  },
  {
    name: "Randon",
    slug: "Randon",
    icon: (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <rect x="5" y="5" width="90" height="90" rx="8" fill="none" stroke="#e30613" strokeWidth="4"/>
        <text x="50" y="44" textAnchor="middle" fill="#e30613" fontSize="14" fontWeight="900" fontFamily="Arial">RANDON</text>
        <text x="50" y="65" textAnchor="middle" fill="#e30613" fontSize="10" fontFamily="Arial">IMPLEMENTOS</text>
      </svg>
    ),
  },
  { name: "Gemini",     slug: "Gemini",         img: "/Gemini_Generated_Image_sdthoysdthoysdth__2_-removebg-preview.png" },
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
            <Link key={b.slug || "all"} href={href} className={`bf-item${active ? " active" : ""}`}>
              <div className="bf-logo">
                {b.img ? (
                  <Image
                    src={b.img}
                    alt={`Logo ${b.name}`}
                    width={36}
                    height={36}
                    className="bf-img"
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  b.icon
                )}
              </div>
              <span className="bf-name">{b.name}</span>
            </Link>
          );
        })}
      </div>
      <style>{`
        .bf-row{display:flex;gap:8px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:4px}
        .bf-row::-webkit-scrollbar{display:none}
        .bf-item{display:flex;flex-direction:column;align-items:center;gap:5px;text-decoration:none;flex-shrink:0;transition:transform .18s}
        .bf-item:hover{transform:translateY(-3px)}
        .bf-logo{width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.08);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 2px 8px rgba(0,0,0,.25),0 1px 0 rgba(255,255,255,.08) inset,0 8px 24px rgba(0,0,0,.15);transition:border-color .18s,box-shadow .18s,background .18s;position:relative;overflow:hidden;padding:6px}
        .bf-logo::before{content:"";position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(180deg,rgba(255,255,255,.12) 0%,transparent 100%);border-radius:14px 14px 0 0;pointer-events:none}
        .bf-img{width:36px;height:36px;object-fit:contain;position:relative;z-index:1}
        .bf-item.active .bf-logo{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.3);box-shadow:0 4px 16px rgba(0,0,0,.3),0 1px 0 rgba(255,255,255,.2) inset,0 0 0 2px rgba(96,165,250,.4)}
        .bf-item:hover .bf-logo{border-color:rgba(255,255,255,.2);box-shadow:0 8px 24px rgba(0,0,0,.3),0 1px 0 rgba(255,255,255,.15) inset}
        .bf-name{font-size:10px;font-weight:800;color:var(--muted);letter-spacing:.03em;text-align:center;transition:color .18s}
        .bf-item.active .bf-name{color:#93c5fd}
        @media(max-width:560px){
          .bf-logo{width:44px;height:44px;border-radius:12px;padding:5px}
          .bf-img{width:30px;height:30px}
          .bf-name{font-size:9px}
          .bf-row{gap:6px}
        }
        @media(min-width:1024px){
          .bf-logo{width:54px;height:54px;border-radius:16px;padding:7px}
          .bf-img{width:38px;height:38px}
          .bf-name{font-size:11px}
        }
      `}</style>
    </>
  );
}
