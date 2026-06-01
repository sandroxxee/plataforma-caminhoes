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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role !== "admin") redirect("/painel");

  const { data } = await supabase
    .from("trucks")
    .select(`
      id,
      titulo,
      status,
      preco,
      cidade,
      estado,
      marca,
      modelo,
      truck_images (
        image_url,
        principal,
        ordem
      )
    `)
    .order("created_at", { ascending: false });

  const trucks = (data || []) as Truck[];

  return (
    <AdminLayout
      title="Todos os anúncios"
      subtitle="Controle os anúncios cadastrados, revise status e ajuste informações quando necessário."
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
  padding: "10px 13px",
  borderRadius: 12,
  fontWeight: 900,
  fontFamily: "inherit",
  cursor: "pointer",
  textDecoration: "none",
  lineHeight: 1,
};

const statusBase: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 999,
  textAlign: "center",
  fontWeight: 900,
  fontSize: 13,
  whiteSpace: "nowrap",
};

const styles: Record<string, CSSProperties> = {
  topButton: {
    padding: "12px 16px",
    borderRadius: 14,
    background: "#1f64b5",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 900,
  },
  list: {
    display: "grid",
    gap: 12,
  },
  row: {
    display: "grid",
    gridTemplateColumns: "104px minmax(260px, 1fr) 112px auto",
    gap: 16,
    alignItems: "center",
    padding: 14,
    borderRadius: 18,
    background: "#ffffff",
    border: "1px solid #d8dee9",
    boxShadow: "0 8px 22px rgba(15, 23, 42, .05)",
  },
  thumb: {
    width: 104,
    height: 78,
    borderRadius: 14,
    overflow: "hidden",
    background: "#e8eef7",
    display: "grid",
    placeItems: "center",
    color: "#64748b",
    fontSize: 12,
    fontWeight: 900,
  },
  image: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  info: { minWidth: 0 },
  title: { display: "block", fontSize: 17, color: "#111827", lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  meta: { margin: "6px 0 0", color: "#64748b", lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  statusApproved: { ...statusBase, background: "#e7f8ef", color: "#166534" },
  statusRejected: { ...statusBase, background: "#fff1f1", color: "#b42318" },
  statusPending: { ...statusBase, background: "#fff7df", color: "#92400e" },
  actions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  formButton: { margin: 0 },
  approve: { ...buttonBase, background: "#16a34a", color: "#ffffff" },
  reject: { ...buttonBase, background: "#f97316", color: "#ffffff" },
  edit: { ...buttonBase, background: "#eef2f7", color: "#334155", border: "1px solid #d8dee9" },
  empty: {
    padding: 24,
    borderRadius: 18,
    background: "#ffffff",
    border: "1px solid #d8dee9",
    color: "#64748b",
    fontWeight: 800,
  },
};
