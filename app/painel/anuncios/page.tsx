import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { excluirMeuAnuncio, marcarComoVendido, reanunciarAnuncio } from "./actions";
import { gerarSlugComId } from "@/lib/slug";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { Truck, CheckCircle, Clock, XCircle, Handshake, RotateCw, Plus, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

type TruckItem = TruckCardData & {
  status: string | null;
  vendido: boolean | null;
  views: number | null;
};

function normalizeStatus(status: string | null, vendido: boolean | null) {
  if (vendido) return { label: "Vendido",    cls: "sold",     icon: <Handshake size={12} /> };
  const v = (status || "pendente").toLowerCase();
  if (v === "publicado" || v.includes("aprov"))  return { label: "Publicado",  cls: "approved", icon: <CheckCircle size={12} /> };
  if (v.includes("reprov") || v.includes("rejeit")) return { label: "Rejeitado", cls: "rejected", icon: <XCircle size={12} /> };
  return { label: "Aguardando", cls: "pending", icon: <Clock size={12} /> };
}

export default async function MeusAnunciosPage({ searchParams }: { searchParams: Promise<{ erro?: string; mensagem?: string }> }) {
  const { erro, mensagem } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("trucks")
    .select(`id, titulo, marca, modelo, ano_modelo, ano_fabricacao, cidade, estado, status, vendido, preco, views, truck_images(image_url, principal, ordem)`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const trucks = (data || []) as TruckItem[];
  const ativos   = trucks.filter((t) => normalizeStatus(t.status, t.vendido).cls === "approved").length;
  const pendentes = trucks.filter((t) => normalizeStatus(t.status, t.vendido).cls === "pending").length;
  const vendidos  = trucks.filter((t) => normalizeStatus(t.status, t.vendido).cls === "sold").length;

  return (
    <PanelLayout role="anunciante">
      <div className="painel-wrap">

        {erro === "limite" && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#ef4444",
            padding: "16px 20px",
            borderRadius: 14,
            marginBottom: 20,
            fontSize: 14,
            fontWeight: 800
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{mensagem || "Seu limite de anúncios ativos foi atingido."}</span>
          </div>
        )}

        {/* Header */}
        <div className="meus-anuncios-header">
          <div>
            <h1 className="painel-greeting">Meus anúncios</h1>
            <p className="meus-anuncios-sub">Acompanhe, edite e gerencie seus caminhões.</p>
          </div>
          <Link href="/painel/anuncios/novo" className="meus-anuncios-btn-novo">
            <Plus size={16} /> Novo anúncio
          </Link>
        </div>

        {/* Badges de resumo */}
        {trucks.length > 0 && (
          <div className="meus-anuncios-badges">
            <span className="ma-badge">
              <Truck size={13} style={{ color: "var(--blue)" }} /> {trucks.length} total
            </span>
            {ativos > 0 && (
              <span className="ma-badge">
                <CheckCircle size={13} style={{ color: "#16a34a" }} /> {ativos} publicado{ativos > 1 ? "s" : ""}
              </span>
            )}
            {pendentes > 0 && (
              <span className="ma-badge">
                <Clock size={13} style={{ color: "#d97706" }} /> {pendentes} aguardando
              </span>
            )}
            {vendidos > 0 && (
              <span className="ma-badge">
                <Handshake size={13} style={{ color: "var(--muted)" }} /> {vendidos} vendido{vendidos > 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}

        {/* Grid de anúncios */}
        <div className="meus-anuncios-grid">
          {trucks.map((truck) => {
            const status = normalizeStatus(truck.status, truck.vendido);
            const isSold     = status.cls === "sold";
            const isRejected = status.cls === "rejected";
            const slug = gerarSlugComId(truck);

            return (
              <div key={truck.id} className="ma-item">
                {/* Card com badge de status */}
                <div style={{ position: "relative" }}>
                  <TruckCard truck={truck} />
                  <div className={`ma-status-badge ma-status-${status.cls}`}>
                    {status.icon} {status.label}
                  </div>
                </div>

                {/* Ações */}
                <div className="ma-actions">
                  {status.cls === "approved" && (
                    <Link href={`/anuncios/${slug}`} className="ma-btn ma-btn-blue" target="_blank">
                      Ver no site
                    </Link>
                  )}
                  {!isSold && (
                    <form action={marcarComoVendido} style={{ flex: 1 }}>
                      <input type="hidden" name="id" value={truck.id} />
                      <button type="submit" className="ma-btn ma-btn-amber" style={{ width: "100%" }}>
                        <Handshake size={13} /> Vendido
                      </button>
                    </form>
                  )}
                  {(isSold || isRejected) && (
                    <form action={reanunciarAnuncio} style={{ flex: 1 }}>
                      <input type="hidden" name="id" value={truck.id} />
                      <button type="submit" className="ma-btn ma-btn-indigo" style={{ width: "100%" }}>
                        <RotateCw size={13} /> Reanunciar
                      </button>
                    </form>
                  )}
                  <Link href={`/painel/anuncios/${truck.id}/editar`} className="ma-btn ma-btn-gray">
                    Editar
                  </Link>
                  <form action={excluirMeuAnuncio}>
                    <input type="hidden" name="id" value={truck.id} />
                    <ConfirmDeleteButton message={`Excluir o anúncio "${truck.titulo || "selecionado"}"?`} />
                  </form>
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {trucks.length === 0 && (
            <div className="ma-empty">
              <div className="ma-empty-icon"><Truck size={36} strokeWidth={1.5} /></div>
              <h2 className="ma-empty-title">Nenhum anúncio cadastrado</h2>
              <p className="ma-empty-desc">Cadastre seu primeiro caminhão ou implemento para aparecer no site.</p>
              <Link href="/painel/anuncios/novo" className="meus-anuncios-btn-novo">
                Cadastrar primeiro anúncio
              </Link>
            </div>
          )}
        </div>

      </div>
    </PanelLayout>
  );
}
