import Link from "next/link";
import { redirect } from "next/navigation";
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
  if (value === "publicado" || value.includes("aprov")) return { label: "Publicado", className: "approved", emoji: "✅" };
  if (value.includes("reprov") || value.includes("rejeit")) return { label: "Rejeitado", className: "rejected", emoji: "❌" };
  if (value.includes("vend")) return { label: "Vendido", className: "sold", emoji: "🤝" };
  return { label: "Aguardando", className: "pending", emoji: "⏳" };
}

export default async function MeusAnunciosPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("trucks")
    .select(`id, titulo, status, preco, cidade, estado, truck_images(image_url, principal, ordem)`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const trucks = (data || []) as Truck[];
  const ativos = trucks.filter((t) => normalizeStatus(t.status).className === "approved").length;
  const pendentes = trucks.filter((t) => normalizeStatus(t.status).className === "pending").length;

  return (
    <PanelLayout
      title="Meus anúncios"
      subtitle="Acompanhe seus caminhões, edite informações e veja o status de publicação."
      badge={`${trucks.length} ${trucks.length === 1 ? "anúncio" : "anúncios"}`}
      actions={<Link href="/painel/anuncios/novo" className="ml-top-btn">+ Novo anúncio</Link>}
    >
      <style>{`
        /* Botão topo */
        .ml-top-btn{display:inline-flex;min-height:46px;align-items:center;justify-content:center;padding:0 20px;border-radius:14px;background:#22c55e;color:#06140b;text-decoration:none;font-weight:950;font-size:14px;white-space:nowrap}

        /* Barra de resumo */
        .ml-summary{display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap}
        .ml-summary-item{display:flex;align-items:center;gap:7px;padding:8px 14px;border-radius:999px;background:#1f2327;border:1px solid #343a40;font-size:13px;color:#aeb8c2;font-weight:700}
        .ml-summary-item span{font-size:15px}

        /* Grid de cards */
        .ml-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}

        /* Card */
        .ml-card{border-radius:22px;background:#1f2327;border:1px solid #343a40;overflow:hidden;box-shadow:0 12px 32px rgba(0,0,0,.18);display:flex;flex-direction:column;transition:border-color .2s,box-shadow .2s}
        .ml-card:hover{border-color:rgba(34,197,94,.4);box-shadow:0 18px 48px rgba(0,0,0,.28)}

        /* Foto */
        .ml-photo{position:relative;height:220px;background:#15181b;overflow:hidden;flex-shrink:0}
        .ml-photo img{width:100%;height:100%;object-fit:cover;object-position:center;display:block;transition:transform .35s ease}
        .ml-card:hover .ml-photo img{transform:scale(1.04)}
        .ml-photo-empty{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#4a5568}
        .ml-photo-empty span{font-size:36px;opacity:.5}
        .ml-photo-empty p{margin:0;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}

        /* Badge status */
        .ml-status{position:absolute;top:12px;left:12px;display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:999px;font-size:12px;font-weight:950;border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(6px);box-shadow:0 4px 12px rgba(0,0,0,.3)}
        .ml-status.approved{background:rgba(20,83,45,.9);color:#bbf7d0}
        .ml-status.pending{background:rgba(58,43,16,.9);color:#fde68a}
        .ml-status.rejected{background:rgba(53,25,27,.9);color:#fecaca}
        .ml-status.sold{background:rgba(42,47,52,.9);color:#cbd5df}

        /* Contador de fotos */
        .ml-photo-count{position:absolute;top:12px;right:12px;padding:4px 9px;border-radius:999px;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);font-size:11px;font-weight:800;color:#e8eaed}

        /* Corpo */
        .ml-body{padding:16px 18px;flex:1;display:flex;flex-direction:column;gap:10px}
        .ml-title{margin:0;font-size:18px;line-height:1.2;letter-spacing:-.03em;color:#f4f4f5;font-weight:800}
        .ml-location{margin:0;font-size:13px;color:#8f99a3;font-weight:700}
        .ml-price{font-size:22px;font-weight:900;color:#22c55e;letter-spacing:-.02em;margin-top:auto}
        .ml-price.no-price{font-size:15px;color:#8f99a3}

        /* Ações */
        .ml-actions{padding:0 18px 16px;display:flex;gap:10px;align-items:center}
        .ml-actions form{margin:0}
        .ml-edit{flex:1;min-height:42px;display:inline-flex;align-items:center;justify-content:center;padding:0 16px;border-radius:13px;background:#2a2f34;border:1px solid #343a40;color:#e8eaed;text-decoration:none;font-weight:950;font-size:13px;transition:background .18s,border-color .18s}
        .ml-edit:hover{background:#343a40;border-color:#4a5568}
        .ml-view{min-height:42px;display:inline-flex;align-items:center;justify-content:center;padding:0 16px;border-radius:13px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.25);color:#22c55e;text-decoration:none;font-weight:950;font-size:13px;white-space:nowrap;transition:background .18s}
        .ml-view:hover{background:rgba(34,197,94,.18)}

        /* Empty state */
        .ml-empty{grid-column:1/-1;padding:40px 24px;border-radius:22px;background:#1f2327;border:1px solid #343a40;text-align:center}
        .ml-empty-icon{font-size:48px;margin-bottom:14px}
        .ml-empty h2{margin:0 0 8px;font-size:24px;color:#f4f4f5}
        .ml-empty p{margin:0 auto 20px;color:#a7afb7;max-width:480px;line-height:1.6}
        .ml-empty a{display:inline-flex;min-height:46px;align-items:center;justify-content:center;padding:0 20px;border-radius:14px;background:#22c55e;color:#06140b;text-decoration:none;font-weight:950}

        /* --- TABLET --- */
        @media(max-width:900px){
          .ml-grid{grid-template-columns:1fr}
          .ml-photo{height:260px}
        }

        /* --- MOBILE --- */
        @media(max-width:560px){
          .ml-summary{gap:8px}
          .ml-summary-item{font-size:12px;padding:6px 10px}
          .ml-grid{gap:12px}
          .ml-card{flex-direction:row;border-radius:18px;height:110px}
          .ml-photo{width:110px;height:110px;flex-shrink:0;border-radius:0}
          .ml-photo img{border-radius:0}
          .ml-status{top:8px;left:8px;font-size:10px;padding:3px 8px}
          .ml-photo-count{display:none}
          .ml-body{padding:12px 14px;gap:4px;justify-content:center}
          .ml-title{font-size:15px}
          .ml-location{font-size:11px}
          .ml-price{font-size:17px;margin-top:4px}
          .ml-actions{display:none}
        }
      `}</style>

      {/* Resumo rápido */}
      {trucks.length > 0 && (
        <div className="ml-summary">
          <div className="ml-summary-item"><span>🚛</span> {trucks.length} total</div>
          {ativos > 0 && <div className="ml-summary-item"><span>✅</span> {ativos} publicado{ativos > 1 ? "s" : ""}</div>}
          {pendentes > 0 && <div className="ml-summary-item"><span>⏳</span> {pendentes} aguardando</div>}
        </div>
      )}

      <section className="ml-grid">
        {trucks.map((truck) => {
          const image = getMainImage(truck);
          const status = normalizeStatus(truck.status);
          const photoCount = truck.truck_images?.length ?? 0;
          const hasPrice = truck.preco && truck.preco > 0;

          return (
            <article key={truck.id} className="ml-card">
              <div className="ml-photo">
                {image ? (
                  <img src={image} alt={truck.titulo || "Caminhão"} loading="lazy" decoding="async" />
                ) : (
                  <div className="ml-photo-empty">
                    <span>🚛</span>
                    <p>Sem foto</p>
                  </div>
                )}
                <em className={`ml-status ${status.className}`}>{status.emoji} {status.label}</em>
                {photoCount > 0 && (
                  <span className="ml-photo-count">📷 {photoCount}</span>
                )}
              </div>

              <div className="ml-body">
                <h2 className="ml-title">{truck.titulo || "Caminhão sem título"}</h2>
                <p className="ml-location">📍 {truck.cidade || "Cidade"} • {truck.estado || "UF"}</p>
                <strong className={`ml-price${!hasPrice ? " no-price" : ""}`}>
                  {money(truck.preco)}
                </strong>
              </div>

              <div className="ml-actions">
                {status.className === "approved" && (
                  <Link href={`/anuncios/${truck.id}`} className="ml-view" target="_blank">Ver no site</Link>
                )}
                <Link href={`/painel/anuncios/${truck.id}/editar`} className="ml-edit">Editar</Link>
                <form action={excluirMeuAnuncio}>
                  <input type="hidden" name="id" value={truck.id} />
                  <ConfirmDeleteButton message={`Excluir o anúncio "${truck.titulo || "selecionado"}"?`} />
                </form>
              </div>
            </article>
          );
        })}

        {trucks.length === 0 && (
          <div className="ml-empty">
            <div className="ml-empty-icon">🚛</div>
            <h2>Nenhum anúncio cadastrado</h2>
            <p>Cadastre seu primeiro caminhão ou implemento para aparecer no site e receber contatos de compradores.</p>
            <Link href="/painel/anuncios/novo">Cadastrar primeiro anúncio</Link>
          </div>
        )}
      </section>
    </PanelLayout>
  );
}
