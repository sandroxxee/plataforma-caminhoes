"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Info, LogIn, Menu, Search, Store, Truck, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/anuncios", label: "Caminhões", icon: Store },
  { href: "/anuncios?perfil=Implementos", label: "Implementos", icon: Truck },
  { href: "/anunciar", label: "Anunciar", icon: Search },
  { href: "/sobre", label: "Sobre", icon: Info },
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
          <span className="brand-badge"><Truck size={20} aria-hidden="true" /></span>
          <span className="brand-text">
            <Image src="/logo-horizontal-web.png" alt="Caminhões à Venda" width={230} height={84} priority />
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
        <div className="mobile-menu-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} onClick={closeMenu} className={active ? "active" : ""}>
                <Icon size={18} aria-hidden="true" />
                <strong>{item.label}</strong>
              </Link>
            );
          })}
          <Link href="/login" onClick={closeMenu}>
            <LogIn size={18} aria-hidden="true" />
            <strong>Entrar</strong>
          </Link>
        </div>
      </div>

      {open && <button type="button" className="menu-backdrop" aria-label="Fechar menu" onClick={closeMenu} />}

      <style>{`
        .public-header{position:sticky;top:0;z-index:80;background:rgba(255,255,255,.97);border-bottom:1px solid var(--border);box-shadow:0 1px 4px rgba(15,23,42,.06);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
        .public-header-shell{width:min(1240px,calc(100vw - 28px));min-height:68px;margin:0 auto;display:grid;grid-template-columns:auto minmax(250px,420px) 1fr auto;align-items:center;gap:12px}
        .public-brand{display:flex;align-items:center;gap:10px;min-width:max-content;color:var(--text);text-decoration:none}.brand-badge{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 18px rgba(24,119,242,.2)}.brand-text img{width:178px;height:42px;object-fit:contain;object-position:left center;display:block}
        .desktop-search{height:44px;border-radius:999px;background:var(--surface-soft);border:1px solid transparent;display:flex;align-items:center;gap:8px;padding:0 14px;color:var(--muted)}.desktop-search:focus-within{background:#fff;border-color:var(--primary);box-shadow:0 0 0 3px rgba(24,119,242,.12)}.desktop-search input{width:100%;border:0;outline:0;background:transparent;color:var(--text);font-weight:750}.desktop-search input::placeholder{color:var(--muted)}
        .public-nav{display:flex;align-items:center;justify-content:center;gap:4px;min-width:0}.public-nav a{min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 12px;border-radius:12px;color:var(--muted);font-size:13px;font-weight:900;white-space:nowrap;text-decoration:none;transition:.18s ease}.public-nav a:hover,.public-nav a.active{background:#e7f3ff;color:var(--primary)}
        .public-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;white-space:nowrap}.public-login,.menu-toggle,.search-toggle{min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:12px;font-size:13px;font-weight:900;text-decoration:none;transition:.18s ease}.public-login{padding:0 15px;background:var(--primary);border:1px solid var(--primary);color:#fff;box-shadow:0 7px 16px rgba(24,119,242,.18)}.search-toggle,.menu-toggle{border:1px solid var(--border);background:var(--surface-soft);color:var(--text);cursor:pointer;width:44px}.public-login:hover,.menu-toggle:hover,.search-toggle:hover{transform:translateY(-1px)}.menu-toggle,.search-toggle{display:none}
        .header-search{width:min(1240px,calc(100vw - 28px));display:grid;grid-template-columns:1fr auto;gap:10px;margin:0 auto;max-height:0;opacity:0;overflow:hidden;pointer-events:none;transition:.18s ease}.header-search.open{max-height:80px;opacity:1;pointer-events:auto;padding:10px 0 12px}.header-search input{min-height:46px;border-radius:999px;border:1px solid var(--border);background:var(--surface-soft);color:var(--text);outline:0;padding:0 16px;font-weight:800}.header-search button{min-height:46px;border:0;border-radius:999px;background:var(--primary);color:#fff;font-weight:950;padding:0 22px}
        .mobile-menu,.menu-backdrop{display:none}
        @media(max-width:1180px){.public-header-shell{grid-template-columns:auto minmax(220px,1fr) auto}.public-nav{display:none}.menu-toggle,.search-toggle{display:inline-flex}}
        @media(max-width:760px){.public-header-shell{width:calc(100vw - 20px);min-height:64px;gap:8px}.brand-badge{width:40px;height:40px}.brand-text img{width:150px;height:36px}.desktop-search,.public-login{display:none}.header-search{width:calc(100vw - 20px);grid-template-columns:1fr}.header-search.open{padding-bottom:10px}.header-search button{width:100%}.mobile-menu{position:fixed;left:10px;right:10px;top:74px;z-index:95;display:grid;padding:12px;border-radius:20px;background:var(--surface);border:1px solid var(--border);box-shadow:0 18px 50px rgba(15,23,42,.18);transform:translateY(-12px);opacity:0;pointer-events:none;transition:.18s ease}.mobile-menu.open{transform:translateY(0);opacity:1;pointer-events:auto}.mobile-menu-list{display:grid;gap:8px}.mobile-menu-list a{min-height:54px;display:grid;grid-template-columns:34px 1fr;align-items:center;gap:10px;padding:8px 12px;border-radius:14px;color:var(--text);background:var(--surface-soft);border:1px solid var(--border);text-decoration:none}.mobile-menu-list a.active{border-color:var(--primary);background:#e7f3ff;color:var(--primary)}.mobile-menu-list strong{font-size:15px;font-weight:950}.menu-backdrop{position:fixed;inset:0;z-index:70;display:block;border:0;background:rgba(15,23,42,.22);cursor:pointer}}
        @media(max-width:390px){.brand-text img{width:132px}.public-actions{gap:6px}.search-toggle,.menu-toggle{width:40px;min-height:40px}}
      `}</style>
    </header>
  );
}
