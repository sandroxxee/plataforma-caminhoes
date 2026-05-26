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
    .limit(6);

  const trucks = (data || []) as Truck[];

  return (
    <main className="home-page">
      <PublicHeader />

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <h1>Caminhões usados à venda</h1>
            <p>Compra e venda de caminhões com contato direto pelo WhatsApp.</p>

            <form className="search-box" action="/anuncios">
              <input name="modelo" placeholder="Buscar caminhão, marca ou modelo" aria-label="Buscar caminhão" />
              <button type="submit">Buscar</button>
            </form>
          </div>

          <div className="hero-side">
            <strong>Atendimento direto</strong>
            <span>Veja anúncios disponíveis, confira os dados principais e chame pelo WhatsApp.</span>
          </div>
        </div>
      </section>

      <section className="choice-section">
        <div className="choice-inner">
          <div className="choice-head">
            <h2>Comprar ou vender caminhão</h2>
            <p>Escolha uma opção e avance direto para os anúncios ou atendimento.</p>
          </div>

          <div className="choice-grid">
            <Link href="/anuncios" className="choice-card">
              <span>Comprar</span>
              <strong>Ver caminhões anunciados</strong>
              <em>Ver anúncios →</em>
            </Link>

            <Link href="/anunciar" className="choice-card sell">
              <span>Vender</span>
              <strong>Anunciar meu caminhão</strong>
              <em>Anunciar agora →</em>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-head">
        <div>
          <h2>Anúncios em destaque</h2>
          <p>Caminhões disponíveis com foto, valor, cidade e contato direto.</p>
        </div>
        <Link href="/anuncios">Ver todos os anúncios</Link>
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
                    <span>{truck.carroceria || "Tipo"}</span>
                  </div>

                  <strong className="price">{formatMoney(truck.preco)}</strong>

                  <small className="city">
                    {truck.cidade || "Cidade"}{truck.estado ? `/${truck.estado}` : ""}
                  </small>

                  <div className="card-actions">
                    <Link href={`/anuncios/${truck.id}`} className="details">Detalhes</Link>
                    {truck.whatsapp && (
                      <a href={getWhatsappLink(truck)} target="_blank" rel="noreferrer" className="whats">
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
          <h2>Quer anunciar seu caminhão?</h2>
          <p>Envie marca, modelo, ano, valor, cidade, fotos e informe se aceita troca.</p>
        </div>
        <Link href="/anunciar" className="btn-primary">Anunciar pelo WhatsApp</Link>
      </section>

      <SiteFooter />

      <style>{`
        .home-page {
          min-height: 100vh;
          background: #f4f5f7;
          color: #151515;
          overflow-x: hidden;
        }

        .hero {
          background: #ffffff;
          border-bottom: 1px solid #e2e6ec;
        }

        .hero-inner {
          width: min(1180px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 46px 0 34px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 28px;
          align-items: center;
        }

        .hero-copy h1 {
          margin: 0;
          max-width: 680px;
          font-size: clamp(34px, 4vw, 54px);
          line-height: 1.04;
          letter-spacing: -.045em;
          color: #151515;
        }

        .hero-copy p {
          max-width: 620px;
          margin: 12px 0 0;
          color: #69717d;
          font-size: 18px;
          line-height: 1.55;
        }

        .search-box {
          max-width: 720px;
          margin-top: 24px;
          padding: 8px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          background: #f4f5f7;
          border: 1px solid #e2e6ec;
          border-radius: 18px;
        }

        .search-box input {
          width: 100%;
          min-height: 50px;
          border: 0;
          outline: 0;
          background: white;
          color: #20252c;
          border-radius: 13px;
          padding: 0 15px;
          font-size: 15px;
        }

        .search-box button,
        .btn-primary {
          min-height: 50px;
          padding: 0 20px;
          border: 0;
          border-radius: 13px;
          background: #20252c;
          color: white;
          font-weight: 900;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }

        .hero-side {
          padding: 24px;
          min-height: 150px;
          border-radius: 24px;
          background: linear-gradient(135deg, #20252c, #333b46);
          color: white;
          box-shadow: 0 16px 34px rgba(32,37,44,.16);
        }

        .hero-side strong {
          display: block;
          font-size: 22px;
          letter-spacing: -.04em;
          margin-bottom: 8px;
        }

        .hero-side span {
          display: block;
          color: rgba(255,255,255,.76);
          font-size: 15px;
          line-height: 1.5;
        }

        .choice-section {
          padding: 26px 0;
        }

        .choice-inner {
          width: min(1180px, calc(100vw - 32px));
          margin: 0 auto;
          background: white;
          border: 1px solid #e2e6ec;
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 12px 28px rgba(16,24,40,.05);
        }

        .choice-head {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: end;
          margin-bottom: 16px;
        }

        .choice-head h2 {
          margin: 0;
          color: #151515;
          font-size: clamp(24px, 3vw, 34px);
          letter-spacing: -.04em;
        }

        .choice-head p {
          margin: 0;
          color: #69717d;
          max-width: 440px;
        }

        .choice-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .choice-card {
          min-height: 155px;
          padding: 22px;
          border-radius: 20px;
          background: #f8fafc;
          border: 1px solid #e2e6ec;
          text-decoration: none;
          color: #20252c;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: .2s ease;
        }

        .choice-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 32px rgba(16,24,40,.08);
        }

        .choice-card span {
          width: max-content;
          min-height: 32px;
          padding: 0 12px;
          border-radius: 999px;
          background: #20252c;
          color: white;
          display: inline-flex;
          align-items: center;
          font-size: 13px;
          font-weight: 900;
        }

        .choice-card.sell span {
          background: #1faa59;
        }

        .choice-card strong {
          display: block;
          margin-top: 16px;
          font-size: 24px;
          letter-spacing: -.04em;
        }

        .choice-card em {
          color: #69717d;
          font-style: normal;
          font-weight: 900;
        }

        .section-head {
          width: min(1180px, calc(100vw - 32px));
          margin: 20px auto 18px;
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
        }

        .section-head h2 {
          margin: 0;
          color: #151515;
          font-size: clamp(28px, 4vw, 42px);
          letter-spacing: -.05em;
        }

        .section-head p {
          margin: 6px 0 0;
          color: #69717d;
        }

        .section-head a {
          min-height: 42px;
          padding: 0 15px;
          border-radius: 999px;
          color: #20252c;
          background: white;
          border: 1px solid #e2e6ec;
          text-decoration: none;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
        }

        .truck-grid {
          width: min(1180px, calc(100vw - 32px));
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .truck-card {
          background: white;
          border: 1px solid #e2e6ec;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 12px 28px rgba(16,24,40,.06);
        }

        .photo {
          position: relative;
          display: block;
          aspect-ratio: 1 / 1;
          background: #eef1f5;
          overflow: hidden;
          color: #69717d;
          text-decoration: none;
        }

        .photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .photo > span {
          height: 100%;
          display: grid;
          place-items: center;
          font-weight: 900;
        }

        .photo em {
          position: absolute;
          left: 12px;
          top: 12px;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,.94);
          color: #20252c;
          font-style: normal;
          font-size: 12px;
          font-weight: 900;
          box-shadow: 0 8px 18px rgba(0,0,0,.12);
        }

        .card-content {
          padding: 16px;
        }

        .truck-title {
          color: #151515;
          text-decoration: none;
          font-size: 21px;
          line-height: 1.15;
          letter-spacing: -.04em;
          font-weight: 950;
          display: block;
        }

        .tags {
          margin: 10px 0 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .tags span {
          min-height: 29px;
          padding: 0 9px;
          border-radius: 999px;
          background: #f1f3f6;
          color: #485260;
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          font-weight: 800;
        }

        .price {
          color: #20252c;
          font-size: 20px;
          display: block;
          margin-bottom: 2px;
        }

        .city {
          color: #69717d;
          font-size: 13px;
          font-weight: 800;
        }

        .card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          border-top: 1px solid #e2e6ec;
          margin-top: 14px;
          padding-top: 14px;
        }

        .details,
        .whats {
          min-height: 40px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-weight: 900;
          font-size: 13px;
        }

        .details {
          color: #20252c;
          background: #f4f5f7;
          border: 1px solid #e2e6ec;
        }

        .whats {
          color: white;
          background: #1faa59;
        }

        .empty {
          grid-column: 1 / -1;
          background: white;
          border: 1px solid #e2e6ec;
          border-radius: 22px;
          padding: 28px;
          color: #20252c;
        }

        .empty h3 {
          margin: 0 0 6px;
        }

        .empty p {
          margin: 0;
          color: #69717d;
        }

        .sell-box {
          width: min(1180px, calc(100vw - 32px));
          margin: 28px auto 42px;
          padding: 30px;
          border-radius: 26px;
          background: #20252c;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          box-shadow: 0 18px 38px rgba(32,37,44,.16);
        }

        .sell-box h2 {
          margin: 0;
          font-size: clamp(26px, 4vw, 38px);
          letter-spacing: -.05em;
        }

        .sell-box p {
          max-width: 680px;
          margin: 8px 0 0;
          color: rgba(255,255,255,.74);
          font-size: 16px;
          line-height: 1.5;
        }

        .sell-box .btn-primary {
          background: #1faa59;
        }

        @media (max-width: 900px) {
          .hero-inner {
            grid-template-columns: 1fr;
          }

          .hero-side {
            min-height: auto;
          }

          .truck-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .hero-inner,
          .choice-inner,
          .section-head,
          .truck-grid,
          .sell-box {
            width: calc(100vw - 22px);
          }

          .hero-inner {
            padding: 30px 0 24px;
          }

          .hero-copy h1 {
            font-size: 34px;
          }

          .hero-copy p {
            font-size: 16px;
          }

          .search-box {
            grid-template-columns: 1fr;
          }

          .choice-head,
          .section-head,
          .sell-box {
            display: block;
          }

          .choice-grid,
          .truck-grid {
            grid-template-columns: 1fr;
          }

          .section-head a,
          .sell-box .btn-primary {
            margin-top: 14px;
          }
        }
      `}</style>
    </main>
  );
}
