"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Info, LogIn, Menu, MessageCircle, Search, Store, Truck, UserRound, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/anuncios", label: "Caminhões", helper: "Ver anúncios", icon: Store },
  { href: "/anuncios?perfil=Implementos", label: "Implementos", helper: "Carretas e carrocerias", icon: Truck },
  { href: "/anunciar", label: "Anunciar", helper: "Cadastrar veículo", icon: Search },
  { href: "/sobre", label: "Sobre", helper: "Como funciona", icon: Info },
  { href: "/#contato", label: "Contato", helper: "Atendimento", icon: MessageCircle },
];

function isActive(pathname: string, href: string) {
  const cleanHref = href.split("?")[0].split("#")[0];
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
          <Image src="/logo-horizontal-web.png" alt="Caminhões à Venda" width={230} height={84} priority />
        </Link>

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
          <button type="button" className="search-toggle" aria-label="Buscar caminhão" aria-expanded={searchOpen} onClick={() => setSearchOpen((value) => !value)}>
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
        <div className="mobile-menu-head">
          <span>Menu do site</span>
          <small>Escolha uma opção</small>
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
      </div>

      {open && <button type="button" className="menu-backdrop" aria-label="Fechar menu" onClick={closeMenu} />}

      <style>{`
        .public-header{position:sticky;top:10px;z-index:80;width:min(1240px,calc(100vw - 28px));margin:0 auto 0;background:transparent}.public-header-shell{min-height:70px;display:grid;grid-template-columns:auto minmax(380px,1fr) auto;align-items:center;gap:18px;padding:8px 10px 8px 14px;border-radius:20px;background:rgba(255,255,255,.94);border:1px solid rgba(217,221,227,.9);box-shadow:0 16px 40px rgba(15,23,42,.10);backdrop-filter:blur(16px)}.public-brand{height:52px;width:208px;display:flex;align-items:center;text-decoration:none;min-width:0}.public-brand img{width:100%;height:100%;object-fit:contain;object-position:left center;display:block}.public-nav{min-height:48px;display:flex;align-items:center;justify-content:center;gap:4px;min-width:0;padding:4px;border-radius:16px;background:#f5f6f7;border:1px solid #edf0f3}.public-nav a{height:40px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 13px;border-radius:12px;color:#65676b;font-size:12px;font-weight:950;letter-spacing:.02em;white-space:nowrap;text-decoration:none;transition:.18s ease}.public-nav a:hover,.public-nav a.active{background:#1877f2;color:#fff;box-shadow:0 10px 22px rgba(24,119,242,.18);transform:translateY(-1px)}.public-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;white-space:nowrap}.public-login,.menu-toggle,.search-toggle{min-height:42px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:13px;font-size:12px;font-weight:950;text-decoration:none;transition:.18s ease}.public-login{padding:0 15px;background:#1877f2;border:1px solid #1877f2;color:#fff;box-shadow:0 10px 20px rgba(24,119,242,.16)}.search-toggle,.menu-toggle{border:1px solid #d9dde3;background:#f5f6f7;color:#050505;cursor:pointer;width:42px}.menu-toggle{display:none}.public-login:hover,.search-toggle:hover,.menu-toggle:hover{transform:translateY(-1px)}.header-search{width:100%;display:grid;grid-template-columns:1fr auto;gap:10px;margin:8px auto 0;max-height:0;opacity:0;overflow:hidden;pointer-events:none;transition:.18s ease}.header-search.open{max-height:76px;opacity:1;pointer-events:auto;padding:0 0 8px}.header-search input{min-height:48px;border-radius:16px;border:1px solid #d9dde3;background:#fff;color:#050505;outline:0;padding:0 16px;font-weight:850;box-shadow:0 10px 26px rgba(15,23,42,.08)}.header-search button{min-height:48px;border:0;border-radius:16px;background:#1877f2;color:#fff;font-weight:950;padding:0 22px}.mobile-menu,.menu-backdrop{display:none}@media(max-width:1120px){.public-header-shell{grid-template-columns:auto 1fr auto}.public-nav{display:none}.menu-toggle{display:inline-flex}.public-brand{width:190px}}@media(max-width:760px){.public-header{top:8px;width:calc(100vw - 20px)}.public-header-shell{min-height:64px;padding:7px 9px 7px 12px;border-radius:18px}.public-brand{width:158px;height:48px}.public-login{display:none}.header-search{grid-template-columns:1fr}.header-search button{width:100%}.mobile-menu{position:fixed;left:10px;right:10px;top:82px;z-index:95;display:grid;gap:13px;padding:14px;border-radius:20px;background:#fff;border:1px solid #d9dde3;box-shadow:0 18px 50px rgba(15,23,42,.18);transform:translateY(-12px);opacity:0;pointer-events:none;transition:.18s ease}.mobile-menu.open{transform:translateY(0);opacity:1;pointer-events:auto}.mobile-menu-head span{display:block;color:#050505;font-size:18px;font-weight:950}.mobile-menu-head small{display:block;margin-top:3px;color:#65676b;font-weight:800}.mobile-menu-list{display:grid;gap:8px}.mobile-menu-list a{min-height:58px;display:grid;grid-template-columns:42px 1fr auto;align-items:center;gap:12px;padding:9px 12px;border-radius:16px;color:#050505;background:#f5f6f7;border:1px solid #d9dde3;text-decoration:none}.mobile-menu-list a.active{border-color:#1877f2;background:#e7f3ff}.mobile-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:14px;background:#e7f3ff;color:#1877f2}.mobile-menu-list strong{display:block;font-size:15px;font-weight:950}.mobile-menu-list small{display:block;margin-top:3px;color:#65676b;font-weight:800}.mobile-cta-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.mobile-cta-row a{min-height:46px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;text-decoration:none;font-size:12px;font-weight:950;text-transform:uppercase}.mobile-cta-row a:first-child{background:#1877f2;color:#fff}.mobile-cta-row a:last-child{background:#f5f6f7;border:1px solid #d9dde3;color:#050505}.menu-backdrop{position:fixed;inset:0;z-index:70;display:block;border:0;background:rgba(15,23,42,.22);cursor:pointer}}@media(max-width:390px){.public-brand{width:136px}.public-actions{gap:6px}.search-toggle,.menu-toggle{width:40px;min-height:40px}}
      `}</style>
    </header>
  );
}
