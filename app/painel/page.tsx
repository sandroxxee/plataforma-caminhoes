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
          <strong>Meus anúncios</strong>
          <p>Veja anúncios cadastrados, edite dados e acompanhe status.</p>
        </Link>

        <Link href="/painel/anuncios/novo" style={styles.card}>
          <span style={styles.icon}>➕</span>
          <strong>Novo anúncio</strong>
          <p>Cadastre um caminhão com fotos para aprovação.</p>
        </Link>

        {isAdmin && (
          <Link href="/admin/pendentes" style={styles.cardAdmin}>
            <span style={styles.icon}>⚙️</span>
            <strong>Admin pendentes</strong>
            <p>Aprovar, reprovar, editar e excluir anúncios pendentes.</p>
          </Link>
        )}

        {isAdmin && (
          <Link href="/admin/anuncios" style={styles.cardAdmin}>
            <span style={styles.icon}>📋</span>
            <strong>Todos os anúncios</strong>
            <p>Controle geral de todos os anúncios da plataforma.</p>
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
    background: "#22c55e",
    color: "#052e16",
    textDecoration: "none",
    fontWeight: 900,
  },
  adminButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 16px",
    borderRadius: 14,
    background: "#eab308",
    color: "#422006",
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
    borderRadius: 24,
    background: "rgba(15,23,42,.72)",
    border: "1px solid rgba(255,255,255,.10)",
    color: "white",
    textDecoration: "none",
  },
  cardAdmin: {
    padding: 24,
    borderRadius: 24,
    background: "rgba(234,179,8,.10)",
    border: "1px solid rgba(234,179,8,.25)",
    color: "white",
    textDecoration: "none",
  },
  icon: {
    display: "block",
    fontSize: 34,
    marginBottom: 12,
  },
};
