import Link from "next/link";
import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";

export const dynamic = "force-dynamic";

export default async function PainelPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, email, role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  return (
    <PanelLayout
      title="Central do anunciante"
      subtitle="Gerencie seus anúncios e cadastre novos veículos com segurança."
      badge="Anunciante"
      actions={
        <div style={styles.actions}>
          {isAdmin && (
            <Link href="/admin/pendentes" style={styles.adminButton}>
              Ir para admin
            </Link>
          )}
          <Link href="/painel/anuncios/novo" style={styles.primaryButton}>
            Anunciar
          </Link>
        </div>
      }
    >
      <section style={styles.grid}>
        <Link href="/painel/anuncios" style={styles.card}>
          <span style={styles.icon}>🚛</span>
          <strong style={styles.cardTitle}>Meus anúncios</strong>
          <p style={styles.cardText}>
            Acompanhe anúncios cadastrados, status de aprovação, edição e publicação.
          </p>
          <span style={styles.cardButton}>Ver meus anúncios</span>
        </Link>

        <div style={styles.card}>
          <span style={styles.icon}>➕</span>
          <strong style={styles.cardTitle}>Anunciar</strong>
          <p style={styles.cardText}>Cadastre um caminhão ou implemento para análise da plataforma.</p>
          <div style={styles.buttonRow}>
            <Link href="/painel/anuncios/novo/caminhao" style={styles.cardButton}>
              Anunciar caminhão
            </Link>
            <Link href="/painel/anuncios/novo/implemento" style={styles.secondaryButton}>
              Anunciar implemento
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.soonBox}>
        <div>
          <span style={styles.soonBadge}>Em breve no painel</span>
          <h2 style={styles.soonTitle}>Novas ferramentas para o anunciante</h2>
          <p style={styles.soonText}>
            Próximos recursos planejados para aumentar controle e organização, sem criar função falsa agora.
          </p>
        </div>
        <div style={styles.soonGrid}>
          <span style={styles.soonItem}>Estatísticas dos anúncios</span>
          <span style={styles.soonItem}>Leads recebidos</span>
          <span style={styles.soonItem}>Planos e destaque</span>
          <span style={styles.soonItem}>Perfil da loja/revenda</span>
          <span style={styles.soonItem}>Página exclusiva da revenda</span>
        </div>
      </section>
    </PanelLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  actions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    flexWrap: "wrap",
  },
  primaryButton: {
    minHeight: 44,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 16px",
    borderRadius: 14,
    background: "#22c55e",
    color: "#06140b",
    textDecoration: "none",
    fontWeight: 950,
  },
  adminButton: {
    minHeight: 44,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 16px",
    borderRadius: 14,
    background: "#242a30",
    border: "1px solid #343a40",
    color: "#e8eaed",
    textDecoration: "none",
    fontWeight: 900,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 18,
  },
  card: {
    minHeight: 250,
    padding: 26,
    borderRadius: 26,
    background: "#1f2327",
    border: "1px solid #343a40",
    color: "#e8eaed",
    textDecoration: "none",
    boxShadow: "0 18px 42px rgba(0,0,0,.22)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 20,
  },
  icon: {
    width: 54,
    height: 54,
    display: "grid",
    placeItems: "center",
    borderRadius: 18,
    background: "rgba(34,197,94,.14)",
    border: "1px solid rgba(34,197,94,.28)",
    fontSize: 27,
  },
  cardTitle: {
    display: "block",
    color: "#f8fafc",
    fontSize: 28,
    lineHeight: 1.05,
    letterSpacing: "-.04em",
  },
  cardText: {
    margin: 0,
    color: "#aeb8c2",
    lineHeight: 1.55,
    fontWeight: 750,
  },
  buttonRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  cardButton: {
    minHeight: 46,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 16px",
    borderRadius: 15,
    background: "#22c55e",
    color: "#06140b",
    textDecoration: "none",
    fontWeight: 950,
  },
  secondaryButton: {
    minHeight: 46,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 16px",
    borderRadius: 15,
    background: "rgba(34,197,94,.10)",
    border: "1px solid rgba(34,197,94,.35)",
    color: "#d9fbe5",
    textDecoration: "none",
    fontWeight: 950,
  },
  soonBox: {
    marginTop: 18,
    padding: 22,
    borderRadius: 24,
    background: "#15181b",
    border: "1px solid #343a40",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 18,
    color: "#e8eaed",
  },
  soonBadge: {
    display: "inline-flex",
    marginBottom: 10,
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(34,197,94,.12)",
    color: "#86efac",
    fontSize: 12,
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: ".08em",
  },
  soonTitle: {
    margin: "0 0 8px",
    color: "#f8fafc",
    fontSize: 22,
  },
  soonText: {
    margin: 0,
    color: "#9aa4ae",
    lineHeight: 1.55,
    fontWeight: 750,
  },
  soonGrid: {
    display: "grid",
    gap: 10,
  },
  soonItem: {
    padding: "12px 14px",
    borderRadius: 16,
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(255,255,255,.06)",
    color: "#cbd5df",
    fontWeight: 850,
  },
};
