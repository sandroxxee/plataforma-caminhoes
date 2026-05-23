import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";

export const dynamic = "force-dynamic";

function formatPrice(value: number | null) {
  if (!value) return "Preço sob consulta";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

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
    .select("nome")
    .eq("id", user.id)
    .single();

  const { data: anuncios } = await supabase
    .from("trucks")
    .select("id, titulo, preco, status, cidade, estado, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const total = anuncios?.length || 0;
  const aprovados = anuncios?.filter((item) => item.status === "aprovado").length || 0;
  const pendentes = anuncios?.filter((item) => item.status === "pendente").length || 0;
  const reprovados = anuncios?.filter((item) => item.status === "reprovado").length || 0;

  return (
    <PanelLayout
      title={`Olá, ${profile?.nome || user.email}`}
      subtitle="Gerencie seus anúncios, acompanhe aprovações e cadastre caminhões com organização."
      actions={<Link href="/painel/anuncios/novo" style={styles.primaryButton}>Novo anúncio</Link>}
    >
      <section style={styles.statsGrid}>
        <div style={styles.statCard}><span>Total</span><strong>{total}</strong></div>
        <div style={styles.statCard}><span>Aprovados</span><strong>{aprovados}</strong></div>
        <div style={styles.statCard}><span>Pendentes</span><strong>{pendentes}</strong></div>
        <div style={styles.statCard}><span>Reprovados</span><strong>{reprovados}</strong></div>
      </section>

      <section style={styles.card}>
        <div style={styles.cardHeader}>
          <div>
            <h2 style={styles.cardTitle}>Últimos anúncios</h2>
            <p style={styles.muted}>Resumo dos caminhões cadastrados na sua conta.</p>
          </div>
          <Link href="/painel/anuncios" style={styles.secondaryButton}>Ver todos</Link>
        </div>

        {anuncios && anuncios.length > 0 ? (
          <div style={styles.list}>
            {anuncios.slice(0, 5).map((anuncio) => (
              <div style={styles.row} key={anuncio.id}>
                <div>
                  <strong>{anuncio.titulo}</strong>
                  <p style={styles.muted}>{anuncio.cidade}/{anuncio.estado}</p>
                </div>
                <span style={styles.status}>{anuncio.status}</span>
                <strong>{formatPrice(anuncio.preco)}</strong>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.empty}>
            <h3>Nenhum anúncio cadastrado ainda</h3>
            <p style={styles.muted}>Cadastre seu primeiro caminhão para enviar para aprovação.</p>
            <Link href="/painel/anuncios/novo" style={styles.primaryButton}>Cadastrar caminhão</Link>
          </div>
        )}
      </section>
    </PanelLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
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
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "11px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.15)",
    background: "rgba(255,255,255,.06)",
    color: "white",
    textDecoration: "none",
    fontWeight: 800,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16,
    marginBottom: 22,
  },
  statCard: {
    padding: 22,
    borderRadius: 22,
    background: "rgba(255,255,255,.07)",
    border: "1px solid rgba(255,255,255,.10)",
    boxShadow: "0 18px 50px rgba(0,0,0,.22)",
  },
  card: {
    padding: 24,
    borderRadius: 24,
    background: "rgba(255,255,255,.07)",
    border: "1px solid rgba(255,255,255,.10)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  cardTitle: { margin: 0, fontSize: 24 },
  muted: { color: "#a7b5c7", margin: "4px 0 0", lineHeight: 1.55 },
  list: { display: "grid", gap: 10 },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: 14,
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    background: "rgba(255,255,255,.055)",
    border: "1px solid rgba(255,255,255,.08)",
  },
  status: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(245,158,11,.14)",
    border: "1px solid rgba(245,158,11,.26)",
    color: "#fcd34d",
    fontWeight: 800,
  },
  empty: { padding: 10 },
};
