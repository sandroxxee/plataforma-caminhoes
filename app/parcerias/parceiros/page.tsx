import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MapPin, Handshake } from "lucide-react";
import Link from "next/link";
import { ParceiroCard } from "./ParceiroCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Parceiros | Caminhões à Venda",
  description:
    "Revendas, lojas e empresas parceiras que apoiam a plataforma Caminhões à Venda. Peças, pneus, acessórios, manutenção e muito mais.",
  alternates: { canonical: "/parcerias/parceiros" },
};

const whatsappUrl =
  "https://wa.me/5549999362681?text=Ol%C3%A1%2C%20quero%20divulgar%20minha%20empresa%20na%20%C3%A1rea%20de%20parceiros%20do%20Caminh%C3%B5es%20%C3%A0%20Venda.";

type Parceiro = {
  id: string;
  nome: string;
  slug: string;
  cidade: string | null;
  estado: string | null;
  celular: string | null;
  telefone: string | null;
  logo_url: string | null;
  banner_url: string | null;
  instagram?: string | null;
  facebook?: string | null;
};

type TruckImage = { image_url: string; principal: boolean; ordem: number };
type Truck = { id: string; truck_images?: TruckImage[]; whatsapp?: string | null };

function onlyDigits(v: string | null) {
  return (v || "").replace(/\D/g, "");
}

function getThumbsForParceiro(trucks: Truck[], parceiro: Parceiro): string[] {
  const cel = onlyDigits(parceiro.celular);
  const tel = onlyDigits(parceiro.telefone);
  const matched = trucks.filter((t) => {
    const w = onlyDigits(t.whatsapp ?? null);
    return (cel && w.includes(cel)) || (tel && w.includes(tel));
  });
  const urls: string[] = [];
  for (const t of matched) {
    const sorted = [...(t.truck_images || [])].sort((a, b) =>
      a.principal ? -1 : b.principal ? 1 : (a.ordem ?? 0) - (b.ordem ?? 0)
    );
    for (const img of sorted) {
      if (img.image_url && urls.length < 8) urls.push(img.image_url);
    }
  }
  return urls;
}

export default async function ParceirosPage() {
  const supabase = await createClient();

  const [{ data: parceirosData }, { data: trucksData }] = await Promise.all([
    supabase
      .from("parceiros")
      .select("id,nome,slug,cidade,estado,celular,telefone,logo_url,banner_url,instagram,facebook")
      .eq("ativo", true)
      .order("created_at", { ascending: false }),
    supabase
      .from("trucks")
      .select("id,whatsapp,truck_images(image_url,principal,ordem)")
      .eq("status", "aprovado")
      .eq("vendido", false),
  ]);

  const parceiros = (parceirosData || []) as Parceiro[];
  const trucks = (trucksData || []) as Truck[];

  return (
    <main className="market-page" style={{ background: "var(--soft)" }}>
      <PublicHeader />

      {/* Hero compacto, mesmo padrão do site */}
      <section className="market-container" style={{ paddingTop: 28, paddingBottom: 20 }}>
        <div className="parceiros-hero">
          <div className="parceiros-hero-left">
            <span className="parceiros-hero-badge">
              <Handshake size={14} aria-hidden="true" />
              Empresas parceiras
            </span>
            <h1 className="parceiros-hero-title">Parceiros do Caminhões&nbsp;à&nbsp;Venda</h1>
            <p className="parceiros-hero-desc">
              Revendas, fornecedores e prestadores de serviço ligados ao mercado de caminhões,
              implementos e transporte pesado.
            </p>
            <div className="parceiros-hero-actions">
              <a className="btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
                Quero ser parceiro
              </a>
              <Link className="btn-secondary" href="/caminhoes">
                Ver anúncios
              </Link>
            </div>
          </div>

          {parceiros.length > 0 && (
            <div className="parceiros-hero-stat">
              <span className="parceiros-hero-num">{parceiros.length}</span>
              <span className="parceiros-hero-label">
                {parceiros.length === 1 ? "parceiro ativo" : "parceiros ativos"}
              </span>
              <p className="parceiros-hero-sublabel">
                Oficinas, autopeças, borracharias, pneus, guincho, seguros e muito mais.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Grid de parceiros */}
      <section className="market-container" style={{ paddingBottom: 56 }}>
        {parceiros.length === 0 ? (
          <div className="parceiros-empty">
            <Handshake size={40} style={{ opacity: 0.25 }} />
            <strong>Nenhum parceiro cadastrado ainda</strong>
            <p>Em breve revendas e empresas parceiras aparecerão aqui.</p>
            <a className="btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
              Quero ser o primeiro parceiro
            </a>
          </div>
        ) : (
          <div className="parceiros-grid">
            {parceiros.map((p) => (
              <ParceiroCard
                key={p.id}
                parceiro={p}
                thumbs={getThumbsForParceiro(trucks, p)}
              />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />

      <style>{`
        /* Hero */
        .parceiros-hero {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 28px;
          align-items: center;
          background: var(--surface);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 16px;
          padding: clamp(20px,3vw,36px);
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          margin-bottom: 20px;
        }
        body.public-theme-dark .parceiros-hero {
          border-color: rgba(255,255,255,0.06);
        }
        .parceiros-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          background: var(--blueSoft);
          color: var(--blue);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .parceiros-hero-title {
          margin: 14px 0 8px;
          font-size: clamp(24px, 3vw, 40px);
          line-height: 1.1;
          letter-spacing: -.03em;
          color: var(--text);
          font-weight: 900;
        }
        .parceiros-hero-desc {
          margin: 0;
          color: var(--muted);
          font-size: 15px;
          font-weight: 700;
          line-height: 1.6;
          max-width: 560px;
        }
        .parceiros-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }
        .parceiros-hero-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: var(--soft);
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: 14px;
          padding: 20px 28px;
          min-width: 140px;
        }
        .parceiros-hero-num {
          font-size: 52px;
          font-weight: 900;
          color: var(--blue);
          line-height: 1;
          letter-spacing: -0.04em;
        }
        .parceiros-hero-label {
          font-size: 13px;
          font-weight: 800;
          color: var(--text);
          margin-top: 6px;
        }
        .parceiros-hero-sublabel {
          font-size: 11px;
          font-weight: 700;
          color: var(--muted);
          margin: 8px 0 0;
          max-width: 160px;
          line-height: 1.5;
        }

        /* Grid */
        .parceiros-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 360px), 1fr));
          gap: 20px;
        }

        /* Empty */
        .parceiros-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 64px 24px;
          text-align: center;
          background: var(--surface);
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.06);
        }
        .parceiros-empty strong { font-size: 18px; font-weight: 900; color: var(--text); }
        .parceiros-empty p { margin: 0; color: var(--muted); font-weight: 700; max-width: 34ch; }

        @media (max-width: 720px) {
          .parceiros-hero { grid-template-columns: 1fr; }
          .parceiros-hero-stat { flex-direction: row; gap: 14px; text-align: left; min-width: 0; width: 100%; justify-content: flex-start; }
        }
      `}</style>
    </main>
  );
}
