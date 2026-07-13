"use client";

import { useState, type CSSProperties } from "react";
import { Eye, Copy, Share2, Smartphone, Landmark, RotateCcw, Download } from "lucide-react";

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

  // Armazena as edições locais nas legendas
  const [editedCompleto, setEditedCompleto] = useState(textoCompleto);
  const [editedCurto, setEditedCurto] = useState(textoCurto);
  const [editedTecnico, setEditedTecnico] = useState(textoTecnico);

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

  // Geração de Artes Gráficas no HTML5 Canvas
  const [gerandoArte, setGerandoArte] = useState<string | null>(null);

  const handleGerarArte = (tipo: "feed" | "story" | "whatsapp") => {
    setGerandoArte(tipo);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setGerandoArte(null);
      return;
    }

    let width = 1080;
    let height = 1080;
    if (tipo === "story") {
      width = 1080;
      height = 1920;
    } else if (tipo === "whatsapp") {
      width = 1200;
      height = 630;
    }

    canvas.width = width;
    canvas.height = height;

    const truckImg = new Image();
    truckImg.crossOrigin = "anonymous";
    truckImg.src = mainImage || "/placeholder-truck.png";

    const qrImg = new Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(linkAnuncio)}`;

    let loadedCount = 0;
    const checkLoaded = () => {
      loadedCount++;
      if (loadedCount === 2) {
        desenharEDownload();
      }
    };

    truckImg.onload = checkLoaded;
    truckImg.onerror = () => {
      console.warn("Falha ao carregar a foto do caminhão.");
      checkLoaded();
    };

    qrImg.onload = checkLoaded;
    qrImg.onerror = () => {
      console.warn("Falha ao carregar a imagem do QR Code.");
      checkLoaded();
    };

    function drawRoundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    }

    function drawImageProp(
      c: CanvasRenderingContext2D,
      img: HTMLImageElement,
      x: number,
      y: number,
      w: number,
      h: number,
      offsetX = 0.5,
      offsetY = 0.5
    ) {
      if (img.width === 0 || img.height === 0) return;

      const iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih);
      let nw = iw * r,
        nh = ih * r,
        cx = 1,
        cy = 1,
        cw = 1,
        ch = 1;

      if (nw < w) {
        const r2 = w / nw;
        nw *= r2;
        nh *= r2;
      }
      if (nh < h) {
        const r3 = h / nh;
        nw *= r3;
        nh *= r3;
      }

      const ar_w = iw / nw;
      const ar_h = ih / nh;

      cx = (iw - w * ar_w) * offsetX;
      cy = (ih - h * ar_h) * offsetY;
      cw = w * ar_w;
      ch = h * ar_h;

      if (cx < 0) cx = 0;
      if (cy < 0) cy = 0;
      if (cw > iw) cw = iw;
      if (ch > ih) ch = ih;

      c.drawImage(img, cx, cy, cw, ch, x, y, w, h);
    }

    function desenharEDownload() {
      if (!ctx) return;
      // 1. Fundo Gradiente Geral
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#0d1527");
      bgGrad.addColorStop(1, "#030712");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Renderização Específica do Layout
      if (tipo === "feed") {
        // Feed Quadrado (1080x1080)
        drawImageProp(ctx, truckImg, 0, 0, 1080, 720);

        ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, 1080, 720);

        // Retângulo de informações inferior
        ctx.fillStyle = "#111827";
        ctx.fillRect(0, 720, 1080, 360);

        ctx.fillStyle = "#3b82f6";
        ctx.font = "bold 24px sans-serif";
        ctx.fillText("CAMINHÕES À VENDA", 50, 760);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 44px sans-serif";
        ctx.fillText(titulo.slice(0, 35), 50, 810);

        ctx.fillStyle = "#10b981";
        ctx.font = "extrabold 60px sans-serif";
        ctx.fillText(preco, 50, 890);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "600 32px sans-serif";
        ctx.fillText(`📍 ${cidade}/${estado}`, 50, 960);

        // Selo "OPORTUNIDADE"
        ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        drawRoundRect(ctx, 50, 1000, 200, 42, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#f59e0b";
        ctx.font = "bold 18px sans-serif";
        ctx.fillText("OPORTUNIDADE", 68, 1028);

        // QR Code na direita
        ctx.fillStyle = "#ffffff";
        drawRoundRect(ctx, 830, 770, 200, 200, 12);
        ctx.fill();
        ctx.drawImage(qrImg, 845, 785, 170, 170);

        ctx.fillStyle = "#64748b";
        ctx.font = "600 18px sans-serif";
        ctx.fillText("Escaneie para fotos", 850, 1000);
      } else if (tipo === "story") {
        // Story Vertical (1080x1920)
        drawImageProp(ctx, truckImg, 0, 280, 1080, 1100);

        const gradTop = ctx.createLinearGradient(0, 0, 0, 280);
        gradTop.addColorStop(0, "#080d18");
        gradTop.addColorStop(1, "transparent");
        ctx.fillStyle = gradTop;
        ctx.fillRect(0, 0, 1080, 280);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 32px sans-serif";
        ctx.fillText("CAMINHÕES À VENDA", 540 - ctx.measureText("CAMINHÕES À VENDA").width / 2, 70);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText("VEÍCULO DISPONÍVEL", 540 - ctx.measureText("VEÍCULO DISPONÍVEL").width / 2, 110);

        const gradBot = ctx.createLinearGradient(0, 1200, 0, 1920);
        gradBot.addColorStop(0, "transparent");
        gradBot.addColorStop(0.2, "#080d18");
        gradBot.addColorStop(1, "#030205");
        ctx.fillStyle = gradBot;
        ctx.fillRect(0, 1200, 1080, 720);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 52px sans-serif";
        ctx.fillText(titulo.slice(0, 36), 540 - ctx.measureText(titulo.slice(0, 36)).width / 2, 1420);

        ctx.fillStyle = "#10b981";
        ctx.font = "extrabold 82px sans-serif";
        ctx.fillText(preco, 540 - ctx.measureText(preco).width / 2, 1500);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "600 36px sans-serif";
        const locTxt = `📍 ${cidade}/${estado}`;
        ctx.fillText(locTxt, 540 - ctx.measureText(locTxt).width / 2, 1600);

        // QR Code no Story
        ctx.fillStyle = "#ffffff";
        drawRoundRect(ctx, 455, 1670, 170, 170, 12);
        ctx.fill();
        ctx.drawImage(qrImg, 465, 1680, 150, 150);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "600 20px sans-serif";
        const camTxt = "Aponte a câmera para ver detalhes e fotos";
        ctx.fillText(camTxt, 540 - ctx.measureText(camTxt).width / 2, 1875);
      } else {
        // WhatsApp Retangular (1200x630)
        drawImageProp(ctx, truckImg, 0, 0, 720, 630);

        ctx.fillStyle = "#111827";
        ctx.fillRect(720, 0, 480, 630);

        ctx.fillStyle = "#3b82f6";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText("CAMINHÕES À VENDA", 760, 60);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 36px sans-serif";
        const words = titulo.split(" ");
        let line = "";
        let y = 110;
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > 400 && n > 0) {
            ctx.fillText(line, 760, y);
            line = words[n] + " ";
            y += 48;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 760, y);

        ctx.fillStyle = "#10b981";
        ctx.font = "extrabold 52px sans-serif";
        ctx.fillText(preco, 760, y + 65);

        ctx.fillStyle = "#94a3b8";
        ctx.font = "600 26px sans-serif";
        ctx.fillText(`📍 ${cidade}/${estado}`, 760, y + 130);

        // QR Code no WhatsApp layout
        ctx.fillStyle = "#ffffff";
        drawRoundRect(ctx, 760, 440, 130, 130, 8);
        ctx.fill();
        ctx.drawImage(qrImg, 768, 448, 114, 114);

        ctx.fillStyle = "#64748b";
        ctx.font = "600 16px sans-serif";
        ctx.fillText("Escaneie o", 910, 480);
        ctx.fillText("QR Code para", 910, 505);
        ctx.fillText("negociar", 910, 530);
      }

      try {
        const downloadUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.download = `arte-${tipo}-${titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
        a.href = downloadUrl;
        a.click();
        setCopiado("Arte baixada com sucesso!");
        window.setTimeout(() => setCopiado(null), 3000);
      } catch (err) {
        console.error("Erro ao gerar URL da imagem do canvas:", err);
        alert("Erro de segurança ao gerar download. Verifique se as fotos possuem CORS configurado.");
      } finally {
        setGerandoArte(null);
      }
    }
  };

  return (
    <div style={styles.container}>
      {copiado && (
        <div style={styles.toast}>
          <span style={{ fontSize: 16 }}>✨</span>
          <span>{copiado}</span>
        </div>
      )}

      {/* CARD DE IDENTIFICAÇÃO DO VEÍCULO */}
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

      {/* PAINEL DE DISTRIBUIÇÃO RÁPIDA */}
      <section style={styles.sharePanel}>
        <h3 style={styles.sectionTitle}>Divulgar anúncio</h3>
        <p style={styles.sectionDesc}>Clique nos botões abaixo para compartilhar nos canais mais adequados de forma rápida.</p>

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

          {/* Facebook */}
          <a
            href={facebookShareUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => copiar(getTextoAtivo(), "Texto copiado! Cole na sua publicação do Facebook.")}
            style={styles.btnFacebook}
          >
            <Landmark size={15} />
            Publicar no Facebook
          </a>

          {/* Instagram */}
          <button
            onClick={() =>
              copiar(
                getTextoAtivo(),
                "Legenda copiada para o Instagram! Agora baixe a arte abaixo e poste na rede."
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

      {/* GERADOR AUTOMÁTICO DE ARTES E QR CODE */}
      <section style={styles.artsCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Gerador de Artes de Vendas</h3>
            <p style={styles.sectionDesc}>Gere artes gráficas profissionais contendo a foto, preço, localidade e QR Code do anúncio.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => handleGerarArte("feed")}
              disabled={!!gerandoArte}
              style={styles.downloadBtn}
            >
              <Download size={14} /> {gerandoArte === "feed" ? "Gerando..." : "Arte para Feed (1:1)"}
            </button>
            <button
              onClick={() => handleGerarArte("story")}
              disabled={!!gerandoArte}
              style={styles.downloadBtn}
            >
              <Download size={14} /> {gerandoArte === "story" ? "Gerando..." : "Arte para Status/Story"}
            </button>
            <button
              onClick={() => handleGerarArte("whatsapp")}
              disabled={!!gerandoArte}
              style={styles.downloadBtn}
            >
              <Download size={14} /> {gerandoArte === "whatsapp" ? "Gerando..." : "Arte para WhatsApp"}
            </button>
          </div>
        </div>

        {/* Visualização Rápida QR Code */}
        <div style={styles.qrSection}>
          <div style={styles.qrInfo}>
            <h4 style={{ color: "#fff", margin: "0 0 4px", fontSize: 15 }}>Acesso rápido via QR Code</h4>
            <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>Mostre aos clientes presenciais ou utilize em panfletos e placas de loja.</p>
          </div>
          <div style={styles.qrDisplay}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(linkAnuncio)}`}
              alt="QR Code do anúncio"
              style={{ width: 100, height: 100, borderRadius: 6 }}
            />
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
    background: "linear-gradient(135deg, #1e293b, #0f172a)",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
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

  sharePanel: { padding: 24, borderRadius: 24, background: "#111827", border: "1px solid rgba(255,255,255,0.03)" },
  sectionTitle: { fontSize: 18, color: "#ffffff", fontWeight: 850, marginBottom: 4, letterSpacing: "-0.01em" },
  sectionDesc: { fontSize: 13, color: "#64748b", margin: "0 0 16px" },
  shareGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 },
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
    transition: "all 0.2s",
  },
  btnNativo: {
    minHeight: 52,
    border: "1px solid rgba(255,255,255,0.1)",
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
    transition: "all 0.2s",
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
    transition: "all 0.2s",
  },
  btnInstagram: {
    minHeight: 52,
    border: "1px solid rgba(245,158,11,0.2)",
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
    transition: "all 0.2s",
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
    transition: "all 0.15s",
  },

  editorCard: { padding: 24, borderRadius: 24, background: "#111827", border: "1px solid rgba(255,255,255,0.03)" },
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

  artsCard: { padding: 24, borderRadius: 24, background: "#111827", border: "1px solid rgba(255,255,255,0.03)" },
  downloadBtn: {
    height: 42,
    padding: "0 16px",
    borderRadius: 12,
    background: "#1e293b",
    color: "#f8fafc",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  qrSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    marginTop: 20,
    paddingTop: 20,
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  qrInfo: { flex: 1 },
  qrDisplay: { background: "#ffffff", padding: 8, borderRadius: 12 },

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
