import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Revendas e Empresas | Caminhões à Venda",
  description:
    "Espaços exclusivos para revendas, fábricas, lojistas e vendedores profissionais divulgarem caminhões e implementos dentro do Caminhões à Venda.",
  alternates: { canonical: "/revendas" },
};

const tiposDeEspaco = [
  {
    titulo: "Revendas de caminhões",
    texto:
      "Uma vitrine própria para organizar o estoque da revenda, divulgar caminhões disponíveis e facilitar o contato direto com compradores.",
  },
  {
    titulo: "Fábricas de implementos",
    texto:
      "Espaço para fabricantes divulgarem carretas, caçambas, pranchas, graneleiros, tanques, baús e outros implementos.",
  },
  {
    titulo: "Lojistas e empresas do setor",
    texto:
      "Área para empresas ligadas ao transporte apresentarem produtos, serviços e soluções para quem trabalha com caminhões.",
  },
  {
    titulo: "Vendedores profissionais",
    texto:
      "Página exclusiva para vendedores que trabalham com vários anúncios e precisam mostrar seus veículos em um só endereço.",
  },
];

const mensagemWhatsapp = encodeURIComponent(
  "Olá, quero criar um espaço exclusivo para minha revenda, fábrica ou empresa no Caminhões à Venda."
);

export default function RevendasPage() {
  return (
    <main className="market-page">
      <PublicHeader />

      <div className="market-main">
        <section className="market-container" style={{ paddingTop: 42, paddingBottom: 56 }}>
          <div
            style={{
              display: "grid",
              gap: 28,
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, .8fr)",
              alignItems: "stretch",
            }}
          >
            <div
              style={{
                border: "1px solid rgba(148, 163, 184, .24)",
                borderRadius: 28,
                padding: "clamp(26px, 5vw, 48px)",
                background:
                  "linear-gradient(135deg, rgba(15, 23, 42, .96), rgba(30, 41, 59, .9))",
                color: "#fff",
                boxShadow: "0 24px 70px rgba(15, 23, 42, .22)",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  marginBottom: 18,
                  borderRadius: 999,
                  padding: "8px 14px",
                  background: "rgba(34, 197, 94, .14)",
                  color: "#bbf7d0",
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                }}
              >
                Espaço exclusivo dentro do site
              </span>

              <h1 style={{ margin: 0, fontSize: "clamp(32px, 6vw, 58px)", lineHeight: 1.02 }}>
                Revendas e Empresas
              </h1>

              <p
                style={{
                  margin: "18px 0 0",
                  maxWidth: 760,
                  color: "rgba(226, 232, 240, .92)",
                  fontSize: "clamp(17px, 2.5vw, 21px)",
                  lineHeight: 1.55,
                }}
              >
                Espaços exclusivos para revendas, fábricas, lojistas e vendedores divulgarem
                seus caminhões, implementos e estoque dentro do Caminhões à Venda.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
                <a
                  href={`https://wa.me/5549999362681?text=${mensagemWhatsapp}`}
                  style={{
                    minHeight: 48,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 14,
                    padding: "0 20px",
                    background: "#22c55e",
                    color: "#052e16",
                    fontWeight: 900,
                    textDecoration: "none",
                  }}
                >
                  Quero meu espaço exclusivo
                </a>

                <Link
                  href="/anuncios"
                  style={{
                    minHeight: 48,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 14,
                    padding: "0 20px",
                    background: "rgba(255, 255, 255, .1)",
                    color: "#fff",
                    fontWeight: 800,
                    textDecoration: "none",
                    border: "1px solid rgba(255, 255, 255, .18)",
                  }}
                >
                  Ver anúncios do site
                </Link>
              </div>
            </div>

            <aside
              style={{
                borderRadius: 28,
                padding: 26,
                background: "rgba(255, 255, 255, .92)",
                border: "1px solid rgba(148, 163, 184, .22)",
                boxShadow: "0 18px 50px rgba(15, 23, 42, .1)",
              }}
            >
              <strong style={{ display: "block", fontSize: 22, marginBottom: 12 }}>
                Como fica para a empresa?
              </strong>
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>
                A empresa pode ter uma página própria dentro do Caminhões à Venda, com nome,
                descrição, WhatsApp e anúncios organizados em um único endereço.
              </p>

              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  borderRadius: 18,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  color: "#0f172a",
                  fontWeight: 800,
                  lineHeight: 1.5,
                }}
              >
                Exemplo: caminhõesavenda.com.br/revendas/nome-da-revenda
              </div>
            </aside>
          </div>

          <section style={{ marginTop: 28 }} aria-label="Tipos de espaços exclusivos">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                gap: 18,
              }}
            >
              {tiposDeEspaco.map((item) => (
                <article
                  key={item.titulo}
                  style={{
                    borderRadius: 22,
                    padding: 22,
                    background: "rgba(255, 255, 255, .92)",
                    border: "1px solid rgba(148, 163, 184, .22)",
                    boxShadow: "0 14px 34px rgba(15, 23, 42, .08)",
                  }}
                >
                  <h2 style={{ margin: "0 0 10px", fontSize: 21 }}>{item.titulo}</h2>
                  <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>{item.texto}</p>
                </article>
              ))}
            </div>
          </section>

          <section
            style={{
              marginTop: 28,
              borderRadius: 24,
              padding: "clamp(22px, 4vw, 34px)",
              background: "#0f172a",
              color: "#fff",
              display: "grid",
              gap: 16,
            }}
          >
            <h2 style={{ margin: 0, fontSize: "clamp(24px, 4vw, 34px)" }}>
              Um endereço para divulgar o estoque da empresa
            </h2>
            <p style={{ margin: 0, maxWidth: 920, color: "rgba(226, 232, 240, .9)", lineHeight: 1.7 }}>
              A ideia é simples: cada revenda, fábrica, lojista ou vendedor profissional pode ter
              uma vitrine própria, sem misturar tudo em uma página solta. O comprador entra, vê
              quem está anunciando e acessa os anúncios daquele anunciante.
            </p>
          </section>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
