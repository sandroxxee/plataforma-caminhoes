"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Info, LogIn, Menu, MessageCircle, Search, Store, Truck, UserRound, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/anuncios", label: "Caminhões", helper: "Ver anúncios", icon: Store },
  { href: "/anuncios?perfil=Implementos", label: "Implementos", helper: "Carretas e carrocerias", icon: Truck },
  { href: "/sobre", label: "Sobre", helper: "Como funciona", icon: Info },
  { href: "/anunciar", label: "Anunciar", helper: "Cadastrar veículo", icon: Search },
  { href: "/login", label: "Entrar", helper: "Acessar conta", icon: LogIn },
];

function isActive(pathname: string, href: string) {
  const cleanHref = href.split("?")[0].split("#")[0];
  if (cleanHref === "/") return pathname === "/";
  return pathname === cleanHref || pathname.startsWith(`${cleanHref}/`);
}

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="public-header">
      <div className="public-nav-shell">
        <Link href="/" className="public-brand" aria-label="Caminhões à Venda" onClick={closeMenu}>
          <span className="brand-mark"><Truck size={22} aria-hidden="true" /></span>
          <span className="brand-text">
            <Image src="/logo-horizontal-web.png" alt="Caminhões à Venda" width={230} height={84} priority />
            <small>Marketplace de caminhões</small>
          </span>
        </Link>

        <form className="search-top" action="/anuncios">
          <Search size={17} aria-hidden="true" />
          <input name="busca" type="search" placeholder="Buscar caminhões, implementos, marcas e cidades" />
        </form>

        <nav className={`public-menu ${open ? "open" : ""}`} id="menu" aria-label="Menu principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={active ? "active" : ""} onClick={closeMenu}>
                <Icon size={15} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link href="/#contato" className="contact-button">
          <MessageCircle size={17} aria-hidden="true" />
          Contato
        </Link>

        <button type="button" className="mobile-btn" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {open && <button type="button" className="menu-backdrop" aria-label="Fechar menu" onClick={closeMenu} />}

      <style>{`
        .public-header{position:sticky;top:0;z-index:80;background:rgba(255,255,255,.96);backdrop-filter:blur(14px);border-bottom:1px solid #dddfe2;box-shadow:0 1px 4px rgba(0,0,0,.06)}
        .public-nav-shell{width:min(1240px,calc(100vw - 28px));height:68px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:14px}
        .public-brand{display:flex;align-items:center;gap:11px;min-width:max-content;color:#050505;text-decoration:none}.brand-mark{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1877f2,#55a6ff);color:#fff;box-shadow:0 8px 18px rgba(24,119,242,.24);flex:0 0 auto}.brand-text{display:grid;gap:0;min-width:0}.brand-text img{width:176px;height:40px;object-fit:contain;object-position:left center;display:block}.brand-text small{color:#65676b;font-size:12px;font-weight:800;margin-top:-4px;white-space:nowrap}
        .search-top{flex:1;max-width:420px;height:44px;border-radius:999px;background:#f5f6f7;border:1px solid transparent;display:flex;align-items:center;gap:8px;padding:0 16px;color:#65676b}.search-top:focus-within{background:#fff;border-color:#1877f2;box-shadow:0 0 0 3px rgba(24,119,242,.12)}.search-top input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:#050505;font-weight:750}.search-top input::placeholder{color:#65676b}
        .public-menu{display:flex;align-items:center;gap:4px}.public-menu a{min-height:40px;display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 12px;border-radius:12px;color:#65676b;font-weight:800;font-size:14px;transition:.18s ease;white-space:nowrap;text-decoration:none}.public-menu a:hover,.public-menu a.active{background:#e7f3ff;color:#1877f2}.contact-button{min-height:44px;border-radius:12px;padding:0 16px;display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#1877f2;color:#fff;text-decoration:none;font-weight:900;white-space:nowrap;box-shadow:0 7px 16px rgba(24,119,242,.22);transition:.18s ease}.contact-button:hover{transform:translateY(-1px)}.mobile-btn{display:none;width:44px;height:44px;border-radius:50%;border:0;background:#f5f6f7;color:#050505;align-items:center;justify-content:center;cursor:pointer}.menu-backdrop{display:none}
        @media(max-width:1120px){.search-top{max-width:320px}.public-menu a{padding:0 10px;font-size:13px}.brand-text img{width:154px}}
        @media(max-width:980px){.search-top{display:none}.contact-button{display:none}.mobile-btn{display:inline-flex}.public-menu{position:fixed;top:76px;left:14px;right:14px;z-index:95;background:#fff;border:1px solid #dddfe2;border-radius:18px;box-shadow:0 12px 35px rgba(0,0,0,.13);padding:10px;display:none;flex-direction:column;align-items:stretch}.public-menu.open{display:flex}.public-menu a{min-height:48px;justify-content:flex-start;padding:0 14px}.menu-backdrop{position:fixed;inset:0;z-index:70;display:block;border:0;background:rgba(15,23,42,.18);cursor:pointer}}
        @media(max-width:580px){.public-nav-shell{width:calc(100vw - 20px);height:64px;gap:8px}.brand-mark{width:40px;height:40px}.brand-text img{width:142px;height:36px}.brand-text small{display:none}.public-menu{top:72px;left:10px;right:10px}.mobile-btn{width:42px;height:42px}}
        @media(max-width:390px){.brand-text img{width:124px}.brand-mark{width:38px;height:38px}.mobile-btn{width:40px;height:40px}}
      `}</style>
    </header>
  );
}
