import type { Metadata } from "next";
import Link from "next/link";
import { Handshake, MapPin, Megaphone, Phone, ShieldCheck, Star, Wrench } from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Parceiros | Caminhões à Venda",
  description:
    "Espaço para empresas parceiras, patrocinadores e prestadores de serviço ligados ao mercado de caminhões, implementos e transporte pesado.",
  alternates: { canonical: "/parceiros" },
};

const whatsappUrl =
  "https://wa.me/5549999362681?text=Ol%C3%A1%2C%20quero%20divulgar%20minha%20empresa%20na%20%C3%A1rea%20de%20parceiros%20do%20Caminh%C3%B5es%20%C3%A0%20Venda.";

const segmentos = [
  "Oficinas mecânicas",
  "Autopeças",
  "Borracharias",
  "Pneus",
  "Guincho pesado",
  "Despachantes",
  "Seguros",
  "Financiamento",
  "Rastreamento",
  "Elétrica diesel",
  "Implementos rodoviários",
  "Lavagem e estética",
];

const exemplos = [
  {
    nome: "Oficinas e manutenção",
    texto:
      "Espaço para empresas que atendem caminhões, motores, câmbio, diferencial, elétrica, injeção diesel e serviços pesados.",
    icon: Wrench,
  },
  {
    nome: "Peças, pneus e acessórios",
    texto:
      "Divulgação para autopeças, lojas de pneus, borracharias, acessórios, iluminação, suspensão e itens para estrada.",
    icon: Star,
  },
  {
    nome: "Serviços para negociação",
    texto:
      "Despachantes, seguros, financiamento, vistoria, rastreamento e empresas que ajudam comprador e anunciante no processo.",
    icon: ShieldCheck,
  },
];

export default function ParceirosPage() {
  return (
    <main className="market-page">
      <PublicHeader />

      <div className="market-main">
        <section className="market-container" style={{ paddingTop: 34, paddingBottom: 22 }}>
          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: 28,
              padding: "clamp(24px, 5vw, 48px)",
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(15,23,42,0.92) 48%, rgba(2,6,23,0.98))",
              boxShadow: "var(--shadow)",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 28, alignItems: "center" }}>
              <div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 999,
                    border: "1px solid rgba(34,197,94,0.35)",
                    color: "#bbf7d0",
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  <Handshake size={16} aria-hidden="true" />
                  Empresas do nicho pesado
                </span>

                <h1 style={{ marginTop: 18, fontSize: "clamp(32px, 5vw, 58px)", lineHeight: 1.02, color: "white" }}>
                  Parceiros do Caminhões à Venda
                </h1>

                <p style={{ marginTop: 16, color: "rgba(226,232,240,0.9)", fontSize: 18, lineHeight: 1.6, maxWidth: 680 }}>
                  Um espaço para divulgar empresas, patrocinadores e serviços ligados ao mercado de caminhões,
                  implementos, transporte pesado e estrada.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
                  <a className="btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
                    Quero divulgar minha empresa
                  </a>
                  <Link className="btn-secondary" href="/anuncios">
                    Ver anúncios do site
                  </Link>
                </div>
              </div>

              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 24,
                  padding: 22,
                  background: "rgba(15,23,42,0.72)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <strong style={{ display: "block", color: "white", fontSize: 20, marginBottom: 14 }}>
                  Ideal para quem atende o setor
                </strong>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                  {segmentos.map((item) => (
                    <span
                      key={item}
                      style={{
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 14,
                        padding: "10px 12px",
                        color: "rgba(226,232,240,0.9)",
                        background: "rgba(255,255,255,0.04)",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="market-container" style={{ paddingTop: 16, paddingBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 16 }}>
            {exemplos.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.nome}
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: 22,
                    padding: 22,
                    background: "var(--card)",
                    boxShadow: "var(--soft-shadow)",
                  }}
                >
                  <span
                    style={{
                      width: 42,
                      height: 42,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 14,
                      background: "rgba(34,197,94,0.13)",
                      color: "var(--primary)",
                      marginBottom: 14,
                    }}
                  >
                    <Icon size={21} aria-hidden="true" />
                  </span>
                  <h2 style={{ fontSize: 20, marginBottom: 8 }}>{item.nome}</h2>
                  <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{item.texto}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="market-container" style={{ paddingTop: 18, paddingBottom: 42 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: 18,
              alignItems: "stretch",
            }}
          >
            <article
              style={{
                border: "1px solid var(--line)",
                borderRadius: 24,
                padding: 24,
                background: "var(--card)",
              }}
            >
              <Megaphone size={28} aria-hidden="true" />
              <h2 style={{ marginTop: 14, fontSize: 24 }}>Divulgação direta para o público certo</h2>
              <p style={{ marginTop: 10, color: "var(--muted)", lineHeight: 1.65 }}>
                A página de parceiros foi criada para empresas que querem aparecer dentro de um ambiente voltado ao
                mercado de caminhões, implementos e transporte pesado.
              </p>
            </article>

            <article
              style={{
                border: "1px solid var(--line)",
                borderRadius: 24,
                padding: 24,
                background: "var(--card)",
              }}
            >
              <MapPin size={28} aria-hidden="true" />
              <h2 style={{ marginTop: 14, fontSize: 24 }}>Serviços por cidade e região</h2>
              <p style={{ marginTop: 10, color: "var(--muted)", lineHeight: 1.65 }}>
                O espaço pode destacar empresas regionais que atendem compradores, vendedores, motoristas,
                transportadores e proprietários de caminhões.
              </p>
            </article>

            <article
              style={{
                border: "1px solid rgba(34,197,94,0.35)",
                borderRadius: 24,
                padding: 24,
                background: "linear-gradient(135deg, rgba(34,197,94,0.12), var(--card))",
              }}
            >
              <Phone size={28} aria-hidden="true" />
              <h2 style={{ marginTop: 14, fontSize: 24 }}>Atendimento pelo WhatsApp</h2>
              <p style={{ marginTop: 10, color: "var(--muted)", lineHeight: 1.65 }}>
                Para divulgar uma empresa, o primeiro contato é feito direto pelo WhatsApp do Caminhões à Venda.
              </p>
              <a className="btn-primary" style={{ marginTop: 18 }} href={whatsappUrl} target="_blank" rel="noreferrer">
                Chamar no WhatsApp
              </a>
            </article>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
