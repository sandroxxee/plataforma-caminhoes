import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Revendas e Empresas | Caminhões à Venda",
  description:
    "Espaços exclusivos para revendas, fábricas, lojistas e vendedores profissionais divulgarem caminhões e implementos dentro do Caminhões à Venda.",
  alternates: { canonical: "/revendas" },
};

type DealerSummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  city: string | null;
  state: string | null;
  type: string | null;
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

function formatDealerType(type: string | null) {
  const types: Record<string, string> = {
    revenda: "Revenda",
    lojista: "Lojista",
    fabrica_implementos: "Fábrica de implementos",
    vendedor: "Vendedor profissional",
    parceiro: "Parceiro",
  };

  return types[type || ""] || "Revenda";
}

function formatLocation(dealer: DealerSummary) {
  const city = (dealer.city || "").trim();
  const state = (dealer.state || "").trim();

  if (city && state) return `${city} - ${state}`;
  if (city) return city;
  if (state) return state;
  return "Localização não informada";
}

export default async function RevendasPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("dealers")
    .select("id, name, slug, description, logo_url, city, state, type")
    .eq("status", "ativo")
    .order("name", { ascending: true });

  const dealers = error ? [] : ((data || []) as DealerSummary[]);

  return (
    <main className="market-page">
      <PublicHeader />

      <div className="market-main">
        <section className="market-container" style={{ paddingTop: 42, paddingBottom: 56 }}>
          <div
            style={{
              display: "grid",
              gap: 28,
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
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
                background: "var(--surface)",
                border: "1px solid var(--line)",
                boxShadow: "var(--shadow)",
              }}
            >
              <strong style={{ display: "block", fontSize: 22, marginBottom: 12 }}>
                Como fica para a empresa?
              </strong>
              <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
                A empresa pode ter uma página própria dentro do Caminhões à Venda, com nome,
                descrição, WhatsApp e anúncios organizados em um único endereço.
              </p>

              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  borderRadius: 18,
                  background: "var(--soft)",
                  border: "1px solid var(--line)",
                  color: "var(--text)",
                  fontWeight: 800,
                  lineHeight: 1.5,
                  overflowWrap: "anywhere",
                }}
              >
                Exemplo: caminhoesavenda.com.br/revendas/nome-da-revenda
              </div>
            </aside>
          </div>

          <section className="market-section" style={{ marginTop: 28 }} aria-label="Revendas ativas">
            <div className="market-section-head">
              <div>
                <span>Revendas ativas</span>
                <h2>Espaços disponíveis no site</h2>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              {dealers.length > 0 ? (
                dealers.map((dealer) => (
                  <article
                    key={dealer.id}
                    style={{
                      minHeight: "100%",
                      display: "grid",
                      gap: 14,
                      alignContent: "space-between",
                      borderRadius: 18,
                      padding: 18,
                      background: "var(--soft)",
                      border: "1px solid var(--line)",
                    }}
                  >
                    <div style={{ display: "grid", gap: 10 }}>
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 18,
                          display: "grid",
                          placeItems: "center",
                          overflow: "hidden",
                          background: "var(--surface)",
                          border: "1px solid var(--line)",
                          color: "var(--blue)",
                          fontWeight: 950,
                          fontSize: 24,
                        }}
                      >
                        {dealer.logo_url ? (
                          <img
                            src={dealer.logo_url}
                            alt={`Logo ${dealer.name}`}
                            style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }}
                          />
                        ) : (
                          dealer.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      <span className="stock-eyebrow">{formatDealerType(dealer.type)}</span>
                      <h3 style={{ margin: 0, fontSize: 22, lineHeight: 1.1 }}>{dealer.name}</h3>
                      <p style={{ margin: 0, color: "var(--muted)", fontWeight: 800 }}>
                        {formatLocation(dealer)}
                      </p>
                      {dealer.description ? (
                        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55 }}>
                          {dealer.description}
                        </p>
                      ) : null}
                    </div>

                    <Link className="trust-btn primary" href={`/revendas/${dealer.slug}`}>
                      Ver espaço
                    </Link>
                  </article>
                ))
              ) : (
                <div className="market-empty">
                  Nenhuma revenda ativa disponível no momento.
                </div>
              )}
            </div>
          </section>

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
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  <h2 style={{ margin: "0 0 10px", fontSize: 21 }}>{item.titulo}</h2>
                  <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.65 }}>{item.texto}</p>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
