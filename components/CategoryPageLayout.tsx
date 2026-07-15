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

      {/* Main Content */}
      <div className="mp-shell-wrap" style={{ flex: 1, paddingTop: 24 }}>
        <div className="category-layout">

          {/* Sidebar */}
          {sidebar && (
            <aside className="category-sidebar">
              {sidebar}
            </aside>
          )}

          {/* Conteúdo principal */}
          <section className="category-content">
            {children}
          </section>

        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
