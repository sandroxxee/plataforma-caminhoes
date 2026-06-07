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

  return (
    <PanelLayout
      title="Central do anunciante"
      subtitle="Gerencie seus anúncios e cadastre novos veículos com segurança."
      badge="Anunciante"
    >
      <section style={styles.grid}>
        <Link href="/painel/anuncios" style={styles.card}>
          <span style={styles.icon}>🚛</span>
          <strong style={styles.cardTitle}>Meus anúncios</strong>
          <p style={styles.cardText}>Acompanhe seus anúncios, status de aprovação e publicação.</p>
          <span style={styles.cardButton}>Ver meus anúncios</span>
        </Link>

        <Link href="/painel/anuncios/novo/caminhao" style={styles.card}>
          <span style={styles.icon}>➕</span>
          <strong style={styles.cardTitle}>Anunciar caminhão</strong>
          <p style={styles.cardText}>Cadastre um caminhão com dados, fotos, localização e contato.</p>
          <span style={styles.cardButton}>Cadastrar caminhão</span>
        </Link>

        <Link href="/painel/anuncios/novo/implemento" style={styles.card}>
          <span style={styles.icon}>🛞</span>
          <strong style={styles.cardTitle}>Anunciar implemento</strong>
          <p style={styles.cardText}>Cadastre carreta, caçamba, prancha, baú, tanque ou outro implemento.</p>
          <span style={styles.cardButton}>Cadastrar implemento</span>
        </Link>
      </section>
    </PanelLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
    gap: 18,
  },
  card: {
    minHeight: 230,
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
    gap: 18,
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
    fontSize: 26,
    lineHeight: 1.05,
    letterSpacing: "-.04em",
  },
  cardText: {
    margin: 0,
    color: "#aeb8c2",
    lineHeight: 1.5,
    fontWeight: 750,
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
};
