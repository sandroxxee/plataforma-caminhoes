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

        <Link href="/painel/anuncios/novo/carreta" className="nb-btn">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="1" y="9" width="22" height="9" rx="2"/>
            <circle cx="5" cy="20" r="2"/>
            <circle cx="12" cy="20" r="2"/>
            <circle cx="19" cy="20" r="2"/>
          </svg>
          Carreta
          <small>Graneleira, porta-contêiner, frigorífica, tanque…</small>
        </Link>

        <Link href="/painel/anuncios/novo/maquina" className="nb-btn">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
          </svg>
          Máquina
          <small>Escavadeira, motoniveladora, pá carregadeira, trator…</small>
        </Link>

        <Link href="/painel/anuncios/novo/peca" className="nb-btn">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
          Peça
          <small>Motor, câmbio, eixo, suspensão, elétrica…</small>
        </Link>
      </div>

      <style>{`
        .nb-back {
          min-height: 40px; display: inline-flex; align-items: center;
          padding: 0 14px; border-radius: 12px;
          border: 1px solid var(--line); background: var(--surface);
          color: var(--muted); text-decoration: none; font-weight: 800; font-size: 13px;
          transition: all .15s;
        }
        .nb-back:hover { background: var(--soft); color: var(--text); }

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
          background: var(--surface);
          border: 1px solid var(--line);
          color: var(--text);
          text-decoration: none;
          font-size: 22px;
          font-weight: 950;
          letter-spacing: -.035em;
          line-height: 1.1;
          transition: border-color .16s, background .16s, transform .16s;
          box-shadow: var(--shadow);
        }
        .nb-btn:hover {
          border-color: var(--blue);
          background: var(--blueSoft);
          transform: translateY(-2px);
        }
        .nb-btn svg { color: var(--blue); flex-shrink: 0; }
        .nb-btn small {
          display: block;
          font-size: 13px;
          font-weight: 750;
          color: var(--muted);
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
