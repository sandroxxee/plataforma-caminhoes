import Link from "next/link";

type Brand = { name: string; slug: string; icon: React.ReactNode };

const brands: Brand[] = [
  {
    name: "Todas", slug: "",
    icon: <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="34" height="34"><circle cx="24" cy="24" r="20" stroke="url(#gAll)" strokeWidth="2.5" fill="none"/><path d="M14 24h20M24 14v20" stroke="url(#gAll)" strokeWidth="2.5" strokeLinecap="round"/><defs><linearGradient id="gAll" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs></svg>,
  },
  {
    name: "Scania", slug: "Scania",
    icon: <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="38" height="38"><path d="M50 5C25 5 5 25 5 50s20 45 45 45 45-20 45-45S75 5 50 5z" fill="#1a3a6e" stroke="#c8a84b" strokeWidth="3"/><text x="50" y="56" textAnchor="middle" fill="#c8a84b" fontSize="18" fontWeight="bold" fontFamily="Arial">SCANIA</text></svg>,
  },
  {
    name: "Volvo", slug: "Volvo",
    icon: <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="38" height="38"><circle cx="50" cy="50" r="44" fill="none" stroke="#003057" strokeWidth="6"/><text x="50" y="57" textAnchor="middle" fill="#003057" fontSize="18" fontWeight="bold" fontFamily="Arial">VOLVO</text></svg>,
  },
  {
    name: "Mercedes", slug: "Mercedes-Benz",
    icon: <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="38" height="38"><circle cx="50" cy="50" r="44" fill="none" stroke="#aaa" strokeWidth="3"/><circle cx="50" cy="50" r="38" fill="none" stroke="#aaa" strokeWidth="1"/><path d="M50 12L50 50M50 50L79 72M50 50L21 72" stroke="#aaa" strokeWidth="5" strokeLinecap="round"/></svg>,
  },
  {
    name: "DAF", slug: "DAF",
    icon: <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="38" height="38"><rect x="5" y="30" width="90" height="40" rx="6" fill="none" stroke="#ff6600" strokeWidth="4"/><text x="50" y="57" textAnchor="middle" fill="#ff6600" fontSize="26" fontWeight="900" fontFamily="Arial">DAF</text></svg>,
  },
  {
    name: "MAN", slug: "MAN",
    icon: <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="38" height="38"><circle cx="50" cy="50" r="44" fill="#cc0000"/><text x="50" y="58" textAnchor="middle" fill="white" fontSize="28" fontWeight="900" fontFamily="Arial">MAN</text></svg>,
  },
  {
    name: "Iveco", slug: "Iveco",
    icon: <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="38" height="38"><rect x="5" y="5" width="90" height="90" rx="8" fill="none" stroke="#003087" strokeWidth="4"/><text x="50" y="57" textAnchor="middle" fill="#003087" fontSize="22" fontWeight="900" fontFamily="Arial">IVECO</text></svg>,
  },
  {
    name: "Ford", slug: "Ford",
    icon: <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" width="44" height="28"><ellipse cx="50" cy="30" rx="48" ry="28" fill="#003087"/><text x="50" y="38" textAnchor="middle" fill="white" fontSize="26" fontStyle="italic" fontWeight="bold" fontFamily="Arial">Ford</text></svg>,
  },
  {
    name: "VW", slug: "Volkswagen",
    icon: <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="38" height="38"><circle cx="50" cy="50" r="44" fill="none" stroke="#1b3a6b" strokeWidth="4"/><path d="M30 35L50 70L70 35M38 35L50 58L62 35" fill="none" stroke="#1b3a6b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    name: "Randon", slug: "Randon",
    icon: <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="38" height="38"><rect x="5" y="5" width="90" height="90" rx="8" fill="none" stroke="#e30613" strokeWidth="4"/><text x="50" y="44" textAnchor="middle" fill="#e30613" fontSize="14" fontWeight="900" fontFamily="Arial">RANDON</text><text x="50" y="65" textAnchor="middle" fill="#e30613" fontSize="10" fontFamily="Arial">IMPLEMENTOS</text></svg>,
  },
  {
    name: "Agrale", slug: "Agrale",
    icon: <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="38" height="38"><polygon points="50,8 92,78 8,78" fill="none" stroke="#009640" strokeWidth="5" strokeLinejoin="round"/><text x="50" y="68" textAnchor="middle" fill="#009640" fontSize="16" fontWeight="900" fontFamily="Arial">AGRALE</text></svg>,
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
            <Link key={b.slug || "all"} href={href} className={`bf-item${active ? " active" : ""}`}>
              <div className="bf-logo">{b.icon}</div>
              <span className="bf-name">{b.name}</span>
            </Link>
          );
        })}
      </div>
      <style>{`
        .bf-row{display:flex;gap:10px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:4px}
        .bf-row::-webkit-scrollbar{display:none}
        .bf-item{display:flex;flex-direction:column;align-items:center;gap:6px;text-decoration:none;flex-shrink:0;transition:transform .18s}
        .bf-item:hover{transform:translateY(-3px)}
        .bf-logo{width:58px;height:58px;border-radius:18px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.08);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 2px 8px rgba(0,0,0,.25),0 1px 0 rgba(255,255,255,.08) inset,0 8px 24px rgba(0,0,0,.15);transition:border-color .18s,box-shadow .18s,background .18s;position:relative;overflow:hidden}
        .bf-logo::before{content:"";position:absolute;top:0;left:0;right:0;height:50%;background:linear-gradient(180deg,rgba(255,255,255,.12) 0%,transparent 100%);border-radius:18px 18px 0 0;pointer-events:none}
        .bf-item.active .bf-logo{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.3);box-shadow:0 4px 16px rgba(0,0,0,.3),0 1px 0 rgba(255,255,255,.2) inset,0 0 0 2px rgba(96,165,250,.4)}
        .bf-item:hover .bf-logo{border-color:rgba(255,255,255,.2);box-shadow:0 8px 24px rgba(0,0,0,.3),0 1px 0 rgba(255,255,255,.15) inset}
        .bf-name{font-size:10px;font-weight:800;color:var(--muted);letter-spacing:.03em;text-align:center;transition:color .18s}
        .bf-item.active .bf-name{color:#93c5fd}
        @media(max-width:560px){.bf-logo{width:52px;height:52px;border-radius:16px}.bf-name{font-size:9px}}
      `}</style>
    </>
  );
}
