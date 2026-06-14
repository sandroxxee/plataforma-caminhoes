import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const marca = searchParams.get("marca") || "";
  const estado = searchParams.get("estado") || "";
  const titulo = searchParams.get("titulo") || "";
  const preco = searchParams.get("preco") || "";
  const imagem = searchParams.get("img") || "";

  const heading = titulo || (marca && estado ? `${marca} em ${estado}` : marca || (estado ? `Caminhões em ${estado}` : "Caminhões à Venda"));
  const sub = preco ? `R$ ${Number(preco).toLocaleString("pt-BR")}` : (marca && !titulo ? `Ver todos os ${marca} à venda` : "Anuncie ou encontre o seu caminhão");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1877f2 100%)",
          padding: "60px 72px", justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#1877f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
            🚛
          </div>
          <span style={{ color: "rgba(255,255,255,.7)", fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>caminhoesavenda.com</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {imagem && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagem} alt="" style={{ position: "absolute", right: 0, top: 0, height: "100%", width: "45%", objectFit: "cover", opacity: 0.25 }} />
          )}
          <div style={{ display: "flex" }}>
            <span style={{ background: "rgba(24,119,242,.25)", border: "1px solid rgba(24,119,242,.5)", color: "#93c5fd", fontSize: 14, fontWeight: 900, padding: "4px 14px", borderRadius: 999, letterSpacing: ".06em", textTransform: "uppercase" }}>
              {estado ? `Estado: ${estado}` : marca ? `Marca: ${marca}` : "Plataforma"}
            </span>
          </div>
          <div style={{ color: "#fff", fontSize: 58, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.04em", maxWidth: 700 }}>
            {heading}
          </div>
          <div style={{ color: "rgba(255,255,255,.65)", fontSize: 26, fontWeight: 700 }}>
            {sub}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "rgba(255,255,255,.45)", fontSize: 16, fontWeight: 700 }}>A maior plataforma de caminhões do Brasil</span>
          <span style={{ background: "#1877f2", color: "#fff", fontSize: 16, fontWeight: 900, padding: "8px 20px", borderRadius: 999 }}>Ver anúncios →</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
