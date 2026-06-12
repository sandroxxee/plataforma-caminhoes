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
      title="Novo anúncio"
      subtitle="O que você quer anunciar?"
      badge="Novo anúncio"
      actions={<Link href="/painel/anuncios" className="nb-back">← Voltar</Link>}
    >
      <div className="nb-wrap">
        <Link href="/painel/anuncios/novo/caminhao" className="nb-btn">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="1" y="10" width="15" height="9" rx="2"/>
            <path d="M16 13h3l3 3v3h-6v-6z"/>
            <circle cx="5.5" cy="20.5" r="1.5"/>
            <circle cx="18.5" cy="20.5" r="1.5"/>
          </svg>
          Caminhão
          <small>Cavalo, truck, toco, 3/4, baú, tanque…</small>
        </Link>

        <Link href="/painel/anuncios/novo/implemento" className="nb-btn">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="2" y="8" width="20" height="10" rx="2"/>
            <circle cx="6" cy="20" r="2"/>
            <circle cx="18" cy="20" r="2"/>
            <path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
          </svg>
          Implemento
          <small>Carreta, caçamba, prancha, sider, dolly…</small>
        </Link>
      </div>

      <style>{`
        .nb-back {
          min-height: 40px; display: inline-flex; align-items: center;
          padding: 0 14px; border-radius: 12px;
          border: 1px solid #343a40; background: #2a2f34;
          color: #a7afb7; text-decoration: none; font-weight: 800; font-size: 13px;
          transition: color .15s;
        }
        .nb-back:hover { color: #e8eaed; }

        .nb-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .nb-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          padding: 28px 24px;
          border-radius: 20px;
          background: #1f2327;
          border: 1.5px solid #343a40;
          color: #f4f4f5;
          text-decoration: none;
          font-size: 22px;
          font-weight: 950;
          letter-spacing: -.035em;
          line-height: 1.1;
          transition: border-color .16s, background .16s, transform .16s;
        }
        .nb-btn:hover {
          border-color: #22c55e;
          background: #1a2420;
          transform: translateY(-2px);
        }
        .nb-btn svg { color: #22c55e; flex-shrink: 0; }
        .nb-btn small {
          display: block;
          font-size: 13px;
          font-weight: 750;
          color: #8f99a3;
          letter-spacing: 0;
          line-height: 1.45;
        }

        @media (max-width: 600px) {
          .nb-wrap { grid-template-columns: 1fr; }
          .nb-btn { padding: 22px 18px; font-size: 20px; }
        }
      `}</style>
    </PanelLayout>
  );
}
