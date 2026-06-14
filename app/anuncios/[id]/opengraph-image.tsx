import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const alt = "Caminhão à venda";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const UUID_REGEX = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const SHORT_ID_REGEX = /-([a-f0-9]{8})$/;

async function getTruck(id: string) {
  const supabase = await createClient();
  const value = id.trim().toLowerCase();

  if (UUID_REGEX.test(value)) {
    const { data } = await supabase
      .from("trucks")
      .select("id,titulo,marca,modelo,ano_modelo,preco,cidade,estado,truck_images(image_url,principal,ordem)")
      .eq("id", value)
      .eq("status", "aprovado")
      .maybeSingle();
    return data;
  }

  const shortIdMatch = value.match(SHORT_ID_REGEX);
  if (shortIdMatch) {
    const { data } = await supabase
      .rpc("find_truck_by_short_id", { short_id: shortIdMatch[1] });
    if (data && data.length > 0) {
      const truck = data[0];
      const { data: images } = await supabase
        .from("truck_images")
        .select("image_url,principal,ordem")
        .eq("truck_id", truck.id)
        .order("ordem", { ascending: true });
      return { ...truck, truck_images: images || [] };
    }
  }

  return null;
}

function formatPrice(preco: unknown) {
  const n = Number(preco);
  if (!n || !Number.isFinite(n)) return "Preço sob consulta";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const truck = await getTruck(id);

  const marca = truck?.marca || "";
  const modelo = truck?.modelo || truck?.titulo || "Caminhão";
  const ano = truck?.ano_modelo ? String(truck.ano_modelo) : "";
  const cidade = truck?.cidade || "";
  const estado = truck?.estado || "";
  const titulo = [marca, modelo, ano].filter(Boolean).join(" ");
  const local = [cidade, estado].filter(Boolean).join("/");
  const preco = formatPrice(truck?.preco);

  const images = (truck?.truck_images || []) as Array<{ image_url: string; principal?: boolean; ordem?: number }>;
  const mainImage =
    images.find((i) => i.principal)?.image_url ||
    images.sort((a, b) => (a.ordem ?? 99) - (b.ordem ?? 99))[0]?.image_url ||
    null;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          background: "#0a0f14",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {mainImage && (
          <img
            src={mainImage}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.45,
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.15) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 36,
            left: 48,
            background: "rgba(34,197,94,0.18)",
            border: "1.5px solid rgba(34,197,94,0.5)",
            borderRadius: 999,
            padding: "6px 18px",
            color: "#86efac",
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: 2,
            display: "flex",
          }}
        >
          🚛 CAMINHÕES À VENDA
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "0 48px 42px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {local && (
            <div style={{ color: "#94a3b8", fontSize: 24, fontWeight: 700, display: "flex" }}>
              📍 {local}
            </div>
          )}

          <div
            style={{
              color: "#ffffff",
              fontSize: titulo.length > 30 ? 48 : 58,
              fontWeight: 900,
              lineHeight: 1.1,
              display: "flex",
              letterSpacing: -1,
            }}
          >
            {titulo || "Caminhão à venda"}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 6 }}>
            <div
              style={{
                color: "#22c55e",
                fontSize: 42,
                fontWeight: 900,
                letterSpacing: -1,
                display: "flex",
              }}
            >
              {preco}
            </div>

            <div
              style={{
                background: "#22c55e",
                color: "#052e16",
                borderRadius: 12,
                padding: "10px 24px",
                fontSize: 22,
                fontWeight: 900,
                display: "flex",
              }}
            >
              Ver anúncio →
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
