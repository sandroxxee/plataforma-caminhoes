import { redirect } from "next/navigation";
import Link from "next/link";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { aprovarAnuncio, reprovarAnuncio, excluirAnuncioAdmin } from "../actions";

export const dynamic = "force-dynamic";

type TruckImage = { image_url: string | null; principal: boolean | null; ordem: number | null };
type Truck = {
  id: string;
  titulo: string | null;
  status: string | null;
  preco: number | null;
  cidade: string | null;
  estado: string | null;
  marca: string | null;
  modelo: string | null;
  truck_images?: TruckImage[];
};

function getMainImage(truck: Truck) {
  const images = truck.truck_images || [];
  const principal = images.find((img) => img.principal);
  const first = [...images].sort((a, b) => (a.ordem || 0) - (b.ordem || 0))[0];
  return principal?.image_url || first?.image_url || "";
}

function money(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

function statusLabel(status: string | null) {
  if (status === "aprovado") return "Aprovado";
  if (status === "reprovado") return "Reprovado";
  if (status === "pendente") return "Pendente";
  return status || "Sem status";
}

export default async function AdminAnunciosPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");

  const { data } = await supabase
    .from("trucks")
    .select(`
      id, titulo, status, preco, cidade, estado, marca, modelo,
      truck_images ( image_url, principal, ordem )
    `)
    .order("created_at", { ascending: false });

  const trucks = (data || []) as Truck[];

  return (
    <AdminLayout
      title="Todos os anúncios"
      subtitle="Controle os anúncios cadastrados, revise status e prepare divulgação dos aprovados."
      badge="Admin"
      actions={<Link href="/painel/anuncios/novo" style={styles.topButton}>Criar anúncio</Link>}
    >
      <div style={styles.list}>
        {trucks.map((truck) => {
          const image = getMainImage(truck);
          return (
            <article key={truck.id} style={styles.row}>
              <div style={styles.thumb}>
                {image ? <img src={image} alt={truck.titulo || "Caminhão"} style={styles.image} /> : <span>Sem foto</span>}
              </div>

              <div style={styles.info}>
                <strong style={styles.title}>{truck.titulo}</strong>
                <p style={styles.meta}>{truck.marca} {truck.modelo} • {truck.cidade}/{truck.estado} • {money(truck.preco)}</p>
              </div>

              <span style={truck.status === "aprovado" ? styles.statusApproved : truck.status === "reprovado" ? styles.statusRejected : styles.statusPending}>
                {statusLabel(truck.status)}
              </span>

              <div style={styles.actions}>
                {truck.status === "aprovado" && (
                  <Link href={`/admin/divulgacao/${truck.id}`} style={styles.share}>Divulgar</Link>
                )}

                <Link href={`/admin/ia-anuncios/${truck.id}`} style={styles.aiPackage}>Central IA</Link>

                <Link href={`/admin/laudo/${truck.id}`} style={styles.laudo}>Laudo</Link>

                {truck.status !== "aprovado" && (
                  <form action={aprovarAnuncio} style={styles.formButton}>
                    <input type="hidden" name="id" value={truck.id} />
                    <button style={styles.approve}>Aprovar</button>
                  </form>
                )}

                {truck.status !== "reprovado" && (
                  <form action={reprovarAnuncio} style={styles.formButton}>
                    <input type="hidden" name="id" value={truck.id} />
                    <button style={styles.reject}>Reprovar</button>
                  </form>
                )}

                <Link href={`/painel/anuncios/${truck.id}/editar`} style={styles.edit}>Editar</Link>

                <form action={excluirAnuncioAdmin} style={styles.formButton}>
                  <input type="hidden" name="id" value={truck.id} />
                  <ConfirmDeleteButton message={`Confirma remover o anúncio ${truck.titulo || "selecionado"}?`} />
                </form>
              </div>
            </article>
          );
        })}

        {trucks.length === 0 && <div style={styles.empty}>Nenhum anúncio cadastrado.</div>}
      </div>
    </AdminLayout>
  );
}

const buttonBase: CSSProperties = {
  border: 0,
  padding: "10px 16px",
  borderRadius: 12,
  fontWeight: 800,
  fontFamily: "inherit",
  cursor: "pointer",
  textDecoration: "none",
  lineHeight: 1,
  fontSize: 13,
  transition: "all 0.2s",
};

const statusBase: CSSProperties = {
  padding: "6px 12px",
  borderRadius: 999,
  textAlign: "center",
  fontWeight: 800,
  fontSize: 11,
  whiteSpace: "nowrap",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const styles: Record<string, CSSProperties> = {
  topButton: { padding: "12px 20px", borderRadius: 14, background: "#1877f2", color: "#ffffff", textDecoration: "none", fontWeight: 800, fontSize: 14, boxShadow: "0 4px 12px rgba(24,119,242,0.2)" },
  list: { display: "grid", gap: 12 },
  row: { display: "grid", gridTemplateColumns: "104px minmax(260px, 1fr) 112px auto", gap: 16, alignItems: "center", padding: 16, borderRadius: 20, background: "#ffffff", border: "1px solid rgba(148,163,184,0.12)", boxShadow: "0 4px 12px rgba(15,23,42,0.03)" },
  thumb: { width: 104, height: 78, borderRadius: 12, overflow: "hidden", background: "#f8fafc", display: "grid", placeItems: "center", color: "#94a3b8", fontSize: 11, fontWeight: 800 },
  image: { width: "100%", height: "100%", objectFit: "contain", display: "block" },
  info: { minWidth: 0 },
  title: { display: "block", fontSize: 16, fontWeight: 800, color: "#0f172a", lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  meta: { margin: "4px 0 0", color: "#64748b", fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  statusApproved: { ...statusBase, background: "#dcfce7", color: "#166534" },
  statusRejected: { ...statusBase, background: "#fee2e2", color: "#991b1b" },
  statusPending: { ...statusBase, background: "#fef3c7", color: "#92400e" },
  actions: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center" },
  formButton: { margin: 0 },
  approve: { ...buttonBase, background: "#1877f2", color: "#ffffff" },
  reject: { ...buttonBase, background: "#fee2e2", color: "#ef4444" },
  edit: { ...buttonBase, background: "#f1f5f9", color: "#475569", border: "1px solid rgba(148,163,184,0.1)" },
  share: { ...buttonBase, background: "#22c55e", color: "#ffffff" },
  aiPackage: { ...buttonBase, background: "#f59e0b", color: "#ffffff" },
  laudo: { ...buttonBase, background: "#7c3aed", color: "#ffffff" },
  empty: { padding: 32, borderRadius: 20, background: "#ffffff", border: "1px solid rgba(148,163,184,0.12)", color: "#64748b", fontWeight: 700, textAlign: "center" },
};
