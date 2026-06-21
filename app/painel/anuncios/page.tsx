import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { excluirMeuAnuncio, marcarComoVendido, reanunciarAnuncio } from "./actions";
import { gerarSlugComId } from "@/lib/slug";
import { Truck, CheckCircle, Clock, XCircle, Handshake, Camera, MapPin, RotateCw, Plus, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

type TruckImage = { image_url: string | null; principal: boolean | null; ordem: number | null };
type Truck = {
  id: string;
  titulo: string | null; marca: string | null; modelo: string | null;
  ano_modelo: number | null; ano_fabricacao: number | null;
  cidade: string | null; estado: string | null;
  status: string | null; vendido: boolean | null;
  preco: number | null; views: number | null;
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

function normalizeStatus(status: string | null, vendido: boolean | null) {
  if (vendido) return { label: "Vendido", className: "sold", icon: <Handshake size={12} /> };
  const value = (status || "pendente").toLowerCase();
  if (value === "publicado" || value.includes("aprov")) return { label: "Publicado", className: "approved", icon: <CheckCircle size={12} /> };
  if (value.includes("reprov") || value.includes("rejeit")) return { label: "Rejeitado", className: "rejected", icon: <XCircle size={12} /> };
  return { label: "Aguardando", className: "pending", icon: <Clock size={12} /> };
}

export default async function MeusAnunciosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("trucks")
    .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, cidade, estado, status, vendido, preco, views, truck_images(image_url, principal, ordem)`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const trucks = (data || []) as Truck[];
  const ativos = trucks.filter((t) => normalizeStatus(t.status, t.vendido).className === "approved").length;
  const pendentes = trucks.filter((t) => normalizeStatus(t.status, t.vendido).className === "pending").length;
  const vendidos = trucks.filter((t) => normalizeStatus(t.status, t.vendido).className === "sold").length;

  return (
    <PanelLayout
      title="Meus anúncios"
      subtitle="Acompanhe seus caminhões, edite informações e veja o status de publicação."
      badge={`${trucks.length} ${trucks.length === 1 ? "anúncio" : "anúncios"}`}
      actions={<Link href="/painel/anuncios/novo" className="ml-top-btn"><Plus size={16} style={{ marginRight: 6 }} /> Novo anúncio</Link>}
    >
      <style>{`
        .ml-top-btn {
          display: inline-flex; min-height: 48px; align-items: center; justify-content: center;
          padding: 0 24px; border-radius: 14px; background: var(--blue); color: #fff;
          text-decoration: none; font-weight: 800; font-size: 14px; white-space: nowrap;
          transition: all 0.2s; box-shadow: 0 4px 12px rgba(24,119,242,0.2);
        }
        .ml-top-btn:hover { background: var(--blue2); transform: translateY(-1px); }
        .ml-summary { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
        .ml-summary-item {
          display: flex; align-items: center; gap: 8px; padding: 8px 16px;
          border-radius: 999px; background: #fff; border: 1px solid rgba(148,163,184,0.12);
          font-size: 13px; color: #64748b; font-weight: 700;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .ml-summary-item svg { color: var(--blue); opacity: 0.8; }
        .ml-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
        .ml-card {
          border-radius: 24px; background: #fff; border: 1px solid rgba(148,163,184,0.12);
          overflow: hidden; box-shadow: 0 4px 12px rgba(15,23,42,0.04);
          display: flex; flex-direction: column; transition: all 0.2s;
        }
        .ml-card:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(15,23,42,0.08); border-color: rgba(24,119,242,0.2); }
        .ml-card.is-sold { opacity: .75; filter: grayscale(0.5); }
        .ml-photo { position: relative; height: 220px; background: #f8fafc; overflow: hidden; flex-shrink: 0; }
        .ml-photo img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .4s ease; }
        .ml-card:hover .ml-photo img { transform: scale(1.05); }
        .ml-photo-empty { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #94a3b8; }
        .ml-photo-empty svg { opacity: .4; }
        .ml-photo-empty p { margin: 0; font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
        .ml-status {
          position: absolute; top: 12px; left: 12px;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 999px; font-size: 11px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.04em;
          background: rgba(255,255,255,0.9); backdrop-filter: blur(8px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.2);
        }
        .ml-status.approved { color: #166534; }
        .ml-status.pending { color: #92400e; }
        .ml-status.rejected { color: #b91c1c; }
        .ml-status.sold { color: #475569; }
        .ml-photo-count {
          position: absolute; top: 12px; right: 12px;
          padding: 5px 10px; border-radius: 999px;
          background: rgba(15,23,42,0.6); backdrop-filter: blur(4px);
          font-size: 11px; font-weight: 800; color: #fff;
          display: flex; align-items: center; gap: 5px;
        }
        .ml-body { padding: 20px; flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .ml-title { margin: 0; font-size: 20px; line-height: 1.2; letter-spacing: -.02em; color: #0f172a; font-weight: 800; }
        .ml-location { margin: 0; font-size: 14px; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 5px; }
        .ml-price { font-size: 24px; font-weight: 900; color: var(--blue); letter-spacing: -.03em; margin-top: auto; padding-top: 10px; }
        .ml-price.no-price { font-size: 16px; color: #94a3b8; }
        .ml-views { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #94a3b8; margin-top: 4px; }
        .ml-actions { padding: 0 20px 20px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .ml-actions form { margin: 0; }
        .ml-edit {
          flex: 1; min-height: 44px; display: inline-flex; align-items: center; justify-content: center;
          padding: 0 16px; border-radius: 12px; background: #f1f5f9; border: 1px solid rgba(148,163,184,0.1);
          color: #475569; text-decoration: none; font-weight: 800; font-size: 13px; transition: all 0.2s;
        }
        .ml-edit:hover { background: #e2e8f0; color: #0f172a; }
        .ml-view {
          min-height: 44px; display: inline-flex; align-items: center; justify-content: center;
          padding: 0 18px; border-radius: 12px; background: var(--blueSoft);
          border: 1px solid rgba(24,119,242,0.1); color: var(--blue);
          text-decoration: none; font-weight: 800; font-size: 13px; white-space: nowrap; transition: all 0.2s;
        }
        .ml-view:hover { background: var(--blue); color: #fff; }
        .ml-sold-btn {
          min-height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          padding: 0 16px; border-radius: 12px; background: #fef3c7; border: 1px solid rgba(217,119,6,0.2);
          color: #92400e; font-weight: 800; font-size: 13px; white-space: nowrap; cursor: pointer; transition: all 0.2s;
        }
        .ml-sold-btn:hover { background: #fde68a; }
        .ml-reanunciar-btn {
          min-height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 0 16px; border-radius: 12px; background: #eef2ff; border: 1px solid rgba(79,70,229,0.2);
          color: #4338ca; font-weight: 800; font-size: 13px; white-space: nowrap; cursor: pointer; transition: all 0.2s;
        }
        .ml-reanunciar-btn:hover { background: #e0e7ff; }
        .ml-empty { grid-column: 1/-1; padding: 80px 40px; border-radius: 24px; background: #fff; border: 1px solid rgba(148,163,184,0.12); text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .ml-empty-icon { color: var(--blue); margin-bottom: 20px; opacity: 0.6; }
        .ml-empty h2 { margin: 0 0 12px; font-size: 26px; color: #0f172a; font-weight: 800; letter-spacing: -0.03em; }
        .ml-empty p { margin: 0 auto 24px; color: #64748b; max-width: 480px; line-height: 1.6; font-weight: 600; }
        .ml-empty a {
          display: inline-flex; min-height: 50px; align-items: center; justify-content: center;
          padding: 0 28px; border-radius: 14px; background: var(--blue); color: #fff;
          text-decoration: none; font-weight: 800; transition: all 0.2s; box-shadow: 0 4px 12px rgba(24,119,242,0.2);
        }
        .ml-empty a:hover { background: var(--blue2); transform: translateY(-1px); }
        @media(max-width:900px){ .ml-grid { grid-template-columns: 1fr; } .ml-photo { height: 260px; } }
        @media(max-width:560px){
          .ml-summary { gap: 8px; } .ml-summary-item { font-size: 12px; padding: 6px 12px; }
          .ml-grid { gap: 16px; } .ml-card { flex-direction: row; border-radius: 20px; height: 120px; }
          .ml-photo { width: 120px; height: 120px; flex-shrink: 0; border-radius: 0; }
          .ml-status { top: 8px; left: 8px; font-size: 9px; padding: 4px 8px; } .ml-photo-count { display: none; }
          .ml-body { padding: 12px 16px; gap: 4px; justify-content: center; }
          .ml-title { font-size: 16px; } .ml-location { font-size: 12px; } .ml-price { font-size: 18px; margin-top: 4px; padding-top: 0; }
          .ml-actions { display: none; }
        }
      `}</style>

      {trucks.length > 0 && (
        <div className="ml-summary">
          <div className="ml-summary-item"><Truck size={14} /> {trucks.length} total</div>
          {ativos > 0 && <div className="ml-summary-item"><CheckCircle size={14} /> {ativos} publicado{ativos > 1 ? "s" : ""}</div>}
          {pendentes > 0 && <div className="ml-summary-item"><Clock size={14} /> {pendentes} aguardando</div>}
          {vendidos > 0 && <div className="ml-summary-item"><Handshake size={14} /> {vendidos} vendido{vendidos > 1 ? "s" : ""}</div>}
        </div>
      )}

      <section className="ml-grid">
        {trucks.map((truck) => {
          const image = getMainImage(truck);
          const status = normalizeStatus(truck.status, truck.vendido);
          const photoCount = truck.truck_images?.length ?? 0;
          const hasPrice = truck.preco && truck.preco > 0;
          const isSold = status.className === "sold";
          const isRejected = status.className === "rejected";
          const views = truck.views ?? 0;
          const slug = gerarSlugComId(truck);

          return (
            <article key={truck.id} className={`ml-card${isSold ? " is-sold" : ""}`}>
              <div className="ml-photo">
                {image ? (
                  <img src={image} alt={truck.titulo || "Caminhão"} loading="lazy" decoding="async" />
                ) : (
                  <div className="ml-photo-empty"><Truck size={40} strokeWidth={1.5} /><p>Sem foto</p></div>
                )}
                <em className={`ml-status ${status.className}`}>{status.icon} <span style={{ marginLeft: 6 }}>{status.label}</span></em>
                {photoCount > 0 && <span className="ml-photo-count"><Camera size={12} /> {photoCount}</span>}
              </div>

              <div className="ml-body">
                <h2 className="ml-title">{truck.titulo || "Caminhão sem título"}</h2>
                <p className="ml-location"><MapPin size={13} /> {truck.cidade || "Cidade"} • {truck.estado || "UF"}</p>
                <strong className={`ml-price${!hasPrice ? " no-price" : ""}`}>{money(truck.preco)}</strong>
                {views > 0 && (
                  <span className="ml-views">
                    <Eye size={13} strokeWidth={2.5} />
                    {views.toLocaleString("pt-BR")} {views === 1 ? "visualização" : "visualizações"}
                  </span>
                )}
              </div>

              <div className="ml-actions">
                {status.className === "approved" && (
                  <Link href={`/anuncios/${slug}`} className="ml-view" target="_blank">Ver no site</Link>
                )}
                {!isSold && (
                  <form action={marcarComoVendido}>
                    <input type="hidden" name="id" value={truck.id} />
                    <button type="submit" className="ml-sold-btn" title="Marcar como vendido"><Handshake size={14} /> Vendido</button>
                  </form>
                )}
                {(isSold || isRejected) && (
                  <form action={reanunciarAnuncio}>
                    <input type="hidden" name="id" value={truck.id} />
                    <button type="submit" className="ml-reanunciar-btn" title="Criar novo anúncio com os mesmos dados">
                      <RotateCw size={14} /> Reanunciar
                    </button>
                  </form>
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
            <div className="ml-empty-icon"><Truck size={64} strokeWidth={1} /></div>
            <h2>Nenhum anúncio cadastrado</h2>
            <p>Cadastre seu primeiro caminhão ou implemento para aparecer no site e receber contatos de compradores.</p>
            <Link href="/painel/anuncios/novo">Cadastrar primeiro anúncio</Link>
          </div>
        )}
      </section>
    </PanelLayout>

  );
}
