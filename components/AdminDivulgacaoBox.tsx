"use client";

import { useState, type CSSProperties } from "react";
import { Eye, Copy, Share2, Smartphone, Landmark, RotateCcw, Download, Users, FileText } from "lucide-react";

type AdminDivulgacaoBoxProps = {
  titulo: string;
  preco: string;
  cidade: string;
  estado: string;
  textoCompleto: string;
  textoCurto: string;
  textoTecnico: string;
  linkAnuncio: string;
  mainImage: string;
  facebookShareUrl: string;
};

export function AdminDivulgacaoBox({
  titulo,
  preco,
  cidade,
  estado,
  textoCompleto,
  textoCurto,
  textoTecnico,
  linkAnuncio,
  mainImage,
  facebookShareUrl,
}: AdminDivulgacaoBoxProps) {
  const [copiado, setCopiado] = useState<string | null>(null);
  const [activeTextTab, setActiveTextTab] = useState<"completo" | "curto" | "tecnico">("completo");

  // Novo estado de tema para as artes geradas
  const [tema, setTema] = useState("neon");

  // Armazena as edições locais nas legendas
  const [editedCompleto, setEditedCompleto] = useState(textoCompleto);
  const [editedCurto, setEditedCurto] = useState(textoCurto);
  const [editedTecnico, setEditedTecnico] = useState(textoTecnico);

  // ID do anúncio extraído do link
  const getAnuncioId = () => {
    try {
      const parts = linkAnuncio.split("/");
      const lastPart = parts[parts.length - 1];
      if (lastPart.includes("-")) {
        const subparts = lastPart.split("-");
        return subparts[subparts.length - 1];
      }
      return lastPart;
    } catch {
      return "";
    }
  };

  const adId = getAnuncioId();

  const getTextoAtivo = () => {
    if (activeTextTab === "curto") return editedCurto;
    if (activeTextTab === "tecnico") return editedTecnico;
    return editedCompleto;
  };

  const setTextoAtivo = (val: string) => {
    if (activeTextTab === "curto") setEditedCurto(val);
    else if (activeTextTab === "tecnico") setEditedTecnico(val);
    else setEditedCompleto(val);
  };

  const resetTextoAtivo = () => {
    if (activeTextTab === "curto") setEditedCurto(textoCurto);
    else if (activeTextTab === "tecnico") setEditedTecnico(textoTecnico);
    else setEditedCompleto(textoCompleto);
  };

  async function copiar(valor: string, label: string) {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(label);
      window.setTimeout(() => setCopiado(null), 2500);
    } catch {
      setCopiado("Não foi possível copiar automaticamente");
    }
  }

  // Compartilhamento Nativo (Web Share API)
  const handleShareNativo = async () => {
    const texto = getTextoAtivo();
    if (navigator.share) {
      try {
        await navigator.share({
          title: titulo,
          text: texto,
          url: linkAnuncio,
        });
      } catch (err) {
        console.error("Erro no compartilhamento:", err);
      }
    } else {
      copiar(`${texto}\n\n${linkAnuncio}`, "Divulgação completa copiada");
    }
  };

  // WhatsApp Link Pré-pronto
  const handleWhatsappShare = () => {
    const texto = getTextoAtivo();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  };

  // URLs das artes dinâmicas geradas no servidor Next.js
  const getArteUrl = (tipo: "feed" | "story" | "whatsapp") => {
    return `/api/admin/gerar-arte/${adId || "id"}?formato=${tipo}&tema=${tema}`;
  };

  return (
    <div style={styles.container}>
      {copiado && (
        <div style={styles.toast}>
          <span style={{ fontSize: 16 }}>✨</span>
          <span>{copiado}</span>
        </div>
      )}

      {/* CARD DE IDENTIFICAÇÃO DO VEÍCULO (Tema Glassmorphism) */}
      <section style={styles.adCard}>
        <div style={styles.adThumb}>
          {mainImage ? (
            <img src={mainImage} alt={titulo} style={styles.adImg} />
          ) : (
            <div style={styles.noImg}>Sem foto</div>
          )}
        </div>
        <div style={styles.adInfo}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={styles.badgeAprovado}>Anúncio Ativo</span>
            <span style={styles.badgeMeta}>📍 {cidade}/{estado}</span>
          </div>
          <h1 style={styles.adTitle}>{titulo}</h1>
          <div style={styles.adPriceRow}>
            <strong style={styles.price}>{preco}</strong>
            <a href={linkAnuncio} target="_blank" rel="noreferrer" style={styles.adLinkBtn}>
              Ver anúncio público <Eye size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* PAINEL DE DISTRIBUIÇÃO RÁPIDA (Estilo Glassmorphism translúcido) */}
      <section style={styles.sharePanel}>
        <h3 style={styles.sectionTitle}>Divulgar anúncio</h3>
        <p style={styles.sectionDesc}>Selecione o canal para divulgar o veículo de forma rápida e profissional.</p>

        <div style={styles.shareGrid}>
          {/* WhatsApp - Principal */}
          <button onClick={handleWhatsappShare} style={styles.btnWhatsapp}>
            <Share2 size={18} />
            Compartilhar no WhatsApp
          </button>

          {/* Compartilhamento Nativo Celular */}
          <button onClick={handleShareNativo} style={styles.btnNativo}>
            <Smartphone size={18} />
            Compartilhar no celular (Nativo)
          </button>

          {/* Facebook - Perfil */}
          <a
            href={facebookShareUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => copiar(getTextoAtivo(), "Texto copiado! Cole na sua linha do tempo do Facebook.")}
            style={styles.btnFacebook}
          >
            <Landmark size={15} />
            Facebook (Perfil)
          </a>

          {/* Facebook - Grupos */}
          <button
            onClick={() => {
              copiar(getTextoAtivo(), "Texto copiado! Agora entre em seus grupos e cole.");
              window.open("https://www.facebook.com/groups", "_blank");
            }}
            style={styles.btnFacebookGroup}
          >
            <Users size={15} />
            Facebook (Grupos)
          </button>

          {/* Facebook - Páginas */}
          <button
            onClick={() => {
              copiar(getTextoAtivo(), "Texto copiado! Selecione sua página para postar.");
              window.open("https://www.facebook.com/bookmarks/pages", "_blank");
            }}
            style={styles.btnFacebookPage}
          >
            <FileText size={15} />
            Facebook (Páginas)
          </button>

          {/* Instagram */}
          <button
            onClick={() =>
              copiar(
                getTextoAtivo(),
                "Legenda copiada! Abra o Instagram, baixe a arte abaixo e publique."
              )
            }
            style={styles.btnInstagram}
          >
            <Copy size={15} />
            Copiar Legenda Instagram
          </button>
        </div>

        {/* Ações Secundárias */}
        <div style={styles.secondaryActions}>
          <button type="button" onClick={() => copiar(`${getTextoAtivo()}\n\n${linkAnuncio}`, "Anúncio completo copiado!")} style={styles.actionPill}>
            <Copy size={13} /> Copiar texto + link
          </button>
          <button type="button" onClick={() => copiar(linkAnuncio, "Link copiado!")} style={styles.actionPill}>
            <Copy size={13} /> Copiar apenas link
          </button>
        </div>
      </section>

      {/* SELETOR DE VERSÕES DE LEGENDAS E EDITOR EDITÁVEL */}
      <section style={styles.editorCard}>
        <div style={styles.editorHeader}>
          <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Texto de divulgação</h3>
          <div style={styles.tabList}>
            <button
              onClick={() => setActiveTextTab("completo")}
              style={activeTextTab === "completo" ? styles.tabActive : styles.tabInactive}
            >
              Completo
            </button>
            <button
              onClick={() => setActiveTextTab("curto")}
              style={activeTextTab === "curto" ? styles.tabActive : styles.tabInactive}
            >
              Curto
            </button>
            <button
              onClick={() => setActiveTextTab("tecnico")}
              style={activeTextTab === "tecnico" ? styles.tabActive : styles.tabInactive}
            >
              Técnico
            </button>
          </div>
        </div>

        <p style={styles.sectionDesc}>O texto abaixo é gerado dinamicamente com base nos dados. Sinta-se livre para editá-lo.</p>

        <textarea
          value={getTextoAtivo()}
          onChange={(e) => setTextoAtivo(e.target.value)}
          style={styles.textarea}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
          <button onClick={resetTextoAtivo} style={styles.resetBtn}>
            <RotateCcw size={13} /> Redefinir para original
          </button>
        </div>
      </section>

      {/* GERADOR AUTOMÁTICO DE ARTES (IMAGENS RENDERIZADAS NO SERVIDOR COM DOWNLOAD) */}
      <section style={styles.artsCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 10 }}>
          <h3 style={styles.sectionTitle}>Prévia e Download de Artes para Redes Sociais</h3>
          
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.03)", padding: "4px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 800 }}>Modelo:</span>
            <select
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              style={{
                background: "transparent",
                color: "#fff",
                border: 0,
                fontSize: 13,
                fontWeight: 700,
                outline: "none",
                cursor: "pointer",
                paddingRight: 6
              }}
            >
              <option value="neon" style={{ background: "#1f2937" }}>🔵 Neon</option>
              <option value="gold" style={{ background: "#1f2937" }}>🟡 Ouro</option>
              <option value="glass" style={{ background: "#1f2937" }}>🌸 Glass</option>
              <option value="light" style={{ background: "#1f2937" }}>⚪ Light</option>
            </select>
          </div>
        </div>
        <p style={styles.sectionDesc}>Clique para baixar a arte profissional em alta definição para compartilhar na rede desejada.</p>

        <div style={styles.previewGrid}>
          {/* Formato 1: Feed */}
          <div style={styles.previewCard}>
            <div style={styles.previewLabel}>Feed do Instagram / Facebook (1:1)</div>
            <div style={styles.previewWrapper}>
              <img src={getArteUrl("feed")} alt="Prévia Feed 1:1" style={styles.previewImg} loading="lazy" />
            </div>
            <a href={getArteUrl("feed")} download={`feed-${adId}.png`} target="_blank" rel="noreferrer" style={styles.downloadBtn}>
              <Download size={15} /> Baixar Arte Feed
            </a>
          </div>

          {/* Formato 2: Story */}
          <div style={styles.previewCard}>
            <div style={styles.previewLabel}>Status / Story (9:16)</div>
            <div style={styles.previewWrapperStory}>
              <img src={getArteUrl("story")} alt="Prévia Story 9:16" style={styles.previewImg} loading="lazy" />
            </div>
            <a href={getArteUrl("story")} download={`story-${adId}.png`} target="_blank" rel="noreferrer" style={styles.downloadBtn}>
              <Download size={15} /> Baixar Arte Story
            </a>
          </div>

          {/* Formato 3: WhatsApp */}
          <div style={styles.previewCard}>
            <div style={styles.previewLabel}>WhatsApp / Grupos (1200x630)</div>
            <div style={styles.previewWrapperWhatsapp}>
              <img src={getArteUrl("whatsapp")} alt="Prévia WhatsApp" style={styles.previewImg} loading="lazy" />
            </div>
            <a href={getArteUrl("whatsapp")} download={`whatsapp-${adId}.png`} target="_blank" rel="noreferrer" style={styles.downloadBtn}>
              <Download size={15} /> Baixar Arte WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: { display: "flex", flexDirection: "column", gap: 20 },
  adCard: {
    display: "flex",
    gap: 20,
    padding: 24,
    borderRadius: 24,
    background: "rgba(30, 41, 59, 0.4)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
  },
  adThumb: { width: 140, height: 95, borderRadius: 16, overflow: "hidden", background: "#334155", flexShrink: 0 },
  adImg: { width: "100%", height: "100%", objectFit: "cover" },
  noImg: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748b", fontSize: 12 },
  adInfo: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  badgeAprovado: { padding: "4px 10px", borderRadius: 999, background: "rgba(16,185,129,0.15)", color: "#10b981", fontSize: 12, fontWeight: 900, alignSelf: "flex-start" },
  badgeMeta: { padding: "4px 10px", borderRadius: 999, background: "rgba(255,255,255,0.05)", color: "#94a3b8", fontSize: 12, fontWeight: 700 },
  adTitle: { margin: "6px 0 10px", color: "#ffffff", fontSize: 24, fontWeight: 900, letterSpacing: "-0.02em" },
  adPriceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 },
  price: { fontSize: 22, fontWeight: 950, color: "#10b981" },
  adLinkBtn: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800, color: "#3b82f6", textDecoration: "none" },

  sharePanel: {
    padding: 24,
    borderRadius: 24,
    background: "rgba(17, 24, 39, 0.45)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  sectionTitle: { fontSize: 18, color: "#ffffff", fontWeight: 850, marginBottom: 4, letterSpacing: "-0.01em" },
  sectionDesc: { fontSize: 13, color: "#64748b", margin: "0 0 16px" },
  shareGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 12 },
  btnWhatsapp: {
    minHeight: 52,
    border: 0,
    borderRadius: 14,
    background: "#25d366",
    color: "#fff",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0 4px 14px rgba(37,211,102,0.22)",
    transition: "all 0.2s ease-in-out",
  },
  btnNativo: {
    minHeight: 52,
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.2s ease-in-out",
  },
  btnFacebook: {
    minHeight: 52,
    border: 0,
    borderRadius: 14,
    background: "#1877f2",
    color: "#fff",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    textDecoration: "none",
    boxShadow: "0 4px 14px rgba(24,119,242,0.2)",
    transition: "all 0.2s ease-in-out",
  },
  btnFacebookGroup: {
    minHeight: 52,
    border: 0,
    borderRadius: 14,
    background: "#0c63d4",
    color: "#fff",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0 4px 14px rgba(12,99,212,0.2)",
    transition: "all 0.2s ease-in-out",
  },
  btnFacebookPage: {
    minHeight: 52,
    border: 0,
    borderRadius: 14,
    background: "#0a56b8",
    color: "#fff",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    boxShadow: "0 4px 14px rgba(10,86,184,0.2)",
    transition: "all 0.2s ease-in-out",
  },
  btnInstagram: {
    minHeight: 52,
    border: "1px solid rgba(245,158,11,0.25)",
    borderRadius: 14,
    background: "rgba(245,158,11,0.06)",
    color: "#f59e0b",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "all 0.2s ease-in-out",
  },
  secondaryActions: { display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" },
  actionPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    height: 34,
    padding: "0 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.02)",
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
    transition: "all 0.15s ease-in-out",
  },

  editorCard: {
    padding: 24,
    borderRadius: 24,
    background: "rgba(17, 24, 39, 0.45)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  editorHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 14 },
  tabList: { display: "flex", gap: 4, background: "#1f2937", padding: 4, borderRadius: 10 },
  tabActive: { border: 0, background: "#374151", color: "#fff", padding: "6px 14px", borderRadius: 7, fontWeight: 900, fontSize: 13, cursor: "pointer" },
  tabInactive: { border: 0, background: "transparent", color: "#94a3b8", padding: "6px 14px", borderRadius: 7, fontWeight: 800, fontSize: 13, cursor: "pointer" },
  textarea: {
    width: "100%",
    minHeight: 180,
    resize: "vertical",
    borderRadius: 14,
    border: "1px solid #374151",
    background: "#1f2937",
    color: "#e5e7eb",
    padding: 16,
    fontFamily: "inherit",
    fontSize: 14,
    lineHeight: 1.5,
    outline: "none",
  },
  resetBtn: {
    border: 0,
    background: "transparent",
    color: "#64748b",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  },

  artsCard: {
    padding: 24,
    borderRadius: 24,
    background: "rgba(17, 24, 39, 0.45)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
    marginTop: 16,
  },
  previewCard: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    background: "#1f2937",
    padding: 16,
    borderRadius: 18,
    border: "1px solid #374151",
  },
  previewLabel: { fontSize: 14, color: "#94a3b8", fontWeight: 800 },
  previewWrapper: {
    width: "100%",
    aspectRatio: "1",
    overflow: "hidden",
    borderRadius: 12,
    background: "#080c16",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  previewWrapperStory: {
    width: "100%",
    aspectRatio: "9/16",
    overflow: "hidden",
    borderRadius: 12,
    background: "#080c16",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  previewWrapperWhatsapp: {
    width: "100%",
    aspectRatio: "1200/630",
    overflow: "hidden",
    borderRadius: 12,
    background: "#080c16",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImg: { width: "100%", height: "100%", objectFit: "contain" },
  downloadBtn: {
    height: 44,
    borderRadius: 12,
    background: "#1e293b",
    color: "#f8fafc",
    fontWeight: 800,
    fontSize: 13,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "all 0.2s ease-in-out",
  },

  toast: {
    position: "fixed",
    top: 24,
    right: 24,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 20px",
    borderRadius: 16,
    background: "#1e293b",
    color: "#f8fafc",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    fontWeight: 800,
    fontSize: 13,
    animation: "slideDown 0.3s ease-out",
  },
};
