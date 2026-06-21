import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";

type Dealer = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  city: string | null;
  state: string | null;
  whatsapp: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  address: string | null;
  type: string | null;
  status: string | null;
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDealerType(type: string | null) {
  const types: Record<string, string> = {
    revenda: "Revenda de caminhões",
    lojista: "Lojista",
    fabrica_implementos: "Fábrica de implementos",
    vendedor: "Vendedor profissional",
    parceiro: "Parceiro",
  };

  return types[type || ""] || "Revenda de caminhões";
}

function formatLocation(dealer: Dealer) {
  const city = (dealer.city || "").trim();
  const state = (dealer.state || "").trim();

  if (city && state) return `${city} - ${state}`;
  if (city) return city;
  if (state) return state;
  return "Localização não informada";
}

function onlyDigits(value: string | null) {
  return (value || "").replace(/\D/g, "");
}

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

async function getActiveDealer(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("dealers")
    .select(
      "id, name, slug, description, logo_url, cover_url, city, state, whatsapp, phone, website, instagram, address, type, status"
    )
    .eq("slug", slug)
    .eq("status", "ativo")
    .maybeSingle();

  if (error || !data) return null;

  return data as Dealer;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dealer = await getActiveDealer(slug);

  if (!dealer) {
    return {
      title: "Revenda não encontrada | Caminhões à Venda",
    };
  }

  return {
    title: `Estoque ${dealer.name} | Caminhões à Venda`,
    description:
      dealer.description ||
      `Veja os anúncios de ${dealer.name} no Caminhões à Venda, com caminhões e implementos disponíveis para contato direto.`,
    alternates: { canonical: `/parcerias/revendas/${dealer.slug}` },
  };
}

export default async function RevendaDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  const dealer = await getActiveDealer(slug);

  if (!dealer) notFound();

  const supabase = await createClient();

  const { data } = await supabase
    .from("trucks")
    .select(`
      id,
      titulo,
      marca,
      modelo,
      ano_modelo,
      ano_fabricacao,
      preco,
      cidade,
      estado,
      carroceria,
      tracao,
      whatsapp,
      truck_images (
        image_url,
        principal,
        ordem
      )
    `)
    .eq("dealer_id", dealer.id)
    .eq("status", "aprovado")
    .eq("vendido", false)
    .order("created_at", { ascending: false });

  const trucks = (data || []) as TruckCardData[];
  const whatsapp = onlyDigits(dealer.whatsapp || dealer.phone);
  const mensagemWhatsapp = encodeURIComponent(
    `Olá, vim pelo Caminhões à Venda e quero falar sobre os anúncios de ${dealer.name}.`
  );
  const totalText = `${trucks.length} ${pluralize(trucks.length, "anúncio disponível", "anúncios disponíveis")}`;

  return (
    <main className="market-page">
      <PublicHeader />

      <div className="market-main">
        <section className="market-container" style={{ paddingTop: 18, paddingBottom: 56 }}>
          <Link
            href="/parcerias/revendas"
            style={{
              display: "inline-flex",
              marginBottom: 14,
              color: "var(--blue)",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            ← Outras revendas
          </Link>

          <section
            style={{
              borderRadius: 28,
              overflow: "hidden",
              border: "1px solid var(--line)",
              background: dealer.cover_url
                ? `linear-gradient(135deg, rgba(15, 23, 42, .9), rgba(15, 23, 42, .66)), url(${dealer.cover_url}) center / cover`
                : "linear-gradient(135deg, #0f172a, #1e293b)",
              color: "#fff",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 22,
                gridTemplateColumns: "minmax(0, 1.3fr) minmax(260px, .7fr)",
                alignItems: "end",
                padding: "clamp(22px, 5vw, 44px)",
              }}
            >
              <div style={{ display: "grid", gap: 16 }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 78,
                      height: 78,
                      borderRadius: 22,
                      display: "grid",
                      placeItems: "center",
                      overflow: "hidden",
                      background: "rgba(255, 255, 255, .95)",
                      color: "#0f172a",
                      fontWeight: 950,
                      fontSize: 30,
                      border: "1px solid rgba(255, 255, 255, .45)",
                      flex: "0 0 auto",
                    }}
                  >
                    {dealer.logo_url ? (
                      <img
                        src={dealer.logo_url}
                        alt={`Logo ${dealer.name}`}
                        style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }}
                      />
                    ) : (
                      dealer.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        width: "fit-content",
                        marginBottom: 8,
                        borderRadius: 999,
                        padding: "7px 12px",
                        background: "rgba(34, 197, 94, .14)",
                        color: "#bbf7d0",
                        fontWeight: 900,
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: ".04em",
                      }}
                    >
                      {formatDealerType(dealer.type)}
                    </span>

                    <h1 style={{ margin: 0, fontSize: "clamp(32px, 6vw, 58px)", lineHeight: 1.02 }}>
                      Estoque {dealer.name}
                    </h1>
                    <p style={{ margin: "8px 0 0", color: "rgba(226, 232, 240, .9)", fontSize: 17, fontWeight: 800 }}>
                      {formatLocation(dealer)} • {totalText}
                    </p>
                  </div>
                </div>

                <p
                  style={{
                    margin: 0,
                    maxWidth: 900,
                    color: "rgba(226, 232, 240, .9)",
                    fontSize: "clamp(16px, 2.2vw, 20px)",
                    lineHeight: 1.55,
                    fontWeight: 700,
                  }}
                >
                  Caminhões e implementos anunciados por esta loja dentro do Caminhões à Venda, com contato direto pelo WhatsApp.
                </p>
              </div>

              <aside
                style={{
                  display: "grid",
                  gap: 12,
                  padding: 18,
                  borderRadius: 22,
                  background: "rgba(255, 255, 255, .1)",
                  border: "1px solid rgba(255, 255, 255, .18)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <strong style={{ fontSize: 22, lineHeight: 1.1 }}>{dealer.name}</strong>
                <span style={{ color: "rgba(226, 232, 240, .9)", fontWeight: 800 }}>
                  {formatLocation(dealer)}
                </span>

                {whatsapp ? (
                  <a
                    href={`https://wa.me/${whatsapp}?text=${mensagemWhatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      minHeight: 48,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 14,
                      padding: "0 18px",
                      background: "#22c55e",
                      color: "#052e16",
                      fontWeight: 950,
                      textDecoration: "none",
                    }}
                  >
                    Chamar a loja no WhatsApp
                  </a>
                ) : null}
              </aside>
            </div>
          </section>

          <section className="market-section" style={{ marginTop: 18 }}>
            <div className="market-section-head">
              <div>
                <span>À venda nesta loja</span>
                <h2>Anúncios disponíveis</h2>
              </div>
              <p className="stock-count" style={{ margin: 0 }}>{totalText}</p>
            </div>

            <div className="market-grid">
              {trucks.length > 0 ? (
                trucks.map((truck) => <TruckCard key={truck.id} truck={truck} />)
              ) : (
                <div className="market-empty">
                  Nenhum anúncio aprovado vinculado a esta revenda no momento.
                </div>
              )}
            </div>
          </section>

          <section
            className="market-section"
            style={{
              marginTop: 18,
              display: "grid",
              gap: 14,
            }}
          >
            <div className="market-section-head" style={{ marginBottom: 0 }}>
              <div>
                <span>Sobre a loja</span>
                <h2>Informações da revenda</h2>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              <div style={{ padding: 16, borderRadius: 16, background: "var(--soft)", border: "1px solid var(--line)" }}>
                <strong>Tipo</strong>
                <p style={{ margin: "6px 0 0", color: "var(--muted)", fontWeight: 800 }}>{formatDealerType(dealer.type)}</p>
              </div>
              <div style={{ padding: 16, borderRadius: 16, background: "var(--soft)", border: "1px solid var(--line)" }}>
                <strong>Localização</strong>
                <p style={{ margin: "6px 0 0", color: "var(--muted)", fontWeight: 800 }}>{formatLocation(dealer)}</p>
              </div>
              <div style={{ padding: 16, borderRadius: 16, background: "var(--soft)", border: "1px solid var(--line)" }}>
                <strong>Contato</strong>
                <p style={{ margin: "6px 0 0", color: "var(--muted)", fontWeight: 800 }}>
                  {whatsapp ? "WhatsApp disponível" : "Contato não informado"}
                </p>
              </div>
            </div>

            {dealer.description ? (
              <p
                style={{
                  margin: 0,
                  color: "var(--muted)",
                  fontSize: 16,
                  lineHeight: 1.65,
                  fontWeight: 700,
                }}
              >
                {dealer.description}
              </p>
            ) : null}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {dealer.website ? (
                <a className="trust-btn ghost" href={dealer.website} target="_blank" rel="noreferrer">
                  Site da empresa
                </a>
              ) : null}

              {dealer.instagram ? (
                <a className="trust-btn ghost" href={dealer.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              ) : null}
            </div>
          </section>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
