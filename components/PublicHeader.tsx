"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Info, LogIn, Menu, Search, Truck, X } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/anuncios", label: "Caminhões", helper: "Ver estoque", icon: Truck },
  { href: "/anuncios?perfil=Implementos", label: "Implementos", helper: "Carretas e carrocerias", icon: Truck },
  { href: "/anunciar", label: "Anunciar", helper: "Cadastrar veículo", icon: Search },
  { href: "/sobre", label: "Sobre", helper: "Como funciona", icon: Info },
];

function isActive(pathname: string, href: string) {
  const cleanHref = href.split("?")[0];
  if (cleanHref === "/") return pathname === "/";
  if (cleanHref.startsWith("/#")) return false;
  return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
}

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="public-header">
      <div className="public-header-topline">
        <span>Caminhões, implementos e oportunidades</span>
        <strong>Contato direto pelo WhatsApp</strong>
      </div>

      <div className="public-header-shell">
        <Link href="/" className="public-brand" aria-label="Caminhões à Venda" onClick={closeMenu}>
          <Image src="/logo-horizontal-web.png" alt="Caminhões à Venda" width={260} height={95} priority />
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
          <button type="button" className="search-toggle" aria-label="Buscar no estoque" aria-expanded={searchOpen} onClick={() => setSearchOpen((value) => !value)}>
            {searchOpen ? <X size={17} aria-hidden="true" /> : <Search size={17} aria-hidden="true" />}
          </button>
          <ThemeToggle />
          <Link href="/login" className="public-login">
            <LogIn size={17} aria-hidden="true" />
            Entrar
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
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
          <small>Escolha uma ação rápida</small>
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
          <Link href="/anunciar" onClick={closeMenu}>
            <Truck size={17} aria-hidden="true" />
            Anunciar
          </Link>
          <Link href="/login" onClick={closeMenu}>
            <LogIn size={17} aria-hidden="true" />
            Entrar
          </Link>
        </div>
      </div>

      {open && <button type="button" className="menu-backdrop" aria-label="Fechar menu" onClick={closeMenu} />}

      <style>{`
        .public-header{position:sticky;top:10px;z-index:80;width:min(1240px,calc(100vw - 32px));margin:0 auto;padding:0 0 14px}.public-header-topline{min-height:34px;margin:0 auto 8px;padding:0 14px;display:flex;align-items:center;justify-content:center;gap:10px;border-radius:999px;color:#fff;background:linear-gradient(90deg,var(--site-green-2,#087f4d),var(--site-green,#22d37d),var(--site-green-2,#087f4d));box-shadow:0 14px 34px rgba(34,211,125,.18);font-size:12px;font-weight:950;letter-spacing:.035em;text-transform:uppercase}.public-header-topline span{opacity:.92}.public-header-topline strong{font-weight:1000}.public-header-shell{min-height:74px;display:grid;grid-template-columns:auto minmax(340px,1fr) auto;align-items:center;gap:16px;padding:10px 14px 10px 16px;border-radius:24px;background:linear-gradient(135deg,rgba(255,255,255,.11),rgba(255,255,255,.035)),var(--site-header,rgba(5,11,8,.86));border:1px solid var(--site-line,rgba(255,255,255,.11));box-shadow:var(--site-shadow-soft,0 16px 42px rgba(0,0,0,.26)),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px)}.public-brand{width:min(246px,27vw);min-width:180px;height:56px;display:flex;align-items:center;color:var(--site-text,#fff);text-decoration:none}.public-brand img{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 12px 20px rgba(0,0,0,.32))}.public-nav{min-height:52px;display:flex;justify-content:center;align-items:center;gap:4px;min-width:0;padding:5px;border-radius:999px;background:rgba(2,6,8,.24);border:1px solid var(--site-line,rgba(255,255,255,.10))}.public-nav a{position:relative;min-height:42px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 12px;border-radius:999px;color:color-mix(in srgb,var(--site-text,#eefaf3) 72%,transparent);font-size:12px;font-weight:950;letter-spacing:.02em;white-space:nowrap;text-decoration:none;transition:color .18s ease,background .18s ease,transform .18s ease,box-shadow .18s ease}.public-nav a:hover,.public-nav a.active{color:#052e16;background:linear-gradient(135deg,var(--site-green,#22d37d),var(--site-green-2,#10a763));transform:translateY(-1px);box-shadow:0 12px 28px rgba(34,211,125,.22)}.public-actions{display:flex;align-items:center;justify-content:flex-end;gap:9px;white-space:nowrap}.public-login,.menu-toggle,.search-toggle,.theme-toggle{min-height:46px;display:inline-flex;align-items:center;justify-content:center;gap:9px;border-radius:999px;font-size:12px;font-weight:950;letter-spacing:.035em;text-decoration:none;transition:transform .18s ease,box-shadow .18s ease,background .18s ease}.public-login{padding:0 17px;background:linear-gradient(135deg,var(--site-green,#22d37d),var(--site-green-2,#10a763));border:1px solid rgba(34,197,94,.60);color:#052e16;box-shadow:0 14px 34px rgba(34,197,94,.18)}.search-toggle,.menu-toggle,.theme-toggle{border:1px solid var(--site-line,rgba(255,255,255,.14));background:var(--site-surface,rgba(255,255,255,.07));color:var(--site-text,#fff);cursor:pointer}.search-toggle,.menu-toggle{width:46px}.theme-toggle{padding:0 13px}.theme-toggle span{display:inline}.public-login:hover,.menu-toggle:hover,.search-toggle:hover,.theme-toggle:hover{transform:translateY(-2px)}.menu-toggle{display:none}.header-search{display:grid;grid-template-columns:1fr auto;gap:10px;margin:10px 0 0;padding:0;max-height:0;opacity:0;overflow:hidden;pointer-events:none;transition:.18s ease}.header-search.open{max-height:86px;opacity:1;pointer-events:auto;padding:10px;border-radius:22px;background:var(--site-surface,rgba(7,12,13,.94));border:1px solid var(--site-line,rgba(255,255,255,.12));box-shadow:var(--site-shadow-soft,0 18px 48px rgba(0,0,0,.30));backdrop-filter:blur(16px)}.header-search input{min-height:48px;border-radius:999px;border:1px solid var(--site-line,rgba(255,255,255,.12));background:var(--site-surface-2,rgba(255,255,255,.06));color:var(--site-text,#fff);outline:0;padding:0 16px;font-weight:850}.header-search button{min-height:48px;border:0;border-radius:999px;background:linear-gradient(135deg,var(--site-green,#22d37d),var(--site-green-2,#10a763));color:#052e16;font-weight:950;padding:0 22px}.mobile-menu,.menu-backdrop{display:none}html[data-theme="light"] .public-header-shell{background:linear-gradient(135deg,rgba(255,255,255,.92),rgba(243,247,245,.82));border-color:var(--site-line,rgba(16,32,24,.12));box-shadow:var(--site-shadow-soft,0 18px 48px rgba(16,32,24,.12)),inset 0 1px 0 rgba(255,255,255,.9)}html[data-theme="light"] .public-nav{background:rgba(16,32,24,.045);border-color:var(--site-line,rgba(16,32,24,.08))}html[data-theme="light"] .public-nav a{color:#52645b}html[data-theme="light"] .search-toggle,html[data-theme="light"] .menu-toggle,html[data-theme="light"] .theme-toggle{background:#fff;color:#102018;border-color:var(--site-line,rgba(16,32,24,.12))}html[data-theme="light"] .header-search.open{background:rgba(255,255,255,.96);border-color:var(--site-line,rgba(16,32,24,.12))}@media(max-width:1120px){.public-header{top:8px}.public-header-shell{grid-template-columns:auto 1fr auto;min-height:72px}.public-nav{display:none}.menu-toggle{display:inline-flex}}@media(max-width:760px){.public-header{width:calc(100vw - 22px);top:7px;padding-bottom:10px}.public-header-topline{min-height:30px;margin-bottom:7px;font-size:10px;padding:0 10px}.public-header-topline span{display:none}.public-header-shell{min-height:66px;padding:8px 10px 8px 12px;border-radius:19px;gap:8px}.public-brand{min-width:0;width:170px;height:48px}.public-login{display:none}.theme-toggle{width:46px;padding:0}.theme-toggle span{display:none}.header-search.open{grid-template-columns:1fr;padding:10px}.header-search button{width:100%}.mobile-menu{position:fixed;left:11px;right:11px;top:104px;z-index:95;display:grid;gap:14px;padding:14px;border-radius:22px;background:var(--site-surface-solid,#0b1711);border:1px solid var(--site-line,rgba(255,255,255,.14));box-shadow:var(--site-shadow,0 28px 80px rgba(0,0,0,.48));transform:translateY(-12px);opacity:0;pointer-events:none;transition:.18s ease}.mobile-menu.open{transform:translateY(0);opacity:1;pointer-events:auto}.mobile-menu-head span{display:block;color:var(--site-text,#fff);font-size:18px;font-weight:950}.mobile-menu-head small{display:block;margin-top:3px;color:var(--site-muted,#94a3b8);font-weight:800}.mobile-menu-list{display:grid;gap:8px}.mobile-menu-list a{min-height:58px;display:grid;grid-template-columns:42px 1fr auto;align-items:center;gap:12px;padding:9px 12px;border-radius:16px;color:var(--site-text,#fff);background:var(--site-surface,rgba(255,255,255,.055));border:1px solid var(--site-line,rgba(255,255,255,.10));text-decoration:none}.mobile-menu-list a.active{border-color:rgba(34,197,94,.36);background:var(--site-green-soft,rgba(34,197,94,.12))}.mobile-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:14px;background:var(--site-green-soft,rgba(34,197,94,.13));color:var(--site-green,#86efac)}.mobile-menu-list strong{display:block;font-size:15px;font-weight:950}.mobile-menu-list small{display:block;margin-top:3px;color:var(--site-muted,#94a3b8);font-weight:800}.mobile-cta-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.mobile-cta-row a{min-height:46px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;text-decoration:none;font-size:12px;font-weight:950;text-transform:uppercase}.mobile-cta-row a:first-child{background:linear-gradient(135deg,var(--site-green,#22d37d),var(--site-green-2,#10a763));color:#052e16}.mobile-cta-row a:last-child{background:var(--site-surface,rgba(255,255,255,.07));border:1px solid var(--site-line,rgba(255,255,255,.12));color:var(--site-text,#fff)}.menu-backdrop{position:fixed;inset:0;z-index:70;display:block;border:0;background:rgba(0,0,0,.26);cursor:pointer}}@media(max-width:390px){.public-brand{width:152px}.mobile-cta-row{grid-template-columns:1fr}}
      `}</style>
    </header>
  );
}
