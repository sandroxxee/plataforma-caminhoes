"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Info, LogIn, Menu, MessageCircle, Search, Truck, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/anuncios", label: "Caminhões", helper: "Ver anúncios", icon: Truck },
  { href: "/anunciar", label: "Anunciar", helper: "Cadastrar veículo", icon: Search },
  { href: "/#sobre", label: "Sobre", helper: "Como funciona", icon: Info },
  { href: "/#contato", label: "Contato", helper: "Atendimento", icon: MessageCircle },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="public-header">
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
                <Icon size={16} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="public-actions">
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

      <div className={`mobile-menu ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="mobile-menu-head">
          <span>Menu rápido</span>
          <small>Escolha uma ação</small>
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
            Quero anunciar
          </Link>
          <Link href="/login" onClick={closeMenu}>
            <LogIn size={17} aria-hidden="true" />
            Entrar
          </Link>
        </div>
      </div>

      {open && <button type="button" className="menu-backdrop" aria-label="Fechar menu" onClick={closeMenu} />}

      <style>{`
        .public-header{position:sticky;top:14px;z-index:80;width:min(1240px,calc(100vw - 32px));margin:0 auto;padding:0 0 14px}.public-header-shell{min-height:76px;display:grid;grid-template-columns:auto minmax(340px,1fr) auto;align-items:center;gap:18px;padding:10px 14px 10px 16px;border-radius:22px;background:linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.035)),linear-gradient(180deg,rgba(13,18,20,.92),rgba(7,12,13,.84));border:1px solid rgba(255,255,255,.14);box-shadow:0 18px 58px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.08);backdrop-filter:blur(18px)}.public-brand{width:min(260px,28vw);min-width:190px;height:58px;display:flex;align-items:center;color:white;text-decoration:none}.public-brand img{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 12px 20px rgba(0,0,0,.38))}.public-nav{min-height:52px;display:flex;justify-content:center;align-items:center;gap:6px;min-width:0;padding:5px;border-radius:16px;background:rgba(2,6,8,.30);border:1px solid rgba(255,255,255,.075)}.public-nav a{position:relative;min-height:42px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 14px;border-radius:12px;color:rgba(248,250,252,.78);font-size:12px;font-weight:950;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;text-decoration:none;transition:color .18s ease,background .18s ease,transform .18s ease}.public-nav a:hover,.public-nav a.active{color:#052e16;background:#22c55e;transform:translateY(-1px);box-shadow:0 12px 28px rgba(34,197,94,.22)}.public-actions{display:flex;align-items:center;justify-content:flex-end;gap:10px;white-space:nowrap}.public-login,.menu-toggle{min-height:46px;display:inline-flex;align-items:center;justify-content:center;gap:9px;border-radius:14px;font-size:12px;font-weight:950;letter-spacing:.05em;text-transform:uppercase;text-decoration:none;transition:.18s ease}.public-login{padding:0 16px;background:#22c55e;border:1px solid rgba(34,197,94,.72);color:#052e16;box-shadow:0 14px 34px rgba(34,197,94,.18)}.public-login:hover,.menu-toggle:hover{transform:translateY(-1px)}.menu-toggle{display:none;width:46px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.07);color:white;cursor:pointer}.mobile-menu,.menu-backdrop{display:none}@media(max-width:1120px){.public-header{top:10px}.public-header-shell{grid-template-columns:auto 1fr auto;min-height:72px}.public-nav{display:none}.menu-toggle{display:inline-flex}}@media(max-width:760px){.public-header{width:calc(100vw - 22px);top:8px;padding-bottom:10px}.public-header-shell{min-height:68px;padding:9px 10px 9px 12px;border-radius:18px}.public-brand{min-width:0;width:178px;height:50px}.public-login{display:none}.mobile-menu{position:fixed;left:11px;right:11px;top:88px;z-index:95;display:grid;gap:14px;padding:14px;border-radius:22px;background:linear-gradient(180deg,rgba(12,18,20,.98),rgba(5,8,10,.98));border:1px solid rgba(255,255,255,.14);box-shadow:0 28px 80px rgba(0,0,0,.48);transform:translateY(-12px);opacity:0;pointer-events:none;transition:.18s ease}.mobile-menu.open{transform:translateY(0);opacity:1;pointer-events:auto}.mobile-menu-head span{display:block;color:white;font-size:18px;font-weight:950}.mobile-menu-head small{display:block;margin-top:3px;color:#94a3b8;font-weight:800}.mobile-menu-list{display:grid;gap:8px}.mobile-menu-list a{min-height:58px;display:grid;grid-template-columns:42px 1fr auto;align-items:center;gap:12px;padding:9px 12px;border-radius:16px;color:white;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.10);text-decoration:none}.mobile-menu-list a.active{border-color:rgba(34,197,94,.36);background:rgba(34,197,94,.12)}.mobile-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:14px;background:rgba(34,197,94,.13);color:#86efac}.mobile-menu-list strong{display:block;font-size:15px;font-weight:950}.mobile-menu-list small{display:block;margin-top:3px;color:#94a3b8;font-weight:800}.mobile-cta-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.mobile-cta-row a{min-height:46px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:14px;text-decoration:none;font-size:12px;font-weight:950;text-transform:uppercase}.mobile-cta-row a:first-child{background:#22c55e;color:#052e16}.mobile-cta-row a:last-child{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:white}.menu-backdrop{position:fixed;inset:0;z-index:70;display:block;border:0;background:rgba(0,0,0,.26);cursor:pointer}}@media(max-width:390px){.public-brand{width:158px}.mobile-cta-row{grid-template-columns:1fr}}
      `}</style>
    </header>
  );
}
