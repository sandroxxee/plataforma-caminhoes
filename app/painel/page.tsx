import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";
import { Eye, FileText, Clock, XCircle, Truck, Package, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PainelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: trucks } = await supabase
    .from("trucks")
    .select("status,views")
    .eq("user_id", user.id);

  const total      = trucks?.length ?? 0;
  const ativos     = trucks?.filter((a) => a.status === "aprovado").length ?? 0;
  const pendentes  = trucks?.filter((a) => a.status === "pendente").length ?? 0;
  const rejeitados = trucks?.filter((a) => a.status === "rejeitado").length ?? 0;
  const totalViews = trucks?.reduce((acc, a) => acc + (a.views ?? 0), 0) ?? 0;
  const nomeUsuario = user.user_metadata?.name || user.email?.split("@")[0] || "Anunciante";

  const stats = [
    { label: "Publicados",  value: ativos,     icon: FileText,  color: "text-green-600",  bg: "bg-green-50",   border: "border-green-100" },
    { label: "Aguardando",  value: pendentes,  icon: Clock,     color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100" },
    { label: "Rejeitados",  value: rejeitados, icon: XCircle,   color: "text-red-600",    bg: "bg-red-50",    border: "border-red-100" },
    { label: "Total",       value: total,      icon: FileText,  color: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-100" },
  ];

  return (
    <PanelLayout userName={nomeUsuario} role="anunciante">
      {/* Views Hero Card */}
      <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-200 shadow-sm flex items-center gap-6 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-green-50 rounded-full opacity-50 transition-transform group-hover:scale-110" />
        <div className="w-14 h-14 rounded-xl flex-shrink-0 bg-green-100 border border-green-200 flex items-center justify-center text-green-600 relative z-10">
          <Eye size={28} strokeWidth={2} />
        </div>
        <div className="relative z-10">
          <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
            {totalViews.toLocaleString("pt-BR")}
          </div>
          <div className="text-slate-500 font-bold text-sm mt-1">visualizações totais nos seus anúncios</div>
        </div>
        <Link href="/painel/anuncios" className="ml-auto hidden md:inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-green-50 border border-green-200 text-green-700 font-bold text-sm hover:bg-green-600 hover:text-white transition-all relative z-10">
          Ver detalhes <ArrowRight size={14} />
        </Link>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-5 border shadow-sm ${s.border}`}>
            <div className={`w-10 h-10 rounded-lg ${s.bg} ${s.color} flex items-center justify-center mb-4`}>
              <s.icon size={20} strokeWidth={2.5} />
            </div>
            <div className={`text-3xl font-black tracking-tight ${s.color}`}>{s.value}</div>
            <div className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Ações Rápidas */}
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 px-1">Ações Rápidas</h3>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/painel/anuncios" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText size={24} />
          </div>
          <h4 className="text-slate-900 font-black text-lg mb-1">Meus anúncios</h4>
          <p className="text-slate-500 text-sm font-bold leading-relaxed mb-4">Gerencie status, fotos e visualize o desempenho.</p>
          <span className="inline-flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-wider">
            Acessar <ArrowRight size={14} />
          </span>
        </Link>

        <Link href="/painel/anuncios/novo/caminhao" className="bg-white rounded-2xl p-6 border border-green-200 shadow-sm hover:border-green-400 hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Truck size={24} />
          </div>
          <h4 className="text-slate-900 font-black text-lg mb-1">Anunciar caminhão</h4>
          <p className="text-slate-500 text-sm font-bold leading-relaxed mb-4">Venda seu caminhão rápido no maior marketplace.</p>
          <span className="inline-flex items-center gap-2 text-green-600 font-black text-xs uppercase tracking-wider">
            Começar <ArrowRight size={14} />
          </span>
        </Link>

        <Link href="/painel/anuncios/novo/implemento" className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm hover:border-purple-400 hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Package size={24} />
          </div>
          <h4 className="text-slate-900 font-black text-lg mb-1">Anunciar implemento</h4>
          <p className="text-slate-500 text-sm font-bold leading-relaxed mb-4">Carretas, baús, caçambas e diversos implementos.</p>
          <span className="inline-flex items-center gap-2 text-purple-600 font-black text-xs uppercase tracking-wider">
            Começar <ArrowRight size={14} />
          </span>
        </Link>
      </section>

      {/* Alertas */}
      <div className="space-y-3">
        {pendentes > 0 && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-4 items-start">
            <span className="text-xl">⏳</span>
            <p className="text-slate-600 text-sm font-bold leading-relaxed">
              Você tem <span className="text-amber-700 font-black">{pendentes} anúncio{pendentes > 1 ? "s" : ""}</span> aguardando aprovação pela nossa equipe.
            </p>
          </div>
        )}
        {total === 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
            <span className="text-3xl block mb-2">🚀</span>
            <h4 className="text-blue-900 font-black text-lg">Bem-vindo à plataforma!</h4>
            <p className="text-blue-700/70 font-bold mb-4">Crie seu primeiro anúncio agora e comece a vender.</p>
            <Link href="/painel/anuncios/novo" className="inline-flex h-12 px-8 items-center justify-center rounded-xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all">
              Criar meu primeiro anúncio
            </Link>
          </div>
        )}
      </div>
    </PanelLayout>
  );
}
