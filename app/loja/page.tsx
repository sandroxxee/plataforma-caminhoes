import type { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingBag,
  MapPin,
  Phone,
  Star,
  Wrench,
  Truck,
  Package,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Loja | Caminhões à Venda",
  description:
    "Vitrine de produtos e serviços de empresas que apoiam a plataforma Caminhões à Venda. Peças, pneus, acessórios, manutenção e muito mais.",
  alternates: { canonical: "/loja" },
};

const whatsappUrl =
  "https://wa.me/5549999362681?text=Ol%C3%A1%2C%20quero%20divulgar%20minha%20loja%20ou%20empresa%20na%20vitrine%20do%20Caminh%C3%B5es%20%C3%A0%20Venda.";

const categorias = [
  "Peças e autopeças",
  "Pneus e borracharia",
  "Acessórios",
  "Ferramentas",
  "Óleo e lubrificantes",
  "Suspensão e freios",
  "Iluminação",
  "Rastreamento",
  "Higiene e estética",
  "Elétrica diesel",
  "Implementos",
  "EPIs e segurança",
];

const destaques = [
  {
    nome: "Peças e manutenção",
    texto:
      "Lojas de autopeças, motores, câmbio, diferencial, freios e tudo que mantém o caminhão rodando com segurança.",
    icon: Wrench,
  },
  {
    nome: "Acessórios e equipamentos",
    texto:
      "Produtos para personalizar, equipar e proteger o veículo. Iluminação, coberturas, caixas de carga e muito mais.",
    icon: Package,
  },
  {
    nome: "Serviços para o setor",
    texto:
      "Empresas especializadas em transporte pesado: rastreamento, seguro de carga, financiamento e revisões técnicas.",
    icon: Truck,
  },
];

export default function LojaPage() {
  return (
    <main className="market-page">
      <PublicHeader />

      <div className="market-main">
        {/* Hero */}
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                gap: 28,
                alignItems: "center",
              }}
            >
              {/* Texto principal */}
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
                  <ShoppingBag size={16} aria-hidden="true" />
                  Apoiadores e parceiros comerciais
                </span>

                <h1
                  style={{
                    marginTop: 18,
                    fontSize: "clamp(32px, 5vw, 58px)",
                    lineHeight: 1.02,
                    color: "white",
                  }}
                >
                  Loja do Caminhões à Venda
                </h1>

                <p
                  style={{
                    marginTop: 16,
                    color: "rgba(226,232,240,0.9)",
                    fontSize: 18,
                    lineHeight: 1.6,
                    maxWidth: 680,
                  }}
                >
                  Vitrine de produtos, serviços e empresas que apoiam a plataforma. Aqui você encontra
                  fornecedores confiáveis para o mercado de caminhões, implementos e transporte pesado.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
                  <a className="btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
                    Quero divulgar minha loja
                  </a>
                  <Link className="btn-secondary" href="/parceiros">
                    Ver parceiros
                  </Link>
                </div>
              </div>

              {/* Grid de categorias */}
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
                  Categorias disponíveis
                </strong>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 10,
                  }}
                >
                  {categorias.map((item) => (
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

        {/* Cards de destaque */}
        <section className="market-container" style={{ paddingTop: 16, paddingBottom: 18 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
              gap: 16,
            }}
          >
            {destaques.map((item) => {
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

        {/* Placeholder de produtos / em breve */}
        <section className="market-container" style={{ paddingTop: 8, paddingBottom: 18 }}>
          <div
            style={{
              border: "1px solid var(--line)",
              borderRadius: 24,
              padding: "clamp(28px, 4vw, 44px)",
              background: "var(--card)",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: 18,
                background: "rgba(34,197,94,0.12)",
                color: "var(--primary)",
                marginBottom: 18,
              }}
            >
              <Star size={28} aria-hidden="true" />
            </span>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", marginBottom: 12 }}>
              Produtos em breve
            </h2>
            <p
              style={{
                color: "var(--muted)",
                lineHeight: 1.7,
                maxWidth: 560,
                margin: "0 auto 24px",
                fontSize: 16,
              }}
            >
              Estamos construindo a vitrine de produtos e serviços parceiros. Se você tem uma loja ou empresa
              e quer aparecer aqui, entre em contato agora pelo WhatsApp.
            </p>
            <a className="btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
              Quero aparecer na loja
            </a>
          </div>
        </section>

        {/* Bottom CTA */}
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
              <BadgeCheck size={28} aria-hidden="true" />
              <h2 style={{ marginTop: 14, fontSize: 24 }}>Empresas verificadas</h2>
              <p style={{ marginTop: 10, color: "var(--muted)", lineHeight: 1.65 }}>
                Só divulgamos empresas que atendem o mercado pesado e foram analisadas pela nossa equipe.
                Seu cliente encontra fornecedores confiáveis.
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
              <h2 style={{ marginTop: 14, fontSize: 24 }}>Alcance regional e nacional</h2>
              <p style={{ marginTop: 10, color: "var(--muted)", lineHeight: 1.65 }}>
                Apareça para compradores, vendedores e motoristas de todo o Brasil que acessam o Caminhões à Venda
                diariamente em busca de veículos e serviços.
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
              <h2 style={{ marginTop: 14, fontSize: 24 }}>Cadastre sua loja agora</h2>
              <p style={{ marginTop: 10, color: "var(--muted)", lineHeight: 1.65 }}>
                O primeiro contato é direto pelo WhatsApp. Nossa equipe responde rápido e te explica como
                sua empresa pode aparecer na vitrine.
              </p>
              <a
                className="btn-primary"
                style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8 }}
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
              >
                Chamar no WhatsApp
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </article>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
