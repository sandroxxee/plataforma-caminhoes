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
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export default async function AdminPendentesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/painel");

  const { data } = await supabase
    .from("trucks")
    .select(`
      id,
      titulo,
      marca,
      modelo,
      ano_modelo,
      preco,
      cidade,
      estado,
      carroceria,
      tracao,
      whatsapp,
      descricao,
      truck_images (
        image_url,
        principal,
        ordem
      )
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
        <div style={styles.empty}>
          Nenhum anúncio pendente agora.
        </div>
      )}

      <div style={styles.grid}>
        {trucks.map((truck) => {
          const image = getMainImage(truck);

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
                  <span style={styles.status}>Pendente</span>
                  <strong style={styles.price}>{money(truck.preco)}</strong>
                </div>

                <h2 style={styles.cardTitle}>{truck.titulo}</h2>

                <div style={styles.meta}>
                  <span>{truck.marca}</span>
                  <span>{truck.modelo}</span>
                  <span>{truck.ano_modelo}</span>
                  <span>{truck.cidade}/{truck.estado}</span>
                  <span>{truck.carroceria}</span>
                  <span>{truck.tracao}</span>
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

                  <Link href={`/painel/anuncios/${truck.id}/editar`} style={styles.edit}>
                    Editar
                  </Link>

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
  topButton: {
    padding: "12px 16px",
    borderRadius: 14,
    background: "#1f64b5",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 900,
  },
  empty: {
    padding: 26,
    borderRadius: 22,
    background: "#ffffff",
    border: "1px solid #d8dee9",
    color: "#64748b",
    fontWeight: 800,
  },
  grid: {
    display: "grid",
    gap: 18,
  },
  card: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    overflow: "hidden",
    borderRadius: 24,
    background: "#ffffff",
    border: "1px solid #d8dee9",
    boxShadow: "0 8px 22px rgba(15,23,42,.05)",
  },
  imageWrap: {
    minHeight: 220,
    background: "#f4f7fb",
    borderRight: "1px solid #e2e8f0",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center center",
    display: "block",
    background: "#f4f7fb",
  },
  noImage: {
    height: "100%",
    minHeight: 220,
    display: "grid",
    placeItems: "center",
    color: "#64748b",
    fontWeight: 900,
  },
  body: {
    padding: 22,
  },
  rowTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  status: {
    padding: "7px 12px",
    borderRadius: 999,
    background: "#fff7df",
    color: "#92400e",
    fontWeight: 900,
    fontSize: 12,
  },
  price: {
    color: "#166534",
    fontSize: 24,
  },
  cardTitle: {
    margin: "14px 0 10px",
    fontSize: 26,
    color: "#111827",
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  desc: {
    color: "#64748b",
    lineHeight: 1.55,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  approve: {
    border: 0,
    padding: "12px 16px",
    borderRadius: 13,
    background: "#16a34a",
    color: "#ffffff",
    fontWeight: 900,
    cursor: "pointer",
  },
  reject: {
    border: 0,
    padding: "12px 16px",
    borderRadius: 13,
    background: "#f97316",
    color: "#ffffff",
    fontWeight: 900,
    cursor: "pointer",
  },
  edit: {
    padding: "12px 16px",
    borderRadius: 13,
    background: "#eef2f7",
    border: "1px solid #d8dee9",
    color: "#334155",
    textDecoration: "none",
    fontWeight: 900,
  },
  delete: {
    border: 0,
    padding: "12px 16px",
    borderRadius: 13,
    background: "#fff1f1",
    color: "#b42318",
    fontWeight: 900,
    cursor: "pointer",
  },
};
