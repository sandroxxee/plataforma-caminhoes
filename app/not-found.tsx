import Link from "next/link";

export default function NotFound() {
  const whatsappUrl =
    "https://wa.me/5549999362681?text=Ol%C3%A1%2C%20vim%20pelo%20site%20Caminh%C3%B5es%20%C3%A0%20Venda%20e%20preciso%20de%20ajuda.";

  return (
    <main className="market-page">
      <section
        className="market-container"
        style={{
          minHeight: "calc(100vh - 160px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 42,
          paddingBottom: 42,
        }}
      >
        <div
          className="market-section"
          style={{
            width: "100%",
            maxWidth: 760,
            textAlign: "center",
            padding: "clamp(28px, 5vw, 48px)",
          }}
        >
          <span
            className="stock-eyebrow"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              marginBottom: 14,
            }}
          >
            Erro 404
          </span>

          <h1
            style={{
              margin: "0 0 12px",
              fontSize: "clamp(34px, 6vw, 58px)",
              lineHeight: 1.02,
              letterSpacing: "-0.045em",
            }}
          >
            Página não encontrada
          </h1>

          <p
            style={{
              maxWidth: 590,
              margin: "0 auto 10px",
              color: "var(--muted)",
              fontSize: 17,
              fontWeight: 750,
              lineHeight: 1.6,
            }}
          >
            O link que você tentou acessar pode estar errado, vencido ou o anúncio
            pode não estar mais disponível.
          </p>

          <p
            style={{
              maxWidth: 560,
              margin: "0 auto",
              color: "var(--muted)",
              fontSize: 15,
              fontWeight: 700,
              lineHeight: 1.55,
            }}
          >
            Continue navegando pelo Caminhões à Venda ou fale conosco pelo WhatsApp.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 26,
            }}
          >
            <Link
              href="/anuncios"
              style={{
                minHeight: 48,
                minWidth: 152,
                padding: "0 18px",
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--blue)",
                color: "#fff",
                fontWeight: 950,
              }}
            >
              Ver anúncios
            </Link>

            <Link
              href="/anunciar"
              style={{
                minHeight: 48,
                minWidth: 152,
                padding: "0 18px",
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--soft)",
                border: "1px solid var(--line)",
                color: "var(--text)",
                fontWeight: 950,
              }}
            >
              Anunciar
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                minHeight: 48,
                minWidth: 152,
                padding: "0 18px",
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--wa)",
                color: "#073b1d",
                fontWeight: 950,
              }}
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
