"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Truck, Wrench, Handshake, LayoutDashboard, LogIn,
  Search, X, Menu, Settings, Package, ChevronDown, Store,
  Info, HelpCircle, ShieldCheck, Mail
} from "lucide-react";
import { ThemeTogglePublic } from "./ThemeTogglePublic";

function isActive(pathname: string, href: string) {
  const clean = href.split("?")[0].split("#")[0];
  if (clean === "/") return pathname === "/";
  return pathname === clean || pathname.startsWith(`${clean}/`);
}

type Props = { isLoggedIn: boolean };

export function PublicHeaderClient({ isLoggedIn }: Props) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const buyingItems = [
    { href: "/comprar/caminhoes",  label: "Caminhões",  icon: Truck, desc: "Cavalos mecânicos e caminhões" },
    { href: "/comprar/carretas",   label: "Carretas",   icon: Truck, desc: "Semirreboques e tanques" },
    { href: "/comprar/implementos", label: "Implementos", icon: Wrench, desc: "Caçambas, munks e baús" },
    { href: "/comprar/maquinas",    label: "Máquinas",   icon: Settings, desc: "Pesadas e construção" },
    { href: "/comprar/pecas",       label: "Peças",      icon: Package, desc: "Motores e componentes" },
  ];

  const partnershipItems = [
    { href: "/parcerias/parceiros", label: "Seja um Parceiro", icon: Handshake, desc: "Anuncie seu estoque" },
  ];

  const institutionalItems = [
    { href: "/institucional/sobre", label: "Sobre nós", icon: Info },
    { href: "/institucional/ajuda", label: "Como funciona", icon: HelpCircle },
    { href: "/institucional/privacidade", label: "Privacidade", icon: ShieldCheck },
    { href: "/institucional/contato", label: "Contato", icon: Mail },
  ];

  return (
    <>
      <style>{`
        .ph-root {
          position: sticky; top: 0; z-index: 100;
          height: 64px; width: 100%;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid rgba(0,0,0,0.08);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s ease;
        }
        body.public-theme-dark .ph-root {
          background: rgba(13,17,23,0.85);
          border-bottom-color: rgba(255,255,255,0.08);
        }
        .ph-container {
          width: 100%; max-width: 1400px;
          padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 32px;
        }
        .ph-logo {
          display: flex; flex-direction: column; line-height: 1;
          text-decoration: none; flex-shrink: 0;
        }
        .ph-logo-top {
          font-weight: 900; font-size: 20px; color: var(--text);
          letter-spacing: -0.04em; text-transform: uppercase; font-style: italic;
        }
        .ph-logo-sub {
          font-weight: 950; font-size: 11px; color: var(--blue);
          letter-spacing: 0.28em; text-transform: uppercase; margin-left: 2px;
        }
        .ph-search-wrap {
          flex: 1; max-width: 380px; position: relative;
        }
        .ph-search-wrap input {
          width: 100%; height: 40px; border-radius: 14px;
          border: 1px solid rgba(0,0,0,0.06);
          background: rgba(0,0,0,0.04);
          padding: 0 16px 0 40px;
          font-size: 14px; font-weight: 600;
          color: var(--text); outline: none;
          transition: all 0.2s ease;
        }
        body.public-theme-dark .ph-search-wrap input {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
        }
        .ph-search-wrap input:focus {
          background: var(--surface);
          border-color: var(--blue);
          box-shadow: 0 0 0 4px rgba(24,119,242,0.1);
        }
        .ph-search-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          color: var(--muted); pointer-events: none;
          opacity: 0.7;
        }
        .ph-nav { display: flex; align-items: center; gap: 8px; }

        .ph-nav-item { position: relative; height: 64px; display: flex; align-items: center; }

        .ph-nav-trigger {
          display: flex; align-items: center; gap: 4px;
          padding: 8px 14px; border-radius: 12px;
          text-decoration: none; font-weight: 700;
          font-size: 14px; color: var(--muted);
          white-space: nowrap; transition: all 0.2s;
          cursor: pointer; border: none; background: transparent;
        }
        .ph-nav-trigger:hover, .ph-nav-trigger.active { color: var(--text); background: rgba(0,0,0,0.04); }
        body.public-theme-dark .ph-nav-trigger:hover { background: rgba(255,255,255,0.06); }
        .ph-nav-trigger.active { color: var(--blue); background: rgba(24,119,242,0.08); }

        .ph-dropdown {
          position: absolute; top: 100%; left: 50%; transform: translateX(-50%) translateY(10px);
          width: 280px; background: #fff; border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          padding: 12px; opacity: 0; pointer-events: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 110; display: grid; gap: 4px;
        }
        body.public-theme-dark .ph-dropdown {
          background: #1a1d23; border-color: rgba(255,255,255,0.1);
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
        }
        .ph-nav-item:hover .ph-dropdown {
          opacity: 1; pointer-events: auto; transform: translateX(-50%) translateY(0);
        }

        .ph-drop-link {
          display: flex; align-items: center; gap: 14px;
          padding: 12px; border-radius: 14px;
          text-decoration: none; transition: all 0.2s;
        }
        .ph-drop-link:hover { background: rgba(0,0,0,0.03); }
        body.public-theme-dark .ph-drop-link:hover { background: rgba(255,255,255,0.04); }

        .ph-drop-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(24,119,242,0.08); color: var(--blue);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ph-drop-text { display: flex; flex-direction: column; }
        .ph-drop-label { font-weight: 800; font-size: 14px; color: var(--text); line-height: 1.2; }
        .ph-drop-desc { font-weight: 600; font-size: 11px; color: var(--muted); margin-top: 2px; }

        .ph-actions { display: flex; align-items: center; gap: 16px; }
        .ph-cta {
          height: 40px; padding: 0 20px; border-radius: 14px;
          background: var(--blue); color: #fff;
          font-size: 13px; font-weight: 800;
          text-decoration: none;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(24,119,242,0.2);
          transition: all 0.2s;
        }
        .ph-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(24,119,242,0.3); filter: brightness(1.05); }

        .ph-hamburger {
          display: none; width: 42px; height: 42px; border-radius: 12px;
          border: 0; background: rgba(0,0,0,0.04); cursor: pointer;
          align-items: center; justify-content: center; color: var(--text);
        }
        body.public-theme-dark .ph-hamburger { background: rgba(255,255,255,0.06); }

        .ph-mobile-menu {
          position: fixed; inset: 0; top: 64px; z-index: 150;
          background: var(--surface); padding: 24px;
          display: flex; flex-direction: column; gap: 12px;
          transform: translateX(100%); opacity: 0;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow-y: auto;
        }
        .ph-mobile-menu.open { transform: translateX(0); opacity: 1; }

        .ph-mobile-section { margin-bottom: 24px; }
        .ph-mobile-section-title {
          font-size: 11px; font-weight: 800; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.1em;
          margin-bottom: 12px; padding-left: 12px;
        }
        .ph-mobile-grid { display: grid; gap: 8px; }
        .ph-mobile-link {
          display: flex; align-items: center; gap: 14px;
          padding: 14px; border-radius: 16px;
          background: rgba(0,0,0,0.02); color: var(--text);
          font-weight: 700; font-size: 15px; text-decoration: none;
        }
        body.public-theme-dark .ph-mobile-link { background: rgba(255,255,255,0.03); }
        .ph-mobile-link.active { background: rgba(24,119,242,0.08); color: var(--blue); }

        @media (max-width: 1200px) {
          .ph-nav { display: none; }
          .ph-hamburger { display: flex; }
          .ph-search-wrap { max-width: 100%; }
        }
        @media (max-width: 800px) {
          .ph-search-wrap { display: none; }
        }
        @media (max-width: 500px) {
          .ph-cta { display: none; }
          .ph-container { padding: 0 16px; }
        }
      `}</style>

      <header className="ph-root">
        <div className="ph-container">
          <Link href="/" className="ph-logo">
            <span className="ph-logo-top">Caminhões</span>
            <span className="ph-logo-sub">à Venda</span>
          </Link>

          <div className="ph-search-wrap">
            <Search size={18} className="ph-search-icon" />
            <input
              type="search"
              placeholder="Buscar marca, modelo ou cidade..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.currentTarget as HTMLInputElement).value.trim();
                  if (val) window.location.href = `/comprar/caminhoes?q=${encodeURIComponent(val)}`;
                }
              }}
            />
          </div>

          <nav className="ph-nav">
            {/* COMPRAR */}
            <div className="ph-nav-item">
              <button className={`ph-nav-trigger ${pathname.startsWith("/comprar") ? "active" : ""}`}>
                Comprar <ChevronDown size={14} strokeWidth={3} />
              </button>
              <div className="ph-dropdown">
                {buyingItems.map((item) => (
                  <Link key={item.href} href={item.href} className="ph-drop-link">
                    <div className="ph-drop-icon"><item.icon size={18} strokeWidth={2.5} /></div>
                    <div className="ph-drop-text">
                      <span className="ph-drop-label">{item.label}</span>
                      <span className="ph-drop-desc">{item.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* PARCERIAS */}
            <div className="ph-nav-item">
              <button className={`ph-nav-trigger ${pathname.startsWith("/parcerias") ? "active" : ""}`}>
                Parcerias <ChevronDown size={14} strokeWidth={3} />
              </button>
              <div className="ph-dropdown" style={{ width: "240px" }}>
                {partnershipItems.map((item) => (
                  <Link key={item.href} href={item.href} className="ph-drop-link">
                    <div className="ph-drop-icon"><item.icon size={18} strokeWidth={2.5} /></div>
                    <div className="ph-drop-text">
                      <span className="ph-drop-label">{item.label}</span>
                      <span className="ph-drop-desc">{item.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* INSTITUCIONAL */}
            <div className="ph-nav-item">
              <button className={`ph-nav-trigger ${pathname.startsWith("/institucional") ? "active" : ""}`}>
                Institucional <ChevronDown size={14} strokeWidth={3} />
              </button>
              <div className="ph-dropdown" style={{ width: "220px" }}>
                {institutionalItems.map((item) => (
                  <Link key={item.href} href={item.href} className="ph-drop-link">
                    <div className="ph-drop-icon"><item.icon size={18} strokeWidth={2.5} /></div>
                    <div className="ph-drop-text">
                      <span className="ph-drop-label">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* PAINEL/ENTRAR */}
            <Link
              href={isLoggedIn ? "/painel" : "/login"}
              className={`ph-nav-trigger ${pathname.startsWith("/painel") || pathname === "/login" ? "active" : ""}`}
              style={{ marginLeft: "8px" }}
            >
              {isLoggedIn ? <LayoutDashboard size={18} /> : <LogIn size={18} />}
              <span>{isLoggedIn ? "Painel" : "Entrar"}</span>
            </Link>
          </nav>

          <div className="ph-actions">
            <ThemeTogglePublic />
            <Link href="/anunciar" className="ph-cta">Anunciar</Link>
            <button className="ph-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`ph-mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="ph-mobile-section">
          <p className="ph-mobile-section-title">Comprar</p>
          <div className="ph-mobile-grid">
            {buyingItems.map((item) => (
              <Link key={item.href} href={item.href} className="ph-mobile-link" onClick={() => setMenuOpen(false)}>
                <item.icon size={20} /> {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="ph-mobile-section">
          <p className="ph-mobile-section-title">Parcerias e Institucional</p>
          <div className="ph-mobile-grid">
            {partnershipItems.map((item) => (
              <Link key={item.href} href={item.href} className="ph-mobile-link" onClick={() => setMenuOpen(false)}>
                <item.icon size={20} /> {item.label}
              </Link>
            ))}
            {institutionalItems.map((item) => (
              <Link key={item.href} href={item.href} className="ph-mobile-link" onClick={() => setMenuOpen(false)}>
                <item.icon size={20} /> {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "auto", paddingBottom: "40px", display: "grid", gap: "12px" }}>
          <Link
            href={isLoggedIn ? "/painel" : "/login"}
            className="ph-mobile-link"
            style={{ background: "var(--blueSoft)", color: "var(--blue)" }}
            onClick={() => setMenuOpen(false)}
          >
            {isLoggedIn ? <LayoutDashboard size={20} /> : <LogIn size={20} />}
            {isLoggedIn ? "Acessar Painel" : "Entrar na conta"}
          </Link>
          <Link href="/anunciar" className="ph-cta" style={{ height: "56px", fontSize: "16px" }} onClick={() => setMenuOpen(false)}>
            Anunciar grátis agora
          </Link>
        </div>
      </div>
    </>
  );
}
