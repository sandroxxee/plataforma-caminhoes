import type { Metadata } from "next";
import { PublicHeader } from "@/components/PublicHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MapPin, Phone, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "Parceiros Teste | Preview",
  robots: { index: false, follow: false },
};

// --- DADOS MOCK ---
const parceiros = [
  {
    id: 1,
    nome: "Brutus Caminhões",
    cidade: "São Paulo",
    estado: "SP",
    celular: "11999990001",
    logo_url: null,
    banner_url: null,
    vitrine_ativa: false,
  },
  {
    id: 2,
    nome: "TurboFrota Peças",
    cidade: "Curitiba",
    estado: "PR",
    celular: "41999990002",
    logo_url: null,
    banner_url: null,
    vitrine_ativa: false,
  },
  {
    id: 3,
    nome: "Estrada Sul Implementos",
    cidade: "Porto Alegre",
    estado: "RS",
    celular: "51999990003",
    logo_url: null,
    banner_url: null,
    vitrine_ativa: false,
  },
  {
    id: 4,
    nome: "Norte Peças Diesel",
    cidade: "Belém",
    estado: "PA",
    celular: "91999990004",
    logo_url: null,
    banner_url: null,
    vitrine_ativa: false,
  },
];

function iniciais(nome: string) {
  return nome
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function ParceirosTestePage() {
  return (
    <main className="market-page">
      <PublicHeader />

      <div className="market-main">
        <section className="market-container" style={{ paddingTop: 32, paddingBottom: 48 }}>

          {/* Título da página */}
          <div style={{ marginBottom: 32 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "7px 12px", borderRadius: 999,
              border: "1px solid rgba(34,197,94,0.35)",
              color: "#bbf7d0", fontWeight: 800, fontSize: 12,
              marginBottom: 14,
            }}>
              👁️ Preview visual
            </span>
            <h1 style={{ fontSize: "clamp(28px,4vw,42px)", margin: "0 0 8px", letterSpacing: "-0.03em" }}>
              Parceiros Oficiais
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 16, margin: 0, fontWeight: 700 }}>
              Revendas, lojas e empresas que apoiam a plataforma Caminhões à Venda.
            </p>
          </div>

          {/* Grid de cards */}
          <div style={grid}>
            {parceiros.map((p) => (
              <article key={p.id} style={card}>

                {/* Banner superior */}
                <div style={{
                  ...bannerBg,
                  backgroundImage: p.banner_url
                    ? `url(${p.banner_url})`
                    : "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f2027 100%)",
                }}>
                  {/* overlay */}
                  <div style={overlay} />
                  {/* badge verificado */}
                  <span style={badgeVerificado}>✓ Verificado</span>
                </div>

                {/* Conteúdo */}
                <div style={conteudo}>

                  {/* Logo + nome */}
                  <div style={headerPerfil}>
                    <div style={logoWrap}>
                      {p.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.logo_url} alt={p.nome} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      ) : (
                        <span style={logoFallback}>{iniciais(p.nome)}</span>
                      )}
                    </div>
                    <div>
                      <h3 style={cardTitle}>{p.nome}</h3>
                      <p style={cardSub}>
                        <MapPin size={12} style={{ color: "#22c55e", marginRight: 3 }} />
                        {p.cidade}, {p.estado}
                      </p>
                    </div>
                  </div>

                  {/* Vitrine teaser */}
                  <div style={teaserBox}>
                    <strong style={teaserTitle}>
                      <ShoppingBag size={13} style={{ marginRight: 5, verticalAlign: "middle" }} />
                      Vitrine de produtos
                    </strong>
                    <p style={teaserText}>Peças, acessórios e serviços desta revenda em breve aqui.</p>
                    <span style={badgeBreve}>Em breve</span>
                  </div>

                  {/* Botões */}
                  <div style={footerBotoes}>
                    <a
                      href={`https://wa.me/55${p.celular.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      style={btnZap}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.853L.057 23.57a.75.75 0 00.92.92l5.656-1.476A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.52-5.157-1.426l-.362-.217-3.768.982.999-3.683-.234-.381A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      </svg>
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${p.celular}`}
                      style={btnAcao}
                    >
                      <Phone size={14} />
                      Ligar
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

// --- ESTILOS inline (mesma lógica do admin existente, adaptada para tema público) ---

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))",
  gap: 24,
};

const card: React.CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: 16,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.28s ease, box-shadow 0.28s ease",
  boxShadow: "var(--shadow)",
};

const bannerBg: React.CSSProperties = {
  height: 140,
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-end",
  padding: 12,
};

const overlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(0,0,0,0.82))",
};

const badgeVerificado: React.CSSProperties = {
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
};

const conteudo: React.CSSProperties = {
  padding: "0 20px 20px 20px",
  position: "relative",
  marginTop: -32,
  display: "flex",
  flexDirection: "column",
  gap: 16,
  flex: 1,
};

const headerPerfil: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  gap: 14,
  position: "relative",
  zIndex: 3,
};

const logoWrap: React.CSSProperties = {
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
};

const logoFallback: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  color: "#1e293b",
  letterSpacing: "-0.04em",
};

const cardTitle: React.CSSProperties = {
  color: "var(--text)",
  fontSize: 17,
  fontWeight: 900,
  margin: "0 0 4px",
  lineHeight: 1.2,
  letterSpacing: "-0.02em",
};

const cardSub: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  color: "var(--muted)",
  fontSize: 13,
  fontWeight: 700,
  margin: 0,
};

const teaserBox: React.CSSProperties = {
  background: "var(--soft)",
  border: "1px dashed var(--line)",
  borderRadius: 10,
  padding: "14px 16px",
  textAlign: "center",
  flex: 1,
};

const teaserTitle: React.CSSProperties = {
  display: "block",
  color: "var(--text)",
  fontSize: 13,
  fontWeight: 800,
  marginBottom: 4,
};

const teaserText: React.CSSProperties = {
  color: "var(--muted)",
  fontSize: 12,
  fontWeight: 700,
  margin: "0 0 10px",
  lineHeight: 1.5,
};

const badgeBreve: React.CSSProperties = {
  display: "inline-block",
  background: "var(--blueSoft)",
  color: "var(--blue)",
  fontSize: 11,
  fontWeight: 900,
  padding: "3px 10px",
  borderRadius: 999,
  letterSpacing: "0.04em",
};

const footerBotoes: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginTop: "auto",
};

const btnZap: React.CSSProperties = {
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
  transition: "filter .16s",
};

const btnAcao: React.CSSProperties = {
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
  transition: "border-color .16s, color .16s",
};
