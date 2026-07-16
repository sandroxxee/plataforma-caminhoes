import { redirect } from "next/navigation";
import Link from "next/link";
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
      actions={<Link href="/admin/anuncios" className="admin-top-btn">Ver todos</Link>}
    >
      {trucks.length === 0 && (
        <div className="admin-empty">Nenhum anúncio pendente agora.</div>
      )}

      <div className="admin-grid">
        {trucks.map((truck) => {
          const image = getMainImage(truck);
          const perfilInfo = truck.perfil ? PERFIL_LABEL[truck.perfil] : null;

          return (
            <article key={truck.id} className="admin-card">
              <div className="admin-card-image-wrap">
                {image ? (
                  <img src={image} alt={truck.titulo || "Caminhão"} className="admin-card-image" />
                ) : (
                  <div className="admin-card-no-image">Sem foto</div>
                )}
              </div>

              <div className="admin-card-body">
                <div className="admin-card-row-top">
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="admin-card-status">Pendente</span>
                    {perfilInfo && (
                      <span style={{ padding: "7px 12px", borderRadius: 999, background: perfilInfo.bg, color: perfilInfo.color, fontWeight: 900, fontSize: 12 }}>
                        {perfilInfo.label}
                      </span>
                    )}
                  </div>
                  <strong className="admin-card-price">{money(truck.preco)}</strong>
                </div>

                <h2 className="admin-card-title">{truck.titulo}</h2>

                <div className="admin-card-meta">
                  {truck.marca && <span>{truck.marca}</span>}
                  {truck.modelo && <span>{truck.modelo}</span>}
                  {truck.ano_modelo && <span>{truck.ano_modelo}</span>}
                  {(truck.cidade || truck.estado) && <span>{[truck.cidade, truck.estado].filter(Boolean).join("/")}</span>}
                  {truck.carroceria && <span>{truck.carroceria}</span>}
                  {truck.tracao && <span>{truck.tracao}</span>}
                </div>

                <p className="admin-card-desc">{truck.descricao || "Sem descrição."}</p>

                <div className="admin-card-actions">
                  <form action={aprovarAnuncio}>
                    <input type="hidden" name="id" value={truck.id} />
                    <button className="admin-btn admin-btn-approve">Aprovar</button>
                  </form>
                  <form action={reprovarAnuncio}>
                    <input type="hidden" name="id" value={truck.id} />
                    <button className="admin-btn admin-btn-reject">Reprovar</button>
                  </form>
                  <Link href={`/painel/anuncios/${truck.id}/editar`} className="admin-btn admin-btn-edit">Editar</Link>
                  <form action={excluirAnuncioAdmin}>
                    <input type="hidden" name="id" value={truck.id} />
                    <button className="admin-btn admin-btn-delete">Excluir</button>
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
