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
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative w-full h-[320px] md:h-[460px] bg-slate-900 overflow-hidden">
        <img
          src={heroImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[10s] hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12 md:pb-16 max-w-7xl">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-200 text-lg md:text-xl font-bold mt-4 max-w-2xl text-shadow">
              {subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          {sidebar && (
            <aside className="lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24 self-start">
                {sidebar}
              </div>
            </aside>
          )}

          {/* Grid/Content Area */}
          <section className="flex-1">
            {total !== undefined && (
              <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                 <p className="text-slate-500 font-bold text-sm">
                   Mostrando <span className="text-slate-900">{total}</span> {total === 1 ? 'anúncio' : 'anúncios'}
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
