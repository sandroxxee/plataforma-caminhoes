import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createClient } from "@/lib/supabase/server";
import { TruckCard, type TruckCardData } from "@/components/theme/TruckCard";
import { MapPin, Phone, ShoppingBag, Handshake } from "lucide-react";

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
  instagram: string | null;
  facebook: string | null;
  ativo: boolean;
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatLocation(p: Parceiro) {
  const city = (p.cidade || "").trim();
  const state = (p.estado || "").trim();

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

async function getActivePartner(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("parceiros")
    .select("id, nome, slug, cidade, estado, celular, telefone, logo_url, banner_url, instagram, facebook, ativo")
    .eq("slug", slug)
    .eq("ativo", true)
    .maybeSingle();

  if (error || !data) return null;

  return data as Parceiro;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parceiro = await getActivePartner(slug);

  if (!parceiro) {
    return {
      title: "Parceiro não encontrado | Caminhões à Venda",
    };
  }

  return {
    title: `Estoque ${parceiro.nome} | Caminhões à Venda`,
    description: `Veja os anúncios de ${parceiro.nome} no Caminhões à Venda. Caminhões e implementos com contato direto pelo WhatsApp.`,
    alternates: { canonical: `/parcerias/parceiros/${parceiro.slug}` },
  };
}

export default async function ParceiroDetalhePage({ params }: PageProps) {
  const { slug } = await params;
  const parceiro = await getActivePartner(slug);

  if (!parceiro) notFound();

  const supabase = await createClient();

  // Busca todos os caminhões aprovados do site
  const { data: trucksData } = await supabase
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
    .eq("status", "aprovado")
    .eq("vendido", false)
    .order("created_at", { ascending: false });

  // Filtra reativamente pelos telefones correspondentes
  const celularLimpo = onlyDigits(parceiro.celular);
  const telefoneLimpo = onlyDigits(parceiro.telefone);

  const trucks = ((trucksData || []) as TruckCardData[]).filter((truck) => {
    const truckWa = onlyDigits(truck.whatsapp);
    return (
      (celularLimpo && truckWa === celularLimpo) ||
      (telefoneLimpo && truckWa === telefoneLimpo)
    );
  });

  const whatsapp = onlyDigits(parceiro.celular || parceiro.telefone);
  const mensagemWhatsapp = encodeURIComponent(
    `Olá, vim pelo Caminhões à Venda e quero falar sobre os anúncios de ${parceiro.nome}.`
  );
  const totalText = `${trucks.length} ${pluralize(trucks.length, "anúncio disponível", "anúncios disponíveis")}`;

  return (
    <main className="market-page">
      <PublicHeader />

      <div className="market-main">
        <section className="market-container" style={{ paddingTop: 18, paddingBottom: 56 }}>
          <Link
            href="/parceiros"
            style={{
              display: "inline-flex",
              marginBottom: 14,
              color: "var(--blue)",
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            ← Outros parceiros
          </Link>

          <section
            style={{
              borderRadius: 28,
              overflow: "hidden",
              border: "1px solid var(--line)",
              background: parceiro.banner_url
                ? `linear-gradient(135deg, rgba(15, 23, 42, .9), rgba(15, 23, 42, .66)), url(${parceiro.banner_url}) center / cover`
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
                    {parceiro.logo_url ? (
                      <img
                        src={parceiro.logo_url}
                        alt={`Logo ${parceiro.nome}`}
                        style={{ width: "100%", height: "100%", objectFit: "contain", padding: 8 }}
                      />
                    ) : (
                      parceiro.nome.charAt(0).toUpperCase()
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
                      Parceiro Oficial
                    </span>

                    <h1 style={{ margin: 0, fontSize: "clamp(32px, 6vw, 58px)", lineHeight: 1.02 }}>
                      Estoque {parceiro.nome}
                    </h1>
                    <p style={{ margin: "8px 0 0", color: "rgba(226, 232, 240, .9)", fontSize: 17, fontWeight: 800 }}>
                      {formatLocation(parceiro)} • {totalText}
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
                  Caminhões e implementos anunciados por este parceiro dentro da plataforma, com contato e negociação direta.
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
                <strong style={{ fontSize: 22, lineHeight: 1.1 }}>{parceiro.nome}</strong>
                <span style={{ color: "rgba(226, 232, 240, .9)", fontWeight: 800 }}>
                  {formatLocation(parceiro)}
                </span>

                {whatsapp ? (
                  <a
                    href={`https://wa.me/55${whatsapp}?text=${mensagemWhatsapp}`}
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
                    Chamar no WhatsApp
                  </a>
                ) : null}
              </aside>
            </div>
          </section>

          {/* Anúncios */}
          <section className="market-section" style={{ marginTop: 18 }}>
            <div className="market-section-head">
              <div>
                <span>Estoque do parceiro</span>
                <h2>Veículos disponíveis</h2>
              </div>
              <p className="stock-count" style={{ margin: 0 }}>{totalText}</p>
            </div>

            <div className="market-grid">
              {trucks.length > 0 ? (
                trucks.map((truck) => <TruckCard key={truck.id} truck={truck} />)
              ) : (
                <div className="market-empty">
                  Nenhum anúncio ativo vinculado a este parceiro no momento.
                </div>
              )}
            </div>
          </section>

          {/* Informações de contato e redes sociais */}
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
                <span>Sobre</span>
                <h2>Canais de atendimento</h2>
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
                <strong>Localização</strong>
                <p style={{ margin: "6px 0 0", color: "var(--muted)", fontWeight: 800 }}>{formatLocation(parceiro)}</p>
              </div>
              {parceiro.telefone && (
                <div style={{ padding: 16, borderRadius: 16, background: "var(--soft)", border: "1px solid var(--line)" }}>
                  <strong>Telefone Fixo</strong>
                  <p style={{ margin: "6px 0 0", color: "var(--muted)", fontWeight: 800 }}>{parceiro.telefone}</p>
                </div>
              )}
              <div style={{ padding: 16, borderRadius: 16, background: "var(--soft)", border: "1px solid var(--line)" }}>
                <strong>Celular / WhatsApp</strong>
                <p style={{ margin: "6px 0 0", color: "var(--muted)", fontWeight: 800 }}>{parceiro.celular}</p>
              </div>
            </div>

            {(parceiro.instagram || parceiro.facebook) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 12 }}>
                {parceiro.instagram && (
                  <a 
                    className="trust-btn ghost" 
                    href={parceiro.instagram.startsWith("http") ? parceiro.instagram : `https://instagram.com/${parceiro.instagram.replace("@", "")}`} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    Instagram
                  </a>
                )}

                {parceiro.facebook && (
                  <a 
                    className="trust-btn ghost" 
                    href={parceiro.facebook.startsWith("http") ? parceiro.facebook : `https://facebook.com/${parceiro.facebook}`} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    Facebook / Site
                  </a>
                )}
              </div>
            )}
          </section>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
