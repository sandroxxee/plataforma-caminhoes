import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extrairIdDoParametroAnuncio, gerarSlugComId } from "@/lib/slug";
import { formatImageUrl } from "@/lib/truck-utils";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

const siteUrl = "https://caminhoesavenda.com";

function money(value: number | null) {
  if (!value) return "Sob consulta";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

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
  if (!apiKey) return "Caminhão pronto para pegar a estrada!";

  const ai = new GoogleGenAI({ apiKey });
  try {
    const promise = ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Gere uma única frase comercial curta e muito impactante (máximo de 42 caracteres) para divulgar a venda deste veículo no Instagram/WhatsApp. Use um gatilho de venda rápido. Exemplos: 'Caminhão impecável pronto para trabalhar!', 'Excelente custo-benefício, confira!', 'Scania robusto em ótimo estado!'. Não use aspas na resposta.

Veículo: ${titulo}
Preço: ${preco}
Local: ${local}
Descrição: ${descricao.slice(0, 200)}`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 40,
      }
    });

    // Timeout de 1.1s para não travar a geração da imagem
    const timeout = new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1100));

    const response = await Promise.race([promise, timeout]);
    if (response && response.text) {
      return response.text.trim().replace(/^["']|["']$/g, "");
    }
  } catch (error) {
    console.error("Erro ao gerar tagline com Gemini:", error);
  }

  // Fallbacks locais caso a IA falhe ou estoure o timeout
  if (titulo.toLowerCase().includes("scania")) return "Robustez e potência para a sua frota!";
  if (titulo.toLowerCase().includes("volvo")) return "Tecnologia, conforto e alta performance!";
  if (titulo.toLowerCase().includes("mercedes") || titulo.toLowerCase().includes("atego") || titulo.toLowerCase().includes("actros")) return "Qualidade e durabilidade garantidas!";
  if (titulo.toLowerCase().includes("vw") || titulo.toLowerCase().includes("constellation")) return "Excelente caminhão para puxar sua carga!";
  return "Oportunidade única para o seu trabalho!";
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = req.nextUrl;
  const formato = searchParams.get("formato") || "feed";

  const item = await getAnuncio(id);
  if (!item) {
    return new Response("Anúncio não encontrado", { status: 404 });
  }

  const marca = item.marca || "";
  const modelo = item.modelo || item.titulo || "Veículo";
  const ano = item.ano_modelo || item.ano_fabricacao || "";
  const titulo = [marca, modelo, ano ? `ano ${ano}` : ""].filter(Boolean).join(" ");
  const preco = money(item.preco);
  const local = [item.cidade, item.estado].filter(Boolean).join("/");
  const details = [item.carroceria, item.tracao].filter(Boolean).join(" • ");

  // Gerar tagline comercial usando o Gemini
  const tagline = await gerarTaglineIA(titulo, preco, local, item.descricao || "");

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

  const truckIcon = (color: string) => (
    <div style={{ display: "flex", alignItems: "center", position: "relative", width: 50, height: 30 }}>
      <div style={{ display: "flex", width: 22, height: 18, borderRadius: 3, background: color, position: "absolute", right: 0, top: 6 }} />
      <div style={{ display: "flex", width: 6, height: 6, background: "#ffffff", position: "absolute", right: 2, top: 9 }} />
      <div style={{ display: "flex", width: 24, height: 24, background: color, position: "absolute", left: 0, top: 0 }} />
      <div style={{ display: "flex", width: 8, height: 8, borderRadius: 99, background: "#000000", position: "absolute", left: 4, bottom: -2 }} />
      <div style={{ display: "flex", width: 8, height: 8, borderRadius: 99, background: "#000000", position: "absolute", left: 14, bottom: -2 }} />
      <div style={{ display: "flex", width: 8, height: 8, borderRadius: 99, background: "#000000", position: "absolute", right: 4, bottom: -2 }} />
    </div>
  );

  if (formato === "feed") {
    return new ImageResponse(
      (
        <div style={{ width: 1080, height: 1080, display: "flex", flexDirection: "column", background: "#080c16", position: "relative", overflow: "hidden", fontFamily: "system-ui, sans-serif" }}>
          {mainImage && (
            <img src={mainImage} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 750, objectFit: "cover" }} />
          )}

          <div style={{ position: "absolute", left: 0, top: 480, width: 1080, height: 270, display: "flex", background: "linear-gradient(to bottom, transparent 0%, #080c16 100%)" }} />

          <div style={{ position: "absolute", inset: 20, display: "flex", border: "4px solid rgba(59, 130, 246, 0.4)", pointerEvents: "none" }} />

          {/* Tagline IA no topo do Feed */}
          <div style={{ position: "absolute", left: 40, top: 40, display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "rgba(16, 185, 129, 0.95)", borderRadius: 99, border: "1.5px solid #10b981", boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>
            <span style={{ color: "#ffffff", fontWeight: 900, fontSize: 16, letterSpacing: 0.5 }}>✨ RECOMENDADO IA</span>
            <span style={{ color: "#ffffff", fontWeight: "bold", fontSize: 16 }}>| "{tagline}"</span>
          </div>

          <div style={{ position: "absolute", left: 40, bottom: 40, width: 1000, height: 300, display: "flex", flexDirection: "row", background: "#111827", borderRadius: 16, padding: "24px 32px", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 620 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {truckIcon("#3b82f6")}
                  <span style={{ color: "#3b82f6", fontWeight: "bold", fontSize: 20, letterSpacing: 0.5 }}>CAMINHÕES À VENDA</span>
                </div>
                <span style={{ color: "#ffffff", fontWeight: "bold", fontSize: 36, lineHeight: 1.1 }}>{titulo.slice(0, 36)}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex", padding: "10px 24px", background: "#10b981", borderRadius: 12 }}>
                  <span style={{ color: "#ffffff", fontWeight: 900, fontSize: 32 }}>{preco}</span>
                </div>
                <span style={{ color: "#94a3b8", fontWeight: "600", fontSize: 24 }}>📍 {local}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ display: "flex", background: "#ffffff", padding: 8, borderRadius: 12 }}>
                <img src={qrUrl} style={{ width: 160, height: 160 }} />
              </div>
              <span style={{ color: "#64748b", fontWeight: "600", fontSize: 14 }}>Consulte fotos no site</span>
            </div>
          </div>
        </div>
      ),
      { width: 1080, height: 1080 }
    );
  }

  if (formato === "story") {
    return new ImageResponse(
      (
        <div style={{ width: 1080, height: 1920, display: "flex", flexDirection: "column", background: "#080c16", position: "relative", overflow: "hidden", fontFamily: "system-ui, sans-serif", padding: "80px 40px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {truckIcon("#eab308")}
              <span style={{ color: "#eab308", fontWeight: "bold", fontSize: 24, letterSpacing: 0.5 }}>CAMINHÕES À VENDA</span>
            </div>
            <span style={{ color: "#94a3b8", fontWeight: "bold", fontSize: 18 }}>VEÍCULO DISPONÍVEL</span>
            <span style={{ color: "#ffffff", fontWeight: "bold", fontSize: 44, textAlign: "center", marginTop: 10, lineHeight: 1.1 }}>{titulo.slice(0, 36)}</span>
          </div>

          {mainImage && (
            <div style={{ display: "flex", width: 1000, height: 920, borderRadius: 24, overflow: "hidden", border: "4px solid #eab308" }}>
              <img src={mainImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          {/* Destaque IA no Story */}
          <div style={{ display: "flex", alignSelf: "center", alignItems: "center", gap: 8, padding: "12px 24px", background: "rgba(234, 179, 8, 0.95)", borderRadius: 99, border: "1.5px solid #eab308", marginTop: 30, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}>
            <span style={{ color: "#000000", fontWeight: 950, fontSize: 18, letterSpacing: 0.5 }}>✨ ANÁLISE IA</span>
            <span style={{ color: "#000000", fontWeight: "bold", fontSize: 18 }}>| "{tagline}"</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 30, gap: 10, flex: 1, justifyContent: "center" }}>
            <span style={{ color: "#10b981", fontWeight: 900, fontSize: 80, lineHeight: 1 }}>{preco}</span>
            <span style={{ color: "#94a3b8", fontWeight: "600", fontSize: 32 }}>📍 {local}</span>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginTop: 40 }}>
              <div style={{ display: "flex", background: "#ffffff", padding: 8, borderRadius: 12 }}>
                <img src={qrUrl} style={{ width: 150, height: 150 }} />
              </div>
              <span style={{ color: "#64748b", fontWeight: "600", fontSize: 18 }}>Aponte a câmera para ver mais fotos</span>
            </div>
          </div>
        </div>
      ),
      { width: 1080, height: 1920 }
    );
  }

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", flexDirection: "row", background: "#0f172a", position: "relative", overflow: "hidden", fontFamily: "system-ui, sans-serif" }}>
        {mainImage && (
          <img src={mainImage} style={{ width: 720, height: 630, objectFit: "cover" }} />
        )}

        <div style={{ width: 6, height: 630, background: "#eab308" }} />

        <div style={{ display: "flex", flexDirection: "column", width: 474, height: 630, padding: "40px 32px", justifyContent: "space-between", background: "#0f172a" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {truckIcon("#3b82f6")}
              <span style={{ color: "#3b82f6", fontWeight: "bold", fontSize: 16, letterSpacing: 0.5 }}>CAMINHÕES À VENDA</span>
            </div>
            <span style={{ color: "#ffffff", fontWeight: "bold", fontSize: 32, lineHeight: 1.15 }}>{titulo.slice(0, 32)}</span>
            {details && (
              <span style={{ color: "#94a3b8", fontSize: 18, fontWeight: "600" }}>{details}</span>
            )}
            
            {/* Tagline IA no formato Whatsapp */}
            <span style={{ color: "#38bdf8", fontSize: 15, fontWeight: "700", marginTop: 4 }}>✨ {tagline}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ color: "#10b981", fontWeight: 900, fontSize: 44, lineHeight: 1 }}>{preco}</span>
            <span style={{ color: "#94a3b8", fontWeight: "600", fontSize: 20 }}>📍 {local}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 16, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
            <div style={{ display: "flex", background: "#ffffff", padding: 6, borderRadius: 8 }}>
              <img src={qrUrl} style={{ width: 100, height: 100 }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ color: "#ffffff", fontWeight: "bold", fontSize: 15 }}>Aponte para</span>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>ver fotos reais</span>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>e negociar</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
