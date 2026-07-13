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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "admin") {
    redirect("/admin/anuncios");
  }

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

  return (
    <PanelLayout role="anunciante">
      <div className="painel-wrap">

        {/* Greeting */}
        <div className="painel-greeting-block">
          <span className="painel-role-badge">Anunciante</span>
          <h1 className="painel-greeting">Olá, {nomeUsuario} 👋</h1>
        </div>

        {/* Views Hero */}
        <div className="painel-views-card">
          <div className="painel-views-icon">
            <Eye size={26} strokeWidth={2} />
          </div>
          <div>
            <div className="painel-views-number">{totalViews.toLocaleString("pt-BR")}</div>
            <div className="painel-views-label">visualizações totais nos seus anúncios</div>
          </div>
          <Link href="/painel/anuncios" className="painel-views-link">
            Ver detalhes <ArrowRight size={14} />
          </Link>
        </div>

        {/* Stats */}
        <div className="painel-stats">
          <div className="painel-stat">
            <div className="painel-stat-icon green"><FileText size={18} /></div>
            <div className="painel-stat-value green">{ativos}</div>
            <div className="painel-stat-label">Publicados</div>
          </div>
          <div className="painel-stat">
            <div className="painel-stat-icon amber"><Clock size={18} /></div>
            <div className="painel-stat-value amber">{pendentes}</div>
            <div className="painel-stat-label">Aguardando</div>
          </div>
          <div className="painel-stat">
            <div className="painel-stat-icon red"><XCircle size={18} /></div>
            <div className="painel-stat-value red">{rejeitados}</div>
            <div className="painel-stat-label">Rejeitados</div>
          </div>
          <div className="painel-stat">
            <div className="painel-stat-icon blue"><FileText size={18} /></div>
            <div className="painel-stat-value blue">{total}</div>
            <div className="painel-stat-label">Total</div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div>
          <p className="painel-section-title">Ações Rápidas</p>
          <div className="painel-acoes">
            <Link href="/painel/anuncios" className="painel-acao blue">
              <div className="painel-acao-icon blue"><FileText size={22} /></div>
              <h4 className="painel-acao-title">Meus anúncios</h4>
              <p className="painel-acao-desc">Gerencie status, fotos e visualize o desempenho.</p>
              <span className="painel-acao-cta blue">Acessar <ArrowRight size={13} /></span>
            </Link>
            <Link href="/painel/anuncios/novo/caminhao" className="painel-acao green">
              <div className="painel-acao-icon green"><Truck size={22} /></div>
              <h4 className="painel-acao-title">Anunciar caminhão</h4>
              <p className="painel-acao-desc">Venda seu caminhão rápido no maior marketplace.</p>
              <span className="painel-acao-cta green">Começar <ArrowRight size={13} /></span>
            </Link>
            <Link href="/painel/anuncios/novo/implemento" className="painel-acao purple">
              <div className="painel-acao-icon purple"><Package size={22} /></div>
              <h4 className="painel-acao-title">Anunciar implemento</h4>
              <p className="painel-acao-desc">Carretas, baús, caçambas e implementos.</p>
              <span className="painel-acao-cta purple">Começar <ArrowRight size={13} /></span>
            </Link>
          </div>
        </div>

        {/* Alertas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pendentes > 0 && (
            <div className="painel-alerta amber">
              <span className="painel-alerta-emoji">⏳</span>
              <p className="painel-alerta-text">
                Você tem <strong>{pendentes} anúncio{pendentes > 1 ? "s" : ""}</strong> aguardando aprovação.
              </p>
            </div>
          )}
          {total === 0 && (
            <div className="painel-alerta blue">
              <span style={{ fontSize: 36 }}>🚀</span>
              <h4 className="painel-alerta-title">Bem-vindo à plataforma!</h4>
              <p className="painel-alerta-sub">Crie seu primeiro anúncio e comece a vender.</p>
              <Link href="/painel/anuncios/novo" className="painel-alerta-btn">
                Criar meu primeiro anúncio
              </Link>
            </div>
          )}
        </div>

      </div>
    </PanelLayout>
  );
}
