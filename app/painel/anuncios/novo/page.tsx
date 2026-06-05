import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelLayout } from "@/components/PanelLayout";

export const dynamic = "force-dynamic";

export default async function NovoAnuncioPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <PanelLayout
      title="Cadastrar novo anúncio"
      subtitle="Escolha o tipo de anúncio antes de preencher. Caminhão e implemento agora ficam separados para evitar cadastro errado."
      badge="Novo anúncio"
      actions={<Link href="/painel/anuncios" className="secondary-button">Voltar aos anúncios</Link>}
    >
      <section className="choose-wrap">
        <Link href="/painel/anuncios/novo/caminhao" className="choose-card">
          <span className="choose-badge">01</span>
          <div>
            <strong>Anunciar caminhão</strong>
            <p>Cavalo mecânico, truck, toco, 3/4, basculante, baú, tanque, munck e outros caminhões.</p>
            <small>Usa marca, modelo, ano, carroceria, tração, valor, cidade, WhatsApp, descrição e fotos.</small>
          </div>
        </Link>

        <Link href="/painel/anuncios/novo/implemento" className="choose-card">
          <span className="choose-badge">02</span>
          <div>
            <strong>Anunciar implemento</strong>
            <p>Carreta, caçamba, bi-caçamba, bitrem, prancha, tanque, baú, sider, dolly e outros implementos.</p>
            <small>Usa tipo, marca, modelo, ano, eixos, composição, pneus, suspensão, conservação, valor e fotos.</small>
          </div>
        </Link>
      </section>

      <div className="safe-note">
        <strong>Importante:</strong>
        <span>Depois de enviado, o anúncio continua pendente até aprovação do administrador.</span>
      </div>

      <style>{`
        .secondary-button { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; padding: 0 14px; border-radius: 14px; border: 1px solid #343a40; background: #2a2f34; color: #e8eaed; text-decoration: none; font-weight: 900; }
        .choose-wrap { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
        .choose-card { min-height: 220px; padding: 24px; border-radius: 24px; background: #1f2327; border: 1px solid #343a40; box-shadow: 0 16px 34px rgba(0,0,0,.18); color: #e8eaed; text-decoration: none; display: grid; gap: 18px; align-content: start; transition: transform .18s ease, border-color .18s ease, background .18s ease; }
        .choose-card:hover { transform: translateY(-2px); border-color: #22c55e; background: #20272b; }
        .choose-badge { width: 44px; height: 44px; border-radius: 15px; display: grid; place-items: center; background: #22c55e; color: #06140b; font-weight: 950; }
        .choose-card strong { display: block; margin-bottom: 10px; color: #f4f4f5; font-size: 25px; line-height: 1.05; letter-spacing: -.04em; }
        .choose-card p { margin: 0 0 14px; color: #cbd5df; line-height: 1.5; font-weight: 800; }
        .choose-card small { display: block; color: #8f99a3; line-height: 1.5; font-weight: 750; }
        .safe-note { margin-top: 18px; padding: 16px 18px; border-radius: 20px; background: #15181b; border: 1px solid #343a40; color: #a7afb7; display: flex; gap: 8px; flex-wrap: wrap; }
        .safe-note strong { color: #22c55e; }
        @media (max-width: 860px) { .choose-wrap { grid-template-columns: 1fr; } .choose-card { min-height: auto; } }
        @media (max-width: 560px) { .choose-card { padding: 20px; border-radius: 22px; } .choose-card strong { font-size: 22px; } .secondary-button { width: 100%; } }
      `}</style>
    </PanelLayout>
  );
}
