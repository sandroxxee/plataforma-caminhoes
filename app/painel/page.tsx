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

  // Busca contagem de anúncios por status
  const { data: anuncios } = await supabase
    .from("anuncios")
    .select("status")
    .eq("user_id", user.id);

  const total = anuncios?.length ?? 0;
  const ativos = anuncios?.filter((a) => a.status === "publicado").length ?? 0;
  const pendentes = anuncios?.filter((a) => a.status === "pendente").length ?? 0;
  const rejeitados = anuncios?.filter((a) => a.status === "rejeitado").length ?? 0;

  const nomeUsuario = user.user_metadata?.name || user.email?.split("@")[0] || "Anunciante";

  return (
    <PanelLayout
      title="Central do anunciante"
      subtitle="Gerencie seus anúncios e cadastre novos veículos com segurança."
      badge="Anunciante"
    >
      {/* Saudação */}
      <p style={styles.greeting}>
        Olá, <strong>{nomeUsuario}</strong> 👋
      </p>

      {/* Cards de estatísticas */}
      <section style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{total}</span>
          <span style={styles.statLabel}>Total de anúncios</span>
        </div>
        <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
          <span style={styles.statNumber}>{ativos}</span>
          <span style={styles.statLabel}>✅ Publicados</span>
        </div>
        <div style={{ ...styles.statCard, ...styles.statCardYellow }}>
          <span style={styles.statNumber}>{pendentes}</span>
          <span style={styles.statLabel}>⏳ Aguardando aprovação</span>
        </div>
        <div style={{ ...styles.statCard, ...styles.statCardRed }}>
          <span style={styles.statNumber}>{rejeitados}</span>
          <span style={styles.statLabel}>❌ Rejeitados</span>
        </div>
      </section>

      {/* Ações principais */}
      <h2 style={styles.sectionTitle}>O que deseja fazer?</h2>
      <section style={styles.actionsGrid}>
        <Link href="/painel/anuncios" style={styles.card}>
          <span style={styles.icon}>🚛</span>
          <strong style={styles.cardTitle}>Meus anúncios</strong>
          <p style={styles.cardText}>
            Acompanhe seus anúncios, status de aprovação e publicação.
          </p>
          <span style={styles.cardButton}>Ver meus anúncios</span>
        </Link>

        <Link href="/painel/anuncios/novo/caminhao" style={styles.card}>
          <span style={styles.icon}>➕</span>
          <strong style={styles.cardTitle}>Anunciar caminhão</strong>
          <p style={styles.cardText}>
            Cadastre um caminhão com dados, fotos, localização e contato.
          </p>
          <span style={styles.cardButton}>Cadastrar caminhão</span>
        </Link>

        <Link href="/painel/anuncios/novo/implemento" style={styles.card}>
          <span style={styles.icon}>🛞</span>
          <strong style={styles.cardTitle}>Anunciar implemento</strong>
          <p style={styles.cardText}>
            Cadastre carreta, caçamba, prancha, baú, tanque ou outro implemento.
          </p>
          <span style={styles.cardButton}>Cadastrar implemento</span>
        </Link>
      </section>

      {/* Dica rápida */}
      {pendentes > 0 && (
        <div style={styles.tipBox}>
          <span style={styles.tipIcon}>💡</span>
          <p style={styles.tipText}>
            Você tem <strong>{pendentes} anúncio{pendentes > 1 ? "s" : ""}</strong> aguardando aprovação. Assim que for aprovado, aparecerá publicamente no site.
          </p>
        </div>
      )}

      {total === 0 && (
        <div style={styles.tipBox}>
          <span style={styles.tipIcon}>🚀</span>
          <p style={styles.tipText}>
            Você ainda não tem anúncios. Cadastre seu primeiro caminhão ou implemento agora!
          </p>
        </div>
      )}
    </PanelLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  greeting: {
    fontSize: 18,
    color: "#aeb8c2",
    marginBottom: 20,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 14,
    marginBottom: 36,
  },
  statCard: {
    padding: "20px 18px",
    borderRadius: 18,
    background: "#1f2327",
    border: "1px solid #343a40",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  statCardGreen: {
    border: "1px solid rgba(34,197,94,.3)",
    background: "rgba(34,197,94,.07)",
  },
  statCardYellow: {
    border: "1px solid rgba(234,179,8,.3)",
    background: "rgba(234,179,8,.07)",
  },
  statCardRed: {
    border: "1px solid rgba(239,68,68,.3)",
    background: "rgba(239,68,68,.07)",
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 900,
    color: "#f8fafc",
    lineHeight: 1,
    letterSpacing: "-0.03em",
  },
  statLabel: {
    fontSize: 13,
    color: "#aeb8c2",
    fontWeight: 600,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#aeb8c2",
    fontWeight: 700,
    marginBottom: 14,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 18,
    marginBottom: 28,
  },
  card: {
    minHeight: 210,
    padding: 24,
    borderRadius: 26,
    background: "#1f2327",
    border: "1px solid #343a40",
    color: "#e8eaed",
    textDecoration: "none",
    boxShadow: "0 18px 42px rgba(0,0,0,.22)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 14,
    transition: "border-color 0.2s, box-shadow 0.2s",
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
    fontSize: 22,
    lineHeight: 1.1,
    letterSpacing: "-.04em",
  },
  cardText: {
    margin: 0,
    color: "#aeb8c2",
    lineHeight: 1.5,
    fontSize: 14,
    fontWeight: 500,
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
    fontSize: 14,
  },
  tipBox: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "16px 20px",
    borderRadius: 16,
    background: "rgba(34,197,94,.08)",
    border: "1px solid rgba(34,197,94,.22)",
    marginTop: 8,
  },
  tipIcon: {
    fontSize: 22,
    flexShrink: 0,
    marginTop: 2,
  },
  tipText: {
    margin: 0,
    color: "#aeb8c2",
    fontSize: 14,
    lineHeight: 1.6,
  },
};
