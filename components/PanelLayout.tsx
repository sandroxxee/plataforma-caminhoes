import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PanelLayout({ title, subtitle, badge, actions, children }: Props) {
  return (
    <main style={styles.page}>
      <aside style={styles.sidebar}>
        <Link href="/painel" style={styles.brand}>
          <span style={styles.brandIcon}>🚛</span>
          <span>
            <strong>Plataforma Truck</strong>
            <small>Painel do anunciante</small>
          </span>
        </Link>

        <nav style={styles.menu}>
          <Link href="/painel" style={styles.menuItem}>Painel</Link>
          <Link href="/painel/anuncios" style={styles.menuItem}>Meus anúncios</Link>
          <Link href="/painel/anuncios/novo" style={styles.menuItem}>Novo anúncio</Link>
        </nav>

        <div style={styles.bottom}>
          <Link href="/anuncios" style={styles.publicButton}>Ver site público</Link>
          <Link href="/logout" style={styles.logoutButton}>Sair</Link>
        </div>
      </aside>

      <section style={styles.content}>
        <header style={styles.header}>
          <div>
            {badge && <span style={styles.badge}>{badge}</span>}
            <h1 style={styles.title}>{title}</h1>
            {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </header>

        {children}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    background: "linear-gradient(135deg,#020617 0%,#071f1b 60%,#020617 100%)",
    color: "white",
  },
  sidebar: {
    padding: 24,
    borderRight: "1px solid rgba(255,255,255,.10)",
    background: "rgba(2,6,23,.72)",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  brand: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    background: "rgba(34,197,94,.10)",
    border: "1px solid rgba(34,197,94,.20)",
    color: "white",
    textDecoration: "none",
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: "#22c55e",
  },
  menu: {
    display: "grid",
    gap: 12,
  },
  menuItem: {
    padding: "13px 14px",
    borderRadius: 14,
    color: "white",
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,255,255,.10)",
    textDecoration: "none",
    fontWeight: 800,
  },
  bottom: {
    marginTop: "auto",
    display: "grid",
    gap: 12,
  },
  publicButton: {
    padding: "13px 14px",
    borderRadius: 14,
    color: "white",
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.12)",
    textDecoration: "none",
    textAlign: "center",
    fontWeight: 900,
  },
  logoutButton: {
    padding: "13px 14px",
    borderRadius: 14,
    color: "#fecaca",
    background: "rgba(239,68,68,.10)",
    border: "1px solid rgba(239,68,68,.25)",
    textDecoration: "none",
    textAlign: "center",
    fontWeight: 900,
  },
  content: {
    padding: "34px 46px",
  },
  header: {
    minHeight: 120,
    padding: 28,
    borderRadius: 26,
    background: "rgba(15,23,42,.72)",
    border: "1px solid rgba(255,255,255,.10)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 24,
  },
  badge: {
    display: "inline-flex",
    padding: "7px 12px",
    borderRadius: 999,
    background: "rgba(34,197,94,.12)",
    color: "#86efac",
    border: "1px solid rgba(34,197,94,.22)",
    fontWeight: 900,
    fontSize: 12,
    textTransform: "uppercase",
  },
  title: {
    margin: "12px 0 6px",
    fontSize: 34,
    lineHeight: 1.05,
  },
  subtitle: {
    margin: 0,
    color: "#cbd5e1",
    lineHeight: 1.5,
  },
};
