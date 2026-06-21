import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { excluirMeuAnuncio, marcarComoVendido, reanunciarAnuncio } from "./actions";
import { gerarSlugComId } from "@/lib/slug";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { Truck, CheckCircle, Clock, XCircle, Handshake, Camera, MapPin, RotateCw, Plus, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

type Truck = TruckCardData & {
  status: string | null; vendido: boolean | null;
  views: number | null;
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
      actions={<Link href="/painel/anuncios/novo" className="h-12 px-6 inline-flex items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"><Plus size={16} className="mr-2" /> Novo anúncio</Link>}
    >
      <div className="flex flex-col gap-6">
        {trucks.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-bold text-slate-500 flex items-center gap-2">
              <Truck size={14} className="text-blue-600" /> {trucks.length} total
            </div>
            {ativos > 0 && (
              <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-bold text-slate-500 flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" /> {ativos} publicado{ativos > 1 ? "s" : ""}
              </div>
            )}
            {pendentes > 0 && (
              <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-bold text-slate-500 flex items-center gap-2">
                <Clock size={14} className="text-amber-600" /> {pendentes} aguardando
              </div>
            )}
            {vendidos > 0 && (
              <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm font-bold text-slate-500 flex items-center gap-2">
                <Handshake size={14} className="text-slate-600" /> {vendidos} vendido{vendidos > 1 ? "s" : ""}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trucks.map((truck) => {
            const status = normalizeStatus(truck.status, truck.vendido);
            const isSold = status.className === "sold";
            const isRejected = status.className === "rejected";
            const slug = gerarSlugComId(truck);

            return (
              <div key={truck.id} className="flex flex-col">
                <div className="relative">
                  <TruckCard truck={truck} />
                  <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur border border-white/20 shadow-lg flex items-center gap-2 ${
                    status.className === 'approved' ? 'text-green-700' :
                    status.className === 'pending' ? 'text-amber-700' :
                    status.className === 'rejected' ? 'text-red-700' : 'text-slate-700'
                  }`}>
                    {status.icon} {status.label}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  {status.className === "approved" && (
                    <Link href={`/anuncios/${slug}`} className="flex-1 h-10 inline-flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all" target="_blank">
                      Ver no site
                    </Link>
                  )}
                  {!isSold && (
                    <form action={marcarComoVendido} className="flex-1">
                      <input type="hidden" name="id" value={truck.id} />
                      <button type="submit" className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-50 text-amber-700 font-bold text-xs hover:bg-amber-100 transition-all">
                        <Handshake size={14} /> Vendido
                      </button>
                    </form>
                  )}
                  {(isSold || isRejected) && (
                    <form action={reanunciarAnuncio} className="flex-1">
                      <input type="hidden" name="id" value={truck.id} />
                      <button type="submit" className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-all">
                        <RotateCw size={14} /> Reanunciar
                      </button>
                    </form>
                  )}
                  <Link href={`/painel/anuncios/${truck.id}/editar`} className="flex-1 h-10 inline-flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-all">
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

          {trucks.length === 0 && (
            <div className="col-span-full py-20 px-10 bg-white rounded-3xl border border-slate-200 border-dashed text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck size={40} className="text-slate-300" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Nenhum anúncio cadastrado</h2>
              <p className="text-slate-500 font-bold max-w-md mx-auto mb-8">Cadastre seu primeiro caminhão ou implemento para aparecer no site e receber contatos.</p>
              <Link href="/painel/anuncios/novo" className="h-14 px-10 inline-flex items-center justify-center rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                Cadastrar primeiro anúncio
              </Link>
            </div>
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
