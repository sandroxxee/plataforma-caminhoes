"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Info, LogIn, MapPin, Menu, Search, Store, Truck, UserRound, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/anuncios", label: "Anúncios", helper: "Ver estoque", icon: Store },
  { href: "/anuncios?perfil=Implementos", label: "Implementos", helper: "Carretas e carrocerias", icon: Truck },
  { href: "/anunciar", label: "Anunciar", helper: "Cadastrar veículo", icon: Search },
  { href: "/sobre", label: "Quem somos", helper: "Como funciona", icon: Info },
];

function isActive(pathname: string, href: string) {
  const cleanHref = href.split("?")[0];
  if (cleanHref === "/") return pathname === "/";
  return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
}

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="public-header">
      <div className="public-header-shell">
        <Link href="/" className="public-brand" aria-label="Caminhões à Venda" onClick={closeMenu}>
          <span className="brand-badge"><Truck size={21} aria-hidden="true" /></span>
          <span className="brand-text">
            <Image src="/logo-horizontal-web.png" alt="Caminhões à Venda" width={230} height={84} priority />
            <small>Marketplace de caminhões</small>
          </span>
        </Link>

        <form className="desktop-search" action="/anuncios">
          <Search size={17} aria-hidden="true" />
          <input name="busca" placeholder="Buscar caminhão, implemento, marca ou cidade" />
        </form>

        <nav className="public-nav" aria-label="Menu principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={active ? "active" : ""}>
                <Icon size={15} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="public-actions">
          <button type="button" className="search-toggle" aria-label="Buscar no estoque" aria-expanded={searchOpen} onClick={() => setSearchOpen((value) => !value)}>
            {searchOpen ? <X size={17} aria-hidden="true" /> : <Search size={17} aria-hidden="true" />}
          </button>
          <ThemeToggle />
          <Link href="/login" className="public-login">
            <LogIn size={17} aria-hidden="true" />
            Entrar
          </Link>
          <button type="button" className="menu-toggle" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <form className={`header-search ${searchOpen ? "open" : ""}`} action="/anuncios" aria-hidden={!searchOpen}>
        <input name="busca" placeholder="Buscar caminhão, implemento, marca, modelo ou cidade..." />
        <button type="submit">Buscar</button>
      </form>

      <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu-head">
          <span>Menu do site</span>
          <small>Estoque, loja, anúncios e acesso</small>
        </div>

        <div className="mobile-menu-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} onClick={closeMenu} className={active ? "active" : ""}>
                <span className="mobile-icon"><Icon size={18} aria-hidden="true" /></span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.helper}</small>
                </span>
                <ChevronRight size={17} aria-hidden="true" />
              </Link>
            );
          })}
        </div>

        <div className="mobile-cta-row">
          <Link href="/anunciar" onClick={closeMenu}><Truck size={17} aria-hidden="true" />Anunciar</Link>
          <Link href="/login" onClick={closeMenu}><UserRound size={17} aria-hidden="true" />Entrar</Link>
        </div>

        <div className="mobile-location"><MapPin size={16} aria-hidden="true" /> Atendimento e negociação pelo WhatsApp</div>
      </div>

      {open && <button type="button" className="menu-backdrop" aria-label="Fechar menu" onClick={closeMenu} />}

      <style>{`
        .public-header{position:sticky;top:0;z-index:80;background:rgba(255,255,255,.96);border-bottom:1px solid var(--site-line);box-shadow:0 1px 4px rgba(0,0,0,.06);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
        .public-header-shell{width:min(1240px,calc(100vw - 28px));min-height:68px;margin:0 auto;display:grid;grid-template-columns:auto minmax(260px,420px) 1fr auto;align-items:center;gap:12px}
        .public-brand{display:flex;align-items:center;gap:10px;min-width:max-content;color:var(--site-text);text-decoration:none}.brand-badge{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,var(--site-blue),#55a6ff);color:#fff;box-shadow:0 8px 18px rgba(24,119,242,.24)}.brand-text{display:grid;gap:0}.brand-text img{width:185px;height:42px;object-fit:contain;object-position:left center;display:block}.brand-text small{color:var(--site-muted);font-size:12px;font-weight:800;margin-top:-3px}
        .desktop-search{height:44px;border-radius:999px;background:var(--site-surface-2);border:1px solid transparent;display:flex;align-items:center;gap:8px;padding:0 14px;color:var(--site-muted)}.desktop-search:focus-within{background:var(--site-surface);border-color:color-mix(in srgb,var(--site-blue) 35%,var(--site-line));box-shadow:0 0 0 3px color-mix(in srgb,var(--site-blue) 12%,transparent)}.desktop-search input{width:100%;border:0;outline:0;background:transparent;color:var(--site-text);font-weight:750}.desktop-search input::placeholder{color:var(--site-muted)}
        .public-nav{display:flex;align-items:center;justify-content:center;gap:4px;min-width:0}.public-nav a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 12px;border-radius:12px;color:var(--site-muted);font-size:13px;font-weight:900;white-space:nowrap;text-decoration:none;transition:.18s ease}.public-nav a:hover,.public-nav a.active{background:var(--site-blue-soft);color:var(--site-blue)}
        .public-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;white-space:nowrap}.public-login,.menu-toggle,.search-toggle,.theme-toggle{min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:12px;font-size:13px;font-weight:900;text-decoration:none;transition:.18s ease}.public-login{padding:0 15px;background:var(--site-blue);border:1px solid var(--site-blue);color:#fff;box-shadow:0 7px 16px rgba(24,119,242,.18)}.search-toggle,.menu-toggle,.theme-toggle{border:1px solid var(--site-line);background:var(--site-surface-2);color:var(--site-text);cursor:pointer}.search-toggle,.menu-toggle{width:44px}.theme-toggle{padding:0 12px}.public-login:hover,.menu-toggle:hover,.search-toggle:hover,.theme-toggle:hover{transform:translateY(-1px)}.menu-toggle{display:none}.search-toggle{display:none}
        .header-search{width:min(1240px,calc(100vw - 28px));display:grid;grid-template-columns:1fr auto;gap:10px;margin:0 auto;max-height:0;opacity:0;overflow:hidden;pointer-events:none;transition:.18s ease}.header-search.open{max-height:80px;opacity:1;pointer-events:auto;padding:10px 0 12px}.header-search input{min-height:46px;border-radius:999px;border:1px solid var(--site-line);background:var(--site-surface-2);color:var(--site-text);outline:0;padding:0 16px;font-weight:800}.header-search button{min-height:46px;border:0;border-radius:999px;background:var(--site-blue);color:#fff;font-weight:950;padding:0 22px}
        .mobile-menu,.menu-backdrop{display:none}html[data-theme="dark"] .public-header{background:rgba(17,24,39,.94)}
        @media(max-width:1180px){.public-header-shell{grid-template-columns:auto minmax(220px,1fr) auto}.public-nav{display:none}.menu-toggle{display:inline-flex}.search-toggle{display:inline-flex}}
        @media(max-width:760px){.public-header-shell{width:calc(100vw - 20px);min-height:64px;gap:8px}.brand-badge{width:40px;height:40px}.brand-text img{width:150px;height:36px}.brand-text small,.desktop-search,.public-login,.theme-toggle span{display:none}.theme-toggle{width:44px;padding:0}.header-search{width:calc(100vw - 20px);grid-template-columns:1fr}.header-search.open{padding-bottom:10px}.header-search button{width:100%}.mobile-menu{position:fixed;left:10px;right:10px;top:74px;z-index:95;display:grid;gap:13px;padding:14px;border-radius:20px;background:var(--site-surface-solid);border:1px solid var(--site-line);box-shadow:var(--site-shadow);transform:translateY(-12px);opacity:0;pointer-events:none;transition:.18s ease}.mobile-menu.open{transform:translateY(0);opacity:1;pointer-events:auto}.mobile-menu-head span{display:block;color:var(--site-text);font-size:18px;font-weight:950}.mobile-menu-head small{display:block;margin-top:3px;color:var(--site-muted);font-weight:800}.mobile-menu-list{display:grid;gap:8px}.mobile-menu-list a{min-height:58px;display:grid;grid-template-columns:42px 1fr auto;align-items:center;gap:12px;padding:9px 12px;border-radius:16px;color:var(--site-text);background:var(--site-surface-2);border:1px solid var(--site-line);text-decoration:none}.mobile-menu-list a.active{border-color:color-mix(in srgb,var(--site-blue) 36%,var(--site-line));background:var(--site-blue-soft)}.mobile-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:14px;background:var(--site-blue-soft);color:var(--site-blue)}.mobile-menu-list strong{display:block;font-size:15px;font-weight:950}.mobile-menu-list small{display:block;margin-top:3px;color:var(--site-muted);font-weight:800}.mobile-cta-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.mobile-cta-row a{min-height:46px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;text-decoration:none;font-size:12px;font-weight:950;text-transform:uppercase}.mobile-cta-row a:first-child{background:var(--site-blue);color:#fff}.mobile-cta-row a:last-child{background:var(--site-surface-2);border:1px solid var(--site-line);color:var(--site-text)}.mobile-location{min-height:42px;border-radius:15px;background:var(--site-green-soft);color:var(--site-green);display:flex;align-items:center;gap:8px;justify-content:center;font-size:12px;font-weight:900}.menu-backdrop{position:fixed;inset:0;z-index:70;display:block;border:0;background:rgba(0,0,0,.22);cursor:pointer}}
        @media(max-width:390px){.brand-text img{width:132px}.public-actions{gap:6px}.search-toggle,.menu-toggle,.theme-toggle{width:40px;min-height:40px}}
      `}</style>
    </header>
  );
}
