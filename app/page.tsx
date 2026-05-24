import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type TruckImage = {
  image_url: string | null;
  principal: boolean | null;
  ordem: number | null;
};

type Truck = {
  id: string;
  titulo: string | null;
  marca: string | null;
  modelo: string | null;
  ano_modelo: number | null;
  ano_fabricacao: number | null;
  preco: number | null;
  cidade: string | null;
  estado: string | null;
  carroceria: string | null;
  tracao: string | null;
  whatsapp: string | null;
  truck_images?: TruckImage[];
};

function formatMoney(value: number | null) {
  if (!value) return "Sob consulta";

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function getImage(truck: Truck) {
  const images = [...(truck.truck_images || [])].sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
  return images.find((img) => img.principal && img.image_url)?.image_url || images[0]?.image_url || "";
}

function getTitle(truck: Truck) {
  return truck.titulo || `${truck.marca || ""} ${truck.modelo || ""}`.trim() || "Caminhão anunciado";
}

function getWhatsappLink(truck: Truck) {
  const phone = (truck.whatsapp || "").replace(/\D/g, "");
  const text = encodeURIComponent(`Olá, tenho interesse no caminhão ${getTitle(truck)}.`);
  return phone ? `https://wa.me/${phone}?text=${text}` : `/anuncios/${truck.id}`;
}

export default async function HomePage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("trucks")
    .select(`
      id,
      titulo,
      marca,
      modelo,
      ano_modelo,
      ano_fabricacao,
      preco,
      cidade,
      estado,
      carroceria,
      tracao,
      whatsapp,
      truck_images (
        image_url,
        principal,
        ordem
      )
    `)
    .eq("status", "aprovado")
    .order("created_at", { ascending: false })
    .limit(5);

  const trucks = (data || []) as Truck[];

  return (
    <main className="home-page">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Caminhões em Oferta">
          <span className="brand-mark">🚛</span>
          <span>
            <strong>CAMINHÕES</strong>
            <small>EM OFERTA</small>
          </span>
        </Link>

        <nav className="top-actions" aria-label="Menu principal">
          <Link href="/login" className="btn ghost">Entrar</Link>
          <Link href="/cadastro" className="btn primary">＋ Anunciar</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">COMPRA • VENDA • TROCA</span>
          <h1>O jeito mais simples de negociar caminhões.</h1>
          <p>
            Encontre ofertas reais ou anuncie seu caminhão hoje. Direto ao ponto,
            direto no WhatsApp.
          </p>

          <div className="hero-actions">
            <Link href="/anuncios" className="btn big primary">🔍 Ver estoque</Link>
            <Link href="/cadastro" className="btn big ghost">＋ Quero anunciar</Link>
          </div>
        </div>

        <div className="hero-visual" aria-label="Caminhão em destaque">
          <div className="truck-shape">
            <div className="truck-cabin" />
            <div className="truck-body" />
            <span className="wheel wheel-a" />
            <span className="wheel wheel-b" />
            <span className="wheel wheel-c" />
          </div>
          <div className="road" />
        </div>
      </section>

      <form className="quick-filter" action="/anuncios">
        <select name="marca" aria-label="Marca">
          <option value="">Marca</option>
          <option>Mercedes-Benz</option>
          <option>Volkswagen</option>
          <option>Volvo</option>
          <option>Scania</option>
          <option>Ford</option>
          <option>Iveco</option>
          <option>DAF</option>
        </select>

        <input name="modelo" placeholder="Modelo" aria-label="Modelo" />

        <select name="tracao" aria-label="Tração">
          <option value="">Tração</option>
          <option>4x2</option>
          <option>6x2</option>
          <option>6x4</option>
          <option>8x2</option>
          <option>8x4</option>
        </select>

        <button type="submit">🔍 Buscar</button>
      </form>

      <section className="section-head">
        <div>
          <span className="eyebrow small">Adicionados recentemente</span>
          <h2>Últimos caminhões aprovados</h2>
        </div>
        <Link href="/anuncios">Ver todos</Link>
      </section>

      <section className="truck-grid">
        {trucks.length > 0 ? (
          trucks.map((truck) => {
            const image = getImage(truck);
            const title = getTitle(truck);

            return (
              <article className="truck-card" key={truck.id}>
                <Link href={`/anuncios/${truck.id}`} className="photo">
                  {image ? <img src={image} alt={title} /> : <span>Sem foto</span>}
                </Link>

                <div className="card-content">
                  <Link href={`/anuncios/${truck.id}`} className="truck-title">
                    {title}
                  </Link>

                  <div className="tags">
                    <span>{truck.ano_modelo || truck.ano_fabricacao || "Ano"}</span>
                    <span>{truck.tracao || "Tração"}</span>
                    <span>{truck.carroceria || "Carroceria"}</span>
                  </div>

                  <strong className="price">{formatMoney(truck.preco)}</strong>

                  <small className="city">
                    {truck.cidade || "Cidade"}{truck.estado ? `/${truck.estado}` : ""}
                  </small>

                  {truck.whatsapp ? (
                    <a href={getWhatsappLink(truck)} target="_blank" className="whats">
                      Chamar no WhatsApp 💬
                    </a>
                  ) : (
                    <Link href={`/anuncios/${truck.id}`} className="whats secondary">
                      Ver detalhes
                    </Link>
                  )}
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty">
            <h3>Nenhum caminhão aprovado ainda.</h3>
            <p>Assim que os anúncios forem aprovados, eles aparecem aqui automaticamente.</p>
          </div>
        )}
      </section>

      <section className="sell-box">
        <div>
          <span className="eyebrow small">Para vendedores</span>
          <h2>Tem um caminhão para vender?</h2>
          <p>Anuncie em poucos minutos e receba contatos direto pelo WhatsApp.</p>
        </div>
        <Link href="/cadastro" className="btn primary big">＋ Começar anúncio</Link>
      </section>

      <footer className="footer">
        <strong>Caminhões em Oferta</strong>
        <span>Plataforma de anúncios de caminhões. Negociações direto com o anunciante.</span>
        <div>
          <Link href="/anuncios">Estoque</Link>
          <Link href="/cadastro">Anunciar</Link>
          <Link href="/login">Entrar</Link>
        </div>
      </footer>

      <style>{`
        .home-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 18% 8%, rgba(34,197,94,.18), transparent 30%),
            radial-gradient(circle at 80% 28%, rgba(34,197,94,.10), transparent 28%),
            linear-gradient(135deg, #020617 0%, #061512 58%, #020617 100%);
          color: white;
          overflow-x: hidden;
        }

        .topbar {
          width: min(1180px, calc(100vw - 32px));
          height: 82px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(2,6,23,.74);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
          letter-spacing: -.02em;
          min-width: 0;
        }

        .brand-mark {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          display: grid;
          place-items: center;
          background: #22c55e;
          box-shadow: 0 14px 35px rgba(34,197,94,.28);
          flex: 0 0 auto;
        }

        .brand strong,
        .brand small {
          display: block;
          line-height: 1;
        }

        .brand strong {
          font-size: 15px;
          font-weight: 950;
        }

        .brand small {
          margin-top: 4px;
          color: #86efac;
          font-size: 13px;
          font-weight: 900;
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn {
          min-height: 46px;
          padding: 0 18px;
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-weight: 900;
          border: 1px solid rgba(255,255,255,.12);
          white-space: nowrap;
        }

        .btn.primary {
          background: #22c55e;
          color: #052e16;
          border-color: transparent;
        }

        .btn.ghost {
          background: rgba(255,255,255,.06);
          color: white;
        }

        .btn.big {
          min-height: 54px;
          padding: 0 22px;
          border-radius: 18px;
        }

        .hero {
          width: min(1180px, calc(100vw - 32px));
          min-height: 520px;
          margin: 34px auto 22px;
          display: grid;
          grid-template-columns: 1.05fr .95fr;
          gap: 34px;
          align-items: center;
        }

        .hero-copy {
          padding: 34px 0;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 13px;
          border-radius: 999px;
          color: #86efac;
          background: rgba(34,197,94,.12);
          border: 1px solid rgba(34,197,94,.22);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .eyebrow.small {
          min-height: 30px;
          font-size: 11px;
        }

        h1 {
          max-width: 760px;
          margin: 18px 0 14px;
          font-size: clamp(42px, 6vw, 76px);
          line-height: .96;
          letter-spacing: -.07em;
        }

        .hero p {
          max-width: 620px;
          margin: 0;
          color: #cbd5e1;
          font-size: 20px;
          line-height: 1.55;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .hero-visual {
          min-height: 410px;
          border-radius: 42px;
          background:
            linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.04)),
            radial-gradient(circle at 30% 20%, rgba(34,197,94,.25), transparent 35%);
          border: 1px solid rgba(255,255,255,.12);
          position: relative;
          overflow: hidden;
          box-shadow: 0 30px 90px rgba(0,0,0,.35);
        }

        .truck-shape {
          width: 86%;
          height: 190px;
          position: absolute;
          left: 7%;
          bottom: 98px;
        }

        .truck-cabin,
        .truck-body {
          position: absolute;
          bottom: 38px;
          background: linear-gradient(180deg, #f8fafc, #94a3b8);
          border: 2px solid rgba(255,255,255,.45);
        }

        .truck-cabin {
          right: 0;
          width: 34%;
          height: 120px;
          border-radius: 26px 28px 12px 10px;
          transform: skewX(-5deg);
        }

        .truck-body {
          left: 0;
          width: 68%;
          height: 132px;
          border-radius: 18px 12px 10px 18px;
        }

        .truck-body:after {
          content: "";
          position: absolute;
          inset: 18px;
          border-radius: 12px;
          background: rgba(15,23,42,.35);
          border: 1px solid rgba(255,255,255,.22);
        }

        .wheel {
          position: absolute;
          bottom: 0;
          width: 58px;
          height: 58px;
          border-radius: 999px;
          background: radial-gradient(circle, #94a3b8 0 22%, #020617 24% 100%);
          border: 6px solid #111827;
        }

        .wheel-a { left: 12%; }
        .wheel-b { left: 50%; }
        .wheel-c { right: 9%; }

        .road {
          position: absolute;
          left: -10%;
          right: -10%;
          bottom: 68px;
          height: 44px;
          background: linear-gradient(90deg, transparent, rgba(34,197,94,.58), transparent);
          transform: rotate(-2deg);
          filter: blur(.2px);
        }

        .quick-filter {
          width: min(1180px, calc(100vw - 32px));
          margin: 0 auto 46px;
          padding: 14px;
          border-radius: 24px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.11);
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 10px;
        }

        .quick-filter select,
        .quick-filter input,
        .quick-filter button {
          min-height: 52px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,.12);
          background: rgba(2,6,23,.66);
          color: white;
          padding: 0 14px;
          font-size: 15px;
          font-weight: 800;
          outline: none;
          min-width: 0;
        }

        .quick-filter input::placeholder {
          color: #94a3b8;
        }

        .quick-filter button {
          background: #22c55e;
          color: #052e16;
          border-color: transparent;
          cursor: pointer;
          padding: 0 22px;
        }

        .section-head {
          width: min(1180px, calc(100vw - 32px));
          margin: 0 auto 18px;
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
        }

        .section-head h2,
        .sell-box h2 {
          margin: 12px 0 0;
          font-size: clamp(28px, 4vw, 46px);
          line-height: 1.05;
          letter-spacing: -.04em;
        }

        .section-head a {
          color: #86efac;
          text-decoration: none;
          font-weight: 950;
          white-space: nowrap;
        }

        .truck-grid {
          width: min(1180px, calc(100vw - 32px));
          margin: 0 auto 34px;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 16px;
        }

        .truck-card {
          border-radius: 26px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.10);
          overflow: hidden;
          min-width: 0;
        }

        .photo {
          height: 210px;
          display: block;
          background: rgba(15,23,42,.92);
          overflow: hidden;
          text-decoration: none;
          color: #94a3b8;
        }

        .photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform .25s ease;
        }

        .truck-card:hover .photo img {
          transform: scale(1.04);
        }

        .photo span {
          height: 100%;
          display: grid;
          place-items: center;
          font-weight: 900;
        }

        .card-content {
          padding: 16px;
        }

        .truck-title {
          min-height: 48px;
          display: block;
          color: white;
          text-decoration: none;
          font-size: 18px;
          line-height: 1.25;
          font-weight: 950;
          overflow-wrap: anywhere;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 12px 0;
        }

        .tags span {
          padding: 6px 8px;
          border-radius: 999px;
          background: rgba(255,255,255,.08);
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 850;
        }

        .price {
          display: block;
          color: #86efac;
          font-size: 22px;
          line-height: 1.1;
          margin-bottom: 6px;
        }

        .city {
          display: block;
          color: #94a3b8;
          font-size: 13px;
          margin-bottom: 14px;
        }

        .whats {
          min-height: 46px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #052e16;
          background: #22c55e;
          text-decoration: none;
          font-weight: 950;
          padding: 0 12px;
        }

        .whats.secondary {
          color: white;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
        }

        .empty {
          grid-column: 1 / -1;
          padding: 34px;
          border-radius: 26px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.10);
        }

        .empty h3 {
          margin: 0 0 8px;
          font-size: 26px;
        }

        .empty p {
          margin: 0;
          color: #cbd5e1;
        }

        .sell-box {
          width: min(1180px, calc(100vw - 32px));
          margin: 0 auto 34px;
          padding: 30px;
          border-radius: 34px;
          background: rgba(34,197,94,.10);
          border: 1px solid rgba(34,197,94,.22);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .sell-box p {
          margin: 10px 0 0;
          color: #cbd5e1;
          font-size: 18px;
        }

        .footer {
          width: min(1180px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 24px 0 36px;
          border-top: 1px solid rgba(255,255,255,.10);
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer strong {
          color: white;
        }

        .footer div {
          display: flex;
          gap: 14px;
        }

        .footer a {
          color: #cbd5e1;
          text-decoration: none;
          font-weight: 800;
        }

        @media (max-width: 980px) {
          .hero {
            grid-template-columns: 1fr;
            min-height: auto;
            gap: 18px;
          }

          .hero-copy {
            padding: 22px 0 0;
          }

          .hero-visual {
            min-height: 320px;
            border-radius: 30px;
          }

          .quick-filter {
            grid-template-columns: 1fr 1fr;
          }

          .quick-filter button {
            grid-column: 1 / -1;
          }

          .truck-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .topbar {
            width: calc(100vw - 24px);
            height: auto;
            padding: 10px 0;
            align-items: stretch;
          }

          .brand {
            gap: 8px;
          }

          .brand-mark {
            width: 38px;
            height: 38px;
            border-radius: 13px;
          }

          .brand strong {
            font-size: 13px;
          }

          .brand small {
            font-size: 12px;
          }

          .top-actions {
            gap: 8px;
          }

          .top-actions .btn {
            min-height: 40px;
            padding: 0 12px;
            border-radius: 13px;
            font-size: 13px;
          }

          .hero {
            width: calc(100vw - 24px);
            margin-top: 18px;
          }

          h1 {
            font-size: 42px;
            letter-spacing: -.06em;
          }

          .hero p {
            font-size: 16px;
          }

          .hero-actions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .hero-actions .btn {
            width: 100%;
          }

          .hero-visual {
            min-height: 250px;
          }

          .truck-shape {
            width: 94%;
            left: 3%;
            height: 150px;
            bottom: 70px;
          }

          .truck-cabin {
            height: 92px;
          }

          .truck-body {
            height: 100px;
          }

          .wheel {
            width: 42px;
            height: 42px;
            border-width: 5px;
          }

          .road {
            bottom: 48px;
          }

          .quick-filter {
            width: calc(100vw - 24px);
            grid-template-columns: 1fr;
            margin-bottom: 34px;
            padding: 12px;
            border-radius: 20px;
          }

          .section-head {
            width: calc(100vw - 24px);
            align-items: start;
          }

          .section-head h2 {
            font-size: 32px;
          }

          .truck-grid {
            width: calc(100vw - 24px);
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .photo {
            height: 255px;
          }

          .truck-title {
            min-height: auto;
            font-size: 21px;
          }

          .price {
            font-size: 26px;
          }

          .whats {
            min-height: 52px;
          }

          .sell-box {
            width: calc(100vw - 24px);
            padding: 22px;
            border-radius: 26px;
            display: grid;
          }

          .sell-box .btn {
            width: 100%;
          }

          .footer {
            width: calc(100vw - 24px);
            display: grid;
            gap: 12px;
          }
        }
      `}</style>
    </main>
  );
}
