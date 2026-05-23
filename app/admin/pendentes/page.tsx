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
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.14)",
    color: "white",
    textDecoration: "none",
    fontWeight: 900,
  },
  empty: {
    padding: 26,
    borderRadius: 22,
    background: "rgba(255,255,255,.07)",
    border: "1px solid rgba(255,255,255,.10)",
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
    background: "rgba(15,23,42,.72)",
    border: "1px solid rgba(255,255,255,.10)",
  },
  imageWrap: {
    minHeight: 220,
    background: "rgba(2,6,23,.70)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  noImage: {
    height: "100%",
    minHeight: 220,
    display: "grid",
    placeItems: "center",
    color: "#94a3b8",
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
    background: "rgba(234,179,8,.14)",
    color: "#fde68a",
    fontWeight: 900,
    fontSize: 12,
  },
  price: {
    color: "#86efac",
    fontSize: 24,
  },
  cardTitle: {
    margin: "14px 0 10px",
    fontSize: 26,
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  desc: {
    color: "#cbd5e1",
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
    background: "#22c55e",
    color: "#052e16",
    fontWeight: 900,
    cursor: "pointer",
  },
  reject: {
    border: 0,
    padding: "12px 16px",
    borderRadius: 13,
    background: "#f97316",
    color: "#431407",
    fontWeight: 900,
    cursor: "pointer",
  },
  edit: {
    padding: "12px 16px",
    borderRadius: 13,
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.12)",
    color: "white",
    textDecoration: "none",
    fontWeight: 900,
  },
  delete: {
    border: 0,
    padding: "12px 16px",
    borderRadius: 13,
    background: "rgba(239,68,68,.16)",
    color: "#fecaca",
    fontWeight: 900,
    cursor: "pointer",
  },
};
