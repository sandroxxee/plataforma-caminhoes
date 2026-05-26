import Link from "next/link";
import { PublicHeader } from "@/components/PublicHeader";
import { createClient } from "@/lib/supabase/server";
import { SiteFooter } from "@/components/SiteFooter";

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
  const images = [...(truck.truck_images || [])]
    .filter((img) => img.image_url)
    .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  return images.find((img) => img.principal)?.image_url || images[0]?.image_url || "";
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
    .eq("vendido", false)
    .order("created_at", { ascending: false })
    .limit(5);

  const trucks = (data || []) as Truck[];
  const featured = trucks[0];
  const featuredImage = featured ? getImage(featured) : "";

  return (
    <main className="home-page">
      <PublicHeader />

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">CAMINHÕES USADOS</span>
          <h1>Compre, venda ou troque caminhões com mais segurança.</h1>
          <p>
            Uma plataforma direta para encontrar caminhões reais, divulgar veículos e falar pelo WhatsApp com quem quer negociar.
          </p>

          <div className="hero-actions">
            <Link href="/anuncios" className="btn big primary">Comprar caminhão</Link>
            <Link href="/anunciar" className="btn big ghost">Vender ou trocar</Link>
          </div>

          <div className="audience-row" aria-label="Opções da plataforma">
            <Link href="/anuncios">Para comprar</Link>
            <Link href="/anunciar">Para vender ou trocar</Link>
            <Link href="/como-funciona">Para lojistas</Link>
          </div>
        </div>

        <Link href={featured ? `/anuncios/${featured.id}` : "/anuncios"} className="hero-card">
          {featuredImage ? (
            <img src={featuredImage} alt={featured ? getTitle(featured) : "Caminhão em destaque"} />
          ) : (
            <div className="hero-empty">Caminhões à Venda</div>
          )}

          <div className="hero-card-info">
            <span>Anúncio em destaque</span>
            <strong>{featured ? getTitle(featured) : "Confira os caminhões disponíveis"}</strong>
            {featured && <em>{formatMoney(featured.preco)}</em>}
          </div>
        </Link>
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

        <button type="submit">Buscar</button>
      </form>

      <section className="trust-panel">
        <article>
          <strong>Compra</strong>
          <p>Veja anúncios aprovados, fotos, valor, cidade e detalhes antes de chamar no WhatsApp.</p>
        </article>
        <article>
          <strong>Venda ou troca</strong>
          <p>Envie seu caminhão para avaliação e aprovação antes de aparecer publicamente.</p>
        </article>
        <article>
          <strong>Estoque de lojistas</strong>
          <p>Divulgue veículos para um público que já procura caminhões e implementos.</p>
        </article>
      </section>

      <section className="section-head">
        <div>
          <span className="eyebrow small">Estoque atualizado</span>
          <h2>Caminhões disponíveis para negociação</h2>
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
                  <em>Disponível</em>
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

                  <small className="price-label">Valor anunciado</small>
                  <strong className="price">{formatMoney(truck.preco)}</strong>

                  <small className="city">
                    {truck.cidade || "Cidade"}{truck.estado ? `/${truck.estado}` : ""}
                  </small>

                  <div className="card-actions">
                    <Link href={`/anuncios/${truck.id}`} className="details">Ver detalhes</Link>
                    {truck.whatsapp && (
                      <a href={getWhatsappLink(truck)} target="_blank" className="whats">
                        WhatsApp
                      </a>
                    )}
                  </div>
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
          <span className="eyebrow small">Anuncie com foco em venda</span>
          <h2>Tem caminhão, troca ou estoque para divulgar?</h2>
          <p>Cadastre o veículo, envie as fotos e receba contatos de compradores interessados pelo WhatsApp.</p>
        </div>
        <Link href="/anunciar" className="btn primary big">Começar anúncio</Link>
      </section>

      <SiteFooter />

      <style>{`
        .home-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 18% 6%, rgba(34,197,94,.13), transparent 28%),
            radial-gradient(circle at 82% 18%, rgba(148,163,184,.13), transparent 28%),
            linear-gradient(135deg, #020617 0%, #08111f 50%, #020617 100%);
          color: white;
          overflow-x: hidden;
        }

        .btn {
          min-height: 44px;
          padding: 0 17px;
          border-radius: 15px;
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
          min-height: 52px;
          padding: 0 22px;
          border-radius: 17px;
        }

        .hero {
          width: min(1240px, calc(100vw - 32px));
          min-height: 500px;
          margin: 0 auto 20px;
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(360px, .98fr);
          gap: 48px;
          align-items: center;
        }

        .hero-copy {
          padding: 38px 0 20px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          min-height: 32px;
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
          min-height: 29px;
          font-size: 11px;
        }

        h1 {
          max-width: 760px;
          margin: 18px 0 14px;
          font-size: clamp(42px, 5vw, 70px);
          line-height: .96;
          letter-spacing: -.07em;
        }

        .hero p {
          max-width: 620px;
          margin: 0;
          color: #dbeafe;
          font-size: 18px;
          line-height: 1.55;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .audience-row {
          margin-top: 22px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .audience-row a {
          min-height: 38px;
          padding: 0 13px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          color: #cbd5e1;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.10);
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
        }

        .audience-row a:hover {
          color: white;
          border-color: rgba(34,197,94,.30);
        }

        .hero-card {
          min-height: 360px;
          border-radius: 34px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
          position: relative;
          overflow: hidden;
          display: block;
          text-decoration: none;
          color: white;
          box-shadow: 0 30px 90px rgba(0,0,0,.30);
        }

        .hero-card img {
          width: 100%;
          height: 100%;
          min-height: 360px;
          object-fit: cover;
          display: block;
        }

        .hero-card:after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(2,6,23,.86));
        }

        .hero-empty {
          min-height: 360px;
          display: grid;
          place-items: center;
          color: #86efac;
          font-size: 34px;
          font-weight: 950;
          background: rgba(34,197,94,.08);
        }

        .hero-card-info {
          position: absolute;
          left: 20px;
          right: 20px;
          bottom: 20px;
          z-index: 2;
          display: grid;
          gap: 6px;
        }

        .hero-card-info span {
          color: #86efac;
          font-size: 12px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: .06em;
        }

        .hero-card-info strong {
          font-size: 24px;
          line-height: 1.15;
          overflow-wrap: anywhere;
        }

        .hero-card-info em {
          color: #bbf7d0;
          font-style: normal;
          font-size: 22px;
          font-weight: 950;
        }

        .quick-filter {
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto 18px;
          padding: 12px;
          border-radius: 22px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.11);
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
          gap: 10px;
        }

        .quick-filter select,
        .quick-filter input,
        .quick-filter button {
          min-height: 50px;
          border-radius: 15px;
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
          padding: 0 24px;
        }

        .trust-panel {
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto 38px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .trust-panel article {
          padding: 18px;
          border-radius: 22px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.10);
        }

        .trust-panel strong {
          display: block;
          margin-bottom: 7px;
          color: #f8fafc;
          font-size: 18px;
        }

        .trust-panel p {
          margin: 0;
          color: #cbd5e1;
          line-height: 1.45;
          font-size: 14px;
        }

        .section-head {
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto 18px;
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
        }

        .section-head h2,
        .sell-box h2 {
          margin: 12px 0 0;
          font-size: clamp(30px, 4vw, 46px);
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
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto 34px;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 16px;
        }

        .truck-card {
          border-radius: 24px;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.10);
          overflow: hidden;
          min-width: 0;
          transition: transform .2s ease, border-color .2s ease;
        }

        .truck-card:hover {
          transform: translateY(-3px);
          border-color: rgba(34,197,94,.28);
        }

        .photo {
          height: 190px;
          display: block;
          background: rgba(15,23,42,.92);
          overflow: hidden;
          text-decoration: none;
          color: #94a3b8;
          position: relative;
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

        .photo em {
          position: absolute;
          left: 10px;
          top: 10px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(34,197,94,.94);
          color: #052e16;
          font-style: normal;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
        }

        .card-content {
          padding: 14px;
        }

        .truck-title {
          min-height: 46px;
          display: block;
          color: white;
          text-decoration: none;
          font-size: 17px;
          line-height: 1.22;
          font-weight: 950;
          overflow-wrap: anywhere;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 11px 0;
        }

        .tags span {
          padding: 6px 8px;
          border-radius: 999px;
          background: rgba(255,255,255,.08);
          color: #cbd5e1;
          font-size: 12px;
          font-weight: 850;
        }

        .price-label {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 4px;
        }

        .price {
          display: block;
          color: #86efac;
          font-size: 23px;
          line-height: 1.1;
          margin-bottom: 6px;
        }

        .city {
          display: block;
          color: #94a3b8;
          font-size: 13px;
          margin-bottom: 13px;
        }

        .card-actions {
          display: grid;
          grid-template-columns: .95fr 1.05fr;
          gap: 8px;
        }

        .details,
        .whats {
          min-height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          text-decoration: none;
          font-weight: 950;
          padding: 0 10px;
          font-size: 13px;
        }

        .details {
          color: white;
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.12);
        }

        .whats {
          color: #052e16;
          background: #22c55e;
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
          width: min(1240px, calc(100vw - 32px));
          margin: 0 auto 34px;
          padding: 30px;
          border-radius: 32px;
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

        @media (max-width: 1100px) {
          .truck-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 900px) {
          .hero {
            grid-template-columns: 1fr;
            min-height: auto;
            gap: 18px;
            margin-top: 18px;
          }

          .hero-copy {
            padding: 22px 0 0;
          }

          .hero-card {
            min-height: 300px;
          }

          .hero-card img,
          .hero-empty {
            min-height: 300px;
          }

          .quick-filter {
            grid-template-columns: 1fr 1fr;
          }

          .quick-filter button {
            grid-column: 1 / -1;
          }

          .trust-panel {
            grid-template-columns: 1fr;
          }

          .truck-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .hero {
            width: calc(100vw - 24px);
          }

          h1 {
            font-size: 36px;
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

          .audience-row {
            display: grid;
            grid-template-columns: 1fr;
          }

          .audience-row a {
            justify-content: center;
          }

          .hero-card {
            min-height: 245px;
            border-radius: 26px;
          }

          .hero-card img,
          .hero-empty {
            min-height: 245px;
          }

          .hero-card-info strong {
            font-size: 20px;
          }

          .quick-filter,
          .trust-panel {
            width: calc(100vw - 24px);
          }

          .quick-filter {
            grid-template-columns: 1fr;
            margin-bottom: 18px;
            padding: 12px;
            border-radius: 20px;
          }

          .section-head {
            width: calc(100vw - 24px);
            align-items: start;
          }

          .section-head h2 {
            font-size: 31px;
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
            font-size: 27px;
          }

          .card-actions {
            grid-template-columns: 1fr 1fr;
          }

          .details,
          .whats {
            min-height: 50px;
            font-size: 14px;
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
        }
      `}</style>
    </main>
  );
}
