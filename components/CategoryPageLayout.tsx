import React from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

type CategoryPageLayoutProps = {
  title: string;
  subtitle?: string;
  heroImage?: string;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  total?: number;
};

export function CategoryPageLayout({
  title,
  subtitle,
  heroImage = "/hero-home.jpg",
  sidebar,
  children,
  total,
}: CategoryPageLayoutProps) {
  return (
    <main style={{ minHeight: "100vh", background: "var(--soft)", display: "flex", flexDirection: "column" }}>
      <PublicHeader />

      {/* Hero Section */}
      <section style={{ position: "relative", width: "100%", height: "clamp(220px, 30vw, 400px)", background: "#0f172a", overflow: "hidden" }}>
        <img
          src={heroImage}
          alt={title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 60%, transparent 100%)" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: "1400px", margin: "0 auto", padding: "0 24px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: "clamp(20px, 3vw, 48px)" }}>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 52px)", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.03em", lineHeight: 1.15 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(14px, 1.5vw, 18px)", fontWeight: 700, marginTop: 8, maxWidth: "56ch" }}>
              {subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="mp-shell-wrap" style={{ flex: 1 }}>
        <div className="category-layout">

          {/* Sidebar */}
          {sidebar && (
            <aside className="category-sidebar">
              {sidebar}
            </aside>
          )}

          {/* Conteúdo principal */}
          <section className="category-content">
            {total !== undefined && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, background: "var(--surface)", padding: "12px 18px", borderRadius: 14, border: "1px solid var(--line)", boxShadow: "var(--shadow)" }}>
                <p style={{ margin: 0, color: "var(--muted)", fontWeight: 800, fontSize: 13 }}>
                  Mostrando <span style={{ color: "var(--text)" }}>{total}</span> {total === 1 ? "anúncio" : "anúncios"}
                </p>
              </div>
            )}
            {children}
          </section>

        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
