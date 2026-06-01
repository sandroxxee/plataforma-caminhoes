import Link from "next/link";
import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
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

function normalizeStatus(status: string | null) {
  const value = (status || "pendente").toLowerCase();

  if (value.includes("aprov")) return { label: "Aprovado", className: "approved" };
  if (value.includes("reprov")) return { label: "Reprovado", className: "rejected" };
  if (value.includes("vend")) return { label: "Vendido", className: "sold" };

  return { label: "Pendente", className: "pending" };
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
      subtitle="Acompanhe seus caminhões, edite informações e veja o status de publicação."
      badge={`${trucks.length} ${trucks.length === 1 ? "anúncio" : "anúncios"}`}
      actions={<Link href="/painel/anuncios/novo" className="top-button">Novo anúncio</Link>}
    >
      <section className="my-listings">
        {trucks.map((truck) => {
          const image = getMainImage(truck);
          const status = normalizeStatus(truck.status);

          return (
            <article key={truck.id} className="listing-card">
              <div className="listing-photo">
                {image ? <img src={image} alt={truck.titulo || "Caminhão"} /> : <span>Sem foto</span>}
                <em className={`status ${status.className}`}>{status.label}</em>
              </div>

              <div className="listing-body">
                <div>
                  <h2>{truck.titulo || "Caminhão sem título"}</h2>
                  <p>{truck.cidade || "Cidade não informada"}/{truck.estado || "UF"}</p>
                </div>

                <strong>{money(truck.preco)}</strong>
              </div>

              <div className="listing-actions">
                <Link href={`/painel/anuncios/${truck.id}/editar`} className="edit-action">Editar anúncio</Link>
                <form action={excluirMeuAnuncio}>
                  <input type="hidden" name="id" value={truck.id} />
                  <ConfirmDeleteButton message={`Tem certeza que deseja excluir o anúncio ${truck.titulo || "selecionado"}?`} />
                </form>
              </div>
            </article>
          );
        })}

        {trucks.length === 0 && (
          <div className="empty-state-panel">
            <span>🚛</span>
            <h2>Você ainda não cadastrou anúncios.</h2>
            <p>Cadastre o primeiro caminhão para aparecer no seu painel e aguardar aprovação.</p>
            <Link href="/painel/anuncios/novo">Cadastrar primeiro anúncio</Link>
          </div>
        )}
      </section>

      <style>{`
        .top-button{display:inline-flex;min-height:46px;align-items:center;justify-content:center;padding:0 16px;border-radius:14px;background:#22c55e;color:#06140b;text-decoration:none;font-weight:950}
        .my-listings{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
        .listing-card{overflow:hidden;border-radius:22px;background:#1f2327;border:1px solid #343a40;box-shadow:0 16px 34px rgba(0,0,0,.18)}
        .listing-photo{position:relative;height:300px;background:#15181b;display:grid;place-items:center;color:#8f99a3;font-weight:950;overflow:hidden;border-bottom:1px solid #343a40}
        .listing-photo img{width:100%;height:100%;object-fit:contain;object-position:center center;display:block;background:#15181b}
        .status{position:absolute;left:14px;top:14px;min-height:30px;display:inline-flex;align-items:center;padding:0 11px;border-radius:999px;font-size:12px;font-style:normal;font-weight:950;border:1px solid rgba(255,255,255,.10);box-shadow:0 6px 18px rgba(0,0,0,.25)}
        .status.approved{background:#14532d;color:#bbf7d0}.status.pending{background:#3a2b10;color:#fde68a}.status.rejected{background:#35191b;color:#fecaca}.status.sold{background:#2a2f34;color:#cbd5df}
        .listing-body{padding:18px;display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.listing-body h2{margin:0 0 8px;font-size:20px;line-height:1.15;letter-spacing:-.03em;color:#f4f4f5}.listing-body p{margin:0;color:#a7afb7;font-weight:800}.listing-body strong{white-space:nowrap;color:#22c55e;font-size:18px}
        .listing-actions{padding:0 18px 18px;display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center}.listing-actions form{margin:0}.edit-action{min-height:42px;display:inline-flex;align-items:center;justify-content:center;padding:0 14px;border-radius:13px;background:#2a2f34;border:1px solid #343a40;color:#e8eaed;text-decoration:none;font-weight:950}
        .empty-state-panel{grid-column:1/-1;padding:32px;border-radius:22px;background:#1f2327;border:1px solid #343a40;text-align:center;box-shadow:0 16px 34px rgba(0,0,0,.18)}.empty-state-panel span{display:block;font-size:42px;margin-bottom:12px}.empty-state-panel h2{margin:0 0 8px;font-size:26px;color:#f4f4f5}.empty-state-panel p{margin:0 auto 18px;color:#a7afb7;max-width:520px;line-height:1.55}.empty-state-panel a{display:inline-flex;min-height:46px;align-items:center;justify-content:center;padding:0 18px;border-radius:14px;background:#22c55e;color:#06140b;text-decoration:none;font-weight:950}
        @media(max-width:1280px){.listing-photo{height:260px}}
        @media(max-width:980px){.my-listings{grid-template-columns:1fr}.listing-photo{height:300px}}
        @media(max-width:560px){.listing-photo{height:230px}.listing-body,.listing-actions{grid-template-columns:1fr;display:grid}.listing-body strong{white-space:normal}}
      `}</style>
    </PanelLayout>
  );
}

const styles: Record<string, CSSProperties> = {};
