import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";
import { extrairIdDoParametroAnuncio } from "@/lib/slug";
import { formatImageUrl } from "@/lib/truck-utils";

export const alt         = "Máquina à venda";
export const size        = { width: 1200, height: 630 };
export const contentType = "image/png";

async function getAnuncio(id: string) {
  const supabase = await createClient();
  const { tipo, valor } = extrairIdDoParametroAnuncio(id);
  if (tipo !== "uuid") return null;
  const { data } = await supabase
    .from("trucks")
    .select("id,titulo,marca,modelo,ano_modelo,preco,cidade,estado,truck_images(image_url,principal,ordem)")
    .eq("id", valor).eq("status", "aprovado").maybeSingle();
  return data ?? null;
}

function formatPrice(preco: unknown) {
  const n = Number(preco);
  if (!n || !Number.isFinite(n)) return null;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getAnuncio(id);

  const marca  = item?.marca  || "";
  const modelo = item?.modelo || item?.titulo || "Máquina";
  const ano    = item?.ano_modelo ? String(item.ano_modelo) : "";
  const cidade = item?.cidade || "";
  const estado = item?.estado || "";
  const titulo = [marca, modelo, ano].filter(Boolean).join(" ");
  const local  = [cidade, estado].filter(Boolean).join(" / ");
  const preco  = formatPrice(item?.preco);
  const tituloSize = titulo.length > 35 ? 44 : titulo.length > 25 ? 52 : 60;

  const images = (item?.truck_images || []) as Array<{ image_url: string; principal?: boolean; ordem?: number }>;
  const mainImageRaw =
    images.find((i) => i.principal)?.image_url ??
    images.sort((a, b) => (a.ordem ?? 99) - (b.ordem ?? 99))[0]?.image_url ?? null;
  const mainImage = formatImageUrl(mainImageRaw);

  return new ImageResponse(
    (
      <div style={{ width: 1200, height: 630, display: "flex", background: "#050d18", position: "relative", overflow: "hidden", fontFamily: "system-ui, sans-serif" }}>
        {mainImage && (
          <img src={mainImage} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.38 }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(5,13,24,0.97) 0%, rgba(5,13,24,0.80) 42%, rgba(5,13,24,0.30) 100%)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: "linear-gradient(to bottom, #f97316, #ea580c)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "44px 56px 44px 62px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 2px 12px rgba(249,115,22,.5)" }}>
              <div style={{ color: "#fff", fontSize: 22, display: "flex" }}>🏗️</div>
            </div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 22, display: "flex", letterSpacing: -0.3 }}>
              Caminhões <span style={{ color: "#fb923c", marginLeft: 6 }}>à Venda</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {marca && (
              <div style={{ display: "flex" }}>
                <div style={{ display: "flex", padding: "5px 16px", borderRadius: 999, background: "rgba(249,115,22,0.18)", border: "1.5px solid rgba(251,146,60,0.4)", color: "#fb923c", fontWeight: 900, fontSize: 18, letterSpacing: 1 }}>
                  {marca.toUpperCase()}
                </div>
              </div>
            )}
            <div style={{ color: "#fff", fontWeight: 900, fontSize: tituloSize, lineHeight: 1.08, display: "flex", letterSpacing: -1.5, maxWidth: 720 }}>
              {titulo || "Máquina à venda"}
            </div>
            {local && (
              <div style={{ color: "#94a3b8", fontSize: 22, fontWeight: 700, display: "flex", gap: 8 }}>
                <span style={{ display: "flex" }}>📍</span> {local}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {preco ? (
                <>
                  <div style={{ color: "#64748b", fontSize: 15, fontWeight: 700, display: "flex" }}>PREÇO</div>
                  <div style={{ color: "#22c55e", fontWeight: 900, fontSize: 46, lineHeight: 1, display: "flex", letterSpacing: -1.5 }}>{preco}</div>
                </>
              ) : (
                <div style={{ color: "#94a3b8", fontSize: 22, fontWeight: 700, display: "flex" }}>Preço sob consulta</div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 28px", borderRadius: 16, background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 4px 20px rgba(249,115,22,.45)" }}>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 20, display: "flex" }}>Ver anúncio →</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
