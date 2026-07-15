import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extrairIdDoParametroAnuncio, gerarSlugComId } from "@/lib/slug";
import { formatImageUrl } from "@/lib/truck-utils"; // Certifique-se de que esta função está correta
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

const siteUrl = "https://caminhoesavenda.com";

function money(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

// Função para buscar os dados completos do caminhão
async function getAnuncio(id: string) {
  const supabase = await createClient();
  let uuid = id;
  if (id.includes("-") && id.length > 36) {
    const { tipo, valor } = extrairIdDoParametroAnuncio(id);
    if (tipo === "uuid") uuid = valor;
  }

  const { data } = await supabase
    .from("trucks")
    .select(`
      id, titulo, marca, modelo, ano_modelo, ano_fabricacao, preco, cidade, estado, carroceria, tracao,
      quilometragem, motor, cambio, combustivel, cor, descricao,
      truck_images ( image_url, principal, ordem )
    `)
    .eq("id", uuid)
    .single();

  return data ?? null;
}

// Função para gerar chamada comercial via IA com o Gemini
async function gerarTaglineIA(titulo: string, preco: string, local: string, descricao: string): Promise<string> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return "Caminhão pronto para trabalhar!";

  const ai = new GoogleGenAI({ apiKey });
  try {
    const promise = ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Gere uma única frase comercial curta e impactante (máximo de 40 caracteres) para divulgar este veículo. Use um gatilho de venda rápido. Não use aspas na resposta.

Veículo: ${titulo}
Preço: ${preco}
Local: ${local}
Descrição: ${descricao.slice(0, 180)}`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 35,
      }
    });

    const timeout = new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Timeout Gemini")), 1200));
    const response = await Promise.race([promise, timeout]);
    if (response && response.text) {
      return response.text.trim().replace(/^["']|["']$/g, "");
    }
  } catch (error) {
    console.error("Erro ao gerar tagline com Gemini:", error);
  }

  if (titulo.toLowerCase().includes("scania")) return "Robustez e potência para a sua frota!";
  if (titulo.toLowerCase().includes("volvo")) return "Tecnologia e alta performance na estrada!";
  return "Oportunidade única para o seu trabalho!";
}

// Ícone moderno e limpo do caminhão
const truckIcon = (color: string) => (
  <div style={{ display: "flex", alignItems: "center", position: "relative", width: 32, height: 18 }}>
    <div style={{ display: "flex", width: 14, height: 10, borderRadius: 1, background: color, position: "absolute", right: 0, top: 4 }} />
    <div style={{ display: "flex", width: 3, height: 3, background: "#ffffff", position: "absolute", right: 1, top: 6 }} />
    <div style={{ display: "flex", width: 16, height: 16, background: color, position: "absolute", left: 0, top: 0 }} />
    <div style={{ display: "flex", width: 5, height: 5, borderRadius: 99, background: "#000000", position: "absolute", left: 2, bottom: -1 }} />
    <div style={{ display: "flex", width: 5, height: 5, borderRadius: 99, background: "#000000", position: "absolute", left: 8, bottom: -1 }} />
    <div style={{ display: "flex", width: 5, height: 5, borderRadius: 99, background: "#000000", position: "absolute", right: 2, bottom: -1 }} />
  </div>
);

// Ícone minimalista de estrela (para IA)
const starIcon = (color: string) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Configuração dos temas visuais das artes inteligentes
type TemaConfig = {
  bg: string;
  panelBg: string;
  panelBorder: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  taglineBg: string;
  taglineText: string;
  taglineBorder: string;
};

const TEMAS: Record<string, TemaConfig> = {
  neon: {
    bg: "#060913",
    panelBg: "rgba(17, 24, 39, 0.92)",
    panelBorder: "rgba(59, 130, 246, 0.3)",
    primary: "#10b981", // verde
    accent: "#3b82f6", // azul
    text: "#ffffff",
    muted: "#94a3b8",
    taglineBg: "rgba(6, 9, 19, 0.8)",
    taglineText: "#ffffff",
    taglineBorder: "rgba(59, 130, 246, 0.4)",
  },
  gold: {
    bg: "#0a0a0c",
    panelBg: "rgba(24, 24, 27, 0.95)",
    panelBorder: "rgba(234, 179, 8, 0.4)",
    primary: "#eab308", // dourado
    accent: "#f59e0b", // âmbar
    text: "#ffffff",
    muted: "#a1a1aa",
    taglineBg: "rgba(10, 10, 12, 0.9)",
    taglineText: "#eab308",
    taglineBorder: "rgba(234, 179, 8, 0.5)",
  },
  glass: {
    bg: "#080c16",
    panelBg: "rgba(255, 255, 255, 0.05)",
    panelBorder: "rgba(255, 255, 255, 0.15)",
    primary: "#06b6d4", // ciano
    accent: "#ec4899", // rosa/pink
    text: "#ffffff",
    muted: "#cbd5e1",
    taglineBg: "rgba(255, 255, 255, 0.1)",
    taglineText: "#ffffff",
    taglineBorder: "rgba(255, 255, 255, 0.2)",
  },
  light: {
    bg: "#f8fafc",
    panelBg: "rgba(255, 255, 255, 0.96)",
    panelBorder: "rgba(15, 23, 42, 0.08)",
    primary: "#2563eb", // azul forte
    accent: "#16a34a", // verde forte
    text: "#0f172a",
    muted: "#64748b",
    taglineBg: "rgba(241, 245, 249, 0.9)",
    taglineText: "#0f172a",
    taglineBorder: "rgba(37, 99, 235, 0.2)",
  }
};

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = req.nextUrl;
  const formato = searchParams.get("formato") || "feed";
  const tema = searchParams.get("tema") || "neon";

  const config = TEMAS[tema as keyof typeof TEMAS] || TEMAS.neon;

  const item = await getAnuncio(id);
  if (!item) {
    return new Response("Anúncio não encontrado", { status: 404 });
  }

  const marca = item.marca || "";
  const modelo = item.modelo || item.titulo || "Veículo";
  const ano = item.ano_modelo || item.ano_fabricacao || "";
  const tituloAnuncio = [marca, modelo, ano ? `ano ${ano}` : ""].filter(Boolean).join(" ");
  const preco = money(item.preco);
  const local = [item.cidade, item.estado].filter(Boolean).join("/");
  const details = [item.carroceria, item.tracao].filter(Boolean).join(" • ");

  const tagline = await gerarTaglineIA(tituloAnuncio, preco, local, item.descricao || "");

  const images = (item.truck_images || []) as Array<{ image_url: string; principal?: boolean; ordem?: number }>;
  const mainImageRaw =
    images.find((i) => i.principal)?.image_url ??
    images.sort((a, b) => (a.ordem ?? 99) - (b.ordem ?? 99))[0]?.image_url ??
    null;
  const mainImage = formatImageUrl(mainImageRaw);

  const slug = gerarSlugComId({
    id: item.id,
    marca: item.marca,
    modelo: item.modelo,
    ano_modelo: item.ano_modelo,
    ano_fabricacao: item.ano_fabricacao,
    cidade: item.cidade,
    estado: item.estado,
  });
  const linkAnuncio = `${siteUrl}/anuncios/${slug}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(linkAnuncio)}`;

  // ==================== FORMATO: FEED (1080x1080) ====================
  if (formato === "feed") {
    return new ImageResponse(
      (
        <div style={{ width: 1080, height: 1080, display: "flex", flexDirection: "column", background: config.bg, position: "relative", overflow: "hidden", fontFamily: "system-ui, sans-serif" }}>

          {/* Imagem de Fundo (A foto REAL do caminhão) */}
          {mainImage && (
            <img src={mainImage} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 750, objectFit: "cover" }} />
          )}

          {/* Sombra de transição e escurecimento */}
          <div style={{ position: "absolute", left: 0, top: 400, width: 1080, height: 350, display: "flex", backgroundImage: `linear-gradient(to bottom, rgba(6, 9, 19, 0) 0%, ${config.bg} 100%)` }} />

          {/* Tagline IA - Topo Esquerdo */}
          <div style={{ position: "absolute", left: 40, top: 40, display: "flex", alignItems: "center", gap: 12, padding: "14px 28px", background: config.taglineBg, borderRadius: 99, border: `1px solid ${config.taglineBorder}`, backdropFilter: "blur(12px)" }}>
            {starIcon(config.accent)}
            <span style={{ color: config.taglineText, fontWeight: "600", fontSize: 16 }}>"{tagline}"</span>
          </div>

          {/* Painel Flutuante Principal no Rodapé */}
          <div style={{ position: "absolute", left: 40, bottom: 40, width: 1000, height: 300, display: "flex", flexDirection: "row", background: config.panelBg, border: `1px solid ${config.panelBorder}`, borderRadius: 24, padding: "32px", justifyContent: "space-between", backdropFilter: tema === "glass" ? "blur(16px)" : undefined }}>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 620 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {truckIcon(config.accent)}
                  <span style={{ color: config.accent, fontWeight: "800", fontSize: 16, letterSpacing: 1.5 }}>CAMINHÕES À VENDA</span>
                </div>
                <span style={{ color: config.text, fontWeight: "800", fontSize: 38, lineHeight: 1.15, marginTop: 10 }}>{tituloAnuncio.slice(0, 36)}</span>
                {details && <span style={{ color: config.muted, fontSize: 18, fontWeight: "500" }}>{details}</span>}
              </div>

              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 20 }}>
                <div style={{ display: "flex", padding: "12px 28px", background: config.primary, borderRadius: 14 }}>
                  <span style={{ color: "#ffffff", fontWeight: "900", fontSize: 30 }}>{preco}</span>
                </div>
                <span style={{ color: config.text, fontWeight: "600", fontSize: 22 }}>📍 {local}</span>
              </div>
            </div>

            {/* QR Code Container */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(255, 255, 255, 0.03)", padding: "16px", borderRadius: 16, border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ display: "flex", background: "#ffffff", padding: 8, borderRadius: 12 }}>
                <img src={qrUrl} style={{ width: 130, height: 130 }} />
              </div>
              <span style={{ color: config.muted, fontWeight: "600", fontSize: 12 }}>Escaneie para ver fotos reais</span>
            </div>

          </div>
        </div>
      ),
      { width: 1080, height: 1080 }
    );
  }

  // ==================== FORMATO: STORY (1080x1920) ====================
  if (formato === "story") {
    return new ImageResponse(
      (
        <div style={{ width: 1080, height: 1920, display: "flex", flexDirection: "column", background: config.bg, position: "relative", overflow: "hidden", fontFamily: "system-ui, sans-serif", padding: "80px 40px" }}>

          {/* Header Superior Premium */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {truckIcon(config.accent)}
              <span style={{ color: config.accent, fontWeight: "800", fontSize: 22, letterSpacing: 2 }}>CAMINHÕES À VENDA</span>
            </div>
            <span style={{ color: config.text, fontWeight: "900", fontSize: 48, textAlign: "center", marginTop: 12, lineHeight: 1.15 }}>{tituloAnuncio.slice(0, 36)}</span>
            {details && <span style={{ color: config.muted, fontSize: 24, fontWeight: "500" }}>{details}</span>}
          </div>

          {/* Imagem Central (A foto REAL) */}
          {mainImage && (
            <div style={{ display: "flex", width: 1000, height: 950, borderRadius: 32, overflow: "hidden", border: `1px solid ${config.panelBorder}`, position: "relative" }}>
              <img src={mainImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} />

              {/* Tagline IA no Story (Selo flutuante) */}
              <div style={{ position: "absolute", left: 24, bottom: 24, display: "flex", alignItems: "center", gap: 12, padding: "14px 28px", background: config.taglineBg, borderRadius: 99, border: `1px solid ${config.taglineBorder}`, backdropFilter: "blur(10px)" }}>
                {starIcon(config.accent)}
                <span style={{ color: config.taglineText, fontWeight: "600", fontSize: 16 }}>"{tagline}"</span>
              </div>
            </div>
          )}

          {/* Informações Inferiores */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40, gap: 12, flex: 1, justifyContent: "center" }}>
            <span style={{ color: config.primary, fontWeight: "900", fontSize: 72, lineHeight: 1 }}>{preco}</span>
            <span style={{ color: config.muted, fontWeight: "600", fontSize: 28 }}>📍 {local}</span>

            {/* QR Code Container */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 40, background: "rgba(255, 255, 255, 0.03)", padding: "24px", borderRadius: 24, border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ display: "flex", background: "#ffffff", padding: 10, borderRadius: 16 }}>
                <img src={qrUrl} style={{ width: 140, height: 140 }} />
              </div>
              <span style={{ color: config.muted, fontWeight: "600", fontSize: 16 }}>Escaneie para mais fotos reais</span>
            </div>
          </div>

        </div>
      ),
      { width: 1080, height: 1920 }
    );
  }

  // ==================== FORMATO PADRÃO (HORIZONTAL / WHATSAPP) (1200x630) ====================
  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", flexDirection: "row", background: config.bg, position: "relative", overflow: "hidden", fontFamily: "system-ui, sans-serif" }}>

        {mainImage && (
          <img src={mainImage} style={{ width: 700, height: 630, objectFit: "cover" }} />
        )}

        {/* Detalhes do Anúncio (Lado Direito) */}
        <div style={{ display: "flex", flexDirection: "column", width: 500, height: 630, padding: "48px 40px", justifyContent: "space-between", background: config.panelBg, borderLeft: `1px solid ${config.panelBorder}` }}>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {truckIcon(config.accent)}
              <span style={{ color: config.accent, fontWeight: "800", fontSize: 14, letterSpacing: 1.5 }}>CAMINHÕES À VENDA</span>
            </div>

            <span style={{ color: config.text, fontWeight: "800", fontSize: 30, lineHeight: 1.15 }}>{tituloAnuncio.slice(0, 36)}</span>

            {details && (
              <span style={{ color: config.muted, fontSize: 16, fontWeight: "600" }}>{details}</span>
            )}

            {/* Tagline IA no WhatsApp */}
            <span style={{ color: config.accent, fontSize: 15, fontWeight: "700", marginTop: 8 }}>✨ {tagline}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ color: config.primary, fontWeight: "900", fontSize: 42, lineHeight: 1 }}>{preco}</span>
            <span style={{ color: config.muted, fontWeight: "600", fontSize: 18 }}>📍 {local}</span>
          </div>

          {/* QR Code Container */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 20, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24 }}>
            <div style={{ display: "flex", background: "#ffffff", padding: 6, borderRadius: 10 }}>
              <img src={qrUrl} style={{ width: 90, height: 90 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ color: config.text, fontWeight: "bold", fontSize: 15 }}>Aponte a câmera</span>
              <span style={{ color: config.muted, fontSize: 13 }}>Veja fotos reais e detalhes</span>
            </div>
          </div>

        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}