import Link from "next/link";
import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { excluirMeuAnuncio } from "./actions";

export const dynamic = "force-dynamic";

type TruckImage = { image_url: string | null; principal: boolean | null; ordem: number | null };
type Truck = {
  id: string;
  titulo: string | null;
  status: string | null;
  preco: number | null;
  cidade: string | null;
  estado: string | null;
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

export default async function MeusAnunciosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data } = await supabase
    .from("trucks")
    .select(`
      id,
      titulo,
      status,
      preco,
      cidade,
      estado,
      truck_images (
        image_url,
        principal,
        ordem
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const trucks = (data || []) as Truck[];

  return (
    <PanelLayout
      title="Meus anúncios"
      subtitle="Acompanhe seus anúncios, edite dados, envie mais fotos ou exclua."
      badge="Painel"
      actions={<Link href="/painel/anuncios/novo" style={styles.topButton}>Novo anúncio</Link>}
    >
      <div style={styles.list}>
        {trucks.map((truck) => {
          const image = getMainImage(truck);

          return (
            <article key={truck.id} style={styles.row}>
              <div style={styles.thumb}>
                {image ? <img src={image} alt={truck.titulo || "Caminhão"} style={styles.image} /> : <span>Sem foto</span>}
              </div>

              <div>
                <strong style={styles.title}>{truck.titulo}</strong>
                <p style={styles.meta}>{truck.cidade}/{truck.estado} • {money(truck.preco)}</p>
              </div>

              <span style={styles.status}>{truck.status}</span>

              <div style={styles.actions}>
                <Link href={`/painel/anuncios/${truck.id}/editar`} style={styles.edit}>Editar</Link>
                <form action={excluirMeuAnuncio}>
                  <input type="hidden" name="id" value={truck.id} />
                  <button style={styles.delete}>Excluir</button>
                </form>
              </div>
            </article>
          );
        })}

        {trucks.length === 0 && (
          <div style={styles.empty}>
            Você ainda não cadastrou anúncios.
          </div>
        )}
      </div>
    </PanelLayout>
  );
}

const styles: Record<string, CSSProperties> = {
  topButton: {
    padding: "12px 16px",
    borderRadius: 14,
    background: "#22c55e",
    color: "#052e16",
    textDecoration: "none",
    fontWeight: 900,
  },
  list: { display: "grid", gap: 14 },
  row: {
    display: "grid",
    gridTemplateColumns: "92px 1fr 120px auto",
    gap: 16,
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    background: "rgba(15,23,42,.72)",
    border: "1px solid rgba(255,255,255,.10)",
  },
  thumb: {
    width: 92,
    height: 72,
    borderRadius: 14,
    overflow: "hidden",
    background: "rgba(2,6,23,.72)",
    display: "grid",
    placeItems: "center",
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 900,
  },
  image: { width: "100%", height: "100%", objectFit: "cover" },
  title: { fontSize: 18 },
  meta: { margin: "6px 0 0", color: "#94a3b8" },
  status: {
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,.08)",
    textAlign: "center",
    fontWeight: 900,
  },
  actions: {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
  },
  edit: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.12)",
    color: "white",
    textDecoration: "none",
    fontWeight: 900,
  },
  delete: {
    border: 0,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(239,68,68,.16)",
    color: "#fecaca",
    fontWeight: 900,
    cursor: "pointer",
  },
  empty: {
    padding: 24,
    borderRadius: 20,
    background: "rgba(255,255,255,.07)",
    border: "1px solid rgba(255,255,255,.10)",
  },
};
