"use client";

import React, { useState } from "react";
import { Filter, X } from "lucide-react";

type MobileFilterDrawerProps = {
  sidebar: React.ReactNode;
};

export function MobileFilterDrawer({ sidebar }: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="mobile-filter-fab" onClick={() => setIsOpen(true)} aria-label="Filtrar anúncios">
        <Filter size={18} strokeWidth={2.5} />
        <span>Filtrar</span>
      </button>

      <div className={`mobile-filter-drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-overlay" onClick={() => setIsOpen(false)} />
        <div className="drawer-content">
          <div className="drawer-header">
            <span className="drawer-title">Filtros</span>
            <button className="drawer-close" onClick={() => setIsOpen(false)} aria-label="Fechar filtros">
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>
          <div className="drawer-body">
            {sidebar}
          </div>
        </div>
      </div>

      <style>{`
        /* FAB Redondo de Filtros */
        .mobile-filter-fab {
          display: none;
          position: fixed;
          bottom: 82px; /* Acima do menu inferior mobile */
          right: 20px;
          z-index: 100;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 999px;
          height: 48px;
          padding: 0 20px;
          font-weight: 800;
          font-size: 14px;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 24px rgba(37,99,235,0.4);
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }
        .mobile-filter-fab:active {
          transform: scale(0.95);
        }

        /* Drawer lateral dos filtros */
        .mobile-filter-drawer {
          position: fixed;
          inset: 0;
          z-index: 300;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .mobile-filter-drawer.open {
          opacity: 1;
          pointer-events: auto;
        }
        .drawer-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15,23,42,0.6);
          backdrop-filter: blur(4px);
        }
        .drawer-content {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: var(--surface, #fff);
          border-radius: 24px 24px 0 0;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 -10px 40px rgba(0,0,0,0.15);
        }
        body.public-theme-dark .drawer-content {
          background: #0f172a;
        }
        .mobile-filter-drawer.open .drawer-content {
          transform: translateY(0);
        }
        .drawer-header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        body.public-theme-dark .drawer-header {
          border-bottom-color: rgba(255,255,255,0.08);
        }
        .drawer-title {
          font-size: 16px;
          font-weight: 800;
          color: var(--text);
        }
        .drawer-close {
          background: rgba(0,0,0,0.04);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text);
          cursor: pointer;
        }
        body.public-theme-dark .drawer-close {
          background: rgba(255,255,255,0.06);
        }
        .drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px 24px;
        }

        /* Ocultar barra lateral antiga no mobile e mostrar botão */
        @media (max-width: 768px) {
          .mobile-filter-fab {
            display: flex;
          }
          /* Ajustar a sidebar interna no drawer */
          .drawer-body .asb {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            border-radius: 0 !important;
          }
          .drawer-body .asb-header {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
