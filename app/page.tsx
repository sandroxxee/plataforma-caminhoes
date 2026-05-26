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
  const featuredTruck = trucks[0];
  const featuredTitle = featuredTruck ? getTitle(featuredTruck) : "Caminhão em destaque";
  const featuredImage = featuredTruck ? getImage(featuredTruck) : "";

  return (
    <main className="home-page" id="inicio">
      <PublicHeader />

      <section className="hero-white">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Compra · venda · troca · atendimento direto</span>
            <h1>Caminhões selecionados para compra, venda e troca</h1>
            <p>
              Anúncios organizados, atendimento direto e oportunidades reais para quem vive do transporte.
            </p>

            <div className="hero-actions">
              <Link className="btn btn-dark" href="/anuncios">Ver caminhões</Link>
              <Link className="btn btn-light" href="/anunciar">Anunciar caminhão</Link>
            </div>
          </div>

          <aside className="featured-card" aria-label="Caminhão em destaque">
            <Link href={featuredTruck ? `/anuncios/${featuredTruck.id}` : "/anuncios"} className="featured-photo">
              {featuredImage ? <img src={featuredImage} alt={featuredTitle} /> : <span>Imagem do caminhão</span>}
            </Link>
            <div className="featured-body">
              <div className="featured-topline">
                <span>Destaque</span>
                <strong>{featuredTruck ? formatMoney(featuredTruck.preco) : "Sob consulta"}</strong>
              </div>
              <h2>{featuredTitle}</h2>
              <div className="featured-specs">
                <small>{featuredTruck?.ano_modelo || featuredTruck?.ano_fabricacao || "Ano"}</small>
                <small>{featuredTruck?.tracao || "Tração"}</small>
                <small>{featuredTruck?.cidade || "Cidade"}{featuredTruck?.estado ? ` - ${featuredTruck.estado}` : ""}</small>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="quick-section">
        <div className="wrap quick-grid">
          <Link className="quick-card dark" href="/anuncios">
            <div>
              <h3>Comprar caminhão</h3>
              <p>Veja opções disponíveis com dados claros e contato direto.</p>
            </div>
            <span>→</span>
          </Link>

          <Link className="quick-card light" href="/anunciar">
            <div>
              <h3>Vender ou trocar</h3>
              <p>Envie as informações para organizar o anúncio do caminhão.</p>
            </div>
            <span>→</span>
          </Link>

          <a className="quick-card green" href="#contato">
            <div>
              <h3>Atendimento WhatsApp</h3>
              <p>Fale sobre compra, venda, troca ou oportunidade disponível.</p>
            </div>
            <span>→</span>
          </a>
        </div>
      </section>

      <section className="wrap stock-section" id="comprar">
        <div className="section-head">
          <div>
            <span className="section-label">Estoque</span>
            <h2>Caminhões disponíveis</h2>
            <p>Use filtros simples para encontrar caminhões por marca, carroceria, tração ou região.</p>
          </div>
          <Link className="view-all" href="/anuncios">Ver todos</Link>
        </div>

        <form className="filter-panel" action="/anuncios" aria-label="Filtros de caminhões">
          <input name="busca" placeholder="Buscar caminhão, marca ou cidade" />
          <select name="marca" defaultValue="">
            <option value="">Marca</option>
            <option>Mercedes-Benz</option>
            <option>Scania</option>
            <option>Volvo</option>
            <option>Volkswagen</option>
            <option>Ford</option>
            <option>Iveco</option>
            <option>DAF</option>
          </select>
          <select name="carroceria" defaultValue="">
            <option value="">Carroceria</option>
            <option>Cavalo mecânico</option>
            <option>Truck</option>
            <option>Toco</option>
            <option>Caçamba</option>
            <option>Plataforma</option>
            <option>Implemento</option>
          </select>
          <select name="tracao" defaultValue="">
            <option value="">Tração</option>
            <option>4x2</option>
            <option>6x2</option>
            <option>6x4</option>
            <option>8x4</option>
          </select>
          <select name="estado" defaultValue="">
            <option value="">Cidade/UF</option>
            <option value="SC">Santa Catarina</option>
            <option value="PR">Paraná</option>
            <option value="RS">Rio Grande do Sul</option>
          </select>
        </form>

        <div className="truck-grid">
          {trucks.length > 0 ? (
            trucks.map((truck) => {
              const title = getTitle(truck);
              const image = getImage(truck);

              return (
                <article className="truck-card" key={truck.id}>
                  <Link href={`/anuncios/${truck.id}`} className="truck-photo">
                    <span className="badge">{truck.carroceria || "Caminhão"}</span>
                    {image ? <img src={image} alt={title} /> : <i>Sem foto</i>}
                  </Link>
                  <div className="card-body">
                    <Link className="truck-title" href={`/anuncios/${truck.id}`}>{title}</Link>
                    <div className="meta">
                      <span>{truck.ano_modelo || truck.ano_fabricacao || "Ano"}</span>
                      <span>{truck.tracao || "Tração"}</span>
                      <span>{truck.cidade || "Cidade"}{truck.estado ? ` - ${truck.estado}` : ""}</span>
                    </div>
                    <div className="card-footer">
                      <strong>{formatMoney(truck.preco)}</strong>
                      {truck.whatsapp ? (
                        <a className="whats-btn" href={getWhatsappLink(truck)} target="_blank" rel="noreferrer" aria-label="Chamar no WhatsApp">W</a>
                      ) : (
                        <Link className="details-btn" href={`/anuncios/${truck.id}`}>Ver</Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty-state">
              <h3>Nenhum caminhão aprovado ainda.</h3>
              <p>Assim que os anúncios forem aprovados, eles aparecem aqui automaticamente.</p>
            </div>
          )}
        </div>
      </section>

      <section className="wrap sell-box" id="vender">
        <div>
          <span className="section-label">Para vendedores</span>
          <h2>Quer vender seu caminhão?</h2>
          <p>Envie os dados, fotos, cidade, valor e condições. O anúncio fica mais claro para compradores interessados.</p>
        </div>
        <Link className="btn btn-green" href="/anunciar">Anunciar pelo WhatsApp</Link>
      </section>

      <section className="wrap how-section" id="como-funciona">
        <div className="section-head">
          <div>
            <span className="section-label">Processo</span>
            <h2>Como funciona</h2>
            <p>Um fluxo simples para comprar, vender ou trocar caminhões sem complicar.</p>
          </div>
        </div>

        <div className="how-grid">
          <div className="how-card">
            <b>1</b>
            <h3>Compra simples</h3>
            <p>O comprador vê os anúncios, confere os dados principais e chama direto no WhatsApp.</p>
          </div>
          <div className="how-card">
            <b>2</b>
            <h3>Venda organizada</h3>
            <p>O vendedor envia as informações e o caminhão aparece com foto, valor, cidade e detalhes.</p>
          </div>
          <div className="how-card">
            <b>3</b>
            <h3>Contato direto</h3>
            <p>A negociação segue pelo atendimento, com foco em caminhões reais e oportunidades claras.</p>
          </div>
        </div>
      </section>

      <section className="wrap contact-section" id="contato">
        <div>
          <span className="section-label">Atendimento</span>
          <h2>Fale pelo WhatsApp</h2>
          <p>Consulte caminhões disponíveis, envie proposta ou solicite a divulgação do seu caminhão.</p>
        </div>
        <a className="btn btn-green" href="https://wa.me/5549999999999" target="_blank" rel="noreferrer">Chamar no WhatsApp</a>
      </section>

      <SiteFooter />

      <style>{`
        :global(html) { scroll-behavior: smooth; }
        .home-page {
          --bg: #ffffff;
          --soft: #f6f7f9;
          --text: #171717;
          --muted: #626975;
          --line: #e5e7eb;
          --dark: #1f2933;
          --green: #19a75b;
          --yellow: #f5b521;
          --red: #c8242f;
          min-height: 100vh;
          color: var(--text);
          background: #fff;
          overflow-x: hidden;
        }
        .home-page a { text-decoration: none; }
        .wrap { width: min(1180px, calc(100vw - 32px)); margin: 0 auto; }

        .hero-white {
          padding: 58px 0 42px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at top left, rgba(245, 181, 33, 0.16), transparent 34%),
            radial-gradient(circle at top right, rgba(200, 36, 47, 0.08), transparent 32%),
            #fff;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.05fr .95fr;
          gap: 42px;
          align-items: center;
        }
        .eyebrow, .section-label {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          border-radius: 999px;
          background: #fff7df;
          color: #8a5a00;
          border: 1px solid #ffe3a1;
          font-size: 13px;
          font-weight: 900;
          padding: 8px 12px;
          margin-bottom: 16px;
        }
        .hero-copy h1 {
          max-width: 720px;
          font-size: clamp(38px, 5.6vw, 64px);
          line-height: 1.02;
          letter-spacing: -2px;
          color: var(--dark);
        }
        .hero-copy p {
          max-width: 610px;
          margin-top: 18px;
          color: var(--muted);
          font-size: 19px;
        }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          border-radius: 999px;
          padding: 0 18px;
          font-weight: 900;
          border: 1px solid transparent;
          transition: .2s ease;
          white-space: nowrap;
        }
        .btn:hover { transform: translateY(-1px); }
        .btn-dark { background: var(--dark); color: #fff; box-shadow: 0 14px 26px rgba(31,41,51,.18); }
        .btn-light { background: #fff; color: var(--dark); border-color: #d1d5db; }
        .btn-green { background: var(--green); color: #fff; box-shadow: 0 14px 28px rgba(25,167,91,.18); }

        .featured-card {
          overflow: hidden;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 28px;
          box-shadow: 0 14px 35px rgba(15,23,42,.08);
        }
        .featured-photo {
          display: grid;
          place-items: center;
          aspect-ratio: 4 / 3;
          background: var(--soft);
          color: var(--muted);
          font-weight: 800;
          overflow: hidden;
        }
        .featured-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .featured-body { padding: 20px; }
        .featured-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
        .featured-topline span { background: #ecfdf3; color: #087a3b; border-radius: 999px; padding: 7px 10px; font-size: 12px; font-weight: 900; }
        .featured-topline strong { color: var(--dark); font-size: 22px; }
        .featured-body h2 { color: var(--dark); font-size: 25px; letter-spacing: -.6px; }
        .featured-specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 14px; }
        .featured-specs small { background: var(--soft); color: var(--dark); border-radius: 13px; padding: 11px; font-weight: 800; text-align: center; }

        .quick-section { padding: 24px 0; border-bottom: 1px solid var(--line); }
        .quick-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .quick-card {
          min-height: 116px;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 16px 30px rgba(31,41,51,.10);
          transition: .2s ease;
        }
        .quick-card:hover { transform: translateY(-2px); }
        .quick-card h3 { font-size: 18px; margin-bottom: 5px; }
        .quick-card p { font-size: 14px; opacity: .78; }
        .quick-card.dark { background: var(--dark); color: #fff; }
        .quick-card.light { background: #fff; color: var(--dark); border: 1px solid var(--line); }
        .quick-card.green { background: var(--green); color: #fff; }
        .quick-card span { font-weight: 900; font-size: 22px; }

        .stock-section, .how-section { padding: 52px 0; }
        .section-head { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
        .section-head h2, .sell-box h2, .contact-section h2 { color: var(--dark); font-size: clamp(30px, 4vw, 42px); line-height: 1.08; letter-spacing: -1px; }
        .section-head p, .sell-box p, .contact-section p { color: var(--muted); max-width: 590px; margin-top: 8px; }
        .view-all { color: var(--dark); font-weight: 900; border: 1px solid #d1d5db; border-radius: 999px; padding: 10px 14px; background: #fff; }

        .filter-panel {
          display: grid;
          grid-template-columns: 1.5fr repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 22px;
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: var(--soft);
        }
        .filter-panel input, .filter-panel select {
          width: 100%;
          height: 46px;
          border: 1px solid #d7dbe2;
          border-radius: 13px;
          background: #fff;
          color: var(--dark);
          padding: 0 12px;
          font-size: 14px;
          outline: none;
        }

        .truck-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .truck-card {
          overflow: hidden;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 20px;
          box-shadow: 0 12px 26px rgba(15,23,42,.06);
          transition: .2s ease;
        }
        .truck-card:hover { transform: translateY(-3px); box-shadow: 0 18px 38px rgba(15,23,42,.10); }
        .truck-photo {
          position: relative;
          display: grid;
          place-items: center;
          aspect-ratio: 1 / 1;
          background: var(--soft);
          color: var(--muted);
          overflow: hidden;
        }
        .truck-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .truck-photo i { font-style: normal; font-weight: 800; }
        .badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
          background: rgba(255,255,255,.94);
          color: var(--dark);
          border-radius: 999px;
          padding: 7px 10px;
          font-size: 12px;
          font-weight: 900;
          box-shadow: 0 8px 18px rgba(0,0,0,.12);
        }
        .card-body { padding: 16px; }
        .truck-title { display: block; color: var(--dark); font-size: 20px; font-weight: 900; letter-spacing: -.4px; margin-bottom: 9px; }
        .meta { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
        .meta span { background: var(--soft); color: var(--muted); border-radius: 999px; padding: 6px 8px; font-size: 13px; font-weight: 700; }
        .card-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; border-top: 1px solid var(--line); padding-top: 14px; }
        .card-footer strong { color: var(--dark); font-size: 18px; }
        .whats-btn, .details-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: var(--green);
          color: #fff;
          font-weight: 900;
        }
        .details-btn { background: var(--dark); font-size: 12px; }
        .empty-state { grid-column: 1 / -1; background: var(--soft); border: 1px solid var(--line); border-radius: 18px; padding: 28px; color: var(--dark); }
        .empty-state p { color: var(--muted); margin-top: 6px; }

        .sell-box {
          margin-top: 18px;
          margin-bottom: 52px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 24px;
          border-radius: 28px;
          padding: 38px;
          color: #fff;
          background: linear-gradient(135deg, rgba(31,41,51,.98), rgba(31,41,51,.90));
          box-shadow: 0 24px 50px rgba(31,41,51,.18);
        }
        .sell-box .section-label { background: rgba(245,181,33,.18); color: #ffe08a; border-color: rgba(245,181,33,.35); }
        .sell-box h2 { color: #fff; }
        .sell-box p { color: rgba(255,255,255,.78); }

        .how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .how-card { background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 22px; }
        .how-card b { width: 42px; height: 42px; border-radius: 50%; background: var(--yellow); color: #332100; display: grid; place-items: center; margin-bottom: 16px; }
        .how-card h3 { color: var(--dark); font-size: 20px; margin-bottom: 8px; }
        .how-card p { color: var(--muted); font-size: 15px; }

        .contact-section {
          margin-bottom: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: var(--soft);
          padding: 28px;
        }

        @media (max-width: 920px) {
          .hero-grid, .sell-box { grid-template-columns: 1fr; }
          .quick-grid, .how-grid { grid-template-columns: 1fr; }
          .filter-panel { grid-template-columns: 1fr 1fr; }
          .truck-grid { grid-template-columns: repeat(2, 1fr); }
          .contact-section { align-items: flex-start; flex-direction: column; }
        }
        @media (max-width: 620px) {
          .wrap { width: min(100vw - 22px, 1180px); }
          .hero-white { padding: 34px 0 28px; }
          .hero-copy h1 { letter-spacing: -1.2px; }
          .hero-copy p { font-size: 16px; }
          .hero-actions { display: grid; grid-template-columns: 1fr; }
          .featured-specs, .filter-panel, .truck-grid { grid-template-columns: 1fr; }
          .section-head { display: block; }
          .view-all { display: inline-flex; margin-top: 14px; }
          .sell-box, .contact-section { padding: 24px; }
        }
      `}</style>
    </main>
  );
}
