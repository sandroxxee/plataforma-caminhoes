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
    title: `${dealer.name} | Caminhões à Venda`,
    description:
      dealer.description ||
      `${dealer.name}: espaço exclusivo no Caminhões à Venda para anúncios de caminhões e implementos.`,
    alternates: { canonical: `/revendas/${dealer.slug}` },
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
              color: "var(--blue)",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            ← Voltar para Revendas e Empresas
          </Link>

          <section
            style={{
              borderRadius: 28,
              overflow: "hidden",
              border: "1px solid var(--line)",
              background: "var(--surface)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                minHeight: 220,
                padding: "clamp(26px, 5vw, 46px)",
                display: "grid",
                alignContent: "end",
                background: dealer.cover_url
                  ? `linear-gradient(135deg, rgba(15, 23, 42, .78), rgba(15, 23, 42, .42)), url(${dealer.cover_url}) center / cover`
                  : "linear-gradient(135deg, #0f172a, #1e293b)",
                color: "#fff",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: "fit-content",
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
                {formatDealerType(dealer.type)}
              </span>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    width: 86,
                    height: 86,
                    borderRadius: 22,
                    display: "grid",
                    placeItems: "center",
                    overflow: "hidden",
                    background: "rgba(255, 255, 255, .95)",
                    color: "#0f172a",
                    fontWeight: 950,
                    fontSize: 32,
                    border: "1px solid rgba(255, 255, 255, .45)",
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

                <div>
                  <h1 style={{ margin: 0, fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.03 }}>
                    {dealer.name}
                  </h1>

                  <p style={{ margin: "10px 0 0", color: "rgba(226, 232, 240, .9)", fontSize: 18 }}>
                    {formatLocation(dealer)}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ padding: "clamp(20px, 4vw, 30px)", display: "grid", gap: 18 }}>
              {dealer.description ? (
                <p
                  style={{
                    margin: 0,
                    maxWidth: 920,
                    color: "var(--muted)",
                    fontSize: "clamp(16px, 2.2vw, 19px)",
                    lineHeight: 1.65,
                    fontWeight: 700,
                  }}
                >
                  {dealer.description}
                </p>
              ) : null}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
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
                      padding: "0 20px",
                      background: "#22c55e",
                      color: "#052e16",
                      fontWeight: 900,
                      textDecoration: "none",
                    }}
                  >
                    Chamar no WhatsApp
                  </a>
                ) : null}

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
            </div>
          </section>

          <section className="market-section" style={{ marginTop: 28 }}>
            <div className="market-section-head">
              <div>
                <span>Estoque da revenda</span>
                <h2>Anúncios deste anunciante</h2>
              </div>
              <Link href="/anuncios">Ver todos</Link>
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
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
