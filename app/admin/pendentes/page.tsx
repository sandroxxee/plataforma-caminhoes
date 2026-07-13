import { redirect } from "next/navigation";
import Link from "next/link";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/AdminLayout";
import { aprovarAnuncio, reprovarAnuncio, excluirAnuncioAdmin } from "../actions";

export const dynamic = "force-dynamic";

type TruckImage = {
  image_url: string | null;
  principal: boolean | null;
  ordem: number | null;
};

type Truck = {
  id: string;
  titulo: string | null;
  marca: string | null;
  modelo: string | null;
  ano_modelo: number | null;
  preco: number | null;
  cidade: string | null;
  estado: string | null;
  carroceria: string | null;
  tracao: string | null;
  whatsapp: string | null;
  descricao: string | null;
  perfil: string | null;
  truck_images?: TruckImage[];
};

const PERFIL_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  Máquinas:  { label: "Máquina",   color: "#92400e", bg: "#fef3c7" },
  Peças:     { label: "Peça",      color: "#1e40af", bg: "#dbeafe" },
  Carretas:  { label: "Carreta",   color: "#166534", bg: "#dcfce7" },
  Implementos:{ label: "Implemento", color: "#6b21a8", bg: "#f3e8ff" },
};

import { formatImageUrl } from "@/lib/truck-utils";

function getMainImage(truck: Truck) {
  const images = truck.truck_images || [];
  const principal = images.find((img) => img.principal);
  const first = [...images].sort((a, b) => (a.ordem || 0) - (b.ordem || 0))[0];
  return formatImageUrl(principal?.image_url || first?.image_url || "");
}

function money(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default async function AdminPendentesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/painel");

  const { data } = await supabase
    .from("trucks")
    .select(`
      id, titulo, marca, modelo, ano_modelo, preco,
      cidade, estado, carroceria, tracao, whatsapp, descricao, perfil,
      truck_images ( image_url, principal, ordem )
    `)
    .eq("status", "pendente")
    .order("created_at", { ascending: false });

  const trucks = (data || []) as Truck[];

  return (
    <AdminLayout
      title="Anúncios pendentes"
      subtitle="Revise foto, dados e descrição antes de liberar o anúncio no site público."
      badge="Administração"
      actions={<Link href="/admin/anuncios" style={styles.topButton}>Ver todos</Link>}
    >
      {trucks.length === 0 && (
        <div style={styles.empty}>Nenhum anúncio pendente agora.</div>
      )}

      <div style={styles.grid}>
        {trucks.map((truck) => {
          const image = getMainImage(truck);
          const perfilInfo = truck.perfil ? PERFIL_LABEL[truck.perfil] : null;

          return (
            <article key={truck.id} style={styles.card}>
              <div style={styles.imageWrap}>
                {image ? (
                  <img src={image} alt={truck.titulo || "Caminhão"} style={styles.image} />
                ) : (
                  <div style={styles.noImage}>Sem foto</div>
                )}
              </div>

              <div style={styles.body}>
                <div style={styles.rowTop}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={styles.status}>Pendente</span>
                    {perfilInfo && (
                      <span style={{ padding: "7px 12px", borderRadius: 999, background: perfilInfo.bg, color: perfilInfo.color, fontWeight: 900, fontSize: 12 }}>
                        {perfilInfo.label}
                      </span>
                    )}
                  </div>
                  <strong style={styles.price}>{money(truck.preco)}</strong>
                </div>

                <h2 style={styles.cardTitle}>{truck.titulo}</h2>

                <div style={styles.meta}>
                  {truck.marca && <span>{truck.marca}</span>}
                  {truck.modelo && <span>{truck.modelo}</span>}
                  {truck.ano_modelo && <span>{truck.ano_modelo}</span>}
                  {(truck.cidade || truck.estado) && <span>{[truck.cidade, truck.estado].filter(Boolean).join("/")}</span>}
                  {truck.carroceria && <span>{truck.carroceria}</span>}
                  {truck.tracao && <span>{truck.tracao}</span>}
                </div>

                <p style={styles.desc}>{truck.descricao || "Sem descrição."}</p>

                <div style={styles.actions}>
                  <form action={aprovarAnuncio}>
                    <input type="hidden" name="id" value={truck.id} />
                    <button style={styles.approve}>Aprovar</button>
                  </form>
                  <form action={reprovarAnuncio}>
                    <input type="hidden" name="id" value={truck.id} />
                    <button style={styles.reject}>Reprovar</button>
                  </form>
                  <Link href={`/painel/anuncios/${truck.id}/editar`} style={styles.edit}>Editar</Link>
                  <form action={excluirAnuncioAdmin}>
                    <input type="hidden" name="id" value={truck.id} />
                    <button style={styles.delete}>Excluir</button>
                  </form>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </AdminLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  topButton: { padding: "12px 20px", borderRadius: 14, background: "#1877f2", color: "#ffffff", textDecoration: "none", fontWeight: 800, fontSize: 14, boxShadow: "0 4px 12px rgba(24,119,242,0.2)" },
  empty: { padding: 32, borderRadius: 24, background: "#ffffff", border: "1px solid rgba(148,163,184,0.12)", color: "#64748b", fontWeight: 700, textAlign: "center" },
  grid: { display: "grid", gap: 20 },
  card: { display: "grid", gridTemplateColumns: "280px 1fr", overflow: "hidden", borderRadius: 24, background: "#ffffff", border: "1px solid rgba(148,163,184,0.12)", boxShadow: "0 4px 20px rgba(15,23,42,0.04)" },
  imageWrap: { minHeight: 240, background: "#f8fafc", borderRight: "1px solid rgba(148,163,184,0.08)" },
  image: { width: "100%", height: "100%", objectFit: "contain", display: "block" },
  noImage: { height: "100%", minHeight: 240, display: "grid", placeItems: "center", color: "#94a3b8", fontWeight: 800 },
  body: { padding: 24 },
  rowTop: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" },
  status: { padding: "7px 14px", borderRadius: 999, background: "#fef3c7", color: "#92400e", fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' },
  price: { color: "#1877f2", fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em' },
  cardTitle: { margin: "14px 0 10px", fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: '-0.02em' },
  meta: { display: "flex", flexWrap: "wrap", gap: 8, color: "#64748b", fontWeight: 700, fontSize: 14 },
  desc: { color: "#475569", lineHeight: 1.6, fontSize: 14, marginTop: 12 },
  actions: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 },
  approve: { border: 0, padding: "12px 20px", borderRadius: 14, background: "#1877f2", color: "#ffffff", fontWeight: 800, cursor: "pointer" },
  reject: { border: 0, padding: "12px 20px", borderRadius: 14, background: "#fee2e2", color: "#ef4444", fontWeight: 800, cursor: "pointer" },
  edit: { padding: "12px 20px", borderRadius: 14, background: "#f1f5f9", border: "1px solid rgba(148,163,184,0.1)", color: "#475569", textDecoration: "none", fontWeight: 800 },
  delete: { border: 0, padding: "12px 20px", borderRadius: 14, background: "#fef2f2", color: "#b91c1c", fontWeight: 800, cursor: "pointer" },
};
