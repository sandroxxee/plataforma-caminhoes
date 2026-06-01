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
      title={isAdmin ? "Painel do administrador" : "Painel do anunciante"}
      subtitle={
        isAdmin
          ? "Você está logado como admin. Use a área administrativa para aprovar, editar e excluir anúncios."
          : "Gerencie seus anúncios e acompanhe o status de aprovação."
      }
      badge={isAdmin ? "Admin" : "Anunciante"}
      actions={
        isAdmin ? (
          <Link href="/admin/pendentes" style={styles.adminButton}>
            Ir para admin
          </Link>
        ) : (
          <Link href="/painel/anuncios/novo" style={styles.primaryButton}>
            Novo anúncio
          </Link>
        )
      }
    >
      <section style={styles.grid}>
        <Link href="/painel/anuncios" style={styles.card}>
          <span style={styles.icon}>🚛</span>
          <strong style={styles.cardTitle}>Meus anúncios</strong>
          <p style={styles.cardText}>Veja anúncios cadastrados, edite dados e acompanhe status.</p>
        </Link>

        <Link href="/painel/anuncios/novo" style={styles.card}>
          <span style={styles.icon}>➕</span>
          <strong style={styles.cardTitle}>Novo anúncio</strong>
          <p style={styles.cardText}>Cadastre um caminhão com fotos para aprovação.</p>
        </Link>

        {isAdmin && (
          <Link href="/admin/pendentes" style={styles.cardAdmin}>
            <span style={styles.icon}>⚙️</span>
            <strong style={styles.cardTitle}>Admin pendentes</strong>
            <p style={styles.cardText}>Aprovar, reprovar, editar e excluir anúncios pendentes.</p>
          </Link>
        )}

        {isAdmin && (
          <Link href="/admin/anuncios" style={styles.cardAdmin}>
            <span style={styles.icon}>📋</span>
            <strong style={styles.cardTitle}>Todos os anúncios</strong>
            <p style={styles.cardText}>Controle geral de todos os anúncios da plataforma.</p>
          </Link>
        )}
      </section>
    </PanelLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 16px",
    borderRadius: 14,
    background: "#1f64b5",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 900,
  },
  adminButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 16px",
    borderRadius: 14,
    background: "#1f64b5",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 900,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    gap: 18,
  },
  card: {
    padding: 24,
    borderRadius: 22,
    background: "#ffffff",
    border: "1px solid #d8dee9",
    color: "#111827",
    textDecoration: "none",
    boxShadow: "0 8px 22px rgba(15, 23, 42, .05)",
  },
  cardAdmin: {
    padding: 24,
    borderRadius: 22,
    background: "#ffffff",
    border: "1px solid #b8d4ff",
    color: "#111827",
    textDecoration: "none",
    boxShadow: "0 8px 22px rgba(15, 23, 42, .05)",
  },
  icon: {
    width: 48,
    height: 48,
    display: "grid",
    placeItems: "center",
    fontSize: 26,
    marginBottom: 14,
    borderRadius: 16,
    background: "#eaf2ff",
  },
  cardTitle: {
    display: "block",
    fontSize: 19,
    color: "#111827",
    marginBottom: 8,
  },
  cardText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.55,
    fontWeight: 700,
  },
};
