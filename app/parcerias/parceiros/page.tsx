import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MapPin, Phone, ShoppingBag, Handshake } from "lucide-react";
import Link from "next/link";

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

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default async function ParceirosPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("parceiros")
    .select("id,nome,slug,cidade,estado,celular,telefone,logo_url,banner_url,instagram,facebook")
    .eq("ativo", true)
    .order("created_at", { ascending: false });

  const parceiros = (data || []) as Parceiro[];

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

                <h1
                  style={{
                    marginTop: 18,
                    fontSize: "clamp(32px, 5vw, 58px)",
                    lineHeight: 1.02,
                    color: "white",
                  }}
                >
                  Parceiros do Caminhões à Venda
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
                  Revendas, fornecedores e prestadores de serviço ligados ao mercado de
                  caminhões, implementos e transporte pesado.
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 24 }}>
                  <a className="btn-primary" href={whatsappUrl} target="_blank" rel="noreferrer">
                    Quero ser parceiro
                  </a>
                  <Link className="btn-secondary" href="/anuncios">
                    Ver anúncios
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
                  {parceiros.length > 0
                    ? `${parceiros.length} parceiro${parceiros.length > 1 ? "s" : ""} ativo${parceiros.length > 1 ? "s" : ""}`
                    : "Seja o primeiro parceiro"}
                </strong>
                <p style={{ color: "rgba(226,232,240,0.75)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                  Oficinas, autopeças, borracharias, pneus, guincho pesado, despachantes,
                  seguros, financiamento, rastreamento e muito mais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Grid de parceiros ou empty state */}
        <section className="market-container" style={{ paddingTop: 8, paddingBottom: 48 }}>
          {parceiros.length === 0 ? (
            /* --- Empty state --- */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "64px 24px",
                textAlign: "center",
                background: "var(--surface)",
                borderRadius: 24,
                border: "1px solid var(--line)",
                boxShadow: "var(--shadow)",
              }}
            >
              <Handshake size={40} style={{ opacity: 0.3 }} aria-hidden="true" />
              <strong style={{ fontSize: 20, fontWeight: 900 }}>Nenhum parceiro cadastrado ainda</strong>
              <p style={{ margin: 0, color: "var(--muted)", fontWeight: 700, maxWidth: "36ch" }}>
                Em breve revendas e empresas parceiras aparecerão aqui.
              </p>
              <a
                className="btn-primary"
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                style={{ marginTop: 8 }}
              >
                Quero ser o primeiro parceiro
              </a>
            </div>
          ) : (
            /* --- Grid de cards --- */
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
                gap: 24,
              }}
            >
              {parceiros.map((p) => (
                <article
                  key={p.id}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: 16,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "var(--shadow)",
                  }}
                >
                  {/* Banner */}
                  <div
                    style={{
                      height: 140,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundImage: p.banner_url
                        ? `url(${p.banner_url})`
                        : "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2027 100%)",
                      position: "relative",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "flex-end",
                      padding: 12,
                    }}
                  >
                    {/* overlay escuro */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0.78))",
                      }}
                    />
                    {/* badge verificado */}
                    <span
                      style={{
                        position: "relative",
                        zIndex: 2,
                        background: "#22c55e",
                        color: "#000",
                        fontSize: 11,
                        fontWeight: 900,
                        padding: "4px 10px",
                        borderRadius: 999,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      ✓ Verificado
                    </span>
                  </div>

                  {/* Conteúdo */}
                  <div
                    style={{
                      padding: "0 20px 20px 20px",
                      marginTop: -32,
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                      flex: 1,
                    }}
                  >
                    {/* Logo + nome */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 14,
                        position: "relative",
                        zIndex: 3,
                      }}
                    >
                      <div
                        style={{
                          width: 68,
                          height: 68,
                          flexShrink: 0,
                          background: "#fff",
                          borderRadius: 12,
                          padding: 4,
                          boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                          border: "2px solid var(--line)",
                        }}
                      >
                        {p.logo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.logo_url}
                            alt={`Logo ${p.nome}`}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize: 22,
                              fontWeight: 900,
                              color: "#1e293b",
                              letterSpacing: "-0.04em",
                            }}
                          >
                            {iniciais(p.nome)}
                          </span>
                        )}
                      </div>

                      <div>
                        <h2
                          style={{
                            color: "var(--text)",
                            fontSize: 17,
                            fontWeight: 900,
                            margin: "0 0 4px",
                            lineHeight: 1.2,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {p.nome}
                        </h2>
                        {(p.cidade || p.estado) && (
                          <p
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              color: "var(--muted)",
                              fontSize: 13,
                              fontWeight: 700,
                              margin: 0,
                            }}
                          >
                            <MapPin size={12} style={{ color: "#22c55e", flexShrink: 0 }} />
                            {[p.cidade, p.estado].filter(Boolean).join(", ")}
                          </p>
                        )}
                        {(p.instagram || p.facebook) && (
                          <div style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center" }}>
                            {p.instagram && (
                              <a 
                                href={p.instagram.startsWith("http") ? p.instagram : `https://instagram.com/${p.instagram.replace("@", "")}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ display: "inline-flex", color: "#e1306c", transition: "opacity 0.2s", textDecoration: "none" }}
                                title="Instagram"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                              </a>
                            )}
                            {p.facebook && (
                              <a 
                                href={p.facebook.startsWith("http") ? p.facebook : `https://facebook.com/${p.facebook}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ display: "inline-flex", color: "#1877f2", transition: "opacity 0.2s", textDecoration: "none" }}
                                title="Facebook / Site"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vitrine teaser */}
                    <div
                      style={{
                        background: "var(--soft)",
                        border: "1px dashed var(--line)",
                        borderRadius: 10,
                        padding: "14px 16px",
                        textAlign: "center",
                        flex: 1,
                      }}
                    >
                      <strong
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          color: "var(--text)",
                          fontSize: 13,
                          fontWeight: 800,
                          marginBottom: 4,
                        }}
                      >
                        <ShoppingBag size={13} />
                        Vitrine de produtos
                      </strong>
                      <p
                        style={{
                          color: "var(--muted)",
                          fontSize: 12,
                          fontWeight: 700,
                          margin: "0 0 10px",
                          lineHeight: 1.5,
                        }}
                      >
                        Peças, acessórios e serviços desta revenda em breve aqui.
                      </p>
                      <span
                        style={{
                          display: "inline-block",
                          background: "var(--blueSoft)",
                          color: "var(--blue)",
                          fontSize: 11,
                          fontWeight: 900,
                          padding: "3px 10px",
                          borderRadius: 999,
                          letterSpacing: "0.04em",
                        }}
                      >
                        Em breve
                      </span>
                    </div>

                    {/* Botões */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: p.telefone ? "1fr 1fr" : "1fr",
                        gap: 10,
                      }}
                    >
                      {p.celular && (
                        <a
                          href={`https://wa.me/55${p.celular.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 7,
                            padding: "11px 0",
                            borderRadius: 10,
                            background: "var(--blue)",
                            color: "#fff",
                            fontSize: 13,
                            fontWeight: 900,
                            textDecoration: "none",
                          }}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.853L.057 23.57a.75.75 0 00.92.92l5.656-1.476A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.52-5.157-1.426l-.362-.217-3.768.982.999-3.683-.234-.381A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                          </svg>
                          WhatsApp
                        </a>
                      )}
                      {p.telefone && (
                        <a
                          href={`tel:${p.telefone}`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 7,
                            padding: "11px 0",
                            borderRadius: 10,
                            background: "transparent",
                            border: "1.5px solid var(--line)",
                            color: "var(--text)",
                            fontSize: 13,
                            fontWeight: 900,
                            textDecoration: "none",
                          }}
                        >
                          <Phone size={14} />
                          Ligar
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

      </div>

      <SiteFooter />
    </main>
  );
}
