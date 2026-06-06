import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";

const espacos = [
  {
    slug: "modelo-revenda",
    nome: "Espaço da Revenda",
    tipo: "Revenda de caminhões",
    cidade: "Cidade",
    estado: "UF",
    descricao:
      "Página exclusiva para apresentar a empresa, reunir os anúncios publicados e facilitar o contato direto com compradores interessados.",
    whatsapp: "5549999362681",
  },
];

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const espaco = espacos.find((item) => item.slug === slug);

  if (!espaco) {
    return {
      title: "Revenda não encontrada | Caminhões à Venda",
    };
  }

  return {
    title: `${espaco.nome} | Caminhões à Venda`,
    description: `${espaco.nome}: espaço exclusivo no Caminhões à Venda para anúncios de caminhões e implementos.`,
    alternates: { canonical: `/revendas/${espaco.slug}` },
  };
}

export default async function RevendaDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  const espaco = espacos.find((item) => item.slug === slug);

  if (!espaco) notFound();

  const mensagemWhatsapp = encodeURIComponent(
    `Olá, vim pelo Caminhões à Venda e quero falar sobre os anúncios de ${espaco.nome}.`
  );

  return (
    <main className="market-page">
      <PublicHeader />

      <div className="market-main">
        <section className="market-container" style={{ paddingTop: 42, paddingBottom: 56 }}>
          <Link
            href="/revendas"
            style={{
              display: "inline-flex",
              marginBottom: 18,
              color: "#2563eb",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            ← Voltar para Revendas e Empresas
          </Link>

          <section
            style={{
              borderRadius: 28,
              padding: "clamp(26px, 5vw, 46px)",
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
              color: "#fff",
              boxShadow: "0 24px 70px rgba(15, 23, 42, .22)",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                marginBottom: 16,
                borderRadius: 999,
                padding: "8px 14px",
                background: "rgba(34, 197, 94, .14)",
                color: "#bbf7d0",
                fontWeight: 900,
                fontSize: 13,
                textTransform: "uppercase",
                letterSpacing: ".04em",
              }}
            >
              {espaco.tipo}
            </span>

            <h1 style={{ margin: 0, fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.03 }}>
              {espaco.nome}
            </h1>

            <p style={{ margin: "12px 0 0", color: "rgba(226, 232, 240, .9)", fontSize: 18 }}>
              {espaco.cidade} - {espaco.estado}
            </p>

            <p
              style={{
                margin: "22px 0 0",
                maxWidth: 860,
                color: "rgba(226, 232, 240, .92)",
                fontSize: "clamp(17px, 2.4vw, 21px)",
                lineHeight: 1.6,
              }}
            >
              {espaco.descricao}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
              <a
                href={`https://wa.me/${espaco.whatsapp}?text=${mensagemWhatsapp}`}
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
                Chamar no WhatsApp
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
                Ver todos os anúncios
              </Link>
            </div>
          </section>

          <section
            style={{
              marginTop: 28,
              borderRadius: 24,
              padding: "clamp(22px, 4vw, 34px)",
              background: "rgba(255, 255, 255, .92)",
              border: "1px solid rgba(148, 163, 184, .22)",
              boxShadow: "0 18px 50px rgba(15, 23, 42, .08)",
            }}
          >
            <h2 style={{ margin: "0 0 12px", fontSize: "clamp(24px, 4vw, 34px)" }}>
              Anúncios deste anunciante
            </h2>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>
              Esta área está preparada para receber os anúncios reais vinculados a esta revenda,
              fábrica, lojista ou vendedor profissional. A conexão com o banco deve ser feita em uma
              etapa separada, preservando os anúncios atuais, aprovação, login e painel administrativo.
            </p>
          </section>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
